import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { closeSync, openSync, readSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export interface CapturedRunOptions {
  timeoutMs: number;
  /** Bytes of combined stdout+stderr kept; the rest is reported as truncated. */
  maxOutputBytes: number;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  signal?: AbortSignal;
}

export interface CapturedRunResult {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  output: string;
  truncated: boolean;
  timedOut: boolean;
  aborted: boolean;
}

export type CapturedRunner = (
  command: string,
  args: readonly string[],
  options: CapturedRunOptions
) => Promise<CapturedRunResult>;

function readCapped(path: string, maxBytes: number): { text: string; truncated: boolean } {
  const size = statSync(path).size;
  const length = Math.min(size, maxBytes);
  const buffer = Buffer.alloc(length);
  const fd = openSync(path, 'r');
  try {
    let offset = 0;
    while (offset < length) {
      const read = readSync(fd, buffer, offset, length - offset, offset);
      if (read === 0) break;
      offset += read;
    }
    return { text: buffer.subarray(0, offset).toString('utf8'), truncated: size > maxBytes };
  } finally {
    closeSync(fd);
  }
}

/**
 * Run a child with stdout+stderr captured to a 0600 temp file instead of a
 * pipe (Electron main once truncated piped stdout at 8192 bytes). The temp
 * file is removed on every path; non-zero exits resolve rather than reject.
 */
export const runCaptured: CapturedRunner = (command, args, options) => new Promise((resolve, reject) => {
  const outputPath = join(tmpdir(), `zcc-voice-${randomUUID()}.log`);
  let outputFd: number | null = openSync(outputPath, 'wx', 0o600);
  let settled = false;
  let timedOut = false;
  let aborted = false;
  let timer: NodeJS.Timeout | undefined;

  const closeOutput = () => {
    if (outputFd === null) return;
    try { closeSync(outputFd); } catch { /* already closed */ }
    outputFd = null;
  };
  const finish = (result: { error: Error } | { exitCode: number | null; signal: NodeJS.Signals | null }) => {
    if (settled) return;
    settled = true;
    if (timer) clearTimeout(timer);
    options.signal?.removeEventListener('abort', onAbort);
    closeOutput();
    try {
      if ('error' in result) {
        reject(result.error);
        return;
      }
      const { text, truncated } = readCapped(outputPath, options.maxOutputBytes);
      resolve({ ...result, output: text, truncated, timedOut, aborted });
    } catch (error) {
      reject(error);
    } finally {
      rmSync(outputPath, { force: true });
    }
  };

  let child: ReturnType<typeof spawn>;
  try {
    child = spawn(command, [...args], {
      cwd: options.cwd,
      env: options.env,
      shell: false,
      windowsHide: true,
      stdio: ['ignore', outputFd, outputFd]
    });
  } catch (error) {
    closeOutput();
    rmSync(outputPath, { force: true });
    reject(error);
    return;
  }

  function onAbort() {
    aborted = true;
    child.kill('SIGKILL');
  }

  timer = setTimeout(() => {
    timedOut = true;
    child.kill('SIGKILL');
  }, options.timeoutMs);
  if (options.signal?.aborted) onAbort();
  else options.signal?.addEventListener('abort', onAbort, { once: true });

  child.once('error', (error) => finish({ error }));
  child.once('close', (exitCode, signal) => finish({ exitCode, signal }));
});
