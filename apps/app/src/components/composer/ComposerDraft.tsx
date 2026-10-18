import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, useCallback, type Dispatch, type SetStateAction, type ReactNode } from 'react';
import { ComposerSession, composerSession } from './composer-session.js';

const ComposerDraftContext = createContext<ComposerSession | null>(null);

/** A stable key retains a surface through navigation; omitted keys remain instance-local. */
export function ComposerDraftProvider({ children, sessionKey }: { children: ReactNode; sessionKey?: string }) {
  const draft = useMemo(() => sessionKey ? composerSession(sessionKey) : new ComposerSession(), [sessionKey]);
  useEffect(() => {
    const release = draft.retain();
    return () => { release(); if (!sessionKey || draft.retentionError) draft.dispose(); };
  }, [draft, sessionKey]);
  return <ComposerDraftContext.Provider value={draft}>{children}</ComposerDraftContext.Provider>;
}

export function useComposerDraft() {
  return useContext(ComposerDraftContext);
}

export function useComposerSession(fallbackKey?: string) {
  const context = useComposerDraft();
  const session = useMemo(() => context ?? (fallbackKey ? composerSession(fallbackKey) : new ComposerSession()), [context, fallbackKey]);
  useEffect(() => {
    const release = session.retain();
    return () => { release(); if (!context && !fallbackKey) session.dispose(); };
  }, [context, fallbackKey, session]);
  return session;
}

/** Explicit field choices are stored separately from asynchronously arriving defaults. */
export function useComposerSetting<T>(session: ComposerSession, key: string, initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>, boolean] {
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);
  const fallback = useMemo(() => typeof initial === 'function' ? (initial as () => T)() : initial, [session, key]);
  const present = Object.hasOwn(snapshot.settings, key);
  const value = present ? snapshot.settings[key] as T : fallback;
  const set = useCallback<Dispatch<SetStateAction<T>>>((next) => {
    const current = session.getSnapshot();
    const previous = Object.hasOwn(current.settings, key) ? current.settings[key] as T : fallback;
    session.setSetting(key, typeof next === 'function' ? (next as (value: T) => T)(previous) : next);
  }, [session, key, fallback]);
  return [value, set, present];
}
