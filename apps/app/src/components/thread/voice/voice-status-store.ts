import { useEffect } from 'react';
import { create } from 'zustand';
import { fetchVoiceStatus } from '../../../lib/product-client.js';
import { useData } from '../../../store.js';
import type { VoiceAvailability } from './voice-helpers.js';

const FOCUS_REFRESH_MIN_MS = 5_000;

interface VoiceStatusState {
  availability: VoiceAvailability;
  /** Re-reads host readiness. No-op while dictation is off in Experimental. */
  refresh: () => Promise<void>;
}

let inflight: Promise<void> | null = null;

export const useVoiceStatus = create<VoiceStatusState>((set) => ({
  availability: { state: 'unknown', reason: null },
  refresh() {
    if (!useData.getState().voiceInputEnabled) {
      set({ availability: { state: 'unknown', reason: null } });
      return Promise.resolve();
    }
    if (inflight) return inflight;
    inflight = fetchVoiceStatus()
      .then((body) => set({
        availability: body.enabled
          ? { state: 'ready', reason: null }
          : { state: 'unavailable', reason: body.reason ?? 'no_host' }
      }))
      // An unreachable status route is not proof voice is broken: keep the
      // mic usable and let a real attempt report the precise error.
      .catch(() => set({ availability: { state: 'ready', reason: null } }))
      .finally(() => { inflight = null; });
    return inflight;
  }
}));

let syncStarted = false;
let lastFocusRefresh = 0;

/**
 * One app-lifetime subscription (Rule 3): refresh when the Experimental toggle
 * turns on, and when the window regains focus so a fresh `codex login` is
 * picked up without a reload. Idempotent; safe to call from every consumer.
 */
export function startVoiceStatusSync(): void {
  if (syncStarted) return;
  syncStarted = true;
  let wasEnabled = useData.getState().voiceInputEnabled;
  if (wasEnabled) void useVoiceStatus.getState().refresh();
  useData.subscribe((state) => {
    if (state.voiceInputEnabled === wasEnabled) return;
    wasEnabled = state.voiceInputEnabled;
    void useVoiceStatus.getState().refresh();
  });
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', () => {
      const now = Date.now();
      if (!useData.getState().voiceInputEnabled || now - lastFocusRefresh < FOCUS_REFRESH_MIN_MS) return;
      lastFocusRefresh = now;
      void useVoiceStatus.getState().refresh();
    });
  }
}

/** For tests: forget the one-time subscription guard and cached state. */
export function resetVoiceStatusForTests(): void {
  syncStarted = false;
  lastFocusRefresh = 0;
  inflight = null;
  useVoiceStatus.setState({ availability: { state: 'unknown', reason: null } });
}

/** The Experimental toggle plus host readiness — what every mic button reads. */
export function useVoiceAvailability(): { enabled: boolean; availability: VoiceAvailability } {
  const enabled = useData((s) => s.voiceInputEnabled);
  const availability = useVoiceStatus((s) => s.availability);
  useEffect(startVoiceStatusSync, []);
  return { enabled, availability };
}
