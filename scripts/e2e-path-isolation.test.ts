import { expect, it } from 'vitest';
import { applyIsolatedClaudePath } from '../e2e/fixtures/app-config.js';

it('preserves Windows Path when isolating CLI discovery and avoids duplicate PATH keys', () => {
  const env: Record<string, string> = { Path: 'C:/node-bin', OTHER: 'preserved' };
  applyIsolatedClaudePath(env);
  expect(env.PATH).toContain('C:/node-bin');
  expect(env.Path).toBeUndefined();
  expect(env.OTHER).toBe('preserved');
});

it('keeps an explicit PATH override ahead of an inherited Windows Path', () => {
  const env = { Path: 'inherited', PATH: 'explicit' };
  applyIsolatedClaudePath(env, true);
  expect(env).toEqual({ PATH: 'explicit' });
});

it('preserves arbitrary casing and removes duplicate case-insensitive keys', () => {
  const env: Record<string, string> = { pAtH: 'node-bin' };
  applyIsolatedClaudePath(env);
  expect(env.PATH).toContain('node-bin');
  expect(env.pAtH).toBeUndefined();
});

it('leaves a missing PATH absent when live CLI discovery is explicitly allowed', () => {
  const env = { OTHER: 'preserved' };
  applyIsolatedClaudePath(env, true);
  expect(env).toEqual({ OTHER: 'preserved' });
});
