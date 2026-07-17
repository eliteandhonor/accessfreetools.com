import { describe, expect, it } from 'vitest';

import { loadPinterestAppCoverage, parseManualPinterestItems } from './pinterest-app-catalog.mjs';

describe('Pinterest app catalog', () => {
  it('parses manual public proof without treating generated entries as manual rows', () => {
    const items = parseManualPinterestItems(`
      {
        title: 'Example',
        path: '/tools/example/',
        imagePath: '/pinterest/example.jpg',
        category: 'Free Online Calculators',
        boardSlug: 'free-online-calculators',
        status: 'posted',
        rssEligible: false,
        publicPinUrl: 'https://au.pinterest.com/pin/123/',
        published: '2026-07-17',
      },
    `);

    expect(items).toHaveLength(1);
    expect(items[0].publicPinUrl).toBe('https://au.pinterest.com/pin/123/');
  });

  it('covers every canonical public app exactly once at catalog level', () => {
    const report = loadPinterestAppCoverage();
    expect(report.counts.totalApps).toBe(302);
    expect(new Set(report.apps.map((app) => app.slug)).size).toBe(report.counts.totalApps);
    expect(report.counts.missingApps).toBe(0);
    expect(report.apps.every((app) => app.boardSlug)).toBe(true);
  });
});
