import { chmodSync, mkdirSync, mkdtempSync, realpathSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CapturedRunner } from './captured-run.js';
import { looksLikeWhisperHelp, WhisperBinaryResolver } from './whisper-binary.js';

const HELP = [
  'usage: whisper-cli [options] file0 file1 ...',
  '  -m FNAME,  --model FNAME   [models/ggml-base.en.bin] model path',
  '  -l LANG,   --language LANG [en] spoken language',
  '  -otxt,     --output-txt    [false] output result in a text file',
  '  -of FNAME, --output-file FNAME [] output file path (without file extension)'
].join('\n');

const dirs: string[] = [];
afterEach(() => dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true })));

const platform = process.platform;
const exeName = platform === 'win32' ? 'whisper-cli.exe' : 'whisper-cli';

function binDir(): string {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'zcc-whisper-bin-')));
  dirs.push(dir);
  return dir;
}

function fakeBinary(dir: string, name = exeName): string {
  mkdirSync(dir, { recursive: true });
  const path = join(dir, name);
  writeFileSync(path, 'binary');
  chmodSync(path, 0o755);
  return path;
}

function runner(output = HELP): ReturnType<typeof vi.fn<CapturedRunner>> {
  return vi.fn<CapturedRunner>(async () => ({ exitCode: 0, signal: null, output, truncated: false, stderr: null, stderrTruncated: false, timedOut: false, aborted: false }));
}

describe('looksLikeWhisperHelp', () => {
  it('requires usage text and every flag the runner uses', () => {
    expect(looksLikeWhisperHelp(HELP)).toBe(true);
    expect(looksLikeWhisperHelp(HELP.replace('--output-file', ''))).toBe(false);
    expect(looksLikeWhisperHelp('--model --language --output-txt --output-file')).toBe(false);
  });
});

describe('WhisperBinaryResolver', () => {
  it('finds whisper-cli on PATH and probes it with --help', async () => {
    const dir = binDir();
    const path = fakeBinary(dir);
    const run = runner();
    const resolver = new WhisperBinaryResolver({ platform, env: { PATH: dir, Path: dir }, run, knownLocations: [] });
    await expect(resolver.resolve(undefined)).resolves.toEqual({ state: 'ready', path, source: 'path', message: null });
    expect(run).toHaveBeenCalledWith(path, ['--help'], expect.objectContaining({ timeoutMs: expect.any(Number) }));
  });

  it('falls back to known install locations after PATH', async () => {
    const path = fakeBinary(binDir());
    const resolver = new WhisperBinaryResolver({ platform, env: { PATH: '', Path: '' }, run: runner(), knownLocations: [path] });
    await expect(resolver.resolve(undefined)).resolves.toMatchObject({ state: 'ready', path, source: 'known' });
  });

  it('skips a PATH entry that fails the probe and reports invalid when none pass', async () => {
    const first = binDir();
    const second = binDir();
    fakeBinary(first);
    const good = fakeBinary(second);
    const run = vi.fn<CapturedRunner>(async (command) => ({
      exitCode: 0, signal: null, truncated: false, stderr: null, stderrTruncated: false, timedOut: false, aborted: false,
      output: command === good ? HELP : 'something else'
    }));
    const env = { PATH: `${first}${delimiter}${second}`, Path: `${first}${delimiter}${second}` };
    const resolver = new WhisperBinaryResolver({ platform, env, run, knownLocations: [] });
    await expect(resolver.resolve(undefined)).resolves.toMatchObject({ state: 'ready', path: good });

    const onlyBad = new WhisperBinaryResolver({ platform, env: { PATH: first, Path: first }, run, knownLocations: [] });
    await expect(onlyBad.resolve(undefined)).resolves.toMatchObject({ state: 'invalid', path: join(first, exeName), source: null });
  });

  it('reports missing when nothing is found', async () => {
    const empty = binDir();
    const resolver = new WhisperBinaryResolver({ platform, env: { PATH: empty, Path: empty }, run: runner(), knownLocations: [] });
    await expect(resolver.resolve(undefined)).resolves.toMatchObject({ state: 'missing', path: null });
  });

  it('treats a configured path as authoritative', async () => {
    const onPath = binDir();
    fakeBinary(onPath);
    const env = { PATH: onPath, Path: onPath };
    // Configured fakes live under the real temp root in tests; point the
    // risky-location check elsewhere so the probe is what decides.
    const safeTmp = join(tmpdir(), 'zcc-whisper-safe-sentinel');
    const resolver = new WhisperBinaryResolver({ platform, env, run: runner(), knownLocations: [], tmpDir: safeTmp });

    await expect(resolver.resolve('whisper-cli')).resolves.toMatchObject({ state: 'invalid', source: 'config', message: expect.stringContaining('absolute') });
    await expect(resolver.resolve(join(binDir(), 'nope'))).resolves.toMatchObject({ state: 'invalid', source: 'config' });

    const configured = fakeBinary(binDir(), 'custom-whisper');
    await expect(resolver.resolve(`  ${configured}  `)).resolves.toEqual({ state: 'ready', path: configured, source: 'config', message: null });

    const failing = new WhisperBinaryResolver({ platform, env, run: runner('not whisper'), knownLocations: [], tmpDir: safeTmp });
    await expect(failing.resolve(configured)).resolves.toMatchObject({ state: 'invalid', path: configured, source: 'config' });
  });

  it('refuses configured binaries in temp or Downloads folders', async () => {
    const home = binDir();
    const downloadsBin = fakeBinary(join(home, 'Downloads'), 'custom-dl');
    const tmpBin = fakeBinary(binDir(), 'custom-tmp');
    const resolver = new WhisperBinaryResolver({ platform, env: {}, run: runner(), knownLocations: [], homeDir: home });
    await expect(resolver.resolve(downloadsBin)).resolves.toMatchObject({
      state: 'invalid', source: 'config', message: expect.stringContaining('permanent')
    });
    await expect(resolver.resolve(tmpBin)).resolves.toMatchObject({
      state: 'invalid', source: 'config', message: expect.stringContaining('permanent')
    });
  });

  it('rejects a directory and treats probe errors or timeouts as invalid', async () => {
    const dir = binDir();
    const resolver = new WhisperBinaryResolver({ platform, env: {}, run: runner(), knownLocations: [], tmpDir: join(tmpdir(), 'zcc-whisper-safe-sentinel') });
    await expect(resolver.resolve(dir)).resolves.toMatchObject({ state: 'invalid' });

    const path = fakeBinary(binDir());
    const safeTmp = join(tmpdir(), 'zcc-whisper-safe-sentinel');
    const throwing = new WhisperBinaryResolver({ platform, env: {}, run: vi.fn<CapturedRunner>(async () => { throw new Error('spawn EACCES'); }), tmpDir: safeTmp });
    await expect(throwing.resolve(path)).resolves.toMatchObject({ state: 'invalid' });
    const slow = new WhisperBinaryResolver({
      platform, env: {}, tmpDir: safeTmp,
      run: vi.fn<CapturedRunner>(async () => ({ exitCode: null, signal: 'SIGKILL', output: HELP, truncated: false, stderr: null, stderrTruncated: false, timedOut: true, aborted: false }))
    });
    await expect(slow.resolve(path)).resolves.toMatchObject({ state: 'invalid' });
  });

  it('caches the probe until the binary changes', async () => {
    const path = fakeBinary(binDir());
    const run = runner();
    const resolver = new WhisperBinaryResolver({ platform, env: {}, run, knownLocations: [], tmpDir: join(tmpdir(), 'zcc-whisper-safe-sentinel') });
    await resolver.resolve(path);
    await resolver.resolve(path);
    expect(run).toHaveBeenCalledTimes(1);

    const later = new Date(Date.now() + 60_000);
    utimesSync(path, later, later);
    await resolver.resolve(path);
    expect(run).toHaveBeenCalledTimes(2);
  });
});
