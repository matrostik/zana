import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import {
  conversationFilePreviewPaths,
  parseInlineFileCodePath,
  parseLocalFileMarkdownHref,
  resolveThreadFilePreviewPath
} from './markdown-local-file.js';
import { parseThreadMentionHref, splitThreadMentionText } from './markdown-thread-mentions.js';

describe('parseLocalFileMarkdownHref', () => {
  it.each(['file:///D:/Dev/report.md', 'file:///d:/a%20b/%E2%9C%93%23x.md', 'file://localhost/D:/report.md#L2'])('decodes Windows URL %s', (url) => {
    expect(parseLocalFileMarkdownHref(url)?.replace(/\\/gu, '/')).toBe(fileURLToPath(url, { windows: true }).replace(/\\/gu, '/'));
  });
  it.each(['file:///tmp/a%20b.md', 'file:///tmp/%E2%9C%93%23x.md#heading'])('decodes POSIX URL %s', (url) => {
    expect(parseLocalFileMarkdownHref(url)).toBe(fileURLToPath(url, { windows: false }));
  });
  it.each(['file:///D:/a%2fb.md', 'file:///D:/a%5cb.md', 'file:///tmp/%ZZ.md', 'file://server/share/a.md', 'file:///tmp/../secret.md', 'file:///tmp/%2e%2e/secret.md'])('rejects unsafe URL %s', (url) => {
    expect(parseLocalFileMarkdownHref(url)).toBeNull();
  });
  it('accepts direct drive paths and bare Markdown links', () => {
    expect(parseLocalFileMarkdownHref('D:\\Dev\\report.md')).toBe('D:/Dev/report.md');
    expect(parseLocalFileMarkdownHref('report.md')).toBe('report.md');
  });
  it('accepts file URLs and absolute paths with a file extension', () => {
    expect(parseLocalFileMarkdownHref('file:///workspace/README.md')).toBe('/workspace/README.md');
    expect(parseLocalFileMarkdownHref('/tmp/app.ts')).toBe('/tmp/app.ts');
    expect(parseLocalFileMarkdownHref('./src/foo.ts')).toBe('./src/foo.ts');
  });

  it('rejects http(s) and parent-segment escapes', () => {
    expect(parseLocalFileMarkdownHref('https://example.com/app.ts')).toBeNull();
    expect(parseLocalFileMarkdownHref('/tmp/../etc/passwd')).toBeNull();
  });
});

describe('conversationFilePreviewPaths', () => {
  it('picks a workspace-relative path from the top of an assistant dump', () => {
    const dump = [
      'docs/architecture/high-level-architecture.md',
      '',
      '# Zana',
      '',
      'See also packages/thread-view/src/timeline-row-title.ts for titles.'
    ].join('\n');
    expect(conversationFilePreviewPaths(dump)).toEqual([
      'docs/architecture/high-level-architecture.md'
    ]);
  });

  it('accepts backtick wrapping and a File: prefix, and includes attachments', () => {
    expect(conversationFilePreviewPaths('`src/lib/foo.ts`\nbody')).toEqual(['src/lib/foo.ts']);
    expect(conversationFilePreviewPaths('File: docs/guide.md\n# Guide')).toEqual(['docs/guide.md']);
    expect(conversationFilePreviewPaths('# docs/architecture/high-level-architecture.md\n\nbody')).toEqual([
      'docs/architecture/high-level-architecture.md'
    ]);
    expect(conversationFilePreviewPaths('hello', ['notes/todo.md'])).toEqual(['notes/todo.md']);
  });

  it('ignores headings and later body paths', () => {
    expect(conversationFilePreviewPaths('# README.md\n\nhello')).toEqual([]);
    const body = [
      'Here is the doc.',
      '',
      '# Title',
      '',
      'Related: packages/cli/src/lib/run-cli.ts'
    ].join('\n');
    expect(conversationFilePreviewPaths(body)).toEqual([]);
  });
});

describe('parseInlineFileCodePath', () => {
  it('accepts bare filenames and slash paths with a letter-starting extension', () => {
    expect(parseInlineFileCodePath('student-to-software-engineer.md')).toBe(
      'student-to-software-engineer.md'
    );
    expect(parseInlineFileCodePath('`docs/guide.md`')).toBe('docs/guide.md');
    expect(parseInlineFileCodePath('src/lib/foo.ts')).toBe('src/lib/foo.ts');
    expect(parseInlineFileCodePath('package.json')).toBe('package.json');
  });

  it('rejects commands, version tokens, and parent-segment escapes', () => {
    expect(parseInlineFileCodePath('true')).toBeNull();
    expect(parseInlineFileCodePath('pnpm test')).toBeNull();
    expect(parseInlineFileCodePath('v1.2.3')).toBeNull();
    expect(parseInlineFileCodePath('../etc/passwd')).toBeNull();
    expect(parseInlineFileCodePath('https://example.com/app.ts')).toBeNull();
    expect(parseInlineFileCodePath('student-to-software-engineer.md\n')).toBeNull();
  });
});

describe('resolveThreadFilePreviewPath', () => {
  it('returns slash paths as-is and unmatched bare names as-is', () => {
    expect(resolveThreadFilePreviewPath('docs/guide.md', ['other/guide.md'])).toBe('docs/guide.md');
    expect(resolveThreadFilePreviewPath('notes.md')).toBe('notes.md');
    expect(resolveThreadFilePreviewPath('true')).toBeNull();
  });

  it('does not guess between distinct matching known paths', () => {
    expect(
      resolveThreadFilePreviewPath('foo.md', ['src/a.ts', 'docs/foo.md', 'lib/foo.md'])
    ).toBe('foo.md');
  });
  it('deduplicates equivalent hints', () => {
    expect(resolveThreadFilePreviewPath('foo.md', ['docs/foo.md', './docs/foo.md'])).toBe('docs/foo.md');
  });
});

describe('thread mention split', () => {
  it('turns @thread tokens into zcc-thread links', () => {
    const nodes = splitThreadMentionText('see @thread:abc_1 later');
    expect(nodes).toEqual([
      { type: 'text', value: 'see ' },
      {
        type: 'link',
        url: 'zcc-thread:abc_1',
        children: [{ type: 'text', value: '@thread:abc_1' }]
      },
      { type: 'text', value: ' later' }
    ]);
    expect(parseThreadMentionHref('zcc-thread:abc_1')).toBe('abc_1');
  });
});
