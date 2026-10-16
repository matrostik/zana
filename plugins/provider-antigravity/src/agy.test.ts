import { describe, expect, it } from "vitest";
import {
  buildTurnArgv,
  looksLikeAuthFailure,
  normalizeAgyModel,
  parseModelsOutput,
  parseStreamJsonLine,
  promptTextFromInput,
  toAgyEffort,
} from "./agy.js";

describe("normalizeAgyModel", () => {
  it.each([undefined, null, "", "   ", "default", " Default "])(
    "treats %s as agent default",
    (value) => {
      expect(normalizeAgyModel(value)).toBeUndefined();
    },
  );
  it("keeps explicit model ids", () => {
    expect(normalizeAgyModel("gemini-4-argon-low")).toBe("gemini-4-argon-low");
  });
});

describe("toAgyEffort", () => {
  it.each(["low", "medium", "high", "xhigh", "max"])(
    "passes %s through",
    (level) => {
      expect(toAgyEffort(level)).toBe(level);
    },
  );
  it.each([undefined, null, "none", "ultra", "", 42])(
    "falls back to medium for %s",
    (level) => {
      expect(toAgyEffort(level)).toBe("medium");
    },
  );
});

describe("promptTextFromInput", () => {
  it("joins text parts", () => {
    expect(
      promptTextFromInput([
        { type: "text", text: "hello" },
        { type: "text", text: "world" },
      ]),
    ).toBe("hello\n\nworld");
  });
  it("skips empty text and notes attachments", () => {
    expect(
      promptTextFromInput([
        { type: "text", text: "" },
        { type: "image", url: "http://x/y.png" },
        { type: "localFile", path: "/tmp/a.txt" },
        { type: "localImage", name: "pic" },
      ]).split("\n\n"),
    ).toHaveLength(3);
  });
  it("returns empty string for no usable parts", () => {
    expect(promptTextFromInput([{ type: "text", text: "" }])).toBe("");
    expect(promptTextFromInput([])).toBe("");
  });
});

describe("buildTurnArgv", () => {
  it("attaches the prompt to --print so flags are not swallowed", () => {
    const argv = buildTurnArgv({
      spec: { command: "agy", effort: "high" },
      text: "say hi",
    });
    expect(argv).toEqual([
      "--output-format",
      "stream-json",
      "--print=say hi",
      "--effort",
      "high",
      "--mode",
      "accept-edits",
    ]);
  });
  it("passes model, conversation, and full-permission flag", () => {
    const argv = buildTurnArgv({
      spec: { command: "agy", model: "gemini-4-argon-low", permissionMode: "full" },
      text: "x",
      conversationId: "conv-1",
    });
    expect(argv).toContain("--model");
    expect(argv).toContain("gemini-4-argon-low");
    expect(argv).toContain("--dangerously-skip-permissions");
    expect(argv).toContain("--conversation");
    expect(argv).toContain("conv-1");
  });
  it("maps auto permission mode to --mode auto", () => {
    const argv = buildTurnArgv({
      spec: { command: "agy", permissionMode: "auto" },
      text: "x",
    });
    expect(argv).toContain("--mode");
    expect(argv).toContain("auto");
    expect(argv).not.toContain("--dangerously-skip-permissions");
  });
});

describe("parseModelsOutput", () => {
  it("parses tab-separated id/label rows", () => {
    expect(
      parseModelsOutput("gemini-4-argon-medium\tGemini 4 Argon (Medium)\n\nbad-line\n"),
    ).toEqual([{ id: "gemini-4-argon-medium", label: "Gemini 4 Argon (Medium)" }]);
  });
  it("returns empty for blank output", () => {
    expect(parseModelsOutput("")).toEqual([]);
  });
});

describe("parseStreamJsonLine", () => {
  it("parses init with conversation id", () => {
    expect(
      parseStreamJsonLine('{"event":"init","conversation_id":"c1","init":{}}'),
    ).toEqual({ event: "init", conversationId: "c1" });
  });
  it("parses agent text deltas and skips empty ones", () => {
    expect(
      parseStreamJsonLine(
        '{"event":"step_update","step_update":{"step_index":1,"state":"ACTIVE","step_type":"agent_response","text_delta":"hi"}}',
      ),
    ).toEqual({ event: "text", text: "hi" });
    expect(
      parseStreamJsonLine(
        '{"event":"step_update","step_update":{"step_index":0,"state":"DONE","step_type":"user_input"}}',
      ),
    ).toEqual({ event: "unknown" });
  });
  it("parses the terminal result with usage", () => {
    expect(
      parseStreamJsonLine(
        '{"event":"result","result":{"conversation_id":"c1","status":"SUCCESS","response":"hi\\n","usage":{"input_tokens":10,"output_tokens":2,"thinking_tokens":1,"cache_read_tokens":0,"total_tokens":12}}}',
      ),
    ).toEqual({
      event: "result",
      conversationId: "c1",
      status: "SUCCESS",
      response: "hi\n",
      usage: {
        inputTokens: 10,
        outputTokens: 2,
        thinkingTokens: 1,
        cacheReadTokens: 0,
        totalTokens: 12,
      },
    });
  });
  it("treats garbage as unknown", () => {
    expect(parseStreamJsonLine("Fetching available models...")).toEqual({
      event: "unknown",
    });
    expect(parseStreamJsonLine("{nope")).toEqual({ event: "unknown" });
    expect(parseStreamJsonLine('{"event":"init"}')).toEqual({ event: "unknown" });
  });
});

describe("looksLikeAuthFailure", () => {
  it("detects login problems", () => {
    expect(looksLikeAuthFailure("Error: not logged in, run agy login")).toBe(true);
    expect(looksLikeAuthFailure("authentication expired")).toBe(true);
    expect(looksLikeAuthFailure("quota exhausted for the day")).toBe(false);
  });
});
