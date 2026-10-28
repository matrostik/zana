import { getConversationThread, getEnvironment } from '@zana-ai/zcc-db';
import { previewPathRequestSchema, type PreviewPathResult } from '@zana-ai/zcc-server-contract';
import type { HostListPathsResult } from '@zana-ai/zcc-contracts/host-rpc';
import type { ProductHttpContext } from '../../http/product-context.js';
import { ProjectFsError } from '../../http/project-fs-via-host.js';
import { confinePathToRoot, threadPathApi } from './thread-path-confine.js';
import { isSafeRelPath } from '../../http/library-via-host.js';
import { threadLocalPreviewRoots } from './thread-preview-roots.js';

const inFlight = new Map<string, number>();

export async function resolveThreadPreviewPath(ctx: ProductHttpContext, threadId: string, body: unknown): Promise<PreviewPathResult> {
  const parsed = previewPathRequestSchema.safeParse(body);
  if (!parsed.success) throw new ProjectFsError(400, 'invalid-request', 'Invalid preview path request');
  const input = parsed.data;
  const thread = getConversationThread(ctx.db, threadId);
  const project = !thread && input.projectId ? ctx.toProjects().find(p => p.id === input.projectId) : null;
  if (!thread && (!project?.path || project.remote || !threadPathApi(project.path).isAbsolute(project.path))) {
    throw new ProjectFsError(404, 'unknown-thread', 'thread is not registered');
  }
  const resolved = (value: string): PreviewPathResult => ({ kind: 'resolved', source: 'workspace', path: value });
  // Match the reader's existing server-owned artifact scope. This remains a
  // lexical open intent; the eventual read enforces realpath and byte caps.
  if (ctx.dataDir) {
    for (const localRoot of threadLocalPreviewRoots(ctx.dataDir, thread?.projectId)) {
      const localPaths = threadPathApi(localRoot);
      if (!localPaths.isAbsolute(input.path)) continue;
      const local = confinePathToRoot(localRoot, input.path);
      if (local && isSafeRelPath(local)) return resolved(localPaths.resolve(localRoot, local));
    }
  }
  const root = thread ? (thread.environmentId ? getEnvironment(ctx.db, thread.environmentId)?.path : null) : project?.path;
  if (!root) throw new ProjectFsError(409, 'environment_not_ready', 'environment is not provisioned');
  const paths = threadPathApi(root);
  const confined = (path: string) => {
    const rel = confinePathToRoot(root, path);
    if (!rel || !isSafeRelPath(rel)) throw new ProjectFsError(403, 'path-escape', 'path is not inside the thread environment');
    return rel;
  };
  const path = confined(input.path);
  if (/[/\\]/u.test(input.path)) return resolved(path);
  const candidates = [...new Set((input.candidates ?? []).map(confined).filter(p => paths.basename(p) === input.path))];
  if (candidates.length === 1) return resolved(candidates[0]!);
  if (candidates.length > 1) return { kind: 'ambiguous', candidates };
  const hostId = thread ? thread.hostId : ctx.hostHub.resolveHostId(project?.hostId);
  if ((inFlight.get(hostId) ?? 0) >= 2) throw new ProjectFsError(429, 'preview-busy', 'File lookup is busy. Try again.');
  inFlight.set(hostId, (inFlight.get(hostId) ?? 0) + 1);
  const deadline = Date.now() + 5000;
  try {
    try {
      await ctx.hostHub.callHostOnlineRpc({ hostId, timeoutMs: 5000, command: { type: 'host.file_metadata', path: paths.resolve(root, path), rootPath: root } });
      return resolved(path);
    } catch (error) {
      if (!error || typeof error !== 'object' || !('code' in error) || error.code !== 'path_not_found') throw error;
    }
    const remaining = deadline - Date.now();
    if (remaining <= 0) return { kind: 'incomplete', candidates: [] };
    const result = await ctx.hostHub.callHostOnlineRpc<HostListPathsResult>({ hostId, timeoutMs: remaining,
      command: { type: 'host.list_paths', path: root, exactName: input.path, timeoutMs: remaining, limit: 50, includeFiles: true, includeDirectories: false } });
    // The host verifies case equivalence against its actual filesystem.
    const matches = [...new Set(result.paths.filter(p => p.kind === 'file' && (p.name === input.path || (paths.sep === '\\' && p.name.toLowerCase() === input.path.toLowerCase()))).map(p => confined(p.path)))];
    if (result.truncated) return { kind: 'incomplete', candidates: matches };
    if (matches.length === 1) return resolved(matches[0]!);
    return matches.length ? { kind: 'ambiguous', candidates: matches } : { kind: 'not_found', path };
  } finally {
    const active = (inFlight.get(hostId) ?? 1) - 1;
    if (active) inFlight.set(hostId, active); else inFlight.delete(hostId);
  }
}
