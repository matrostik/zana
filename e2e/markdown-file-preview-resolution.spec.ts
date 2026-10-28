import { mkdirSync, realpathSync, writeFileSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test, expect } from './fixtures/app.js';
import { openDatabase, appendConversationThreadEvent, getPrimaryHost, createEnvironment, createConversationThread } from '../packages/db/src/index.js';

test.use({ isolateBundledCatalog: true, launchEnv: { ZCC_FAKE_PROVIDER: '1' }, initialConfig: { sponsorPromptDismissed: true } });

test('assistant file chips resolve untouched files and links preserve authorized reads', async ({ app }) => {
  const { window, home } = app;
  const root = join(realpathSync(home), 'preview-resolution');
  for (const dir of ['docs', 'examples', 'output']) mkdirSync(join(root, dir), { recursive: true });
  writeFileSync(join(root, 'docs', 'getting-started.md'), '# Getting started content');
  writeFileSync(join(root, 'docs', 'guide.md'), '# Docs guide content');
  writeFileSync(join(root, 'examples', 'guide.md'), '# Example guide content');
  writeFileSync(join(root, 'root.md'), '# Root guide content');
  writeFileSync(join(root, 'docs', 'root.md'), '# Other root guide content');
  writeFileSync(join(root, 'docs', 'report #1.md'), '# File URL content');
  writeFileSync(join(home, 'outside.md'), 'PRIVATE OUTSIDE CONTENT');
  symlinkSync(join(home, 'outside.md'), join(root, 'escape.md'));
  const fileUrl = pathToFileURL(join(root, 'docs', 'report #1.md')).href;
  const drivePath = join(root, 'root.md').replace(/\\/gu, '/');
  const input = 'Files in docs/: `getting-started.md`, `guide.md`, `root.md`.\n\n[Drive URL](' + fileUrl + ')\n\n[Direct drive](' + drivePath + ')\n\n[Generated report](output/review-report.md)\n\n[Alias](./docs/getting-started.md)';
  const projectId = await window.evaluate(async (root) => {
    const project = await window.cc.projects.add(root);
    if (!project.ok) throw new Error(project.message);
    return project.value.id;
  }, root);
  // Seed the persisted assistant answer: this preview test does not depend on
  // an agent subprocess starting successfully on the test host.
  const db = openDatabase(join(home, '.zcc', 'zcc.sqlite'));
  let threadId: string;
  try {
    const host = getPrimaryHost(db);
    if (!host) throw new Error('Isolated app did not enroll its primary host');
    const environment = createEnvironment(db, { projectId, hostId: host.id, path: root, workspaceProvisionType: 'unmanaged', status: 'ready' });
    threadId = createConversationThread(db, { projectId, hostId: host.id, environmentId: environment.id, providerId: 'fake', status: 'idle', title: 'Preview fixture' }).id;
    const add = (type: string, fields: object) => appendConversationThreadEvent(db, { threadId, type, payload: {
      type, threadId, providerThreadId: 'preview-fixture',
      scope: type === 'client/turn/requested' ? { kind: 'thread' } : { kind: 'turn', turnId: 'preview-turn' }, ...fields
    } });
    db.transaction(() => {
      add('client/turn/requested', { requestId: 'preview-request', source: 'tell', initiator: 'user', senderThreadId: null, target: { kind: 'new-turn' }, input: [{ type: 'text', text: 'Preview fixture', mentions: [] }] });
      add('turn/started', {});
      add('item/completed', { item: { id: 'preview-answer', type: 'agentMessage', text: `Response to: ${input}` } });
      add('turn/completed', { status: 'completed' });
    });
  } finally { db.close(); }
  const ids = { threadId, projectId };
  await window.evaluate((threadId) => {
    history.pushState({}, '', `/threads/${threadId}`); dispatchEvent(new PopStateEvent('popstate'));
  }, ids.threadId);
  const assistant = window.getByTestId('thread-assistant-text').filter({ hasText: 'Response to:' });
  await expect(assistant).toBeVisible();
  const panel = window.getByTestId('thread-secondary-panel');
  await assistant.getByRole('button', { name: 'Preview getting-started.md' }).click();
  await expect(panel.getByRole('heading', { name: 'Getting started content' })).toBeVisible();
  await assistant.getByRole('link', { name: 'Alias' }).click();
  await expect(panel.getByRole('heading', { name: 'Getting started content' })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'getting-started.md', exact: true })).toHaveCount(1);
  await assistant.getByRole('button', { name: 'Preview guide.md' }).click();
  await expect(assistant.getByRole('group', { name: 'Choose a file' })).toBeVisible();
  await assistant.getByRole('button', { name: 'examples/guide.md', exact: true }).focus();
  await assistant.getByRole('button', { name: 'examples/guide.md', exact: true }).press('Enter');
  await expect(panel.getByRole('heading', { name: 'Example guide content' })).toBeVisible();
  await assistant.getByRole('button', { name: 'Preview root.md' }).click();
  await expect(panel.getByRole('heading', { name: 'Root guide content' })).toBeVisible();
  await assistant.getByRole('link', { name: 'Direct drive' }).click();
  await expect(panel.getByRole('heading', { name: 'Root guide content' })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'root.md', exact: true })).toHaveCount(1);
  await assistant.getByRole('link', { name: 'Drive URL' }).click();
  await expect(panel.getByRole('heading', { name: 'File URL content' })).toBeVisible();
  if (process.platform === 'win32') expect(fileUrl).toMatch(/^file:\/\/\/[a-z]:\//iu);
  await assistant.getByRole('link', { name: 'Generated report' }).click();
  await expect(panel).toContainText('If another step generates this file');
  await expect(panel).toContainText(join(root, 'output', 'review-report.md'));
  writeFileSync(join(root, 'output', 'review-report.md'), '# Generated report content');
  await panel.getByRole('button', { name: 'Try again' }).click();
  await expect(panel.getByRole('heading', { name: 'Generated report content' })).toBeVisible();
  await assistant.getByRole('link', { name: 'Generated report' }).click();
  await expect(panel.getByRole('button', { name: 'review-report.md', exact: true })).toHaveCount(1);
  const responses = await window.evaluate(async ({ threadId, projectId }) => Promise.all(['../outside.md', 'escape.md'].map(async path => {
    const response = await fetch(`/api/v1/threads/${threadId}/host-files/content?${new URLSearchParams({ path, projectId })}`);
    return { status: response.status, body: await response.text() };
  })), ids);
  expect(responses.every(r => r.status >= 400 && !r.body.includes('PRIVATE OUTSIDE CONTENT'))).toBe(true);
});
