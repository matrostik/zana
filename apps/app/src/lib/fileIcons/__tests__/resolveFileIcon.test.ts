import { describe, expect, it } from 'vitest';
import { resolveFileIcon } from '../resolveFileIcon.js';
import { DEFAULT_ICON, FILE_EXTENSIONS, FILE_NAMES, ICONS } from '../seti.generated.js';

const id = (name: string) => resolveFileIcon(name).id;

describe('resolveFileIcon', () => {
  it('prefers an exact filename over its extension', () => {
    expect(id('tsconfig.json')).toBe(FILE_NAMES['tsconfig.json']);
    expect(id('tsconfig.json')).not.toBe(id('other.json'));
  });

  it('matches by extension', () => {
    expect(id('main.ts')).toBe(FILE_EXTENSIONS.ts);
    expect(id('style.css')).toBe(FILE_EXTENSIONS.css);
  });

  it('tries compound extensions before the plain one', () => {
    expect(id('foo.test.tsx')).toBe(FILE_EXTENSIONS['test.tsx']);
    expect(id('a.spec.ts')).toBe(FILE_EXTENSIONS['spec.ts']);
    expect(id('x.d.ts')).toBe(FILE_EXTENSIONS.ts);
    expect(id('.eslintrc.json')).toBe(FILE_EXTENSIONS['eslintrc.json']);
  });

  it('is case-insensitive', () => {
    expect(id('README.MD')).toBe(id('readme.md'));
    expect(id('Dockerfile')).toBe(id('dockerfile'));
    expect(id('Makefile')).toBe(FILE_NAMES.makefile);
    expect(id('TSCONFIG.JSON')).toBe(FILE_NAMES['tsconfig.json']);
  });

  it('handles dotfiles', () => {
    expect(id('.gitignore')).toBe(FILE_NAMES['.gitignore']);
    expect(id('.env')).toBe(FILE_NAMES['.env']);
    expect(id('.env')).not.toBe(DEFAULT_ICON);
  });

  it('uses only the basename of a path (either separator)', () => {
    expect(id('/repo/src/main.ts')).toBe(id('main.ts'));
    expect(id('C:\\repo\\src\\main.ts')).toBe(id('main.ts'));
    expect(id('/repo/foo.ts/README')).toBe(id('README'));
  });

  it('falls back to the default icon for no or unknown extensions', () => {
    expect(id('LICENSEFILE')).toBe(DEFAULT_ICON);
    expect(id('data.zzzunknown')).toBe(DEFAULT_ICON);
    expect(id('trailingdot.')).toBe(DEFAULT_ICON);
    expect(id('')).toBe(DEFAULT_ICON);
  });

  it('resolves extensions that VS Code maps through a language id', () => {
    expect(id('script.py')).not.toBe(DEFAULT_ICON);
    expect(id('config.yml')).toBe(id('config.yaml'));
  });

  it('returns the font character for the icon and memoizes', () => {
    const ref = resolveFileIcon('main.ts');
    expect(ref.char).toBe(ICONS[ref.id]);
    expect(resolveFileIcon('main.ts')).toBe(ref);
  });
});

describe('seti.generated tables', () => {
  it('only reference defined icons, and define the default', () => {
    expect(ICONS[DEFAULT_ICON]).toBeTruthy();
    for (const table of [FILE_NAMES, FILE_EXTENSIONS]) {
      for (const [key, iconId] of Object.entries(table)) {
        expect(ICONS[iconId], `${key} -> ${iconId}`).toBeTruthy();
      }
    }
  });
});
