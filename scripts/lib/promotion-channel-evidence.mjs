import { activePromotionChannels } from './promotion-channel-policy.mjs';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
export const PINTEREST_PROOF_SCRIPT = 'promotion:pinterest:proof-scan';

function freshness(value, now) {
  const time = typeof value === 'string' ? Date.parse(value) : NaN;
  if (!Number.isFinite(time) || time > now) return 'missing';
  return now - time > WEEK_MS ? 'stale' : 'fresh';
}

export function summarizePinterestProofEvidence(report) {
  const generatedAt = typeof report?.generatedAt === 'string' && Number.isFinite(Date.parse(report.generatedAt))
    ? report.generatedAt : null;
  const keys = ['boardsExpected', 'boardsFetched', 'publicPinsScanned', 'uniqueAppPinsDiscovered', 'skipped', 'hardIssues'];
  const counts = Object.fromEntries(keys.map((key) => [key,
    Number.isSafeInteger(report?.counts?.[key]) && report.counts[key] >= 0 ? report.counts[key] : null]));
  counts.missingDestinations = Array.isArray(report?.skipped)
    ? report.skipped.filter((row) => row?.reason === 'missing').length : null;
  counts.invalidDestinations = Array.isArray(report?.skipped)
    ? report.skipped.filter((row) => row?.reason === 'invalid').length : null;
  counts.boardsCompleted = Array.isArray(report?.boards)
    ? report.boards.filter((board) => board?.paginationComplete === true && board.nextBookmark === '-end-').length : null;
  const result = (status, reason) => ({ status, generatedAt, counts, reason });
  if (!generatedAt || report?.mode !== 'dry-run' || Object.values(counts).some((count) => count === null) ||
      !Array.isArray(report?.boards) || report.boards.length !== counts.boardsFetched ||
      !Array.isArray(report?.hardIssues) || report.hardIssues.length !== counts.hardIssues ||
      report.skipped.length !== counts.skipped || counts.skipped > counts.publicPinsScanned ||
      !Array.isArray(report?.alreadyCovered) || !Array.isArray(report?.importable) ||
      report.alreadyCovered.length + report.importable.length !== counts.uniqueAppPinsDiscovered ||
      counts.uniqueAppPinsDiscovered > counts.publicPinsScanned) {
    return result('missing', 'The read-only Pinterest scan report is missing or inconsistent.');
  }
  if (counts.hardIssues > 0 || counts.invalidDestinations > 0) {
    return result('failed', 'The Pinterest scan reported fetch, mapping, or invalid-destination issues.');
  }
  if (counts.boardsExpected === 0 || counts.boardsFetched !== counts.boardsExpected ||
      counts.boardsCompleted !== counts.boardsExpected ||
      counts.publicPinsScanned === 0 || counts.uniqueAppPinsDiscovered === 0 || counts.missingDestinations > 0) {
    return result('missing', 'Pinterest destination coverage is incomplete; this does not prove the live Pins are broken.');
  }
  return result('passed', 'The public scan supplied app destinations; individual publication proof remains separate.');
}

function pinterestExecutionEvidence(result, time) {
  const evidence = result.evidence;
  const state = freshness(evidence?.generatedAt, time);
  if (state === 'stale') return { status: 'stale', reason: 'The underlying Pinterest scan is more than seven days old.' };
  if (state === 'missing' || !['passed', 'missing', 'failed'].includes(evidence?.status) ||
      freshness(result.startedAt, time) === 'missing' ||
      Date.parse(evidence.generatedAt) < Date.parse(result.startedAt) ||
      Date.parse(evidence.generatedAt) > Date.parse(result.completedAt)) {
    return { status: 'missing', reason: 'No Pinterest scan evidence was generated during this command execution.' };
  }
  // Do not let a regenerated wrapper or contradictory summary certify incomplete data.
  const counts = evidence.counts;
  if (evidence.status === 'passed' && (!counts ||
      !['boardsExpected', 'boardsFetched', 'boardsCompleted', 'publicPinsScanned', 'uniqueAppPinsDiscovered', 'skipped', 'hardIssues', 'missingDestinations', 'invalidDestinations']
        .every((key) => Number.isSafeInteger(counts[key]) && counts[key] >= 0) ||
      counts.boardsExpected === 0 || counts.boardsFetched !== counts.boardsExpected ||
      counts.boardsCompleted !== counts.boardsExpected ||
      counts.publicPinsScanned === 0 || counts.uniqueAppPinsDiscovered === 0 ||
      counts.uniqueAppPinsDiscovered > counts.publicPinsScanned || counts.skipped > counts.publicPinsScanned ||
      counts.hardIssues > 0 || counts.missingDestinations > 0 || counts.invalidDestinations > 0)) {
    return { status: 'missing', reason: 'Pinterest summary counts do not support its claimed pass.' };
  }
  return { status: evidence.status, reason: evidence.status === 'passed'
    ? 'Fresh scan supplied app destinations; this is not publication approval.'
    : evidence.status === 'failed' ? 'The scan reported issues. Inspect its report before public work.'
      : 'The scan did not supply complete destination proof. Do not infer broken live Pins.' };
}

export function summarizePromotionChannels(report, { now = new Date() } = {}) {
  const time = now instanceof Date ? now.getTime() : NaN;
  const reportFreshness = freshness(report?.generatedAt, time);
  return activePromotionChannels.map((channel) => {
    const checks = channel.reviewScripts.map((script) => {
      const matches = Array.isArray(report?.results)
        ? report.results.filter((result) => result?.channelId === channel.id && result.script === script) : [];
      const result = matches.length === 1 ? matches[0] : null;
      const completedAt = result?.completedAt ?? null;
      const observation = freshness(completedAt, time);
      let status = 'missing';
      let reason = 'No single dated execution result. Rerun the four-channel review.';
      if (Number.isFinite(time) && report && !report.parseError && report.dryRun === false && result &&
          reportFreshness !== 'missing' && observation !== 'missing' &&
          Date.parse(completedAt) <= Date.parse(report.generatedAt)) {
        if (reportFreshness === 'stale' || observation === 'stale') {
          status = 'stale';
          reason = 'Execution evidence is more than seven days old.';
        } else if (result.passed === false && Number.isInteger(result.status) && result.status !== 0) {
          status = 'failed';
          reason = 'The command failed. Inspect its local report before public work.';
        } else if (result.passed === true && result.status === 0) {
          status = 'passed';
          reason = 'Command passed; this is not publication or human review approval.';
          if (script === PINTEREST_PROOF_SCRIPT) ({ status, reason } = pinterestExecutionEvidence(result, time));
        }
      }
      return { script, status, completedAt, reason };
    });
    const status = ['failed', 'missing', 'stale'].find((state) => checks.some((check) => check.status === state)) ?? 'passed';
    return {
      channelId: channel.id, label: channel.label, status, generatedAt: report?.generatedAt ?? null,
      total: checks.length, passed: checks.filter((check) => check.status === 'passed').length,
      failed: checks.filter((check) => check.status === 'failed').length,
      missing: checks.filter((check) => check.status === 'missing').length,
      stale: checks.filter((check) => check.status === 'stale').length,
      issues: checks.filter((check) => check.status !== 'passed').map((check) => `${check.script}: ${check.reason}`), checks,
    };
  });
}

export function allPromotionChannelsPassed(channels) {
  return Array.isArray(channels) && channels.length === activePromotionChannels.length &&
    activePromotionChannels.every((channel) => {
      const matches = channels.filter((item) => item.channelId === channel.id);
      return matches.length === 1 && matches[0].status === 'passed' && matches[0].total === channel.reviewScripts.length;
    });
}
