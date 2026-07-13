import { describe, expect, it } from 'vitest';

import { createProductionAnalyticsReport } from './production-analytics-report.mjs';

describe('production analytics report privacy', () => {
  it('keeps aggregate metrics while dropping event rows and identifier hashes', () => {
    const report = createProductionAnalyticsReport({
      days: 90,
      generatedAt: '2026-07-13T00:00:00.000Z',
      source: 'https://accessfreetools.com/api/analytics/events?days=90',
      summary: {
        ownerExclusionConfigured: true,
        range: {
          events: 24,
          pageViews: 8,
          returningVisitors: 1,
          toolActions: 16,
          visitors: 2,
        },
        recentEvents: [{ action: 'Start round: computer', sessionHash: 'private-session' }],
        selectedToolActions: [{ action: 'Start round: computer', count: 4, slug: 'four-in-a-row-game' }],
        selectedToolAudience: {
          pageViews: 8,
          sessions: 3,
          slug: 'four-in-a-row-game',
          visitorHash: 'private-visitor',
          visitors: 2,
        },
      },
      toolSlug: 'four-in-a-row-game',
    });

    expect(report.summary.selectedToolActions).toHaveLength(1);
    expect(report.summary.selectedToolAudience).toEqual({
      pageViews: 8,
      sessions: 3,
      slug: 'four-in-a-row-game',
      visitors: 2,
    });
    expect(report.summary.ownerExclusionConfigured).toBe(true);
    expect(report.summary.range).toEqual({
      events: 24,
      pageViews: 8,
      returningVisitors: 1,
      toolActions: 16,
      visitors: 2,
    });
    expect(JSON.stringify(report)).not.toMatch(/recentEvents|sessionHash|visitorHash|private-/);
  });
});
