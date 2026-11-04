import { describe, expect, it } from 'vitest';
import { readSourceText } from '../../../__tests__/helpers/source-text.js';

const css = readSourceText(new URL('../../../styles/global.css', import.meta.url));

function zIndexOf(selector: string): number {
  const start = css.indexOf(`${selector} {`);
  expect(start, `missing rule ${selector}`).toBeGreaterThanOrEqual(0);
  const body = css.slice(start, css.indexOf('}', start));
  const match = /z-index:\s*(-?\d+)/.exec(body);
  expect(match, `${selector} has no z-index`).not.toBeNull();
  return Number(match![1]);
}

describe('sticky prompt paint order (#669)', () => {
  it('keeps hovered or focused rows below their turn\'s pinned prompt', () => {
    const sticky = zIndexOf('.thread-timeline-current-turn > .thread-timeline-item.is-user[data-sticky-prompt]');
    expect(zIndexOf('.thread-timeline-item:hover,\n.thread-timeline-item:focus-within')).toBeLessThan(sticky);
  });

  it('isolates each turn and raises the hovered turn above the next one', () => {
    expect(css).toContain('.thread-timeline-current-turn {\n  position: relative;\n  z-index: 0;');
    expect(zIndexOf('.thread-timeline-current-turn:hover,\n.thread-timeline-current-turn:focus-within')).toBe(1);
  });
});
