import { getAnalyticsCoverage } from './production-analytics-report.mjs';
import { inspectionEvidenceFreshness } from './search-console-inspection-reports.mjs';

export const FOUR_IN_A_ROW_LAUNCH_AT = '2026-07-13T00:00:00+10:00';
export const FOUR_IN_A_ROW_REVIEW_AT = '2026-09-07T00:00:00+10:00';
export const FOUR_IN_A_ROW_MINIMUM_STARTS = 100;

const GAME_SLUG = 'four-in-a-row-game';
const GAME_PATH = '/tools/four-in-a-row-game/';

function percentage(numerator, denominator) {
  return Number.isSafeInteger(numerator) && Number.isSafeInteger(denominator) &&
    numerator >= 0 && denominator > 0 && numerator <= denominator
    ? Number(((numerator / denominator) * 100).toFixed(1)) : null;
}

function milestoneCounts(entries, suffix) {
  const names = ['Start round: computer', 'Start round: friend', 'Complete round', 'Replay round'].map((name) => name + suffix);
  const rows = Array.isArray(entries) ? entries : [];
  const issues = Array.isArray(entries) ? [] : ['Game action counts are missing or malformed.'];
  const counts = names.map((name) => {
    const matches = rows.filter((entry) => entry?.action === name);
    if (matches.length > 1) { issues.push('Duplicate game action count rows.'); return null; }
    const value = matches.length ? matches[0].count : 0;
    if (!Number.isSafeInteger(value) || value < 0) { issues.push('Invalid game action count.'); return null; }
    return value;
  });
  const [computerStarts, friendStarts, completions, replays] = counts;
  const sum = computerStarts === null || friendStarts === null ? null : computerStarts + friendStarts;
  const starts = Number.isSafeInteger(sum) ? sum : null;
  if (starts === null) issues.push('Invalid total game start count.');
  if (starts !== null && completions !== null && completions > starts) issues.push('Completion count exceeds starts; the completion rate is invalid.');
  if (completions !== null && replays !== null && replays > completions) issues.push('Replay count exceeds completions; the replay rate is invalid.');
  return { present: rows.some((entry) => names.includes(entry?.action)), issues: [...new Set(issues)],
    computerStarts, friendStarts, starts, completions, replays };
}

function gameProductionSource(aggregate) {
  try {
    const url = new URL(aggregate.source);
    return url.origin === 'https://accessfreetools.com' && !url.username && !url.password && !url.hash &&
      url.pathname === '/api/analytics/events' && url.searchParams.getAll('tool').length === 1 &&
      url.searchParams.get('tool') === GAME_SLUG && aggregate.toolSlug === GAME_SLUG &&
      (!aggregate.audience?.slug || aggregate.audience.slug === GAME_SLUG) &&
      Array.isArray(aggregate.actions) && aggregate.actions.every((row) => !row?.slug || row.slug === GAME_SLUG);
  } catch { return false; }
}

export function isGameOwnerExclusionConfirmed(summary, browserProof, now = new Date()) {
  if (summary?.ownerExclusionConfigured === true) return true;
  return browserProof?.host === 'accessfreetools.com' && browserProof?.storageKey === 'access-free-tools-analytics-opt-out' &&
    browserProof?.value === 'true' && inspectionEvidenceFreshness(browserProof.verifiedAt,
      { now, notBefore: FOUR_IN_A_ROW_LAUNCH_AT }).status === 'fresh';
}

export function analyzeFourInARowPilot({
  aggregate = null,
  events = [],
  gscPage = null,
  now = new Date(),
  ownerExclusionConfigured = false,
} = {}) {
  const launchTime = new Date(FOUR_IN_A_ROW_LAUNCH_AT).getTime();
  const reviewTime = new Date(FOUR_IN_A_ROW_REVIEW_AT).getTime();
  const gameEvents = events.filter((event) => {
    const eventTime = new Date(event?.ts ?? 0).getTime();
    return eventTime >= launchTime && eventTime <= now.getTime() && (event.toolSlug === GAME_SLUG || event.pagePath === GAME_PATH);
  });
  const actions = gameEvents.filter((event) => event.type === 'tool_action');
  const eventCounts = [...new Set(actions.map((event) => event.action))]
    .map((action) => ({ action, count: actions.filter((event) => event.action === action).length }));
  const rows = aggregate ? aggregate.actions : eventCounts;
  const corrected = milestoneCounts(rows, ' (round-v2)');
  const legacy = milestoneCounts(rows, '');
  const counts = corrected.present ? corrected : legacy;
  const { computerStarts, friendStarts, starts, completions, replays } = counts;
  const eventDefinition = corrected.present ? 'round-v2' : legacy.present ? 'legacy' : 'missing';
  const reviewWindowReached = now.getTime() >= reviewTime;
  const minimumSampleReached = starts !== null && starts >= FOUR_IN_A_ROW_MINIMUM_STARTS;
  const coverage = getAnalyticsCoverage(aggregate);
  const coverageReady = coverage.status === 'complete' && coverage.deploymentContinuity === 'verified' && coverage.comparisonsAllowed === true;
  const observation = inspectionEvidenceFreshness(aggregate?.generatedAt, { now, notBefore: FOUR_IN_A_ROW_LAUNCH_AT });
  const windowFreshness = inspectionEvidenceFreshness(coverage.requestedEnd, { now, notBefore: FOUR_IN_A_ROW_LAUNCH_AT });
  const sourceValid = gameProductionSource(aggregate);
  const windowValid = typeof aggregate?.rangeStart === 'string' &&
    Date.parse(aggregate.rangeStart) === Date.parse(coverage.requestedStart) &&
    Date.parse(coverage.requestedStart) < Date.parse(coverage.requestedEnd) &&
    Date.parse(coverage.requestedEnd) <= Date.parse(aggregate?.generatedAt) && windowFreshness.status === 'fresh';
  const evidence = { status: observation.status, ageDays: observation.ageDays,
    generatedAt: typeof aggregate?.generatedAt === 'string' ? aggregate.generatedAt : null,
    requestedStart: coverage.requestedStart ?? null, requestedEnd: coverage.requestedEnd ?? null,
    source: sourceValid ? 'production-game-aggregate' : 'unverified', sourceValid, windowValid };
  const measurementReady = reviewWindowReached && minimumSampleReached && ownerExclusionConfigured && coverageReady &&
    observation.status === 'fresh' && sourceValid && windowValid && eventDefinition === 'round-v2' && counts.issues.length === 0;
  const readinessIssues = [];

  if (!reviewWindowReached) readinessIssues.push(`Keep collecting until ${FOUR_IN_A_ROW_REVIEW_AT}.`);
  if (!minimumSampleReached) readinessIssues.push(`Only ${starts ?? 'invalid'} measured round starts; wait for at least ${FOUR_IN_A_ROW_MINIMUM_STARTS}.`);
  if (!ownerExclusionConfigured) readinessIssues.push('Owner IP or verified browser opt-out is not confirmed.');
  if (!coverageReady) readinessIssues.push(`Analytics interval coverage is ${coverage.status}; retained observations do not prove full-period totals (${coverage.reasons.join(', ') || 'continuity unverified'}).`);
  if (eventDefinition !== 'round-v2') readinessIssues.push('Corrected round-v2 event definition is not present; legacy counts cannot satisfy the pilot gate.');
  if (observation.status !== 'fresh') readinessIssues.push(`Original production observation is ${observation.status}; fetchedAt and current report time do not refresh evidence.`);
  if (!sourceValid) readinessIssues.push('Production source or game target is missing or inconsistent.');
  if (!windowValid) readinessIssues.push('Measured window is missing, stale or inconsistent with the original observation.');
  readinessIssues.push(...counts.issues);

  return {
    coverage,
    evidence,
    eventDefinition,
    legacyUsage: { starts: legacy.starts, completions: legacy.completions, replays: legacy.replays },
    generatedAt: now.toISOString(),
    launchAt: FOUR_IN_A_ROW_LAUNCH_AT,
    measurementReady,
    minimumSample: FOUR_IN_A_ROW_MINIMUM_STARTS,
    readinessIssues,
    reviewAt: FOUR_IN_A_ROW_REVIEW_AT,
    source: aggregate ? 'production-aggregate' : events.length ? 'event-log' : 'not enough data',
    search: gscPage
      ? {
          clicks: Number(gscPage.clicks ?? 0),
          ctrPercent: Number(gscPage.ctrPercent ?? 0),
          impressions: Number(gscPage.impressions ?? 0),
          position: Number(gscPage.position ?? 0),
        }
      : { status: 'not enough data' },
    status: measurementReady ? 'ready-for-pilot-decision' : reviewWindowReached ? 'needs-more-evidence' : 'collecting',
    usage: {
      completionRatePercent: percentage(completions, starts),
      completions,
      computerStarts,
      friendStarts,
      pageViews: Number(aggregate?.audience?.pageViews ?? gameEvents.filter((event) => event.type === 'page_view' && event.pagePath === GAME_PATH).length),
      replayRatePercent: percentage(replays, completions),
      replays,
      sessions: Number(aggregate?.audience?.sessions ?? new Set(gameEvents.map((event) => event.sessionHash).filter(Boolean)).size),
      starts,
      visitors: Number(aggregate?.audience?.visitors ?? new Set(gameEvents.map((event) => event.visitorHash).filter(Boolean)).size),
    },
  };
}

export function renderFourInARowPilotReport(report) {
  const coverage = getAnalyticsCoverage(report);
  const search = report.search.status === 'not enough data'
    ? '- Search demand: not enough data'
    : `- Search: ${report.search.impressions} impressions, ${report.search.clicks} clicks, ${report.search.ctrPercent}% CTR, position ${report.search.position}`;
  const issues = report.readinessIssues.length
    ? report.readinessIssues.map((issue) => `- ${issue}`).join('\n')
    : '- None';

  return `# Four in a Row Pilot Evidence

Generated: ${report.generatedAt}
Status: ${report.status}
Decision ready: ${report.measurementReady ? 'yes' : 'no'}
Evidence source: ${report.source}
Event definition: ${report.eventDefinition ?? 'unknown'}
Original observation: ${report.evidence?.generatedAt ?? 'unknown'} (${report.evidence?.status ?? 'unknown'})
Production target verified: ${report.evidence?.sourceValid ? 'yes' : 'no'}

## Coverage

- Interval coverage: ${coverage.status}
- Reasons: ${coverage.reasons.join(', ') || 'none reported'}
- Requested: ${coverage.requestedStart ?? 'unknown'} to ${coverage.requestedEnd ?? 'unknown'}
- Observed: ${coverage.observedStart ?? 'unknown'} to ${coverage.observedEnd ?? 'unknown'}
- Observed in request: ${coverage.rangeObservedStart ?? 'unknown'} to ${coverage.rangeObservedEnd ?? 'unknown'}
- Deployment continuity: ${coverage.deploymentContinuity ?? 'unknown'}
- Comparisons: ${coverage.comparisonsAllowed === true ? 'supported by supplied coverage' : 'blocked'}

## Retained observations

- Page views: ${report.usage.pageViews}
- Round starts: ${report.usage.starts}
- Computer starts: ${report.usage.computerStarts}
- Friend starts: ${report.usage.friendStarts}
- Completed rounds: ${report.usage.completions}
- Completion rate: ${report.usage.completionRatePercent ?? 'not enough data'}${report.usage.completionRatePercent === null ? '' : '%'}
- Replays: ${report.usage.replays}
- Replay rate: ${report.usage.replayRatePercent ?? 'not enough data'}${report.usage.replayRatePercent === null ? '' : '%'}
- Visitors: ${report.usage.visitors}
- Sessions: ${report.usage.sessions}
- Legacy starts, excluded from corrected-count decisions: ${report.legacyUsage?.starts ?? 'unknown'}
${search}

## Decision Gate

- Earliest review: ${report.reviewAt}
- Minimum measured starts: ${report.minimumSample}
- Owner/test exclusion must be confirmed.
- Do not add another game or a Games category until this report says decision ready.
- Measurement readiness is not release permission. Review fresh Search Console and Clarity evidence separately.

## Missing Evidence

${issues}
`;
}
