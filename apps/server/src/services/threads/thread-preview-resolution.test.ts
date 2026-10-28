import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('@zana-ai/zcc-db', () => ({ getConversationThread: vi.fn(), getEnvironment: vi.fn() }));
import { getConversationThread, getEnvironment } from '@zana-ai/zcc-db';
import type { ProductHttpContext } from '../../http/product-context.js';
import { resolveThreadPreviewPath } from './thread-preview-resolution.js';

const rpc = vi.fn();
const ctx = { db: {}, toProjects: () => [{ id: 'p', path: 'D:/project' }], hostHub: { callHostOnlineRpc: rpc, resolveHostId: () => 'local' } } as unknown as ProductHttpContext;
beforeEach(() => {
  vi.mocked(getConversationThread).mockReturnValue({ id: 't', projectId: 'p', hostId: 'remote', environmentId: 'env' } as never);
  vi.mocked(getEnvironment).mockReturnValue({ path: '/remote/checkout' } as never);
  rpc.mockReset();
});
describe('scoped preview resolution', () => {
  it('retains authorized server artifacts while normalizing checkout aliases', async () => {
    const local = { ...ctx, dataDir: 'D:/data' } as ProductHttpContext;
    expect(await resolveThreadPreviewPath(local, 't', { path: 'D:/data/artifacts/report.md' })).toMatchObject({ kind: 'resolved', path: 'D:\\data\\artifacts\\report.md' });
    expect(await resolveThreadPreviewPath(local, 't', { path: '/remote/checkout/docs/guide.md' })).toMatchObject({ path: 'docs/guide.md' });
    expect(rpc).not.toHaveBeenCalled();
  });
  it('accepts host-verified Windows case matches without lowercasing identity', async () => {
    vi.mocked(getEnvironment).mockReturnValueOnce({ path: 'D:/checkout' } as never);
    rpc.mockRejectedValueOnce({ code: 'path_not_found' }).mockResolvedValueOnce({ paths: [{ path: 'docs/Guide.md', name: 'Guide.md', kind: 'file' }], truncated: false });
    expect(await resolveThreadPreviewPath(ctx, 't', { path: 'guide.md' })).toMatchObject({ kind: 'resolved', path: 'docs/Guide.md' });
  });
  it('finds a unique exact basename on the recorded host after genuine absence', async () => {
    rpc.mockRejectedValueOnce({ code: 'path_not_found' }).mockResolvedValueOnce({ paths: [{ path: 'docs/guide.md', name: 'guide.md', kind: 'file' }], truncated: false });
    expect(await resolveThreadPreviewPath(ctx, 't', { path: 'guide.md', projectId: 'forged' })).toEqual({ kind: 'resolved', source: 'workspace', path: 'docs/guide.md' });
    expect(rpc.mock.calls[0]![0]).toMatchObject({ hostId: 'remote', command: { type: 'host.file_metadata', path: '/remote/checkout/guide.md', rootPath: '/remote/checkout' } });
    expect(rpc.mock.calls[1]![0].command).toMatchObject({ type: 'host.list_paths', path: '/remote/checkout', exactName: 'guide.md', limit: 50 });
    expect(rpc.mock.calls[1]![0].command.timeoutMs).toBeGreaterThan(0);
    expect(rpc.mock.calls[1]![0].command.timeoutMs).toBeLessThanOrEqual(5000);
  });
  it('prefers an existing root file', async () => {
    rpc.mockResolvedValueOnce({});
    expect(await resolveThreadPreviewPath(ctx, 't', { path: 'guide.md' })).toMatchObject({ kind: 'resolved', path: 'guide.md' });
    expect(rpc).toHaveBeenCalledTimes(1);
  });
  it.each(['permission_denied', 'host_offline', 'invalid_path'])('does not search after %s', async code => {
    rpc.mockRejectedValueOnce({ code });
    await expect(resolveThreadPreviewPath(ctx, 't', { path: 'guide.md' })).rejects.toMatchObject({ code });
    expect(rpc).toHaveBeenCalledTimes(1);
  });
  it('does not guess from incomplete results', async () => {
    rpc.mockRejectedValueOnce({ code: 'path_not_found' }).mockResolvedValueOnce({ paths: [{ path: 'docs/guide.md', name: 'guide.md', kind: 'file' }], truncated: true });
    expect(await resolveThreadPreviewPath(ctx, 't', { path: 'guide.md' })).toEqual({ kind: 'incomplete', candidates: ['docs/guide.md'] });
  });
  it('offers distinct hints and normalizes duplicate aliases', async () => {
    expect(await resolveThreadPreviewPath(ctx, 't', { path: 'guide.md', candidates: ['docs/guide.md', './docs/guide.md'] })).toMatchObject({ kind: 'resolved', path: 'docs/guide.md' });
    expect(await resolveThreadPreviewPath(ctx, 't', { path: 'guide.md', candidates: ['docs/guide.md', 'other/guide.md'] })).toEqual({ kind: 'ambiguous', candidates: ['docs/guide.md', 'other/guide.md'] });
    expect(rpc).not.toHaveBeenCalled();
  });
  it('rejects escapes, invalid bodies, and malicious hints', async () => {
    for (const input of [null, { path: '' }, { path: '../secret.md' }, { path: 'guide.md', candidates: ['../guide.md'] }, { path: 'a.md', candidates: Array(51).fill('a.md') }]) {
      await expect(resolveThreadPreviewPath(ctx, 't', input)).rejects.toMatchObject({ status: 400 });
    }
    expect(rpc).not.toHaveBeenCalled();
  });
  it('confines explicit paths without basename search', async () => {
    expect(await resolveThreadPreviewPath(ctx, 't', { path: './docs/guide.md' })).toMatchObject({ path: 'docs/guide.md' });
    await expect(resolveThreadPreviewPath(ctx, 't', { path: '/outside/a.md' })).rejects.toMatchObject({ status: 403 });
  });
  it('returns not_found or ambiguous for complete listings', async () => {
    rpc.mockRejectedValueOnce({ code: 'path_not_found' }).mockResolvedValueOnce({ paths: [], truncated: false });
    expect(await resolveThreadPreviewPath(ctx, 't', { path: 'guide.md' })).toEqual({ kind: 'not_found', path: 'guide.md' });
    rpc.mockRejectedValueOnce({ code: 'path_not_found' }).mockResolvedValueOnce({ paths: ['a', 'b'].map(dir => ({ path: `${dir}/guide.md`, name: 'guide.md', kind: 'file' })), truncated: false });
    expect(await resolveThreadPreviewPath(ctx, 't', { path: 'guide.md' })).toEqual({ kind: 'ambiguous', candidates: ['a/guide.md', 'b/guide.md'] });
  });
  it('requires a ready environment or a registered local CLI project', async () => {
    vi.mocked(getEnvironment).mockReturnValue(null);
    await expect(resolveThreadPreviewPath(ctx, 't', { path: 'guide.md' })).rejects.toMatchObject({ status: 409 });
    vi.mocked(getConversationThread).mockReturnValue(null);
    await expect(resolveThreadPreviewPath(ctx, 'session', { path: 'guide.md' })).rejects.toMatchObject({ status: 404 });
    expect(await resolveThreadPreviewPath(ctx, 'session', { path: './docs/guide.md', projectId: 'p' })).toMatchObject({ kind: 'resolved', path: 'docs/guide.md' });
  });
  it('bounds concurrent lookups and releases slots after failures', async () => {
    let fail!: (error: unknown) => void;
    rpc.mockImplementationOnce(() => new Promise((_resolve, reject) => { fail = reject; })).mockImplementationOnce(() => new Promise((_resolve, reject) => { setTimeout(() => reject({ code: 'offline' }), 10); }));
    const first = resolveThreadPreviewPath(ctx, 't', { path: 'one.md' }).catch(e => e);
    const second = resolveThreadPreviewPath(ctx, 't', { path: 'two.md' }).catch(e => e);
    await expect(resolveThreadPreviewPath(ctx, 't', { path: 'three.md' })).rejects.toMatchObject({ status: 429 });
    fail({ code: 'offline' });
    await Promise.all([first, second]);
    rpc.mockResolvedValueOnce({});
    expect(await resolveThreadPreviewPath(ctx, 't', { path: 'three.md' })).toMatchObject({ kind: 'resolved' });
  });
});
