import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
const h = vi.hoisted(() => ({ thread: null as any, environment: null as any }));
vi.mock('@zana-ai/zcc-db', () => ({
  getConversationThread: () => h.thread,
  getEnvironment: () => h.environment
}));
import { resolvePreviewPathCandidate, resolveThreadPreviewPath } from './thread-preview-resolution.js';

describe('resolvePreviewPathCandidate', () => {
  it('keeps explicit relative paths exact', async () => {
    const exists = vi.fn(async (path: string) => path === 'output/report.md');
    const search = vi.fn(async () => ({ paths: ['other/report.md'], truncated: false }));
    await expect(resolvePreviewPathCandidate('output/report.md', [], exists, search, true))
      .resolves.toEqual({ kind: 'resolved', path: 'output/report.md' });
    expect(search).not.toHaveBeenCalled();
  });

  it('does not search for another basename after an explicit absolute path misses', async () => {
    const exists = vi.fn(async () => false);
    const search = vi.fn(async () => ({ paths: ['other/report.md'], truncated: false }));
    await expect(resolvePreviewPathCandidate('output/report.md', [], exists, search, true))
      .resolves.toEqual({ kind: 'not_found' });
    expect(search).not.toHaveBeenCalled();
  });

  it('uses the exact root file before searching for a bare name', async () => {
    const exists = vi.fn(async (path: string) => path === 'report.md');
    const search = vi.fn();
    await expect(resolvePreviewPathCandidate('report.md', [], exists, search))
      .resolves.toEqual({ kind: 'resolved', path: 'report.md' });
    expect(search).not.toHaveBeenCalled();
  });

  it('returns ambiguity instead of selecting a duplicate basename', async () => {
    const exists = vi.fn(async () => false);
    const search = vi.fn(async () => ({ paths: ['docs/report.md', 'output/report.md'], truncated: false }));
    await expect(resolvePreviewPathCandidate('report.md', [], exists, search))
      .resolves.toEqual({ kind: 'ambiguous', paths: ['docs/report.md', 'output/report.md'] });
  });

  it('checks duplicate hints and falls through when they are stale', async () => {
    const exists = vi.fn(async (path: string) => path === 'docs/report.md');
    const search = vi.fn(async () => ({ paths: ['output/report.md'], truncated: false }));
    await expect(resolvePreviewPathCandidate('report.md', ['old/report.md', 'docs/report.md'], exists, search))
      .resolves.toEqual({ kind: 'resolved', path: 'docs/report.md' });
    expect(search).not.toHaveBeenCalled();
  });

  it('searches when every duplicate hint is stale', async () => {
    const exists = vi.fn(async () => false);
    const search = vi.fn(async () => ({ paths: ['live/report.md'], truncated: false }));
    await expect(resolvePreviewPathCandidate('report.md', ['old/report.md', 'removed/report.md'], exists, search))
      .resolves.toEqual({ kind: 'resolved', path: 'live/report.md' });
    expect(search).toHaveBeenCalledOnce();
  });

  it('does not infer uniqueness from a truncated search', async () => {
    const exists = vi.fn(async () => false);
    const search = vi.fn(async () => ({ paths: ['docs/report.md'], truncated: true }));
    await expect(resolvePreviewPathCandidate('report.md', [], exists, search))
      .resolves.toEqual({ kind: 'incomplete', paths: ['docs/report.md'] });
  });
});

describe('resolveThreadPreviewPath', () => {
  let rpc: ReturnType<typeof vi.fn>;
  let ctx: any;
  beforeEach(() => {
    h.thread = { id: 'thread-1', projectId: 'project-1', environmentId: 'env-1', hostId: 'linux-host' };
    h.environment = { path: '/srv/checkouts/feature' };
    rpc = vi.fn();
    ctx = { db: {}, hostHub: { callHostOnlineRpc: rpc }, toProjects: vi.fn() };
  });

  it('confines timeline hints and reads them from the thread host and environment', async () => {
    rpc.mockResolvedValue({ sizeBytes: 12, modifiedAtMs: 1 });
    await expect(resolveThreadPreviewPath(ctx, 'thread-1', {
      path: 'guide.md', hints: ['../secret/guide.md', 'docs/guide.md']
    })).resolves.toEqual({ kind: 'resolved', path: 'docs/guide.md' });
    expect(rpc).toHaveBeenCalledWith(expect.objectContaining({
      hostId: 'linux-host',
      command: { type: 'host.file_metadata', path: '/srv/checkouts/feature/docs/guide.md', rootPath: '/srv/checkouts/feature' }
    }));
  });

  it('does not search after an explicit path is missing', async () => {
    rpc.mockRejectedValue({ code: 'path_not_found' });
    await expect(resolveThreadPreviewPath(ctx, 'thread-1', { path: 'output/report.md' }))
      .resolves.toEqual({ kind: 'not_found', path: 'output/report.md', checkedPath: '/srv/checkouts/feature/output/report.md' });
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc.mock.calls[0]![0].command.type).toBe('host.file_metadata');
  });

  it('uses the thread environment on a Windows server when the thread host is Linux', async () => {
    h.environment.path = '/srv/checkouts/feature';
    rpc.mockRejectedValueOnce({ code: 'path_not_found' }).mockResolvedValueOnce({
      paths: [
        { kind: 'file', path: 'docs/guide.md', name: 'guide.md', score: 0, positions: [] },
        { kind: 'file', path: 'examples/guide.md', name: 'guide.md', score: 0, positions: [] }
      ], truncated: false
    });
    await expect(resolveThreadPreviewPath(ctx, 'thread-1', { path: 'guide.md' }))
      .resolves.toEqual({ kind: 'ambiguous', paths: ['docs/guide.md', 'examples/guide.md'] });
    expect(rpc.mock.calls[1]![0]).toMatchObject({
      hostId: 'linux-host',
      command: { type: 'host.list_paths', path: '/srv/checkouts/feature', exactName: 'guide.md' }
    });
  });

  it('keeps a host-confirmed Windows case-equivalent filename', async () => {
    h.environment.path = 'D:\\srv\\checkouts\\feature';
    rpc.mockRejectedValueOnce({ code: 'path_not_found' }).mockResolvedValueOnce({
      paths: [{ kind: 'file', path: 'docs/Guide.md', name: 'Guide.md', score: 0, positions: [] }],
      truncated: false
    });
    await expect(resolveThreadPreviewPath(ctx, 'thread-1', { path: 'guide.md' }))
      .resolves.toEqual({ kind: 'resolved', path: 'docs/Guide.md' });
  });

  it('decrements the live host search count when requests overlap', async () => {
    let releaseFirst!: (value: unknown) => void;
    let releaseSecond!: (value: unknown) => void;
    let searches = 0;
    rpc.mockImplementation((request: any) => {
      if (request.command.type === 'host.file_metadata') return Promise.reject({ code: 'path_not_found' });
      searches += 1;
      return new Promise((resolve) => {
        if (searches === 1) releaseFirst = resolve;
        else if (searches === 2) releaseSecond = resolve;
        else resolve({ paths: [], truncated: false });
      });
    });
    const first = resolveThreadPreviewPath(ctx, 'thread-1', { path: 'one.md' });
    await vi.waitFor(() => expect(searches).toBe(1));
    const second = resolveThreadPreviewPath(ctx, 'thread-1', { path: 'two.md' });
    await vi.waitFor(() => expect(searches).toBe(2));
    await expect(resolveThreadPreviewPath(ctx, 'thread-1', { path: 'blocked.md' }))
      .rejects.toMatchObject({ status: 429, code: 'preview-busy' });
    releaseFirst({ paths: [], truncated: false });
    await first;
    const third = resolveThreadPreviewPath(ctx, 'thread-1', { path: 'three.md' });
    await vi.waitFor(() => expect(searches).toBe(3));
    releaseSecond({ paths: [], truncated: false });
    await Promise.all([second, third]);
    await expect(resolveThreadPreviewPath(ctx, 'thread-1', { path: 'four.md' }))
      .resolves.toMatchObject({ kind: 'not_found' });
  });

  it('does not let the renderer substitute a different project for a thread', async () => {
    await expect(resolveThreadPreviewPath(ctx, 'thread-1', { path: 'guide.md', projectId: 'other-project' }))
      .rejects.toMatchObject({ status: 403, code: 'scope-mismatch' });
    expect(rpc).not.toHaveBeenCalled();
  });

  it('resolves authorized server-owned attachments even without a provisioned environment', async () => {
    const dataDir = mkdtempSync(join(tmpdir(), 'preview-local-root-'));
    h.environment = null;
    const path = join(dataDir, 'attachments', 'project-1', 'image.png');
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, 'image');
    ctx.dataDir = dataDir;
    await expect(resolveThreadPreviewPath(ctx, 'thread-1', { path }))
      .resolves.toEqual({ kind: 'resolved', path });
    expect(rpc).not.toHaveBeenCalled();
  });
});
