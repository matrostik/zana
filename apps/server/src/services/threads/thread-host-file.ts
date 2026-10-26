import { open } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { resolveContainedReal } from '@zana-ai/zcc-path-confine';
import type { HostListPathsResult, HostReadFileResult } from '@zana-ai/zcc-contracts/host-rpc';
import { getConversationThread, getEnvironment } from '@zana-ai/zcc-db';
import type { ProductHttpContext } from '../../http/product-context.js';
import { ThreadCreateError } from '../../http/thread-create.js';
import { ProjectFsError } from '../../http/project-fs-via-host.js';
import { isSafeRelPath } from '../../http/library-via-host.js';
import { confinePathToRoot } from './thread-path-confine.js';
import { projectAttachmentDir } from '../projects/attachments.js';
import { PROMPT_ATTACHMENT_MAX_BYTES } from '@zana-ai/zcc-domain/thread-runtime';

const IMAGE_EXT = new Set(['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.avif']);
export const IMAGE_READ_MAX_BYTES = PROMPT_ATTACHMENT_MAX_BYTES;

export function imageContentType(path: string): string | null {
  const lower = path.toLowerCase();
  const dot = lower.lastIndexOf('.');
  if (dot < 0) return null;
  const ext = lower.slice(dot);
  if (!IMAGE_EXT.has(ext)) return null;
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.bmp') return 'image/bmp';
  if (ext === '.avif') return 'image/avif';
  return 'image/webp';
}

/** Binary previews must keep their bytes intact across JSON transport. */
export function previewContentType(path: string): string | null {
  return path.toLowerCase().endsWith('.pdf') ? 'application/pdf' : imageContentType(path);
}

async function readContainedLocalFile(
  root: string,
  candidate: string,
  relPath: string,
  notFoundMessage = 'file not found'
): Promise<{ path: string; relPath: string; content: string; encoding: 'utf8' | 'base64'; contentType: string | null }> {
  const real = await resolveContainedReal(root, relPath);
  if (!real) throw new ProjectFsError(404, 'path_not_found', notFoundMessage);
  const file = await open(real, 'r');
  try {
    const info = await file.stat();
    if (!info.isFile()) throw new ProjectFsError(404, 'path_not_found', notFoundMessage);
    const contentType = previewContentType(relPath);
    const cap = contentType?.startsWith('image/') ? IMAGE_READ_MAX_BYTES : 2_000_000;
    if (info.size > cap) throw new ProjectFsError(413, 'too_large', 'file exceeds the read cap');
    // Bound the read too, in case the file grows after stat().
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of file.createReadStream({ end: cap, autoClose: false })) {
      size += chunk.length;
      if (size > cap) throw new ProjectFsError(413, 'too_large', 'file exceeds the read cap');
      chunks.push(chunk);
    }
    return {
      path: candidate,
      relPath,
      content: Buffer.concat(chunks).toString(contentType ? 'base64' : 'utf8'),
      encoding: contentType ? 'base64' : 'utf8',
      contentType
    };
  } finally {
    await file.close();
  }
}

function pickUniqueShallowest(paths: string[]): string | null {
  if (paths.length === 0) return null;
  if (paths.length === 1) return paths[0]!;
  const sorted = [...paths].sort((a, b) => a.split('/').length - b.split('/').length);
  return sorted[0]!.split('/').length < sorted[1]!.split('/').length ? sorted[0]! : null;
}

async function resolveFallbackHostFileRelPath(
  ctx: ProductHttpContext,
  hostId: string,
  root: string,
  relPath: string
): Promise<string | null> {
  const normalized = relPath.replace(/\\/gu, '/');
  const baseName = normalized.split('/').pop() ?? normalized;
  if (!baseName) return null;
  try {
    const listed = await ctx.hostHub.callHostOnlineRpc<HostListPathsResult>({
      hostId,
      command: {
        type: 'host.list_paths',
        path: root,
        limit: 20,
        includeFiles: true,
        includeDirectories: false,
        query: baseName
      }
    });
    if (!listed || !Array.isArray(listed.paths)) return null;
    const safeFiles = listed.paths.filter((entry) => entry.kind === 'file' && entry.path && isSafeRelPath(entry.path));
    if (normalized.includes('/')) {
      const suffix = `/${normalized}`;
      const suffixMatches = safeFiles
        .map((entry) => entry.path.replace(/\\/gu, '/'))
        .filter((path) => path.endsWith(suffix));
      return pickUniqueShallowest(suffixMatches);
    }
    const exact = safeFiles
      .filter((entry) => (entry.name || entry.path.split('/').pop()) === baseName)
      .map((entry) => entry.path);
    const exactMatch = pickUniqueShallowest(exact);
    if (exactMatch) return exactMatch;
    const lower = baseName.toLowerCase();
    const insensitive = safeFiles
      .filter((entry) => (entry.name || entry.path.split('/').pop())?.toLowerCase() === lower)
      .map((entry) => entry.path);
    return pickUniqueShallowest(insensitive);
  } catch {
    return null;
  }
}

export async function readThreadHostFile(
  ctx: ProductHttpContext,
  threadId: string,
  candidate: string,
  projectId?: string
): Promise<{ path: string; relPath: string; content: string; encoding: 'utf8' | 'base64'; contentType: string | null }> {
  const thread = getConversationThread(ctx.db, threadId);
  // CLI preview tabs are owned by a PTY session, not a conversation row.
  // Resolve their scope from the registered project, as preview_file does.
  const project = !thread && projectId
    ? ctx.toProjects().find((row) => row.id === projectId)
    : null;
  if (!thread && (!project?.path || !isAbsolute(project.path) || project.remote)) {
    throw new ThreadCreateError(404, 'unknown-thread', 'thread is not registered');
  }
  const normalizedCandidate = candidate.replace(/^\/+([a-zA-Z]:[\\/])/u, '$1');
  // Uploaded images and thread-storage files live on the server, outside the host checkout.
  // Resolve only this thread's authoritative attachment or thread-storage root.
  if (thread && isAbsolute(normalizedCandidate) && ctx.dataDir) {
    if (thread.projectId) {
      const attachmentRoot = projectAttachmentDir(ctx.dataDir, thread.projectId);
      const attachmentPath = confinePathToRoot(attachmentRoot, normalizedCandidate);
      if (attachmentPath && isSafeRelPath(attachmentPath)) {
        return readContainedLocalFile(attachmentRoot, candidate, attachmentPath, 'attachment not found');
      }
    }
    const storageRoot = join(ctx.dataDir, 'thread-storage', thread.id);
    const storagePath = confinePathToRoot(storageRoot, normalizedCandidate);
    if (storagePath && isSafeRelPath(storagePath)) {
      return readContainedLocalFile(storageRoot, candidate, storagePath);
    }
  }
  const environment = thread?.environmentId ? getEnvironment(ctx.db, thread.environmentId) : null;
  const root = thread ? environment?.path : project?.path;
  if (!root) {
    throw new ThreadCreateError(409, 'environment_not_ready', 'environment is not provisioned');
  }
  const relPath = confinePathToRoot(root, normalizedCandidate);
  if (!relPath || !isSafeRelPath(relPath)) {
    throw new ProjectFsError(403, 'path-escape', 'path is not inside the thread environment');
  }
  const hostId = thread ? thread.hostId : ctx.hostHub.resolveHostId(project?.hostId);
  try {
    const result = await ctx.hostHub.callHostOnlineRpc<HostReadFileResult>({
      hostId,
      command: {
        type: 'host.read_file',
        root,
        relPath
      }
    });
    return {
      path: candidate,
      relPath,
      content: result.content,
      encoding: result.encoding,
      contentType: previewContentType(relPath)
    };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'path_not_found') {
      if (thread && ctx.dataDir) {
        try {
          return await readContainedLocalFile(join(ctx.dataDir, 'thread-storage', thread.id), candidate, relPath);
        } catch (storageErr) {
          if (storageErr instanceof ProjectFsError && storageErr.status === 413) throw storageErr;
        }
      }
      const fallbackRelPath = await resolveFallbackHostFileRelPath(ctx, hostId, root, relPath);
      if (fallbackRelPath) {
        try {
          const result = await ctx.hostHub.callHostOnlineRpc<HostReadFileResult>({
            hostId,
            command: { type: 'host.read_file', root, relPath: fallbackRelPath }
          });
          return {
            path: candidate,
            relPath: fallbackRelPath,
            content: result.content,
            encoding: result.encoding,
            contentType: previewContentType(fallbackRelPath)
          };
        } catch (fallbackErr) {
          if (fallbackErr && typeof fallbackErr === 'object' && 'code' in fallbackErr && (fallbackErr as { code: string }).code === 'too_large') {
            throw new ProjectFsError(413, 'too_large', 'file exceeds the read cap');
          }
        }
      }
      throw new ProjectFsError(404, 'path_not_found', 'file not found');
    }
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'too_large') {
      throw new ProjectFsError(413, 'too_large', 'file exceeds the read cap');
    }
    throw error;
  }
}
