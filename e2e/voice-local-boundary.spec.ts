import { existsSync, openSync, closeSync, ftruncateSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from './fixtures/app.js';
import { VOICE_MODEL_CATALOG } from '../apps/host-daemon/src/local-voice/model-catalog.js';

// Voice local-boundary E2E: the FULL production path with no route fakes —
// renderer → product server → local host RPC → fake whisper-cli → transcript
// file → composer. Covers executable resolution (configured absolute path +
// --help probe), env/HOME/cwd (invocation sidecar), realistic output size
// (>8192 bytes, the historic Electron pipe-truncation threshold), timeout
// (hang → 504) and error behavior (exit 1 → toast WITHOUT the model path,
// proving daemon redaction), plus the model manager's real status list.
//
// POSIX-only: the whisper-cli fixture is a script, and Windows cannot spawn
// scripts without a shell (EFTYPE). CI (merge authority) runs this on Linux.
test.skip(process.platform === 'win32', 'whisper-cli fixture is a POSIX executable; Windows cannot spawn scripts');

const fixtureBin = fileURLToPath(new URL('./fixtures/bin/whisper-cli', import.meta.url));

test.use({
  launchEnv: { ZCC_FAKE_PROVIDER: '1' },
  initialConfig: {
    sponsorPromptDismissed: true,
    voiceInputEnabled: true,
    voiceEngine: 'local',
    voiceLocalModel: 'tiny',
    voiceWhisperBinary: fixtureBin
  }
});

const TRANSCRIPT_MARKER = 'Whisper boundary works.';

/** A real (silent) 1s 16 kHz mono 16-bit WAV, like mobile-voice.spec.ts. */
function installSyntheticWavMicrophone() {
  const samples = 16000;
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  const ascii = (at: number, text: string) => { for (let i = 0; i < text.length; i++) view.setUint8(at + i, text.charCodeAt(i)); };
  ascii(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  ascii(8, 'WAVE');
  ascii(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 16000, true);
  view.setUint32(28, 32000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, 'data');
  view.setUint32(40, samples * 2, true);
  const wav = new Blob([buffer], { type: 'audio/mp4' });
  Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: async () => new MediaStream() });
  class Recorder {
    static isTypeSupported(type: string) { return type === 'audio/mp4'; }
    mimeType = 'audio/mp4';
    state = 'inactive';
    onstart?: () => void;
    ondataavailable?: (event: { data: Blob }) => void;
    onstop?: () => void;
    start() { this.state = 'recording'; this.onstart?.(); }
    stop() {
      this.state = 'inactive';
      this.ondataavailable?.({ data: wav });
      this.onstop?.();
    }
  }
  Object.defineProperty(window, 'MediaRecorder', { value: Recorder });
}

/** Seed an "installed" tiny model: the daemon trusts size after one verification. */
function seedInstalledTinyModel(home: string): void {
  const tiny = VOICE_MODEL_CATALOG.find((m) => m.id === 'tiny')!;
  const dir = join(home, '.zcc', 'voice-models', tiny.sha256);
  mkdirSync(dir, { recursive: true });
  const fd = openSync(join(dir, tiny.fileName), 'w');
  try {
    ftruncateSync(fd, tiny.sizeBytes);
  } finally {
    closeSync(fd);
  }
}

function invocationsLog(home: string): string {
  const e2eHome = join(home, '.whisper-invocations.log');
  if (existsSync(e2eHome)) return e2eHome;
  return join(tmpdir(), '.whisper-invocations.log');
}

test('local dictation runs the real server-to-whisper path and the manager lists real status', async ({ app, home }, testInfo) => {
  test.setTimeout(240_000);
  seedInstalledTinyModel(home);
  for (const stale of [join(home, '.whisper-invocations.log'), join(tmpdir(), '.whisper-invocations.log')]) {
    try { rmSync(stale, { force: true }); } catch { /* fresh run */ }
  }

  // No voice-status / voice-transcription route fakes: the real chain runs.
  await app.electron.evaluate(({ ipcMain }) => {
    ipcMain.removeHandler('voice:ensureMicAccess');
    ipcMain.handle('voice:ensureMicAccess', async () => true);
  });
  await app.window.addInitScript(installSyntheticWavMicrophone);

  const project = join(home, 'voice-boundary-project');
  mkdirSync(project);
  const threadId = await app.window.evaluate(async (path: string) => {
    const project = await window.cc.projects.add(path);
    if (!project.ok) throw new Error('Cannot add voice fixture project');
    const response = await fetch('/api/v1/threads', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ projectId: project.value.id, providerId: 'fake', input: 'Voice fixture' }) });
    const body = await response.json();
    return (body.thread ?? body.value).id;
  }, project);
  await app.window.goto(`${new URL(app.window.url()).origin}/threads/${threadId}`);

  // Ready via the REAL --help probe + seeded model: the mic enables itself.
  const start = app.window.getByRole('button', { name: 'Start voice input', exact: true });
  await expect(start).toBeEnabled({ timeout: 60_000 });

  const input = app.window.getByTestId('thread-command-input');
  await expect(input).toBeVisible();
  await input.fill('Boundary draft: ');
  await input.press('End');
  await start.click();
  await expect(app.window.getByTestId('thread-voice-bar')).toBeVisible();
  await app.window.waitForTimeout(1100);
  await app.window.getByRole('button', { name: 'Stop and transcribe recording', exact: true }).click();
  await expect(input).toContainText(TRANSCRIPT_MARKER, { timeout: 60_000 });
  // >8192 bytes end to end: the historic Electron pipe-truncation threshold.
  const length = await input.evaluate((el: HTMLElement) => el.innerText.length);
  expect(length).toBeGreaterThan(8192);

  // The fixture really spawned: real argv, cwd and HOME on record.
  await expect.poll(async () => existsSync(invocationsLog(home)), { timeout: 30_000 }).toBe(true);
  const invocations = readFileSync(invocationsLog(home), 'utf8').trim().split('\n');
  const first = JSON.parse(invocations[0]!) as { argv: string[]; cwd: string; home?: string };
  expect(first.argv).toEqual(expect.arrayContaining(['-m', '-f', '-otxt', '-of']));
  expect(first.argv[first.argv.indexOf('-of') + 1]!).toMatch(/zcc-whisper-.*\.out$/);
  expect(first.cwd.length).toBeGreaterThan(0);
  if (first.home) expect(first.home).toBe(home);

  // Exit-1 path: the daemon redacts the echoed model path before the UI.
  await app.window.evaluate(() => window.cc.config.set({ voiceLanguage: 'xx' }));
  await start.click();
  await expect(app.window.getByTestId('thread-voice-bar')).toBeVisible();
  await app.window.waitForTimeout(1100);
  await app.window.getByRole('button', { name: 'Stop and transcribe recording', exact: true }).click();
  const toast = app.window.locator('.toast.error');
  await expect(toast).toContainText('failed to load model', { timeout: 60_000 });
  await expect(toast).not.toContainText('ggml-tiny.bin');

  // Hang path: the daemon timeout kills the child → 504 guidance.
  await app.window.evaluate(() => window.cc.config.set({ voiceLanguage: 'yy' }));
  await start.click();
  await expect(app.window.getByTestId('thread-voice-bar')).toBeVisible();
  await app.window.waitForTimeout(1100);
  await app.window.getByRole('button', { name: 'Stop and transcribe recording', exact: true }).click();
  await expect(toast).toContainText('timed out', { timeout: 120_000 });
  await app.window.evaluate(() => window.cc.config.set({ voiceLanguage: '' }));
  await app.window.screenshot({ path: testInfo.outputPath('voice-boundary-transcript.png') });

  // Model manager over the REAL voice-local/status RPC: binary ready from the
  // fake, seeded tiny installed, the rest not installed — no downloads start.
  await app.window.goto(`${new URL(app.window.url()).origin}/settings/experimental`);
  await expect(app.window.getByTestId('voice-binary-status')).toContainText('whisper-cli ready', { timeout: 30_000 });
  await expect(app.window.getByTestId('voice-model-tiny')).toContainText('installed');
  await expect(app.window.getByTestId('voice-model-small')).toContainText('not installed');
  await expect(app.window.getByRole('button', { name: 'Download Small' })).toBeVisible();
  await expect(app.window.getByRole('button', { name: 'Delete Tiny' })).toBeVisible();
  await expect(app.window.getByTestId('voice-download-tiny')).toContainText('downloaded and ready');
});
