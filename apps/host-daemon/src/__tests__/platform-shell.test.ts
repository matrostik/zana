import { describe, expect, it, vi } from 'vitest';
import {
  isForeignPlatformPath,
  resolveSpawnExecutable,
  resolveDefaultShell,
  resolveConfiguredShell,
  shellArgs,
  ShellNotFoundError
} from '../platform-shell.js';

describe('platform-shell', () => {
  describe('isForeignPlatformPath', () => {
    it('detects POSIX root paths as foreign on win32', () => {
      expect(isForeignPlatformPath('/bin/zsh', 'win32')).toBe(true);
      expect(isForeignPlatformPath('/bin/bash', 'win32')).toBe(true);
      expect(isForeignPlatformPath('/usr/local/bin/fish', 'win32')).toBe(true);
      expect(isForeignPlatformPath('powershell.exe', 'win32')).toBe(false);
      expect(isForeignPlatformPath('C:\\Windows\\System32\\cmd.exe', 'win32')).toBe(false);
      expect(isForeignPlatformPath('pwsh', 'win32')).toBe(false);
    });

    it('detects Windows paths and extensions as foreign on POSIX', () => {
      expect(isForeignPlatformPath('C:\\Windows\\System32\\cmd.exe', 'darwin')).toBe(true);
      expect(isForeignPlatformPath('C:/tools/pwsh.exe', 'linux')).toBe(true);
      expect(isForeignPlatformPath('powershell.exe', 'darwin')).toBe(true);
      expect(isForeignPlatformPath('script.bat', 'linux')).toBe(true);
      expect(isForeignPlatformPath('tool.cmd', 'darwin')).toBe(true);
      expect(isForeignPlatformPath('/bin/zsh', 'darwin')).toBe(false);
      expect(isForeignPlatformPath('/bin/bash', 'linux')).toBe(false);
      expect(isForeignPlatformPath('fish', 'darwin')).toBe(false);
    });

    it('returns false for empty or whitespace-only inputs', () => {
      expect(isForeignPlatformPath(null, 'win32')).toBe(false);
      expect(isForeignPlatformPath(undefined, 'win32')).toBe(false);
      expect(isForeignPlatformPath('', 'win32')).toBe(false);
      expect(isForeignPlatformPath('   ', 'win32')).toBe(false);
    });
  });

  describe('resolveSpawnExecutable', () => {
    it('rejects empty commands', () => {
      expect(resolveSpawnExecutable('')).toEqual({ ok: false, reason: 'not-found' });
      expect(resolveSpawnExecutable('  ')).toEqual({ ok: false, reason: 'not-found' });
    });

    it('rejects foreign platform paths', () => {
      expect(resolveSpawnExecutable('/bin/zsh', { platform: 'win32' })).toEqual({
        ok: false,
        reason: 'foreign-path'
      });
      expect(resolveSpawnExecutable('C:\\Windows\\cmd.exe', { platform: 'darwin' })).toEqual({
        ok: false,
        reason: 'foreign-path'
      });
    });

    describe('on win32', () => {
      const mockFiles = new Set([
        'C:\\tools\\pwsh.exe',
        'C:\\Windows\\System32\\OpenSSH\\ssh.exe',
        'C:\\Windows\\System32\\cmd.exe',
        'D:\\apps with spaces\\custom.cmd'
      ]);
      const isFile = (p: string) => mockFiles.has(p);

      it('resolves absolute path directly when it exists', () => {
        const result = resolveSpawnExecutable('C:\\tools\\pwsh.exe', {
          platform: 'win32',
          isFile
        });
        expect(result).toEqual({ ok: true, path: 'C:\\tools\\pwsh.exe' });
      });

      it('appends PATHEXT to absolute path without extension', () => {
        const result = resolveSpawnExecutable('C:\\tools\\pwsh', {
          platform: 'win32',
          pathExt: '.COM;.EXE;.BAT;.CMD',
          isFile
        });
        expect(result).toEqual({ ok: true, path: 'C:\\tools\\pwsh.exe' });
      });

      it('searches PATH and resolves bare executable name with PATHEXT', () => {
        const result = resolveSpawnExecutable('ssh', {
          platform: 'win32',
          pathEnv: 'C:\\Windows;C:\\Windows\\System32\\OpenSSH',
          pathExt: '.EXE;.CMD',
          isFile
        });
        expect(result).toEqual({ ok: true, path: 'C:\\Windows\\System32\\OpenSSH\\ssh.exe' });
      });

      it('handles quoted directory paths in PATH', () => {
        const result = resolveSpawnExecutable('custom', {
          platform: 'win32',
          pathEnv: 'C:\\Windows;"D:\\apps with spaces";C:\\tools',
          pathExt: '.EXE;.CMD',
          isFile
        });
        expect(result).toEqual({ ok: true, path: 'D:\\apps with spaces\\custom.cmd' });
      });

      it('resolves relative path containing slashes', () => {
        const result = resolveSpawnExecutable('tools\\pwsh', {
          platform: 'win32',
          pathExt: '.EXE',
          isFile: (p) => p === 'tools\\pwsh.exe'
        });
        expect(result).toEqual({ ok: true, path: 'tools\\pwsh.exe' });
      });

      it('returns not-found if command does not exist anywhere', () => {
        const result = resolveSpawnExecutable('nonexistent', {
          platform: 'win32',
          pathEnv: 'C:\\Windows;C:\\tools',
          pathExt: '.EXE;.CMD',
          isFile
        });
        expect(result).toEqual({ ok: false, reason: 'not-found' });
      });
    });

    describe('on POSIX', () => {
      const mockFiles = new Set(['/bin/zsh', '/usr/bin/bash', '/usr/local/bin/fish']);
      const isFile = (p: string) => mockFiles.has(p);

      it('resolves existing absolute or slash-containing path', () => {
        expect(
          resolveSpawnExecutable('/bin/zsh', { platform: 'darwin', isFile })
        ).toEqual({ ok: true, path: '/bin/zsh' });
      });

      it('returns not-found for missing absolute path', () => {
        expect(
          resolveSpawnExecutable('/opt/missing/shell', { platform: 'darwin', isFile })
        ).toEqual({ ok: false, reason: 'not-found' });
      });

      it('resolves bare name against PATH', () => {
        expect(
          resolveSpawnExecutable('fish', {
            platform: 'linux',
            pathEnv: '/bin:/usr/bin:/usr/local/bin',
            isFile
          })
        ).toEqual({ ok: true, path: '/usr/local/bin/fish' });
      });

      it('returns not-found when bare command is absent from PATH', () => {
        expect(
          resolveSpawnExecutable('unknown_cmd', {
            platform: 'linux',
            pathEnv: '/bin:/usr/bin',
            isFile
          })
        ).toEqual({ ok: false, reason: 'not-found' });
      });
    });
  });

  describe('resolveDefaultShell', () => {
    it('returns env.SHELL or /bin/zsh on POSIX', () => {
      expect(
        resolveDefaultShell({ platform: 'darwin', env: { SHELL: '/bin/bash' } })
      ).toBe('/bin/bash');
      expect(
        resolveDefaultShell({ platform: 'darwin', env: {} })
      ).toBe('/bin/zsh');
    });

    describe('on win32', () => {
      it('picks pwsh.exe when present on PATH', () => {
        const isFile = (p: string) => p === 'C:\\Program Files\\PowerShell\\7\\pwsh.exe';
        const shell = resolveDefaultShell({
          platform: 'win32',
          pathEnv: 'C:\\Program Files\\PowerShell\\7',
          pathExt: '.EXE',
          isFile
        });
        expect(shell).toBe('C:\\Program Files\\PowerShell\\7\\pwsh.exe');
      });

      it('falls back to Windows PowerShell when pwsh is absent', () => {
        const winPs = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
        const isFile = (p: string) => p === winPs;
        const shell = resolveDefaultShell({
          platform: 'win32',
          env: { SystemRoot: 'C:\\Windows' },
          pathEnv: 'C:\\Windows\\System32',
          pathExt: '.EXE',
          isFile
        });
        expect(shell).toBe(winPs);
      });

      it('falls back to ComSpec / cmd.exe when PowerShell is absent', () => {
        const cmd = 'C:\\Windows\\System32\\cmd.exe';
        const isFile = (p: string) => p === cmd;
        const shell = resolveDefaultShell({
          platform: 'win32',
          env: { SystemRoot: 'C:\\Windows', ComSpec: cmd },
          pathEnv: 'C:\\bin',
          pathExt: '.EXE',
          isFile
        });
        expect(shell).toBe(cmd);
      });

      it('falls back to bare powershell.exe when no file probes succeed', () => {
        const shell = resolveDefaultShell({
          platform: 'win32',
          env: {},
          pathEnv: '',
          isFile: () => false
        });
        expect(shell).toBe('powershell.exe');
      });
    });
  });

  describe('resolveConfiguredShell', () => {
    it('falls back to auto when shell is empty', () => {
      const res = resolveConfiguredShell('', {
        platform: 'darwin',
        env: { SHELL: '/bin/zsh' }
      });
      expect(res).toEqual({ ok: true, path: '/bin/zsh', source: 'auto' });
    });

    it('falls back to auto with a warning when foreign path is given (Q2 / Q6)', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const winPs = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
      const isFile = (p: string) => p === winPs;

      const res = resolveConfiguredShell('/bin/zsh', {
        platform: 'win32',
        env: { SystemRoot: 'C:\\Windows' },
        isFile
      });

      expect(res).toEqual({ ok: true, path: winPs, source: 'auto-fallback' });
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Configured shell "/bin/zsh" is for another platform')
      );
      warnSpy.mockRestore();
    });

    it('returns error message with ShellNotFoundError text when non-foreign shell cannot be found (Q5 / Q6)', () => {
      const res = resolveConfiguredShell('fish', {
        platform: 'win32',
        pathEnv: 'C:\\Windows',
        isFile: () => false
      });

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.message).toBe(
          'Shell "fish" was not found on this machine. Set Settings → Terminal → Shell (leave empty for auto-detect).'
        );
      }
    });

    it('resolves valid configured shell', () => {
      const res = resolveConfiguredShell('/bin/bash', {
        platform: 'darwin',
        isFile: (p) => p === '/bin/bash'
      });
      expect(res).toEqual({ ok: true, path: '/bin/bash', source: 'configured' });
    });
  });

  describe('shellArgs', () => {
    it('provides PowerShell arguments', () => {
      expect(shellArgs('C:\\tools\\pwsh.exe')).toEqual(['-NoLogo']);
      expect(shellArgs('powershell.exe', 'Get-Process')).toEqual(['-NoLogo', '-Command', 'Get-Process']);
    });

    it('provides cmd arguments', () => {
      expect(shellArgs('C:\\Windows\\System32\\cmd.exe')).toEqual([]);
      expect(shellArgs('cmd.exe', 'dir /w')).toEqual(['/d', '/s', '/c', 'dir /w']);
    });

    it('provides POSIX arguments', () => {
      expect(shellArgs('/bin/zsh')).toEqual(['-l']);
      expect(shellArgs('/bin/bash', undefined, { interactivePosixArgs: [] })).toEqual([]);
      expect(shellArgs('/bin/bash', 'ls -la')).toEqual(['-lc', 'ls -la']);
    });
  });
});
