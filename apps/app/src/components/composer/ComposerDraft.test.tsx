// @vitest-environment happy-dom
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { EditorContent, type JSONContent } from '@tiptap/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ComposerDraftProvider, useComposerSession, useComposerSetting } from './ComposerDraft.js';
import { composerSession, resetComposerSessions } from './composer-session.js';
import { useComposerPromptField } from './use-composer-prompt-field.js';
import { mentionAttrsForSuggestion } from './mention-attrs.js';

vi.mock('../../lib/fetch-with-app-surface.js', () => ({ apiJson: async () => ({}) }));
vi.mock('../../lib/app-surface.js', () => ({ hasDesktopBridge: () => false }));
vi.mock('../../lib/product-client.js', () => ({
  product: {
    pluginApps: { onChanged: () => () => {} },
    skills: { onChanged: () => () => {} },
    threads: { commands: async () => ({ commands: [] }) },
    commands: { list: async () => [] }
  }
}));
vi.mock('./use-composer-suggestions.js', () => ({
  useMentionProviderRows: () => [],
  useComposerSuggestions: () => ({ suggestions: [], menuOpen: false })
}));

let field: ReturnType<typeof useComposerPromptField>;
function Probe({ initialText }: { initialText?: string }) {
  field = useComposerPromptField({
    placeholder: 'Prompt', testId: 'prompt', projectId: 'project', projects: [],
    initialText, slashCatalog: { kind: 'cli' }, onSubmit: () => {}
  });
  return <EditorContent editor={field.editor} />;
}
function Surface({ mode, initialText, sessionKey }: { mode: string; initialText?: string; sessionKey?: string }) {
  return <ComposerDraftProvider sessionKey={sessionKey}><Probe key={mode} initialText={initialText} /></ComposerDraftProvider>;
}
const ready = () => waitFor(() => expect(field.editor).not.toBeNull());
beforeEach(() => { localStorage.clear(); resetComposerSessions(); });
afterEach(cleanup);

describe('shared composer draft', () => {
  it('restores a scoped draft and attachments after leaving and returning', async () => {
    const first = render(<Surface mode="modern" sessionKey="thread:a" />);
    await ready();
    act(() => {
      field.replacePrompt([{ type: 'text', text: 'Keep this' }, { type: 'localImage', path: '/project/image.png' }]);
      field.editor!.commands.setTextSelection(4);
    });
    const saved = field.editor!.getJSON();
    first.unmount();
    const other = render(<Surface mode="modern" sessionKey="thread:b" />);
    await ready();
    expect(field.text).toBe('');
    other.unmount();
    render(<Surface mode="modern" sessionKey="thread:a" initialText="Do not replace draft" />);
    await ready();
    expect(field.editor!.getJSON()).toEqual(saved);
    expect(field.restoredAttachments).toEqual([{ type: 'localImage', path: '/project/image.png' }]);
    expect(field.editor!.state.selection.from).toBe(4);
  });

  it('retains pasted image previews across navigation and releases them on clear', async () => {
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:kept-image');
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const view = render(<Surface mode="modern" sessionKey="images" />);
    await ready();
    const file = new File(['png'], 'image.png', { type: 'image/png' });
    act(() => field.imageInputProps.onChange({ currentTarget: { files: [file], value: 'image.png' } } as any));
    expect(field.images).toHaveLength(1);
    view.unmount();
    expect(revoke).not.toHaveBeenCalled();
    render(<Surface mode="modern" sessionKey="images" />);
    await ready();
    expect(field.images[0]?.file).toBe(file);
    act(() => field.clear());
    expect(revoke).toHaveBeenCalledWith('blob:kept-image');
    create.mockRestore(); revoke.mockRestore();
  });

  it('synchronizes a session updated by another mounted pane without changing its revision', async () => {
    render(<Surface mode="modern" sessionKey="shared" />);
    await ready();
    const session = composerSession('shared');
    const revision = session.getSnapshot().revision;
    act(() => session.setContent({ document: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Other pane' }] }] } }));
    expect(field.text).toBe('Other pane');
    expect(session.getSnapshot().revision).toBe(revision + 1);
  });

  it('a late successful send clears the saved session but not newer content', async () => {
    const view = render(<Surface mode="modern" sessionKey="thread:a" initialText="Submitted" />);
    await ready();
    const submitted = field.captureRevision();
    const clearSubmitted = field.clearIfRevision;
    view.unmount();
    render(<Surface mode="modern" sessionKey="thread:a" />);
    await ready();
    act(() => field.setText('New draft'));
    act(() => { expect(clearSubmitted(submitted)).toBe(false); });
    expect(field.text).toBe('New draft');
    const current = field.captureRevision();
    act(() => { expect(clearSubmitted(current)).toBe(true); });
    expect(field.text).toBe('');
  });

  it('restores scoped settings and functional updates without changing content revisions', () => {
    let settings!: [number, (next: number | ((previous: number) => number)) => void, boolean];
    function Settings() {
      settings = useComposerSetting(useComposerSession(), 'mode.count', () => 2);
      return <div>{settings[0]}</div>;
    }
    const session = composerSession('settings');
    const view = render(<ComposerDraftProvider sessionKey="settings"><Settings /></ComposerDraftProvider>);
    expect(settings[0]).toBe(2);
    act(() => settings[1](previous => previous + 1));
    expect(settings[2]).toBe(true);
    expect(session.getSnapshot().revision).toBe(0);
    view.unmount();
    render(<ComposerDraftProvider sessionKey="settings"><Settings /></ComposerDraftProvider>);
    expect(settings[0]).toBe(3);
  });
  it('preserves rich text and mention identities through repeated mode changes', async () => {
    const { rerender } = render(<Surface mode="cli" />);
    await ready();
    const content: JSONContent = {
      type: 'doc', content: [{ type: 'paragraph', content: [
        { type: 'text', text: 'Review this ', marks: [{ type: 'bold' }] },
        { type: 'mention', attrs: mentionAttrsForSuggestion({ kind: 'project', projectId: 'project', name: 'Example' }) }
      ] }, { type: 'paragraph', content: [{ type: 'text', text: 'Second line' }] }]
    };
    act(() => { field.editor!.commands.setContent(content); });
    const saved = field.editor!.getJSON();
    const serialized = field.serialize();
    expect(serialized.mentions).toHaveLength(1);
    for (const mode of ['modern', 'squad', 'cli']) {
      const previous = field.editor;
      rerender(<Surface mode={mode} />);
      await ready();
      expect(field.editor).not.toBe(previous);
      expect(field.editor!.getJSON()).toEqual(saved);
      expect(field.serialize()).toEqual(serialized);
    }
    act(() => { field.setText('Edited in CLI'); });
    rerender(<Surface mode="squad" />);
    await ready();
    expect(field.text).toBe('Edited in CLI');
  });

  it('seeds once and keeps the edited draft instead of restoring the original seed', async () => {
    const { rerender } = render(<Surface mode="cli" initialText="Original seed" />);
    await ready();
    expect(field.text).toBe('Original seed');
    act(() => { field.setText('Edited seed'); });
    rerender(<Surface mode="modern" initialText="Original seed" />);
    await ready();
    expect(field.text).toBe('Edited seed');
  });

  it.each(['clear', 'delete'] as const)('keeps an empty draft after %s instead of resurrecting a seed', async (action) => {
    const { rerender } = render(<Surface mode="modern" initialText="Original seed" />);
    await ready();
    act(() => { action === 'clear' ? field.clear() : field.setText(''); });
    rerender(<Surface mode="squad" initialText="Original seed" />);
    await ready();
    expect(field.text).toBe('');
  });

  it('does not leak drafts into a different launcher or an existing thread composer', async () => {
    const { unmount } = render(<Surface mode="cli" initialText="Private draft" />);
    await ready();
    expect(field.text).toBe('Private draft');
    unmount();
    const other = render(<Surface mode="modern" />);
    await ready();
    expect(field.text).toBe('');
    other.unmount();
    render(<Probe initialText="Thread follow-up" />);
    await ready();
    expect(field.text).toBe('Thread follow-up');
  });
});
