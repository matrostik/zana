import { DEFAULT_ICON, FILE_EXTENSIONS, FILE_NAMES, ICONS } from './seti.generated.js';

export interface FileIconRef {
  /** Seti icon id; also the `seti-<id>` CSS class that carries its color. */
  id: string;
  /** The glyph in the Seti font. */
  char: string;
}

const memo = new Map<string, FileIconRef>();

function basename(path: string): string {
  return path.slice(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1);
}

/**
 * Pick the Seti icon for a file the way VS Code does: exact (lowercased)
 * basename first, then the longest extension ("d.ts" before "ts", so
 * `foo.test.tsx` tries `test.tsx` then `tsx`), then the default icon.
 * Accepts a bare name or a path.
 */
export function resolveFileIcon(nameOrPath: string): FileIconRef {
  const cached = memo.get(nameOrPath);
  if (cached) return cached;
  const name = basename(nameOrPath).toLowerCase();
  let id = FILE_NAMES[name];
  for (let dot = name.indexOf('.'); id === undefined && dot !== -1; dot = name.indexOf('.', dot + 1)) {
    id = FILE_EXTENSIONS[name.slice(dot + 1)];
  }
  const resolved = id ?? DEFAULT_ICON;
  const ref = { id: resolved, char: ICONS[resolved] };
  memo.set(nameOrPath, ref);
  return ref;
}
