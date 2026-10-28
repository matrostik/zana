import { afterEach, expect, it, vi } from 'vitest';
import { product } from '../product-client.js';

afterEach(() => vi.unstubAllGlobals());

it('sends bounded resolution input to the thread endpoint', async () => {
  const result = { kind: 'ambiguous', candidates: ['docs/a.md', 'other/a.md'] };
  const fetchMock = vi.fn(async () => Response.json(result));
  vi.stubGlobal('fetch', fetchMock);
  const input = { path: 'a.md', projectId: 'p', candidates: ['docs/a.md'] };
  await expect(product.threads.resolvePreviewPath('t /1', input)).resolves.toEqual(result);
  expect(String(fetchMock.mock.calls[0]?.[0])).toContain('/threads/t%20%2F1/preview-path/resolve');
  expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: 'POST', body: JSON.stringify(input) });
});

it.each([undefined, 'project /#?'])('sends the optional project scope without changing the file path (%s)', async (projectId) => {
  const file = { path: '.zcc/report #1.md', relPath: '.zcc/report #1.md', content: '# Preview', encoding: 'utf8', contentType: null };
  const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => Response.json(file));
  vi.stubGlobal('fetch', fetchMock);

  await expect(product.threads.hostFileContent('session /1', file.path, projectId)).resolves.toEqual(file);
  const url = new URL(String(fetchMock.mock.calls[0]?.[0]), 'http://localhost');
  expect(url.pathname).toBe('/api/v1/threads/session%20%2F1/host-files/content');
  expect(url.searchParams.get('path')).toBe(file.path);
  expect(url.searchParams.get('projectId')).toBe(projectId ?? null);
});
