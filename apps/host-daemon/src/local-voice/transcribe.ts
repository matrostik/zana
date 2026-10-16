import { randomUUID } from 'node:crypto';
import { rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { VoiceLocalTranscribeCommand, VoiceLocalTranscribeResult } from '@zana-ai/zcc-contracts/host-rpc';
import { HostCommandError } from '../host-command-error.js';
import { readCapped, runCaptured, type CapturedRunner } from './captured-run.js';

/** Raw WAV cap: 25 MB (well above the ~3.2 MB a 50 s recording produces at 16 kHz mono 16-bit). */
export const LOCAL_VOICE_AUDIO_MAX_BYTES = 25 * 1024 * 1024;
const TRANSCRIPT_MAX_BYTES = 1024 * 1024;
const STDERR_MAX_BYTES = 256 * 1024;
const ERROR_MESSAGE_MAX = 300;

export interface LocalTranscribeDeps {
  binaryPath: string;
  modelPath: string;
  run?: CapturedRunner;
  cpuCount?: number;
  tmpDir?: string;
  /** Aborted when the daemon shuts down; kills the running whisper-cli child. */
  signal?: AbortSignal;
}

export interface WavInfo {
  durationMs: number;
  sampleRate: number;
  channels: number;
}

function invalidAudio(message: string): HostCommandError {
  return new HostCommandError('invalid_request', message);
}

/**
 * Validates a 16-bit PCM WAV and reports its duration (used to bound the
 * whisper-cli timeout). Extra chunks before `fmt ` are skipped; the renderer
 * only ever sends this shape, but hand-made payloads must fail loudly.
 */
export function parseWavHeader(audio: Buffer): WavInfo {
  if (audio.length < 44 || audio.toString('ascii', 0, 4) !== 'RIFF' || audio.toString('ascii', 8, 12) !== 'WAVE') {
    throw invalidAudio('Audio must be a WAV file.');
  }
  let sampleRate = 0;
  let channels = 0;
  let dataBytes = -1;
  let offset = 12;
  for (let chunks = 0; chunks < 64 && offset + 8 <= audio.length; chunks++) {
    const id = audio.toString('ascii', offset, offset + 4);
    const size = audio.readUInt32LE(offset + 4);
    if (id === 'fmt ') {
      if (size < 16 || offset + 8 + 16 > audio.length) throw invalidAudio('Audio has an invalid WAV header.');
      if (audio.readUInt16LE(offset + 8) !== 1) throw invalidAudio('Audio must be 16-bit PCM WAV.');
      channels = audio.readUInt16LE(offset + 10);
      sampleRate = audio.readUInt32LE(offset + 12);
      if (audio.readUInt16LE(offset + 22) !== 16) throw invalidAudio('Audio must be 16-bit PCM WAV.');
      if (channels < 1 || sampleRate < 1000) throw invalidAudio('Audio has an invalid WAV header.');
    } else if (id === 'data') {
      dataBytes = size;
      break;
    }
    offset += 8 + size + (size % 2);
  }
  if (!sampleRate || !channels || dataBytes < 0) throw invalidAudio('Audio has an invalid WAV header.');
  return { durationMs: (dataBytes / (sampleRate * channels * 2)) * 1000, sampleRate, channels };
}

export function decodeTranscribeAudio(command: VoiceLocalTranscribeCommand): Buffer {
  const audio = Buffer.from(command.audioBase64, 'base64');
  if (audio.byteLength === 0) throw invalidAudio('Audio file must not be empty');
  if (audio.byteLength > LOCAL_VOICE_AUDIO_MAX_BYTES) throw invalidAudio('Audio file exceeds 25MB limit');
  return audio;
}

/** whisper.cpp threads: one job owns the CPU, capped so the box stays usable. */
export function transcribeThreadCount(cpuCount: number): number {
  return Math.max(1, Math.min(4, cpuCount - 1));
}

function boundedMessage(message: string): string {
  const flat = message.replace(/\s+/g, ' ').trim();
  return flat.length > ERROR_MESSAGE_MAX ? `${flat.slice(0, ERROR_MESSAGE_MAX - 1)}…` : flat;
}

/**
 * Replaces local filesystem paths with placeholders so whisper stderr (which
 * echoes model and temp file paths) never reaches the renderer. Exact-match
 * only: no regex heuristics, no risk of mangling transcript prose.
 */
export function redactLocalPaths(text: string, paths: readonly string[]): string {
  let redacted = text;
  for (const path of paths) {
    if (path) redacted = redacted.split(path).join('<path>');
  }
  return redacted;
}

// --- Transcript cleanup (ported from prompt-voice cleanTranscription.ts) ---

const NON_SPEECH_TAG_PATTERNS = [
  /\[\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}\]/g,
  /\[(?:BLANK_AUDIO|_BEG_|silence|music|laughter|applause|cough|throat[- ]clearing|sigh|snort|inaudible|whispering)\]/gi,
  /\((?:silence|music|laughter|applause|cough|throat[- ]clearing|sigh|snort|inaudible|whispering)\)/gi,
  /\*(?:silence|music|laughter|applause)\*/gi
];

const CP437_CODEPOINT_TO_BYTE: Record<number, number> = {
  199: 128, 252: 129, 233: 130, 226: 131, 228: 132, 224: 133, 229: 134, 231: 135,
  234: 136, 235: 137, 232: 138, 239: 139, 238: 140, 236: 141, 196: 142, 197: 143,
  201: 144, 230: 145, 198: 146, 244: 147, 246: 148, 242: 149, 251: 150, 249: 151,
  255: 152, 214: 153, 220: 154, 162: 155, 163: 156, 165: 157, 8359: 158, 402: 159,
  225: 160, 237: 161, 243: 162, 250: 163, 241: 164, 209: 165, 170: 166, 186: 167,
  191: 168, 8976: 169, 172: 170, 189: 171, 188: 172, 161: 173, 171: 174, 187: 175,
  9617: 176, 9618: 177, 9619: 178, 9474: 179, 9508: 180, 9569: 181, 9570: 182, 9558: 183,
  9557: 184, 9571: 185, 9553: 186, 9559: 187, 9565: 188, 9564: 189, 9563: 190, 9488: 191,
  9492: 192, 9524: 193, 9516: 194, 9500: 195, 9472: 196, 9532: 197, 9566: 198, 9567: 199,
  9562: 200, 9556: 201, 9577: 202, 9574: 203, 9568: 204, 9552: 205, 9580: 206, 9575: 207,
  9576: 208, 9572: 209, 9573: 210, 9561: 211, 9560: 212, 9554: 213, 9555: 214, 9579: 215,
  9578: 216, 9496: 217, 9484: 218, 9608: 219, 9604: 220, 9612: 221, 9616: 222, 9600: 223,
  945: 224, 223: 225, 915: 226, 960: 227, 931: 228, 963: 229, 181: 230, 964: 231,
  934: 232, 920: 233, 937: 234, 948: 235, 8734: 236, 966: 237, 949: 238, 8745: 239,
  8801: 240, 177: 241, 8805: 242, 8804: 243, 8992: 244, 8993: 245, 247: 246, 8776: 247,
  176: 248, 8729: 249, 183: 250, 8730: 251, 8319: 252, 178: 253, 9632: 254, 160: 255
};

const MOJIBAKE_LEAD_BYTES: Record<string, number> = {
  '╨': 0xd0, '╤': 0xd1, '╥': 0xd2, '╙': 0xd3, '╘': 0xd4, '╒': 0xd5
};

/** Recovers UTF-8 text corrupted into CP437 glyphs by a Windows console fallback. */
export function decodeCp437Mojibake(text: string): string {
  if (!text || !/[\u2552\u2558\u2559\u2564\u2565\u2568]/.test(text)) return text;
  return text.replace(/([\u2552\u2558\u2559\u2564\u2565\u2568])([\s\S])/g, (match, lead, trail) => {
    const b1 = MOJIBAKE_LEAD_BYTES[lead as string];
    const b2 = CP437_CODEPOINT_TO_BYTE[(trail as string).charCodeAt(0)];
    if (b1 !== undefined && b2 !== undefined) {
      try {
        return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array([b1, b2]));
      } catch {
        return match;
      }
    }
    return match;
  });
}

/** Strips Whisper timestamps and non-speech tokens, then normalizes whitespace. */
export function cleanTranscription(text: string): string {
  if (!text) return '';
  let cleaned = text;
  for (const pattern of NON_SPEECH_TAG_PATTERNS) cleaned = cleaned.replace(pattern, '');
  cleaned = decodeCp437Mojibake(cleaned);
  return cleaned.replace(/\s+/g, ' ').trim();
}

export function parseDetectedLanguage(output: string): { language: string; confidence?: number } | undefined {
  const match = output.match(/auto-detected language:\s*([a-z]{2,3})(?:\s*\(p\s*=\s*([0-9.]+)\))?/i);
  if (!match) return undefined;
  const confidence = match[2] === undefined ? undefined : Number.parseFloat(match[2]);
  return { language: match[1]!.toLowerCase(), ...(Number.isFinite(confidence) && { confidence }) };
}

// --- Runner ---

/**
 * Runs whisper-cli on validated WAV audio. The transcript comes from the
 * `-otxt` file (guaranteed UTF-8); stdout is only a fallback. Temp files are
 * removed on every path. The timeout or `deps.signal` kills the child.
 */
export async function runLocalTranscription(
  command: VoiceLocalTranscribeCommand,
  deps: LocalTranscribeDeps
): Promise<VoiceLocalTranscribeResult> {
  const run = deps.run ?? runCaptured;
  const dir = deps.tmpDir ?? tmpdir();
  const audio = decodeTranscribeAudio(command);
  const wav = parseWavHeader(audio);

  const id = randomUUID();
  const wavPath = join(dir, `zcc-whisper-${id}.wav`);
  const outBase = join(dir, `zcc-whisper-${id}.out`);
  const language = command.language ?? 'auto';
  // Floor so short clips still get a usable window; grows with audio length.
  const timeoutMs = Math.min(command.timeoutMs, 15_000 + 2 * Math.ceil(wav.durationMs));
  try {
    await writeFile(wavPath, audio, { mode: 0o600 });
    const args = [
      '-m', deps.modelPath,
      '-f', wavPath,
      '-l', language,
      '-nt',
      '-t', String(transcribeThreadCount(deps.cpuCount ?? 4)),
      '-otxt', '-of', outBase
    ];
    const result = await run(deps.binaryPath, args, {
      timeoutMs,
      maxOutputBytes: STDERR_MAX_BYTES,
      separateStderr: true,
      ...(deps.signal && { signal: deps.signal })
    });
    if (result.aborted && !result.timedOut) {
      throw new HostCommandError('voice_transcribe_cancelled', 'Local transcription was cancelled because the host daemon is shutting down.');
    }
    if (result.timedOut || result.aborted) {
      throw new HostCommandError('voice_transcribe_timeout', `Local transcription timed out after ${timeoutMs}ms`);
    }
    if (result.exitCode !== 0) {
      const failureDetail = redactLocalPaths(boundedMessage(result.stderr ?? result.output), [dir, deps.modelPath]);
      throw new HostCommandError('voice_transcribe_failed', `Local transcription failed (exit ${result.exitCode ?? 'signal'})${failureDetail ? `: ${failureDetail}` : ''}`);
    }
    let raw: string | null = null;
    try {
      // Capped read: a corrupt multi-GB -otxt file must not exhaust memory.
      raw = readCapped(`${outBase}.txt`, TRANSCRIPT_MAX_BYTES).text;
    } catch {
      raw = null;
    }
    if (!raw) raw = result.output;
    const text = cleanTranscription(raw);
    const detected = language === 'auto' ? parseDetectedLanguage(result.stderr ?? '') : undefined;
    return {
      modelId: command.modelId,
      text,
      detectedLanguage: detected?.language ?? null
    };
  } finally {
    await rm(wavPath, { force: true });
    await rm(outBase, { force: true });
    await rm(`${outBase}.txt`, { force: true });
  }
}
