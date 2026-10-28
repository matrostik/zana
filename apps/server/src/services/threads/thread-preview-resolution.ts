export type PreviewPathCandidateResult =
  | { kind: 'resolved'; path: string }
  | { kind: 'ambiguous' | 'incomplete'; paths: string[] }
  | { kind: 'not_found' };

export async function resolvePreviewPathCandidate(
  requested: string,
  hints: readonly string[],
  exists: (path: string) => Promise<boolean>,
  search: () => Promise<{ paths: string[]; truncated: boolean }>,
  explicitPath = requested.includes('/') || requested.includes('\\')
): Promise<PreviewPathCandidateResult> {
  if (explicitPath) {
    return await exists(requested) ? { kind: 'resolved', path: requested } : { kind: 'not_found' };
  }

  const matches = [...new Set(hints.filter((path) => path.split(/[/\\]/u).at(-1) === requested))];
  if (matches.length > 1) return { kind: 'ambiguous', paths: matches };
  const hint = matches[0];
  if (hint && await exists(hint)) return { kind: 'resolved', path: hint };
  if (await exists(requested)) return { kind: 'resolved', path: requested };

  if (explicitPath) return { kind: 'not_found' };
  const result = await search();
  const paths = [...new Set(result.paths)];
  if (result.truncated) return { kind: 'incomplete', paths };
  if (paths.length > 1) return { kind: 'ambiguous', paths };
  if (paths.length === 1) return { kind: 'resolved', path: paths[0]! };
  return { kind: 'not_found' };
}
import type { HostFileMetadataResult, HostListPathsResult } from '@zana-ai/zcc-contracts/host-rpc';
import { getConversationThread, getEnvironment } from '@zana-ai/zcc-db';
import type { PreviewPathRequest, PreviewPathResult } from '@zana-ai/zcc-server-contract';
import type { ProductHttpContext } from '../../http/product-context.js';
import { ProjectFsError } from '../../http/project-fs-via-host.js';
import { isSafeRelPath } from '../../http/library-via-host.js';
import { confinePathToRoot, threadPathApi } from './thread-path-confine.js';

const activeByHost = new Map<string, number>();
const LOOKUP_LIMIT = 50;
const LOOKUP_TIMEOUT_MS = 5000;


function isMissing(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error
    && (error as { code: unknown }).code === 'path_not_found');
}

/** Resolve a Markdown file token against the thread's authoritative checkout. */
export async function resolveThreadPreviewPath(
  ctx: ProductHttpContext,
  threadId: string,
  input: PreviewPathRequest
): Promise<PreviewPathResult> {
  const thread = getConversationThread(ctx.db, threadId);
  const project = !thread && input.projectId
    ? ctx.toProjects().find((row) => row.id === input.projectId)
    : null;
  if (!thread && (!project?.path || project.remote)) {
    throw new ProjectFsError(404, 'unknown-thread', 'thread is not registered');
  }
  if (thread && input.projectId && input.projectId !== thread.projectId) {
    throw new ProjectFsError(403, 'scope-mismatch', 'preview scope does not match the thread');
  }
  const root = thread
    ? (thread.environmentId ? getEnvironment(ctx.db, thread.environmentId)?.path : null)
    : project?.path;
  if (!root) throw new ProjectFsError(409, 'environment_not_ready', 'environment is not provisioned');
  const hostId = thread ? thread.hostId : ctx.hostHub.resolveHostId(project?.hostId);
  const paths = threadPathApi(root);
  const requested = input.path;
  const isBare = !/[\\/]/u.test(requested) && !/^[a-z]:/iu.test(requested);
  const confined = (candidate: string): string | null => {
    const rel = confinePathToRoot(root, candidate);
    return rel && isSafeRelPath(rel) ? rel : null;
  };
  const hintPaths = isBare
    ? [...new Set((input.hints ?? []).map(confined).filter((path): path is string =>
      Boolean(path && paths.basename(path) === requested)))].slice(0, LOOKUP_LIMIT)
    : [];
  const requestedRel = confined(requested);
  if (!requestedRel) throw new ProjectFsError(403, 'path-escape', 'path is not inside the thread workspace');
  const deadline = Date.now() + LOOKUP_TIMEOUT_MS;

  const exists = async (relPath: string): Promise<boolean> => {
    const timeoutMs = deadline - Date.now();
    if (timeoutMs <= 0) throw new ProjectFsError(504, 'preview-timeout', 'File lookup timed out. Try again.');
    try {
      await ctx.hostHub.callHostOnlineRpc<HostFileMetadataResult>({
        hostId,
        timeoutMs,
        command: {
          type: 'host.file_metadata',
          path: paths.resolve(root, relPath),
          rootPath: root
        }
      });
      return true;
    } catch (error) {
      if (isMissing(error)) return false;
      throw error;
    }
  };

  const search = async (): Promise<{ paths: string[]; truncated: boolean }> => {
    const timeoutMs = deadline - Date.now();
    if (timeoutMs <= 0) return { paths: [], truncated: true };
    const active = activeByHost.get(hostId) ?? 0;
    if (active >= 2) throw new ProjectFsError(429, 'preview-busy', 'File lookup is busy. Try again.');
    activeByHost.set(hostId, active + 1);
    try {
      const result = await ctx.hostHub.callHostOnlineRpc<HostListPathsResult>({
        hostId,
        timeoutMs,
        command: {
          type: 'host.list_paths',
          path: root,
          exactName: requested,
          timeoutMs,
          limit: LOOKUP_LIMIT,
          includeFiles: true,
          includeDirectories: false
        }
      });
      const found = result.paths
        .filter((entry) => entry.kind === 'file' && entry.name === requested)
        .map((entry) => confined(entry.path))
        .filter((path): path is string => Boolean(path));
      return { paths: [...new Set(found)], truncated: result.truncated || Date.now() >= deadline };
    } finally {
      if (active) activeByHost.set(hostId, active); else activeByHost.delete(hostId);
    }
  };

  const result = await resolvePreviewPathCandidate(
    requestedRel,
    hintPaths,
    exists,
    search,
    !isBare
  );
  return result.kind === 'not_found'
    ? { kind: 'not_found', path: requestedRel }
    : result;
}
