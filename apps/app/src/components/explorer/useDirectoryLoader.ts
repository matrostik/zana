import { useCallback, useEffect, useRef, useState } from 'react';
import type { FsEntry } from '@zana-ai/zcc-domain/product';

export const DIRECTORY_SLOW_MS = 5000;

/** Mount-local listings: never reused across Explorer visits or checkout scopes. */
export function useDirectoryLoader(readDirectory: (path: string) => Promise<FsEntry[]>) {
  const [entries, setEntries] = useState(new Map<string, FsEntry[]>());
  const [loading, setLoading] = useState(new Set<string>());
  const [slow, setSlow] = useState(new Set<string>());
  const [errors, setErrors] = useState(new Map<string, string>());
  const cache = useRef(new Map<string, FsEntry[]>());
  const requests = useRef(new Map<string, { promise: Promise<FsEntry[]>; timer: ReturnType<typeof setTimeout> }>());
  const generation = useRef(0);

  const invalidate = useCallback(() => {
    generation.current++;
    for (const request of requests.current.values()) clearTimeout(request.timer);
    requests.current.clear();
    cache.current.clear();
  }, []);
  const reset = useCallback(() => {
    invalidate();
    setEntries(new Map());
    setLoading(new Set());
    setSlow(new Set());
    setErrors(new Map());
  }, [invalidate]);

  useEffect(() => {
    reset();
    return invalidate;
  }, [readDirectory, reset, invalidate]);

  const loadDir = useCallback((path: string, force = false): Promise<FsEntry[]> => {
    if (!force) {
      const pending = requests.current.get(path);
      if (pending) return pending.promise;
      const cached = cache.current.get(path);
      if (cached) return Promise.resolve(cached);
    }
    // Forced reads replace rather than join the old request. IPC has no abort
    // surface, so identity + generation checks also protect non-cancellable reads.
    const previous = requests.current.get(path);
    if (previous) clearTimeout(previous.timer);
    cache.current.delete(path);
    setEntries(current => { const next = new Map(current); next.delete(path); return next; });
    setErrors(current => { const next = new Map(current); next.delete(path); return next; });
    setSlow(current => { const next = new Set(current); next.delete(path); return next; });
    setLoading(current => new Set(current).add(path));
    const epoch = generation.current;
    const request = {
      promise: Promise.resolve([] as FsEntry[]),
      timer: setTimeout(() => {
        if (isCurrent()) setSlow(current => new Set(current).add(path));
      }, DIRECTORY_SLOW_MS)
    };
    const isCurrent = () => generation.current === epoch && requests.current.get(path) === request;
    requests.current.set(path, request);
    request.promise = Promise.resolve().then(() => isCurrent() ? readDirectory(path) : []).then(list => {
      if (!isCurrent()) return [];
      cache.current.set(path, list);
      setEntries(current => new Map(current).set(path, list));
      return list;
    }).catch(error => {
      if (isCurrent()) {
        const message = error instanceof Error ? error.message : 'Failed to list directory';
        setErrors(current => new Map(current).set(path, message));
      }
      return [];
    }).finally(() => {
      clearTimeout(request.timer);
      if (!isCurrent()) return;
      requests.current.delete(path);
      setLoading(current => { const next = new Set(current); next.delete(path); return next; });
      setSlow(current => { const next = new Set(current); next.delete(path); return next; });
    });
    return request.promise;
  }, [readDirectory]);

  return { entries, loading, slow, errors, loadDir, reset };
}
