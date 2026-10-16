// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetVoiceLocalStatusForTest, SelectedModelDownload, VoiceModelManager } from './VoiceModelManager.js';

const { mocks } = vi.hoisted(() => ({
  mocks: {
    localStatus: vi.fn(),
    downloadModel: vi.fn(),
    cancelDownload: vi.fn(),
    deleteModel: vi.fn()
  }
}));

vi.mock('../../lib/product-client.js', () => ({
  product: {
    voice: {
      ...mocks,
      notifyStatusChanged: vi.fn()
    }
  }
}));

const ready = {
  binary: { state: 'ready', path: '/opt/homebrew/bin/whisper-cli', source: 'path', message: null },
  models: [
    { id: 'tiny', label: 'Tiny', sizeBytes: 77691713, state: 'installed', receivedBytes: null, error: null },
    { id: 'base', label: 'Base', sizeBytes: 147951465, state: 'downloading', receivedBytes: 73975732, error: null },
    { id: 'small', label: 'Small', sizeBytes: 487601967, state: 'not_installed', receivedBytes: null, error: null },
    { id: 'medium', label: 'Medium', sizeBytes: 1533763059, state: 'failed', receivedBytes: null, error: 'checksum mismatch' }
  ]
};

function clickModelButton(testId: string) {
  const button = screen.getByTestId(testId).querySelector('button');
  if (!button) throw new Error(`no button in ${testId}`);
  fireEvent.click(button);
}

beforeEach(() => {
  vi.clearAllMocks();
  resetVoiceLocalStatusForTest();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  mocks.localStatus.mockResolvedValue(structuredClone(ready));
  mocks.downloadModel.mockImplementation(async () => structuredClone(ready));
  mocks.cancelDownload.mockImplementation(async () => structuredClone(ready));
  mocks.deleteModel.mockImplementation(async () => structuredClone(ready));
});
afterEach(() => {
  cleanup();
  resetVoiceLocalStatusForTest();
});

it('shows binary state, per-model states, progress and failure errors', async () => {
  render(<VoiceModelManager selectedModelId="base" />);
  await waitFor(() => expect(screen.getByTestId('voice-binary-status').textContent).toContain('/opt/homebrew/bin/whisper-cli'));
  expect(screen.getByRole('heading', { level: 3, name: 'Models' })).toBeTruthy();
  expect(screen.getByTestId('voice-model-tiny').textContent).toContain('installed');
  expect(screen.getByTestId('voice-model-tiny').textContent).not.toContain('selected');
  expect(screen.getByTestId('voice-model-base').textContent).toContain('selected');
  expect(screen.getByTestId('voice-model-base').textContent).toContain('downloading 50%');
  expect(screen.getByTestId('voice-model-base').querySelector('progress')).not.toBeNull();
  expect(screen.getByTestId('voice-model-small').textContent).toContain('not installed');
  expect(screen.getByTestId('voice-model-medium').textContent).toContain('checksum mismatch');
  // Accessible button labels include model name
  expect(screen.getByRole('button', { name: 'Download Small' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Cancel Base' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Delete Tiny' })).toBeTruthy();
});

it('downloads, cancels and deletes through product voice with delete confirmation', async () => {
  render(<VoiceModelManager />);
  await waitFor(() => expect(screen.getByTestId('voice-model-small')).toBeTruthy());

  fireEvent.click(screen.getByTestId('voice-model-small').querySelector('button')!);
  await waitFor(() => expect(mocks.downloadModel).toHaveBeenCalledWith('small'));

  clickModelButton('voice-model-base');
  await waitFor(() => expect(mocks.cancelDownload).toHaveBeenCalledWith('base'));

  // Cancelling delete does not delete
  vi.mocked(window.confirm).mockReturnValueOnce(false);
  clickModelButton('voice-model-tiny');
  expect(mocks.deleteModel).not.toHaveBeenCalled();

  // Confirming delete deletes with model label in prompt
  vi.mocked(window.confirm).mockReturnValueOnce(true);
  clickModelButton('voice-model-tiny');
  await waitFor(() => expect(mocks.deleteModel).toHaveBeenCalledWith('tiny'));
  expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Delete Tiny (74 MB)?'));
});

it('reports an unreachable host with a retry', async () => {
  mocks.localStatus.mockRejectedValueOnce(new Error('host session is not connected'));
  render(<VoiceModelManager />);
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Could not reach the host'));
  mocks.localStatus.mockResolvedValueOnce(structuredClone(ready));
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  await waitFor(() => expect(screen.getByTestId('voice-binary-status')).toBeTruthy());
});

describe('SelectedModelDownload', () => {
  it('offers the selected model for download with its size', async () => {
    render(<SelectedModelDownload modelId="small" />);
    const action = await waitFor(() => screen.getByTestId('voice-download-small'));
    expect(action.textContent).toContain('Download Small (465 MB)');
    fireEvent.click(action.querySelector('button')!);
    await waitFor(() => expect(mocks.downloadModel).toHaveBeenCalledWith('small'));
  });

  it('shows progress and cancel while the selected model downloads', async () => {
    render(<SelectedModelDownload modelId="base" />);
    const action = await waitFor(() => screen.getByTestId('voice-download-base'));
    expect(action.textContent).toContain('Downloading Base… 50%');
    expect(action.querySelector('progress')).not.toBeNull();
    fireEvent.click(action.querySelector('button')!);
    await waitFor(() => expect(mocks.cancelDownload).toHaveBeenCalledWith('base'));
  });

  it('confirms an installed model and retries a failed one with alert role', async () => {
    render(<SelectedModelDownload modelId="tiny" />);
    await waitFor(() => expect(screen.getByTestId('voice-download-tiny')).toBeTruthy());
    expect(screen.getByTestId('voice-download-tiny').textContent).toContain('Tiny is downloaded and ready.');

    cleanup();
    resetVoiceLocalStatusForTest();
    render(<SelectedModelDownload modelId="medium" />);
    const action = await waitFor(() => screen.getByTestId('voice-download-medium'));
    expect(action.textContent).toContain('Last download failed: checksum mismatch');
    expect(action.querySelector('[role="alert"]')?.textContent).toContain('Last download failed: checksum mismatch');
    fireEvent.click(action.querySelector('button')!);
    await waitFor(() => expect(mocks.downloadModel).toHaveBeenCalledWith('medium'));
  });

  it('renders nothing when the model is unknown', async () => {
    const { container } = render(<SelectedModelDownload modelId="large" />);
    await waitFor(() => expect(mocks.localStatus).toHaveBeenCalled());
    expect(container.textContent).toBe('');
  });

  it('renders error with role alert when localStatus rejects', async () => {
    mocks.localStatus.mockRejectedValueOnce(new Error('daemon offline'));
    render(<SelectedModelDownload modelId="small" />);
    const alert = await waitFor(() => screen.getByRole('alert'));
    expect(alert.textContent).toContain('daemon offline');
  });

  it('synchronizes SelectedModelDownload and VoiceModelManager without drift', async () => {
    const { unmount } = render(
      <div>
        <SelectedModelDownload modelId="small" />
        <VoiceModelManager selectedModelId="small" />
      </div>
    );

    await waitFor(() => expect(screen.getByTestId('voice-download-small')).toBeTruthy());

    const downloadingSmall = structuredClone(ready);
    downloadingSmall.models[2] = { id: 'small', label: 'Small', sizeBytes: 487601967, state: 'downloading', receivedBytes: 1000, error: null };
    mocks.downloadModel.mockResolvedValueOnce(downloadingSmall);

    // Click download in SelectedModelDownload
    fireEvent.click(screen.getByTestId('voice-download-small').querySelector('button')!);

    // VoiceModelManager list updates immediately to downloading state
    await waitFor(() => {
      expect(screen.getByTestId('voice-model-small').textContent).toContain('downloading');
    });

    // Delete in VoiceModelManager updates SelectedModelDownload
    const uninstalledTiny = structuredClone(downloadingSmall);
    uninstalledTiny.models[0] = { id: 'tiny', label: 'Tiny', sizeBytes: 77691713, state: 'not_installed', receivedBytes: null, error: null };
    mocks.deleteModel.mockResolvedValueOnce(uninstalledTiny);

    clickModelButton('voice-model-tiny');
    await waitFor(() => expect(mocks.deleteModel).toHaveBeenCalledWith('tiny'));

    unmount();
  });
});
