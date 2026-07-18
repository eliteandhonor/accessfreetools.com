export const MAX_TARGETED_KEYWORDS = 15;
export const MAX_TARGETED_COST_USD = 0.5;

export function normalizeTargetedKeywords(values, maxKeywords = MAX_TARGETED_KEYWORDS) {
  const seen = new Set();
  const normalized = [];

  for (const value of values) {
    const keyword = String(value ?? '').trim().replace(/\s+/g, ' ');
    const key = keyword.toLowerCase();
    if (!keyword || seen.has(key)) continue;
    seen.add(key);
    normalized.push(keyword);
  }

  if (normalized.length > maxKeywords) {
    throw new Error(`Targeted research is limited to ${maxKeywords} unique keywords.`);
  }
  return normalized;
}

export function estimateTargetedSerpCost(keywordCount, depth = 10) {
  return Number((Number(keywordCount || 0) * 0.002 * Math.ceil(Number(depth || 10) / 10)).toFixed(4));
}

export function safeResearchLabel(value) {
  const label = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!label) throw new Error('A non-empty --label value is required.');
  return label;
}

function organicItems(task) {
  return (task.result?.[0]?.items ?? [])
    .filter((item) => item.type === 'organic')
    .map((item) => ({
      description: item.description ?? '',
      domain: item.domain ?? '',
      rank: item.rank_group ?? item.rank_absolute ?? null,
      title: item.title ?? '',
      url: item.url ?? '',
    }));
}

export function summarizeTargetedSerpTasks(tasks = []) {
  return tasks.map((task) => {
    const results = organicItems(task);
    const accessResult = results.find(
      (item) =>
        /(^|\.)accessfreetools\.com$/i.test(item.domain) ||
        /^https:\/\/accessfreetools\.com\//i.test(item.url),
    );
    return {
      accessFreeToolsRank: accessResult?.rank ?? null,
      costUsd: Number(task.cost ?? 0),
      keyword: task.data?.keyword ?? '',
      statusCode: task.status_code ?? null,
      statusMessage: task.status_message ?? '',
      topResults: results.slice(0, 10),
    };
  });
}

export function summarizeIntentItems(tasks = []) {
  const items = tasks.flatMap((task) => task.result?.flatMap((result) => result.items ?? []) ?? []);
  return Object.fromEntries(
    items.map((item) => [
      String(item.keyword ?? '').toLowerCase(),
      {
        intent: item.keyword_intent?.label ?? null,
        probability: item.keyword_intent?.probability ?? null,
        secondaryIntents: item.secondary_keyword_intents ?? [],
      },
    ]),
  );
}
