import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { runCaptured } from './captured-run.js';

const dirs: string[] = [];
afterEach(() => dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true })));

function script(source: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'zcc-captured-run-'));
  dirs.push(dir);
  const path = join(dir, 'child.mjs');
  writeFileSync(path, source);
  return path;
}

function leftoverCaptureFiles(): string[] {
  return readdirSync(tmpdir()).filter((name) => name.startsWith('zcc-voice-') && name.endsWith('.log'));
}

describe('runCaptured', () => {
  it('captures stdout and stderr beyond the 8 KiB pipe boundary and removes the temp file', async () => {
    const before = new Set(leftoverCaptureFiles());
    const child = script("process.stdout.write('o'.repeat(20000)); process.stderr.write('ERR');");
    const result = await runCaptured(process.execPath, [child], { timeoutMs: 10_000, maxOutputBytes: 1024 * 1024 });
    expect(result).toMatchObject({ exitCode: 0, timedOut: false, truncated: false, aborted: false });
    expect(result.output).toContain('o'.repeat(20000));
    expect(result.output).toContain('ERR');
    expect(leftoverCaptureFiles().filter((name) => !before.has(name))).toEqual([]);
  });

  it('resolves non-zero exits with their output', async () => {
    const child = script("console.error('usage: nope'); process.exit(3);");
    const result = await runCaptured(process.execPath, [child], { timeoutMs: 10_000, maxOutputBytes: 1024 });
    expect(result.exitCode).toBe(3);
    expect(result.output).toContain('usage: nope');
  });

  it('caps captured output', async () => {
    const child = script("process.stdout.write('x'.repeat(5000));");
    const result = await runCaptured(process.execPath, [child], { timeoutMs: 10_000, maxOutputBytes: 100 });
    expect(result.output).toHaveLength(100);
    expect(result.truncated).toBe(true);
  });

  it('kills a child that outlives the timeout', async () => {
    const child = script('setInterval(() => {}, 1000);');
    const result = await runCaptured(process.execPath, [child], { timeoutMs: 200, maxOutputBytes: 1024 });
    expect(result.timedOut).toBe(true);
    expect(result.exitCode === 0).toBe(false);
  });

  it('kills the child when the signal aborts', async () => {
    const child = script('setInterval(() => {}, 1000);');
    const controller = new AbortController();
    const pending = runCaptured(process.execPath, [child], { timeoutMs: 10_000, maxOutputBytes: 1024, signal: controller.signal });
    setTimeout(() => controller.abort(), 100);
    await expect(pending).resolves.toMatchObject({ aborted: true, timedOut: false });
  });

  it('rejects when the executable cannot be spawned and still cleans up', async () => {
    const before = new Set(leftoverCaptureFiles());
    await expect(runCaptured(join(tmpdir(), 'zcc-definitely-missing-binary'), [], { timeoutMs: 1000, maxOutputBytes: 1024 }))
      .rejects.toThrow();
    expect(leftoverCaptureFiles().filter((name) => !before.has(name))).toEqual([]);
  });
});
