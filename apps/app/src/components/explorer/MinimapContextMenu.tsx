import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import {
  EXPLORER_MINIMAP_LABELS,
  EXPLORER_MINIMAP_SIDE_CHOICES,
  EXPLORER_MINIMAP_SLIDER_CHOICES,
  EXPLORER_MINIMAP_VERTICAL_SIZE_CHOICES,
  EXPLORER_MINIMAP_WIDTH_CHOICES,
  type ExplorerMinimapPrefs
} from '@zana-ai/zcc-domain/product';
import type { ExplorerMinimapPatch } from '../../store.js';

interface Submenu {
  id: string;
  label: string;
  key: 'explorerMinimap' | 'explorerMinimapVerticalSize' | 'explorerMinimapSlider' | 'explorerMinimapSide';
  choices: readonly (keyof typeof EXPLORER_MINIMAP_LABELS)[];
  current: string;
}

const MENU_WIDTH = 200;
const SUBMENU_WIDTH = 170;
const MENU_HEIGHT = 230;

export interface MinimapContextMenuProps {
  prefs: ExplorerMinimapPrefs;
  /** The minimap is switched on but currently hidden because the preview is narrow. */
  autoHidden: boolean;
  x: number;
  y: number;
  onChange: (patch: ExplorerMinimapPatch) => void;
  onClose: () => void;
}

/** The focusable items of one menu level, in DOM order (submenu triggers included). */
function levelItems(menu: HTMLElement): HTMLButtonElement[] {
  const items: HTMLButtonElement[] = [];
  for (const child of Array.from(menu.children)) {
    const button = child.tagName === 'BUTTON' ? child : child.firstElementChild;
    if (button instanceof HTMLButtonElement && button.getAttribute('role')?.startsWith('menuitem') && !button.disabled) {
      items.push(button);
    }
  }
  return items;
}

/**
 * VS Code-style minimap menu for the Explorer editor: opened by right-clicking
 * the minimap or the vertical scrollbar. Changes are applied by the caller
 * (`onChange`) and the menu closes, as VS Code's does.
 */
export function MinimapContextMenu({ prefs, autoHidden, x, y, onChange, onClose }: MinimapContextMenuProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState<{ id: string; focus: boolean } | null>(null);

  const submenus: Submenu[] = [
    { id: 'width', label: 'Width', key: 'explorerMinimap', choices: EXPLORER_MINIMAP_WIDTH_CHOICES, current: prefs.width },
    { id: 'vertical', label: 'Vertical size', key: 'explorerMinimapVerticalSize', choices: EXPLORER_MINIMAP_VERTICAL_SIZE_CHOICES, current: prefs.verticalSize },
    { id: 'slider', label: 'Slider', key: 'explorerMinimapSlider', choices: EXPLORER_MINIMAP_SLIDER_CHOICES, current: prefs.slider },
    { id: 'side', label: 'Side', key: 'explorerMinimapSide', choices: EXPLORER_MINIMAP_SIDE_CHOICES, current: prefs.side }
  ];

  const apply = (patch: ExplorerMinimapPatch) => {
    onChange(patch);
    onClose();
  };

  React.useEffect(() => {
    if (rootRef.current) levelItems(rootRef.current)[0]?.focus();
    const dismiss = (event: Event) => {
      if (!rootRef.current?.contains(event.target as Node)) onClose();
    };
    window.addEventListener('mousedown', dismiss, true);
    window.addEventListener('contextmenu', dismiss, true);
    window.addEventListener('blur', onClose);
    return () => {
      window.removeEventListener('mousedown', dismiss, true);
      window.removeEventListener('contextmenu', dismiss, true);
      window.removeEventListener('blur', onClose);
    };
  }, [onClose]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const menu = target.closest<HTMLElement>('[role="menu"]');
    if (!menu) return;
    const inSubmenu = menu !== rootRef.current;
    const items = levelItems(menu);
    const index = items.indexOf(target as HTMLButtonElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!items.length) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
    } else if (event.key === 'ArrowRight' && !inSubmenu && target.getAttribute('aria-haspopup') === 'menu') {
      event.preventDefault();
      setOpen({ id: target.dataset.submenu ?? '', focus: true });
    } else if (event.key === 'ArrowLeft' && inSubmenu) {
      event.preventDefault();
      closeSubmenu();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (inSubmenu) closeSubmenu();
      else onClose();
    }
  };

  const closeSubmenu = () => {
    const id = open?.id;
    setOpen(null);
    if (id) rootRef.current?.querySelector<HTMLElement>(`[data-submenu="${id}"]`)?.focus();
  };

  const left = Math.max(0, Math.min(x, window.innerWidth - MENU_WIDTH));
  const top = Math.max(0, Math.min(y, window.innerHeight - MENU_HEIGHT));
  const flip = left + MENU_WIDTH + SUBMENU_WIDTH > window.innerWidth;

  return (
    <div
      ref={rootRef}
      className="tree-context-menu minimap-context-menu"
      role="menu"
      aria-label="Minimap"
      style={{ top, left }}
      onKeyDown={onKeyDown}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        role="menuitemcheckbox"
        aria-checked={prefs.enabled}
        onClick={() => apply({ explorerMinimapEnabled: !prefs.enabled })}
      >
        <span className="minimap-menu-check">{prefs.enabled && <Check size={12} aria-hidden="true" />}</span>
        <span>Minimap</span>
      </button>
      <div className="minimap-menu-sep" role="separator" />
      <button
        type="button"
        role="menuitemcheckbox"
        aria-checked={prefs.renderCharacters}
        disabled={!prefs.enabled}
        onClick={() => apply({ explorerMinimapRenderCharacters: !prefs.renderCharacters })}
      >
        <span className="minimap-menu-check">{prefs.renderCharacters && <Check size={12} aria-hidden="true" />}</span>
        <span>Render Characters</span>
      </button>
      {submenus.map((submenu) => {
        const expanded = prefs.enabled && open?.id === submenu.id;
        return (
          <div
            key={submenu.id}
            className="minimap-submenu-wrap"
            onMouseEnter={() => prefs.enabled && setOpen({ id: submenu.id, focus: false })}
          >
            <button
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={expanded}
              data-submenu={submenu.id}
              disabled={!prefs.enabled}
              onClick={() => setOpen({ id: submenu.id, focus: true })}
            >
              <span className="minimap-menu-check" />
              <span className="minimap-menu-label">{submenu.label}</span>
              <ChevronRight size={12} aria-hidden="true" />
            </button>
            {expanded && (
              <Submenu
                submenu={submenu}
                flip={flip}
                focusFirst={open?.focus ?? false}
                onPick={(value) => apply(submenu.key === 'explorerMinimap' ? { explorerMinimapWidth: value as any, explorerMinimap: value as any } : ({ [submenu.key]: value } as ExplorerMinimapPatch))}
              />
            )}
          </div>
        );
      })}
      {autoHidden && <div className="minimap-menu-note">Hidden — preview too narrow</div>}
    </div>
  );
}

function Submenu({
  submenu,
  flip,
  focusFirst,
  onPick
}: {
  submenu: Submenu;
  flip: boolean;
  focusFirst: boolean;
  onPick: (value: string) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (focusFirst && ref.current) levelItems(ref.current)[0]?.focus();
  }, [focusFirst]);
  return (
    <div
      ref={ref}
      className={`tree-context-menu minimap-submenu${flip ? ' flip' : ''}`}
      role="menu"
      aria-label={submenu.label}
    >
      {submenu.choices.map((choice) => (
        <button
          key={choice}
          type="button"
          role="menuitemradio"
          aria-checked={submenu.current === choice}
          onClick={() => onPick(choice)}
        >
          <span className="minimap-menu-check">{submenu.current === choice && <Check size={12} aria-hidden="true" />}</span>
          <span>{EXPLORER_MINIMAP_LABELS[choice]}</span>
        </button>
      ))}
    </div>
  );
}
