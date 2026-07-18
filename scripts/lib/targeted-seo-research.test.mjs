import { describe, expect, it } from 'vitest';

import {
  estimateTargetedSerpCost,
  normalizeTargetedKeywords,
  safeResearchLabel,
  summarizeTargetedSerpTasks,
} from './targeted-seo-research.mjs';

describe('targeted SEO research', () => {
  it('deduplicates phrases and enforces the 15-keyword limit', () => {
    expect(normalizeTargetedKeywords([' Kawaii calculator ', 'kawaii calculator', 'gas mileage calculator'])).toEqual([
      'Kawaii calculator',
      'gas mileage calculator',
    ]);
    expect(() => normalizeTargetedKeywords(Array.from({ length: 16 }, (_, index) => `keyword ${index}`))).toThrow(
      'limited to 15',
    );
  });

  it('sanitizes labels and estimates bounded depth-10 cost', () => {
    expect(safeResearchLabel('July 18 Search Recovery')).toBe('july-18-search-recovery');
    expect(estimateTargetedSerpCost(15, 10)).toBe(0.03);
  });

  it('summarizes organic results and Access Free Tools rank', () => {
    const rows = summarizeTargetedSerpTasks([
      {
        cost: 0.002,
        data: { keyword: 'cute calculator' },
        result: [
          {
            items: [
              { type: 'paid', title: 'Ad' },
              {
                domain: 'accessfreetools.com',
                rank_group: 4,
                title: 'Kawaii Calculator',
                type: 'organic',
                url: 'https://accessfreetools.com/tools/kawaii-calculator/',
              },
            ],
          },
        ],
        status_code: 20000,
      },
    ]);

    expect(rows[0]).toMatchObject({
      accessFreeToolsRank: 4,
      costUsd: 0.002,
      keyword: 'cute calculator',
    });
    expect(rows[0].topResults).toHaveLength(1);
  });
});
