/**
 * Antigravity (`agy`) provider bridge.
 *
 * Execution model: one `agy --print --output-format stream-json` process per
 * turn. Conversation continuity rides `agy --conversation <id>`; the bridge
 * maps each ZCC thread to its agy conversation id. The CLI inherits the
 * user's Google Pro login from its profile — no token crosses this boundary.
 */
import {
  BRIDGE_JSON_RPC_ERRORS,
  BRIDGE_REQUEST_METHODS,
  PROVIDER_BRIDGE_PROTOCOL_VERSION,
  THREAD_DELTA_GRAMMAR_V3,
  THREAD_DELTA_NOTIFICATION_METHOD,
  ZERO_TOKEN_USAGE,
  addTokenUsage,
  createBridgeIo,
  createBridgeLineHandler,
  experimental_defineProviderBridge,
  experimental_readCliVersion as readCliVersion,
  experimental_resolveExecutablePath as resolveExecutablePath,
  runBridgeRequest,
  type AvailableModel,
  type ModelReasoningEffort,
  type ThreadEventTokenUsageBreakdown,
} from "@zana-ai/zcc-plugin-sdk/provider-bridge";
import { spawn as nodeSpawn, execFile as nodeExecFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  buildTurnArgv,
  looksLikeAuthFailure,
  normalizeAgyModel,
  parseModelsOutput,
  parseStreamJsonLine,
  promptTextFromInput,
  toAgyEffort,
} from "./agy.js";

// ---------------------------------------------------------------------------
// Runner seam (injectable for tests)
// ---------------------------------------------------------------------------

export interface AgyStdio {
  on(event: "data", listener: (chunk: Buffer | string) => void): void;
}

export interface AgyChildProcess {
  stdout: AgyStdio | null;
  stderr: AgyStdio | null;
  on(event: "close" | "error", listener: (arg?: unknown) => void): void;
  kill(signal?: NodeJS.Signals): boolean;
}

export interface AgyRunner {
  spawn(
    command: string,
    args: string[],
    options: { cwd: string; env: Record<string, string | undefined> },
  ): AgyChildProcess;
  exec(
    command: string,
    args: string[],
    options: { timeoutMs: number },
  ): Promise<{ stdout: string; stderr: string }>;
}

/* v8 ignore next -- production runner glue; covered by the live E2E probe. */
function execFileAsync(
  command: string,
  args: string[],
  options: { timeoutMs: number },
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    nodeExecFile(
      command,
      args,
      { timeout: options.timeoutMs, maxBuffer: 4 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            Object.assign(
              new Error(
                `agy probe failed: ${error instanceof Error ? error.message : String(error)}`,
              ),
              { cause: error },
            ),
          );
          return;
        }
        resolve({ stdout: String(stdout), stderr: String(stderr) });
      },
    );
  });
}

/* v8 ignore next -- production runner glue; covered by the live E2E probe. */
export const nodeAgyRunner: AgyRunner = {
  spawn(command, args, options) {
    return nodeSpawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
  },
  exec: execFileAsync,
};

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

interface ActiveTurn {
  turnId: string;
  clientRequestId: string;
  child: AgyChildProcess;
  settled: boolean;
  streamedChars: number;
  killed: boolean;
  requestId: string | number;
}

interface AgySession {
  threadId: string;
  providerThreadId: string;
  cwd: string;
  conversationId: string | null;
  usageTotal: ThreadEventTokenUsageBreakdown;
  turnCounter: number;
  active: ActiveTurn | null;
  pendingInput: string | null;
}

interface LaunchSpec {
  command: string;
  model?: string;
  effort?: string;
}

type BridgeId = string | number;

interface BridgeOptions {
  model?: string;
  reasoningLevel?: string;
  permissionMode?: string;
  providerOptions?: Record<string, unknown>;
}

const AGY_EFFORTS: ModelReasoningEffort[] = [
  { reasoningEffort: "low", description: "Low" },
  { reasoningEffort: "medium", description: "Medium" },
  { reasoningEffort: "high", description: "High" },
  { reasoningEffort: "xhigh", description: "Extra high" },
  { reasoningEffort: "max", description: "Maximum" },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readLaunchSpec(providerOptions: unknown): LaunchSpec {
  const root = isRecord(providerOptions) ? providerOptions : {};
  const spec = isRecord(root.agyLaunchSpec) ? root.agyLaunchSpec : {};
  const command = optionalString(spec.command) ?? "agy";
  return {
    command,
    model: optionalString(spec.model),
    effort: optionalString(spec.effort),
  };
}

function readBridgeOptions(params: unknown): BridgeOptions {
  if (!isRecord(params)) return {};
  const options = isRecord(params.options) ? params.options : {};
  const providerOptions = isRecord(options.providerOptions)
    ? (options.providerOptions as Record<string, unknown>)
    : undefined;
  return {
    model: optionalString(options.model),
    reasoningLevel: optionalString(options.reasoningLevel),
    permissionMode: optionalString(options.permissionMode),
    providerOptions,
  };
}

function usageFromAgy(usage: {
  inputTokens: number;
  outputTokens: number;
  thinkingTokens: number;
  cacheReadTokens: number;
  totalTokens: number;
}): ThreadEventTokenUsageBreakdown {
  return {
    totalTokens: usage.totalTokens,
    inputTokens: usage.inputTokens,
    cachedInputTokens: usage.cacheReadTokens,
    outputTokens: usage.outputTokens,
    reasoningOutputTokens: usage.thinkingTokens,
  };
}

function isMissingExecutable(error: unknown): boolean {
  const code =
    isRecord(error) && typeof error.code === "string" ? error.code : null;
  return (
    code === "ENOENT" ||
    (error instanceof Error && /ENOENT|not found|not recognized/i.test(error.message))
  );
}

// ---------------------------------------------------------------------------
// Bridge
// ---------------------------------------------------------------------------

export interface AgyBridge {
  handleLine: (line: string) => void;
  onClose?: () => void;
  onSigterm?: () => void;
  sessionsForTests?: Map<string, AgySession>;
}

export function createAgyBridge(args?: {
  runner?: AgyRunner;
  write?: (line: string) => void;
  newId?: () => string;
  resolveExecutable?: (command: string) => Promise<string | null>;
  readVersion?: (command: string) => Promise<string | null>;
}): AgyBridge {
  const runner = args?.runner ?? nodeAgyRunner;
  const resolveExecutable = args?.resolveExecutable ?? resolveExecutablePath;
  const readVersion = args?.readVersion ?? readCliVersion;
  const newId = args?.newId ?? (() => randomUUID());
  const io = createBridgeIo({ write: args?.write });
  const sessions = new Map<string, AgySession>();

  const sendDeltas = (threadId: string, deltas: unknown[]): void => {
    io.send({
      jsonrpc: "2.0",
      method: THREAD_DELTA_NOTIFICATION_METHOD,
      params: { threadId, deltas },
    });
  };

  const settleTurn = (
    session: AgySession,
    status: "completed" | "failed" | "interrupted",
    error?: { message: string },
  ): void => {
    const active = session.active;
    if (!active || active.settled) return;
    active.settled = true;
    session.active = null;
    sendDeltas(session.threadId, [
      {
        kind: "turn.boundary",
        status,
        ...(error ? { error: { message: error.message } } : {}),
        providerTurnId: active.turnId,
      },
    ]);
  };

  const failTurnStart = (
    session: AgySession,
    requestId: BridgeId,
    code: number,
    message: string,
  ): void => {
    session.active = null;
    io.sendError(requestId, code, message);
  };

  const startAgyTurn = (
    session: AgySession,
    requestId: BridgeId,
    clientRequestId: string,
    text: string,
    bridgeOptions: BridgeOptions,
  ): void => {
    const spec = readLaunchSpec(bridgeOptions.providerOptions);
    const model =
      normalizeAgyModel(bridgeOptions.model) ?? normalizeAgyModel(spec.model);
    const permissionMode = bridgeOptions.permissionMode ?? "accept-edits";
    const argv = buildTurnArgv({
      spec: {
        command: spec.command,
        ...(model ? { model } : {}),
        effort: toAgyEffort(
          bridgeOptions.reasoningLevel ?? spec.effort ?? "medium",
        ),
        permissionMode,
      },
      text,
      conversationId: session.conversationId,
    });

    session.turnCounter += 1;
    const turnId = `turn-${session.turnCounter}`;
    let child: AgyChildProcess;
    try {
      child = runner.spawn(spec.command, argv, {
        cwd: session.cwd,
        env: { ...process.env },
      });
    } catch (error) {
      failTurnStart(
        session,
        requestId,
        isMissingExecutable(error)
          ? BRIDGE_JSON_RPC_ERRORS.MISSING_EXECUTABLE
          : BRIDGE_JSON_RPC_ERRORS.BRIDGE_ERROR,
        error instanceof Error ? error.message : String(error),
      );
      return;
    }

    const active: ActiveTurn = {
      turnId,
      clientRequestId,
      child,
      settled: false,
      streamedChars: 0,
      killed: false,
      requestId,
    };
    session.active = active;

    sendDeltas(session.threadId, [
      { kind: "input.accepted", clientRequestId },
      { kind: "turn.open", providerTurnId: turnId },
    ]);
    // The request resolves at acceptance (pi/ACP shape); completion rides
    // the deltas below so long turns never time out the request.
    io.sendResult(requestId, { threadId: session.threadId });

    let stdoutBuffer = "";
    let stderrTail = "";
    const noteStderr = (chunk: Buffer | string): void => {
      stderrTail += chunk.toString();
      if (stderrTail.length > 4096) {
        stderrTail = stderrTail.slice(stderrTail.length - 4096);
      }
    };
    const failureDetail = (response: string): string => {
      const parts: string[] = [];
      if (response.trim()) parts.push(response.slice(0, 2000));
      if (stderrTail.trim()) parts.push(`stderr: ${stderrTail.trim().slice(0, 1000)}`);
      return parts.join("\n");
    };
    const handleStdoutLine = (line: string): void => {
      if (session.active !== active || active.settled) return;
      const event = parseStreamJsonLine(line);
      if (event.event === "init") {
        session.conversationId = event.conversationId;
      } else if (event.event === "text") {
        active.streamedChars += event.text.length;
        sendDeltas(session.threadId, [
          {
            kind: "item.textDelta",
            key: { channel: "assistant" },
            channel: "agentMessage",
            text: event.text,
            providerTurnId: turnId,
          },
        ]);
      } else if (event.event === "result") {
        const last = usageFromAgy(event.usage);
        session.usageTotal = addTokenUsage(session.usageTotal, last);
        sendDeltas(session.threadId, [
          {
            kind: "usage",
            total: session.usageTotal,
            last,
            modelContextWindow: null,
            providerTurnId: turnId,
          },
        ]);
        if (event.status === "SUCCESS") {          sendDeltas(session.threadId, [
            active.streamedChars > 0 || event.response.length === 0
              ? {
                  kind: "item.textClose",
                  key: { channel: "assistant" },
                  channel: "agentMessage",
                  providerTurnId: turnId,
                }
              : {
                  kind: "item.textClose",
                  key: { channel: "assistant" },
                  channel: "agentMessage",
                  text: event.response,
                  providerTurnId: turnId,
                },
          ]);
          settleTurn(session, "completed");
        } else {
          const detail = failureDetail(event.response);
          const message = `Antigravity turn ended with status ${event.status}${detail ? `: ${detail.slice(0, 500)}` : ""}`;
          sendDeltas(session.threadId, [
            {
              kind: "provider.error",
              message,
              detail: detail.length > 0 ? detail.slice(0, 2000) : undefined,
              category: "internal",
              settlesTurn: true,
              providerTurnId: turnId,
            },
          ]);
          if (looksLikeAuthFailure(detail)) {
            io.send({
              jsonrpc: "2.0",
              method: "provider/recovery",
              params: {
                threadId: session.threadId,
                kind: "authRequired",
                message: "Antigravity reports missing or expired Google credentials",
                retryable: false,
              },
            });
          }
          settleTurn(session, "failed", { message });
        }
      }
    };

    child.stdout?.on("data", (chunk) => {
      stdoutBuffer += chunk.toString();
      const lines = stdoutBuffer.split("\n");
      stdoutBuffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) handleStdoutLine(trimmed);
      }
    });
    child.stderr?.on("data", (chunk) => {
      // Progress chatter ("Fetching available models...") is intentionally
      // unrendered, but the tail is kept for failure diagnostics.
      noteStderr(chunk);
    });
    const onChildEnd = (crashed: boolean, context: string): void => {
      if (stdoutBuffer.trim()) {
        handleStdoutLine(stdoutBuffer.trim());
        stdoutBuffer = "";
      }
      if (session.active !== active || active.settled) return;
      if (active.killed) {
        settleTurn(session, "interrupted");
        return;
      }
      const captured = failureDetail("");
      const message = crashed
        ? `Antigravity CLI exited unexpectedly (${context})${captured ? `: ${captured.slice(0, 500)}` : ""}`
        : `Antigravity CLI exited without a result (${context})${captured ? `: ${captured.slice(0, 500)}` : ""}`;
      sendDeltas(session.threadId, [
        {
          kind: "provider.error",
          message,
          detail: captured.length > 0 ? captured.slice(0, 2000) : undefined,
          category: "internal",
          settlesTurn: true,
          providerTurnId: turnId,
        },
      ]);
      settleTurn(session, "failed", { message });
    };
    child.on("error", (error) => {
      if (session.active !== active || active.settled) return;
      if (isMissingExecutable(error)) {
        const message =
          error instanceof Error ? error.message : "agy executable not found";
        sendDeltas(session.threadId, [
          {
            kind: "provider.error",
            message,
            category: "internal",
            settlesTurn: true,
            providerTurnId: turnId,
          },
        ]);
        settleTurn(session, "failed", { message });
        return;
      }
      onChildEnd(true, error instanceof Error ? error.message : String(error));
    });
    child.on("close", (code) => {
      onChildEnd(false, `exit code ${String(code)}`);
    });
  };

  const killActiveTurn = (session: AgySession): void => {
    const active = session.active;
    if (!active) return;
    active.killed = true;
    try {
      active.child.kill();
    } catch {
      // Already gone; the close handler settles the turn.
    }
  };

  async function handleModelList(
    id: BridgeId,
    params: unknown,
  ): Promise<void> {
    const options = readBridgeOptions(params);
    const spec = readLaunchSpec(options.providerOptions);
    let stdout: string;
    try {
      ({ stdout } = await runner.exec(spec.command, ["models"], {
        timeoutMs: 30_000,
      }));
    } catch (error) {
      throw Object.assign(
        new Error(
          error instanceof Error ? error.message : "agy models probe failed",
        ),
        {
          code: isMissingExecutable(error)
            ? BRIDGE_JSON_RPC_ERRORS.MISSING_EXECUTABLE
            : BRIDGE_JSON_RPC_ERRORS.BRIDGE_ERROR,
        },
      );
    }
    const rows = parseModelsOutput(stdout);
    const models: AvailableModel[] = rows.map((row, index) => ({
      id: row.id,
      model: row.id,
      displayName: row.label,
      description: `Antigravity model via agy (${row.id})`,
      supportedReasoningEfforts: AGY_EFFORTS,
      defaultReasoningEffort: "medium",
      isDefault: index === 0,
    }));
    io.sendResult(id, { models, selectedOnlyModels: [] });
  }

  async function handleProviderHealth(
    id: BridgeId,
    params: unknown,
  ): Promise<void> {
    const options = readBridgeOptions(params);
    const spec = readLaunchSpec(options.providerOptions);
    const version = await readVersion(spec.command);
    if (version === null) {
      io.sendResult(id, {
        supported: true,
        health: {
          status: "not_installed",
          statusMessage: `The agy CLI was not found (command: ${spec.command}). Install Antigravity and log in with your Google account.`,
          accountEmail: null,
          planLabel: null,
          installedVersion: null,
          minimumSupportedVersion: null,
          canInstall: false,
          canUpdate: false,
          loginCommand: null,
        },
      });
      return;
    }
    io.sendResult(id, {
      supported: true,
      health: {
        status: "ready",
        statusMessage: null,
        accountEmail: null,
        planLabel: "Google Pro",
        installedVersion: version,
        minimumSupportedVersion: null,
        canInstall: false,
        canUpdate: false,
        loginCommand: null,
      },
    });
  }

  async function handleInstallationStatus(
    id: BridgeId,
    params: unknown,
  ): Promise<void> {
    const options = readBridgeOptions(params);
    const spec = readLaunchSpec(options.providerOptions);
    const executablePath = await resolveExecutable(spec.command);
    const currentVersion =
      executablePath === null ? null : await readVersion(spec.command);
    const installed = executablePath !== null && currentVersion !== null;
    io.sendResult(id, {
      executableName: "agy",
      executablePath,
      installed,
      installSource: "external",
      currentVersion,
      latestVersion: null,
      minimumSupportedVersion: null,
      npmPackageName: null,
      npmGlobalPackageVersion: null,
      installAction: null,
      needsUpdate: false,
      versionUnsupported: false,
    });
  }

  function requireSession(params: unknown): AgySession {
    const threadId =
      isRecord(params) && typeof params.threadId === "string"
        ? params.threadId
        : "";
    const session = sessions.get(threadId);
    if (!threadId || !session) {
      throw Object.assign(new Error("No active Antigravity session"), {
        code: BRIDGE_JSON_RPC_ERRORS.INVALID_PARAMS,
      });
    }
    return session;
  }

  async function handleRequest(
    message: Record<string, unknown>,
  ): Promise<void> {
    const id = message.id as BridgeId;
    const method = message.method;
    const params = message.params;
    switch (method) {
      case BRIDGE_REQUEST_METHODS.initialize: {
        io.sendResult(id, {
          protocolVersion: PROVIDER_BRIDGE_PROTOCOL_VERSION,
          capabilities: {
            sessionRestore: false,
            threadArchive: false,
            threadRename: false,
            threadGoalClear: false,
            backgroundTaskStop: false,
            fork: "none",
            approvalEnforcedBy: "runtime",
            grammarVersions: [THREAD_DELTA_GRAMMAR_V3, THREAD_DELTA_GRAMMAR_V3],
            steerMode: "queue",
            skills: { configure: false },
          },
        });
        return;
      }
      case BRIDGE_REQUEST_METHODS.modelList: {
        await handleModelList(id, params);
        return;
      }
      case BRIDGE_REQUEST_METHODS.providerHealth: {
        await handleProviderHealth(id, params);
        return;
      }
      case BRIDGE_REQUEST_METHODS.providerUsage: {
        io.sendResult(id, { supported: false });
        return;
      }
      case BRIDGE_REQUEST_METHODS.providerInstallationStatus: {
        await handleInstallationStatus(id, params);
        return;
      }
      case BRIDGE_REQUEST_METHODS.providerInstallationRun: {
        io.sendResult(id, {
          available: false,
          message:
            "Install Antigravity (agy) from Google and log in with your Google Pro account; Zana cannot install it.",
        });
        return;
      }
      case BRIDGE_REQUEST_METHODS.threadStart: {
        if (!isRecord(params) || typeof params.threadId !== "string") {
          io.sendError(
            id,
            BRIDGE_JSON_RPC_ERRORS.INVALID_PARAMS,
            "thread/start requires threadId",
          );
          return;
        }
        const threadId = params.threadId;
        const cwd =
          typeof params.cwd === "string" && params.cwd.length > 0
            ? params.cwd
            : process.cwd();
        const providerThreadId = `agy-${threadId}`;
        const pendingInput = Array.isArray(params.input)
          ? promptTextFromInput(
              params.input as Parameters<typeof promptTextFromInput>[0],
            )
          : "";
        sessions.set(threadId, {
          threadId,
          providerThreadId,
          cwd,
          conversationId: null,
          usageTotal: { ...ZERO_TOKEN_USAGE },
          turnCounter: 0,
          active: null,
          pendingInput: pendingInput.length > 0 ? pendingInput : null,
        });
        io.sendResult(id, {
          providerThreadId,
          sessionRestorable: false,
        });
        return;
      }
      case BRIDGE_REQUEST_METHODS.threadResume: {
        io.sendError(
          id,
          BRIDGE_JSON_RPC_ERRORS.SESSION_NOT_RESTORABLE,
          "Antigravity sessions are not restorable across bridge restarts in this version",
        );
        return;
      }
      case BRIDGE_REQUEST_METHODS.turnStart: {
        const session = requireSession(params);
        const input = isRecord(params) && Array.isArray(params.input)
          ? (params.input as Parameters<typeof promptTextFromInput>[0])
          : [];
        let text = promptTextFromInput(input);
        if (session.pendingInput) {
          text = session.pendingInput + (text ? `\n\n${text}` : "");
          session.pendingInput = null;
        }
        if (!text) {
          io.sendError(
            id,
            BRIDGE_JSON_RPC_ERRORS.INVALID_PARAMS,
            "Missing input text",
          );
          return;
        }
        if (session.active && !session.active.settled) {
          io.sendError(
            id,
            BRIDGE_JSON_RPC_ERRORS.BRIDGE_ERROR,
            "A turn is already active on this Antigravity session",
          );
          return;
        }
        const clientRequestId =
          isRecord(params) && typeof params.clientRequestId === "string"
            ? params.clientRequestId
            : "";
        startAgyTurn(session, id, clientRequestId, text, readBridgeOptions(params));
        return;
      }
      case BRIDGE_REQUEST_METHODS.turnSteer: {
        const session = requireSession(params);
        const active = session.active;
        if (!active || active.settled) {
          io.sendError(
            id,
            BRIDGE_JSON_RPC_ERRORS.NO_ACTIVE_TURN,
            "No active Antigravity turn to steer",
          );
          return;
        }
        const input = isRecord(params) && Array.isArray(params.input)
          ? (params.input as Parameters<typeof promptTextFromInput>[0])
          : [];
        const text = promptTextFromInput(input);
        if (!text) {
          io.sendError(
            id,
            BRIDGE_JSON_RPC_ERRORS.INVALID_PARAMS,
            "Missing input text",
          );
          return;
        }
        // Queue semantics: interrupt the live turn, then run the steer text
        // as the next turn on the same conversation.
        killActiveTurn(session);
        settleTurn(session, "interrupted");
        const clientRequestId =
          isRecord(params) && typeof params.clientRequestId === "string"
            ? params.clientRequestId
            : "";
        startAgyTurn(session, id, clientRequestId, text, readBridgeOptions(params));
        return;
      }
      case BRIDGE_REQUEST_METHODS.threadStop: {
        const session = sessions.get(
          isRecord(params) && typeof params.threadId === "string"
            ? params.threadId
            : "",
        );
        const intent = isRecord(params) ? params.intent : undefined;
        if (session && intent === "interrupt") {
          killActiveTurn(session);
          settleTurn(session, "interrupted");
        }
        io.sendResult(id, { ok: true, providerCheckpointId: null });
        return;
      }
      case BRIDGE_REQUEST_METHODS.threadDiscard: {
        const session = sessions.get(
          isRecord(params) && typeof params.threadId === "string"
            ? params.threadId
            : "",
        );
        if (session) {
          killActiveTurn(session);
          sessions.delete(session.threadId);
        }
        io.sendResult(id, { ok: true });
        return;
      }
      default: {
        io.sendError(
          id,
          BRIDGE_JSON_RPC_ERRORS.METHOD_NOT_FOUND,
          `Unsupported method: ${String(method)}`,
        );
      }
    }
  }

  const handleLine = createBridgeLineHandler({
    handleParsedMessage: (message: unknown) => {
      if (!isRecord(message) || typeof message.method !== "string") return;
      if (
        typeof message.id !== "string" &&
        typeof message.id !== "number"
      ) {
        return;
      }
      runBridgeRequest({
        request: message as { id: BridgeId },
        sendError: io.sendError,
        handleRequest: async (request) => {
          try {
            await handleRequest(request as Record<string, unknown>);
          } catch (error) {
            const code =
              isRecord(error) &&
              typeof (error as { code?: unknown }).code === "number"
                ? (error as { code: number }).code
                : BRIDGE_JSON_RPC_ERRORS.BRIDGE_ERROR;
            io.sendError(
              (request as { id: BridgeId }).id,
              code,
              error instanceof Error ? error.message : String(error),
            );
          }
        },
      });
    },
  });

  const killAll = (): void => {
    for (const session of sessions.values()) killActiveTurn(session);
  };

  return {
    handleLine,
    onClose: killAll,
    onSigterm: killAll,
    sessionsForTests: sessions,
  };
}

export const experimental_providerBridge = experimental_defineProviderBridge(
  (() => {
    const bridge = createAgyBridge();
    return {
      handleLine: bridge.handleLine,
      onClose: bridge.onClose,
      onSigterm: bridge.onSigterm,
    };
  })(),
);
