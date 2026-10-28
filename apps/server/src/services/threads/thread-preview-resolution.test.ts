import { beforeEach, describe, expect, it, vi } from 'vitest';
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
      .resolves.toEqual({ kind: 'not_found', path: 'output/report.md' });
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

  it('does not let the renderer substitute a different project for a thread', async () => {
    await expect(resolveThreadPreviewPath(ctx, 'thread-1', { path: 'guide.md', projectId: 'other-project' }))
      .rejects.toMatchObject({ status: 403, code: 'scope-mismatch' });
    expect(rpc).not.toHaveBeenCalled();
  });
});
