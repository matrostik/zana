import { describe, expect, it } from "vitest";
import { createAgyBridge, type AgyRunner } from "./bridge.js";

interface SentMessage {
  jsonrpc: string;
  id?: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: { code: number; message: string };
}

class FakeChild {
  stdoutHandlers: Array<(chunk: string) => void> = [];
  closeHandlers: Array<(code?: unknown) => void> = [];
  errorHandlers: Array<(error?: unknown) => void> = [];
  killed = false;
  stdout = {
    on: (_event: string, cb: (chunk: string) => void): void => {
      this.stdoutHandlers.push(cb);
    },
  };
  stderr = { on: (_event: string, _cb: (chunk: string) => void): void => {} };
  on = (event: string, cb: (arg?: unknown) => void): void => {
    if (event === "close") this.closeHandlers.push(cb);
    if (event === "error") this.errorHandlers.push(cb);
  };
  kill = (_signal?: string): boolean => {
    this.killed = true;
    return true;
  };
  emitStdout(line: string): void {
    for (const handler of this.stdoutHandlers) handler(`${line}\n`);
  }
  emitClose(code: unknown = 0): void {
    for (const handler of this.closeHandlers) handler(code);
  }
}

const MODELS_STDOUT =
  "gemini-4-argon-medium\tGemini 4 Argon (Medium)\ngemini-3.8-flash-low\tGemini 3.8 Flash (Low)\n";

function setup(execImpl?: AgyRunner["exec"]) {
  const sent: SentMessage[] = [];
  const children: FakeChild[] = [];
  const spawned: Array<{ command: string; args: string[] }> = [];
  const runner: AgyRunner = {
    spawn: (command, args) => {
      const child = new FakeChild();
      children.push(child);
      spawned.push({ command, args });
      return child;
    },
    exec: execImpl ?? (async () => ({ stdout: MODELS_STDOUT, stderr: "" })),
  };
  const bridge = createAgyBridge({
    runner,
    write: (line) => {
      sent.push(JSON.parse(line));
    },
  });
  return { sent, children, spawned, bridge };
}

const flush = async (rounds = 5): Promise<void> => {
  for (let index = 0; index < rounds; index += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};

function request(id: number, method: string, params: unknown): string {
  return JSON.stringify({ jsonrpc: "2.0", id, method, params });
}

function resultFor(sent: SentMessage[], id: number): SentMessage | undefined {
  return sent.find((message) => message.id === id && message.result !== undefined);
}

function errorFor(sent: SentMessage[], id: number): SentMessage | undefined {
  return sent.find((message) => message.id === id && message.error !== undefined);
}

function deltasFor(sent: SentMessage[], threadId: string): any[] {
  return sent
    .filter(
      (message) =>
        message.method === "thread/delta" && message.params?.threadId === threadId,
    )
    .flatMap((message) => message.params.deltas);
}

const THREAD = {
  threadId: "thr-1",
  cwd: "D:\\work",
  options: {},
};

const TURN = {
  threadId: "thr-1",
  providerThreadId: "agy-thr-1",
  input: [{ type: "text", text: "say hi" }],
  clientRequestId: "client-1",
  options: {},
};

describe("antigravity bridge handshake", () => {
  it("answers initialize with protocol 2 and v3 grammar", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(
      request(1, "initialize", { protocolVersion: 2, client: { name: "t", version: "1" } }),
    );
    await flush();
    expect(resultFor(sent, 1)?.result).toMatchObject({
      protocolVersion: 2,
      capabilities: {
        fork: "none",
        grammarVersions: [3, 3],
        sessionRestore: false,
      },
    });
  });

  it("rejects unknown methods with METHOD_NOT_FOUND", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(request(1, "thread/archive", { threadId: "x", providerThreadId: "y" }));
    await flush();
    expect(errorFor(sent, 1)?.error?.code).toBe(-32601);
  });

  it("ignores blank and non-JSON lines", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine("   ");
    bridge.handleLine("Fetching available models...");
    await flush();
    expect(sent).toHaveLength(0);
  });
});

describe("antigravity bridge sessions", () => {
  it("starts a session and rejects empty turn input", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    expect(resultFor(sent, 1)?.result).toMatchObject({
      providerThreadId: "agy-thr-1",
      sessionRestorable: false,
    });
    bridge.handleLine(
      request(2, "turn/start", { ...TURN, input: [{ type: "text", text: "" }] }),
    );
    await flush();
    expect(errorFor(sent, 2)?.error?.code).toBe(-32602);
  });

  it("refuses thread/resume and unknown threads", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(
      request(1, "thread/resume", { ...THREAD, providerThreadId: "agy-thr-9" }),
    );
    await flush();
    expect(errorFor(sent, 1)?.error?.code).toBe(-32002);
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    expect(errorFor(sent, 2)).toBeDefined();
  });

  it("runs a turn to completion with streamed deltas", async () => {
    const { sent, children, spawned, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();

    expect(spawned).toHaveLength(1);
    expect(spawned[0]?.args).toContain("--output-format");
    expect(spawned[0]?.args).toContain("--print=say hi");
    // Accepted at spawn; the request resolves without waiting for the CLI.
    expect(resultFor(sent, 2)?.result).toMatchObject({ threadId: "thr-1" });

    const child = children[0]!;
    child.emitStdout('{"event":"init","conversation_id":"conv-9","init":{}}');
    child.emitStdout(
      '{"event":"step_update","step_update":{"step_index":1,"state":"ACTIVE","step_type":"agent_response","text_delta":"hello"}}',
    );
    await flush();
    const early = deltasFor(sent, "thr-1").map((delta) => delta.kind);
    expect(early).toContain("input.accepted");
    expect(early).toContain("turn.open");
    expect(early).toContain("item.textDelta");

    child.emitStdout(
      '{"event":"result","result":{"conversation_id":"conv-9","status":"SUCCESS","response":"hello","usage":{"input_tokens":10,"output_tokens":3,"thinking_tokens":1,"cache_read_tokens":0,"total_tokens":13}}}',
    );
    child.emitClose(0);
    await flush();

    const kinds = deltasFor(sent, "thr-1").map((delta) => delta.kind);
    expect(kinds).toContain("usage");
    expect(kinds).toContain("item.textClose");
    expect(kinds).toContain("turn.boundary");
    const usage = deltasFor(sent, "thr-1").find((delta) => delta.kind === "usage");
    expect(usage.last).toMatchObject({ inputTokens: 10, outputTokens: 3 });
    const boundary = deltasFor(sent, "thr-1").find(
      (delta) => delta.kind === "turn.boundary",
    );
    expect(boundary.status).toBe("completed");
  });

  it("settles a failed result as failed with a provider error", async () => {
    const { sent, children, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    children[0]!.emitStdout(
      '{"event":"result","result":{"conversation_id":"c","status":"ERROR","response":"boom","usage":{}}}',
    );
    children[0]!.emitClose(1);
    await flush();
    const kinds = deltasFor(sent, "thr-1").map((delta) => delta.kind);
    expect(kinds).toContain("provider.error");
    expect(
      deltasFor(sent, "thr-1").find((delta) => delta.kind === "turn.boundary").status,
    ).toBe("failed");
  });

  it("interrupts the active turn on thread/stop", async () => {
    const { sent, children, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    bridge.handleLine(
      request(3, "thread/stop", {
        threadId: "thr-1",
        providerThreadId: "agy-thr-1",
        intent: "interrupt",
        activeTurnId: "turn-1",
      }),
    );
    await flush();
    expect(children[0]?.killed).toBe(true);
    expect(resultFor(sent, 3)?.result).toMatchObject({ ok: true });
    children[0]!.emitClose(0);
    await flush();
    expect(
      deltasFor(sent, "thr-1").find((delta) => delta.kind === "turn.boundary").status,
    ).toBe("interrupted");
  });

  it("steers by interrupting and starting a queued turn", async () => {
    const { sent, children, spawned, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    bridge.handleLine(
      request(3, "turn/steer", {
        ...TURN,
        input: [{ type: "text", text: "actually do this" }],
        expectedTurnId: "turn-1",
      }),
    );
    await flush();
    expect(children[0]?.killed).toBe(true);
    expect(spawned).toHaveLength(2);
    expect(spawned[1]?.args).toContain("--print=actually do this");
    // The steered turn reuses the live conversation.
    expect(spawned[1]?.args).not.toContain("--conversation");
    expect(resultFor(sent, 3)?.result).toMatchObject({ threadId: "thr-1" });
  });

  it("rejects steer with no active turn", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(
      request(2, "turn/steer", { ...TURN, expectedTurnId: "turn-9" }),
    );
    await flush();
    expect(errorFor(sent, 2)?.error?.code).toBe(-32001);
  });

  it("reports missing executable with MISSING_EXECUTABLE", async () => {
    const { sent } = setup();
    const enoentRunner: AgyRunner = {
      spawn: () => {
        throw Object.assign(new Error("spawn agy ENOENT"), { code: "ENOENT" });
      },
      exec: async () => ({ stdout: "", stderr: "" }),
    };
    const sentLines: SentMessage[] = [];
    const bridge = createAgyBridge({
      runner: enoentRunner,
      write: (line) => {
        sentLines.push(JSON.parse(line));
      },
    });
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    expect(sentLines.find((m) => m.id === 2)?.error?.code).toBe(-32004);
    expect(sent).toHaveLength(0);
  });

  it("discards sessions", async () => {
    const { sent, children, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    bridge.handleLine(
      request(3, "thread/discard", { threadId: "thr-1", providerThreadId: "agy-thr-1" }),
    );
    await flush();
    expect(children[0]?.killed).toBe(true);
    expect(resultFor(sent, 3)?.result).toMatchObject({ ok: true });
  });

  it("omits --model for the default sentinel", async () => {
    const { sent, spawned, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(
      request(2, "turn/start", {
        ...TURN,
        options: { model: "default", reasoningLevel: "high" },
      }),
    );
    await flush();
    expect(resultFor(sent, 2)?.result).toMatchObject({ threadId: "thr-1" });
    expect(spawned[0]?.args).not.toContain("--model");
    expect(spawned[0]?.args).toContain("high");
  });

  it("rejects thread/start without a threadId", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", { cwd: "D:\\work" }));
    await flush();
    expect(errorFor(sent, 1)?.error?.code).toBe(-32602);
  });

  it("rejects a second turn while one is active", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    bridge.handleLine(request(3, "turn/start", TURN));
    await flush();
    expect(errorFor(sent, 3)?.error?.code).toBe(-32000);
  });

  it("prepends thread/start input to the first turn", async () => {
    const { spawned, bridge } = setup();
    bridge.handleLine(
      request(1, "thread/start", {
        ...THREAD,
        input: [{ type: "text", text: "context first" }],
      }),
    );
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    expect(spawned[0]?.args).toContain("--print=context first\n\nsay hi");
  });

  it("closes an unstreamed result with the final text", async () => {
    const { sent, children, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    children[0]!.emitStdout(
      '{"event":"result","result":{"conversation_id":"c","status":"SUCCESS","response":"late answer","usage":{}}}',
    );
    children[0]!.emitClose(0);
    await flush();
    const close = deltasFor(sent, "thr-1").find(
      (delta) => delta.kind === "item.textClose",
    );
    expect(close?.text).toBe("late answer");
  });

  it("fails the turn when the CLI exits without a result", async () => {
    const { sent, children, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    children[0]!.emitClose(1);
    await flush();
    const kinds = deltasFor(sent, "thr-1").map((delta) => delta.kind);
    expect(kinds).toContain("provider.error");
    expect(
      deltasFor(sent, "thr-1").find((delta) => delta.kind === "turn.boundary").status,
    ).toBe("failed");
  });

  it("fails the turn on a mid-turn spawn error", async () => {
    const { sent, children, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    children[0]!.errorHandlers[0]?.(
      Object.assign(new Error("connection reset"), { code: "ECONNRESET" }),
    );
    await flush();
    expect(
      deltasFor(sent, "thr-1").find((delta) => delta.kind === "turn.boundary").status,
    ).toBe("failed");
  });

  it("emits an auth recovery hint when credentials fail", async () => {
    const { sent, children, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(request(2, "turn/start", TURN));
    await flush();
    children[0]!.emitStdout(
      '{"event":"result","result":{"conversation_id":"c","status":"ERROR","response":"not logged in, run agy login","usage":{}}}',
    );
    children[0]!.emitClose(1);
    await flush();
    const recovery = sent.find(
      (message) => message.method === "provider/recovery",
    );
    expect(recovery?.params).toMatchObject({ kind: "authRequired" });
  });

  it("stops with release without killing an idle session", async () => {
    const { sent, children, bridge } = setup();
    bridge.handleLine(request(1, "thread/start", THREAD));
    await flush();
    bridge.handleLine(
      request(2, "thread/stop", {
        threadId: "thr-1",
        providerThreadId: "agy-thr-1",
        intent: "release",
        activeTurnId: null,
      }),
    );
    await flush();
    expect(children).toHaveLength(0);
    expect(resultFor(sent, 2)?.result).toMatchObject({ ok: true });
  });

  it("answers stop and discard for unknown threads", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(
      request(1, "thread/stop", {
        threadId: "missing",
        providerThreadId: "agy-missing",
        intent: "release",
        activeTurnId: null,
      }),
    );
    await flush();
    bridge.handleLine(
      request(2, "thread/discard", { threadId: "missing", providerThreadId: "agy-missing" }),
    );
    await flush();
    expect(resultFor(sent, 1)?.result).toMatchObject({ ok: true });
    expect(resultFor(sent, 2)?.result).toMatchObject({ ok: true });
  });

  it("ignores runtime notifications and responses", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(JSON.stringify({ jsonrpc: "2.0", method: "ping" }));
    bridge.handleLine(JSON.stringify({ jsonrpc: "2.0", id: 99, result: {} }));
    bridge.handleLine(JSON.stringify({ jsonrpc: "2.0", id: 100 }));
    await flush();
    expect(sent).toHaveLength(0);
  });
});

describe("antigravity bridge maintenance", () => {
  it("lists models from agy output", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(request(1, "model/list", { cwd: "D:\\work" }));
    await flush();
    const models = resultFor(sent, 1)?.result?.models;
    expect(models).toHaveLength(2);
    expect(models[0]).toMatchObject({
      id: "gemini-4-argon-medium",
      displayName: "Gemini 4 Argon (Medium)",
      isDefault: true,
    });
  });

  it("maps a missing executable to MISSING_EXECUTABLE", async () => {
    const sent: SentMessage[] = [];
    const bridge = createAgyBridge({
      runner: {
        spawn: () => {
          throw new Error("must not spawn");
        },
        exec: async () => {
          throw Object.assign(new Error("spawn agy ENOENT"), { code: "ENOENT" });
        },
      },
      write: (line) => {
        sent.push(JSON.parse(line));
      },
    });
    bridge.handleLine(request(1, "model/list", { cwd: "D:\\work" }));
    await flush();
    expect(sent.find((m) => m.id === 1)?.error?.code).toBe(-32004);
  });

  it("maps a broken CLI to a plain bridge error", async () => {
    const sent: SentMessage[] = [];
    const bridge = createAgyBridge({
      runner: {
        spawn: () => {
          throw new Error("must not spawn");
        },
        exec: async () => {
          throw new Error("agy exploded");
        },
      },
      write: (line) => {
        sent.push(JSON.parse(line));
      },
    });
    bridge.handleLine(request(1, "model/list", { cwd: "D:\\work" }));
    await flush();
    expect(sent.find((m) => m.id === 1)?.error?.code).toBe(-32000);
  });

  it("answers health and installation probes", async () => {
    const sent: SentMessage[] = [];
    const bridge = createAgyBridge({
      runner: {
        spawn: () => {
          throw new Error("must not spawn");
        },
        exec: async () => ({ stdout: MODELS_STDOUT, stderr: "" }),
      },
      resolveExecutable: async () => "C:\\agy\\agy.exe",
      readVersion: async () => "1.4.0",
      write: (line) => {
        sent.push(JSON.parse(line));
      },
    });
    bridge.handleLine(request(1, "provider/health", { providerId: "antigravity" }));
    await flush();
    expect(resultFor(sent, 1)?.result).toMatchObject({
      supported: true,
      health: { status: "ready", installedVersion: "1.4.0" },
    });
    bridge.handleLine(
      request(2, "provider/installation/status", { providerId: "antigravity" }),
    );
    await flush();
    expect(resultFor(sent, 2)?.result).toMatchObject({
      executableName: "agy",
      executablePath: "C:\\agy\\agy.exe",
      installed: true,
      installSource: "external",
      currentVersion: "1.4.0",
    });
  });

  it("declines installation runs", async () => {
    const { sent, bridge } = setup();
    bridge.handleLine(
      request(1, "provider/installation/run", { providerId: "antigravity", action: "install" }),
    );
    await flush();
    expect(resultFor(sent, 1)?.result).toMatchObject({ available: false });
  });

  it("reports not_installed health when the CLI is missing", async () => {
    const sent: SentMessage[] = [];
    const bridge = createAgyBridge({
      runner: {
        spawn: () => {
          throw new Error("must not spawn");
        },
        exec: async () => ({ stdout: "", stderr: "" }),
      },
      resolveExecutable: async () => null,
      readVersion: async () => null,
      write: (line) => {
        sent.push(JSON.parse(line));
      },
    });
    bridge.handleLine(request(1, "provider/health", { providerId: "antigravity" }));
    await flush();
    expect(resultFor(sent, 1)?.result).toMatchObject({
      supported: true,
      health: { status: "not_installed" },
    });
    bridge.handleLine(
      request(2, "provider/installation/status", { providerId: "antigravity" }),
    );
    await flush();
    expect(resultFor(sent, 2)?.result).toMatchObject({
      installed: false,
      executablePath: null,
    });
  });
});
