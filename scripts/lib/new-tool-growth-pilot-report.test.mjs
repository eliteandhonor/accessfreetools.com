import { describe, expect, it } from 'vitest';
import { mergeInspectionReports } from './search-console-inspection-reports.mjs';

import {
  analyzeNewToolGrowthPilot,
  JSON_TO_CSV_PILOT_URLS,
  renderNewToolGrowthPilotReport,
  selectLatestPilotInspections,
} from './new-tool-growth-pilot-report.mjs';

function inspectionReport(generatedAt, coverageStates) {
  return {
    generatedAt,
    source: 'synthetic-worktree/original-inspection.json',
    inspections: JSON_TO_CSV_PILOT_URLS.map((inspectionUrl, index) => ({
      coverageState: coverageStates[index],
      inspectionUrl,
      verdict: coverageStates[index] === 'Submitted and indexed' ? 'PASS' : 'NEUTRAL',
    })),
  };
}

describe('new tool growth pilot report', () => {
  it.each(['PASS', 'NEUTRAL'])('selects actual %s observations across worktrees, not wrapper dates', (verdict) => {
    const original = inspectionReport('2026-07-20T00:00:00.000Z', [
      verdict === 'PASS' ? 'URL is unknown to Google' : 'Submitted and indexed', 'Submitted and indexed',
    ]);
    const wrapper = mergeInspectionReports([{ report: original, sourcePath: 'worktree-a/original.json' }], '2026-09-06T00:00:00.000Z');
    const newer = {
      generatedAt: '2026-09-02T00:00:00.000Z', source: 'worktree-b/original.json',
      inspections: [{ inspectionUrl: JSON_TO_CSV_PILOT_URLS[0], verdict,
        coverageState: verdict === 'PASS' ? 'Submitted and indexed' : 'URL is unknown to Google' }],
    };
    const selected = selectLatestPilotInspections([newer, { ...wrapper, source: 'wrapper.json' }]);
    expect(selected[0]).toMatchObject({ verdict, generatedAt: newer.generatedAt,
      sourceGeneratedAt: newer.generatedAt, sourcePath: newer.source, source: newer.source });
    expect(selected[1]).toMatchObject({ generatedAt: original.generatedAt, sourcePath: 'worktree-a/original.json' });
    const analysis = analyzeNewToolGrowthPilot({ ...freshEvidence(), inspectionReports: [newer, wrapper] });
    expect(analysis.nextReleaseReady).toBe(verdict === 'PASS');
  });

  const now = new Date('2026-09-06T00:00:00.000Z');
  function freshEvidence() {
    return {
      now,
      inspectionReports: [inspectionReport('2026-09-05T00:00:00.000Z', ['Submitted and indexed', 'URL is unknown to Google'])],
      productionSitemap: { generatedAt: '2026-09-05T00:00:00.000Z', checked: 659, hardFailures: 0 },
      crawlScout: { generatedAt: '2026-09-05T00:00:00.000Z', overview: { notIndexed: 120 } },
    };
  }

  it.each([undefined, '', '  ', null, 42, {}, ['original.json'], 'bad\u0000.json'].map((value) => [value]))('blocks a dated merged PASS with missing or invalid origin %j', (sourcePath) => {
    const input = freshEvidence();
    input.inspectionReports = [{
      kind: 'search-console-url-inspection-merged', generatedAt: now.toISOString(), source: 'wrapper.json',
      inspections: [{ inspectionUrl: JSON_TO_CSV_PILOT_URLS[0], verdict: 'PASS', coverageState: 'Submitted and indexed',
        sourceGeneratedAt: '2026-09-05T00:00:00.000Z', ...(sourcePath === undefined ? {} : { sourcePath }) }],
    }];
    const report = analyzeNewToolGrowthPilot(input);
    expect(report.nextReleaseReady).toBe(false);
    expect(report.inspections[0]).toMatchObject({ sourcePath: sourcePath === undefined ? '' : sourcePath,
      sourceFreshness: 'fresh', status: 'not enough data', discovered: false, indexed: false });
    const markdown = renderNewToolGrowthPilotReport(report);
    expect(markdown).toContain('source not enough data');
    expect(markdown).not.toContain('source wrapper.json');
    expect(markdown).toContain('2026-09-05T00:00:00.000Z');
  });

  it('accepts a file-backed raw origin and preserves it through nested JSON round trips', () => {
    const input = freshEvidence();
    const originalPath = 'C:/synthetic-worktree/output/original.json';
    const raw = { report: input.inspectionReports[0], sourcePath: originalPath };
    const merged = mergeInspectionReports([raw], now.toISOString());
    const nested = mergeInspectionReports([{ report: JSON.parse(JSON.stringify(merged)), sourcePath: 'new-wrapper.json' }]);
    for (const record of [raw, nested]) {
      const report = analyzeNewToolGrowthPilot({ ...input, inspectionReports: [record] });
      expect(report.nextReleaseReady).toBe(true);
      expect(report.inspections[0]).toMatchObject({ sourcePath: originalPath,
        sourceGeneratedAt: '2026-09-05T00:00:00.000Z', status: 'observed' });
      expect(renderNewToolGrowthPilotReport(report)).toContain(`source ${originalPath}`);
    }
  });

  it.each([
    ['', 'undated'], [null, 'undated'], ['malformed', 'undated'],
    ['2026-09-07T00:00:00.000Z', 'future'], ['2020-01-01T00:00:00.000Z', 'prelaunch'],
    ['2026-08-01T00:00:00.000Z', 'stale'],
  ])('rejects %j inspection evidence as %s even in a fresh wrapper', (sourceGeneratedAt, freshness) => {
    const input = freshEvidence();
    input.inspectionReports[0].inspections[0].sourceGeneratedAt = sourceGeneratedAt;
    const report = analyzeNewToolGrowthPilot(input);
    expect(report.nextReleaseReady).toBe(false);
    expect(report.summary.discoveryGatePassed).toBe(false);
    expect(report.inspections[0]).toMatchObject({ discovered: false, indexed: false, sourceFreshness: freshness, status: 'not enough data' });
    expect(renderNewToolGrowthPilotReport(report)).toContain(freshness);
  });

  it.each(['productionSitemap', 'crawlScout'])('rejects invalid decision-evidence ages for %s', (field) => {
    for (const generatedAt of ['', null, 'malformed', '2026-09-07T00:00:00.000Z', '2020-01-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z']) {
      const input = freshEvidence();
      input[field].generatedAt = generatedAt;
      const report = analyzeNewToolGrowthPilot(input);
      expect(report.nextReleaseReady, `${field}: ${generatedAt}`).toBe(false);
      expect(report[field === 'productionSitemap' ? 'sitemap' : field].fresh).toBe(false);
    }
  });

  it('keeps the seven-day freshness boundary inclusive and never falls back past a future winner', () => {
    const input = freshEvidence();
    input.inspectionReports[0].generatedAt = '2026-08-30T00:00:00.000Z';
    expect(analyzeNewToolGrowthPilot(input).nextReleaseReady).toBe(true);
    input.inspectionReports[0].generatedAt = '2026-08-29T23:59:59.999Z';
    expect(analyzeNewToolGrowthPilot(input).nextReleaseReady).toBe(false);
    input.inspectionReports.push(inspectionReport('2026-09-07T00:00:00.000Z', ['Submitted and indexed', 'Submitted and indexed']));
    expect(analyzeNewToolGrowthPilot(input).nextReleaseReady).toBe(false);
  });

  it('renders original inspection provenance rather than the current report date', () => {
    const input = freshEvidence();
    input.inspectionReports[0].source = 'worktree-a/inspection.json';
    const report = analyzeNewToolGrowthPilot(input);
    expect(report.nextReleaseReady).toBe(true);
    expect(renderNewToolGrowthPilotReport(report)).toContain('2026-09-05T00:00:00.000Z');
    expect(renderNewToolGrowthPilotReport(report)).toContain('worktree-a/inspection.json');
  });

  it('blocks an inspection error after PASS and permits a later real recovery', () => {
    const input = freshEvidence();
    input.inspectionReports.push({
      generatedAt: '2026-09-05T01:00:00.000Z', source: 'error.json',
      inspections: [{ inspectionUrl: JSON_TO_CSV_PILOT_URLS[0], error: 'Inspection failed' }],
    });
    expect(analyzeNewToolGrowthPilot(input).nextReleaseReady).toBe(false);
    input.inspectionReports.push(inspectionReport('2026-09-05T02:00:00.000Z', ['Submitted and indexed', 'URL is unknown to Google']));
    expect(analyzeNewToolGrowthPilot(input).nextReleaseReady).toBe(true);
  });

  it('does not present out-of-window analytics as current production usage', () => {
    const input = freshEvidence();
    input.analytics = { generatedAt: '2026-08-01T00:00:00.000Z', summary: {
      selectedToolActions: [{ action: 'Convert JSON', count: 42 }], selectedToolAudience: { pageViews: 100 },
    } };
    expect(analyzeNewToolGrowthPilot(input).analytics).toMatchObject({ source: 'not enough data', convertActions: 0, pageViews: 0 });
    input.analytics.generatedAt = '2026-09-05T00:00:00.000Z';
    expect(analyzeNewToolGrowthPilot(input).analytics).toMatchObject({ source: 'production aggregate', convertActions: 42, pageViews: 100 });
  });

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
