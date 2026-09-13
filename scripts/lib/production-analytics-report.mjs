const PRIVATE_EVENT_FIELDS = new Set(['ipHash', 'sessionHash', 'visitorHash']);

function omitPrivateFields(value) {
  if (Array.isArray(value)) return value.map(omitPrivateFields);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== 'recentEvents' && !PRIVATE_EVENT_FIELDS.has(key))
      .map(([key, nestedValue]) => [key, omitPrivateFields(nestedValue)]),
  );
}

export function getAnalyticsCoverage(summary) {
  const validDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));
  const fallback = {
    status: 'unknown',
    retainedRead: 'unknown',
    reasons: ['coverage-metadata-missing', 'deployment-continuity-unverified'],
    requestedStart: validDate(summary?.rangeStart) ? summary.rangeStart : null,
    requestedEnd: validDate(summary?.generatedAt) ? summary.generatedAt : null,
    observedStart: null,
    observedEnd: null,
    rangeObservedStart: null,
    rangeObservedEnd: null,
    deploymentContinuity: 'unknown',
    comparisonsAllowed: false,
    allTimeScope: 'retained-events-only',
    visitorClassification: 'observed-history-only',
  };
  const coverage = omitPrivateFields(summary?.coverage);
  if (coverage == null) return fallback;

  const dateFields = ['requestedStart', 'requestedEnd', 'observedStart', 'observedEnd', 'rangeObservedStart', 'rangeObservedEnd'];
  const validShape = typeof coverage === 'object' && !Array.isArray(coverage) &&
    ['complete', 'partial', 'unknown'].includes(coverage.status) &&
    Array.isArray(coverage.reasons) && coverage.reasons.every((reason) => typeof reason === 'string' && reason.trim()) &&
    [undefined, 'complete', 'partial', 'unknown'].includes(coverage.retainedRead) &&
    [undefined, 'verified', 'unknown'].includes(coverage.deploymentContinuity) &&
    [undefined, true, false].includes(coverage.comparisonsAllowed);
  const datesValid = dateFields.every((key) => coverage[key] == null || validDate(coverage[key]));
  const claimsComplete = coverage.status === 'complete' || coverage.comparisonsAllowed === true;
  const completeDates = dateFields.every((key) => validDate(coverage[key])) &&
    Date.parse(coverage.requestedStart) <= Date.parse(coverage.rangeObservedStart) &&
    Date.parse(coverage.observedStart) <= Date.parse(coverage.rangeObservedStart) &&
    Date.parse(coverage.rangeObservedStart) <= Date.parse(coverage.rangeObservedEnd) &&
    Date.parse(coverage.rangeObservedEnd) <= Date.parse(coverage.requestedEnd) &&
    Date.parse(coverage.rangeObservedEnd) <= Date.parse(coverage.observedEnd);
  const contradictory = claimsComplete && (!validShape || !completeDates || coverage.status !== 'complete' ||
    coverage.retainedRead !== 'complete' || coverage.reasons.length > 0 ||
    (coverage.comparisonsAllowed === true && coverage.deploymentContinuity !== 'verified'));
  if (validShape && datesValid && !contradictory) return coverage;

  const reasons = Array.isArray(coverage.reasons) ? coverage.reasons.filter((reason) => typeof reason === 'string' && reason.trim())
    : typeof coverage.reasons === 'string' && coverage.reasons.trim() ? [coverage.reasons] : [];
  return {
    ...fallback,
    status: coverage.status === 'partial' || coverage.retainedRead === 'partial' ? 'partial' : 'unknown',
    retainedRead: coverage.retainedRead === 'partial' ? 'partial' : 'unknown',
    ...Object.fromEntries(dateFields.map((key) => [key, validDate(coverage[key]) ? coverage[key] : fallback[key]])),
    reasons: [...new Set([...reasons, contradictory ? 'coverage-metadata-contradictory' : 'coverage-metadata-invalid',
      'deployment-continuity-unverified'])],
  };
}

export function createProductionAnalyticsReport({ days, generatedAt, source, summary, toolSlug = '' }) {
  return {
    days,
    generatedAt,
    source,
    summary: { ...omitPrivateFields(summary), coverage: getAnalyticsCoverage(summary) },
    toolSlug: toolSlug || null,
  };
}
