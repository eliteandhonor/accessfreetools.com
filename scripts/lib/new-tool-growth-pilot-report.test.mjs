import { describe, expect, it } from 'vitest';

import {
  analyzeNewToolGrowthPilot,
  JSON_TO_CSV_PILOT_URLS,
  renderNewToolGrowthPilotReport,
  selectLatestPilotInspections,
} from './new-tool-growth-pilot-report.mjs';

function inspectionReport(generatedAt, coverageStates) {
  return {
    generatedAt,
    inspections: JSON_TO_CSV_PILOT_URLS.map((inspectionUrl, index) => ({
      coverageState: coverageStates[index],
      inspectionUrl,
      verdict: coverageStates[index] === 'Submitted and indexed' ? 'PASS' : 'NEUTRAL',
    })),
  };
}

describe('new tool growth pilot report', () => {
  it('keeps the next release collecting while the wait and discovery gates are open', () => {
    const report = analyzeNewToolGrowthPilot({
      inspectionReports: [
        inspectionReport('2026-07-18T08:04:51.610Z', [
          'URL is unknown to Google',
          'URL is unknown to Google',
        ]),
      ],
      now: new Date('2026-07-20T00:00:00.000Z'),
      productionSitemap: {
        checked: 659,
        generatedAt: '2026-07-18T08:10:20.981Z',
        hardFailures: 0,
      },
    });

    expect(report.status).toBe('collecting');
    expect(report.nextReleaseReady).toBe(false);
    expect(report.summary.discoveredCount).toBe(0);
    expect(report.readinessIssues.join(' ')).toContain('Wait until');
    expect(report.readinessIssues.join(' ')).toContain('CrawlScout');
  });

  it('allows a review after fourteen days when one page is discovered and safety evidence is clean', () => {
    const report = analyzeNewToolGrowthPilot({
      crawlScout: {
        generatedAt: '2026-08-01T09:00:00.000Z',
        overview: { notIndexed: 120 },
      },
      inspectionReports: [
        inspectionReport('2026-08-01T08:00:00.000Z', [
          'Crawled - currently not indexed',
          'URL is unknown to Google',
        ]),
      ],
      now: new Date('2026-08-02T00:00:00.000Z'),
      productionSitemap: {
        checked: 659,
        generatedAt: '2026-08-01T08:30:00.000Z',
        hardFailures: 0,
      },
    });

    expect(report.nextReleaseReady).toBe(true);
    expect(report.status).toBe('eligible-for-next-release-review');
    expect(report.summary.discoveredCount).toBe(1);
    expect(report.readinessIssues).toEqual([]);
  });

  it('blocks the next release when CrawlScout affected rows increase', () => {
    const report = analyzeNewToolGrowthPilot({
      crawlScout: {
        generatedAt: '2026-08-01T09:00:00.000Z',
        overview: { notIndexed: 130 },
      },
      inspectionReports: [
        inspectionReport('2026-08-01T08:00:00.000Z', [
          'Submitted and indexed',
          'URL is unknown to Google',
        ]),
      ],
      now: new Date('2026-08-02T00:00:00.000Z'),
      productionSitemap: {
        checked: 659,
        generatedAt: '2026-08-01T08:30:00.000Z',
        hardFailures: 0,
      },
    });

    expect(report.nextReleaseReady).toBe(false);
    expect(report.status).toBe('blocked-by-evidence');
    expect(report.readinessIssues.join(' ')).toContain('increased from 124 to 130');
  });

  it('selects the newest inspection for each exact URL', () => {
    const selected = selectLatestPilotInspections([
      inspectionReport('2026-07-18T08:00:00.000Z', [
        'URL is unknown to Google',
        'URL is unknown to Google',
      ]),
      inspectionReport('2026-07-20T08:00:00.000Z', [
        'Crawled - currently not indexed',
        'Submitted and indexed',
      ]),
    ]);

    expect(selected.map((inspection) => inspection.coverageState)).toEqual([
      'Crawled - currently not indexed',
      'Submitted and indexed',
    ]);
    expect(selected.map((inspection) => inspection.discovered)).toEqual([true, true]);
  });

  it('renders unknown evidence without claiming readiness', () => {
    const report = analyzeNewToolGrowthPilot({
      now: new Date('2026-07-20T00:00:00.000Z'),
    });
    const markdown = renderNewToolGrowthPilotReport(report);

    expect(markdown).toContain('Next release ready: no');
    expect(markdown).toContain('not enough data');
  });
});
