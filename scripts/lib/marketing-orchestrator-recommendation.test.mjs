import { describe, expect, it } from 'vitest';

import {
  createIndexingRecommendation,
  createPinterestCatalogRecommendation,
} from './marketing-orchestrator-recommendation.mjs';

const gap = {
  state: 'Crawled - currently not indexed',
  url: 'https://accessfreetools.com/tools/personal-loan-calculator/',
};

describe('marketing indexing recommendation', () => {
  it('waits for Google when built links are already sufficient', () => {
    const result = createIndexingRecommendation(gap, {
      suggestions: [
        {
          action: 'monitor',
          reason: 'Search Console state: Crawled - currently not indexed; 8 built pages already link here, so next proof step is manual request indexing or recheck after Google crawls.',
          target: '/tools/personal-loan-calculator/',
        },
      ],
    });

    expect(result.title).toBe('Request indexing or recheck not-indexed priority pages');
    expect(result.action).toMatch(/Search Console URL Inspection/);
    expect(result.gate).toMatch(/Do not add duplicate internal links/);
  });

  it('does not spend another request when Search Console already accepted the URL', () => {
    const result = createIndexingRecommendation(gap, {
      suggestions: [
        {
          action: 'monitor',
          reason:
            'Search Console state: Crawled - currently not indexed; 8 built pages already link here, so next proof step is Search Console UI request-indexing submitted 13 July 2026, 7:09 pm; recheck after Google crawls.',
          target: '/tools/personal-loan-calculator/',
        },
      ],
    });

    expect(result.title).toBe('Recheck requested indexing after Google crawls');
    expect(result.action).toMatch(/Do not repeat the request-indexing click/);
  });

  it('waits for the next quota window when a manual request was deferred', () => {
    const result = createIndexingRecommendation(gap, {
      suggestions: [
        {
          action: 'monitor',
          reason:
            'Search Console state: Crawled - currently not indexed; 9 built pages already link here, so next proof step is Search Console UI request-indexing was deferred because the daily request quota was exceeded; retry in the next daily quota window.',
          target: '/tools/personal-loan-calculator/',
        },
      ],
    });

    expect(result.title).toBe('Retry indexing after the Search Console quota resets');
    expect(result.action).toMatch(/Do not retry during the exhausted quota window/);
  });

  it('asks for a build instead of inventing a zero-link problem', () => {
    const result = createIndexingRecommendation(gap, {
      suggestions: [
        {
          action: 'add-link',
          reason: 'built link counts are unavailable until npm run build',
          target: '/tools/personal-loan-calculator/',
        },
      ],
    });

    expect(result.title).toBe('Refresh built-link proof before changing priority pages');
    expect(result.action).toContain('npm run build');
    expect(result.action).not.toMatch(/^Add /);
  });

  it('treats a missing link-helper item as missing proof', () => {
    const result = createIndexingRecommendation(gap, { suggestions: [] });

    expect(result.title).toBe('Refresh built-link proof before changing priority pages');
    expect(result.gate).toMatch(/evidence gap/);
  });

  it('keeps a real low-link recommendation actionable', () => {
    const result = createIndexingRecommendation(gap, {
      suggestions: [
        {
          action: 'add-link',
          reason: 'only 1 built page links here, so add contextual support first',
          target: '/tools/personal-loan-calculator/',
        },
      ],
    });

    expect(result.title).toBe('Improve discovery for not-indexed priority pages');
    expect(result.action).toMatch(/contextual internal links/);
  });
});

describe('Pinterest catalog recommendation', () => {
  it('keeps the full app catalog active until every app has direct proof', () => {
    const result = createPinterestCatalogRecommendation({
      counts: { totalApps: 302, postedApps: 44, rssReadyApps: 258 },
    });

    expect(result.priority).toBe('High');
    expect(result.reason).toContain('258 of 302');
    expect(result.gate).toMatch(/Do not call Pinterest complete/);
    expect(result.proofNeeded).toMatch(/every public app/);
  });
});
