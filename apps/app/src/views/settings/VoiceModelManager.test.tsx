// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { VoiceModelManager } from './VoiceModelManager.js';

const { mocks } = vi.hoisted(() => ({
  mocks: {
    localStatus: vi.fn(),
    downloadModel: vi.fn(),
    cancelDownload: vi.fn(),
    deleteModel: vi.fn()
  }
}));

vi.mock('../../lib/product-client.js', () => ({ product: { voice: mocks } }));

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
  mocks.localStatus.mockResolvedValue(structuredClone(ready));
  mocks.downloadModel.mockImplementation(async () => structuredClone(ready));
  mocks.cancelDownload.mockImplementation(async () => structuredClone(ready));
  mocks.deleteModel.mockImplementation(async () => structuredClone(ready));
});
afterEach(() => cleanup());

it('shows binary state, per-model states, progress and failure errors', async () => {
  render(<VoiceModelManager selectedModelId="base" />);
  await waitFor(() => expect(screen.getByTestId('voice-binary-status').textContent).toContain('/opt/homebrew/bin/whisper-cli'));
  expect(screen.getByTestId('voice-model-tiny').textContent).toContain('installed');
  expect(screen.getByTestId('voice-model-tiny').textContent).not.toContain('selected');
  expect(screen.getByTestId('voice-model-base').textContent).toContain('selected');
  expect(screen.getByTestId('voice-model-base').textContent).toContain('downloading 50%');
  expect(screen.getByTestId('voice-model-base').querySelector('progress')).not.toBeNull();
  expect(screen.getByTestId('voice-model-small').textContent).toContain('not installed');
  expect(screen.getByTestId('voice-model-medium').textContent).toContain('checksum mismatch');
});

it('downloads, cancels and deletes through product voice', async () => {
  render(<VoiceModelManager />);
  await waitFor(() => expect(screen.getByTestId('voice-model-small')).toBeTruthy());

  fireEvent.click(screen.getByTestId('voice-model-small').querySelector('button')!);
  await waitFor(() => expect(mocks.downloadModel).toHaveBeenCalledWith('small'));

  clickModelButton('voice-model-base');
  await waitFor(() => expect(mocks.cancelDownload).toHaveBeenCalledWith('base'));

  clickModelButton('voice-model-tiny');
  await waitFor(() => expect(mocks.deleteModel).toHaveBeenCalledWith('tiny'));
});

it('reports an unreachable host with a retry', async () => {
  mocks.localStatus.mockRejectedValueOnce(new Error('host session is not connected'));
  render(<VoiceModelManager />);
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Could not reach the host'));
  mocks.localStatus.mockResolvedValueOnce(structuredClone(ready));
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  await waitFor(() => expect(screen.getByTestId('voice-binary-status')).toBeTruthy());
});
