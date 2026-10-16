import { chmodSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HOST_RPC_PROTOCOL_VERSION, HostRpcCommandSchema, parseHostRpcResult } from '@zana-ai/zcc-contracts/host-rpc';
import type { AppConfig } from '@zana-ai/zcc-domain/product';
import { createCommandRuntime, dispatchHostCommand } from '../command-dispatch.js';
import { handleHostRpcRequest } from '../command-router.js';
import { HostCommandError } from '../host-command-error.js';
import { runCaptured } from './captured-run.js';
import { LocalVoiceService } from './local-voice-service.js';

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
