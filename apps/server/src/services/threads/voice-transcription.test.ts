import { describe, expect, it, vi } from 'vitest';
import { HostRpcCommandSchema } from '@zana-ai/zcc-contracts/host-rpc';
import { HostUnavailableError, AmbiguousHostError } from '../../http/host-hub.js';
import type { ProductHttpContext } from '../../http/product-context.js';
import { transcribeVoiceOnHost, VoiceTranscriptionError, voiceEngine, voiceLanguageHint, voiceLocalModel, voiceStatus, voiceTranscriptionEnabled } from './voice-transcription.js';
import { VOICE_TRANSCRIPTION_MAX_BYTES } from '../../http/multipart-voice.js';

function ctx(overrides: {
  connected?: string[];
  voiceModel?: string;
  voiceLanguage?: string;
  voiceEngine?: string;
  voiceLocalModel?: string;
  rpc?: ReturnType<typeof vi.fn>;
}): ProductHttpContext {
  const connected = overrides.connected ?? ['host-1'];
  return {
    hostHub: {
      connectedHostIds: () => connected,
      resolveHostId: () => {
        if (connected.length === 0) throw new HostUnavailableError();
        return connected[0]!;
      },
      callHostOnlineRpc: overrides.rpc ?? vi.fn(async () => ({ model: 'gpt-transcribe', text: 'hello' }))
    },
    config: {
      getConfig: () => ({
        voiceModel: overrides.voiceModel,
        voiceLanguage: overrides.voiceLanguage,
        voiceEngine: overrides.voiceEngine,
        voiceLocalModel: overrides.voiceLocalModel
      })
    }
  } as unknown as ProductHttpContext;
}

function localStatus(overrides: { binary?: string; model?: string } = {}) {
  return {
    binary: { state: overrides.binary ?? 'ready', path: '/usr/local/bin/whisper-cli', source: 'known' as const, message: null },
    models: [
      { id: 'tiny', label: 'Tiny', sizeBytes: 77691713, state: 'installed', receivedBytes: null, error: null },
      { id: 'base', label: 'Base', sizeBytes: 147951465, state: overrides.model ?? 'installed', receivedBytes: null, error: null }
    ]
  };
}

describe('voice transcription service', () => {
  it('preserves Keychain access guidance instead of asking an already signed-in user to sign in', async () => {
    const rpc = vi.fn(async () => {
      throw Object.assign(new Error('Unlock Keychain on your Mac, then try again.'), { code: 'codex_keyring_unavailable' });
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc }), {
      bytes: Buffer.from('audio'), mimeType: 'audio/mp4', filename: 'recording.mp4'
    })).rejects.toMatchObject({ status: 503, code: 'codex_keyring_unavailable', message: 'Unlock Keychain on your Mac, then try again.' });
  });
  it('reports enabled only when a host is connected', () => {
    expect(voiceTranscriptionEnabled(ctx({ connected: [] }))).toBe(false);
    expect(voiceTranscriptionEnabled(ctx({ connected: ['h1'] }))).toBe(true);
  });

  it('RPCs the host with base64 audio and returns text', async () => {
    const rpc = vi.fn(async () => ({ model: 'gpt-transcribe', text: 'hello' }));
    await expect(transcribeVoiceOnHost(ctx({ rpc }), {
      bytes: Buffer.from('audio'),
      mimeType: 'audio/webm',
      filename: 'recording.webm',
      prompt: ' context '
    })).resolves.toBe('hello');
    expect(rpc).toHaveBeenCalledWith(expect.objectContaining({
      hostId: 'host-1',
      command: expect.objectContaining({
        type: 'codex.voice.transcribe',
        model: 'gpt-transcribe',
        mimeType: 'audio/webm',
        prompt: 'context'
      })
    }));
  });

  it('sends a schema-valid command with time for the RPC to return its result', async () => {
    const rpc = vi.fn(async ({ command, timeoutMs }) => {
      const parsed = HostRpcCommandSchema.parse(command);
      expect(parsed.type).toBe('codex.voice.transcribe');
      expect(timeoutMs).toBeGreaterThan(command.timeoutMs);
      return { model: command.model, text: 'transcribed' };
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc }), {
      bytes: Buffer.from('audio'), mimeType: 'audio/mp4', filename: 'recording.mp4'
    })).resolves.toBe('transcribed');
    expect(rpc).toHaveBeenCalledOnce();
  });

  it('sends the configured language and omits it when unset or invalid', async () => {
    const audio = { bytes: Buffer.from('audio'), mimeType: 'audio/webm', filename: 'recording.webm' };
    const rpc = vi.fn(async ({ command }) => {
      HostRpcCommandSchema.parse(command);
      return { model: command.model, text: 'ok' };
    });
    await transcribeVoiceOnHost(ctx({ rpc, voiceLanguage: ' FR ' }), audio);
    expect(rpc.mock.calls[0]![0].command.language).toBe('fr');

    for (const voiceLanguage of [undefined, '', 'english']) {
      rpc.mockClear();
      await transcribeVoiceOnHost(ctx({ rpc, voiceLanguage }), audio);
      expect(rpc.mock.calls[0]![0].command).not.toHaveProperty('language');
    }
  });

  it('normalizes language hints', () => {
    expect(voiceLanguageHint('EN')).toBe('en');
    expect(voiceLanguageHint(' haw ')).toBe('haw');
    expect(voiceLanguageHint(undefined)).toBeNull();
    expect(voiceLanguageHint('')).toBeNull();
    expect(voiceLanguageHint('en-US')).toBeNull();
  });

  it('rejects empty audio and maps missing Codex auth to 501', async () => {
    await expect(transcribeVoiceOnHost(ctx({}), {
      bytes: Buffer.alloc(0),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    })).rejects.toMatchObject({ status: 400, code: 'invalid_request' });

    const rpc = vi.fn(async () => {
      throw Object.assign(new Error('missing'), { code: 'codex_auth_missing' });
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc }), {
      bytes: Buffer.from('audio'),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    })).rejects.toBeInstanceOf(VoiceTranscriptionError);
    await expect(transcribeVoiceOnHost(ctx({ rpc }), {
      bytes: Buffer.from('audio'),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    })).rejects.toMatchObject({
      status: 501,
      code: 'codex_auth_missing'
    });
  });

  it('maps a disconnected host to 503', async () => {
    await expect(transcribeVoiceOnHost(ctx({ connected: [] }), {
      bytes: Buffer.from('audio'),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    })).rejects.toMatchObject({ status: 503, code: 'host-unavailable' });
  });

  it('rejects oversized audio and uses a configured model', async () => {
    await expect(transcribeVoiceOnHost(ctx({}), {
      bytes: Buffer.alloc(VOICE_TRANSCRIPTION_MAX_BYTES + 1),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    })).rejects.toMatchObject({ status: 400, code: 'invalid_request' });

    const rpc = vi.fn(async () => ({ model: 'whisper-1', text: 'ok' }));
    await transcribeVoiceOnHost(ctx({ voiceModel: 'whisper-1', rpc }), {
      bytes: Buffer.from('audio'),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    });
    expect(rpc).toHaveBeenCalledWith(expect.objectContaining({
      command: expect.objectContaining({ model: 'whisper-1' })
    }));
  });

  it('maps remaining host errors', async () => {
    const timeout = vi.fn(async () => {
      throw Object.assign(new Error('slow'), { code: 'codex_request_timeout' });
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc: timeout }), {
      bytes: Buffer.from('audio'),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    })).rejects.toMatchObject({ status: 504, code: 'codex_request_timeout' });

    const limited = vi.fn(async () => {
      throw Object.assign(new Error('slow down'), { code: 'codex_rate_limited' });
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc: limited }), {
      bytes: Buffer.from('audio'),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    })).rejects.toMatchObject({ status: 503, code: 'codex_rate_limited' });

    const down = vi.fn(async () => {
      throw Object.assign(new Error('down'), { code: 'codex_service_unavailable' });
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc: down }), {
      bytes: Buffer.from('audio'),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    })).rejects.toMatchObject({ status: 503 });

    const invalid = vi.fn(async () => {
      throw Object.assign(new Error('bad'), { code: 'codex_auth_invalid' });
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc: invalid }), {
      bytes: Buffer.from('audio'),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    })).rejects.toMatchObject({ status: 501, code: 'codex_auth_invalid' });

    const ambiguous = {
      ...ctx({}),
      hostHub: {
        connectedHostIds: () => ['a', 'b'],
        resolveHostId: () => { throw new AmbiguousHostError(); },
        callHostOnlineRpc: vi.fn()
      }
    } as unknown as ProductHttpContext;
    await expect(transcribeVoiceOnHost(ambiguous, {
      bytes: Buffer.from('audio'),
      mimeType: 'audio/webm',
      filename: 'recording.webm'
    })).rejects.toMatchObject({ status: 409, code: 'ambiguous-host' });
  });
});

describe('local voice transcription', () => {
  const audio = { bytes: Buffer.from('audio'), mimeType: 'audio/wav', filename: 'recording.wav' };

  it('defaults to cloud and treats unknown engines as cloud', () => {
    expect(voiceEngine(ctx({}))).toBe('cloud');
    expect(voiceEngine(ctx({ voiceEngine: 'whisper' }))).toBe('cloud');
    expect(voiceEngine(ctx({ voiceEngine: 'local' }))).toBe('local');
    expect(voiceLocalModel(ctx({}))).toBe('base');
    expect(voiceLocalModel(ctx({ voiceLocalModel: 'small' }))).toBe('small');
    expect(voiceLocalModel(ctx({ voiceLocalModel: 'large-v3' }))).toBe('base');
  });

  it('sends a schema-valid local command with a longer RPC timeout and returns text', async () => {
    const rpc = vi.fn(async ({ command, timeoutMs }) => {
      const parsed = HostRpcCommandSchema.parse(command);
      expect(parsed.type).toBe('voice.local.transcribe');
      expect(timeoutMs).toBeGreaterThan(command.timeoutMs);
      expect(timeoutMs).toBe(145_000);
      return { modelId: command.modelId, text: 'bonjour', detectedLanguage: 'fr' };
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc, voiceEngine: 'local', voiceLocalModel: 'small' }), audio))
      .resolves.toBe('bonjour');
    expect(rpc).toHaveBeenCalledWith(expect.objectContaining({
      hostId: 'host-1',
      command: expect.objectContaining({
        type: 'voice.local.transcribe',
        modelId: 'small',
        audioBase64: audio.bytes.toString('base64'),
        timeoutMs: 120_000
      })
    }));
    // No language configured ⇒ omitted (auto-detect).
    expect(rpc.mock.calls[0]![0].command).not.toHaveProperty('language');
  });

  it('sends the language hint only when configured', async () => {
    const rpc = vi.fn(async () => ({ modelId: 'base', text: 'ok', detectedLanguage: null }));
    await transcribeVoiceOnHost(ctx({ rpc, voiceEngine: 'local', voiceLanguage: 'EN' }), audio);
    expect(rpc.mock.calls[0]![0].command.language).toBe('en');
  });

  it('maps local host errors without falling back to cloud', async () => {
    const cases: Array<[string, number]> = [
      ['voice_binary_missing', 503],
      ['voice_binary_invalid', 503],
      ['voice_model_missing', 503],
      ['voice_transcribe_busy', 503],
      ['voice_transcribe_timeout', 504],
      ['invalid_request', 400],
      ['voice_transcribe_failed', 502],
      ['something_new', 502]
    ];
    for (const [code, status] of cases) {
      const rpc = vi.fn(async () => {
        throw Object.assign(new Error(code), { code });
      });
      await expect(transcribeVoiceOnHost(ctx({ rpc, voiceEngine: 'local' }), audio))
        .rejects.toMatchObject({ status, code });
      expect(rpc).toHaveBeenCalledTimes(1);
    }
  });

  it('tells the user to update an older daemon', async () => {
    const rpc = vi.fn(async () => {
      throw Object.assign(new Error('unknown or invalid command type'), { code: 'unknown_command' });
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc, voiceEngine: 'local' }), audio))
      .rejects.toMatchObject({ status: 501, code: 'unknown_command', message: expect.stringContaining('Update the host daemon') });
  });

  it('maps an RPC timeout to 504 and a disconnect to 503', async () => {
    const timeout = vi.fn(async () => {
      throw new HostUnavailableError('host rpc timed out: voice.local.transcribe');
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc: timeout, voiceEngine: 'local' }), audio))
      .rejects.toMatchObject({ status: 504, code: 'voice_transcribe_timeout' });

    const down = vi.fn(async () => {
      throw new HostUnavailableError('host session is not connected');
    });
    await expect(transcribeVoiceOnHost(ctx({ rpc: down, voiceEngine: 'local' }), audio))
      .rejects.toMatchObject({ status: 503, code: 'host-unavailable' });
  });
});

describe('voiceStatus', () => {
  it('reports cloud ready whenever a host is connected', async () => {
    await expect(voiceStatus(ctx({ connected: [] }))).resolves.toEqual({ enabled: false, engine: 'cloud', ready: false, reason: 'no_host' });
    await expect(voiceStatus(ctx({}))).resolves.toEqual({ enabled: true, engine: 'cloud', ready: true, reason: null });
  });

  it('reports local readiness from the host', async () => {
    const ready = vi.fn(async () => localStatus());
    await expect(voiceStatus(ctx({ rpc: ready, voiceEngine: 'local' }))).resolves.toEqual(
      { enabled: true, engine: 'local', ready: true, reason: null });
    expect(ready).toHaveBeenCalledWith(expect.objectContaining({
      command: { type: 'voice.local.status' }
    }));

    await expect(voiceStatus(ctx({ rpc: vi.fn(async () => localStatus({ binary: 'missing' })), voiceEngine: 'local' })))
      .resolves.toMatchObject({ ready: false, reason: 'binary_missing' });
    await expect(voiceStatus(ctx({ rpc: vi.fn(async () => localStatus({ binary: 'invalid' })), voiceEngine: 'local' })))
      .resolves.toMatchObject({ ready: false, reason: 'binary_invalid' });
    await expect(voiceStatus(ctx({ rpc: vi.fn(async () => localStatus({ model: 'not_installed' })), voiceEngine: 'local' })))
      .resolves.toMatchObject({ ready: false, reason: 'model_not_installed' });
    await expect(voiceStatus(ctx({ rpc: vi.fn(async () => localStatus({ model: 'downloading' })), voiceEngine: 'local' })))
      .resolves.toMatchObject({ ready: false, reason: 'model_downloading' });
  });

  it('checks the selected model, not just any installed one', async () => {
    const status = localStatus({ model: 'not_installed' });
    const rpc = vi.fn(async () => status);
    // tiny is installed, base is not.
    await expect(voiceStatus(ctx({ rpc, voiceEngine: 'local', voiceLocalModel: 'tiny' })))
      .resolves.toMatchObject({ ready: true });
    await expect(voiceStatus(ctx({ rpc, voiceEngine: 'local', voiceLocalModel: 'base' })))
      .resolves.toMatchObject({ ready: false, reason: 'model_not_installed' });
  });

  it('never throws when the host cannot answer', async () => {
    await expect(voiceStatus(ctx({ connected: [], voiceEngine: 'local' })))
      .resolves.toMatchObject({ ready: false, reason: 'no_host' });
    const down = vi.fn(async () => { throw new HostUnavailableError(); });
    await expect(voiceStatus(ctx({ rpc: down, voiceEngine: 'local' })))
      .resolves.toMatchObject({ ready: false, reason: 'no_host' });
    const old = vi.fn(async () => {
      throw Object.assign(new Error('nope'), { code: 'unknown_command' });
    });
    await expect(voiceStatus(ctx({ rpc: old, voiceEngine: 'local' })))
      .resolves.toMatchObject({ ready: false, reason: 'daemon_outdated' });
    const broken = vi.fn(async () => { throw new Error('boom'); });
    await expect(voiceStatus(ctx({ rpc: broken, voiceEngine: 'local' })))
      .resolves.toMatchObject({ ready: false, reason: 'status_failed' });
  });
});
