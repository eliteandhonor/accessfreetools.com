import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PERFORMANCE_ROW_LIMIT,
  MAX_PERFORMANCE_ROW_LIMIT,
  normalizePerformancePage,
  parsePerformanceRowLimit,
  performancePageFilterGroups,
} from './search-console-performance-query.mjs';

describe('Search Console performance query helpers', () => {
  it('uses a useful default and accepts the API maximum', () => {
    expect(parsePerformanceRowLimit()).toBe(DEFAULT_PERFORMANCE_ROW_LIMIT);
    expect(parsePerformanceRowLimit(String(MAX_PERFORMANCE_ROW_LIMIT))).toBe(MAX_PERFORMANCE_ROW_LIMIT);
  });

  it.each(['0', '25001', '1.5', 'many'])('rejects invalid row limit %s', (value) => {
    expect(() => parsePerformanceRowLimit(value)).toThrow(/row limit must be an integer/i);
  });

  it('normalizes an Access Free Tools page and removes its fragment', () => {
    expect(
      normalizePerformancePage('https://accessfreetools.com/tools/gas-mileage-calculator/?source=test#formula'),
    ).toBe('https://accessfreetools.com/tools/gas-mileage-calculator/');
  });

  it.each([
    'http://accessfreetools.com/tools/',
    'https://www.accessfreetools.com/tools/',
    'https://example.com/tools/',
    '/tools/gas-mileage-calculator/',
  ])('rejects an out-of-scope page URL %s', (value) => {
    expect(() => normalizePerformancePage(value)).toThrow(/must/i);
  });

  it('builds an exact page filter for the Search Analytics API', () => {
    expect(performancePageFilterGroups('https://accessfreetools.com/tools/')).toEqual([
      {
        groupType: 'and',
        filters: [
          {
            dimension: 'page',
            operator: 'equals',
            expression: 'https://accessfreetools.com/tools/',
          },
        ],
      },
    ]);
    expect(performancePageFilterGroups('')).toBeUndefined();
  });
});
