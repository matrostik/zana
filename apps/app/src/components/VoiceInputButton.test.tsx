// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { VoiceInputButton } from './VoiceInputButton.js';

const { mocks } = vi.hoisted(() => ({
  mocks: {
    status: vi.fn(),
    toast: vi.fn()
  }
}));

vi.mock('../lib/product-client.js', () => ({
  product: {
    voice: {
      status: mocks.status,
      transcribe: vi.fn(),
      ensureMicAccess: vi.fn(async () => true)
    }
  }
}));
vi.mock('../store.js', () => ({ useUi: (select: any) => select({ pushToast: mocks.toast }) }));

beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(() => cleanup());

it('disables the mic with the local reason while the model is missing', async () => {
  mocks.status.mockResolvedValue({ enabled: true, engine: 'local', ready: false, reason: 'model_not_installed' });
  render(<VoiceInputButton value="" onChange={() => undefined} />);
  const button = await waitFor(() => screen.getByRole('button', { name: /not downloaded/i }));
  expect(button).toHaveProperty('disabled', true);
});

it('enables dictation when the host is ready', async () => {
  mocks.status.mockResolvedValue({ enabled: true, engine: 'cloud', ready: true, reason: null });
  render(<VoiceInputButton value="" onChange={() => undefined} />);
  const button = await waitFor(() => screen.getByRole('button', { name: 'Click to start dictation' }));
  expect(button).toHaveProperty('disabled', false);
});

it('explains a disconnected host', async () => {
  mocks.status.mockRejectedValue(new Error('down'));
  render(<VoiceInputButton value="" onChange={() => undefined} />);
  await waitFor(() => screen.getByRole('button', { name: 'Host daemon is not connected' }));
});
