import { createHash, randomUUID } from 'node:crypto';
import { mkdir, open, readdir, rename, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { VoiceLocalModelId, VoiceLocalModelStatus } from '@zana-ai/zcc-contracts/host-rpc';
import { HostCommandError } from '../host-command-error.js';
import { VOICE_MODEL_CATALOG, type VoiceModelEntry } from './model-catalog.js';

const STAGED_PREFIX = '.staged-';
const DEFAULT_STALL_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_CONCURRENT_DOWNLOADS = 2;
/** Floor for the overall download budget so tiny models are never cut off. */
const MIN_OVERALL_TIMEOUT_MS = 5 * 60_000;
/** Sustained speed a healthy download must average; slower holds abort. */
const MIN_AVG_BYTES_PER_SEC = 50 * 1024;

export interface VoiceModelStoreDeps {
  dataDir: string;
  fetchImpl?: typeof fetch;
  catalog?: readonly VoiceModelEntry[];
  /** Abort a download when no bytes arrive for this long. */
  stallTimeoutMs?: number;
  /** Abort a download running longer than this; defaults per model size. */
  overallTimeoutMs?: number;
  maxConcurrentDownloads?: number;
}

interface DownloadJob {
  controller: AbortController;
  receivedBytes: number;
  cancelled: boolean;
  done: Promise<void>;
}

class DownloadFailure extends Error {}

/**
 * Downloads pinned whisper.cpp models into `<dataDir>/voice-models/<sha256>/`.
 * Each download streams into a uniquely named 0600 staged file, is verified
 * (length + sha256) while streaming, then renamed into place. Installed files
 * are trusted by size after that one verification.
 */
export class VoiceModelStore {
  readonly root: string;
  private readonly fetchImpl: typeof fetch;
  private readonly catalog: readonly VoiceModelEntry[];
  private readonly stallTimeoutMs: number;
  private readonly overallTimeoutMs: number | undefined;
  private readonly maxConcurrentDownloads: number;
  private readonly jobs = new Map<VoiceLocalModelId, DownloadJob>();
  private readonly failures = new Map<VoiceLocalModelId, string>();
  private sweep: Promise<void> | null = null;
  private disposed = false;

  constructor(deps: VoiceModelStoreDeps) {
    this.root = join(deps.dataDir, 'voice-models');
    this.fetchImpl = deps.fetchImpl ?? fetch;
    this.catalog = deps.catalog ?? VOICE_MODEL_CATALOG;
    this.stallTimeoutMs = deps.stallTimeoutMs ?? DEFAULT_STALL_TIMEOUT_MS;
    this.overallTimeoutMs = deps.overallTimeoutMs;
    this.maxConcurrentDownloads = deps.maxConcurrentDownloads ?? DEFAULT_MAX_CONCURRENT_DOWNLOADS;
  }

  /** Overall budget for a download: a slow drip must average 50 KB/s. */
  overallBudgetMs(sizeBytes: number): number {
    return this.overallTimeoutMs ?? Math.max(MIN_OVERALL_TIMEOUT_MS, Math.ceil(sizeBytes / MIN_AVG_BYTES_PER_SEC) * 1000);
  }

  /** Path of a verified installed model, or null. */
  async installedPath(id: VoiceLocalModelId): Promise<string | null> {
    await this.ready();
    const model = this.entry(id);
    const path = this.modelPath(model);
    try {
      const info = await stat(path);
      return info.isFile() && info.size === model.sizeBytes ? path : null;
    } catch {
      return null;
    }
  }

  async list(): Promise<VoiceLocalModelStatus[]> {
    await this.ready();
    return Promise.all(this.catalog.map(async (model): Promise<VoiceLocalModelStatus> => {
      const base = { id: model.id, label: model.label, sizeBytes: model.sizeBytes };
      const job = this.jobs.get(model.id);
      if (job) return { ...base, state: 'downloading', receivedBytes: job.receivedBytes, error: null };
      if (await this.installedPath(model.id)) return { ...base, state: 'installed', receivedBytes: null, error: null };
      const error = this.failures.get(model.id);
      if (error) return { ...base, state: 'failed', receivedBytes: null, error };
      return { ...base, state: 'not_installed', receivedBytes: null, error: null };
    }));
  }

  /** Starts a download in the background; progress is read through `list()`. */
  async download(id: VoiceLocalModelId): Promise<void> {
    this.assertOpen();
    await this.ready();
    this.assertOpen();
    const model = this.entry(id);
    if (this.jobs.has(id)) return;
    if (this.jobs.size >= this.maxConcurrentDownloads) {
      throw new HostCommandError('voice_model_busy', 'Another model download is in progress. Try again when it finishes.');
    }
    // Claim the slot before awaiting so a concurrent call for the same id
    // sees this job instead of starting a second one.
    const job: DownloadJob = { controller: new AbortController(), receivedBytes: 0, cancelled: false, done: Promise.resolve() };
    this.jobs.set(id, job);
    let installed: string | null;
    try {
      installed = await this.installedPath(id);
    } catch (error) {
      this.jobs.delete(id);
      throw error;
    }
    if (installed || job.cancelled || this.disposed) {
      this.jobs.delete(id);
      return;
    }
    this.failures.delete(id);
    job.done = this.runDownload(model, job)
      .catch((error: unknown) => {
        if (job.cancelled) return;
        // Fixed user message: OS errors (EACCES/ENOSPC) carry absolute paths
        // that must not reach the renderer; detail stays in the daemon.
        this.failures.set(id, error instanceof DownloadFailure ? error.message : 'Download failed. Check disk space and permissions, then try again.');
      })
      .finally(() => {
        if (this.jobs.get(id) === job) this.jobs.delete(id);
      });
  }

  async cancel(id: VoiceLocalModelId): Promise<void> {
    this.entry(id);
    const job = this.jobs.get(id);
    this.failures.delete(id);
    if (!job) return;
    job.cancelled = true;
    job.controller.abort();
    await job.done;
  }

  async delete(id: VoiceLocalModelId): Promise<void> {
    this.assertOpen();
    await this.ready();
    const model = this.entry(id);
    await this.cancel(id);
    // Fixed catalog-derived directory under the daemon data dir; no caller path.
    await rm(this.modelDir(model), { recursive: true, force: true });
  }

  /** Test seam: resolves when the current download for `id` settles. */
  async settled(id: VoiceLocalModelId): Promise<void> {
    await this.jobs.get(id)?.done;
  }

  async dispose(): Promise<void> {
    this.disposed = true;
    const jobs = [...this.jobs.values()];
    for (const job of jobs) {
      job.cancelled = true;
      job.controller.abort();
    }
    await Promise.all(jobs.map((job) => job.done));
  }

  private entry(id: VoiceLocalModelId): VoiceModelEntry {
    const model = this.catalog.find((candidate) => candidate.id === id);
    if (!model) throw new HostCommandError('voice_model_unknown', `Unknown voice model: ${id}`);
    return model;
  }

  private modelDir(model: VoiceModelEntry): string {
    return join(this.root, model.sha256);
  }

  private modelPath(model: VoiceModelEntry): string {
    return join(this.modelDir(model), model.fileName);
  }

  private assertOpen(): void {
    if (this.disposed) throw new HostCommandError('voice_model_store_closed', 'The host daemon is shutting down.');
  }

  /** Removes staged files left by a crashed daemon, once, before any job starts. */
  private ready(): Promise<void> {
    this.sweep ??= (async () => {
      let dirs: string[];
      try {
        dirs = await readdir(this.root);
      } catch {
        return;
      }
      await Promise.all(dirs.map(async (dir) => {
        try {
          const names = await readdir(join(this.root, dir));
          await Promise.all(names
            .filter((name) => name.startsWith(STAGED_PREFIX))
            .map((name) => rm(join(this.root, dir, name), { force: true })));
        } catch {
          // Not a directory or unreadable; leave it alone.
        }
      }));
    })();
    return this.sweep;
  }

  private async runDownload(model: VoiceModelEntry, job: DownloadJob): Promise<void> {
    const dir = this.modelDir(model);
    await mkdir(dir, { recursive: true });
    const staged = join(dir, `${STAGED_PREFIX}${randomUUID()}`);
    const { signal } = job.controller;
    let stalled = false;
    let overallExpired = false;
    const handle = await open(staged, 'wx', 0o600);
    let handleOpen = true;
    const stallTimer = setTimeout(() => {
      stalled = true;
      job.controller.abort();
    }, this.stallTimeoutMs);
    const overallTimer = setTimeout(() => {
      overallExpired = true;
      job.controller.abort();
    }, this.overallBudgetMs(model.sizeBytes));
    try {
      let response: Response;
      try {
        response = await this.fetchImpl(model.url, { signal, redirect: 'follow' });
      } catch (error) {
        if (overallExpired) throw new DownloadFailure('Download timed out. Check the connection and try again.');
        if (stalled) throw new DownloadFailure('Download stalled. Check the connection and try again.');
        throw error;
      }
      if (!response.ok || !response.body) {
        throw new DownloadFailure(`Download failed (HTTP ${response.status}).`);
      }
      const declared = response.headers.get('content-length');
      if (declared !== null && Number(declared) !== model.sizeBytes) {
        throw new DownloadFailure('The download server reported an unexpected file size.');
      }

      const hash = createHash('sha256');
      const reader = response.body.getReader();
      try {
        for (;;) {
          const chunk = await reader.read().catch((error: unknown) => {
            if (overallExpired) throw new DownloadFailure('Download timed out. Check the connection and try again.');
            if (stalled) throw new DownloadFailure('Download stalled. Check the connection and try again.');
            throw error;
          });
          if (chunk.done) break;
          stallTimer.refresh();
          job.receivedBytes += chunk.value.byteLength;
          if (job.receivedBytes > model.sizeBytes) {
            throw new DownloadFailure('The downloaded file is larger than expected.');
          }
          hash.update(chunk.value);
          await handle.write(chunk.value);
        }
      } finally {
        // Releases the connection when we stop early (size cap, abort).
        await reader.cancel().catch(() => undefined);
      }
      if (signal.aborted) {
        if (overallExpired) throw new DownloadFailure('Download timed out. Check the connection and try again.');
        throw new DownloadFailure('Download cancelled.');
      }
      if (job.receivedBytes !== model.sizeBytes) {
        throw new DownloadFailure('The download ended before the full file arrived.');
      }
      if (hash.digest('hex') !== model.sha256) {
        throw new DownloadFailure('The downloaded file did not match the expected checksum.');
      }
      await handle.close();
      handleOpen = false;
      await rename(staged, this.modelPath(model));
    } finally {
      clearTimeout(stallTimer);
      clearTimeout(overallTimer);
      if (handleOpen) await handle.close().catch(() => undefined);
      await rm(staged, { force: true });
    }
  }
}
