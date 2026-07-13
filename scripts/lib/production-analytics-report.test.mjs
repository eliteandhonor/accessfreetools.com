import { describe, expect, it } from 'vitest';

import { createProductionAnalyticsReport } from './production-analytics-report.mjs';

describe('production analytics report privacy', () => {
  it('keeps aggregate metrics while dropping event rows and identifier hashes', () => {
    const report = createProductionAnalyticsReport({
      days: 90,
      generatedAt: '2026-07-13T00:00:00.000Z',
      source: 'https://accessfreetools.com/api/analytics/events?days=90',
      summary: {
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
    expect(JSON.stringify(report)).not.toMatch(/recentEvents|sessionHash|visitorHash|private-/);
  });
});
