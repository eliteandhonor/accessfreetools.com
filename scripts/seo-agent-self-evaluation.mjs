import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import {
  dataForSeoRequest,
  findDataForSeoService,
  getDataForSeoLabsStatus,
  getDataForSeoServiceStatus,
  getDataForSeoUserData,
  summarizeDataForSeoLabsStatus,
  summarizeDataForSeoServiceStatus,
  summarizeDataForSeoUserData,
} from './lib/dataforseo.mjs';

const TARGET_DOMAIN = 'accessfreetools.com';
const SITE_ORIGIN = `https://${TARGET_DOMAIN}`;
const LEGACY_REDIRECTS = new Map([
  [`${SITE_ORIGIN}/calculators`, `${SITE_ORIGIN}/categories/calculators/`],
  [`${SITE_ORIGIN}/calculators/`, `${SITE_ORIGIN}/categories/calculators/`],
  [`${SITE_ORIGIN}/deep-research`, `${SITE_ORIGIN}/categories/ai-tools/`],
  [`${SITE_ORIGIN}/deep-research/`, `${SITE_ORIGIN}/categories/ai-tools/`],
  [`${SITE_ORIGIN}/advanced-age-calculator`, `${SITE_ORIGIN}/tools/age-calculator/`],
  [`${SITE_ORIGIN}/advanced-age-calculator/`, `${SITE_ORIGIN}/tools/age-calculator/`],
  [
    `${SITE_ORIGIN}/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025`,
    `${SITE_ORIGIN}/tools/ad-revenue-calculator/`,
  ],
  [
    `${SITE_ORIGIN}/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025/`,
    `${SITE_ORIGIN}/tools/ad-revenue-calculator/`,
  ],
]);
const args = process.argv.slice(2);
const outputPath = resolve(
  args.find((arg) => arg.startsWith('--report='))?.slice('--report='.length) ??
    'output/seo-agent-self-evaluation.md',
);
const jsonPath = resolve(
  args.find((arg) => arg.startsWith('--json='))?.slice('--json='.length) ??
    'output/seo-agent-self-evaluation.json',
);
const minBalance = Number(args.find((arg) => arg.startsWith('--min-balance='))?.slice('--min-balance='.length) ?? 2);
const warnBalance = Number(args.find((arg) => arg.startsWith('--warn-balance='))?.slice('--warn-balance='.length) ?? 10);
const broadResearchStop = Number(
  args.find((arg) => arg.startsWith('--broad-research-stop='))?.slice('--broad-research-stop='.length) ?? 5,
);
const skipDataForSeo = args.includes('--skip-dataforseo');

function readJsonIfExists(path) {
  const resolved = resolve(path);
  return existsSync(resolved) ? JSON.parse(readFileSync(resolved, 'utf8')) : null;
}

function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function pct(value) {
  return `${((Number(value) || 0) * 100).toFixed(2)}%`;
}

function metricLine(row) {
  return `clicks ${Number(row.clicks ?? 0).toFixed(0)}, impressions ${Number(row.impressions ?? 0).toFixed(0)}, CTR ${pct(row.ctr)}, position ${Number(row.position ?? 0).toFixed(1)}`;
}

function expectedCtr(position) {
  if (position <= 1.5) return 0.22;
  if (position <= 3.5) return 0.10;
  if (position <= 5.5) return 0.06;
  if (position <= 10.5) return 0.025;
  return 0.01;
}

function rows(report, key) {
  return Array.isArray(report?.[key]) ? report[key] : [];
}

function key(row, index = 0) {
  return row.keys?.[index] ?? '';
}

function topRows(report, keyName, count = 5) {
  return rows(report, keyName).slice(0, count);
}

function findCtrCandidates(report) {
  return rows(report, 'byPageQuery')
    .filter((row) => Number(row.impressions ?? 0) >= 10)
    .filter((row) => Number(row.position ?? 0) <= 20)
    .filter((row) => Number(row.ctr ?? 0) < expectedCtr(Number(row.position ?? 99)))
    .slice(0, 10);
}

function findPageOneOpportunities(report) {
  return rows(report, 'byPageQuery')
    .filter((row) => Number(row.impressions ?? 0) >= 5)
    .filter((row) => Number(row.position ?? 0) >= 8 && Number(row.position ?? 0) <= 20)
    .slice(0, 10);
}

function summarizeInspection(report) {
  return (report?.inspections ?? []).map((item) => ({
    url: item.inspectionUrl,
    verdict: item.verdict ?? 'unknown',
    coverageState: item.coverageState ?? item.error ?? 'unknown',
    lastCrawlTime: item.lastCrawlTime ?? '',
  }));
}

async function fetchDataForSeoSnapshot() {
  if (skipDataForSeo) {
    return { skipped: true };
  }

  const userData = await getDataForSeoUserData();
  const account = summarizeDataForSeoUserData(userData);
  const needsWarning = account.balance <= warnBalance;
  const needsTopUp = account.balance <= minBalance;
  const serviceStatus = summarizeDataForSeoServiceStatus(await getDataForSeoServiceStatus());
  const labsStatus = summarizeDataForSeoLabsStatus(await getDataForSeoLabsStatus());
  const labsService = findDataForSeoService(serviceStatus, 'dataforseo_labs');
  const apiHealthy = labsService?.status === 'ok';

  if (!apiHealthy) {
    return {
      account,
      needsWarning,
      needsTopUp,
      broadResearchAllowed: false,
      paidResearchSkipped: true,
      paidResearchSkipReason: 'DataForSEO Labs service status is not ok, so paid research was delayed.',
      serviceStatus,
      labsStatus,
    };
  }

  if (needsTopUp) {
    return {
      account,
      needsWarning,
      needsTopUp,
      broadResearchAllowed: false,
      paidResearchSkipped: true,
      paidResearchSkipReason: `Balance is at or below the emergency top-up threshold (${minBalance.toFixed(2)}).`,
      serviceStatus,
      labsStatus,
    };
  }

  const domainOverview = await dataForSeoRequest('/dataforseo_labs/google/domain_rank_overview/live', {
    target: TARGET_DOMAIN,
    location_name: 'United States',
    language_code: 'en',
  });
  const rankedKeywords = await dataForSeoRequest('/dataforseo_labs/google/ranked_keywords/live', {
    target: TARGET_DOMAIN,
    location_name: 'United States',
    language_code: 'en',
    item_types: ['organic'],
    limit: 25,
    order_by: ['ranked_serp_element.serp_item.rank_group,asc'],
  });
  const broadResearchAllowed = account.balance > broadResearchStop;
  const serpCompetitors = broadResearchAllowed
    ? await dataForSeoRequest('/dataforseo_labs/google/serp_competitors/live', {
        keywords: [
          'free calculators',
          'online calculator',
          'basic calculator online free',
          'percentage calculator',
          'mortgage calculator',
          'bmi calculator',
          'password generator',
          'image to text',
          'ai text summarizer',
          'unit converter',
        ],
        location_name: 'United States',
        language_code: 'en',
        item_types: ['organic'],
        limit: 20,
        order_by: ['rating,desc'],
      })
    : null;
  const relatedKeywords = broadResearchAllowed
    ? await Promise.all(
        ['free calculators', 'basic calculator online free'].map((keyword) =>
          dataForSeoRequest('/dataforseo_labs/google/related_keywords/live', {
            keyword,
            location_name: 'United States',
            language_code: 'en',
            depth: 1,
            limit: 25,
            order_by: ['keyword_data.keyword_info.search_volume,desc'],
          }),
        ),
      )
    : [];

  return {
    account,
    needsWarning,
    needsTopUp,
    broadResearchAllowed,
    broadResearchSkippedReason: broadResearchAllowed
      ? ''
      : `Balance is at or below the broad paid research stop (${broadResearchStop.toFixed(2)}).`,
    serviceStatus,
    labsStatus,
    domainOverview,
    rankedKeywords,
    serpCompetitors,
    relatedKeywords,
  };
}

function rankedKeywordItems(snapshot) {
  return snapshot?.rankedKeywords?.tasks?.[0]?.result?.[0]?.items ?? [];
}

function currentSitemapUrls() {
  const candidates = [resolve('dist', 'client'), resolve('dist')].filter((directory) => existsSync(directory));
  const urls = new Set();

  for (const directory of candidates) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.startsWith('sitemap') || !entry.name.endsWith('.xml')) {
        continue;
      }

      const xml = readFileSync(join(directory, entry.name), 'utf8');
      for (const match of xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)) {
        urls.add(match[1].trim().replace(/\/$/, ''));
      }
    }
  }

  return urls;
}

function legacyRankingUrls(items, sitemapUrls) {
  const seen = new Set();
  const gaps = [];

  for (const item of items) {
    const url = item.ranked_serp_element?.serp_item?.url;
    const keyword = item.keyword_data?.keyword ?? '';

    if (!url || seen.has(url)) {
      continue;
    }

    seen.add(url);

    if (!sitemapUrls.has(url.replace(/\/$/, ''))) {
      gaps.push({
        url,
        keyword,
        rank: item.ranked_serp_element?.serp_item?.rank_group ?? null,
        title: item.ranked_serp_element?.serp_item?.title ?? '',
        redirectTarget: LEGACY_REDIRECTS.get(url) ?? LEGACY_REDIRECTS.get(`${url}/`) ?? '',
      });
    }
  }

  return gaps;
}

function contentRefreshAction(url) {
  const redirectTarget = LEGACY_REDIRECTS.get(url) ?? LEGACY_REDIRECTS.get(`${url}/`);

  if (redirectTarget) {
    return `legacy ranking URL; verify the 301 target stays live, useful, and internally linked: ${redirectTarget}`;
  }

  const path = new URL(url).pathname;

  if (path.startsWith('/tools/')) {
    return 'verify the tool page explains inputs, formulas or logic, result meaning, examples, mistakes, FAQs, related links, and trust limits.';
  }

  if (path.startsWith('/blog/how-to-use-')) {
    return 'verify the guide uses the actual current tool UI and explains inputs, examples, result interpretation, and mistakes.';
  }

  if (path === '/about' || path === '/about/') {
    return 'verify the page explains what Access Free Tools is, why it exists, and how users can trust it.';
  }

  return 'verify the page has clear purpose, useful internal links, unique metadata, and no generic filler.';
}

function domainMetric(snapshot) {
  return snapshot?.domainOverview?.tasks?.[0]?.result?.[0]?.items?.[0]?.metrics?.organic ?? null;
}

function competitorItems(snapshot) {
  return snapshot?.serpCompetitors?.tasks?.[0]?.result?.[0]?.items ?? [];
}

function relatedKeywordItems(snapshot) {
  return (snapshot?.relatedKeywords ?? []).flatMap((response) => response?.tasks?.[0]?.result?.[0]?.items ?? []);
}

const gsc = readJsonIfExists('output/search-console-performance.json');
const inspections = readJsonIfExists('output/search-console-url-inspection.json');
let dataForSeo;
try {
  dataForSeo = await fetchDataForSeoSnapshot();
} catch (error) {
  dataForSeo = {
    error: true,
    message: error instanceof Error ? error.message : String(error),
    details: error?.details ?? null,
  };
}
const ctrCandidates = findCtrCandidates(gsc);
const pageOneOpportunities = findPageOneOpportunities(gsc);
const indexedSummary = summarizeInspection(inspections);
const organicMetric = domainMetric(dataForSeo);
const rankedItems = rankedKeywordItems(dataForSeo);
const competitors = competitorItems(dataForSeo);
const relatedKeywordIdeas = relatedKeywordItems(dataForSeo);
const sitemapUrls = currentSitemapUrls();
const legacyRankings = legacyRankingUrls(rankedItems, sitemapUrls);

const report = {
  generatedAt: new Date().toISOString(),
  site: SITE_ORIGIN,
  gscRange: gsc?.range ?? null,
  dataForSeo,
  ctrCandidates,
  pageOneOpportunities,
  indexedSummary,
  legacyRankings,
};

const lines = [
  '# SEO Agent Self-Evaluation',
  '',
  `Generated: ${report.generatedAt}`,
  `Site: ${SITE_ORIGIN}`,
  '',
  '## Executive Summary',
];

if (!gsc) {
  lines.push(
    '- Search Console report is missing. Run `npm run search-console -- --site=https://accessfreetools.com/` first.',
  );
} else {
  lines.push(
    `- Search Console range: ${gsc.range.startDate} to ${gsc.range.endDate}. Totals: ${metricLine(gsc.totals ?? {})}.`,
  );
}

if (dataForSeo.skipped) {
  lines.push('- DataForSEO was skipped for this run.');
} else if (dataForSeo.error) {
  lines.push(`- DataForSEO failed before paid research could complete: ${dataForSeo.message}`);
} else {
  lines.push(
    `- DataForSEO balance: ${dataForSeo.account.balance.toFixed(2)} ${dataForSeo.account.currency}. ${
      dataForSeo.needsTopUp
        ? 'Top up now.'
        : dataForSeo.needsWarning
          ? `Balance is below the ${warnBalance.toFixed(2)} warning threshold.`
          : `Top-up alert threshold is ${minBalance.toFixed(2)}.`
    }`,
  );
  lines.push(
    `- DataForSEO service status: dataforseo_labs ${
      findDataForSeoService(dataForSeo.serviceStatus, 'dataforseo_labs')?.status ?? 'unknown'
    }; broad paid research ${dataForSeo.broadResearchAllowed ? 'enabled' : 'skipped'}.`,
  );

  if (organicMetric) {
    lines.push(
      `- DataForSEO organic baseline: ${organicMetric.count ?? 0} ranked keywords, estimated traffic value ${Number(
        organicMetric.etv ?? 0,
      ).toFixed(2)}, positions 21-30: ${organicMetric.pos_21_30 ?? 0}.`,
    );
  }

  if (dataForSeo.paidResearchSkipped) {
    lines.push(`- Paid keyword research skipped: ${dataForSeo.paidResearchSkipReason}`);
  } else if (!dataForSeo.broadResearchAllowed && dataForSeo.broadResearchSkippedReason) {
    lines.push(`- Broad keyword research skipped: ${dataForSeo.broadResearchSkippedReason}`);
  }
}

lines.push('', '## SEO Health Reporter');

if (indexedSummary.length) {
  for (const item of indexedSummary) {
    lines.push(`- ${item.url}: ${item.verdict} / ${item.coverageState}${item.lastCrawlTime ? `, last crawl ${item.lastCrawlTime}` : ''}.`);
  }
} else {
  lines.push('- No URL inspection report found. Run `npm run search-console -- --inspect-key-urls` for indexing proof.');
}

if (legacyRankings.length) {
  lines.push('', '## Routing And Legacy Ranking Gaps');
  for (const item of legacyRankings.slice(0, 8)) {
    if (item.redirectTarget) {
      lines.push(
        `- ${item.url} is ranking for "${item.keyword}" around position ${item.rank ?? 'n/a'} and is intentionally mapped to a 301 redirect target: ${item.redirectTarget}. Next action: verify the redirect after deployment and inspect the target URL in Search Console.`,
      );
    } else {
      lines.push(
        `- ${item.url} is ranking for "${item.keyword}" around position ${item.rank ?? 'n/a'} but is not in the current built sitemap. Current seen title: ${item.title || 'unknown'}. Next action: check the live route and add a redirect, canonical fix, or replacement internal link if this is an old Hostinger/CMS page.`,
      );
    }
  }
}

lines.push('', '## CTR Rewrite Agent');

if (ctrCandidates.length) {
  for (const row of ctrCandidates.slice(0, 5)) {
    lines.push(`- ${key(row, 0)} | query: ${key(row, 1)} | ${metricLine(row)} | next action: compare title/meta with live SERP and rewrite only if the page intent still matches.`);
  }
} else {
  lines.push('- No strong CTR candidates found in the current local Search Console export.');
}

lines.push('', '## Page-One Opportunity Agent');

if (pageOneOpportunities.length) {
  for (const row of pageOneOpportunities.slice(0, 5)) {
    lines.push(`- ${key(row, 1)} -> ${key(row, 0)} | ${metricLine(row)} | next action: add missing explanation, examples, related-tool links, and a sharper page intro.`);
  }
} else {
  lines.push('- No page-one opportunities found in the current local Search Console export.');
}

lines.push('', '## Content Refresh Agent');

for (const row of topRows(gsc, 'byPage', 5)) {
  lines.push(`- ${key(row)} | ${metricLine(row)} | refresh check: ${contentRefreshAction(key(row))}`);
}

if (!topRows(gsc, 'byPage', 5).length) {
  lines.push('- No page rows found yet. This is normal for a very new site.');
}

lines.push('', '## Content Idea Agent');

if (rankedItems.length) {
  for (const item of rankedItems.slice(0, 8)) {
    const keyword = item.keyword_data?.keyword ?? 'unknown keyword';
    const volume = item.keyword_data?.keyword_info?.search_volume ?? 0;
    const rank = item.ranked_serp_element?.serp_item?.rank_group ?? 'n/a';
    const url = item.ranked_serp_element?.serp_item?.url ?? '';
    lines.push(`- ${keyword}: volume ${volume}, rank ${rank}, URL ${url}. Use as a supporting-content or hub-improvement clue, not as a thin duplicate page.`);
  }
} else {
  lines.push('- No DataForSEO ranked keyword items returned yet.');
}

if (competitors.length) {
  lines.push('', '## DataForSEO SERP Competitors');
  for (const competitor of competitors.slice(0, 8)) {
    lines.push(
      `- ${competitor.domain}: rating ${competitor.rating ?? 'n/a'}, average position ${Number(
        competitor.avg_position ?? 0,
      ).toFixed(1)}, keywords matched ${competitor.keywords_count ?? 0}.`,
    );
  }
}

if (relatedKeywordIdeas.length) {
  lines.push('', '## DataForSEO Related Keyword Ideas');
  for (const item of relatedKeywordIdeas.slice(0, 8)) {
    const keyword = item.keyword_data?.keyword ?? 'unknown keyword';
    const volume = item.keyword_data?.keyword_info?.search_volume ?? 0;
    const difficulty = item.keyword_data?.keyword_properties?.keyword_difficulty ?? 'n/a';
    lines.push(`- ${keyword}: volume ${volume}, difficulty ${difficulty}.`);
  }
}

lines.push('', '## Recommended Next Actions');
lines.push('- Keep legacy redirects verified for old ranking URLs such as `/calculators`, `/deep-research`, `/advanced-age-calculator`, and the old AdSense earnings article.');
lines.push('- Keep sitemap and RSS submitted through Search Console after major batches.');
lines.push('- For priority pages that are discovered, crawled, or unknown but not indexed yet, improve useful internal links and page clarity before creating new duplicate pages.');
lines.push('- Use DataForSEO for live SERP checks before changing important titles or creating new tool clusters.');
lines.push('- Run `npm run dataforseo:status` before paid research; use Sandbox for new endpoint shapes.');
lines.push('- Do not auto-publish affiliate or YMYL changes without manual review.');
lines.push('- Run `npm run check` before GitHub updates.');

writeJson(jsonPath, report);
writeText(outputPath, `${lines.join('\n')}\n`);

console.log(`Saved SEO self-evaluation to ${outputPath}`);
console.log(`Saved machine report to ${jsonPath}`);
