import { describe, expect, it } from 'vitest';

import { createUsageDataAssetReport, renderUsageDataAssetDraft } from './usage-data-asset-report.mjs';

const now = new Date('2026-07-13T06:00:00.000Z');

function productionReport(overrides = {}) {
  return {
    days: 30,
    generatedAt: '2026-07-13T05:00:00.000Z',
    source: 'https://accessfreetools.com/api/analytics/events?days=30',
    summary: {
      ownerExclusionConfigured: true,
      range: {
        events: 180,
        pageViews: 120,
        returningVisitors: 12,
        toolActions: 60,
        visitors: 40,
      },
      topPages: [{ count: 30, label: 'Tools', path: '/tools/' }],
      topReferrers: [{ count: 12, label: 'google.com' }],
      topTools: [{ count: 30, label: 'Four in a Row', path: '/tools/four-in-a-row-game/', slug: 'four-in-a-row-game' }],
      ...overrides,
    },
  };
}

describe('usage data asset production evidence', () => {
  it.each([
    { status: 'partial', reasons: 'file-tail-limit' },
    { status: 'complete', retainedRead: 'partial', deploymentContinuity: 'verified', comparisonsAllowed: true,
      reasons: ['file-tail-limit'], observedStart: null, observedEnd: null },
  ])('blocks malformed or contradictory coverage without throwing: %j', (coverage) => {
    const report = createUsageDataAssetReport({ now, productionReport: productionReport({ coverage }) });
    expect(report.status).toBe('not-ready');
    expect(report.coverage.comparisonsAllowed).toBe(false);
    expect(report.readinessIssues.join(' ')).toContain('coverage');
  });

  it('fails closed when the production aggregate is missing', () => {
    const report = createUsageDataAssetReport({ now, productionReport: null });

    expect(report.status).toBe('not-ready');
    expect(report.totals).toEqual({ events: 0, visitors: 0, returningVisitors: 0, pageViews: 0, toolActions: 0 });
    expect(report.readinessIssues.join(' ')).toContain('production analytics aggregate is missing');
  });

  it('does not mistake fresh requested-window metrics for proven interval coverage', () => {
    const report = createUsageDataAssetReport({ now, productionReport: productionReport() });

    expect(report.status).toBe('not-ready');
    expect(report.readinessIssues.join(' ')).toContain('coverage');
    expect(report.totals.visitors).toBe(40);
    expect(report.topTools[0]).toMatchObject({ count: 30, slug: 'four-in-a-row-game' });
    expect(JSON.stringify(report)).not.toContain('visitorHash');
  });

  it('carries partial reasons and actual observed dates into the usage draft', () => {
    const coverage = { status: 'partial', deploymentContinuity: 'unknown', comparisonsAllowed: false,
      observedStart: '2026-07-12T00:00:00.000Z', observedEnd: '2026-07-13T00:00:00.000Z', reasons: ['file-tail-limit'] };
    const report = createUsageDataAssetReport({ now, productionReport: productionReport({ coverage }) });
    expect(report.status).toBe('not-ready');
    expect(report.coverage).toEqual(coverage);
    const draft = renderUsageDataAssetDraft(report);
    expect(draft).toContain('Requested window');
    expect(draft).toContain('2026-07-12T00:00:00.000Z');
    expect(draft).toContain('file-tail-limit');
  });

  it('rejects stale evidence and missing production owner exclusion', () => {
    const report = createUsageDataAssetReport({
      now,
      productionReport: {
        ...productionReport({ ownerExclusionConfigured: false }),
        generatedAt: '2026-06-01T00:00:00.000Z',
      },
    });

    expect(report.status).toBe('not-ready');
    expect(report.readinessIssues.join(' ')).toContain('stale');
    expect(report.readinessIssues.join(' ')).toContain('Owner exclusion is not confirmed');
  });
});
