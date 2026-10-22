import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { FsEntry } from '@zana-ai/zcc-domain/product';

export const DIRECTORY_SLOW_MS = 5000;

interface DirectoryState {
  entries: Map<string, FsEntry[]>;
  loading: Set<string>;
  slow: Set<string>;
  errors: Map<string, string>;
}

type DirectoryAction =
  | { type: 'RESET' }
  | { type: 'START_LOAD'; path: string }
  | { type: 'MARK_SLOW'; path: string }
  | { type: 'SUCCESS'; path: string; entries: FsEntry[] }
  | { type: 'FAILURE'; path: string; error: string };

const INITIAL_STATE: DirectoryState = {
  entries: new Map(),
  loading: new Set(),
  slow: new Set(),
  errors: new Map(),
};

function directoryReducer(state: DirectoryState, action: DirectoryAction): DirectoryState {
  switch (action.type) {
    case 'RESET':
      return {
        entries: new Map(),
        loading: new Set(),
        slow: new Set(),
        errors: new Map(),
      };
    case 'START_LOAD': {
      const entries = new Map(state.entries);
      entries.delete(action.path);
      const errors = new Map(state.errors);
      errors.delete(action.path);
      const slow = new Set(state.slow);
      slow.delete(action.path);
      const loading = new Set(state.loading);
      loading.add(action.path);
      return { entries, loading, slow, errors };
    }
    case 'MARK_SLOW': {
      if (!state.loading.has(action.path)) return state;
      const slow = new Set(state.slow);
      slow.add(action.path);
      return { ...state, slow };
    }
    case 'SUCCESS': {
      const entries = new Map(state.entries);
      entries.set(action.path, action.entries);
      const loading = new Set(state.loading);
      loading.delete(action.path);
      const slow = new Set(state.slow);
      slow.delete(action.path);
      return { ...state, entries, loading, slow };
    }
    case 'FAILURE': {
      const errors = new Map(state.errors);
      errors.set(action.path, action.error);
      const loading = new Set(state.loading);
      loading.delete(action.path);
      const slow = new Set(state.slow);
      slow.delete(action.path);
      return { ...state, errors, loading, slow };
    }
  }
}

interface PendingRequest {
  promise: Promise<FsEntry[]>;
  timer: ReturnType<typeof setTimeout>;
}

/** Mount-local listings: never reused across Explorer visits or checkout scopes. */
export function useDirectoryLoader(readDirectory: (path: string) => Promise<FsEntry[]>) {
  const [{ entries, loading, slow, errors }, dispatch] = useReducer(directoryReducer, INITIAL_STATE);
  const cache = useRef(new Map<string, FsEntry[]>());
  const requests = useRef(new Map<string, PendingRequest>());
  const generation = useRef(0);

  const invalidate = useCallback(() => {
    generation.current++;
    for (const request of requests.current.values()) clearTimeout(request.timer);
    requests.current.clear();
    cache.current.clear();
  }, []);

  const reset = useCallback(() => {
    invalidate();
    dispatch({ type: 'RESET' });
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
    dispatch({ type: 'START_LOAD', path });

    const epoch = generation.current;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const isCurrent = () => generation.current === epoch && requests.current.get(path)?.timer === timer;

    timer = setTimeout(() => {
      if (isCurrent()) dispatch({ type: 'MARK_SLOW', path });
    }, DIRECTORY_SLOW_MS);

    const promise = Promise.resolve()
      .then(() => (isCurrent() ? readDirectory(path) : []))
      .then(list => {
        if (!isCurrent()) return [];
        cache.current.set(path, list);
        dispatch({ type: 'SUCCESS', path, entries: list });
        return list;
      })
      .catch(error => {
        if (isCurrent()) {
          const message = error instanceof Error ? error.message : 'Failed to list directory';
          dispatch({ type: 'FAILURE', path, error: message });
        }
        return [];
      })
      .finally(() => {
        clearTimeout(timer);
        if (!isCurrent()) return;
        requests.current.delete(path);
      });

    const request: PendingRequest = { promise, timer };
    requests.current.set(path, request);
    return promise;
  }, [readDirectory]);

  return { entries, loading, slow, errors, loadDir, reset };
}
