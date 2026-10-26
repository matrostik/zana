const BLOCKED_SCHEMES = /^(https?|mailto|tel|data|javascript|blob):/iu;
const PATH_LINE_PREFIX = /^(?:file|path)\s*:\s+/iu;
const PREVIEW_PATH_LINE_CAP = 8;
const PREVIEW_PATH_CAP = 3;
const INLINE_FILE_EXT = /\.[A-Za-z][A-Za-z0-9]{0,11}$/u;
const LINE_ANCHOR_PATTERN = /#L([1-9]\d*)(?:-L?\d+)?$/iu;

function fileBaseName(path: string): string {
  return path.split(/[/\\]/u).pop() ?? path;
}

function looksLikeFilePath(path: string): boolean {
  if (!path || path.includes('..')) return false;
  return /\.[A-Za-z0-9]{1,12}$/u.test(fileBaseName(path));
}

function looksLikeInlineFileCode(path: string): boolean {
  if (!path || path.includes('..') || /\s/u.test(path)) return false;
  return INLINE_FILE_EXT.test(fileBaseName(path));
}

function stripPathDecorators(raw: string): string {
  return raw.trim().replace(/^`+|`+$/gu, '').replace(/^\*+|\*+$/gu, '');
}

function unwrapLabeledPathLine(line: string): string {
  const stripped = stripPathDecorators(line).replace(/^#{1,6}\s+/u, '');
  const labeled = PATH_LINE_PREFIX.exec(stripped);
  return labeled ? stripped.slice(labeled[0].length).trim() : stripped;
}

export function parseLocalFileMarkdownHref(href: string | undefined): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith('#') || BLOCKED_SCHEMES.test(trimmed)) return null;
  if (/^file:\/\//iu.test(trimmed)) {
    try {
      const withoutHash = trimmed.split('#')[0] ?? trimmed;
      if (withoutHash.includes('..') || /%2e%2e/iu.test(withoutHash)) return null;
      const url = new URL(trimmed);
      if (url.host && url.host !== 'localhost' && url.hostname !== '') return null;
      const path = decodeURIComponent(url.pathname)
        .replace(/^\/+([a-zA-Z]:[\\/])/u, '$1')
        .replace(/\\/gu, '/');
      if (path.includes('..')) return null;
      return looksLikeFilePath(path) ? path : path || null;
    } catch {
      return null;
    }
  }
  const path = (trimmed.split('#')[0] ?? trimmed).replace(/\\/gu, '/');
  if (path.startsWith('/') && !path.startsWith('//') && looksLikeFilePath(path)) return path;
  if (/^[a-zA-Z]:\/[^/]/u.test(path) && looksLikeFilePath(path)) return path;
  if ((/^\.{0,2}\//u.test(path) || /^[\w.-]+\/[\w./-]+$/u.test(path)) && looksLikeFilePath(path)) {
    return path;
  }
  return null;
}

export function parseLocalFileMarkdownLink(
  href: string | undefined
): { path: string; lineNumber: number | null } | null {
  const path = parseLocalFileMarkdownHref(href);
  if (!path || !href) return null;
  const match = LINE_ANCHOR_PATTERN.exec(href.trim());
  const lineNumber = match ? Number(match[1]) : null;
  return {
    path,
    lineNumber: lineNumber && Number.isFinite(lineNumber) && lineNumber > 0 ? lineNumber : null
  };
}

/** Workspace-relative paths an assistant dump or attachment can open in the side-panel preview. */
export function conversationFilePreviewPaths(
  text: string,
  extraPaths: readonly string[] = []
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (raw: string | null | undefined) => {
    if (!raw || out.length >= PREVIEW_PATH_CAP) return;
    const path = parseLocalFileMarkdownHref(unwrapLabeledPathLine(raw));
    if (!path || seen.has(path)) return;
    seen.add(path);
    out.push(path);
  };
  for (const path of extraPaths) add(path);
  for (const line of text.split(/\r?\n/u).slice(0, PREVIEW_PATH_LINE_CAP)) {
    const candidate = unwrapLabeledPathLine(line);
    if (!candidate || candidate.startsWith('```')) continue;
    add(candidate);
    if (out.length >= PREVIEW_PATH_CAP) break;
  }
  return out;
}

/**
 * Inline ``code`` that looks like a workspace file (bare `notes.md` or
 * `src/foo.ts`). Stricter than {@link parseLocalFileMarkdownHref}: letter-starting
 * extension, no spaces, no `..`. Used to turn gold chips into file-preview opens.
 */
export function parseInlineFileCodePath(text: string | undefined): string | null {
  if (!text || /[\r\n]/u.test(text)) return null;
  const path = stripPathDecorators(text).replace(/\\/gu, '/');
  if (!path || path.startsWith('#') || BLOCKED_SCHEMES.test(path)) return null;
  return looksLikeInlineFileCode(path) ? path : null;
}

/**
 * Extract explicit slash file paths from markdown links and inline code in a
 * message so bare filename chips in the same message can resolve against them.
 */
export function extractMarkdownFilePreviewHints(text: string): string[] {
  if (!text) return [];
  const withoutFences = text.replace(/```[\s\S]*?```/gu, '');
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (candidate: string | null) => {
    if (!candidate || !/[/\\]/u.test(candidate) || seen.has(candidate)) return;
    seen.add(candidate);
    out.push(candidate);
  };
  for (const match of withoutFences.matchAll(/\]\(([^)\s]+)\)/gu)) {
    push(parseLocalFileMarkdownHref(match[1]));
  }
  for (const match of withoutFences.matchAll(/`([^`\r\n]+)`/gu)) {
    push(parseInlineFileCodePath(match[1]));
  }
  return out;
}

/**
 * Map an inline file token onto a known workspace path. Bare names take the
 * latest matching basename from `knownPaths` (file-change / file-read rows);
 * slash paths and unmatched names pass through as-is.
 */
export function resolveThreadFilePreviewPath(
  token: string,
  knownPaths: readonly string[] = []
): string | null {
  const parsed = parseInlineFileCodePath(token);
  if (!parsed) return null;
  if (/[/\\]/u.test(parsed)) return parsed;
  const base = fileBaseName(parsed);
  for (let i = knownPaths.length - 1; i >= 0; i--) {
    const path = knownPaths[i];
    if (!path) continue;
    if (fileBaseName(path) === base) return path;
  }
  return parsed;
}
