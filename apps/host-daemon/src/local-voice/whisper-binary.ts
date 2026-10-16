import { constants as fsConstants } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { access, realpath, stat } from 'node:fs/promises';
import { delimiter, isAbsolute, join, relative } from 'node:path';
import type { VoiceLocalBinaryStatus } from '@zana-ai/zcc-contracts/host-rpc';
import { runCaptured, type CapturedRunner } from './captured-run.js';

const PROBE_TIMEOUT_MS = 8_000;
const PROBE_OUTPUT_MAX_BYTES = 256 * 1024;
/** Flags the transcription runner depends on; their absence means an incompatible build. */
const REQUIRED_HELP_FLAGS = ['--model', '--language', '--output-txt', '--output-file'] as const;

export interface WhisperBinaryDeps {
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
  run?: CapturedRunner;
  /** Extra locations checked after PATH; defaults per platform. */
  knownLocations?: readonly string[];
  /** Overridden in tests; defaults to the process home/temp dirs. */
  homeDir?: string;
  tmpDir?: string;
}

function binaryName(platform: NodeJS.Platform): string {
  // spawn(shell:false) cannot run .cmd/.bat shims, so only a real .exe counts on Windows.
  return platform === 'win32' ? 'whisper-cli.exe' : 'whisper-cli';
}

function defaultKnownLocations(platform: NodeJS.Platform): string[] {
  if (platform === 'darwin') return ['/opt/homebrew/bin/whisper-cli', '/usr/local/bin/whisper-cli'];
  if (platform === 'linux') return ['/usr/local/bin/whisper-cli'];
  return [];
}

async function executableFile(path: string, platform: NodeJS.Platform): Promise<{ path: string; mtimeMs: number; size: number } | null> {
  try {
    const resolved = await realpath(path);
    const info = await stat(resolved);
    if (!info.isFile()) return null;
    if (platform !== 'win32') await access(resolved, fsConstants.X_OK);
    return { path: resolved, mtimeMs: info.mtimeMs, size: info.size };
  } catch {
    return null;
  }
}

function pathCandidates(env: NodeJS.ProcessEnv, platform: NodeJS.Platform): string[] {
  const rawPath = platform === 'win32' ? (env.Path ?? env.PATH ?? '') : (env.PATH ?? '');
  const name = binaryName(platform);
  return rawPath.split(delimiter).filter((dir) => dir.trim() && isAbsolute(dir)).map((dir) => join(dir, name));
}

export function looksLikeWhisperHelp(output: string): boolean {
  return /usage:/iu.test(output) && REQUIRED_HELP_FLAGS.every((flag) => output.includes(flag));
}

/** A configured binary under a temp or Downloads dir is refused: those are the
 *  easiest places for a compromised renderer/plugin to drop a lookalike
 *  executable. Move it to a permanent location (or put it on PATH). */
export function isRiskyConfiguredPath(resolvedPath: string, roots: { homeDir: string; tmpDir: string }): boolean {
  const lower = (s: string) => (process.platform === 'win32' ? s.toLowerCase() : s);
  const under = (root: string) => {
    const rel = relative(lower(root), lower(resolvedPath));
    return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
  };
  const downloads = join(roots.homeDir, 'Downloads');
  return under(roots.tmpDir) || under(downloads);
}

/**
 * Locates and probes `whisper-cli`. A configured path is authoritative (no
 * silent PATH fallback); otherwise PATH then known install locations. Probe
 * results are cached by real path + mtime + size.
 */
export class WhisperBinaryResolver {
  private readonly platform: NodeJS.Platform;
  private readonly env: NodeJS.ProcessEnv;
  private readonly run: CapturedRunner;
  private readonly knownLocations: readonly string[];
  private readonly probeCache = new Map<string, Promise<boolean>>();
  private readonly homeDir: string;
  private readonly tmpDir: string;

  constructor(deps: WhisperBinaryDeps = {}) {
    this.platform = deps.platform ?? process.platform;
    this.env = deps.env ?? process.env;
    this.run = deps.run ?? runCaptured;
    this.knownLocations = deps.knownLocations ?? defaultKnownLocations(this.platform);
    this.homeDir = deps.homeDir ?? homedir();
    this.tmpDir = deps.tmpDir ?? tmpdir();
  }

  async resolve(configuredPath: string | undefined): Promise<VoiceLocalBinaryStatus> {
    const configured = configuredPath?.trim();
    if (configured) {
      if (!isAbsolute(configured)) {
        return { state: 'invalid', path: configured, source: 'config', message: 'The whisper-cli path must be absolute.' };
      }
      const file = await executableFile(configured, this.platform);
      if (!file) {
        return { state: 'invalid', path: configured, source: 'config', message: 'The configured whisper-cli path is not an executable file.' };
      }
      if (isRiskyConfiguredPath(file.path, { homeDir: this.homeDir, tmpDir: this.tmpDir })) {
        return { state: 'invalid', path: file.path, source: 'config', message: 'The configured whisper-cli lives in a temp or Downloads folder. Move it to a permanent location.' };
      }
      if (!(await this.probe(file))) {
        return { state: 'invalid', path: file.path, source: 'config', message: 'The configured file did not respond like whisper-cli.' };
      }
      return { state: 'ready', path: file.path, source: 'config', message: null };
    }

    let rejected: string | null = null;
    const sources: Array<['path' | 'known', string[]]> = [
      ['path', pathCandidates(this.env, this.platform)],
      ['known', [...this.knownLocations]]
    ];
    const seen = new Set<string>();
    for (const [source, candidates] of sources) {
      for (const candidate of candidates) {
        const file = await executableFile(candidate, this.platform);
        if (!file || seen.has(file.path)) continue;
        seen.add(file.path);
        if (await this.probe(file)) return { state: 'ready', path: file.path, source, message: null };
        rejected ??= file.path;
      }
    }
    if (rejected) {
      return { state: 'invalid', path: rejected, source: null, message: 'Found whisper-cli, but it did not respond to --help as expected.' };
    }
    return { state: 'missing', path: null, source: null, message: 'whisper-cli was not found. Install whisper.cpp or set its path.' };
  }

  private probe(file: { path: string; mtimeMs: number; size: number }): Promise<boolean> {
    const key = `${file.path}\0${file.mtimeMs}\0${file.size}`;
    let cached = this.probeCache.get(key);
    if (!cached) {
      cached = this.run(file.path, ['--help'], { timeoutMs: PROBE_TIMEOUT_MS, maxOutputBytes: PROBE_OUTPUT_MAX_BYTES })
        .then((result) => !result.timedOut && looksLikeWhisperHelp(result.output))
        .catch(() => false);
      // Bounded: one entry per distinct binary version seen by this daemon.
      if (this.probeCache.size >= 16) this.probeCache.clear();
      this.probeCache.set(key, cached);
    }
    return cached;
  }
}
