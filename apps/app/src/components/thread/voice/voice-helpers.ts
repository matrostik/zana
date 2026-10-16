export type VoiceInputState = 'idle' | 'recording' | 'transcribing' | 'error';

export const MIN_RECORDING_DURATION_MS = 1_000;
const CHUNK_TIMESLICE_MS = 250;

export function normalizeTranscript(rawText: string): string {
  return rawText.replace(/\s+/g, ' ').trim();
}

export function resolveRecordingErrorMessage(error: unknown, hasPreferredAudioInput = false): string {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
      case 'SecurityError':
        return 'Microphone permission denied';
      case 'NotFoundError':
      case 'DevicesNotFoundError':
        return hasPreferredAudioInput ? 'Selected microphone was not found' : 'No microphone was found';
      case 'NotReadableError':
      case 'TrackStartError':
        return 'Microphone is already in use';
      case 'AbortError':
        return 'Voice capture was aborted';
      default:
        return 'Failed to start voice recording';
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.replace(/\s+/g, ' ').trim();
  }
  return 'Voice input failed';
}

export function voiceStartBlockReason(isSupported: boolean, available: boolean, unavailableReason?: string | null): string | null {
  if (!isSupported) return 'Voice input is not supported in this browser';
  if (!available) return unavailableReason ?? 'Host daemon is not connected';
  return null;
}

/** Human-readable mic-blocked message for a local-engine `voice-status` reason. */
export function voiceUnavailableReason(reason: string | null | undefined): string {
  switch (reason) {
    case 'binary_missing':
      return 'whisper-cli was not found on the host. Install whisper.cpp or set its path in Settings → Experimental.';
    case 'binary_invalid':
      return 'The configured whisper-cli is not usable. Check its path in Settings → Experimental.';
    case 'model_not_installed':
      return 'The Whisper model is not downloaded yet. Download it in Settings → Experimental.';
    case 'model_downloading':
      return 'The Whisper model is still downloading. Try again when it finishes.';
    case 'model_failed':
      return 'The Whisper model download failed. Retry it in Settings → Experimental.';
    case 'daemon_outdated':
      return 'Update the host daemon to use local transcription.';
    case 'ambiguous_host':
      return 'Several hosts are connected. Open this project from one of them to dictate.';
    case 'status_failed':
      return 'Could not reach the host. Reconnect and try again.';
    case 'no_host':
    default:
      return 'Host daemon is not connected';
  }
}

export interface VoiceStatusSnapshot {
  enabled: boolean;
  engine?: string;
  ready?: boolean;
  reason?: string | null;
}

/** The mic starts only when the host is connected and the engine is ready (local needs its binary + model). */
export function voiceStatusAvailable(status: VoiceStatusSnapshot): boolean {
  return status.enabled && (status.engine !== 'local' || status.ready === true);
}

/** Block message for a status snapshot; null when dictation can start. */
export function voiceStatusBlockReason(status: VoiceStatusSnapshot): string | null {
  if (!status.enabled) return voiceUnavailableReason('no_host');
  if (status.engine === 'local' && status.ready !== true) return voiceUnavailableReason(status.reason);
  return null;
}

export function resolvePreferredAudioMimeType(): string | null {
  if (typeof MediaRecorder === 'undefined') return null;
  for (const candidate of ['audio/webm', 'audio/mp4', 'audio/ogg']) {
    if (MediaRecorder.isTypeSupported(candidate)) return candidate;
  }
  return null;
}

export function createRecordingFile(audioBlob: Blob, mimeType: string): File {
  const extension = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') ? 'mp4' : 'webm';
  return new File([audioBlob], `recording.${extension}`, { type: mimeType });
}

export async function fileToBase64(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export { CHUNK_TIMESLICE_MS };

export const SPEECH_SAMPLE_RATE = 16_000;
/** ~14 minutes at 16 kHz mono 16-bit; stays under the 25 MB daemon audio cap. */
export const SPEECH_MAX_SECONDS = 60 * 14;

export interface SpeechWavDeps {
  AudioContextClass?: typeof AudioContext;
  OfflineAudioContextClass?: typeof OfflineAudioContext;
}

function speechAudioContexts(deps: SpeechWavDeps): {
  AudioContextClass: typeof AudioContext;
  OfflineAudioContextClass: typeof OfflineAudioContext;
} {
  const scope = typeof window !== 'undefined' ? (window as unknown as Record<string, unknown>) : {};
  const AudioContextClass = deps.AudioContextClass
    ?? (scope.AudioContext as typeof AudioContext | undefined)
    ?? (scope.webkitAudioContext as typeof AudioContext | undefined);
  const OfflineAudioContextClass = deps.OfflineAudioContextClass
    ?? (scope.OfflineAudioContext as typeof OfflineAudioContext | undefined)
    ?? (scope.webkitOfflineAudioContext as typeof OfflineAudioContext | undefined);
  if (!AudioContextClass || !OfflineAudioContextClass) {
    throw new Error('Local transcription needs Web Audio support, which this browser does not provide.');
  }
  return { AudioContextClass, OfflineAudioContextClass };
}

/** Encodes mono float samples as a 16-bit PCM WAV blob. */
export function encodeWav16(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeAscii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };
  writeAscii(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeAscii(8, 'WAVE');
  writeAscii(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i] ?? 0));
    view.setInt16(44 + i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Converts a recorded container (webm/mp4/ogg) to 16 kHz mono 16-bit PCM WAV
 * for the local transcription engine. Resampling and downmix happen in the
 * OfflineAudioContext; retry re-runs this on the original recording.
 */
export async function convertToSpeechWav(blob: Blob, deps: SpeechWavDeps = {}): Promise<Blob> {
  const { AudioContextClass, OfflineAudioContextClass } = speechAudioContexts(deps);
  const bytes = await blob.arrayBuffer();
  const decoder = new AudioContextClass();
  let audio: AudioBuffer;
  try {
    audio = await decoder.decodeAudioData(bytes);
  } catch {
    throw new Error('Could not decode the recording. Record again and retry.');
  } finally {
    await decoder.close().catch(() => {});
  }
  if (!Number.isFinite(audio.duration) || audio.duration <= 0 || audio.duration > SPEECH_MAX_SECONDS) {
    throw new Error('The recording is too long for local transcription.');
  }
  const offline = new OfflineAudioContextClass(1, Math.max(1, Math.ceil(audio.duration * SPEECH_SAMPLE_RATE)), SPEECH_SAMPLE_RATE);
  const source = offline.createBufferSource();
  source.buffer = audio;
  source.connect(offline.destination);
  source.start(0);
  const rendered = await offline.startRendering();
  return encodeWav16(rendered.getChannelData(0), SPEECH_SAMPLE_RATE);
}
