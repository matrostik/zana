// @vitest-environment jsdom
import { createRef } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ComposerTypeaheadMenu } from './ComposerTypeaheadMenu.js';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
});

const suggestions = Array.from({ length: 24 }, (_, index) => ({
  kind: 'command' as const, name: `/command-${index}`, description: 'Available command'
}));

it('escapes clipping ancestors and preserves editor focus on pointer selection', () => {
  const anchorRef = createRef<HTMLDivElement>();
  const apply = vi.fn();
  const backdrop = vi.fn();
  const { container } = render(<div onMouseDown={backdrop} style={{ overflow: 'hidden' }}>
    <div ref={anchorRef}><input aria-label="Prompt" /></div>
    <ComposerTypeaheadMenu anchorRef={anchorRef} suggestions={suggestions} selectedIndex={0} triggerKind="command" onApply={apply} />
  </div>);
  const menu = screen.getByRole('listbox');
  expect(menu.parentElement).toBe(document.body);
  expect(container.contains(menu)).toBe(false);
  const input = screen.getByRole('textbox');
  input.focus();
  fireEvent.mouseDown(screen.getAllByRole('option')[23]);
  expect(apply).toHaveBeenCalledWith(suggestions[23]);
  expect(document.activeElement).toBe(input);
  expect(backdrop).not.toHaveBeenCalled();
});

it('scrolls only the menu to reveal keyboard selection below and above the visible rows', () => {
  const props = { suggestions, selectedIndex: 0, triggerKind: 'command' as const, onApply: vi.fn() };
  const { rerender } = render(<ComposerTypeaheadMenu {...props} />);
  const menu = screen.getByRole('listbox');
  vi.spyOn(menu, 'getBoundingClientRect').mockReturnValue({ top: 100, bottom: 300 } as DOMRect);
  const options = screen.getAllByRole('option');
  vi.spyOn(options[23], 'getBoundingClientRect').mockReturnValue({ top: 400, bottom: 430 } as DOMRect);
  rerender(<ComposerTypeaheadMenu {...props} selectedIndex={23} />);
  expect(menu.scrollTop).toBe(130);
  vi.spyOn(options[0], 'getBoundingClientRect').mockReturnValue({ top: 0, bottom: 30 } as DOMRect);
  rerender(<ComposerTypeaheadMenu {...props} selectedIndex={0} />);
  expect(menu.scrollTop).toBe(30);
});

it('tracks anchor resizing and ancestor scrolling and releases every subscription on close', () => {
  let resized = () => {};
  const disconnect = vi.fn();
  vi.stubGlobal('ResizeObserver', class {
    constructor(callback: () => void) { resized = callback; }
    observe() {}
    disconnect = disconnect;
  });
  const anchor = document.createElement('div');
  const parent = document.createElement('div');
  parent.className = 'launch-modal';
  parent.append(anchor);
  document.body.append(parent);
  const anchorRef = { current: anchor };
  let top = 350;
  const measure = vi.spyOn(anchor, 'getBoundingClientRect').mockImplementation(() => ({ left: 10, top, bottom: top + 60, width: 500 }) as DOMRect);
  vi.stubGlobal('innerHeight', 600);
  const remove = vi.spyOn(window, 'removeEventListener');
  const { unmount } = render(<ComposerTypeaheadMenu anchorRef={anchorRef} suggestions={suggestions} selectedIndex={-1} triggerKind="command" onApply={vi.fn()} />);
  const menu = screen.getByRole('listbox');
  expect(menu.style.bottom).toBe('258px');
  const measurements = measure.mock.calls.length;
  fireEvent.scroll(menu);
  expect(measure).toHaveBeenCalledTimes(measurements);
  top = 20;
  fireEvent.resize(window);
  expect(menu.style.top).toBe('88px');
  expect(menu.style.bottom).toBe('');
  top = 30;
  fireEvent.scroll(parent);
  expect(menu.style.top).toBe('98px');
  top = 40;
  act(() => resized());
  expect(menu.style.top).toBe('108px');
  unmount();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(remove).toHaveBeenCalledWith('resize', expect.any(Function));
  expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function), true);
  parent.remove();
});

it('renders mention kinds and safely handles an empty selection', () => {
  render(<ComposerTypeaheadMenu suggestions={[
    { kind: 'path', path: 'src', name: 'src', entryKind: 'directory' },
    { kind: 'project', projectId: 'p1', name: 'Project' },
    { kind: 'plugin', pluginId: 'test-plugin', providerId: 'test', id: '1', label: 'Plugin item' },
    { kind: 'thread', threadId: 't1', projectId: 'p1', title: 'Thread' }
  ]} selectedIndex={-1} triggerKind="mention" onApply={vi.fn()} />);
  expect(screen.getByRole('listbox', { name: 'Mentions' })).toBeTruthy();
  expect(screen.getAllByRole('option')).toHaveLength(4);
});
