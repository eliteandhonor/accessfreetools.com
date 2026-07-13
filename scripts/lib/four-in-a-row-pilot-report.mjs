export const FOUR_IN_A_ROW_LAUNCH_AT = '2026-07-13T00:00:00+10:00';
export const FOUR_IN_A_ROW_REVIEW_AT = '2026-09-07T00:00:00+10:00';
export const FOUR_IN_A_ROW_MINIMUM_STARTS = 100;

const GAME_SLUG = 'four-in-a-row-game';
const GAME_PATH = '/tools/four-in-a-row-game/';

function percentage(numerator, denominator) {
  return denominator > 0 ? Number(((numerator / denominator) * 100).toFixed(1)) : null;
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
    return eventTime >= launchTime && (event.toolSlug === GAME_SLUG || event.pagePath === GAME_PATH);
  });
  const actions = gameEvents.filter((event) => event.type === 'tool_action');
  const countAction = (action) => aggregate?.actions
    ? Number(aggregate.actions.find((entry) => entry.action === action)?.count ?? 0)
    : actions.filter((event) => event.action === action).length;
  const computerStarts = countAction('Start round: computer');
  const friendStarts = countAction('Start round: friend');
  const starts = computerStarts + friendStarts;
  const completions = countAction('Complete round');
  const replays = countAction('Replay round');
  const reviewWindowReached = now.getTime() >= reviewTime;
  const minimumSampleReached = starts >= FOUR_IN_A_ROW_MINIMUM_STARTS;
  const measurementReady = reviewWindowReached && minimumSampleReached && ownerExclusionConfigured;
  const readinessIssues = [];

  if (!reviewWindowReached) readinessIssues.push(`Keep collecting until ${FOUR_IN_A_ROW_REVIEW_AT}.`);
  if (!minimumSampleReached) readinessIssues.push(`Only ${starts} measured round starts; wait for at least ${FOUR_IN_A_ROW_MINIMUM_STARTS}.`);
  if (!ownerExclusionConfigured) readinessIssues.push('Owner IP or verified browser opt-out is not confirmed.');

  return {
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

## Usage

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
${search}

## Decision Gate

- Earliest review: ${report.reviewAt}
- Minimum measured starts: ${report.minimumSample}
- Owner/test exclusion must be confirmed.
- Do not add another game or a Games category until this report says decision ready.

## Missing Evidence

${issues}
`;
}
