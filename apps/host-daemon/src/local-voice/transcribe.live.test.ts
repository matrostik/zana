import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { runLocalTranscription } from './transcribe.js';

// Opt-in: needs a real whisper.cpp binary and model, e.g.
//   ZCC_WHISPER_CLI=/opt/homebrew/bin/whisper-cli \
//   ZCC_WHISPER_MODEL=~/.zcc/voice-models/<sha256>/ggml-tiny.bin \
//   pnpm exec vitest run apps/host-daemon/src/local-voice/transcribe.live.test.ts
const binaryPath = process.env.ZCC_WHISPER_CLI;
const modelPath = process.env.ZCC_WHISPER_MODEL;

describe.skipIf(!binaryPath || !modelPath)('live whisper-cli transcription', () => {
  it('runs the real binary on silence and leaves no temp files', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'zcc-whisper-live-'));
    try {
      const samples = 16_000;
      const header = Buffer.alloc(44);
      header.write('RIFF', 0);
      header.writeUInt32LE(36 + samples * 2, 4);
      header.write('WAVE', 8);
      header.write('fmt ', 12);
      header.writeUInt32LE(16, 16);
      header.writeUInt16LE(1, 20);
      header.writeUInt16LE(1, 22);
      header.writeUInt32LE(16_000, 24);
      header.writeUInt32LE(32_000, 28);
      header.writeUInt16LE(2, 32);
      header.writeUInt16LE(16, 34);
      header.write('data', 36);
      header.writeUInt32LE(samples * 2, 40);
      const audio = Buffer.concat([header, Buffer.alloc(samples * 2)]);
      const result = await runLocalTranscription(
        { type: 'voice.local.transcribe', audioBase64: audio.toString('base64'), modelId: 'tiny', timeoutMs: 120_000 },
        { binaryPath: binaryPath!, modelPath: modelPath!, tmpDir: dir }
      );
      expect(result.modelId).toBe('tiny');
      expect(typeof result.text).toBe('string');
      expect(readdirSync(dir)).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
