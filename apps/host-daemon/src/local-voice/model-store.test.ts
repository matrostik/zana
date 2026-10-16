import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { VoiceModelEntry } from './model-catalog.js';
import { VOICE_MODEL_CATALOG } from './model-catalog.js';
import { VoiceModelStore } from './model-store.js';

const fsHooks = vi.hoisted(() => ({ failStagedOpen: false }));
vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>();
  return {
    ...actual,
    open: ((path: Parameters<typeof actual.open>[0], ...rest: unknown[]) => {
      if (fsHooks.failStagedOpen && String(path).includes('.staged-')) {
        return Promise.reject(Object.assign(new Error('ENOSPC: no space left on device'), { code: 'ENOSPC' }));
      }
      return (actual.open as (...args: unknown[]) => ReturnType<typeof actual.open>)(path, ...rest);
    }) as typeof actual.open
  };
});

const CONTENT = Buffer.from('ggml-fake-model-bytes-for-tests');
const SHA = createHash('sha256').update(CONTENT).digest('hex');
const MODEL: VoiceModelEntry = {
  id: 'tiny',
  label: 'Tiny',
  fileName: 'ggml-tiny.bin',
  sizeBytes: CONTENT.length,
  sha256: SHA,
  url: 'https://models.example.test/ggml-tiny.bin'
};
const OTHER: VoiceModelEntry = { ...MODEL, id: 'base', label: 'Base', fileName: 'ggml-base.bin', sha256: 'b'.repeat(64) };

const dirs: string[] = [];
const stores: VoiceModelStore[] = [];
afterEach(async () => {
  await Promise.all(stores.splice(0).map((store) => store.dispose()));
  dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

/** Streams `chunks`, then either ends or hangs; aborting the request errors the body like undici. */
function fakeFetch(options: { chunks?: Buffer[]; status?: number; hang?: boolean; contentLength?: number | null } = {}) {
  return vi.fn<typeof fetch>(async (_url, init) => {
    const signal = init?.signal ?? undefined;
    if (signal?.aborted) throw signal.reason;
    const chunks = [...(options.chunks ?? [CONTENT])];
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        signal?.addEventListener('abort', () => controller.error(signal.reason), { once: true });
      },
      pull(controller) {
        const next = chunks.shift();
        if (next) controller.enqueue(new Uint8Array(next));
        else if (!options.hang) controller.close();
        else return new Promise<void>(() => {});
      }
    });
    const headers = new Headers();
    const length = options.contentLength === undefined ? CONTENT.length : options.contentLength;
    if (length !== null) headers.set('content-length', String(length));
    return new Response(body, { status: options.status ?? 200, headers });
  });
}

function makeStore(fetchImpl: typeof fetch, extra: Partial<ConstructorParameters<typeof VoiceModelStore>[0]> = {}) {
  const dataDir = mkdtempSync(join(tmpdir(), 'zcc-voice-models-'));
  dirs.push(dataDir);
  const store = new VoiceModelStore({ dataDir, fetchImpl, catalog: [MODEL, OTHER], stallTimeoutMs: 5_000, ...extra });
  stores.push(store);
  return { store, dataDir, modelDir: join(dataDir, 'voice-models', SHA) };
}

async function stateOf(store: VoiceModelStore, id = MODEL.id) {
  return (await store.list()).find((model) => model.id === id)!;
}

describe('VOICE_MODEL_CATALOG', () => {
  it('pins every contract model id to an immutable revision with a sha256', () => {
    expect(VOICE_MODEL_CATALOG.map((model) => model.id)).toEqual(['tiny', 'base', 'small', 'medium']);
    for (const model of VOICE_MODEL_CATALOG) {
      expect(model.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(model.url).toMatch(/^https:\/\/huggingface\.co\/ggerganov\/whisper\.cpp\/resolve\/[a-f0-9]{40}\/ggml-[a-z0-9-]+\.bin$/);
      expect(model.sizeBytes).toBeGreaterThan(0);
    }
  });
});

describe('VoiceModelStore', () => {
  it('downloads, verifies and installs a model under its sha256 directory', async () => {
    const fetchImpl = fakeFetch({ chunks: [CONTENT.subarray(0, 10), CONTENT.subarray(10)] });
    const { store, modelDir } = makeStore(fetchImpl);
    expect(await stateOf(store)).toMatchObject({ state: 'not_installed', receivedBytes: null });

    await store.download(MODEL.id);
    await store.settled(MODEL.id);

    const path = join(modelDir, MODEL.fileName);
    expect(readFileSync(path)).toEqual(CONTENT);
    expect(await store.installedPath(MODEL.id)).toBe(path);
    expect(await stateOf(store)).toMatchObject({ state: 'installed', error: null });
    expect(readdirSync(modelDir)).toEqual([MODEL.fileName]);
    expect(fetchImpl).toHaveBeenCalledWith(MODEL.url, expect.objectContaining({ redirect: 'follow' }));
    if (process.platform !== 'win32') expect(statSync(path).mode & 0o777).toBe(0o600);

    // Installed: a second request is a no-op.
    await store.download(MODEL.id);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['a checksum mismatch', { chunks: [Buffer.alloc(CONTENT.length, 1)] }, /checksum/],
    ['a short body', { chunks: [CONTENT.subarray(0, 5)], contentLength: null }, /before the full file/],
    ['an oversized body', { chunks: [CONTENT, Buffer.from('extra')], contentLength: null }, /larger than expected/],
    ['a wrong content-length', { contentLength: 1 }, /unexpected file size/],
    ['an HTTP error', { status: 404 }, /HTTP 404/]
  ])('fails on %s without leaving staged files', async (_label, options, message) => {
    const { store, modelDir } = makeStore(fakeFetch(options));
    await store.download(MODEL.id);
    await store.settled(MODEL.id);
    expect(await stateOf(store)).toMatchObject({ state: 'failed', error: expect.stringMatching(message) });
    expect(await store.installedPath(MODEL.id)).toBeNull();
    expect(readdirSync(modelDir)).toEqual([]);
  });

  it('reports a network error as a fixed failure without leaking details', async () => {
    const { store } = makeStore(vi.fn<typeof fetch>(async () => { throw new Error('getaddrinfo ENOTFOUND models.example.test'); }));
    await store.download(MODEL.id);
    await store.settled(MODEL.id);
    const failure = await stateOf(store);
    expect(failure).toMatchObject({ state: 'failed' });
    expect(failure.error).toContain('disk space');
    expect(failure.error).not.toContain('ENOTFOUND');
  });

  it('aborts a stalled download', async () => {
    const { store, modelDir } = makeStore(fakeFetch({ chunks: [CONTENT.subarray(0, 4)], hang: true }), { stallTimeoutMs: 100 });
    await store.download(MODEL.id);
    await store.settled(MODEL.id);
    expect(await stateOf(store)).toMatchObject({ state: 'failed', error: expect.stringMatching(/stalled/) });
    expect(readdirSync(modelDir)).toEqual([]);
  });

  it('reports progress, then cancel clears the job without recording a failure', async () => {
    const { store, modelDir } = makeStore(fakeFetch({ chunks: [CONTENT.subarray(0, 4)], hang: true }));
    await store.download(MODEL.id);
    await vi.waitFor(async () => expect(await stateOf(store)).toMatchObject({ state: 'downloading', receivedBytes: 4 }));

    await store.cancel(MODEL.id);
    expect(await stateOf(store)).toMatchObject({ state: 'not_installed', error: null });
    expect(readdirSync(modelDir)).toEqual([]);
    await store.cancel(MODEL.id);
  });

  it('shares an in-flight download and rejects new ones past the concurrency cap', async () => {
    const fetchImpl = fakeFetch({ chunks: [CONTENT.subarray(0, 4)], hang: true });
    const { store } = makeStore(fetchImpl, { maxConcurrentDownloads: 1 });
    await store.download(MODEL.id);
    await store.download(MODEL.id);
    await expect(store.download(OTHER.id)).rejects.toMatchObject({ code: 'voice_model_busy' });
    await vi.waitFor(() => expect(fetchImpl).toHaveBeenCalledTimes(1));
    expect((await stateOf(store, OTHER.id)).state).toBe('not_installed');
  });

  it('starts one download when two requests for the same model race', async () => {
    const fetchImpl = fakeFetch({ chunks: [CONTENT.subarray(0, 4)], hang: true });
    const { store } = makeStore(fetchImpl);
    await Promise.all([store.download(MODEL.id), store.download(MODEL.id)]);
    await vi.waitFor(() => expect(fetchImpl).toHaveBeenCalledTimes(1));
    // The surviving job is the only one, so cancel settles the download fully.
    await store.cancel(MODEL.id);
    expect(await stateOf(store)).toMatchObject({ state: 'not_installed', error: null });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('does not leave a stall timer behind when the staged file cannot be opened', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    fsHooks.failStagedOpen = true;
    try {
      const fetchImpl = fakeFetch();
      const { store, dataDir } = makeStore(fetchImpl);
      await store.download(MODEL.id);
      await store.settled(MODEL.id);
      // OS errors carry absolute paths: the user message is fixed, no leak.
      const failure = await stateOf(store);
      expect(failure).toMatchObject({ state: 'failed' });
      expect(failure.error).toContain('disk space');
      expect(failure.error).not.toContain(dataDir);
      expect(fetchImpl).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      fsHooks.failStagedOpen = false;
      vi.useRealTimers();
    }
  });

  it('aborts a slow-drip download that never stalls via the overall budget', async () => {
    const fetchImpl = fakeFetch({ chunks: [CONTENT.subarray(0, 5)], hang: true, contentLength: null });
    const { store } = makeStore(fetchImpl, { overallTimeoutMs: 50, stallTimeoutMs: 5_000 });
    await store.download(MODEL.id);
    await store.settled(MODEL.id);
    expect(await stateOf(store)).toMatchObject({ state: 'failed', error: expect.stringContaining('timed out') });
  });

  it('sizes the default overall budget from the model with a floor', async () => {
    const { store } = makeStore(fakeFetch());
    expect(store.overallBudgetMs(1)).toBe(5 * 60_000);
    expect(store.overallBudgetMs(74 * 1024 * 1024)).toBeGreaterThan(5 * 60_000);
    await store.dispose();
  });

  it('a retry after failure clears the previous error', async () => {
    let attempt = 0;
    const good = fakeFetch();
    const fetchImpl = vi.fn<typeof fetch>(async (url, init) => {
      attempt += 1;
      if (attempt === 1) throw new Error('offline');
      return good(url, init);
    });
    const { store } = makeStore(fetchImpl);
    await store.download(MODEL.id);
    await store.settled(MODEL.id);
    expect((await stateOf(store)).state).toBe('failed');
    await store.download(MODEL.id);
    await store.settled(MODEL.id);
    expect(await stateOf(store)).toMatchObject({ state: 'installed', error: null });
  });

  it('delete removes an installed model and cancels a running download', async () => {
    const { store, modelDir } = makeStore(fakeFetch());
    await store.download(MODEL.id);
    await store.settled(MODEL.id);
    await store.delete(MODEL.id);
    expect(existsSync(modelDir)).toBe(false);
    expect((await stateOf(store)).state).toBe('not_installed');

    const hanging = makeStore(fakeFetch({ hang: true, chunks: [] }));
    await hanging.store.download(MODEL.id);
    await hanging.store.delete(MODEL.id);
    expect(existsSync(hanging.modelDir)).toBe(false);
    expect((await stateOf(hanging.store)).state).toBe('not_installed');
  });

  it('treats a truncated installed file as not installed', async () => {
    const { store, modelDir } = makeStore(fakeFetch());
    mkdirSync(modelDir, { recursive: true });
    writeFileSync(join(modelDir, MODEL.fileName), CONTENT.subarray(0, 3));
    expect(await store.installedPath(MODEL.id)).toBeNull();
  });

  it('sweeps staged files left by a crashed daemon', async () => {
    const dataDir = mkdtempSync(join(tmpdir(), 'zcc-voice-models-'));
    dirs.push(dataDir);
    const modelDir = join(dataDir, 'voice-models', SHA);
    mkdirSync(modelDir, { recursive: true });
    writeFileSync(join(modelDir, '.staged-old'), 'partial');
    writeFileSync(join(modelDir, MODEL.fileName), CONTENT);
    writeFileSync(join(dataDir, 'voice-models', 'stray-file'), 'x');
    const store = new VoiceModelStore({ dataDir, fetchImpl: fakeFetch(), catalog: [MODEL] });
    stores.push(store);
    expect(await stateOf(store)).toMatchObject({ state: 'installed' });
    expect(readdirSync(modelDir)).toEqual([MODEL.fileName]);
  });

  it('dispose aborts running downloads and refuses new work', async () => {
    const { store, modelDir } = makeStore(fakeFetch({ hang: true, chunks: [CONTENT.subarray(0, 2)] }));
    await store.download(MODEL.id);
    await store.dispose();
    expect(readdirSync(modelDir)).toEqual([]);
    await expect(store.download(MODEL.id)).rejects.toMatchObject({ code: 'voice_model_store_closed' });
  });

  it('rejects ids outside its catalog', async () => {
    const { store } = makeStore(fakeFetch());
    await expect(store.download('large-v3' as never)).rejects.toMatchObject({ code: 'voice_model_unknown' });
  });
});
