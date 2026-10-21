// @vitest-environment happy-dom
import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const updateSpy = vi.hoisted(() => vi.fn());
const mocks = vi.hoisted(() => ({ options: undefined as any, onMount: undefined as any }));
vi.mock('@monaco-editor/react', () => ({
  default: (props: any) => { mocks.options = props.options; mocks.onMount = props.onMount; return <div data-testid="monaco" />; }
}));
vi.mock('../DiffViewer.js', () => ({ DiffViewer: () => null }));
vi.mock('../OpenerButtons.js', () => ({ OpenerButtons: () => null }));
vi.mock('react-markdown', () => ({ default: () => null }));
vi.mock('remark-gfm', () => ({ default: () => null }));
vi.mock('../../store.js', async () => {
  const { create } = await import('zustand');
  const { EXPLORER_MINIMAP_DEFAULTS } = await import('@zana-ai/zcc-domain/product');
  return { useData: create<any>(() => ({ explorerMinimap: EXPLORER_MINIMAP_DEFAULTS, updateExplorerMinimap: updateSpy })) };
});

import { EXPLORER_MINIMAP_DEFAULTS } from '@zana-ai/zcc-domain/product';
import { useData } from '../../store.js';
import { FileViewer } from './FileViewer.js';

let width = 800;
let resizeCb: () => void = () => {};
let frames: Array<() => void> = [];
const flushFrames = () => { const run = frames; frames = []; run.forEach((f) => f()); };
const disconnect = vi.fn();
class FakeResizeObserver {
  constructor(cb: () => void) { resizeCb = cb; }
  observe() {}
  disconnect = disconnect;
}

beforeEach(() => {
  width = 800;
  disconnect.mockClear();
  frames = [];
  useData.setState({ explorerMinimap: EXPLORER_MINIMAP_DEFAULTS } as any);
  updateSpy.mockClear();
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  vi.stubGlobal('requestAnimationFrame', (cb: () => void) => { frames.push(cb); return frames.length; });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => width });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function view() {
  return (
    <FileViewer
      {...({
        project: { id: 'p', name: 'P', path: '/a' },
        explorerFile: 'a.ts',
        fileResult: { ok: true, content: 'x', binary: false, truncated: false },
        editedContent: null,
        previewMode: false,
        diffMode: false,
        showDiff: false,
        showPreview: false,
        monacoTheme: 'dark',
        onContentChange: vi.fn(),
        onEditorMount: vi.fn(),
        onSave: vi.fn(),
        onTogglePreview: vi.fn(),
        onToggleDiff: vi.fn()
      } as any)}
    />
  );
}

it('enables the minimap at the configured size when the pane is wide enough', () => {
  render(view());
  expect(mocks.options.minimap).toMatchObject({ enabled: true, side: 'right', maxColumn: 120 });
});

it('follows the setting live', () => {
  render(view());
  act(() => useData.setState({ explorerMinimap: { ...EXPLORER_MINIMAP_DEFAULTS, width: 'wide' } } as any));
  expect(mocks.options.minimap.maxColumn).toBe(200);
  act(() => useData.setState({ explorerMinimap: { ...EXPLORER_MINIMAP_DEFAULTS, enabled: false } } as any));
  expect(mocks.options.minimap).toEqual({ enabled: false });
});

it('hides when the pane narrows and returns when it widens', () => {
  render(view());
  width = 300;
  act(() => { resizeCb(); flushFrames(); });
  expect(mocks.options.minimap).toEqual({ enabled: false });
  width = 900;
  act(() => { resizeCb(); flushFrames(); });
  expect(mocks.options.minimap.enabled).toBe(true);
});

it('disconnects the observer on unmount', () => {
  const { unmount } = render(view());
  unmount();
  expect(disconnect).toHaveBeenCalled();
});

function mountEditor() {
  const handlers: Record<string, (e?: any) => void> = {};
  const dispose = vi.fn();
  const editor = {
    onContextMenu: (cb: any) => { handlers.context = cb; return { dispose }; },
    onDidScrollChange: (cb: any) => { handlers.scroll = cb; return { dispose }; }
  };
  const monaco = { editor: { MouseTargetType: { SCROLLBAR: 11, CONTENT_TEXT: 6 } } };
  const onEditorMount = vi.fn();
  act(() => mocks.onMount(editor, monaco));
  return { handlers, dispose, onEditorMount };
}
const rightClick = (type: number) => ({ target: { type }, event: { posx: 700, posy: 120, preventDefault: vi.fn(), stopPropagation: vi.fn() } });

it('opens the minimap menu on a scrollbar/minimap right-click and applies a choice', () => {
  render(view());
  const { handlers } = mountEditor();
  const click = rightClick(11);
  act(() => handlers.context(click));
  expect(click.event.preventDefault).toHaveBeenCalled();
  expect(screen.getByRole('menu', { name: 'Minimap' })).toBeTruthy();

  fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Minimap' }));
  expect(updateSpy).toHaveBeenCalledWith({ explorerMinimapEnabled: false });
  expect(screen.queryByRole('menu', { name: 'Minimap' })).toBeNull();
});

it('leaves right-clicks on the code to Monaco', () => {
  render(view());
  const { handlers } = mountEditor();
  const click = rightClick(6);
  act(() => handlers.context(click));
  expect(click.event.preventDefault).not.toHaveBeenCalled();
  expect(screen.queryByRole('menu', { name: 'Minimap' })).toBeNull();
});

it('closes the menu on scroll and disposes the editor subscriptions on unmount', () => {
  const { unmount } = render(view());
  const { handlers, dispose } = mountEditor();
  act(() => handlers.context(rightClick(11)));
  act(() => handlers.scroll());
  expect(screen.queryByRole('menu', { name: 'Minimap' })).toBeNull();
  unmount();
  expect(dispose).toHaveBeenCalledTimes(2);
});

it('tells the user when the preview is too narrow', () => {
  render(view());
  width = 300;
  act(() => { resizeCb(); flushFrames(); });
  const { handlers } = mountEditor();
  act(() => handlers.context(rightClick(11)));
  expect(screen.getByText('Hidden — preview too narrow')).toBeTruthy();
});
