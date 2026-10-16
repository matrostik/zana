import {
  VOICE_LANGUAGE_PATTERN,
  VOICE_LOCAL_MODEL_IDS,
  type CodexVoiceTranscribeResult,
  type VoiceLocalModelId,
  type VoiceLocalStatusResult,
  type VoiceLocalTranscribeResult
} from '@zana-ai/zcc-contracts/host-rpc';
import { AmbiguousHostError, HostUnavailableError } from '../../http/host-hub.js';
import type { ProductHttpContext } from '../../http/product-context.js';
import { VOICE_TRANSCRIPTION_MAX_BYTES } from '../../http/multipart-voice.js';

export const DEFAULT_VOICE_MODEL = 'gpt-transcribe';
export const DEFAULT_VOICE_LOCAL_MODEL: VoiceLocalModelId = 'base';
// Keep within VoiceLocalTranscribeCommandSchema's cap; the RPC timeout leaves
// headroom for the result to travel back.
export const VOICE_LOCAL_COMMAND_TIMEOUT_MS = 120_000;
export const VOICE_LOCAL_RPC_TIMEOUT_MS = 145_000;
export const VOICE_STATUS_RPC_TIMEOUT_MS = 30_000;
export const CODEX_VOICE_LOGIN_MESSAGE =
  'Voice input needs a Codex login on the connected computer. Sign in there, then try again.';
export const LOCAL_VOICE_UPDATE_MESSAGE =
  'Update the host daemon to use local transcription.';
// Keep within CodexVoiceTranscribeCommandSchema's cap, including older hosts.
export const VOICE_COMMAND_TIMEOUT_MS = 60_000;
export const VOICE_RPC_TIMEOUT_MS = 85_000;

export class VoiceTranscriptionError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'VoiceTranscriptionError';
  }
}

function hostErrorStatus(code: string): number {
  if (code === 'codex_auth_missing' || code === 'codex_auth_invalid' || code === 'codex_auth_failed' || code === 'not_configured') {
    return 501;
  }
  if (code === 'invalid_request') return 400;
  if (code === 'codex_keyring_unavailable') return 503;
  if (code === 'codex_request_timeout') return 504;
  if (code === 'codex_rate_limited' || code === 'codex_service_unavailable') return 503;
  return 502;
}

export function voiceTranscriptionEnabled(ctx: ProductHttpContext): boolean {
  return ctx.hostHub.connectedHostIds().length > 0;
}

export type VoiceEngine = 'cloud' | 'local';

/** 'local' only when explicitly configured; anything else (including legacy values) is cloud. */
export function voiceEngine(ctx: ProductHttpContext): VoiceEngine {
  return ctx.config.getConfig().voiceEngine === 'local' ? 'local' : 'cloud';
}

/** The local model to transcribe with; unknown values fall back to the default. */
export function voiceLocalModel(ctx: ProductHttpContext): VoiceLocalModelId {
  const configured: string = ctx.config.getConfig().voiceLocalModel ?? '';
  return (VOICE_LOCAL_MODEL_IDS as readonly string[]).includes(configured) ? configured as VoiceLocalModelId : DEFAULT_VOICE_LOCAL_MODEL;
}

export interface VoiceStatus {
  enabled: boolean;
  engine: VoiceEngine;
  ready: boolean;
  /** Machine-readable reason when not ready; null when ready. */
  reason: string | null;
}

/**
 * Whether dictation can run right now. Cloud is ready whenever a host is
 * connected; local additionally needs whisper-cli and the selected model on
 * that host. Never throws: failures to ask the host report not-ready.
 */
export async function voiceStatus(ctx: ProductHttpContext): Promise<VoiceStatus> {
  const enabled = voiceTranscriptionEnabled(ctx);
  const engine = voiceEngine(ctx);
  if (!enabled) return { enabled, engine, ready: false, reason: 'no_host' };
  if (engine === 'cloud') return { enabled, engine, ready: true, reason: null };
  let status: VoiceLocalStatusResult;
  try {
    const hostId = ctx.hostHub.resolveHostId();
    status = await ctx.hostHub.callHostOnlineRpc<VoiceLocalStatusResult>({
      hostId,
      timeoutMs: VOICE_STATUS_RPC_TIMEOUT_MS,
      command: { type: 'voice.local.status' }
    });
  } catch (error) {
    if (error instanceof AmbiguousHostError) return { enabled, engine, ready: false, reason: 'ambiguous_host' };
    if (error instanceof HostUnavailableError) return { enabled, engine, ready: false, reason: 'no_host' };
    if (hostErrorCode(error) === 'unknown_command') return { enabled, engine, ready: false, reason: 'daemon_outdated' };
    return { enabled, engine, ready: false, reason: 'status_failed' };
  }
  if (status.binary.state !== 'ready') {
    return { enabled, engine, ready: false, reason: status.binary.state === 'missing' ? 'binary_missing' : 'binary_invalid' };
  }
  const model = status.models.find((candidate) => candidate.id === voiceLocalModel(ctx));
  if (!model || model.state !== 'installed') {
    return { enabled, engine, ready: false, reason: model?.state === 'downloading' ? 'model_downloading' : 'model_not_installed' };
  }
  return { enabled, engine, ready: true, reason: null };
}

function hostErrorCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as { code: unknown }).code);
  }
  return 'provider_rpc_error';
}

/** Returns a valid ISO-639 hint, or null for auto-detect (empty, absent, or a pre-validation legacy value). */
export function voiceLanguageHint(value: string | undefined): string | null {
  const language = value?.trim().toLowerCase() ?? '';
  return VOICE_LANGUAGE_PATTERN.test(language) ? language : null;
}

function isCodexAuthErrorCode(code: string): boolean {
  return code === 'codex_auth_missing' || code === 'codex_auth_invalid' || code === 'codex_auth_failed';
}

function localHostErrorStatus(code: string): number {
  if (code === 'invalid_request') return 400;
  if (
    code === 'voice_binary_missing' || code === 'voice_binary_invalid' ||
    code === 'voice_model_missing' || code === 'voice_transcribe_busy'
  ) {
    return 503;
  }
  if (code === 'voice_transcribe_timeout') return 504;
  return 502;
}

async function transcribeVoiceLocal(
  ctx: ProductHttpContext,
  args: { bytes: Buffer }
): Promise<string> {
  const config = ctx.config.getConfig();
  const language = voiceLanguageHint(config.voiceLanguage);
  const modelId = voiceLocalModel(ctx);
  try {
    const hostId = ctx.hostHub.resolveHostId();
    const result = await ctx.hostHub.callHostOnlineRpc<VoiceLocalTranscribeResult>({
      hostId,
      timeoutMs: VOICE_LOCAL_RPC_TIMEOUT_MS,
      command: {
        type: 'voice.local.transcribe',
        audioBase64: args.bytes.toString('base64'),
        modelId,
        // Omitted when unset: older hosts reject unknown keys.
        ...(language ? { language } : {}),
        timeoutMs: VOICE_LOCAL_COMMAND_TIMEOUT_MS
      }
    });
    return result.text;
  } catch (error) {
    if (error instanceof HostUnavailableError) {
      // callHostOnlineRpc reports both disconnects and RPC timeouts this way;
      // the message distinguishes them (see host-hub.ts).
      if (error.message.includes('timed out')) {
        throw new VoiceTranscriptionError(504, 'voice_transcribe_timeout', 'Local transcription timed out.');
      }
      throw new VoiceTranscriptionError(503, error.code, error.message);
    }
    if (error instanceof AmbiguousHostError) {
      throw new VoiceTranscriptionError(409, error.code, error.message);
    }
    const code = hostErrorCode(error);
    const message = error instanceof Error ? error.message : String(error);
    if (code === 'unknown_command') {
      throw new VoiceTranscriptionError(501, code, LOCAL_VOICE_UPDATE_MESSAGE);
    }
    // No cloud fallback: a local failure stays a local failure.
    throw new VoiceTranscriptionError(localHostErrorStatus(code), code, message);
  }
}

export async function transcribeVoiceOnHost(
  ctx: ProductHttpContext,
  args: { bytes: Buffer; mimeType: string; filename: string; prompt?: string }
): Promise<string> {
  if (args.bytes.byteLength === 0) {
    throw new VoiceTranscriptionError(400, 'invalid_request', 'Audio file must not be empty');
  }
  if (args.bytes.byteLength > VOICE_TRANSCRIPTION_MAX_BYTES) {
    throw new VoiceTranscriptionError(400, 'invalid_request', 'Audio file exceeds 25MB limit');
  }
  if (voiceEngine(ctx) === 'local') return transcribeVoiceLocal(ctx, args);
  const config = ctx.config.getConfig();
  const model = config.voiceModel?.trim() || DEFAULT_VOICE_MODEL;
  const language = voiceLanguageHint(config.voiceLanguage);
  try {
    const hostId = ctx.hostHub.resolveHostId();
    const result = await ctx.hostHub.callHostOnlineRpc<CodexVoiceTranscribeResult>({
      hostId,
      timeoutMs: VOICE_RPC_TIMEOUT_MS,
      command: {
        type: 'codex.voice.transcribe',
        model,
        audioBase64: args.bytes.toString('base64'),
        mimeType: args.mimeType || 'application/octet-stream',
        filename: args.filename || 'recording.webm',
        prompt: args.prompt?.trim() || null,
        // Omitted when unset: older hosts reject unknown keys.
        ...(language ? { language } : {}),
        timeoutMs: VOICE_COMMAND_TIMEOUT_MS
      }
    });
    return result.text;
  } catch (error) {
    if (error instanceof HostUnavailableError) {
      throw new VoiceTranscriptionError(503, error.code, error.message);
    }
    if (error instanceof AmbiguousHostError) {
      throw new VoiceTranscriptionError(409, error.code, error.message);
    }
    const code = hostErrorCode(error);
    const message = error instanceof Error ? error.message : String(error);
    if (isCodexAuthErrorCode(code)) {
      throw new VoiceTranscriptionError(501, code, CODEX_VOICE_LOGIN_MESSAGE);
    }
    throw new VoiceTranscriptionError(hostErrorStatus(code), code, message);
  }
}
