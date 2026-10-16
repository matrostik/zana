import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  convertToSpeechWav,
  createRecordingFile,
  encodeWav16,
  fileToBase64,
  MIN_RECORDING_DURATION_MS,
  normalizeTranscript,
  resolvePreferredAudioMimeType,
  resolveRecordingErrorMessage,
  voiceStartBlockReason,
  voiceStatusAvailable,
  voiceStatusBlockReason,
  voiceUnavailableReason
} from './voice-helpers.js';
import { VoiceRecordingBar } from './VoiceRecordingBar.js';

describe('voice helpers', () => {
  it('normalizes transcript whitespace and maps mic errors', () => {
    expect(normalizeTranscript('  hello   world\n')).toBe('hello world');
    expect(MIN_RECORDING_DURATION_MS).toBe(1000);
    expect(resolveRecordingErrorMessage(new DOMException('denied', 'NotAllowedError')))
      .toBe('Microphone permission denied');
    expect(resolveRecordingErrorMessage(new DOMException('sec', 'SecurityError')))
      .toBe('Microphone permission denied');
    expect(resolveRecordingErrorMessage(new DOMException('gone', 'NotFoundError'), true))
      .toBe('Selected microphone was not found');
    expect(resolveRecordingErrorMessage(new DOMException('gone', 'DevicesNotFoundError')))
      .toBe('No microphone was found');
    expect(resolveRecordingErrorMessage(new DOMException('busy', 'TrackStartError')))
      .toBe('Microphone is already in use');
    expect(resolveRecordingErrorMessage(new DOMException('busy', 'NotReadableError')))
      .toBe('Microphone is already in use');
    expect(resolveRecordingErrorMessage(new DOMException('abort', 'AbortError')))
      .toBe('Voice capture was aborted');
    expect(resolveRecordingErrorMessage(new DOMException('other', 'OtherError')))
      .toBe('Failed to start voice recording');
    expect(resolveRecordingErrorMessage(new Error('  boom  '))).toBe('boom');
    expect(resolveRecordingErrorMessage(null)).toBe('Voice input failed');
    expect(voiceStartBlockReason(false, true)).toBe('Voice input is not supported in this browser');
    expect(voiceStartBlockReason(true, false)).toBe('Host daemon is not connected');
    expect(voiceStartBlockReason(true, true)).toBeNull();
  });

  it('names the recording file from the mime type', () => {
    expect(createRecordingFile(new Blob(['a']), 'audio/webm').name).toBe('recording.webm');
    expect(createRecordingFile(new Blob(['a']), 'audio/mp4').name).toBe('recording.mp4');
    expect(createRecordingFile(new Blob(['a']), 'audio/ogg').name).toBe('recording.ogg');
  });

  it('encodes a file as base64', async () => {
    const file = createRecordingFile(new Blob(['hi']), 'audio/webm');
    await expect(fileToBase64(file)).resolves.toBe(btoa('hi'));
  });

  it('picks a supported audio mime type', () => {
    expect(resolvePreferredAudioMimeType()).toBeNull();
    (globalThis as { MediaRecorder?: { isTypeSupported: (type: string) => boolean } }).MediaRecorder = {
      isTypeSupported: (type) => type === 'audio/mp4'
    };
    expect(resolvePreferredAudioMimeType()).toBe('audio/mp4');
    delete (globalThis as { MediaRecorder?: unknown }).MediaRecorder;
  });

  it('maps local-engine status to availability and block messages', () => {
    expect(voiceStatusAvailable({ enabled: true })).toBe(true);
    expect(voiceStatusAvailable({ enabled: true, engine: 'local', ready: true })).toBe(true);
    expect(voiceStatusAvailable({ enabled: true, engine: 'local', ready: false })).toBe(false);
    expect(voiceStatusAvailable({ enabled: false })).toBe(false);
    expect(voiceStatusBlockReason({ enabled: true })).toBeNull();
    expect(voiceStatusBlockReason({ enabled: false })).toBe('Host daemon is not connected');
    expect(voiceStatusBlockReason({ enabled: true, engine: 'local', ready: false, reason: 'binary_missing' }))
      .toContain('whisper-cli was not found');
    expect(voiceStatusBlockReason({ enabled: true, engine: 'local', ready: false, reason: 'model_downloading' }))
      .toContain('still downloading');
    expect(voiceStatusBlockReason({ enabled: true, engine: 'local', ready: false, reason: 'daemon_outdated' }))
      .toContain('Update the host daemon');
    expect(voiceUnavailableReason('model_not_installed')).toContain('not downloaded');
    expect(voiceUnavailableReason(undefined)).toBe('Host daemon is not connected');
    expect(voiceStartBlockReason(true, false, 'custom reason')).toBe('custom reason');
    expect(voiceStartBlockReason(true, false)).toBe('Host daemon is not connected');
  });

  it('encodes 16-bit PCM WAV with a valid header', async () => {
    const wav = encodeWav16(new Float32Array([0, 0.5, -0.5, 1, -1]), 16000);
    expect(wav.type).toBe('audio/wav');
    const bytes = new Uint8Array(await wav.arrayBuffer());
    const ascii = (at: number, len: number) => String.fromCharCode(...bytes.subarray(at, at + len));
    expect(ascii(0, 4)).toBe('RIFF');
    expect(ascii(8, 4)).toBe('WAVE');
    expect(ascii(12, 4)).toBe('fmt ');
    expect(new DataView(bytes.buffer).getUint16(20, true)).toBe(1);
    expect(new DataView(bytes.buffer).getUint16(34, true)).toBe(16);
    expect(ascii(36, 4)).toBe('data');
    expect(bytes.length).toBe(44 + 5 * 2);
    const samples = new DataView(bytes.buffer);
    expect(samples.getInt16(44, true)).toBe(0);
    expect(samples.getInt16(46, true)).toBe(16383);
    expect(samples.getInt16(48, true)).toBe(-16384);
    expect(samples.getInt16(50, true)).toBe(32767);
    expect(samples.getInt16(52, true)).toBe(-32768);
  });

  it('converts a recording to 16 kHz mono WAV and rejects bad input', async () => {
    const rendered = { getChannelData: () => new Float32Array([0.25]) };
    const calls: Array<{ channels: number; length: number; rate: number }> = [];
    const deps = {
      AudioContextClass: class {
        decodeAudioData = async () => ({ duration: 2, sampleRate: 48000 });
        close = async () => undefined;
      } as unknown as typeof AudioContext,
      OfflineAudioContextClass: class {
        constructor(channels: number, length: number, rate: number) {
          calls.push({ channels, length, rate });
        }
        createBufferSource = () => ({ buffer: null, connect: () => undefined, start: () => undefined });
        destination = {};
        startRendering = async () => rendered;
      } as unknown as typeof OfflineAudioContext
    };
    const wav = await convertToSpeechWav(new Blob(['fake']), deps);
    expect(calls).toEqual([{ channels: 1, length: 32000, rate: 16000 }]);
    expect(new Uint8Array(await wav.arrayBuffer()).length).toBe(44 + 2);

    await expect(convertToSpeechWav(new Blob(['x']), {})).rejects.toThrow('Web Audio');
    await expect(convertToSpeechWav(new Blob(['x']), {
      AudioContextClass: class {
        decodeAudioData = async () => { throw new Error('nope'); };
        close = async () => undefined;
      } as unknown as typeof AudioContext,
      OfflineAudioContextClass: deps.OfflineAudioContextClass
    })).rejects.toThrow('Could not decode');
    await expect(convertToSpeechWav(new Blob(['x']), {
      AudioContextClass: class {
        decodeAudioData = async () => ({ duration: 0, sampleRate: 48000 });
        close = async () => undefined;
      } as unknown as typeof AudioContext,
      OfflineAudioContextClass: deps.OfflineAudioContextClass
    })).rejects.toThrow('contains no audio');
    await expect(convertToSpeechWav(new Blob(['x']), {
      AudioContextClass: class {
        decodeAudioData = async () => ({ duration: -2, sampleRate: 48000 });
        close = async () => undefined;
      } as unknown as typeof AudioContext,
      OfflineAudioContextClass: deps.OfflineAudioContextClass
    })).rejects.toThrow('contains no audio');
    await expect(convertToSpeechWav(new Blob(['x']), {
      AudioContextClass: class {
        decodeAudioData = async () => ({ duration: 60 * 60, sampleRate: 48000 });
        close = async () => undefined;
      } as unknown as typeof AudioContext,
      OfflineAudioContextClass: deps.OfflineAudioContextClass
    })).rejects.toThrow('too long');
  });
});

describe('voice recording bar', () => {
  it('renders cancel and confirm while recording', () => {
    const html = renderToStaticMarkup(
      <VoiceRecordingBar
        state="recording"
        stream={null}
        onConfirm={() => undefined}
        onCancel={() => undefined}
      />
    );
    expect(html).toContain('thread-voice-bar');
    expect(html).toContain('Cancel recording');
    expect(html).toContain('Stop and transcribe recording');
    expect(html).toContain('Recording');
  });

  it('disables confirm and announces transcription', () => {
    const html = renderToStaticMarkup(
      <VoiceRecordingBar
        state="transcribing"
        stream={null}
        onConfirm={() => undefined}
        onCancel={() => undefined}
      />
    );
    expect(html).toContain('Cancel transcription');
    expect(html).toContain('Transcribing voice input');
    expect(html).toContain('disabled');
  });
});
