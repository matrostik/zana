/** @vitest-environment happy-dom */
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
const mocks = vi.hoisted(() => ({ resolve: vi.fn(), open: vi.fn() }));
vi.mock('../lib/product-client.js', () => ({ product: { threads: { resolvePreviewPath: mocks.resolve } } }));
vi.mock('./thread/secondary-panel/useThreadOpenFileSignal.js', () => ({ dispatchThreadOpenFile: mocks.open }));
import { MarkdownFileLink } from './MarkdownFileLink.js';
afterEach(() => { cleanup(); vi.resetAllMocks(); });
it('preserves the canonical server-owned artifact identity', async () => {
  const path = 'D:\\data\\artifacts\\report.md';
  mocks.resolve.mockResolvedValue({ kind: 'resolved', source: 'workspace', path });
  const view = render(<MarkdownFileLink path="report.md" threadId="t">Report</MarkdownFileLink>);
  fireEvent.click(view.getByRole('button', { name: 'Preview report.md' }));
  await waitFor(() => expect(mocks.open).toHaveBeenCalledWith('t', path));
});
it('opens a Markdown anchor and dismisses the chooser without opening a file', async () => {
  mocks.resolve.mockResolvedValue({ kind: 'ambiguous', candidates: ['docs/guide.md', 'other/guide.md'] });
  const view = render(<MarkdownFileLink path="guide.md" threadId="t" href="guide.md">Guide</MarkdownFileLink>);
  fireEvent.click(view.getByRole('link', { name: 'Guide' }));
  fireEvent.click(await view.findByRole('button', { name: 'Dismiss' }));
  expect(view.queryByRole('group', { name: 'Choose a file' })).toBeNull();
  expect(mocks.open).not.toHaveBeenCalled();
});
it('uses authoritative normalization for an explicit path without basename lookup', async () => {
  mocks.resolve.mockResolvedValue({ kind: 'resolved', source: 'workspace', path: 'docs/guide.md' });
  const view = render(<MarkdownFileLink path="./docs/guide.md" threadId="t">guide.md</MarkdownFileLink>);
  fireEvent.click(view.getByRole('button', { name: 'Preview guide.md' }));
  await waitFor(() => expect(mocks.open).toHaveBeenCalledWith('t', 'docs/guide.md'));
  expect(mocks.resolve).toHaveBeenCalledWith('t', { path: './docs/guide.md' });
});
it('coalesces clicks and lets the user choose an ambiguous file', async () => {
  let finish!: (value: unknown) => void;
  mocks.resolve.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  const view = render(<MarkdownFileLink path="guide.md" threadId="t" projectId="p" candidates={['docs/guide.md', 'other/guide.md']}>guide.md</MarkdownFileLink>);
  const button = view.getByRole('button', { name: 'Preview guide.md' });
  fireEvent.click(button); fireEvent.click(button);
  expect(mocks.resolve).toHaveBeenCalledTimes(1);
  finish({ kind: 'ambiguous', candidates: ['docs/guide.md', 'other/guide.md'] });
  fireEvent.click(await view.findByRole('button', { name: 'docs/guide.md' }));
  expect(mocks.open).toHaveBeenCalledWith('t', 'docs/guide.md');
});
it('never auto-opens incomplete results and permits retry after failure', async () => {
  mocks.resolve.mockRejectedValueOnce(new Error('Host offline')).mockResolvedValueOnce({ kind: 'incomplete', candidates: ['docs/guide.md'] });
  const view = render(<MarkdownFileLink path="guide.md" threadId="t">guide.md</MarkdownFileLink>);
  fireEvent.click(view.getByRole('button', { name: 'Preview guide.md' }));
  await view.findByText('Host offline');
  fireEvent.click(view.getByRole('button', { name: 'Preview guide.md' }));
  await view.findByText(/Lookup was incomplete/);
  expect(mocks.open).not.toHaveBeenCalled();
});
it('ignores a stale result after scope changes', async () => {
  let finish!: (value: unknown) => void;
  mocks.resolve.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  const view = render(<MarkdownFileLink path="guide.md" threadId="a">guide.md</MarkdownFileLink>);
  fireEvent.click(view.getByRole('button', { name: 'Preview guide.md' }));
  view.rerender(<MarkdownFileLink path="guide.md" threadId="b">guide.md</MarkdownFileLink>);
  finish({ kind: 'resolved', path: 'docs/guide.md', source: 'workspace' });
  await waitFor(() => expect(mocks.open).not.toHaveBeenCalled());
});
it.each(['resolved', 'not_found'])('dispatches a %s result to the preview', async kind => {
  mocks.resolve.mockResolvedValue({ kind, path: 'docs/guide.md' });
  const view = render(<MarkdownFileLink path="guide.md" threadId="t">guide.md</MarkdownFileLink>);
  fireEvent.click(view.getByRole('button', { name: 'Preview guide.md' }));
  await waitFor(() => expect(mocks.open).toHaveBeenCalledWith('t', 'docs/guide.md'));
});
