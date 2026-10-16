import { useCallback, useEffect, useRef, useState } from 'react';
import { product } from '../../lib/product-client.js';
import type { VoiceLocalModelStatusResponse, VoiceLocalStatusResponse } from '@zana-ai/zcc-domain/product';

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

function modelActionLabel(state: string): string {
  if (state === 'downloading') return 'Cancel';
  if (state === 'installed') return 'Delete';
  return 'Download';
}

type StatusListener = (status: VoiceLocalStatusResponse | null, error: string | null) => void;
const statusListeners = new Set<StatusListener>();
let currentStatus: VoiceLocalStatusResponse | null = null;
let currentError: string | null = null;
let activePollTimer: number | null = null;

export function resetVoiceLocalStatusForTest() {
  currentStatus = null;
  currentError = null;
  if (activePollTimer !== null) {
    window.clearInterval(activePollTimer);
    activePollTimer = null;
  }
  statusListeners.clear();
}

function broadcastVoiceLocalStatus(status: VoiceLocalStatusResponse | null, error: string | null = null) {
  if (status) currentStatus = status;
  currentError = error;
  for (const listener of statusListeners) {
    listener(status, error);
  }
  product.voice?.notifyStatusChanged?.();
  syncPolling(status);
}

function syncPolling(status: VoiceLocalStatusResponse | null) {
  const isDownloading = status?.models.some((m) => m.state === 'downloading');
  if (isDownloading) {
    if (activePollTimer === null) {
      activePollTimer = window.setInterval(async () => {
        try {
          const fresh = await product.voice.localStatus();
          broadcastVoiceLocalStatus(fresh, null);
        } catch {
          /* ignore transient polling errors */
        }
      }, 2000);
    }
  } else {
    if (activePollTimer !== null) {
      window.clearInterval(activePollTimer);
      activePollTimer = null;
    }
  }
}

function unsubscribeListener(listener: StatusListener) {
  statusListeners.delete(listener);
  if (statusListeners.size === 0) {
    if (activePollTimer !== null) {
      window.clearInterval(activePollTimer);
      activePollTimer = null;
    }
  }
}

/**
 * Local whisper.cpp model manager for Settings → Experimental → Voice input.
 * One row per model with its Download/Cancel/Delete action; progress comes
 * from polling `voice.local.status` while a download is in flight. The model
 * chosen in the Local model picker is marked so the Download button for the
 * selected model is easy to find.
 */
export function VoiceModelManager({ selectedModelId }: { selectedModelId?: string }) {
  const [status, setStatus] = useState<VoiceLocalStatusResponse | null>(() => currentStatus);
  const [error, setError] = useState<string | null>(() => currentError);
  const [busyId, setBusyId] = useState<string | null>(null);
  const refreshSeq = useRef(0);

  const refresh = useCallback(async () => {
    const seq = ++refreshSeq.current;
    try {
      const fresh = await product.voice.localStatus();
      if (refreshSeq.current !== seq) return;
      broadcastVoiceLocalStatus(fresh, null);
    } catch (e) {
      if (refreshSeq.current !== seq) return;
      const msg = e instanceof Error ? e.message : String(e);
      broadcastVoiceLocalStatus(currentStatus, msg);
    }
  }, []);

  useEffect(() => {
    const onUpdate: StatusListener = (nextStatus, nextErr) => {
      setStatus(nextStatus);
      setError(nextErr);
    };
    statusListeners.add(onUpdate);
    void refresh();
    return () => {
      unsubscribeListener(onUpdate);
    };
  }, [refresh]);

  const act = async (id: string, fn: (modelId: string) => Promise<VoiceLocalStatusResponse>) => {
    setBusyId(id);
    try {
      const fresh = await fn(id);
      broadcastVoiceLocalStatus(fresh, null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      broadcastVoiceLocalStatus(currentStatus, msg);
    } finally {
      setBusyId(null);
    }
  };

  const onAction = (model: VoiceLocalModelStatusResponse) => {
    if (model.state === 'downloading') {
      return act(model.id, (modelId) => product.voice.cancelDownload(modelId));
    }
    if (model.state === 'installed') {
      const confirmed = window.confirm(
        `Delete ${model.label} (${formatSize(model.sizeBytes)})? You will need to download it again to use it.`
      );
      if (!confirmed) return;
      return act(model.id, (modelId) => product.voice.deleteModel(modelId));
    }
    return act(model.id, (modelId) => product.voice.downloadModel(modelId));
  };

  if (error && !status) {
    return (
      <p className="settings-note" role="alert">
        Could not reach the host: {error}{' '}
        <button type="button" onClick={() => void refresh()}>
          Retry
        </button>
      </p>
    );
  }
  if (!status) return <p className="settings-note">Checking the host…</p>;

  return (
    <div className="voice-model-manager">
      <h3 className="settings-note">Models</h3>
      <p className="settings-note" data-testid="voice-binary-status">
        {status.binary.state === 'ready'
          ? `whisper-cli ready at ${status.binary.path ?? 'unknown path'}`
          : (status.binary.message ?? 'whisper-cli was not found on the host.')}
      </p>
      {error && (
        <p className="settings-note" role="alert">
          {error}
        </p>
      )}
      <ul>
        {status.models.map((model) => (
          <li key={model.id} data-testid={`voice-model-${model.id}`}>
            <span>
              {model.label} · {formatSize(model.sizeBytes)}
              {model.id === selectedModelId ? ' · selected' : ''} ·{' '}
              {model.state === 'downloading' && model.receivedBytes !== null ? (
                <span aria-live="polite">
                  {`downloading ${Math.round((model.receivedBytes / model.sizeBytes) * 100)}%`}
                </span>
              ) : model.state === 'failed' ? (
                `failed${model.error ? ` — ${model.error}` : ''}`
              ) : (
                model.state.replace('_', ' ')
              )}
            </span>{' '}
            {model.state === 'downloading' && model.receivedBytes !== null && (
              <progress
                value={model.receivedBytes}
                max={model.sizeBytes}
                aria-label={`${model.label} download progress`}
                aria-live="polite"
              />
            )}{' '}
            <button
              type="button"
              aria-label={`${modelActionLabel(model.state)} ${model.label}`}
              disabled={busyId !== null}
              onClick={() => void onAction(model)}
            >
              {busyId === model.id ? 'Working…' : modelActionLabel(model.state)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Download action for the model chosen in the Local model picker. Sits right
 * under the picker: when the selected model is missing it offers its Download
 * button, and after the click it shows live progress (polled) with Cancel.
 * The full list below stays the place for managing every model.
 */
export function SelectedModelDownload({ modelId }: { modelId: string }) {
  const [status, setStatus] = useState<VoiceLocalStatusResponse | null>(() => currentStatus);
  const [loadError, setLoadError] = useState<string | null>(() => currentError);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const onUpdate: StatusListener = (nextStatus, nextErr) => {
      if (cancelled) return;
      if (nextStatus) setStatus(nextStatus);
      if (nextErr) setLoadError(nextErr);
    };
    statusListeners.add(onUpdate);

    product.voice.localStatus().then((fresh) => {
      if (cancelled) return;
      broadcastVoiceLocalStatus(fresh, null);
      setLoadError(null);
    }).catch((err) => {
      if (cancelled) return;
      const msg = err instanceof Error ? err.message : String(err);
      setLoadError(msg);
      broadcastVoiceLocalStatus(currentStatus, msg);
    });

    return () => {
      cancelled = true;
      unsubscribeListener(onUpdate);
    };
  }, [modelId]);

  const act = async (fn: (id: string) => Promise<VoiceLocalStatusResponse>) => {
    setBusy(true);
    setActionError(null);
    try {
      const fresh = await fn(modelId);
      broadcastVoiceLocalStatus(fresh, null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  };

  if (loadError && !status) {
    return (
      <div data-testid="voice-download-error">
        <p className="settings-note" role="alert">
          Could not check model status: {loadError}
        </p>
      </div>
    );
  }

  const model = status?.models.find((candidate) => candidate.id === modelId) ?? null;
  if (!model) return null;

  if (model.state === 'installed') {
    return (
      <div data-testid={`voice-download-${model.id}`}>
        <p className="settings-note">{`${model.label} is downloaded and ready.`}</p>
      </div>
    );
  }
  if (model.state === 'downloading') {
    return (
      <div data-testid={`voice-download-${model.id}`}>
        <p className="settings-note" aria-live="polite">{`Downloading ${model.label}…${model.receivedBytes === null ? '' : ` ${Math.round((model.receivedBytes / model.sizeBytes) * 100)}%`}`}</p>
        {model.receivedBytes !== null && (
          <progress value={model.receivedBytes} max={model.sizeBytes} aria-label={`${model.label} download progress`} aria-live="polite" />
        )}{' '}
        <button type="button" aria-label={`Cancel ${model.label} download`} disabled={busy} onClick={() => void act((id) => product.voice.cancelDownload(id))}>
          Cancel
        </button>
      </div>
    );
  }
  return (
    <div data-testid={`voice-download-${model.id}`}>
      {model.state === 'failed' && (
        <p className="settings-note" role="alert">{`Last download failed: ${model.error ?? 'unknown error'}`}</p>
      )}
      <button type="button" disabled={busy} onClick={() => void act((id) => product.voice.downloadModel(id))}>
        {`Download ${model.label} (${formatSize(model.sizeBytes)})`}
      </button>
      {actionError && (
        <p className="settings-note" role="alert">{actionError}</p>
      )}
    </div>
  );
}
