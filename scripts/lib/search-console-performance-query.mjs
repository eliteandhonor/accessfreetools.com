export const DEFAULT_PERFORMANCE_ROW_LIMIT = 1000;
export const MAX_PERFORMANCE_ROW_LIMIT = 25000;

export function parsePerformanceRowLimit(value, fallback = DEFAULT_PERFORMANCE_ROW_LIMIT) {
  if (value === undefined || value === null || value === '') return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_PERFORMANCE_ROW_LIMIT) {
    throw new Error(`Search Console row limit must be an integer from 1 to ${MAX_PERFORMANCE_ROW_LIMIT}.`);
  }

  return parsed;
}

export function normalizePerformancePage(value, targetDomain = 'accessfreetools.com') {
  if (!value) return '';

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('Search Console performance page must be an absolute HTTPS URL.');
  }

  if (url.protocol !== 'https:' || url.hostname !== targetDomain) {
    throw new Error(`Search Console performance page must use https://${targetDomain}/.`);
  }

  url.search = '';
  url.hash = '';
  return url.toString();
}

export function performancePageFilterGroups(page) {
  if (!page) return undefined;

  return [
    {
      groupType: 'and',
      filters: [
        {
          dimension: 'page',
          operator: 'equals',
          expression: page,
        },
      ],
    },
  ];
}
