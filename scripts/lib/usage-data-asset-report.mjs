import { getAnalyticsCoverage } from './production-analytics-report.mjs';

const DEFAULT_MAX_REPORT_AGE_MS = 8 * 24 * 60 * 60 * 1000;

function nonNegativeInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : 0;
}

function normalizeRows(rows, limit = 10) {
  if (!Array.isArray(rows)) return [];

  return rows
    .filter((row) => row && typeof row === 'object' && Number(row.count) > 0)
    .map((row) => ({
      count: nonNegativeInteger(row.count),
      label: typeof row.label === 'string' ? row.label.trim() : '',
      path: typeof row.path === 'string' ? row.path.trim() : '',
      ...(typeof row.slug === 'string' && row.slug ? { slug: row.slug } : {}),
    }))
    .filter((row) => row.label)
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
    .slice(0, limit);
}

function validGeneratedAt(value) {
  if (typeof value !== 'string' || !value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function createUsageDataAssetReport({
  maxReportAgeMs = DEFAULT_MAX_REPORT_AGE_MS,
  now = new Date(),
  productionReport = null,
  productionReportPath = 'output/analytics/production-latest.json',
  requestedDays = 30,
} = {}) {
  const readinessIssues = [];
  const summary = productionReport?.summary && typeof productionReport.summary === 'object'
    ? productionReport.summary
    : null;
  const range = summary?.range && typeof summary.range === 'object' ? summary.range : null;
  const coverage = getAnalyticsCoverage(summary);
  const reportDays = Number(productionReport?.days);
  const generatedAtTimestamp = validGeneratedAt(productionReport?.generatedAt);
  const ownerExclusionConfigured = summary?.ownerExclusionConfigured === true;
  if (coverage.status !== 'complete' || coverage.deploymentContinuity !== 'verified' || coverage.comparisonsAllowed !== true) {
    readinessIssues.push(`not enough data: analytics interval coverage and durable deployment continuity are unverified (${(coverage.reasons ?? []).join(', ') || 'unknown coverage'}). Retained observations are not full-period totals.`);
  }

  if (!productionReport) {
    readinessIssues.push('not enough data: production analytics aggregate is missing. Run npm run analytics:production.');
  } else {
    if (!generatedAtTimestamp) {
      readinessIssues.push('not enough data: production analytics aggregate has no valid generated date. Refresh it with npm run analytics:production.');
    } else {
      const ageMs = now.getTime() - generatedAtTimestamp;
      if (ageMs < -60 * 60 * 1000 || ageMs > maxReportAgeMs) {
        readinessIssues.push('not enough data: production analytics aggregate is stale. Refresh it with npm run analytics:production.');
      }
    }

    if (!Number.isInteger(reportDays) || reportDays !== requestedDays) {
      readinessIssues.push(`not enough data: production analytics aggregate must request exactly ${requestedDays} days. Run npm run analytics:production -- --days=${requestedDays}; the request alone does not prove coverage.`);
    }
    if (!range) {
      readinessIssues.push('not enough data: production analytics aggregate lacks requested-range totals. Refresh it after the current analytics release is deployed.');
    }
    if (!ownerExclusionConfigured) {
      readinessIssues.push('Owner exclusion is not confirmed by the production analytics aggregate.');
    }
  }

  const totals = {
    events: nonNegativeInteger(range?.events),
    visitors: nonNegativeInteger(range?.visitors),
    returningVisitors: nonNegativeInteger(range?.returningVisitors),
    pageViews: nonNegativeInteger(range?.pageViews),
    toolActions: nonNegativeInteger(range?.toolActions),
  };

  if (range) {
    if (totals.visitors < 25) readinessIssues.push(`Only ${totals.visitors} unique production visitors in range; wait for at least 25.`);
    if (totals.pageViews < 100) readinessIssues.push(`Only ${totals.pageViews} production page views in range; wait for at least 100.`);
    if (totals.toolActions < 25) readinessIssues.push(`Only ${totals.toolActions} production tool actions in range; wait for at least 25.`);
  }

  const topPages = normalizeRows(summary?.topPages);
  const topReferrers = normalizeRows(summary?.topReferrers);
  const topTools = normalizeRows(summary?.topTools);
  const dominantPage = topPages[0];
  if (totals.pageViews >= 100 && dominantPage && dominantPage.count / totals.pageViews > 0.9) {
    readinessIssues.push('Production page views are unusually concentrated on one page; review bot filtering before drafting public claims.');
  }

  return {
    generatedAt: now.toISOString(),
    days: requestedDays,
    coverage,
    analyticsReportPath: productionReportPath.replace(/\\/g, '/'),
    analyticsSource: typeof productionReport?.source === 'string' ? productionReport.source : null,
    productionReportGeneratedAt: typeof productionReport?.generatedAt === 'string' ? productionReport.generatedAt : null,
    ownerExclusionConfigured,
    status: readinessIssues.length ? 'not-ready' : 'ready-for-editorial-draft',
    readinessIssues,
    totals,
    topTools,
    topPages,
    topReferrers,
  };
}

export function renderUsageDataAssetDraft(report) {
  const lines = [
    '# Access Free Tools Usage Notes Draft',
    '',
    `Generated: ${report.generatedAt}`,
    `Requested window: last ${report.days} days (not proof of a fully observed interval)`,
    `Observed event dates: ${report.coverage?.observedStart ?? 'unknown'} to ${report.coverage?.observedEnd ?? 'unknown'}; gaps between these dates are not ruled out.`,
    `Coverage: ${report.coverage?.status ?? 'unknown'}; reasons: ${(report.coverage?.reasons ?? ['coverage-metadata-missing']).join(', ')}`,
    `Status: ${report.status}`,
    '',
    '## Privacy Guardrail',
    '',
    'This draft uses a privacy-safe production aggregate only. Do not publish raw visitor hashes, IP addresses, exact event logs, or anything that could identify a person. Owner traffic must be excluded before publishing.',
    '',
    '## Readiness',
    '',
    ...(report.readinessIssues.length ? report.readinessIssues.map((issue) => `- ${issue}`) : ['- Ready for a human-edited public usage notes article.']),
    '',
    '## Observed Snapshot',
    '',
    `- Visitors: ${report.totals.visitors}`,
    `- Returning visitors: ${report.totals.returningVisitors}`,
    `- Page views: ${report.totals.pageViews}`,
    `- Tool actions: ${report.totals.toolActions}`,
    '',
    '## Most Used Tools',
    '',
    ...(report.topTools.length
      ? report.topTools.map((item, index) => `${index + 1}. ${item.label} (${item.count} uses) - ${item.path}`)
      : ['No tool-use actions in the retained observations; this does not prove zero usage.']),
    '',
    '## Most Viewed Pages',
    '',
    ...(report.topPages.length
      ? report.topPages.map((item, index) => `${index + 1}. ${item.label} (${item.count} views) - ${item.path}`)
      : ['No page views in the retained observations; this does not prove zero visits.']),
    '',
    '## Editorial Angles',
    '',
    '- Which tools are people actually using first?',
    '- Which guide should explain mistakes better because the matching tool gets repeated use?',
    '- Which hub should link more clearly to a tool people keep finding?',
    '- Which social platform sent useful visitors, if any?',
    '',
  ];

  return `${lines.join('\n')}\n`;
}
