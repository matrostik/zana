// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { EXPLORER_MINIMAP_DEFAULTS } from '@zana-ai/zcc-domain/product';

const set = vi.hoisted(() => vi.fn());
vi.mock('../../lib/product-client.js', () => ({ product: {
  config: { get: vi.fn(async () => ({})), set, onChanged: () => () => {} },
  app: { homedir: vi.fn(async () => '/home/u') },
  openers: { openIn: vi.fn(async () => undefined) }
} }));
import { useData, useUi } from '@/store';
import { SettingsView } from './SettingsView';

beforeEach(() => {
  set.mockReset();
  set.mockImplementation(async (patch: object) => patch);
  useData.setState({ explorerMinimap: EXPLORER_MINIMAP_DEFAULTS });
  useUi.setState({ settingsTab: 'editor', settingsAnchor: null });
});
afterEach(cleanup);

it('mirrors an Explorer minimap change made in Settings into the store', async () => {
  render(<MemoryRouter initialEntries={['/settings']}><SettingsView /></MemoryRouter>);
  fireEvent.click(await screen.findByRole('switch', { name: 'Minimap' }));
  await waitFor(() => expect(useData.getState().explorerMinimap.enabled).toBe(false));
  expect(set).toHaveBeenCalledWith({ explorerMinimapEnabled: false });
});
