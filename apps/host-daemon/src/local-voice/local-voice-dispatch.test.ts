import { createHash } from 'node:crypto';
import { chmodSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HOST_RPC_PROTOCOL_VERSION, HostRpcCommandSchema, parseHostRpcResult } from '@zana-ai/zcc-contracts/host-rpc';
import type { VoiceLocalTranscribeCommand } from '@zana-ai/zcc-contracts/host-rpc';
import type { AppConfig } from '@zana-ai/zcc-domain/product';
import { createCommandRuntime, dispatchHostCommand } from '../command-dispatch.js';
import { handleHostRpcRequest } from '../command-router.js';
import { HostCommandError } from '../host-command-error.js';
import { runCaptured, type CapturedRunner, type CapturedRunOptions } from './captured-run.js';
import { LocalVoiceService } from './local-voice-service.js';
import type { VoiceModelEntry } from './model-catalog.js';

const dirs: string[] = [];
afterEach(() => dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true })));

function tempDir(prefix: string): string {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), prefix)));
  dirs.push(dir);
  return dir;
}

/** A Node script standing in for whisper-cli; spawn(shell:false) runs it via process.execPath. */
function fakeWhisperRuntime(config: Partial<AppConfig>) {
  const dataDir = tempDir('zcc-local-voice-');
  const loadConfig = () => ({ version: 1, theme: 'dark', shell: '/bin/zsh', claudeBinary: 'claude', fontSize: 13, lastProjectId: null, ...config }) as AppConfig;
  const fetchImpl = vi.fn<typeof fetch>(async () => new Response('missing', { status: 404 }));
  const localVoice = new LocalVoiceService({ dataDir, loadConfig, store: { fetchImpl } });
  const runtime = createCommandRuntime({ dataDir, loadConfig, localVoice });
  const call = async (command: unknown) => {
    const parsed = HostRpcCommandSchema.parse(command);
    return parseHostRpcResult(parsed.type, await dispatchHostCommand(runtime, parsed));
  };
  return { runtime, call, localVoice, fetchImpl };
}

describe('voice.local.* dispatch', () => {
  it('reports binary and model status from the host config', async () => {
    const binary = join(tempDir('zcc-local-voice-bin-'), 'whisper-cli');
    writeFileSync(binary, 'x');
    chmodSync(binary, 0o755);
    const { call, localVoice } = fakeWhisperRuntime({ voiceWhisperBinary: binary });
    // The configured file is a placeholder, so the --help probe must reject it.
    const status = await call({ type: 'voice.local.status' }) as { binary: { state: string; source: string }; models: Array<{ id: string; state: string }> };
    expect(status.binary).toMatchObject({ state: 'invalid', source: 'config' });
    expect(status.models.map((model) => model.id)).toEqual(['tiny', 'base', 'small', 'medium']);
    expect(status.models.every((model) => model.state === 'not_installed')).toBe(true);
    await localVoice.dispose();
  });

  it('probes a real child process that prints whisper-cli help on stderr', async () => {
    const dir = tempDir('zcc-fake-whisper-');
    const script = join(dir, 'fake-whisper.mjs');
    writeFileSync(script, [
      "if (!process.argv.includes('--help')) process.exit(2);",
      "process.stderr.write('usage: whisper-cli [options] file0 ...\\n');",
      "process.stderr.write('  -m FNAME, --model FNAME\\n  -l LANG, --language LANG\\n  -otxt, --output-txt\\n  -of FNAME, --output-file FNAME\\n');"
    ].join('\n'));
    const dataDir = tempDir('zcc-local-voice-');
    const loadConfig = () => ({ version: 1, theme: 'dark', shell: '/bin/zsh', claudeBinary: 'claude', fontSize: 13, lastProjectId: null, voiceWhisperBinary: process.execPath }) as AppConfig;
    // The resolver validates the configured file (node); the runner injects the script.
    const localVoice = new LocalVoiceService({
      dataDir,
      loadConfig,
      binary: { run: (command, args, options) => runCaptured(command, [script, ...args], options) }
    });
    const runtime = createCommandRuntime({ dataDir, loadConfig, localVoice });
    const result = parseHostRpcResult('voice.local.status', await dispatchHostCommand(runtime, HostRpcCommandSchema.parse({ type: 'voice.local.status' })));
    expect(result).toMatchObject({ binary: { state: 'ready', path: realpathSync(process.execPath), source: 'config' } });
    await localVoice.dispose();
  });

  it('runs download, cancel and delete and returns fresh status each time', async () => {
    const { call, localVoice, fetchImpl } = fakeWhisperRuntime({});
    const started = await call({ type: 'voice.local.model_download', modelId: 'tiny' }) as { models: Array<{ id: string; state: string }> };
    expect(started.models.find((model) => model.id === 'tiny')).toBeDefined();
    await localVoice.models.settled('tiny');
    expect(fetchImpl).toHaveBeenCalledWith(expect.stringContaining('/ggml-tiny.bin'), expect.anything());
    const failed = await call({ type: 'voice.local.status' }) as { models: Array<{ id: string; state: string; error: string | null }> };
    expect(failed.models.find((model) => model.id === 'tiny')).toMatchObject({ state: 'failed', error: expect.stringContaining('404') });

    await call({ type: 'voice.local.model_cancel', modelId: 'tiny' });
    const deleted = await call({ type: 'voice.local.model_delete', modelId: 'tiny' }) as { models: Array<{ id: string; state: string }> };
    expect(deleted.models.find((model) => model.id === 'tiny')?.state).toBe('not_installed');
    await localVoice.dispose();
  });

  it('surfaces busy as a host error code through the router', async () => {
    const { runtime, localVoice } = fakeWhisperRuntime({});
    vi.spyOn(localVoice.models, 'download').mockRejectedValue(new HostCommandError('voice_model_busy', 'busy'));
    const response = await handleHostRpcRequest(runtime, {
      type: 'host-rpc.request',
      protocolVersion: HOST_RPC_PROTOCOL_VERSION,
      requestId: 'r1',
      command: { type: 'voice.local.model_download', modelId: 'base' }
    });
    expect(response).toMatchObject({ ok: false, error: { code: 'voice_model_busy' } });
    await localVoice.dispose();
  });

  it('rejects unknown model ids at the schema', () => {
    expect(HostRpcCommandSchema.safeParse({ type: 'voice.local.model_download', modelId: '../etc' }).success).toBe(false);
    expect(HostRpcCommandSchema.safeParse({ type: 'voice.local.model_download', modelId: 'tiny', path: '/x' }).success).toBe(false);
  });
});

const HELP = [
  'usage: whisper-cli [options] file0 file1 ...',
  '  -m FNAME,  --model FNAME   [models/ggml-base.en.bin] model path',
  '  -l LANG,   --language LANG [en] spoken language',
  '  -otxt,     --output-txt    [false] output result in a text file',
  '  -of FNAME, --output-file FNAME [] output file path (without file extension)'
].join('\n');

/** 1 s of 16-bit PCM mono 16 kHz silence. */
function wavSecond(): Buffer {
  const data = Buffer.alloc(32000);
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(16000, 24);
  header.writeUInt32LE(32000, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

const MODEL_BYTES = Buffer.from('0123456789abcdef');
const TEST_MODEL: VoiceModelEntry = {
  id: 'tiny',
  label: 'Tiny',
  fileName: 'ggml-tiny.bin',
  sizeBytes: MODEL_BYTES.length,
  sha256: createHash('sha256').update(MODEL_BYTES).digest('hex'),
  url: 'https://models.example.test/ggml-tiny.bin'
};

function installedService(parts: {
  config?: Partial<AppConfig>;
  run?: CapturedRunner;
  binaryEnv?: NodeJS.ProcessEnv;
  withModel?: boolean;
  tmpDir?: string;
}): { service: LocalVoiceService; dataDir: string; run: CapturedRunner; release: () => void } {
  const dataDir = tempDir('zcc-local-voice-');
  const tmpDir = parts.tmpDir ?? tempDir('zcc-local-voice-tmp-');
  const loadConfig = () => ({
    version: 1, theme: 'dark', shell: '/bin/zsh', claudeBinary: 'claude',
    fontSize: 13, lastProjectId: null, ...parts.config
  }) as AppConfig;
  let releaseGate: () => void = () => {};
  let gate: Promise<void> | null = null;
  const run: CapturedRunner = parts.run ?? (vi.fn<CapturedRunner>(async (_command, args, options) => {
    if (args.includes('--help')) {
      return { exitCode: 0, signal: null, output: HELP, truncated: false, stderr: null, stderrTruncated: false, timedOut: false, aborted: false };
    }
    // One gate for all runs: the first blocks until release(), later runs pass through.
    gate ??= new Promise<void>((resolve) => { releaseGate = resolve; });
    await gate;
    void options;
    const outBase = args[args.indexOf('-of') + 1]!;
    writeFileSync(`${outBase}.txt`, '[00:00:00.000 --> 00:00:01.000] hello [BLANK_AUDIO]');
    return { exitCode: 0, signal: null, output: '', truncated: false, stderr: '', stderrTruncated: false, timedOut: false, aborted: false };
  }) as CapturedRunner);
  const service = new LocalVoiceService({
    dataDir,
    loadConfig,
    store: { fetchImpl: vi.fn<typeof fetch>(async () => new Response('x', { status: 404 })), catalog: [TEST_MODEL] },
    binary: { run, env: parts.binaryEnv },
    transcribe: { tmpDir }
  });
  if (parts.withModel ?? true) {
    const dir = join(dataDir, 'voice-models', TEST_MODEL.sha256);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, TEST_MODEL.fileName), MODEL_BYTES);
  }
  return { service, dataDir, run, release: () => releaseGate() };
}

function transcribeCommand(): VoiceLocalTranscribeCommand {
  return { type: 'voice.local.transcribe', audioBase64: wavSecond().toString('base64'), modelId: 'tiny', timeoutMs: 120_000 };
}

describe('voice.local.transcribe dispatch', () => {
  it('transcribes through a real child process standing in for whisper-cli', async () => {
    const dir = tempDir('zcc-fake-whisper-');
    const script = join(dir, 'fake-whisper.mjs');
    writeFileSync(script, [
      "import { writeFileSync } from 'node:fs';",
      'const args = process.argv.slice(2);',
      "if (args.includes('--help')) {",
      `  process.stderr.write(${JSON.stringify(HELP)});`,
      '  process.exit(0);',
      '}',
      "const outBase = args[args.indexOf('-of') + 1];",
      "writeFileSync(`${outBase}.txt`, '[00:00:00.000 --> 00:00:01.000] hello [BLANK_AUDIO]');",
      "process.stderr.write('whisper: auto-detected language: en (p = 0.99)');"
    ].join('\n'));
    const dataDir = tempDir('zcc-local-voice-');
    const tmpDir = tempDir('zcc-local-voice-tmp-');
    const loadConfig = () => ({
      version: 1, theme: 'dark', shell: '/bin/zsh', claudeBinary: 'claude',
      fontSize: 13, lastProjectId: null, voiceWhisperBinary: process.execPath
    }) as AppConfig;
    const service = new LocalVoiceService({
      dataDir,
      loadConfig,
      store: { fetchImpl: vi.fn<typeof fetch>(async () => new Response('x', { status: 404 })), catalog: [TEST_MODEL] },
      binary: { run: (command, args, options) => runCaptured(command, [script, ...args], options) },
      transcribe: { tmpDir }
    });
    const modelDir = join(dataDir, 'voice-models', TEST_MODEL.sha256);
    mkdirSync(modelDir, { recursive: true });
    writeFileSync(join(modelDir, TEST_MODEL.fileName), MODEL_BYTES);

    const runtime = createCommandRuntime({ dataDir, loadConfig, localVoice: service });
    const parsed = HostRpcCommandSchema.parse(transcribeCommand());
    const result = parseHostRpcResult(parsed.type, await dispatchHostCommand(runtime, parsed));
    expect(result).toEqual({ modelId: 'tiny', text: 'hello', detectedLanguage: 'en' });
    await service.dispose();
  });

  it('rejects transcription without a binary or model', async () => {
    // Empty environment: no PATH to find, so the binary is missing.
    const missing = installedService({ config: {}, binaryEnv: {}, withModel: false });
    await expect(missing.service.transcribe(transcribeCommand()))
      .rejects.toMatchObject({ code: 'voice_binary_missing' });
    await missing.service.dispose();

    const noModel = installedService({ config: { voiceWhisperBinary: process.execPath }, withModel: false });
    await expect(noModel.service.transcribe(transcribeCommand()))
      .rejects.toMatchObject({ code: 'voice_model_missing' });
    await noModel.service.dispose();
  });

  it('runs one transcription at a time and rejects past three waiters', async () => {
    const { service, run, release } = installedService({ config: { voiceWhisperBinary: process.execPath } });
    const first = service.transcribe(transcribeCommand());
    await vi.waitFor(() => expect(run).toHaveBeenCalled());
    const queued = [service.transcribe(transcribeCommand()), service.transcribe(transcribeCommand()), service.transcribe(transcribeCommand())];
    await expect(service.transcribe(transcribeCommand())).rejects.toMatchObject({ code: 'voice_transcribe_busy' });
    release();
    await expect(first).resolves.toMatchObject({ modelId: 'tiny', text: 'hello' });
    for (const pending of queued) await expect(pending).resolves.toMatchObject({ text: 'hello' });
    await service.dispose();
  });

  it('dispose kills a running whisper-cli child and rejects queued requests', async () => {
    const dir = tempDir('zcc-hanging-whisper-');
    const script = join(dir, 'hanging-whisper.mjs');
    writeFileSync(script, [
      "if (process.argv.includes('--help')) {",
      `  process.stderr.write(${JSON.stringify(HELP)});`,
      '  process.exit(0);',
      '}',
      'setInterval(() => {}, 1000);'
    ].join('\n'));
    const spawned: CapturedRunOptions[] = [];
    const run: CapturedRunner = (command, args, options) => {
      if (!args.includes('--help')) spawned.push(options);
      return runCaptured(command, [script, ...args], options);
    };
    const { service } = installedService({ config: { voiceWhisperBinary: process.execPath }, run });
    const running = service.transcribe(transcribeCommand());
    await vi.waitFor(() => expect(spawned).toHaveLength(1));
    const queued = service.transcribe(transcribeCommand());

    const outcomes = Promise.allSettled([running, queued]);

    const startedAt = Date.now();
    await service.dispose();
    // The child was killed by the shutdown signal, not by the 15s+ timeout.
    expect(Date.now() - startedAt).toBeLessThan(10_000);
    expect(spawned[0]!.signal?.aborted).toBe(true);
    for (const outcome of await outcomes) {
      expect(outcome).toMatchObject({ status: 'rejected', reason: { code: 'voice_transcribe_cancelled' } });
    }
    await expect(service.transcribe(transcribeCommand())).rejects.toMatchObject({ code: 'voice_transcribe_cancelled' });
  });

  it('rejects transcribe payloads without audio at the schema', () => {
    expect(HostRpcCommandSchema.safeParse({ type: 'voice.local.transcribe', modelId: 'tiny', timeoutMs: 1000 }).success).toBe(false);
    expect(HostRpcCommandSchema.safeParse({ ...transcribeCommand(), language: 'EN' }).success).toBe(false);
    expect(HostRpcCommandSchema.safeParse({ ...transcribeCommand(), timeoutMs: 120_001 }).success).toBe(false);
  });
});
