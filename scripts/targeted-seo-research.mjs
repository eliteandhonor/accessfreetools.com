import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import {
  dataForSeoRequest,
  getDataForSeoUserData,
  summarizeDataForSeoUserData,
} from './lib/dataforseo.mjs';
import {
  estimateTargetedSerpCost,
  MAX_TARGETED_COST_USD,
  normalizeTargetedKeywords,
  safeResearchLabel,
  summarizeIntentItems,
  summarizeTargetedSerpTasks,
} from './lib/targeted-seo-research.mjs';

const args = process.argv.slice(2);

function options(name) {
  const prefix = `${name}=`;
  return args.filter((arg) => arg.startsWith(prefix)).map((arg) => arg.slice(prefix.length));
}

function option(name, fallback = '') {
  return options(name)[0] ?? fallback;
}

function markdownCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

async function mapConcurrent(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => worker()));
  return results;
}

const label = safeResearchLabel(option('--label'));
const keywords = normalizeTargetedKeywords(options('--keyword'));
const depth = 10;
const requestedCap = Number(option('--max-cost', String(MAX_TARGETED_COST_USD)));
const maxCostUsd = Math.min(
  MAX_TARGETED_COST_USD,
  Number.isFinite(requestedCap) && requestedCap > 0 ? requestedCap : MAX_TARGETED_COST_USD,
);
const estimatedSerpCostUsd = estimateTargetedSerpCost(keywords.length, depth);

if (!keywords.length) {
  throw new Error('Provide 1 to 15 --keyword=<phrase> values.');
}
if (estimatedSerpCostUsd > maxCostUsd) {
  throw new Error(
    `Estimated SERP cost ${estimatedSerpCostUsd.toFixed(4)} USD exceeds the ${maxCostUsd.toFixed(4)} USD cap.`,
  );
}

const accountBefore = summarizeDataForSeoUserData(await getDataForSeoUserData());
if (accountBefore.balance <= 2) {
  throw new Error(`DataForSEO balance is ${accountBefore.balance.toFixed(2)} USD. Research stops at or below 2 USD.`);
}

const generatedAt = new Date().toISOString();
const tagStamp = generatedAt.replace(/[:.]/g, '-');
const intentResponse = await dataForSeoRequest('/dataforseo_labs/google/search_intent/live', {
  keywords,
  language_code: 'en',
  tag: `aft-targeted-intent-${label}-${tagStamp}`,
});
const serpResponses = await mapConcurrent(keywords, 3, (keyword, index) =>
  dataForSeoRequest('/serp/google/organic/live/advanced', {
    depth,
    device: 'desktop',
    find_targets_in: ['organic'],
    keyword,
    language_code: 'en',
    location_name: 'United States',
    os: 'windows',
    stop_crawl_on_match: [{ match_type: 'domain', match_value: 'accessfreetools.com' }],
    tag: `aft-targeted-serp-${label}-${tagStamp}-${index + 1}`,
    target_search_mode: 'any',
  }),
);
const intents = summarizeIntentItems(intentResponse.tasks ?? []);
const serpTasks = serpResponses.flatMap((response) => response.tasks ?? []);
const rows = summarizeTargetedSerpTasks(serpTasks).map((row) => ({
  ...row,
  intent: intents[row.keyword.toLowerCase()]?.intent ?? null,
  intentProbability: intents[row.keyword.toLowerCase()]?.probability ?? null,
  secondaryIntents: intents[row.keyword.toLowerCase()]?.secondaryIntents ?? [],
}));
const actualCostUsd = Number(
  (
    [...(intentResponse.tasks ?? []), ...serpTasks].reduce(
      (total, task) => total + Number(task.cost ?? 0),
      0,
    )
  ).toFixed(4),
);
const accountAfter = summarizeDataForSeoUserData(await getDataForSeoUserData());
const report = {
  actualCostUsd,
  accountAfterUsd: accountAfter.balance,
  accountBeforeUsd: accountBefore.balance,
  estimatedSerpCostUsd,
  generatedAt,
  kind: 'targeted-seo-intent-serp-research',
  label,
  limits: {
    depth,
    maxCostUsd,
    maxKeywords: 15,
  },
  rows,
  status: actualCostUsd <= maxCostUsd && rows.length === keywords.length ? 'pass' : 'attention',
};
const outputDir = resolve('output', 'seo-research', label);
const jsonPath = resolve(outputDir, 'latest.json');
const markdownPath = resolve(outputDir, 'latest.md');
mkdirSync(dirname(jsonPath), { recursive: true });
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  markdownPath,
  [
    `# Targeted SEO Research: ${label}`,
    '',
    `Generated: ${generatedAt}`,
    '',
    `Status: ${report.status}`,
    `Keywords: ${rows.length}/${keywords.length}`,
    `Estimated SERP cost: ${estimatedSerpCostUsd.toFixed(4)} USD`,
    `Actual reported cost: ${actualCostUsd.toFixed(4)} USD`,
    `Balance before/after: ${accountBefore.balance.toFixed(2)} / ${accountAfter.balance.toFixed(2)} USD`,
    '',
    '| Keyword | Intent | Probability | Access Free Tools rank | Top result |',
    '| --- | --- | ---: | ---: | --- |',
    ...rows.map(
      (row) =>
        `| ${markdownCell(row.keyword)} | ${markdownCell(row.intent ?? 'not enough data')} | ${markdownCell(row.intentProbability ?? '')} | ${markdownCell(row.accessFreeToolsRank ?? 'not found in top 10')} | ${markdownCell(row.topResults[0]?.title ?? 'none')} |`,
    ),
    '',
    '- This is targeted intent and top-10 SERP evidence, not permission to rewrite a page.',
    '- Open a page-level SEO workbench only when the results show a concrete intent or format gap.',
  ].join('\n'),
);

console.log(`Targeted SEO research: ${report.status}`);
console.log(`Keywords: ${rows.length}/${keywords.length}`);
console.log(`Reported cost: ${actualCostUsd.toFixed(4)} USD`);
console.log(`Saved ${jsonPath}`);
console.log(`Saved ${markdownPath}`);
if (report.status !== 'pass') process.exitCode = 1;
