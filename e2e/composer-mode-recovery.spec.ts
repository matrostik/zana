import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from './fixtures/app.js';

test.use({ launchEnv: { ZCC_FAKE_PROVIDER: '1' }, isolateBundledCatalog: true,
  initialConfig: { tmuxScope: 'off', sponsorPromptDismissed: true } });

test('removed saved Plan stays visible and recovers explicitly without losing the draft', async ({ app, home }) => {
  const win = app.window;
  let offerPlan = true;
  await win.route('**/api/v1/system/execution-options*', route => route.fulfill({ json: {
    providers: [{ id: 'fake', displayName: 'Fake', available: true,
      composerActions: offerPlan ? ['plan'] : [], capabilities: { permissionModes: ['full'] } }],
    models: [{ id: 'fake-model', model: 'fake-model', displayName: 'Fake', isDefault: true, supportedReasoningEfforts: [] }],
    selectedOnlyModels: [], permissionCeiling: 'full', modelLoadError: null
  } }));
  const path = join(home, 'mode-recovery'); mkdirSync(path);
  const threadId = await win.evaluate(async path => {
    const project = await window.cc.projects.add(path);
    if (!project.ok) throw new Error(project.message);
    const response = await fetch('/api/v1/threads', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ projectId: project.value.id, providerId: 'fake', input: 'Initial turn' }) });
    const body = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(body));
    return body.thread.id as string;
  }, path);
  await win.evaluate(id => { history.pushState({}, '', `/threads/${id}`); dispatchEvent(new PopStateEvent('popstate')); }, threadId);
  const input = win.getByTestId('thread-command-input');
  await input.fill('Keep this draft');
  await win.getByTestId('composer-mode-picker-trigger').click();
  await win.getByTestId('composer-mode-plan').click();
  offerPlan = false;
  await win.getByTestId('model-reasoning-picker-trigger').click();
  await win.getByRole('button', { name: 'Reload models', exact: true }).click();
  await win.keyboard.press('Escape');
  await expect(win.getByTestId('composer-mode-picker-trigger')).toContainText('Plan (unavailable)');
  await expect(win.getByText('The saved composer mode is unavailable. Choose an available mode before sending.')).toBeVisible();
  let sends = 0;
  win.on('request', request => { if (request.url().endsWith(`/threads/${threadId}/send`)) sends++; });
  await win.getByRole('button', { name: 'Switch to Agent', exact: true }).click();
  await expect(win.getByTestId('composer-mode-picker-trigger')).toContainText('Agent');
  await expect(win.getByRole('button', { name: 'Switch to Agent', exact: true })).toHaveCount(0);
  await expect(input).toHaveText('Keep this draft');
  expect(sends).toBe(0);
});
