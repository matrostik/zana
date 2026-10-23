import { statSync } from 'node:fs';
import { posix, win32 } from 'node:path';

export class ShellNotFoundError extends Error {
  readonly code = 'SHELL_NOT_FOUND';
  constructor(readonly shell: string) {
    super(`Shell "${shell}" was not found on this machine. Set Settings → Terminal → Shell (leave empty for auto-detect).`);
    this.name = 'ShellNotFoundError';
  }
}

export interface ResolveExecutableOptions {
  platform?: NodeJS.Platform;
  pathEnv?: string;
  pathExt?: string;
  isFile?: (path: string) => boolean;
}

export type ResolveExecutableResult =
  | { ok: true; path: string }
  | { ok: false; reason: 'not-found' | 'foreign-path' };

const defaultIsFile = (candidatePath: string): boolean => {
  try {
    return statSync(candidatePath).isFile();
  } catch {
    return false;
  }
};

/**
 * Detect whether a path string belongs to an alien OS.
 * On win32: POSIX root paths (e.g. `/bin/zsh`, `/bin/bash`, `/usr/bin/sh`).
 * On POSIX (darwin/linux): Windows drive-letter paths (`C:\...`) or `.exe`/`.cmd`/`.bat`/`.com` binaries.
 */
export function isForeignPlatformPath(
  value: string | null | undefined,
  platform: NodeJS.Platform = process.platform
): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;

  if (platform === 'win32') {
    return trimmed.startsWith('/');
  }

  // POSIX platforms
  return /^[A-Za-z]:[\\/]/.test(trimmed) || /\.(exe|cmd|bat|com)$/i.test(trimmed);
}

/**
 * Resolve an executable command to an absolute, launchable file path.
 * On Windows, this consults PATHEXT and PATH to ensure node-pty receives
 * an absolute path with extension (avoiding Win32 "File not found: " errors).
 * On POSIX, absolute paths and existing files are checked; bare commands are resolved against PATH.
 */
export function resolveSpawnExecutable(
  command: string,
  options: ResolveExecutableOptions = {}
): ResolveExecutableResult {
  if (!command || !command.trim()) {
    return { ok: false, reason: 'not-found' };
  }
  const cmd = command.trim();
  const platform = options.platform ?? process.platform;
  const isFile = options.isFile ?? defaultIsFile;

  const pathModule = platform === 'win32' ? win32 : posix;

  if (isForeignPlatformPath(cmd, platform)) {
    return { ok: false, reason: 'foreign-path' };
  }

  if (platform !== 'win32') {
    if (pathModule.isAbsolute(cmd) || cmd.includes('/')) {
      if (isFile(cmd)) return { ok: true, path: cmd };
      return { ok: false, reason: 'not-found' };
    }
    const pathEnv = options.pathEnv ?? process.env.PATH ?? '';
    for (const dir of pathEnv.split(':')) {
      if (!dir) continue;
      const candidate = pathModule.join(dir, cmd);
      if (isFile(candidate)) return { ok: true, path: candidate };
    }
    return { ok: false, reason: 'not-found' };
  }

  // Windows: resolve candidate names considering extensions
  const pathExt = options.pathExt ?? (process.env.PATHEXT || '.COM;.EXE;.BAT;.CMD');
  const hasExt = /\.(exe|cmd|bat|com)$/i.test(cmd);
  const names = hasExt
    ? [cmd]
    : [
        cmd,
        ...pathExt
          .split(';')
          .filter(Boolean)
          .map((ext) => cmd + (ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`))
      ];

  if (pathModule.isAbsolute(cmd) || cmd.includes('/') || cmd.includes('\\')) {
    for (const name of names) {
      if (isFile(name)) return { ok: true, path: name };
    }
    return { ok: false, reason: 'not-found' };
  }

  const pathEnv = options.pathEnv ?? process.env.PATH ?? '';
  for (const rawDir of pathEnv.split(';')) {
    if (!rawDir) continue;
    const dir = rawDir.replace(/^"|"$/g, '').trim();
    if (!dir) continue;
    for (const name of names) {
      const candidate = pathModule.join(dir, name);
      if (isFile(candidate)) return { ok: true, path: candidate };
    }
  }

  return { ok: false, reason: 'not-found' };
}

export interface ResolveShellOptions extends ResolveExecutableOptions {
  env?: NodeJS.ProcessEnv;
}

/**
 * Determine the default platform shell when none is specified.
 * On Windows: pwsh.exe on PATH -> Windows PowerShell (%SystemRoot%\...\powershell.exe) -> %ComSpec% / cmd.exe.
 * On POSIX: process.env.SHELL || '/bin/zsh'.
 */
export function resolveDefaultShell(options: ResolveShellOptions = {}): string {
  const platform = options.platform ?? process.platform;
  const env = options.env ?? process.env;
  const isFile = options.isFile ?? defaultIsFile;

  if (platform !== 'win32') {
    return env.SHELL || '/bin/zsh';
  }

  // 1. Try pwsh.exe (PowerShell 7) on PATH
  const pwsh = resolveSpawnExecutable('pwsh.exe', options);
  if (pwsh.ok) return pwsh.path;
  const pwshBare = resolveSpawnExecutable('pwsh', options);
  if (pwshBare.ok) return pwshBare.path;

  // 2. Windows PowerShell
  const systemRoot = env.SystemRoot || env.windir || 'C:\\Windows';
  const winPowerShell = win32.join(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
  if (isFile(winPowerShell)) return winPowerShell;

  const psBare = resolveSpawnExecutable('powershell.exe', options);
  if (psBare.ok) return psBare.path;

  // 3. ComSpec (cmd.exe)
  if (env.ComSpec && isFile(env.ComSpec)) return env.ComSpec;
  const cmdCandidate = win32.join(systemRoot, 'System32', 'cmd.exe');
  if (isFile(cmdCandidate)) return cmdCandidate;

  const cmdBare = resolveSpawnExecutable('cmd.exe', options);
  if (cmdBare.ok) return cmdBare.path;

  return env.ComSpec || 'powershell.exe';
}

export type ConfiguredShellResolution =
  | { ok: true; path: string; source: 'configured' | 'auto' | 'auto-fallback' }
  | { ok: false; message: string };

/**
 * Resolve the user's configured shell from AppConfig.
 * Handles stale foreign-platform paths (e.g. '/bin/zsh' saved on Windows)
 * by falling back to auto-detect with a diagnostic warning.
 */
export function resolveConfiguredShell(
  configShell: string | null | undefined,
  options: ResolveShellOptions = {}
): ConfiguredShellResolution {
  const platform = options.platform ?? process.platform;
  const trimmed = configShell?.trim();

  if (!trimmed) {
    const detected = resolveDefaultShell(options);
    return { ok: true, path: detected, source: 'auto' };
  }

  if (isForeignPlatformPath(trimmed, platform)) {
    const detected = resolveDefaultShell(options);
    console.warn(
      `[platform-shell] Configured shell "${trimmed}" is for another platform; falling back to auto-detected "${detected}".`
    );
    return { ok: true, path: detected, source: 'auto-fallback' };
  }

  const resolved = resolveSpawnExecutable(trimmed, options);
  if (resolved.ok) {
    return { ok: true, path: resolved.path, source: 'configured' };
  }

  const err = new ShellNotFoundError(trimmed);
  return { ok: false, message: err.message };
}

export interface ShellArgsOptions {
  /**
   * Args for interactive POSIX shells. Defaults to `['-l']`.
   * Pass `[]` when preserving bare interactive spawn (e.g. ShellProvider on macOS).
   */
  interactivePosixArgs?: string[];
}

/**
 * Generate spawn arguments appropriate for the shell family and invocation mode.
 * - PowerShell / pwsh: interactive `['-NoLogo']`, command `['-NoLogo', '-Command', cmd]`
 * - cmd.exe: interactive `[]`, command `['/d', '/s', '/c', cmd]`
 * - POSIX shells: interactive `interactivePosixArgs ?? ['-l']`, command `['-lc', cmd]`
 */
export function shellArgs(
  shellPath: string,
  command?: string,
  options: ShellArgsOptions = {}
): string[] {
  const isPowerShell = /(?:^|[\\/])(pwsh|powershell)(?:\.exe)?$/i.test(shellPath);
  if (isPowerShell) {
    return command ? ['-NoLogo', '-Command', command] : ['-NoLogo'];
  }

  const isCmd = /(?:^|[\\/])cmd(?:\.exe)?$/i.test(shellPath);
  if (isCmd) {
    return command ? ['/d', '/s', '/c', command] : [];
  }

  // POSIX-style shell (bash, zsh, sh, fish, etc.)
  if (command) {
    return ['-lc', command];
  }
  return options.interactivePosixArgs ?? ['-l'];
}
