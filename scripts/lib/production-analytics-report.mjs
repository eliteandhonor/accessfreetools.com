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

export function createProductionAnalyticsReport({ days, generatedAt, source, summary, toolSlug = '' }) {
  return {
    days,
    generatedAt,
    source,
    summary: omitPrivateFields(summary),
    toolSlug: toolSlug || null,
  };
}
