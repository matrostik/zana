import { useCallback, useEffect, useRef, useState } from 'react';
import { product } from '../../lib/product-client.js';
import type { VoiceLocalStatusResponse } from '@zana-ai/zcc-domain/product';

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

function modelActionLabel(state: string): string {
  if (state === 'downloading') return 'Cancel';
  if (state === 'installed') return 'Delete';
  return 'Download';
}

/**
 * Local whisper.cpp model manager for Settings → Experimental → Voice input.
 * One row per model with its Download/Cancel/Delete action; progress comes
 * from polling `voice.local.status` while a download is in flight. The model
 * chosen in the Local model picker is marked so the Download button for the
 * selected model is easy to find.
 */
export function VoiceModelManager({ selectedModelId }: { selectedModelId?: string }) {
  const [status, setStatus] = useState<VoiceLocalStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      setStatus(await product.voice.localStatus());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    if (status?.models.some((model) => model.state === 'downloading')) {
      timer.current = window.setInterval(() => {
        void refresh();
      }, 2000);
    }
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [status, refresh]);

  const act = async (id: string, fn: (modelId: string) => Promise<VoiceLocalStatusResponse>) => {
    setBusyId(id);
    try {
      setStatus(await fn(id));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyId(null);
    }
  };

  const onAction = (id: string, state: string) => {
    if (state === 'downloading') return act(id, (modelId) => product.voice.cancelDownload(modelId));
    if (state === 'installed') return act(id, (modelId) => product.voice.deleteModel(modelId));
    return act(id, (modelId) => product.voice.downloadModel(modelId));
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
      <p className="settings-note">Models</p>
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
              {model.state === 'downloading' && model.receivedBytes !== null
                ? `downloading ${Math.round((model.receivedBytes / model.sizeBytes) * 100)}%`
                : model.state === 'failed'
                  ? `failed${model.error ? ` — ${model.error}` : ''}`
                  : model.state.replace('_', ' ')}
            </span>{' '}
            {model.state === 'downloading' && model.receivedBytes !== null && (
              <progress value={model.receivedBytes} max={model.sizeBytes} aria-label={`${model.label} download progress`} />
            )}{' '}
            <button
              type="button"
              disabled={busyId !== null}
              onClick={() => void onAction(model.id, model.state)}
            >
              {busyId === model.id ? 'Working…' : modelActionLabel(model.state)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
