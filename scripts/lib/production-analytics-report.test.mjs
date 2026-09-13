import { describe, expect, it } from 'vitest';

import { createProductionAnalyticsReport, getAnalyticsCoverage } from './production-analytics-report.mjs';

const completeCoverage = {
  status: 'complete', retainedRead: 'complete', reasons: [], deploymentContinuity: 'verified', comparisonsAllowed: true,
  requestedStart: '2026-08-01T00:00:00Z', requestedEnd: '2026-09-01T00:00:00Z',
  observedStart: '2026-08-01T00:00:00Z', observedEnd: '2026-09-01T00:00:00Z',
  rangeObservedStart: '2026-08-01T00:00:00Z', rangeObservedEnd: '2026-09-01T00:00:00Z',
};

describe('production analytics report privacy', () => {
  it.each([false, 1, 'partial', [], {}, { status: 'partial', reasons: 'file-tail-limit' },
    { status: 'partial', reasons: [null] }, { status: 'unknown', reasons: [], comparisonsAllowed: 'false' }].map((coverage) => ({ coverage })))(
    'fails closed on malformed coverage $coverage', ({ coverage }) => {
      const result = getAnalyticsCoverage({ coverage });
      expect(result.status).not.toBe('complete');
      expect(result.comparisonsAllowed).toBe(false);
      expect(result.deploymentContinuity).toBe('unknown');
      expect(result.reasons).toContain('coverage-metadata-invalid');
    });

  it.each([
    { retainedRead: 'partial', reasons: ['file-tail-limit'] },
    { status: 'partial' }, { deploymentContinuity: 'unknown' },
    { observedStart: null }, { requestedEnd: 'invalid' },
    { rangeObservedStart: '2026-09-02T00:00:00Z' },
    { reasons: ['deployment-continuity-unverified'] },
  ])('blocks contradictory completeness claims %j', (overrides) => {
    const result = getAnalyticsCoverage({ coverage: { ...completeCoverage, ...overrides } });
    expect(result.comparisonsAllowed).toBe(false);
    expect(result.status).not.toBe('complete');
    expect(result.reasons).toContain('coverage-metadata-contradictory');
  });

  it('preserves a coherent supplied coverage contract without creating one for missing metadata', () => {
    expect(getAnalyticsCoverage({ coverage: completeCoverage })).toEqual(completeCoverage);
    expect(getAnalyticsCoverage({}).status).toBe('unknown');
  });

  it('marks legacy aggregates as unknown coverage without refreshing their observation dates', () => {
    const report = createProductionAnalyticsReport({ days: 30, generatedAt: '2026-09-06T00:00:00.000Z',
      source: 'fixture', summary: { generatedAt: '2026-09-01T00:00:00.000Z', rangeStart: '2026-08-02T00:00:00.000Z' } });
    expect(report.summary.coverage).toMatchObject({ status: 'unknown', deploymentContinuity: 'unknown',
      requestedStart: '2026-08-02T00:00:00.000Z', requestedEnd: '2026-09-01T00:00:00.000Z',
      observedStart: null, observedEnd: null, comparisonsAllowed: false });
    expect(report.summary.coverage.reasons).toContain('coverage-metadata-missing');
  });

  it('propagates partial coverage reasons and observed dates through private-field removal', () => {
    const coverage = { status: 'partial', reasons: ['file-tail-limit'], observedStart: '2026-09-04T00:00:00.000Z',
      observedEnd: '2026-09-05T00:00:00.000Z', comparisonsAllowed: false, deploymentContinuity: 'unknown' };
    const report = createProductionAnalyticsReport({ days: 30, generatedAt: '2026-09-06T00:00:00.000Z', source: 'fixture', summary: { coverage } });
    expect(report.summary.coverage).toEqual(coverage);
  });

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
