import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('routes the public daily command through independent provider refreshes', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  expect(packageJson.scripts['seo:daily']).toBe('node scripts/seo-daily-refresh.mjs');
});
