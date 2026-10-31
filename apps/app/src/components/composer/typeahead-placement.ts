import type { PopoverMenuPlacement } from '../ui/PopoverPicklist.js';

/** Keep the composer menu inside the viewport, including on short windows. */
export function placeTypeaheadMenu(
  anchor: Pick<DOMRect, 'left' | 'top' | 'bottom' | 'width'>,
  viewport: { width: number; height: number },
  preferAbove: boolean
): PopoverMenuPlacement {
  const padding = 8;
  const gap = 8;
  const height = Math.max(0, viewport.height - padding * 2);
  const width = Math.min(anchor.width, Math.max(0, viewport.width - padding * 2));
  const left = Math.max(padding, Math.min(anchor.left, viewport.width - padding - width));
  const above = Math.max(0, Math.min(height, anchor.top - gap - padding));
  const below = Math.max(0, Math.min(height, viewport.height - anchor.bottom - gap - padding));
  const cap = Math.min(280, Math.floor(viewport.height * 0.42));
  const preferred = preferAbove ? above : below;
  const alternate = preferAbove ? below : above;
  const openAbove = preferred < Math.min(160, cap) && alternate > preferred ? !preferAbove : preferAbove;
  const maxHeight = Math.min(cap, openAbove ? above : below);
  return openAbove
    ? { left, width, maxHeight, bottom: Math.max(padding, Math.min(viewport.height - padding, viewport.height - anchor.top + gap)) }
    : { left, width, maxHeight, top: Math.max(padding, Math.min(viewport.height - padding, anchor.bottom + gap)) };
}
