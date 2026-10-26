import { describe, expect, it } from 'vitest';
import {
  conversationFilePreviewPaths,
  extractMarkdownFilePreviewHints,
  parseInlineFileCodePath,
  parseLocalFileMarkdownHref,
  parseLocalFileMarkdownLink,
  resolveThreadFilePreviewPath
} from './markdown-local-file.js';
import { parseThreadMentionHref, splitThreadMentionText } from './markdown-thread-mentions.js';

describe('parseLocalFileMarkdownHref', () => {
  it('accepts file URLs and absolute paths with a file extension', () => {
    expect(parseLocalFileMarkdownHref('file:///workspace/README.md')).toBe('/workspace/README.md');
    expect(parseLocalFileMarkdownHref('file:///D:/Dev/code/zana/docs/getting-started.md')).toBe(
      'D:/Dev/code/zana/docs/getting-started.md'
    );
    expect(parseLocalFileMarkdownHref('D:\\Dev\\code\\zana\\docs\\cli.md')).toBe(
      'D:/Dev/code/zana/docs/cli.md'
    );
    expect(parseLocalFileMarkdownHref('/tmp/app.ts')).toBe('/tmp/app.ts');
    expect(parseLocalFileMarkdownHref('./src/foo.ts')).toBe('./src/foo.ts');
  });

  it('rejects http(s) and parent-segment escapes', () => {
    expect(parseLocalFileMarkdownHref('https://example.com/app.ts')).toBeNull();
    expect(parseLocalFileMarkdownHref('/tmp/../etc/passwd')).toBeNull();
    expect(parseLocalFileMarkdownHref('file:///workspace/../etc/passwd.txt')).toBeNull();
  });
});

describe('parseLocalFileMarkdownLink', () => {
  it('extracts optional #L10 line numbers from local file links', () => {
    expect(parseLocalFileMarkdownLink('file:///D:/Dev/code/zana/src/app.ts#L42-L50')).toEqual({
      path: 'D:/Dev/code/zana/src/app.ts',
      lineNumber: 42
    });
    expect(parseLocalFileMarkdownLink('./src/foo.ts')).toEqual({
      path: './src/foo.ts',
      lineNumber: null
    });
    expect(parseLocalFileMarkdownLink('https://example.com/app.ts#L10')).toBeNull();
  });
});

describe('extractMarkdownFilePreviewHints', () => {
  it('collects explicit slash paths from markdown links and inline code', () => {
    const markdown = [
      'Updated [getting-started.md](file:///D:/Dev/code/zana/docs/getting-started.md#L10)',
      'and `docs/cli.md` alongside `getting-started.md`.'
    ].join(' ');
    expect(extractMarkdownFilePreviewHints(markdown)).toEqual([
      'D:/Dev/code/zana/docs/getting-started.md',
      'docs/cli.md'
    ]);
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

  it('maps a bare name onto the latest matching known path', () => {
    expect(
      resolveThreadFilePreviewPath('foo.md', ['src/a.ts', 'docs/foo.md', 'lib/foo.md'])
    ).toBe('lib/foo.md');
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
