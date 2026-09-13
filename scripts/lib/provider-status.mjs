const DAY_MS = 86_400_000;
const FAILURE_MESSAGES = {
  'ip-restricted': 'Provider access is blocked by IP restrictions; check API Access settings.',
  authentication: 'Provider authentication failed; check local credential configuration.',
  'rate-limited': 'Provider request limit reached; retry after the limit resets.',
  billing: 'Provider explicitly reported insufficient funds; a balance top-up is required.',
  'invalid-response': 'Provider returned no valid account balance; balance is unavailable.',
  network: 'Provider network request failed; check connectivity and retry.',
  'access-restricted': 'Provider access is restricted; check the required API access.',
  service: 'Provider service is unavailable; retry later.',
  unknown: 'Provider check failed; inspect access and service configuration before retrying.',
};
const SAVED_STATUSES = new Map([
  ['ok', 'success'], ['healthy', 'success'], ['warning', 'success'], ['top-up-needed', 'success'], ['success', 'success'],
  ['error', 'failed'], ['blocked', 'failed'], ['failed', 'failed'],
  ['partial', 'partial'], ['degraded', 'partial'], ['ok-with-sandbox-warning', 'partial'],
  ['not-run', 'not-run'], ['unknown', 'unknown'],
]);

export function providerEvidenceAge(generatedAt, now = Date.now()) {
  const time = typeof generatedAt === 'string' && generatedAt ? Date.parse(generatedAt) : NaN;
  if (!Number.isFinite(time)) return { freshness: 'undated', ageDays: null };
  if (time > now) return { freshness: 'future', ageDays: null };
  return { freshness: now - time <= 7 * DAY_MS ? 'fresh' : 'stale', ageDays: Math.floor((now - time) / DAY_MS) };
}

// Use fixed diagnostics, never provider response bodies or credential-bearing exception text.
export function providerFailure(error) {
  if (typeof error?.failureKind === 'string' && Object.hasOwn(FAILURE_MESSAGES, error.failureKind)) {
    return { failureKind: error.failureKind, message: FAILURE_MESSAGES[error.failureKind], needsTopUp: error.failureKind === 'billing' };
  }
  const issues = Array.isArray(error?.details?.statusIssues)
    ? error.details.statusIssues.filter((issue) => issue && typeof issue === 'object') : [];
  const message = [error?.message ?? String(error), ...issues.map((issue) => issue.message)].join(' ');
  const codes = issues.map((issue) => Number(issue.code));
  const http = Number(error?.status);
  let failureKind = 'unknown';
  if (/whitelist|allowlist|ip.restrict/i.test(message)) {
    failureKind = 'ip-restricted';
  } else if (http === 401 || codes.includes(40100) || /unauthori[sz]ed|credential|authentication|HTTP 401/i.test(message)) {
    failureKind = 'authentication';
  } else if (http === 429 || /daily.*limit|rate.limit|too many requests/i.test(message)) {
    failureKind = 'rate-limited';
  } else if (codes.some((code) => [40203, 40209].includes(code)) || /insufficient funds|balance (is )?too low/i.test(message)) {
    failureKind = 'billing';
  } else if (/invalid account response|no valid account balance/i.test(message)) {
    failureKind = 'invalid-response';
  } else if (/fetch|network|timeout|timed out|ENOTFOUND|ECONN|socket|DNS/i.test(message)) {
    failureKind = 'network';
  } else if (http === 403 || /access denied|subscription|restricted|blocked/i.test(message)) {
    failureKind = 'access-restricted';
  } else if (http >= 500) {
    failureKind = 'service';
  }
  return { failureKind, message: FAILURE_MESSAGES[failureKind], needsTopUp: failureKind === 'billing' };
}

export function publicAccount(account) {
  return typeof account?.balance === 'number' && Number.isFinite(account.balance)
    ? { balance: account.balance, currency: account.currency ?? 'USD' } : null;
}

export function accountObservation(report, source) {
  if (!report) return null;
  const saved = report.lastSuccess;
  const provider = report.dataForSeo;
  const account = publicAccount(saved ? saved.account : report.account ?? provider?.account ??
    (provider?.balance ? { balance: provider.balance.amount, currency: provider.balance.currency } : null));
  if (!account) return null;
  const generatedAt = saved ? saved.generatedAt ?? null :
    Object.hasOwn(report, 'accountObservedAt') ? report.accountObservedAt :
    provider && Object.hasOwn(provider, 'accountObservedAt') ? provider.accountObservedAt : report.generatedAt ?? null;
  return { status: 'cached', account, generatedAt, source: saved ? saved.source ?? source : source,
    ...providerEvidenceAge(generatedAt) };
}

export function savedProviderStatus(entries, now = Date.now()) {
  const observations = [];
  const attempts = [];
  const serviceAttempts = [];
  for (const { report, source } of entries) {
    if (!report || report.parseError) continue;
    const observation = accountObservation(report, source);
    if (observation) observations.push(observation);
    const provider = report.dataForSeo ?? report;
    const attempt = report.currentAttempt;
    const savedStatus = attempt?.status ?? provider.status;
    const status = savedStatus != null ? SAVED_STATUSES.get(savedStatus) ?? 'unknown' :
      provider.error === true ? 'failed' : observation && !report.lastSuccess ? 'success' : 'unknown';
    if (status === 'not-run' || provider.skipped) continue;
    const failure = status === 'failed' || status === 'partial' ? providerFailure({ ...provider, ...attempt }) : {};
    const destination = /dataforseo-status\.json$/.test(source) ? serviceAttempts : attempts;
    destination.push({ status, ...failure, generatedAt: attempt?.generatedAt ?? report.generatedAt ?? null, source });
  }
  // Invalid/future dates never outrank a dated actual observation. File mtime is not evidence.
  const rank = (entry) => {
    const time = Date.parse(entry.generatedAt);
    return Number.isFinite(time) && time <= now ? time : -Infinity;
  };
  observations.sort((a, b) => rank(b) - rank(a));
  attempts.sort((a, b) => rank(b) - rank(a) || Number(b.status === 'failed') - Number(a.status === 'failed'));
  serviceAttempts.sort((a, b) => rank(b) - rank(a));
  const observation = observations[0];
  const latestAttempt = attempts[0] ? { ...attempts[0], ...providerEvidenceAge(attempts[0].generatedAt, now) } : null;
  return { status: observation ? 'cached' : 'unavailable', source: observation?.source ?? null,
    generatedAt: observation?.generatedAt ?? null, ...providerEvidenceAge(observation?.generatedAt, now),
    balance: observation?.account.balance ?? null, currency: observation?.account.currency ?? 'USD',
    observedBalanceState: observation ? observation.account.balance <= 2 ? 'low' : observation.account.balance <= 10 ? 'warning' : 'ok' : 'unknown',
    topUp: false, warning: false, currentAttempt: { status: 'not-run' }, latestAttempt,
    latestServiceAttempt: serviceAttempts[0] ? { ...serviceAttempts[0], ...providerEvidenceAge(serviceAttempts[0].generatedAt, now) } : null,
    liveError: latestAttempt?.status === 'failed' ? latestAttempt.message : '' };
}

export function formatSavedProviderStatus(balance) {
  const age = balance.ageDays === null ? balance.freshness : `${balance.ageDays} days old`;
  const attempt = balance.latestAttempt;
  return `DataForSEO: ${balance.status}${balance.balance === null ? '' : ` ${balance.balance.toFixed(2)} ${balance.currency}`} (${age}); observed ${balance.generatedAt ?? 'undated'}; source ${balance.source ?? 'unavailable'}; current check: not run` +
    (attempt ? `; latest saved attempt: ${attempt.status}${attempt.failureKind ? ` (${attempt.failureKind})` : ''} at ${attempt.generatedAt ?? 'undated'} (${attempt.freshness}), source ${attempt.source}` : '; no saved attempt') +
    (balance.latestServiceAttempt ? `; saved service attempt: ${balance.latestServiceAttempt.status} at ${balance.latestServiceAttempt.generatedAt ?? 'undated'} (${balance.latestServiceAttempt.freshness}), source ${balance.latestServiceAttempt.source}` : '');
}
