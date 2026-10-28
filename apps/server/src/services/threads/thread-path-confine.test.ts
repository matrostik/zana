import { describe, expect, it } from 'vitest';
import { confinePathToRoot } from './thread-path-confine.js';

describe('owning host path semantics', () => {
  it('confines a POSIX environment independently of server platform', () => {
    expect(confinePathToRoot('/remote/project', '/remote/project/docs/a.md')).toBe('docs/a.md');
    expect(confinePathToRoot('/remote/project', '../secret.md')).toBeNull();
    expect(confinePathToRoot('/remote/project', 'C:/secret.md')).toBeNull();
  });
  it('confines Windows environments including aliases and other drives', () => {
    expect(confinePathToRoot('D:\\project', 'd:/project/docs/a.md')).toBe('docs/a.md');
    expect(confinePathToRoot('D:\\project', './docs/a.md')).toBe('docs/a.md');
    expect(confinePathToRoot('D:\\project', 'C:/secret.md')).toBeNull();
    expect(confinePathToRoot('D:\\project', '/D:/project/a.md')).toBeNull();
  });
});
