export const JSON_TO_CSV_LAUNCH_AT = '2026-07-18T17:53:34+10:00';
export const JSON_TO_CSV_NEXT_RELEASE_AT = '2026-08-01T17:53:34+10:00';
export const JSON_TO_CSV_DAY_28_REVIEW_AT = '2026-08-15T17:53:34+10:00';
export const JSON_TO_CSV_DAY_56_REVIEW_AT = '2026-09-12T17:53:34+10:00';
export const JSON_TO_CSV_CRAWLSCOUT_BASELINE = 124;

export const JSON_TO_CSV_PILOT_URLS = [
  'https://accessfreetools.com/tools/json-to-csv-converter/',
  'https://accessfreetools.com/blog/how-to-use-json-to-csv-converter/',
];

function timestamp(value) {
  const parsed = new Date(value ?? 0).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function finiteNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function inspectionIsDiscovered(inspection) {
  const coverageState = String(inspection?.coverageState ?? '').trim();
  return Boolean(
    coverageState &&
      coverageState !== 'URL is unknown to Google' &&
      coverageState !== 'COVERAGE_STATE_UNSPECIFIED',
  );
}

function inspectionIsIndexed(inspection) {
  return inspection?.verdict === 'PASS';
}

export function selectLatestPilotInspections(
  inspectionReports = [],
  targetUrls = JSON_TO_CSV_PILOT_URLS,
) {
  const selected = new Map();

  for (const report of inspectionReports) {
    const generatedAt = report?.generatedAt ?? '';
    const reportTime = timestamp(generatedAt);

    for (const inspection of report?.inspections ?? []) {
      const url = inspection?.inspectionUrl;
      if (!targetUrls.includes(url)) continue;

      const current = selected.get(url);
      if (!current || reportTime > timestamp(current.generatedAt)) {
        selected.set(url, {
          coverageState: inspection.coverageState ?? '',
          generatedAt,
          indexingState: inspection.indexingState ?? '',
          inspectionUrl: url,
          pageFetchState: inspection.pageFetchState ?? '',
          source: report.source ?? '',
          verdict: inspection.verdict ?? '',
        });
      }
    }
  }

  return targetUrls.map((url) => {
    const inspection = selected.get(url);
    if (!inspection) {
      return {
        discovered: false,
        indexed: false,
        inspectionUrl: url,
        status: 'not enough data',
      };
    }

    return {
      ...inspection,
      discovered: inspectionIsDiscovered(inspection),
      indexed: inspectionIsIndexed(inspection),
      status: 'observed',
    };
  });
}

function actionCount(analytics, action) {
  const actions = analytics?.summary?.selectedToolActions ?? [];
  return finiteNumber(actions.find((entry) => entry?.action === action)?.count);
}

function pageSearchEvidence(performance, url) {
  const row = performance?.pages?.find((page) => page?.page === url || page?.url === url);
  if (!row) return { status: 'not enough data' };

  return {
    clicks: finiteNumber(row.clicks),
    ctrPercent: finiteNumber(row.ctrPercent),
    impressions: finiteNumber(row.impressions),
    position: finiteNumber(row.position),
    status: 'observed',
  };
}

export function analyzeNewToolGrowthPilot({
  analytics = null,
  crawlScout = null,
  inspectionReports = [],
  now = new Date(),
  performance = null,
  productionSitemap = null,
} = {}) {
  const launchTime = timestamp(JSON_TO_CSV_LAUNCH_AT);
  const nextReleaseTime = timestamp(JSON_TO_CSV_NEXT_RELEASE_AT);
  const currentTime = now.getTime();
  const inspections = selectLatestPilotInspections(inspectionReports);
  const discoveredCount = inspections.filter((inspection) => inspection.discovered).length;
  const indexedCount = inspections.filter((inspection) => inspection.indexed).length;
  const discoveryGatePassed = discoveredCount > 0;

  const sitemapGeneratedAt = productionSitemap?.generatedAt ?? '';
  const sitemapFresh = timestamp(sitemapGeneratedAt) >= launchTime;
  const sitemapHardFailures = finiteNumber(productionSitemap?.hardFailures, -1);
  const sitemapHealthy = Boolean(
    sitemapFresh &&
      finiteNumber(productionSitemap?.checked) > 0 &&
      sitemapHardFailures === 0,
  );

  const crawlScoutGeneratedAt = crawlScout?.generatedAt ?? '';
  const crawlScoutAffected = finiteNumber(
    crawlScout?.overview?.notIndexed ??
      crawlScout?.overview?.deindexed ??
      crawlScout?.overview?.rows,
    -1,
  );
  const crawlScoutFresh = timestamp(crawlScoutGeneratedAt) >= launchTime;
  const crawlScoutRegression = Boolean(
    crawlScoutFresh && crawlScoutAffected > JSON_TO_CSV_CRAWLSCOUT_BASELINE,
  );
  const crawlScoutGatePassed = Boolean(
    crawlScoutFresh &&
      crawlScoutAffected >= 0 &&
      !crawlScoutRegression,
  );

  const releaseWaitPassed = currentTime >= nextReleaseTime;
  const nextReleaseReady = Boolean(
    releaseWaitPassed &&
      discoveryGatePassed &&
      sitemapHealthy &&
      crawlScoutGatePassed,
  );
  const readinessIssues = [];

  if (!releaseWaitPassed) {
    readinessIssues.push(`Wait until ${JSON_TO_CSV_NEXT_RELEASE_AT} before reviewing the next tool release.`);
  }
  if (!discoveryGatePassed) {
    readinessIssues.push('Both JSON to CSV pages are still unknown to Google or lack fresh URL inspection evidence.');
  }
  if (!sitemapFresh) {
    readinessIssues.push('A post-release production sitemap report is missing or stale.');
  } else if (!sitemapHealthy) {
    readinessIssues.push(`The latest production sitemap report has ${sitemapHardFailures} hard failure(s).`);
  }
  if (!crawlScoutFresh) {
    readinessIssues.push('A post-release CrawlScout sample is missing or stale.');
  } else if (crawlScoutRegression) {
    readinessIssues.push(
      `CrawlScout affected rows increased from ${JSON_TO_CSV_CRAWLSCOUT_BASELINE} to ${crawlScoutAffected}.`,
    );
  }

  const analyticsGeneratedAt = analytics?.generatedAt ?? analytics?.summary?.generatedAt ?? '';
  const analyticsFresh = timestamp(analyticsGeneratedAt) >= launchTime;

  return {
    analytics: {
      convertActions: analyticsFresh ? actionCount(analytics, 'Convert JSON') : 0,
      downloadActions: analyticsFresh ? actionCount(analytics, 'Download CSV') : 0,
      generatedAt: analyticsGeneratedAt,
      pageViews: analyticsFresh ? finiteNumber(analytics?.summary?.selectedToolAudience?.pageViews) : 0,
      source: analyticsFresh ? 'production aggregate' : 'not enough data',
    },
    crawlScout: {
      affected: crawlScoutAffected >= 0 ? crawlScoutAffected : null,
      baseline: JSON_TO_CSV_CRAWLSCOUT_BASELINE,
      fresh: crawlScoutFresh,
      gatePassed: crawlScoutGatePassed,
      generatedAt: crawlScoutGeneratedAt,
      regression: crawlScoutRegression,
    },
    generatedAt: now.toISOString(),
    inspections,
    launchAt: JSON_TO_CSV_LAUNCH_AT,
    measurementWindows: {
      day28Reached: currentTime >= timestamp(JSON_TO_CSV_DAY_28_REVIEW_AT),
      day28ReviewAt: JSON_TO_CSV_DAY_28_REVIEW_AT,
      day56Reached: currentTime >= timestamp(JSON_TO_CSV_DAY_56_REVIEW_AT),
      day56ReviewAt: JSON_TO_CSV_DAY_56_REVIEW_AT,
    },
    nextReleaseAt: JSON_TO_CSV_NEXT_RELEASE_AT,
    nextReleaseReady,
    readinessIssues,
    search: Object.fromEntries(
      JSON_TO_CSV_PILOT_URLS.map((url) => [url, pageSearchEvidence(performance, url)]),
    ),
    sitemap: {
      checked: finiteNumber(productionSitemap?.checked),
      fresh: sitemapFresh,
      gatePassed: sitemapHealthy,
      generatedAt: sitemapGeneratedAt,
      hardFailures: sitemapHardFailures >= 0 ? sitemapHardFailures : null,
    },
    status: nextReleaseReady
      ? 'eligible-for-next-release-review'
      : releaseWaitPassed
        ? 'blocked-by-evidence'
        : 'collecting',
    summary: {
      discoveredCount,
      discoveryGatePassed,
      indexedCount,
      targetUrlCount: JSON_TO_CSV_PILOT_URLS.length,
    },
  };
}

export function renderNewToolGrowthPilotReport(report) {
  const inspectionLines = report.inspections.map((inspection) => {
    const coverage = inspection.coverageState || inspection.status;
    return `- ${inspection.inspectionUrl}: ${coverage}; discovered ${inspection.discovered ? 'yes' : 'no'}; indexed ${inspection.indexed ? 'yes' : 'no'}`;
  });
  const issueLines = report.readinessIssues.length
    ? report.readinessIssues.map((issue) => `- ${issue}`)
    : ['- None'];

  return `# New Tool Growth Pilot Status

Generated: ${report.generatedAt}
Status: ${report.status}
Next release ready: ${report.nextReleaseReady ? 'yes' : 'no'}

## JSON To CSV Release

- Launched: ${report.launchAt}
- Earliest next release review: ${report.nextReleaseAt}
- Discovered URLs: ${report.summary.discoveredCount} of ${report.summary.targetUrlCount}
- Indexed URLs: ${report.summary.indexedCount} of ${report.summary.targetUrlCount}
${inspectionLines.join('\n')}

## Safety Gates

- Production sitemap: ${report.sitemap.gatePassed ? 'pass' : 'not proven'}; ${report.sitemap.checked} URLs checked; ${report.sitemap.hardFailures ?? 'not enough data'} hard failures
- CrawlScout: ${report.crawlScout.gatePassed ? 'pass' : 'not proven'}; baseline ${report.crawlScout.baseline}; latest ${report.crawlScout.affected ?? 'not enough data'}

## Early Measurement

- Analytics source: ${report.analytics.source}
- Page views: ${report.analytics.pageViews}
- Convert actions: ${report.analytics.convertActions}
- Download actions: ${report.analytics.downloadActions}
- Day 28 review: ${report.measurementWindows.day28ReviewAt}
- Day 56 review: ${report.measurementWindows.day56ReviewAt}

## Missing Evidence Or Blocks

${issueLines.join('\n')}
`;
}
