import { afterEach, expect, it, vi } from 'vitest';
import { product } from '../product-client.js';

afterEach(() => vi.unstubAllGlobals());

function fetchMockFor(status: unknown, transcription: unknown) {
  return vi.fn(async (url: string) => {
    if (String(url).includes('/system/voice-status')) return Response.json(status);
    return transcription instanceof Response ? transcription : Response.json(transcription);
  });
}

it.each([
  ['audio/mp4', 'recording.mp4'],
  ['audio/mp4;codecs=mp4a.40.2', 'recording.mp4'],
  ['audio/ogg', 'recording.ogg'],
  ['audio/webm;codecs=opus', 'recording.webm']
])('preserves %s audio format through the voice HTTP upload', async (mime, filename) => {
  const fetchMock = fetchMockFor({ enabled: true, engine: 'cloud', ready: true, reason: null }, { text: ' Hello from voice ' });
  vi.stubGlobal('fetch', fetchMock);
  await expect(product.voice.transcribe(btoa('synthetic-audio'), mime)).resolves.toMatchObject({ ok: true, text: 'Hello from voice' });
  const upload = fetchMock.mock.calls.find(([url]) => String(url).includes('voice-transcription'))!;
  const [, init] = upload as unknown as [string, RequestInit];
  const file = (init.body as FormData).get('file') as File;
  expect(file.name).toBe(filename);
  expect(file.type).toBe(mime);
  expect(await file.text()).toBe('synthetic-audio');
});

it('keeps actionable host errors in the voice result', async () => {
  vi.stubGlobal('fetch', fetchMockFor(
    { enabled: true, engine: 'cloud', ready: true, reason: null },
    Response.json({ message: 'Unlock Keychain on your Mac.' }, { status: 503 })
  ));
  await expect(product.voice.transcribe(btoa('audio'), 'audio/mp4')).resolves.toMatchObject({ ok: false, text: '', error: 'Unlock Keychain on your Mac.' });
});

it('reports engine readiness from voice-status', async () => {
  vi.stubGlobal('fetch', fetchMockFor({ enabled: true, engine: 'local', ready: false, reason: 'model_not_installed' }, {}));
  await expect(product.voice.hasApiKey()).resolves.toBe(false);
  await expect(product.voice.status()).resolves.toMatchObject({ engine: 'local', ready: false, reason: 'model_not_installed' });

  vi.stubGlobal('fetch', fetchMockFor({ enabled: true, engine: 'local', ready: true, reason: null }, {}));
  await expect(product.voice.hasApiKey()).resolves.toBe(true);
});

it('converts recordings to WAV for the local engine', async () => {
  const rendered = { getChannelData: () => new Float32Array([0, 0.5, -0.5, 0]) };
  const FakeAudioContext = vi.fn(function (this: unknown) {
    return {
      decodeAudioData: async () => ({ duration: 2, sampleRate: 44100 }),
      close: async () => undefined
    };
  });
  const created: Array<{ channels: number; length: number; rate: number }> = [];
  const FakeOfflineAudioContext = vi.fn(function (this: unknown, channels: number, length: number, rate: number) {
    created.push({ channels, length, rate });
    return {
      createBufferSource: () => ({ buffer: null, connect: () => undefined, start: () => undefined }),
      destination: {},
      startRendering: async () => rendered
    };
  });
  vi.stubGlobal('window', { AudioContext: FakeAudioContext, OfflineAudioContext: FakeOfflineAudioContext });
  const fetchMock = fetchMockFor(
    { enabled: true, engine: 'local', ready: true, reason: null },
    { text: 'hello' }
  );
  vi.stubGlobal('fetch', fetchMock);
  await expect(product.voice.transcribe(btoa('original-bytes'), 'audio/webm')).resolves.toMatchObject({ ok: true, text: 'hello' });
  expect(created).toEqual([{ channels: 1, length: 32000, rate: 16000 }]);
  const upload = fetchMock.mock.calls.find(([url]) => String(url).includes('voice-transcription'))!;
  const file = ((upload as unknown as [string, RequestInit])[1].body as FormData).get('file') as File;
  expect(file.name).toBe('recording.wav');
  const riff = new Uint8Array(await file.arrayBuffer());
  expect(String.fromCharCode(...riff.subarray(0, 4))).toBe('RIFF');
  expect(String.fromCharCode(...riff.subarray(8, 12))).toBe('WAVE');
});

it('fails transcription clearly when Web Audio is unavailable', async () => {
  vi.stubGlobal('fetch', fetchMockFor({ enabled: true, engine: 'local', ready: true, reason: null }, { text: 'hi' }));
  await expect(product.voice.transcribe(btoa('audio'), 'audio/webm')).resolves.toMatchObject({ ok: false, error: expect.stringContaining('Web Audio') });
});

it('manages local models through the system routes', async () => {
  const status = { binary: { state: 'ready', path: '/b', source: 'path', message: null }, models: [] };
  const fetchMock = vi.fn(async () => Response.json(status));
  vi.stubGlobal('fetch', fetchMock);
  await expect(product.voice.downloadModel('tiny')).resolves.toEqual(status);
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/v1/system/voice-local/model-download',
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ modelId: 'tiny' }) })
  );
  await product.voice.cancelDownload('tiny');
  await product.voice.deleteModel('tiny');

  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ error: 'voice_model_busy', message: 'busy' }, { status: 503 })));
  await expect(product.voice.downloadModel('tiny')).rejects.toThrow('busy');
});

it('skips voice-status call when engine is provided by the caller', async () => {
  const fetchMock = vi.fn(async (url: string) => {
    if (String(url).includes('/system/voice-status')) {
      throw new Error('should not call voice-status');
    }
    return Response.json({ text: 'transcribed text' });
  });
  vi.stubGlobal('fetch', fetchMock);
  await expect(product.voice.transcribe(btoa('audio'), 'audio/webm', 'cloud')).resolves.toMatchObject({
    ok: true,
    text: 'transcribed text'
  });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(String(fetchMock.mock.calls[0][0])).toContain('voice-transcription');
});

it('notifies voice status changed subscribers', () => {
  const listener = vi.fn();
  const unsub = product.voice.onStatusChanged(listener);
  product.voice.notifyStatusChanged();
  expect(listener).toHaveBeenCalledTimes(1);
  unsub();
  product.voice.notifyStatusChanged();
  expect(listener).toHaveBeenCalledTimes(1);
});

