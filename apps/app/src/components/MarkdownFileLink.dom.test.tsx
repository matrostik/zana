// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ resolve: vi.fn(), open: vi.fn() }));
vi.mock('../lib/product-client.js', () => ({ product: { threads: { resolvePreviewPath: h.resolve } } }));
vi.mock('./thread/secondary-panel/useThreadOpenFileSignal.js', () => ({
  dispatchThreadOpenFile: h.open
}));
import { MarkdownFileLink } from './MarkdownFileLink.js';

beforeEach(() => { vi.resetAllMocks(); });
afterEach(cleanup);

it('shows duplicate basename choices and opens only the selected path', async () => {
  h.resolve.mockResolvedValue({ kind: 'ambiguous', paths: ['docs/guide.md', 'examples/guide.md'] });
  render(<MarkdownFileLink token="guide.md" threadId="thread-1" />);
  fireEvent.click(screen.getByRole('button', { name: 'Preview guide.md' }));
  const choice = await screen.findByRole('button', { name: 'docs/guide.md' });
  expect(h.resolve).toHaveBeenCalledWith('thread-1', { path: 'guide.md', hints: [] });
  fireEvent.click(choice);
  expect(h.open).toHaveBeenCalledWith('thread-1', 'docs/guide.md');
});

it('shows an incomplete-search message without guessing a file', async () => {
  h.resolve.mockResolvedValue({ kind: 'incomplete', paths: ['docs/guide.md'] });
  render(<MarkdownFileLink token="guide.md" threadId="thread-1" />);
  fireEvent.click(screen.getByRole('button', { name: 'Preview guide.md' }));
  expect((await screen.findByRole('status')).textContent).toMatch(/could not check every folder/i);
  expect(h.open).not.toHaveBeenCalled();
});

it('opens a uniquely resolved path and passes thread scope, project and hints', async () => {
  h.resolve.mockResolvedValue({ kind: 'resolved', path: 'docs/guide.md' });
  render(<MarkdownFileLink token="guide.md" threadId="thread-2" projectId="project-2" hints={['docs/guide.md']} />);
  fireEvent.click(screen.getByRole('button', { name: 'Preview guide.md' }));
  await waitFor(() => expect(h.open).toHaveBeenCalledWith('thread-2', 'docs/guide.md'));
  expect(h.resolve).toHaveBeenCalledWith('thread-2', { path: 'guide.md', hints: ['docs/guide.md'], projectId: 'project-2' });
});

it('reports a missing path and retries after the file becomes available', async () => {
  h.resolve.mockResolvedValueOnce({ kind: 'not_found', path: 'reports/missing.md' })
    .mockResolvedValueOnce({ kind: 'resolved', path: 'reports/missing.md' });
  render(<MarkdownFileLink token="reports/missing.md" threadId="thread-3" />);
  fireEvent.click(screen.getByRole('button', { name: 'Preview missing.md' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
  await waitFor(() => expect(h.open).toHaveBeenCalledWith('thread-3', 'reports/missing.md'));
});

it('renders resolver errors and permits retry', async () => {
  h.resolve.mockRejectedValueOnce(new Error('Host is offline'))
    .mockResolvedValueOnce({ kind: 'not_found', path: 'guide.md' });
  render(<MarkdownFileLink token="guide.md" threadId="thread-4" />);
  fireEvent.click(screen.getByRole('button', { name: 'Preview guide.md' }));
  expect((await screen.findByRole('status')).textContent).toContain('Host is offline');
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect((await screen.findByRole('status')).textContent).toContain('Could not find guide.md');
});

it('preserves file URL anchors and resolves their normalized path', async () => {
  h.resolve.mockResolvedValue({ kind: 'resolved', path: 'docs/guide.md' });
  render(<MarkdownFileLink token="D:/repo/docs/guide.md" threadId="thread-5" href="file:///D:/repo/docs/guide.md" link>
    Guide
  </MarkdownFileLink>);
  const link = screen.getByRole('link', { name: 'Preview guide.md' });
  expect(link.getAttribute('href')).toBe('file:///D:/repo/docs/guide.md');
  fireEvent.click(link);
  expect(h.resolve).toHaveBeenCalledWith('thread-5', { path: 'D:/repo/docs/guide.md', hints: [] });
  await waitFor(() => expect(h.open).toHaveBeenCalledWith('thread-5', 'docs/guide.md'));
});
