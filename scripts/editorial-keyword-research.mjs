import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  dataForSeoRequest,
  getDataForSeoUserData,
  summarizeDataForSeoUserData,
} from './lib/dataforseo.mjs';

const args = process.argv.slice(2);

function option(name, fallback = '') {
  return args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? fallback;
}

const slug = option('--slug');
const seed = option('--seed');
const requestedLimit = Number(option('--limit', '15'));
const limit = Math.min(15, Math.max(1, Number.isFinite(requestedLimit) ? requestedLimit : 15));

if (!slug || !seed) {
  throw new Error('Usage: node scripts/editorial-keyword-research.mjs --slug=<slug> --seed=<keyword> [--limit=15]');
}

const accountBefore = summarizeDataForSeoUserData(await getDataForSeoUserData());
if (accountBefore.balance <= 2) {
  throw new Error(`DataForSEO balance is ${accountBefore.balance.toFixed(2)} USD. Research stops at or below 2 USD.`);
}

const response = await dataForSeoRequest('/dataforseo_labs/google/related_keywords/live', {
  keyword: seed,
  location_name: 'United States',
  language_code: 'en',
  depth: 1,
  limit,
  order_by: ['keyword_data.keyword_info.search_volume,desc'],
});
const task = response.tasks?.[0] ?? {};
const items = task.result?.flatMap((result) => result.items ?? []) ?? [];
const normalized = items.slice(0, limit).map((item) => ({
  keyword: item.keyword_data?.keyword ?? '',
  searchVolume: item.keyword_data?.keyword_info?.search_volume ?? null,
  competition: item.keyword_data?.keyword_info?.competition ?? null,
  competitionLevel: item.keyword_data?.keyword_info?.competition_level ?? null,
  cpc: item.keyword_data?.keyword_info?.cpc ?? null,
  intent: item.keyword_data?.search_intent_info?.main_intent ?? null,
}));
const costUsd = Number(task.cost ?? 0);
if (costUsd > 1) throw new Error(`DataForSEO reported a ${costUsd.toFixed(4)} USD request cost, above the 1 USD cap.`);

const accountAfter = summarizeDataForSeoUserData(await getDataForSeoUserData());
const report = {
  generatedAt: new Date().toISOString(),
  kind: 'editorial-keyword-research',
  status: 'pass',
  slug,
  seed,
  variantLimit: limit,
  variantsReturned: normalized.length,
  costUsd,
  accountBefore: accountBefore.balance,
  accountAfter: accountAfter.balance,
  keywords: normalized,
  rawResponse: response,
};
const outputDir = resolve('output', 'seo-agents', slug, 'editorial', 'evidence');
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, 'dataforseo-paid.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(resolve(outputDir, 'dataforseo-paid.md'), [
  `# DataForSEO paid evidence: ${slug}`,
  '',
  `Status: ${report.status}`,
  `Seed: ${seed}`,
  `Variants: ${normalized.length}/${limit}`,
  `Reported request cost: ${costUsd.toFixed(4)} USD`,
  `Balance before: ${accountBefore.balance.toFixed(2)} USD`,
  `Balance after: ${accountAfter.balance.toFixed(2)} USD`,
  '',
  '## Keyword evidence',
  '',
  ...(normalized.length
    ? normalized.map((item) => `- ${item.keyword}: volume ${item.searchVolume ?? 'not enough data'}, intent ${item.intent ?? 'not enough data'}`)
    : ['- No related keyword rows returned. Keep the approved plain-language title and intent.']),
].join('\n'));

console.log(`Editorial keyword research saved for ${slug}`);
console.log(`- Variants: ${normalized.length}/${limit}`);
console.log(`- Reported cost: ${costUsd.toFixed(4)} USD`);
console.log(`- Output: ${outputDir}`);
