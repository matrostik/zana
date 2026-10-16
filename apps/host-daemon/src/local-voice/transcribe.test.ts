import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { VoiceLocalTranscribeCommand } from '@zana-ai/zcc-contracts/host-rpc';
import type { CapturedRunner } from './captured-run.js';
import {
  cleanTranscription,
  decodeCp437Mojibake,
  decodeTranscribeAudio,
  parseDetectedLanguage,
  parseWavHeader,
  runLocalTranscription,
  transcribeThreadCount
} from './transcribe.js';

/** Minimal 16-bit PCM mono 16 kHz WAV with `seconds` of silence. */
function wavBuffer(seconds: number, overrides: { format?: number; bits?: number; extraChunk?: boolean } = {}): Buffer {
  const sampleRate = 16000;
  const dataBytes = sampleRate * 2 * seconds;
  const chunks: Buffer[] = [];
  const riff = Buffer.alloc(12);
  riff.write('RIFF', 0);
  riff.write('WAVE', 8);
  chunks.push(riff);
  if (overrides.extraChunk) {
    const junk = Buffer.alloc(12);
    junk.write('JUNK', 0);
    junk.writeUInt32LE(4, 4);
    chunks.push(junk);
  }
  const fmt = Buffer.alloc(24);
  fmt.write('fmt ', 0);
  fmt.writeUInt32LE(16, 4);
  fmt.writeUInt16LE(overrides.format ?? 1, 8);
  fmt.writeUInt16LE(1, 10);
  fmt.writeUInt32LE(sampleRate, 12);
  fmt.writeUInt32LE(sampleRate * 2, 16);
  fmt.writeUInt16LE(2, 20);
  fmt.writeUInt16LE(overrides.bits ?? 16, 22);
  chunks.push(fmt);
  const data = Buffer.alloc(8 + dataBytes);
  data.write('data', 0);
  data.writeUInt32LE(dataBytes, 4);
  chunks.push(data);
  const wav = Buffer.concat(chunks);
  wav.writeUInt32LE(wav.length - 8, 4);
  return wav;
}

/** Runs a sync function, returning the HostCommandError code it throws (or undefined). */
function throwCode(fn: () => unknown): string | undefined {
  try {
    fn();
    return undefined;
  } catch (error) {
    return (error as { code?: string }).code;
  }
}

function command(audio: Buffer, more: Partial<VoiceLocalTranscribeCommand> = {}): VoiceLocalTranscribeCommand {
  return { type: 'voice.local.transcribe', audioBase64: audio.toString('base64'), modelId: 'tiny', timeoutMs: 120_000, ...more };
}

function successRun(transcript: string, stderr = ''): ReturnType<typeof vi.fn<CapturedRunner>> {
  return vi.fn<CapturedRunner>(async (_command, args) => {
    const outBase = args[args.indexOf('-of') + 1]!;
    const { writeFileSync } = await import('node:fs');
    writeFileSync(`${outBase}.txt`, transcript);
    return { exitCode: 0, signal: null, output: '', truncated: false, stderr, stderrTruncated: false, timedOut: false, aborted: false };
  });
}

const dirs: string[] = [];
afterEach(() => dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true })));
function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'zcc-whisper-run-'));
  dirs.push(dir);
  return dir;
}

describe('parseWavHeader', () => {
  it('reports duration from the data chunk', () => {
    expect(parseWavHeader(wavBuffer(3))).toMatchObject({ durationMs: 3000, sampleRate: 16000, channels: 1 });
  });

  it('skips unknown chunks before fmt', () => {
    expect(parseWavHeader(wavBuffer(1, { extraChunk: true })).durationMs).toBe(1000);
  });

  it.each([
    ['non-WAV bytes', Buffer.from('not audio at all, just text...........' + 'x'.repeat(20))],
    ['truncated header', wavBuffer(1).subarray(0, 20)],
    ['float format', wavBuffer(1, { format: 3 })],
    ['8-bit samples', wavBuffer(1, { bits: 8 })]
  ])('rejects %s', (_label, audio) => {
    expect(throwCode(() => parseWavHeader(audio))).toBe('invalid_request');
  });
});

describe('decodeTranscribeAudio', () => {
  it('rejects empty and oversized payloads', () => {
    expect(throwCode(() => decodeTranscribeAudio(command(Buffer.alloc(0))))).toBe('invalid_request');
    const big = { ...command(wavBuffer(0)), audioBase64: Buffer.alloc(26 * 1024 * 1024).toString('base64') };
    expect(throwCode(() => decodeTranscribeAudio(big))).toBe('invalid_request');
  });
});

describe('transcribeThreadCount', () => {
  it('uses up to 4 threads and always at least 1', () => {
    expect(transcribeThreadCount(1)).toBe(1);
    expect(transcribeThreadCount(2)).toBe(1);
    expect(transcribeThreadCount(8)).toBe(4);
    expect(transcribeThreadCount(64)).toBe(4);
  });
});

describe('cleanTranscription', () => {
  it('strips timestamps, non-speech tokens and normalizes whitespace', () => {
    expect(cleanTranscription('[00:00:00.000 --> 00:00:05.000]  hello   [BLANK_AUDIO] (music) world'))
      .toBe('hello world');
    expect(cleanTranscription('')).toBe('');
    expect(cleanTranscription('[silence]')).toBe('');
  });

  it('recovers CP437 mojibake', () => {
    // D0 B4 (Cyrillic de, U+0434) mis-decoded as CP437 box-drawing glyphs.
    expect(decodeCp437Mojibake('\u2568\u2524')).toBe('\u0434');
    expect(decodeCp437Mojibake('plain ascii')).toBe('plain ascii');
  });
});

describe('parseDetectedLanguage', () => {
  it('parses whisper.cpp auto-detect lines', () => {
    expect(parseDetectedLanguage('whisper: auto-detected language: fr (p = 0.98)')).toEqual({ language: 'fr', confidence: 0.98 });
    expect(parseDetectedLanguage('auto-detected language: EN')).toEqual({ language: 'en' });
    expect(parseDetectedLanguage('whisper_init(all good)')).toBeUndefined();
  });
});

describe('runLocalTranscription', () => {
  it('runs whisper-cli with the model, audio, language and threads, then cleans the transcript', async () => {
    const dir = tempDir();
    const run = successRun('[00:00:00.000 --> 00:00:01.000] hello [BLANK_AUDIO] world');
    const result = await runLocalTranscription(command(wavBuffer(2), { language: 'fr' }), {
      binaryPath: '/bin/whisper-cli',
      modelPath: '/models/ggml-tiny.bin',
      run,
      cpuCount: 8,
      tmpDir: dir
    });
    expect(result).toEqual({ modelId: 'tiny', text: 'hello world', detectedLanguage: null });
    const args = run.mock.calls[0]![1] as string[];
    expect(args).toEqual([
      '-m', '/models/ggml-tiny.bin',
      '-f', expect.stringMatching(/zcc-whisper-.*\.wav$/),
      '-l', 'fr',
      '-nt',
      '-t', '4',
      '-otxt', '-of', expect.stringMatching(/zcc-whisper-.*\.out$/)
    ]);
    expect(run.mock.calls[0]![0]).toBe('/bin/whisper-cli');
    expect(readdirSync(dir)).toEqual([]);
  });

  it('auto-detects language by default and reports what whisper detected', async () => {
    const run = successRun('bonjour', 'whisper: auto-detected language: fr (p = 0.91)');
    const result = await runLocalTranscription(command(wavBuffer(1)), {
      binaryPath: '/bin/whisper-cli',
      modelPath: '/m.bin',
      run,
      tmpDir: tempDir()
    });
    expect(result.detectedLanguage).toBe('fr');
    expect((run.mock.calls[0]![1] as string[])).toContain('auto');
  });

  it('bounds the child timeout by audio length', async () => {
    const run = successRun('hi');
    await runLocalTranscription(command(wavBuffer(60 * 10)), {
      binaryPath: '/bin/whisper-cli', modelPath: '/m.bin', run, tmpDir: tempDir()
    });
    // 15s + 2×600s exceeds the 120s command cap.
    expect(run.mock.calls[0]![2]).toMatchObject({ timeoutMs: 120_000 });

    run.mockClear();
    await runLocalTranscription(command(wavBuffer(2)), {
      binaryPath: '/bin/whisper-cli', modelPath: '/m.bin', run, tmpDir: tempDir()
    });
    expect(run.mock.calls[0]![2]).toMatchObject({ timeoutMs: 19_000 });
  });

  it('falls back to stdout when -otxt writes nothing', async () => {
    const run = vi.fn<CapturedRunner>(async () => ({
      exitCode: 0, signal: null, output: 'spoken words', truncated: false,
      stderr: '', stderrTruncated: false, timedOut: false, aborted: false
    }));
    const result = await runLocalTranscription(command(wavBuffer(1)), {
      binaryPath: '/bin/whisper-cli', modelPath: '/m.bin', run, tmpDir: tempDir()
    });
    expect(result.text).toBe('spoken words');
  });

  it('returns empty text for silence instead of failing', async () => {
    const result = await runLocalTranscription(command(wavBuffer(1)), {
      binaryPath: '/bin/whisper-cli',
      modelPath: '/m.bin',
      run: successRun('   [silence]  '),
      tmpDir: tempDir()
    });
    expect(result.text).toBe('');
  });

  it('maps failures, timeouts and bad audio to host error codes', async () => {
    const dir = tempDir();
    const failing = vi.fn<CapturedRunner>(async () => ({
      exitCode: 1, signal: null, output: '', truncated: false,
      stderr: 'error: failed to load model: file too short', stderrTruncated: false, timedOut: false, aborted: false
    }));
    await expect(runLocalTranscription(command(wavBuffer(1)), {
      binaryPath: '/bin/whisper-cli', modelPath: '/m.bin', run: failing, tmpDir: dir
    })).rejects.toMatchObject({ code: 'voice_transcribe_failed', message: expect.stringContaining('failed to load model') });
    expect(readdirSync(dir)).toEqual([]);

    const hanging = vi.fn<CapturedRunner>(async () => ({
      exitCode: null, signal: 'SIGKILL', output: '', truncated: false,
      stderr: '', stderrTruncated: false, timedOut: true, aborted: false
    }));
    await expect(runLocalTranscription(command(wavBuffer(1)), {
      binaryPath: '/bin/whisper-cli', modelPath: '/m.bin', run: hanging, tmpDir: dir
    })).rejects.toMatchObject({ code: 'voice_transcribe_timeout' });
    expect(readdirSync(dir)).toEqual([]);

    const run = successRun('hi');
    await expect(runLocalTranscription(command(Buffer.from('not wav')), {
      binaryPath: '/bin/whisper-cli', modelPath: '/m.bin', run, tmpDir: dir
    })).rejects.toMatchObject({ code: 'invalid_request' });
    expect(run).not.toHaveBeenCalled();
    expect(readdirSync(dir)).toEqual([]);
  });

  it('truncates runaway transcripts', async () => {
    const result = await runLocalTranscription(command(wavBuffer(1)), {
      binaryPath: '/bin/whisper-cli',
      modelPath: '/m.bin',
      run: successRun('a'.repeat(2 * 1024 * 1024)),
      tmpDir: tempDir()
    });
    expect(result.text).toHaveLength(1024 * 1024);
  });
});
