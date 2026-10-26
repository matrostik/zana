import { describe, expect, it } from 'vitest';
import type { ThreadTimelineViewRow } from '@zana-ai/zcc-thread-view';
import {
  collectTimelineFilePreviewPaths,
  reuseStringListIfEqual
} from './timeline-file-preview-paths.js';

const workBase = {
  threadId: 't1',
  turnId: 'turn-1',
  sourceSeqStart: 1,
  sourceSeqEnd: 1,
  startedAt: 1,
  createdAt: 1,
  kind: 'work' as const,
  callId: 'c1',
  status: 'completed' as const
};

describe('collectTimelineFilePreviewPaths', () => {
  it('walks file-change, rename destination, file-read, command/tool read intents, and nested rows in order', () => {
    const nestedChange: ThreadTimelineViewRow = {
      ...workBase,
      id: 'fc2',
      workKind: 'file-change',
      change: {
        path: 'nested/foo.md',
        kind: 'add',
        movePath: null,
        diff: null,
        diffStats: { added: 1, removed: 0 }
      },
      stdout: null,
      stderr: null,
      approvalStatus: null
    };
    const rows: ThreadTimelineViewRow[] = [
      {
        ...workBase,
        id: 'fc1',
        workKind: 'file-change',
        change: {
          path: 'src/old.md',
          kind: 'move',
          movePath: 'docs/new.md',
          diff: null,
          diffStats: { added: 0, removed: 0 }
        },
        stdout: null,
        stderr: null,
        approvalStatus: null
      },
      {
        ...workBase,
        id: 'fr1',
        workKind: 'file-read',
        path: 'README.md',
        cmd: null,
        completedAt: 2
      },
      {
        ...workBase,
        id: 'fr-outside',
        workKind: 'file-read',
        path: '/outside/secret.md',
        previewable: false,
        cmd: null,
        completedAt: 2
      },
      {
        ...workBase,
        id: 'cmd1',
        workKind: 'command',
        command: 'cat docs/getting-started.md',
        cwd: '/workspace',
        exitCode: 0,
        stdout: '',
        stderr: null,
        approvalStatus: null,
        completedAt: 2,
        activityIntents: [
          { type: 'read', path: 'docs/getting-started.md', label: 'Read docs/getting-started.md' },
          { type: 'read', path: '/outside/spill.txt', label: 'Read spill', previewable: false }
        ]
      },
      {
        id: 'turn-closed',
        threadId: 't1',
        turnId: 'turn-0',
        sourceSeqStart: 0,
        sourceSeqEnd: 0,
        startedAt: 0,
        createdAt: 0,
        kind: 'turn',
        status: 'completed',
        summaryCount: 1,
        completedAt: 2,
        children: [nestedChange]
      }
    ];
    expect(collectTimelineFilePreviewPaths(rows)).toEqual([
      'src/old.md',
      'docs/new.md',
      'README.md',
      'docs/getting-started.md',
      'nested/foo.md'
    ]);
  });
});

describe('reuseStringListIfEqual', () => {
  it('returns the previous array when contents match', () => {
    const previous = ['a.md', 'b.md'];
    expect(reuseStringListIfEqual(previous, ['a.md', 'b.md'])).toBe(previous);
  });

  it('returns the next array when contents differ', () => {
    const next = ['a.md'];
    expect(reuseStringListIfEqual(['a.md', 'b.md'], next)).toBe(next);
  });
});
