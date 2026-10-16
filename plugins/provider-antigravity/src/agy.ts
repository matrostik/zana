/**
 * Pure Antigravity (`agy`) CLI helpers shared by the bridge.
 *
 * No `node:child_process` here — the bridge owns spawning so these stay
 * unit-testable without a CLI on PATH.
 */

export interface AgyLaunchSpec {
  command: string;
  model?: string;
  effort?: string;
  permissionMode?: string;
}

export interface AgyPromptPart {
  type: string;
  text?: string;
  name?: string;
  url?: string;
  path?: string;
}

const AGY_EFFORTS = new Set(["low", "medium", "high", "xhigh", "max"]);

const FALLBACK_EFFORT = "medium";

/** ZCC's "default" means the agent's own default model — never forwarded. */
export function normalizeAgyModel(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "default") return undefined;
  return trimmed;
}

/** Map a ZCC reasoning level onto an `agy --effort` value. */
export function toAgyEffort(reasoningLevel: unknown): string {
  if (typeof reasoningLevel === "string" && AGY_EFFORTS.has(reasoningLevel)) {
    return reasoningLevel;
  }
  return FALLBACK_EFFORT;
}

/** Flatten prompt inputs to the single text `agy --print` consumes. */
export function promptTextFromInput(input: readonly AgyPromptPart[]): string {
  const parts: string[] = [];
  for (const part of input) {
    if (part.type === "text" && typeof part.text === "string") {
      if (part.text.length > 0) parts.push(part.text);
    } else if (part.type === "image") {
      parts.push(`[image attachment not sent to Antigravity: ${part.url ?? "unnamed"}]`);
    } else if (part.type === "localImage" || part.type === "localFile") {
      parts.push(
        `[file attachment not sent to Antigravity: ${part.path ?? part.name ?? "unnamed"}]`,
      );
    }
  }
  return parts.join("\n\n");
}

export interface AgyTurnArgvOptions {
  spec: AgyLaunchSpec;
  text: string;
  conversationId?: string | null;
}

/**
 * Build the argv for one `agy --print --output-format stream-json` turn.
 * The prompt rides `--print=<text>` (a bare `--print` would swallow the
 * next flag as its prompt).
 */
export function buildTurnArgv(options: AgyTurnArgvOptions): string[] {
  const argv = ["--output-format", "stream-json", `--print=${options.text}`];
  if (options.spec.model) argv.push("--model", options.spec.model);
  argv.push("--effort", toAgyEffort(options.spec.effort));
  if (options.spec.permissionMode === "full") {
    argv.push("--dangerously-skip-permissions");
  } else if (options.spec.permissionMode === "auto") {
    argv.push("--mode", "auto");
  } else {
    argv.push("--mode", "accept-edits");
  }
  if (options.conversationId) argv.push("--conversation", options.conversationId);
  return argv;
}

export interface AgyModelRow {
  id: string;
  label: string;
}

/**
 * Parse `agy models` stdout (`<id>\t<label>` per line). The CLI prints
 * progress ("Fetching available models...") on stderr, so stdout parsing
 * only skips blank lines.
 */
export function parseModelsOutput(stdout: string): AgyModelRow[] {
  const rows: AgyModelRow[] = [];
  for (const line of stdout.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const tab = trimmed.indexOf("\t");
    if (tab <= 0) continue;
    const id = trimmed.slice(0, tab).trim();
    const label = trimmed.slice(tab + 1).trim();
    if (id && label) rows.push({ id, label });
  }
  return rows;
}

export type AgyStreamEvent =
  | { event: "init"; conversationId: string }
  | { event: "text"; text: string }
  | {
      event: "result";
      conversationId: string;
      status: string;
      response: string;
      usage: {
        inputTokens: number;
        outputTokens: number;
        thinkingTokens: number;
        cacheReadTokens: number;
        totalTokens: number;
      };
    }
  | { event: "unknown" };

function toFiniteNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/** Parse one `agy --output-format stream-json` stdout line. */
export function parseStreamJsonLine(line: string): AgyStreamEvent {
  let parsed: unknown;
  try {
    parsed = JSON.parse(line);
  } catch {
    return { event: "unknown" };
  }
  if (typeof parsed !== "object" || parsed === null) return { event: "unknown" };
  const record = parsed as Record<string, unknown>;
  if (record.event === "init") {
    const conversationId =
      typeof record.conversation_id === "string" ? record.conversation_id : "";
    if (!conversationId) return { event: "unknown" };
    return { event: "init", conversationId };
  }
  if (record.event === "step_update") {
    const update = record.step_update as Record<string, unknown> | undefined;
    const delta =
      typeof update?.text_delta === "string" ? update.text_delta : null;
    if (delta === null || delta.length === 0) return { event: "unknown" };
    return { event: "text", text: delta };
  }
  if (record.event === "result") {
    const result = record.result as Record<string, unknown> | undefined;
    if (!result || typeof result.conversation_id !== "string") {
      return { event: "unknown" };
    }
    const usage = (result.usage ?? {}) as Record<string, unknown>;
    return {
      event: "result",
      conversationId: result.conversation_id,
      status: typeof result.status === "string" ? result.status : "UNKNOWN",
      response: typeof result.response === "string" ? result.response : "",
      usage: {
        inputTokens: toFiniteNumber(usage.input_tokens),
        outputTokens: toFiniteNumber(usage.output_tokens),
        thinkingTokens: toFiniteNumber(usage.thinking_tokens),
        cacheReadTokens: toFiniteNumber(usage.cache_read_tokens),
        totalTokens: toFiniteNumber(usage.total_tokens),
      },
    };
  }
  return { event: "unknown" };
}

/** Heuristic: does this failure look like a missing/expired Google login? */
export function looksLikeAuthFailure(text: string): boolean {
  return /not (logged|signed) in|unauthenticated|authentication (required|expired|failed)|login required|invalid grant|reauthenticat/i.test(
    text,
  );
}
