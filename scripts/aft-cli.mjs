import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { Command } from 'commander';
import {
  buildApiReadyReport,
  buildAgentDoctorReport,
  buildAgentRouteReport,
  buildClaimCheckReport,
  buildLinkHelperReport,
  buildEvidencePackReport,
  buildSeoConsoleReport,
  buildToolBriefReport,
  runClaimCheckReport,
  runAskAudit,
  runContentQualityReport,
  runMcpSmoke,
} from './lib/agent-tools-report.mjs';
import {
  buildSeoApprovalStatusReport,
  buildSeoPageScoreReport,
  buildSeoToolQueueReport,
  buildSeoToolResearchReport,
  runSeoCompetitorGapReport,
} from './lib/seo-tool-review.mjs';

const SITE_ORIGIN = 'https://accessfreetools.com';
const root = process.cwd();

const evidencePaths = {
  brandCode: 'docs/brand-code.md',
  agentCli: 'docs/agent-cli.md',
  recommendedAgents: 'docs/recommended-agency-agents.md',
  marketingPlan: 'output/marketing-orchestrator/daily-plan.json',
  promotionQueue: 'docs/promotion-queue.md',
  seoEvaluation: 'output/seo-agent-self-evaluation.json',
  searchConsole: 'output/search-console-url-inspection.json',
  searchConsoleCoverageExport: 'output/search-console-coverage-export.json',
  searchConsoleCoverageDrilldown: 'output/search-console-coverage-drilldown.json',
  searchConsoleDiscovery: 'output/search-console-discovery.json',
  searchConsoleIndexingRequests: 'docs/search-console-indexing-requests.json',
  searchConsolePerformanceExport: 'output/search-console/performance-latest.json',
  productionSitemapCheck: 'output/production-sitemap-check.json',
  dataForSeoAccount: 'output/dataforseo-account.json',
  dataForSeoStatus: 'output/dataforseo-status.json',
  hostingerStatus: 'output/hostinger/status.json',
  mediumQuality: 'output/promotion/medium-quality-report.json',
  redditQuality: 'output/promotion/reddit-quality-report.json',
  blueskyQuality: 'output/promotion/bluesky/bluesky-quality-report.json',
  quoraQuality: 'output/promotion/quora-quality-report.json',
  devtoQuality: 'output/promotion/devto/devto-quality-report.json',
  pinterestRss: 'output/promotion/pinterest-rss-report.json',
};

const analyticsEventsPath = resolve(root, process.env.AFT_ANALYTICS_DIR ?? '.local/analytics', 'events.ndjson');
const feedUrl = `${SITE_ORIGIN}/feed.xml`;
const rootSitemapUrl = `${SITE_ORIGIN}/sitemap.xml`;

const genericPhrases = [
  "in today's digital world",
  'ultimate guide',
  'game changer',
  'revolutionary',
  'unlock the power',
  'seamlessly',
  'delve',
  'leverage',
  'robust',
  'supercharge',
  'cutting-edge',
  'transform the way',
];

const agentFacingPhrases = [
  'this medium post should',
  'this post should',
  'this article should',
  'agent should',
  'draft should',
  'reader-facing',
  'quality gate',
  'seo agent',
  'promotion agent',
];

function absolute(relativePath) {
  return resolve(root, relativePath);
}

function readText(relativePath) {
  const path = absolute(relativePath);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function readJson(relativePath) {
  const text = readText(relativePath);
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (error) {
    return { parseError: error instanceof Error ? error.message : String(error) };
  }
}

function readJsonFile(path) {
  if (!existsSync(path)) return null;

  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    return { parseError: error instanceof Error ? error.message : String(error) };
  }
}

function newestReportByName(fileName) {
  const files = walk(resolve(root, 'output'), (file) => basename(file) === fileName);
  const reports = files
    .map((file) => {
      const report = readJsonFile(file);
      const generatedTime = report?.generatedAt ? Date.parse(report.generatedAt) : NaN;
      return {
        file,
        report,
        timestamp: Number.isFinite(generatedTime) ? generatedTime : statSync(file).mtimeMs,
      };
    })
    .filter((entry) => entry.report && !entry.report.parseError)
    .sort((a, b) => b.timestamp - a.timestamp);

  return reports[0] ?? null;
}

function newestReportUnder(relativeDir, fileName = 'summary.json') {
  const baseDir = resolve(root, relativeDir);
  const files = walk(baseDir, (file) => basename(file) === fileName);
  const reports = files
    .map((file) => {
      const report = readJsonFile(file);
      const generatedTime = report?.generatedAt ? Date.parse(report.generatedAt) : NaN;
      return {
        file,
        report,
        timestamp: Number.isFinite(generatedTime) ? generatedTime : statSync(file).mtimeMs,
      };
    })
    .filter((entry) => entry.report && !entry.report.parseError)
    .sort((a, b) => b.timestamp - a.timestamp);

  return reports[0] ?? null;
}

function readNdjson(path) {
  if (!existsSync(path)) return [];

  return readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function walk(directory, predicate, files = []) {
  if (!existsSync(directory)) return files;

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, predicate, files);
    } else if (entry.isFile() && predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function cleanInline(value = '') {
  return value.replace(/`/g, '').trim();
}

function parseQueueRows(markdown) {
  return markdown
    .split('\n')
    .filter((line) => line.trim().startsWith('|') && !line.includes('---'))
    .map((line) => line.split('|').map((cell) => cleanInline(cell)).filter(Boolean))
    .filter((cells) => cells.length >= 6 && cells[0] !== 'Priority')
    .map((cells) => ({
      priority: cells[0],
      page: cells[1],
      angle: cells[2],
      channel: cells[3],
      status: cells[4],
      nextAction: cells.slice(5).join(' | '),
    }));
}

function priorityWeight(priority) {
  if (/high/i.test(priority)) return 0;
  if (/medium/i.test(priority)) return 1;
  if (/low/i.test(priority)) return 2;
  return 3;
}

function qualitySummary(report, label) {
  if (!report) {
    return { label, status: 'missing', passed: 0, total: 0, warnings: 0, errors: 0 };
  }

  if (report.parseError) {
    return { label, status: 'parse-error', passed: 0, total: 0, warnings: 0, errors: 1 };
  }

  const totals = report.totals ?? {};
  const total = Number(totals.drafts ?? totals.files ?? report.results?.length ?? 0);
  const errors = Number(totals.errors ?? totals.failed ?? 0);
  const warnings = Number(totals.warnings ?? 0);
  const passed = Number(totals.passed ?? (errors === 0 ? total : Math.max(0, total - errors)));

  return {
    label,
    status: errors > 0 ? 'failed' : warnings > 0 ? 'warnings' : 'passed',
    passed,
    total,
    warnings,
    errors,
  };
}

function platformQualityReports() {
  return [
    qualitySummary(readJson(evidencePaths.mediumQuality), 'Medium'),
    qualitySummary(readJson(evidencePaths.redditQuality), 'Reddit'),
    qualitySummary(readJson(evidencePaths.blueskyQuality), 'Bluesky'),
    qualitySummary(readJson(evidencePaths.quoraQuality), 'Quora'),
    qualitySummary(readJson(evidencePaths.devtoQuality), 'DEV Community'),
  ];
}

function getDataForSeoBalance() {
  const latestAccountReport = newestReportByName('dataforseo-account.json');
  const accountReport = latestAccountReport?.report ?? readJson(evidencePaths.dataForSeoAccount);
  const seoReport = readJson(evidencePaths.seoEvaluation);
  const liveAccount = accountReport?.account ?? accountReport?.dataForSeo?.account ?? null;
  const cachedAccount = seoReport?.dataForSeo?.account ?? null;
  const account = liveAccount ?? cachedAccount;

  if (!account || typeof account.balance !== 'number') return null;

  return {
    status: liveAccount ? 'live' : 'cached',
    source: liveAccount
      ? latestAccountReport
        ? relative(root, latestAccountReport.file)
        : evidencePaths.dataForSeoAccount
      : evidencePaths.seoEvaluation,
    generatedAt: liveAccount ? accountReport?.generatedAt ?? '' : seoReport?.generatedAt ?? '',
    liveError:
      accountReport?.status === 'error'
        ? accountReport.message ?? 'DataForSEO live account check failed.'
        : accountReport?.parseError
          ? `Could not read live DataForSEO account report: ${accountReport.parseError}`
          : '',
    balance: account.balance,
    currency: account.currency ?? 'USD',
    topUp: account.balance <= 2,
    warning: account.balance <= 10,
  };
}

function getHostingerStatus() {
  const report = readJson(evidencePaths.hostingerStatus);
  if (!report) return null;
  if (report.parseError) return { status: 'parse-error', generatedAt: '', okChecks: [], blockedChecks: [] };

  const checks = report.checks ?? {};
  const okChecks = Object.entries(checks)
    .filter(([, value]) => value?.ok)
    .map(([label, value]) => ({ label, count: Number(value.count ?? 0) }));
  const blockedChecks = Object.entries(checks)
    .filter(([, value]) => !value?.ok)
    .map(([label, value]) => ({ label, message: value.message ?? 'blocked' }));

  return {
    status: report.status ?? 'unknown',
    generatedAt: report.generatedAt ?? '',
    okChecks,
    blockedChecks,
  };
}

function getIndexingGaps() {
  const inspection = readJson(evidencePaths.searchConsole);
  const seoReport = readJson(evidencePaths.seoEvaluation);
  const fromInspection = Array.isArray(inspection?.inspections)
    ? inspection.inspections.map((item) => ({
        url: item.inspectionUrl,
        verdict: item.verdict ?? 'unknown',
        state: item.coverageState ?? item.error ?? 'unknown',
        lastCrawlTime: item.lastCrawlTime ?? '',
      }))
    : [];
  const fromSeo = Array.isArray(seoReport?.indexedSummary)
    ? seoReport.indexedSummary.map((item) => ({
        url: item.url,
        verdict: item.verdict ?? 'unknown',
        state: item.coverageState ?? 'unknown',
        lastCrawlTime: item.lastCrawlTime ?? '',
      }))
    : [];
  const items = fromInspection.length ? fromInspection : fromSeo;

  return items.filter((item) => {
    const joined = `${item.verdict} ${item.state}`;
    return !/^PASS$/i.test(String(item.verdict)) && /unknown|not indexed|discovered|crawled/i.test(joined);
  });
}

function getSearchConsoleIndexingRequests() {
  const report = readJson(evidencePaths.searchConsoleIndexingRequests);
  const requests = Array.isArray(report?.requests) ? report.requests : [];
  const deferred = Array.isArray(report?.deferred) ? report.deferred : [];

  return {
    deferred,
    generatedAt: report?.generatedAt ?? '',
    requests,
  };
}

function normalizeUrlForCompare(url) {
  return String(url ?? '').replace(/\/+$/, '/');
}

function searchConsoleIndexingRequestForUrl(url, requestReport = getSearchConsoleIndexingRequests()) {
  const normalizedUrl = normalizeUrlForCompare(url);
  return requestReport.requests.find((request) => normalizeUrlForCompare(request?.url) === normalizedUrl) ?? null;
}

function searchConsoleIndexingDeferredForUrl(url, requestReport = getSearchConsoleIndexingRequests()) {
  const normalizedUrl = normalizeUrlForCompare(url);
  return requestReport.deferred.find((item) => normalizeUrlForCompare(item?.url) === normalizedUrl) ?? null;
}

function formatIndexingRequestTime(request) {
  if (!request?.requestedAt) return '';

  const date = new Date(request.requestedAt);
  if (Number.isNaN(date.getTime())) return request.requestedAt;

  return date.toLocaleString('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Australia/Brisbane',
  });
}

function indexingGapRecommendation(gaps, requestReport) {
  if (!gaps.length) return 'No indexing gaps found in the current local snapshot.';

  const requestedGaps = gaps.filter((gap) => searchConsoleIndexingRequestForUrl(gap.url, requestReport));
  if (requestedGaps.length === gaps.length) {
    return 'Recommended action: Search Console UI request-indexing is already submitted for every current gap; do not repeat clicks yet. Recheck URL Inspection after Google crawls.';
  }

  if (requestedGaps.length > 0) {
    return `Recommended action: ${requestedGaps.length}/${gaps.length} gaps already have request-indexing proof; recheck those after Google crawls, and use link-helper/URL Inspection only for the remaining gaps.`;
  }

  return 'Recommended action: improve contextual internal links, submit discovery, and use one quality-passed promotion item when useful.';
}

function getCoverageExportSummary() {
  const report = readJson(evidencePaths.searchConsoleCoverageExport);
  if (!report || report.parseError) return null;

  return {
    generatedAt: report.generatedAt ?? '',
    latest: report.latest ?? null,
    totals: report.totals ?? null,
    criticalIssues: report.criticalIssues ?? [],
    actions: report.actions ?? [],
  };
}

function getCoverageDrilldownWatchProof() {
  const discovery = readJson(evidencePaths.searchConsoleDiscovery);
  const productionSitemap = readJson(evidencePaths.productionSitemapCheck);
  const indexingProtection = newestReportUnder('output/indexing-protection')?.report ?? null;

  return {
    feedSitemapPruned: Array.isArray(discovery?.pruned) && discovery.pruned.includes(feedUrl),
    indexingProtectionClean: Number(indexingProtection?.totals?.highIssues ?? NaN) === 0,
    productionSitemapClean: Number(productionSitemap?.hardFailures ?? NaN) === 0,
    rootSitemapSubmitted: Array.isArray(discovery?.submissions) && discovery.submissions.includes(rootSitemapUrl),
  };
}

function coverageDrilldownCleanupProven(proof) {
  return proof.feedSitemapPruned && proof.rootSitemapSubmitted && proof.productionSitemapClean && proof.indexingProtectionClean;
}

function coverageDrilldownActions(report, proof) {
  const actions = report.actions ?? [];
  const rowsByType = report.totals?.rowsByType ?? {};
  const hasFeedOrHtmlSitemap = Number(rowsByType.feed ?? 0) > 0 || Number(rowsByType['html-sitemap'] ?? 0) > 0;

  if (!hasFeedOrHtmlSitemap || !coverageDrilldownCleanupProven(proof)) return actions;

  return [
    {
      priority: 'watch',
      task:
        'Feed/html sitemap cleanup has current local proof: /feed.xml was pruned from Search Console sitemap submissions, the root XML sitemap was submitted, production XML sitemap check has 0 hard failures, and indexing protection has 0 high issues. Wait for Google recrawl, then re-import Coverage Drilldown; do not restart validation or bulk-edit pages unless sampled URLs show current defects.',
    },
    ...actions.filter((action) => !/\/sitemap\/|\/feed\.xml/i.test(action.task ?? '')),
  ];
}

function getCoverageDrilldownSummary() {
  const report = readJson(evidencePaths.searchConsoleCoverageDrilldown);
  if (!report || report.parseError) return null;
  const watchProof = getCoverageDrilldownWatchProof();

  return {
    actions: coverageDrilldownActions(report, watchProof),
    generatedAt: report.generatedAt ?? '',
    issue: report.metadata?.Issue ?? 'unknown',
    newestExamples: report.newestExamples ?? [],
    totals: report.totals ?? null,
    watchProof,
  };
}

function getPerformanceExportSummary() {
  const report = readJson(evidencePaths.searchConsolePerformanceExport);
  if (!report || report.parseError) return null;

  return {
    generatedAt: report.generatedAt ?? '',
    totals: report.totals ?? null,
    tierARecovery: report.tierARecovery ?? [],
    highImpressionZeroClickPages: report.opportunities?.highImpressionZeroClickPages ?? [],
    queryQuickWins: report.opportunities?.queryQuickWins ?? [],
  };
}

function runNodeScript(scriptPath, scriptArgs = []) {
  const result = spawnSync(process.execPath, [scriptPath, ...scriptArgs], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return {
    script: scriptPath,
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function wantsJson(commandOrOptions) {
  if (String(process.env.npm_config_json ?? '').toLowerCase() === 'true') {
    return true;
  }

  if (typeof commandOrOptions?.opts === 'function') {
    return Boolean(commandOrOptions.opts().json);
  }

  return Boolean(commandOrOptions?.json);
}

function emit(commandOrOptions, payload, lines) {
  if (wantsJson(commandOrOptions)) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log(lines.filter(Boolean).join('\n'));
}

function optionValue(command, key, fallback = undefined) {
  const opts = typeof command?.opts === 'function' ? command.opts() : {};
  const envKey = `npm_config_${key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`).replace(/-/g, '_')}`;
  return opts[key] ?? command?.[key] ?? process.env[envKey] ?? fallback;
}

function collectOption(value, previous = []) {
  return [...previous, value];
}

function formatQuality(report) {
  return `${report.label}: ${report.status} (${report.passed}/${report.total})`;
}

function decodeHtml(value = '') {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function stripTags(value = '') {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function getAttribute(tag, attributeName) {
  const match = tag.match(new RegExp(`\\b${attributeName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? decodeHtml(match[2].trim()) : '';
}

function getLinkHrefByRel(html, relValue) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  const wantedRel = relValue.toLowerCase();

  for (const tag of linkTags) {
    const relTokens = getAttribute(tag, 'rel').toLowerCase().split(/\s+/).filter(Boolean);
    if (relTokens.includes(wantedRel)) return getAttribute(tag, 'href');
  }

  return '';
}

function getMetaContent(html, key, value) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    if ((getAttribute(tag, key) ?? '').toLowerCase() === value.toLowerCase()) {
      return getAttribute(tag, 'content') ?? '';
    }
  }

  return '';
}

function sourceFiles() {
  return walk(join(root, 'src'), (file) => file.endsWith('.ts') || file.endsWith('.astro'));
}

function toolDataFiles() {
  const preferredOrder = [
    'tools.ts',
    'mathExpansionTools.ts',
    'financeTools.ts',
    'healthTools.ts',
    'utilityTools.ts',
    'aiTools.ts',
  ];

  return walk(
    join(root, 'src', 'data'),
    (file) =>
      file.endsWith('.ts') &&
      !/audit|test|blog|searchindex|pinterest|icons|aliases|categories|dates|discovery/i.test(basename(file)),
  ).sort((left, right) => {
    const leftRank = preferredOrder.indexOf(basename(left));
    const rightRank = preferredOrder.indexOf(basename(right));
    return (leftRank === -1 ? 999 : leftRank) - (rightRank === -1 ? 999 : rightRank);
  });
}

function extractObjectBlock(source, propertyIndex) {
  const start = source.lastIndexOf('{', propertyIndex);
  if (start < 0) return '';

  let depth = 0;
  let quote = '';
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;

    if (depth === 0) {
      return source.slice(start, index + 1);
    }
  }

  return '';
}

function extractProperty(block, property) {
  const simple = block.match(new RegExp(`${property}\\s*:\\s*(['"\`])([\\s\\S]*?)\\1`, 'm'));
  return simple ? simple[2].replace(/\s+/g, ' ').trim() : '';
}

function countProperty(block, property) {
  return (block.match(new RegExp(`\\b${property}\\s*:`, 'g')) ?? []).length;
}

function extractRelatedSlugs(block) {
  const match = block.match(/relatedSlugs\s*:\s*\[([\s\S]*?)\]/m);
  if (!match) return [];
  return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((item) => item[1]);
}

function findToolSource(slug) {
  const files = toolDataFiles();
  const slugPattern = new RegExp(`\\bslug\\s*:\\s*['"]${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`);

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const match = slugPattern.exec(text);
    if (!match) continue;

    const block = extractObjectBlock(text, match.index);
    const name = extractProperty(block, 'name');
    const description = extractProperty(block, 'description');
    const isUtilityFactoryBlock =
      block.includes('makeUtilityTool({') || text.slice(Math.max(0, match.index - 120), match.index).includes('makeUtilityTool');
    const isFinanceFactoryBlock =
      block.includes('makeFinanceTool({') || text.slice(Math.max(0, match.index - 120), match.index).includes('makeFinanceTool');
    const isHealthFactoryBlock =
      block.includes('makeHealthTool({') || text.slice(Math.max(0, match.index - 120), match.index).includes('makeHealthTool');
    const isAiFactoryBlock =
      /aiTools\.ts$/.test(relative(root, file).replace(/\\/g, '/')) ||
      block.includes('makeAiTool({') ||
      text.slice(Math.max(0, match.index - 120), match.index).includes('makeAiTool');
    const titleType = name.endsWith('Generator')
      ? 'Free Online Generator'
      : name.endsWith('Calculator')
        ? 'Free Online Calculator'
        : 'Free Online Tool';
    const explicitQuestionCount = countProperty(block, 'question');
    const hasExplicitFaq = /\bfaq\s*:\s*\[/.test(block);
    return {
      file: relative(root, file).replace(/\\/g, '/'),
      block,
      slug,
      name,
      category: extractProperty(block, 'category'),
      seoTitle:
        extractProperty(block, 'seoTitle') ||
        (isAiFactoryBlock && name ? `${name} | Free Browser AI Tool` : (isUtilityFactoryBlock || isHealthFactoryBlock) && name ? `${name} | ${titleType}` : ''),
      seoDescription:
        extractProperty(block, 'seoDescription') || (isUtilityFactoryBlock || isFinanceFactoryBlock || isHealthFactoryBlock || isAiFactoryBlock ? description : ''),
      faqCount:
        explicitQuestionCount +
        (!hasExplicitFaq && isUtilityFactoryBlock ? 5 : 0) +
        (!hasExplicitFaq && isHealthFactoryBlock ? 7 : 0) +
        (!hasExplicitFaq && isFinanceFactoryBlock ? 7 : 0) +
        (!hasExplicitFaq && isAiFactoryBlock ? 7 : 0),
      exampleCount: countProperty(block, 'label'),
      relatedSlugs: extractRelatedSlugs(block),
    };
  }

  return null;
}

function slugExists(slug) {
  return Boolean(findToolSource(slug));
}

function findBuiltHtmlForTool(slug) {
  const candidates = [
    join(root, 'dist', 'client', 'tools', slug, 'index.html'),
    join(root, 'dist', 'tools', slug, 'index.html'),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? '';
}

function readSitemapUrls() {
  const urls = new Set();
  const candidates = [join(root, 'dist', 'client', 'sitemap.xml'), join(root, 'dist', 'sitemap.xml'), join(root, 'public', 'sitemap.xml')];
  const sitemapPath = candidates.find((candidate) => existsSync(candidate));
  if (!sitemapPath) return urls;

  const baseDir = dirname(sitemapPath);
  const visited = new Set();

  function readSitemap(file) {
    const normalized = resolve(file);
    if (visited.has(normalized) || !existsSync(normalized)) return;
    visited.add(normalized);

    const text = readFileSync(normalized, 'utf8');
    const locs = [...text.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => decodeHtml(match[1].trim()));

    if (/<sitemapindex\b/i.test(text)) {
      for (const loc of locs) {
        try {
          const url = new URL(loc);
          readSitemap(join(baseDir, url.pathname.replace(/^\/+/, '')));
        } catch {
          // The hard site audit owns malformed sitemap URLs; the CLI summary should stay best-effort.
        }
      }
      return;
    }

    for (const loc of locs) urls.add(loc);
  }

  readSitemap(sitemapPath);
  return urls;
}

function dayKey(date) {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: process.env.AFT_ANALYTICS_TIME_ZONE ?? 'Australia/Brisbane',
    year: 'numeric',
  }).format(date);
}

function topMapRows(map, limit = 10) {
  return [...map.values()].sort((left, right) => right.count - left.count || left.label.localeCompare(right.label)).slice(0, limit);
}

function analyticsSummary(days = 30) {
  const now = new Date();
  const rangeStartTime = now.getTime() - Math.max(1, Number(days)) * 24 * 60 * 60 * 1000;
  const today = dayKey(now);
  const events = readNdjson(analyticsEventsPath).filter((event) => event?.ts && event?.visitorHash);
  const inRange = events.filter((event) => new Date(event.ts).getTime() >= rangeStartTime);
  const todayEvents = events.filter((event) => event.day === today);
  const firstSeen = new Map();
  const topTools = new Map();
  const topPages = new Map();

  for (const event of events) {
    if (!firstSeen.has(event.visitorHash)) firstSeen.set(event.visitorHash, event.day);
  }

  for (const event of inRange) {
    if (event.type === 'tool_action' && event.toolSlug) {
      const current = topTools.get(event.toolSlug) ?? {
        count: 0,
        label: event.toolName ?? event.toolSlug,
        path: `/tools/${event.toolSlug}/`,
      };
      current.count += 1;
      topTools.set(event.toolSlug, current);
    }

    if (event.type === 'page_view' && event.pagePath) {
      const current = topPages.get(event.pagePath) ?? {
        count: 0,
        label: event.pageTitle ?? event.pagePath,
        path: event.pagePath,
      };
      current.count += 1;
      topPages.set(event.pagePath, current);
    }
  }

  const todayVisitors = new Set(todayEvents.map((event) => event.visitorHash));
  const newVisitors = [...todayVisitors].filter((visitorHash) => firstSeen.get(visitorHash) === today).length;

  return {
    eventsPath: relative(root, analyticsEventsPath).replace(/\\/g, '/'),
    hasEventsFile: existsSync(analyticsEventsPath),
    allTime: {
      events: events.length,
      pageViews: events.filter((event) => event.type === 'page_view').length,
      toolActions: events.filter((event) => event.type === 'tool_action').length,
      visitors: new Set(events.map((event) => event.visitorHash)).size,
    },
    today: {
      events: todayEvents.length,
      newVisitors,
      pageViews: todayEvents.filter((event) => event.type === 'page_view').length,
      returningVisitors: Math.max(0, todayVisitors.size - newVisitors),
      toolActions: todayEvents.filter((event) => event.type === 'tool_action').length,
      visitors: todayVisitors.size,
    },
    topPages: topMapRows(topPages),
    topTools: topMapRows(topTools),
  };
}

function builtPageSeo(slug) {
  const htmlPath = findBuiltHtmlForTool(slug);
  if (!htmlPath) return null;

  const html = readFileSync(htmlPath, 'utf8');
  const linkMatches = [...html.matchAll(/href=(["'])([\s\S]*?)\1/gi)].map((match) => decodeHtml(match[2]));
  const internalLinks = linkMatches.filter((href) => href.startsWith('/') || href.startsWith(SITE_ORIGIN));
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripTags(match[1])).filter(Boolean);

  return {
    htmlPath: relative(root, htmlPath).replace(/\\/g, '/'),
    title: stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
    description: getMetaContent(html, 'name', 'description'),
    canonical: getLinkHrefByRel(html, 'canonical'),
    h1,
    internalLinkCount: internalLinks.length,
    hasGuideLink: internalLinks.some((href) => href.includes(`/blog/how-to-use-${slug}/`)),
  };
}

function sourceMentionsGuide(slug) {
  const needle = `/blog/how-to-use-${slug}/`;
  return sourceFiles().some((file) => readFileSync(file, 'utf8').includes(needle));
}

function statusCommand(command) {
  const packageJson = readJson('package.json');
  const queueRows = parseQueueRows(readText(evidencePaths.promotionQueue));
  const qualityReports = platformQualityReports();
  const indexingGaps = getIndexingGaps();
  const performanceExport = getPerformanceExportSummary();
  const balance = getDataForSeoBalance();
  const hostinger = getHostingerStatus();
  const marketingPlan = readJson(evidencePaths.marketingPlan);

  const payload = {
    scripts: Object.keys(packageJson?.scripts ?? {}).length,
    brandCodePresent: Boolean(readText(evidencePaths.brandCode)),
    agentCliDocPresent: Boolean(readText(evidencePaths.agentCli)),
    recommendedAgentsDocPresent: Boolean(readText(evidencePaths.recommendedAgents)),
    marketingPlanGeneratedAt: marketingPlan?.generatedAt ?? '',
    dataForSeoBalance: balance,
    hostinger,
    promotionQueue: {
      rows: queueRows.length,
      approved: queueRows.filter((row) => row.status === 'approved').length,
      rssConnected: queueRows.filter((row) => row.status === 'rss-connected').length,
      unverified: queueRows.filter((row) => row.status === 'unverified').length,
    },
    indexingGaps: indexingGaps.length,
    searchConsolePerformance: performanceExport,
    qualityReports,
  };

  emit(command, payload, [
    'Access Free Tools agent CLI status',
    `- Scripts: ${payload.scripts}`,
    `- Brand code: ${payload.brandCodePresent ? 'present' : 'missing'}`,
    `- Agent CLI docs: ${payload.agentCliDocPresent ? 'present' : 'missing'}`,
    `- Recommended agent routing: ${payload.recommendedAgentsDocPresent ? 'present' : 'missing'}`,
    `- Marketing report: ${payload.marketingPlanGeneratedAt || 'not found'}`,
    balance
      ? `- DataForSEO: ${balance.status} ${balance.balance.toFixed(2)} ${balance.currency}${
          balance.warning ? ' (watch)' : ''
        }${balance.generatedAt ? ` from ${balance.generatedAt}` : ''}${balance.liveError ? `; live check note: ${balance.liveError}` : ''}`
      : '- DataForSEO: not found',
    hostinger
      ? `- Hostinger: ${hostinger.status}${hostinger.generatedAt ? ` from ${hostinger.generatedAt}` : ''}`
      : '- Hostinger: not checked',
    `- Promotion queue: ${payload.promotionQueue.rows} rows, ${payload.promotionQueue.approved} approved, ${payload.promotionQueue.rssConnected} RSS-connected, ${payload.promotionQueue.unverified} unverified`,
    `- Indexing gaps: ${payload.indexingGaps}`,
    performanceExport
      ? `- GSC performance import: ${performanceExport.totals?.deindexedRows ?? 0} deindexed URLs, ${performanceExport.highImpressionZeroClickPages.length} high-impression zero-click pages`
      : '- GSC performance import: not imported yet',
    `- Quality: ${qualityReports.map(formatQuality).join('; ')}`,
  ]);
}

function marketingCommand(command) {
  const run = runNodeScript('scripts/marketing-orchestrator-report.mjs');
  const report = readJson(evidencePaths.marketingPlan);
  const payload = { run, report };

  const recommendations = report?.recommendations ?? [];
  const blockers = report?.blockers ?? [];
  const wins = report?.wins ?? [];

  emit(command, payload, [
    'Marketing orchestrator',
    `- Refresh: ${run.status === 0 ? 'ok' : `failed (${run.status})`}`,
    `- Generated: ${report?.generatedAt ?? 'not found'}`,
    `- Wins: ${wins.length ? wins.slice(0, 3).join(' | ') : 'none listed'}`,
    `- Blockers: ${blockers.length ? blockers.join(' | ') : 'none'}`,
    '- Next actions:',
    ...recommendations.slice(0, 3).map((item, index) => `  ${index + 1}. [${item.priority}] ${item.title} - ${item.action}`),
  ]);

  if (run.status !== 0) process.exitCode = run.status;
}

function hostingerCommand(command) {
  const run = runNodeScript('scripts/hostinger-status.mjs');
  const report = readJson(evidencePaths.hostingerStatus);
  const hostinger = getHostingerStatus();
  const payload = { run, report, hostinger };

  emit(command, payload, [
    'Hostinger hosting status',
    `- Refresh: ${run.status === 0 ? 'ok' : `attention (${run.status})`}`,
    `- Generated: ${report?.generatedAt ?? 'not found'}`,
    hostinger
      ? `- Checks: ${hostinger.okChecks.map((check) => `${check.label} ${check.count}`).join('; ') || 'none ok'}`
      : '- Checks: not found',
    hostinger?.blockedChecks?.length
      ? `- Blocked: ${hostinger.blockedChecks.map((check) => `${check.label}: ${check.message}`).join('; ')}`
      : '- Blocked: none',
    '- Safety: read-only status only; DNS, billing, VPS, and deployment writes still need explicit approval.',
  ]);

  if (run.status !== 0) process.exitCode = run.status;
}

function promoteNextCommand(command) {
  const queueRows = parseQueueRows(readText(evidencePaths.promotionQueue));
  const qualityReports = platformQualityReports();
  const candidates = queueRows
    .filter((row) => row.status === 'approved' || row.status === 'needs approval')
    .sort((left, right) => priorityWeight(left.priority) - priorityWeight(right.priority))
    .slice(0, 5);
  const proofFollowUps = queueRows
    .filter((row) => row.status === 'rss-connected' || row.status === 'unverified')
    .sort((left, right) => priorityWeight(left.priority) - priorityWeight(right.priority))
    .slice(0, 5);
  const payload = { candidates, proofFollowUps, qualityReports };

  emit(command, payload, [
    'Next promotion candidates',
    ...candidates.slice(0, 3).map(
      (row, index) =>
        `${index + 1}. [${row.priority}] ${row.page} via ${row.channel} - ${row.angle}. Gate: run matching quality report and verify public proof after posting.`,
    ),
    '',
    'Proof follow-ups',
    ...(proofFollowUps.length
      ? proofFollowUps.slice(0, 3).map((row) => `- ${row.page} via ${row.channel}: ${row.status}. ${row.nextAction}`)
      : ['- None found.']),
    '',
    `Quality: ${qualityReports.map(formatQuality).join('; ')}`,
  ]);
}

function indexingGapsCommand(command) {
  const gaps = getIndexingGaps();
  const coverageExport = getCoverageExportSummary();
  const coverageDrilldown = getCoverageDrilldownSummary();
  const performanceExport = getPerformanceExportSummary();
  const indexingRequests = getSearchConsoleIndexingRequests();
  const gapsWithRequestProof = gaps.map((gap) => {
    const indexingRequest = searchConsoleIndexingRequestForUrl(gap.url, indexingRequests);
    const indexingDeferred = searchConsoleIndexingDeferredForUrl(gap.url, indexingRequests);

    return {
      ...gap,
      indexingDeferred: indexingDeferred
        ? {
            attemptedAt: indexingDeferred.attemptedAt ?? '',
            reason: indexingDeferred.reason ?? '',
          }
        : null,
      indexingRequest: indexingRequest
        ? {
            requestedAt: indexingRequest.requestedAt ?? '',
            result: indexingRequest.result ?? '',
          }
        : null,
    };
  });
  const payload = {
    count: gaps.length,
    coverageDrilldown,
    coverageExport,
    gaps: gapsWithRequestProof.slice(0, 20),
    indexingRequests: {
      generatedAt: indexingRequests.generatedAt,
      deferredCurrentGaps: gapsWithRequestProof.filter((gap) => gap.indexingDeferred && !gap.indexingRequest).length,
      matchedCurrentGaps: gapsWithRequestProof.filter((gap) => gap.indexingRequest).length,
      deferredTotal: indexingRequests.deferred.length,
      total: indexingRequests.requests.length,
    },
    performanceExport,
  };

  emit(command, payload, [
    `Indexing gaps: ${gaps.length}`,
    ...gapsWithRequestProof.slice(0, 10).map((gap, index) => {
      const requestedAt = gap.indexingRequest ? formatIndexingRequestTime(gap.indexingRequest) : '';
      return `${index + 1}. ${gap.url} - ${gap.state}${gap.lastCrawlTime ? ` (last crawl ${gap.lastCrawlTime})` : ''}${
        requestedAt ? `; request-indexing submitted ${requestedAt}` : ''
      }${!gap.indexingRequest && gap.indexingDeferred ? `; request deferred: ${gap.indexingDeferred.reason}` : ''}`;
    }),
    coverageExport
      ? `Coverage export: latest ${coverageExport.latest?.date ?? 'unknown'} has ${coverageExport.totals?.latestIndexed ?? 'unknown'} indexed and ${coverageExport.totals?.latestNotIndexed ?? 'unknown'} not indexed; critical buckets total ${coverageExport.totals?.criticalPages ?? 'unknown'} pages.`
      : 'Coverage export: not imported yet. Run npm run search-console:import-coverage after downloading Google Coverage CSVs.',
    ...(coverageExport?.criticalIssues?.length
      ? coverageExport.criticalIssues.map((issue) => `- ${issue.reason}: ${issue.pages} page(s), validation ${issue.validation}`)
      : []),
    coverageDrilldown
      ? `Coverage drilldown: ${coverageDrilldown.issue}, ${coverageDrilldown.totals?.rowCount ?? 0} URL example(s); types ${Object.entries(
          coverageDrilldown.totals?.rowsByType ?? {},
        )
          .map(([type, count]) => `${type} ${count}`)
          .join(', ') || 'unknown'}.`
      : 'Coverage drilldown: not imported yet. Run npm run search-console:import-coverage-drilldown after downloading a Coverage Drilldown export.',
    performanceExport
      ? `Performance/deindex export: ${performanceExport.totals?.deindexedRows ?? 0} deindexed URLs, ${performanceExport.totals?.pageImpressions ?? 'unknown'} page impressions, ${performanceExport.totals?.pageClicks ?? 'unknown'} page clicks.`
      : 'Performance/deindex export: not imported yet. Run npm run search-console:import-performance after downloading Search Performance CSVs.',
    ...(performanceExport?.tierARecovery?.length
      ? [`Tier A recovery sample: ${performanceExport.tierARecovery.slice(0, 5).map((item) => item.path).join(', ')}`]
      : []),
    coverageDrilldown?.actions?.length
      ? `Coverage drilldown action: ${coverageDrilldown.actions[0].priority}: ${coverageDrilldown.actions[0].task}`
      : coverageExport?.actions?.length
      ? `Coverage action: ${coverageExport.actions[0].priority}: ${coverageExport.actions[0].task}`
      : indexingGapRecommendation(gaps, indexingRequests),
  ]);
}

function indexingProtectionCommand(command) {
  const run = runNodeScript('scripts/indexing-protection-audit.mjs');
  const latest = newestReportUnder('output/indexing-protection');
  const report = latest?.report ?? null;
  const payload = {
    run,
    report,
    reportPath: latest ? relative(root, latest.file).replace(/\\/g, '/') : '',
  };
  const gaps = report?.searchConsole?.gaps ?? [];

  emit(command, payload, [
    'Indexing protection audit',
    `- Refresh: ${run.status === 0 ? 'ok' : `failed (${run.status})`}`,
    `- Report: ${payload.reportPath || 'not found'}`,
    `- HTML pages: ${report?.totals?.auditedPages ?? 'unknown'}`,
    `- High local issues: ${report?.totals?.highIssues ?? 'unknown'}`,
    `- Search Console gaps: ${report?.totals?.searchConsoleGaps ?? 'unknown'}`,
    `- CrawlScout non-indexed/submitted sample: ${report?.totals?.crawlScoutNonIndexedSample ?? 'unknown'}`,
    gaps.length ? '- Gap sample:' : '- Gap sample: none',
    ...gaps.slice(0, 5).map((gap) => `  - ${gap.url}: ${gap.state}`),
  ]);

  if (run.status !== 0) process.exitCode = run.status;
}

function aiCrawlerCommand(command) {
  const run = runNodeScript('scripts/ai-crawler-visibility-audit.mjs');
  const latest = newestReportUnder('output/ai-crawler-visibility');
  const report = latest?.report ?? null;
  const payload = {
    run,
    report,
    reportPath: latest ? relative(root, latest.file).replace(/\\/g, '/') : '',
  };

  emit(command, payload, [
    'AI crawler visibility audit',
    `- Refresh: ${run.status === 0 ? 'ok' : `failed (${run.status})`}`,
    `- Report: ${payload.reportPath || 'not found'}`,
    `- Priority pages: ${report?.totals?.pages ?? 'unknown'}`,
    `- Passed: ${report?.totals?.passed ?? 'unknown'}`,
    `- Watch: ${report?.totals?.watch ?? 'unknown'}`,
    `- Review: ${report?.totals?.review ?? 'unknown'}`,
    `- Mode: ${report?.auditMode ?? 'local built HTML inspection'}`,
    '- Modeled crawler profiles: Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, non-JS text fetcher',
  ]);

  if (run.status !== 0) process.exitCode = run.status;
}

function hubStrengthCommand(command) {
  const run = runNodeScript('scripts/hub-strength-audit.mjs');
  const latest = newestReportUnder('output/hub-strength');
  const report = latest?.report ?? null;
  const payload = {
    run,
    report,
    reportPath: latest ? relative(root, latest.file).replace(/\\/g, '/') : '',
  };

  emit(command, payload, [
    'Hub strength audit',
    `- Refresh: ${run.status === 0 ? 'ok' : `failed (${run.status})`}`,
    `- Report: ${payload.reportPath || 'not found'}`,
    `- Hubs checked: ${report?.totals?.hubs ?? 'unknown'}`,
    `- Passed: ${report?.totals?.passed ?? 'unknown'}`,
    `- Watch: ${report?.totals?.watch ?? 'unknown'}`,
    `- Failed: ${report?.totals?.failed ?? 'unknown'}`,
    ...(Array.isArray(report?.hubs)
      ? report.hubs
          .filter((hub) => hub.status !== 'passed')
          .slice(0, 5)
          .map((hub) => `  - ${hub.label}: ${hub.issues?.join(' | ') || hub.status}`)
      : []),
  ]);

  if (run.status !== 0) process.exitCode = run.status;
}

function semanticDepthCommand(command) {
  const run = runNodeScript('scripts/semantic-depth-audit.mjs');
  const latest = newestReportUnder('output/semantic-depth');
  const report = latest?.report ?? null;
  const payload = {
    run,
    report,
    reportPath: latest ? relative(root, latest.file).replace(/\\/g, '/') : '',
  };

  emit(command, payload, [
    'Priority semantic depth audit',
    `- Refresh: ${run.status === 0 ? 'ok' : `failed (${run.status})`}`,
    `- Report: ${payload.reportPath || 'not found'}`,
    `- Priority tools checked: ${report?.totals?.tools ?? 'unknown'}`,
    `- Passed: ${report?.totals?.passed ?? 'unknown'}`,
    `- Watch: ${report?.totals?.watch ?? 'unknown'}`,
    `- Failed: ${report?.totals?.failed ?? 'unknown'}`,
    ...(Array.isArray(report?.tools)
      ? report.tools
          .filter((tool) => tool.status !== 'passed')
          .slice(0, 5)
          .map((tool) => `  - ${tool.label}: ${tool.issues?.join(' | ') || tool.warnings?.join(' | ') || tool.status}`)
      : []),
  ]);

  if (run.status !== 0) process.exitCode = run.status;
}

function recognitionCommand(command) {
  const run = runNodeScript('scripts/recognition-tracker.mjs');
  const latest = newestReportUnder('output/recognition-tracker');
  const report = latest?.report ?? null;
  const payload = {
    run,
    report,
    reportPath: latest ? relative(root, latest.file).replace(/\\/g, '/') : '',
  };

  emit(command, payload, [
    'Recognition tracker',
    `- Refresh: ${run.status === 0 ? 'ok' : `failed (${run.status})`}`,
    `- Report: ${payload.reportPath || 'not found'}`,
    `- Public proof URLs: ${report?.totals?.publicProofUrls ?? 'unknown'}`,
    `- Blocked platforms: ${report?.totals?.blockedPlatforms ?? 'unknown'}`,
    `- Claimed rows missing proof: ${report?.totals?.claimedWithoutProof ?? 'unknown'}`,
    ...(Array.isArray(report?.platforms)
      ? report.platforms.map((platform) => `  - ${platform.label}: ${platform.status} (${platform.publicProofUrls?.length ?? 0} proof URL(s))`)
      : []),
  ]);

  if (run.status !== 0) process.exitCode = run.status;
}

function usageNotesCommand(command) {
  const days = Number(command.days ?? command.opts?.().days ?? 30);
  const run = runNodeScript('scripts/usage-data-asset-report.mjs', [`--days=${days}`]);
  const latest = newestReportUnder('output/original-data-assets');
  const report = latest?.report ?? null;
  const payload = {
    run,
    report,
    reportPath: latest ? relative(root, latest.file).replace(/\\/g, '/') : '',
  };

  emit(command, payload, [
    `Original data asset readiness: last ${days} days`,
    `- Refresh: ${run.status === 0 ? 'ok' : `failed (${run.status})`}`,
    `- Report: ${payload.reportPath || 'not found'}`,
    `- Status: ${report?.status ?? 'unknown'}`,
    `- Visitors: ${report?.totals?.visitors ?? 'unknown'}`,
    `- Page views: ${report?.totals?.pageViews ?? 'unknown'}`,
    `- Tool actions: ${report?.totals?.toolActions ?? 'unknown'}`,
    ...(Array.isArray(report?.readinessIssues) && report.readinessIssues.length
      ? report.readinessIssues.map((issue) => `  - ${issue}`)
      : ['  - No readiness blockers in current report.']),
  ]);

  if (run.status !== 0) process.exitCode = run.status;
}

function usageSummaryCommand(command) {
  const days = Number(command.days ?? command.opts?.().days ?? 30);
  const summary = analyticsSummary(days);
  const payload = { days, ...summary };

  emit(command, payload, [
    `Usage summary: last ${days} days`,
    `- Events file: ${summary.hasEventsFile ? summary.eventsPath : 'not found yet'}`,
    `- Today: ${summary.today.visitors} visitors (${summary.today.newVisitors} new, ${summary.today.returningVisitors} returning), ${summary.today.pageViews} page views, ${summary.today.toolActions} tool uses`,
    `- All time: ${summary.allTime.visitors} visitors, ${summary.allTime.pageViews} page views, ${summary.allTime.toolActions} tool uses`,
    '- Top tools:',
    ...(summary.topTools.length
      ? summary.topTools.slice(0, 5).map((item, index) => `  ${index + 1}. ${item.label} - ${item.count} uses`)
      : [`  No tool actions recorded in the last ${days} days.`]),
    '- Top pages:',
    ...(summary.topPages.length
      ? summary.topPages.slice(0, 5).map((item, index) => `  ${index + 1}. ${item.label} - ${item.count} views`)
      : [`  No page views recorded in the last ${days} days.`]),
  ]);
}

function siteSitemapCommand(command) {
  const urls = readSitemapUrls();
  const urlList = [...urls];
  const groups = {
    total: urlList.length,
    tools: urlList.filter((url) => url.includes('/tools/')).length,
    blogs: urlList.filter((url) => url.includes('/blog/')).length,
    categories: urlList.filter((url) => url.includes('/categories/')).length,
    hasHtmlSitemap: urlList.includes(`${SITE_ORIGIN}/sitemap/`),
    hasXmlIndex: existsSync(join(root, 'dist', 'client', 'sitemap.xml')) || existsSync(join(root, 'dist', 'sitemap.xml')),
    htmlSitemapSource: existsSync(join(root, 'src', 'pages', 'sitemap.astro')),
  };
  const payload = { groups, sample: urlList.slice(0, 20) };

  emit(command, payload, [
    'Site sitemap summary',
    `- Built sitemap URLs: ${groups.total || 'not found; run npm run build first'}`,
    `- Tools: ${groups.tools}; guides: ${groups.blogs}; categories: ${groups.categories}`,
    `- HTML sitemap source: ${groups.htmlSitemapSource ? 'present' : 'missing'}`,
    `- HTML sitemap in built XML: ${groups.hasHtmlSitemap ? 'yes' : 'no'}`,
    `- XML sitemap index: ${groups.hasXmlIndex ? 'present' : 'not found'}`,
  ]);
}

function pageSeoCommand(slug, command) {
  const source = findToolSource(slug);
  const built = builtPageSeo(slug);
  const sitemapUrls = readSitemapUrls();
  const expectedToolUrl = `${SITE_ORIGIN}/tools/${slug}/`;
  const expectedGuideUrl = `${SITE_ORIGIN}/blog/how-to-use-${slug}/`;
  const sitemapHasTool = sitemapUrls.has(expectedToolUrl);
  const sitemapHasGuide = sitemapUrls.has(expectedGuideUrl);
  const guideFound = sourceMentionsGuide(slug) || sitemapHasGuide;
  const issues = [];
  const warnings = [];

  if (!source) {
    issues.push(`No tool source record found for ${slug}.`);
  } else {
    if (source.faqCount < 6) issues.push(`FAQ count is ${source.faqCount}; expected 6 or more.`);
    if (source.exampleCount < 3) issues.push(`Example count is ${source.exampleCount}; expected 3 or more.`);
    if (!source.seoTitle) issues.push('Missing seoTitle in source.');
    if (!source.seoDescription) issues.push('Missing seoDescription in source.');
    if (source.seoDescription && source.seoDescription.length < 45) warnings.push(`seoDescription is short at ${source.seoDescription.length} characters.`);
    if (source.seoDescription && source.seoDescription.length > 190) issues.push(`seoDescription is long at ${source.seoDescription.length} characters.`);
    if (!source.relatedSlugs.length) warnings.push('No relatedSlugs found.');
    const missingRelated = source.relatedSlugs.filter((relatedSlug) => !slugExists(relatedSlug));
    if (missingRelated.length) issues.push(`Missing related tool records: ${missingRelated.join(', ')}.`);
  }

  if (!built && existsSync(join(root, 'dist'))) {
    warnings.push('Built tool page was not found in dist. Run npm run build if this snapshot is stale.');
  }

  if (built) {
    if (!built.title) issues.push('Built page is missing title.');
    if (!built.description) issues.push('Built page is missing meta description.');
    if (built.h1.length !== 1) issues.push(`Built page has ${built.h1.length} H1 elements; expected 1.`);
    if (built.canonical && built.canonical !== expectedToolUrl) warnings.push(`Canonical is ${built.canonical}; expected ${expectedToolUrl}.`);
    if (!built.hasGuideLink) warnings.push(`Built tool page does not link to ${expectedGuideUrl}.`);
  }

  if (sitemapUrls.size && !sitemapHasTool) issues.push(`Sitemap does not include ${expectedToolUrl}.`);
  if (!guideFound) warnings.push(`No matching guide found for /blog/how-to-use-${slug}/.`);

  const payload = {
    slug,
    expectedToolUrl,
    expectedGuideUrl,
    source,
    built,
    sitemap: { checked: sitemapUrls.size > 0, hasTool: sitemapHasTool, hasGuide: sitemapHasGuide },
    guideFound,
    issues,
    warnings,
  };

  emit(command, payload, [
    `Page SEO: ${slug}`,
    source ? `- Source: ${source.name} (${source.category}) in ${source.file}` : '- Source: missing',
    source ? `- Source counts: ${source.exampleCount} examples, ${source.faqCount} FAQs, ${source.relatedSlugs.length} related` : '',
    built ? `- Built page: ${built.htmlPath}; H1 ${built.h1.length}; ${built.internalLinkCount} internal links` : '- Built page: not found',
    `- Sitemap: tool ${sitemapHasTool ? 'yes' : 'no'}, guide ${sitemapHasGuide ? 'yes' : 'no'}`,
    `- Matching guide: ${guideFound ? 'found' : 'not found'}`,
    issues.length ? `- Issues: ${issues.join(' | ')}` : '- Issues: none',
    warnings.length ? `- Warnings: ${warnings.join(' | ')}` : '- Warnings: none',
  ]);
}

function matchingMediumQualityResult(filePath) {
  const report = readJson(evidencePaths.mediumQuality);
  if (!report || report.parseError || !Array.isArray(report.results)) return null;
  const normalizedTarget = resolve(root, filePath).toLowerCase();

  return report.results.find((result) => resolve(result.file).toLowerCase() === normalizedTarget) ?? null;
}

function normalizeContentUrl(url) {
  return url.replace(/[).,;:!?]+$/g, '');
}

function isContentPageUrl(url) {
  return !/\.(?:jpg|jpeg|png|webp|gif|svg)(?:[?#].*)?$/i.test(url);
}

function contentScoreCommand(filePath, command) {
  const fullPath = resolve(root, filePath);

  if (!existsSync(fullPath) || !statSync(fullPath).isFile()) {
    console.error(`Content file not found: ${filePath}`);
    process.exitCode = 1;
    return;
  }

  const text = readFileSync(fullPath, 'utf8');
  const lower = text.toLowerCase();
  const mediumResult = matchingMediumQualityResult(filePath);
  const accessLinks = [
    ...new Set(
      [...text.matchAll(/https:\/\/accessfreetools\.com\/[^\s)`"<>]+/g)]
        .map((match) => normalizeContentUrl(match[0]))
        .filter(isContentPageUrl),
    ),
  ];
  const wordCount = (text.match(/\b[\w'-]+\b/g) ?? []).length;
  const headingCount = (text.match(/^#{1,3}\s+/gm) ?? []).length + (text.match(/<h[1-3]\b/gi) ?? []).length;
  const numberCount = (text.match(/\b\d+(?:\.\d+)?\b/g) ?? []).length;
  const genericHits = genericPhrases.filter((phrase) => lower.includes(phrase));
  const agentFacingHits = agentFacingPhrases.filter((phrase) => lower.includes(phrase));
  const issues = [];
  const warnings = [];
  const isMedium = /output[\\/]+promotion[\\/]+medium/i.test(fullPath);

  if (genericHits.length) issues.push(`Generic phrases: ${genericHits.join(', ')}`);
  if (agentFacingHits.length) issues.push(`Agent-facing phrases: ${agentFacingHits.join(', ')}`);
  if (isMedium && accessLinks.length < 2) issues.push('Medium draft should include at least two Access Free Tools links: source tool and matching guide.');
  if (!isMedium && accessLinks.length < 1) warnings.push('No Access Free Tools link found.');
  if (wordCount < 250) warnings.push(`Short draft: ${wordCount} words.`);
  if (headingCount < 2) warnings.push(`Low heading count: ${headingCount}.`);
  if (numberCount < 1) warnings.push('No numbers or concrete examples detected.');
  if (mediumResult?.errors?.length) issues.push(...mediumResult.errors);
  if (mediumResult?.warnings?.length) warnings.push(...mediumResult.warnings);

  const payload = {
    file: relative(root, fullPath).replace(/\\/g, '/'),
    wordCount,
    headingCount,
    numberCount,
    accessLinks,
    genericHits,
    agentFacingHits,
    mediumQuality: mediumResult
      ? {
          title: mediumResult.title,
          scores: mediumResult.scores,
          heroLayoutStatus: mediumResult.reviewerSignals?.heroLayoutStatus ?? '',
        }
      : null,
    issues,
    warnings,
  };
  let strictReport = null;
  try {
    strictReport = runContentQualityReport(filePath);
    payload.agentToolsReport = {
      issues: strictReport.issues,
      paths: strictReport.paths,
      status: strictReport.status,
      warnings: strictReport.warnings,
    };
    for (const issue of strictReport.issues ?? []) {
      if (!payload.issues.includes(issue)) payload.issues.push(issue);
    }
    for (const warning of strictReport.warnings ?? []) {
      if (!payload.warnings.includes(warning)) payload.warnings.push(warning);
    }
  } catch (error) {
    payload.agentToolsReport = {
      error: error instanceof Error ? error.message : String(error),
      status: 'fail',
    };
    payload.issues.push(`Agent tools content report failed: ${payload.agentToolsReport.error}`);
  }

  emit(command, payload, [
    `Content score: ${payload.file}`,
    `- Words: ${wordCount}; headings: ${headingCount}; numbers: ${numberCount}; Access Free Tools links: ${accessLinks.length}`,
    mediumResult ? `- Medium scores: SEO ${mediumResult.scores?.seo}, originality ${mediumResult.scores?.originality}, human interest ${mediumResult.scores?.humanInterest}, reader desire ${mediumResult.scores?.readerDesire}, overall ${mediumResult.scores?.overall}` : '- Medium report match: none',
    strictReport?.paths?.markdownPath ? `- Saved report: ${strictReport.paths.markdownPath}` : '',
    payload.issues.length ? `- Issues: ${payload.issues.join(' | ')}` : '- Issues: none',
    payload.warnings.length ? `- Warnings: ${payload.warnings.join(' | ')}` : '- Warnings: none',
  ]);
}

async function askAuditCommand(command) {
  const report = await runAskAudit({ browser: !command.skipBrowser, site: command.site ?? command.opts?.().site });
  emit(command, report, [
    `Ask quality audit: ${report.status}`,
    `- Site: ${report.site}`,
    `- Cases: ${report.summary.cases}; issues: ${report.summary.issues}; warnings: ${report.summary.warnings}`,
    `- Saved report: ${report.paths.markdownPath}`,
    report.issues.length ? `- Issues: ${report.issues.join(' | ')}` : '- Issues: none',
    report.warnings.length ? `- Warnings: ${report.warnings.slice(0, 3).join(' | ')}` : '- Warnings: none',
  ]);
  if (report.status === 'fail') process.exitCode = 1;
}

function apiReadyCommand(command) {
  const report = buildApiReadyReport();
  emit(command, report, [
    `API registry builder: ${report.status}`,
    `- API-ready tools: ${report.summary.apiReadyTools}`,
    `- Candidates checked: ${report.summary.candidatesChecked}`,
    `- Saved report: ${report.paths.markdownPath}`,
    '- Recommended next:',
    ...report.recommendedNext.slice(0, 5).map((tool, index) => `  ${index + 1}. ${tool.name} (${tool.slug}) - score ${tool.score}, risk ${tool.risk}`),
  ]);
}

async function mcpSmokeCommand(command) {
  const report = await runMcpSmoke({ site: command.site ?? command.opts?.().site });
  emit(command, report, [
    `MCP smoke: ${report.status}`,
    `- Site: ${report.site}`,
    `- Checks: ${report.summary.checks}; issues: ${report.summary.issues}`,
    `- Saved report: ${report.paths.markdownPath}`,
    report.issues.length ? `- Issues: ${report.issues.join(' | ')}` : '- Issues: none',
  ]);
  if (report.status === 'fail') process.exitCode = 1;
}

function linkHelperCommand(command) {
  const report = buildLinkHelperReport();
  emit(command, report, [
    `Internal link helper: ${report.status}`,
    `- Sitemap URLs: ${report.sitemap.urlCount || 'not enough data'}`,
    `- Suggestions: ${report.suggestions.length}`,
    `- Saved report: ${report.paths.markdownPath}`,
    '- Top suggestions:',
    ...report.suggestions.slice(0, 5).map((item, index) => `  ${index + 1}. ${item.priority}: ${item.target} (${item.reason})`),
    report.warnings.length ? `- Source warnings: ${report.warnings.join(' | ')}` : '- Source warnings: none',
  ]);
}

function seoConsoleCommand(command) {
  const report = buildSeoConsoleReport();
  emit(command, report, [
    `Agent SEO fix console: ${report.status}`,
    `- Saved report: ${report.paths.markdownPath}`,
    '- Next actions:',
    ...report.actions.slice(0, 5).map((item, index) => `  ${index + 1}. ${item.priority}: ${item.task}`),
    report.warnings.length ? `- Source warnings: ${report.warnings.join(' | ')}` : '- Source warnings: none',
  ]);
}

function seoToolQueueCommand(command) {
  const report = buildSeoToolQueueReport();
  const gateLines = report.approvalGate?.blocked
    ? [
        `- Active approval gate: ${report.approvalGate.slug} ${report.approvalGate.page} (${report.approvalGate.status})`,
        `- Gate action: ${report.approvalGate.reason}`,
        '- Next ranked pages after gate:',
      ]
    : ['- Active approval gate: none', '- Next pages:'];
  emit(command, report, [
    `SEO tool/page queue: ${report.status}`,
    `- Tools: ${report.summary.tools}`,
    `- Page review units: ${report.summary.pages}`,
    `- Approved page review units: ${report.summary.approvedPages}`,
    `- Remaining page review units: ${report.summary.remainingPages}`,
    `- Approval unit: ${report.summary.approvalUnit}`,
    `- Saved report: ${report.paths.markdownPath}`,
    ...gateLines,
    ...report.entries.slice(0, 5).map((entry, index) => `  ${index + 1}. ${entry.slug} ${entry.page} - score ${entry.priorityScore}; ${entry.priorityReasons.join('; ')}`),
  ]);
}

function pageOption(command, pageArg = '') {
  const cleanArg = String(pageArg || '').toLowerCase();
  if (cleanArg === 'tool' || cleanArg === 'blog') return cleanArg;
  return optionValue(command, 'page', 'tool');
}

function seoToolResearchCommand(slug, pageArg, command) {
  const page = pageOption(command, pageArg);
  const report = buildSeoToolResearchReport(slug, { page });
  emit(command, report, [
    `SEO page research: ${report.status}`,
    `- Tool: ${report.tool.name}`,
    `- Page: ${report.page}`,
    `- URL: ${report.url}`,
    `- Saved report: ${report.paths.markdownPath}`,
    `- Built proof: ${report.builtProof.exists ? report.builtProof.path : report.builtProof.note}`,
    `- Tone score: ${report.tone.score}; generic hits: ${report.tone.genericHits.length ? report.tone.genericHits.join(', ') : 'none'}`,
    `- Paid competitor research: ${report.paidResearch.allowed ? 'allowed' : 'blocked until explicit approval'}`,
    '- Proof commands:',
    ...report.proofCommands.map((cmd) => `  - ${cmd}`),
  ]);
}

async function seoCompetitorGapCommand(slug, args, command) {
  const extraArgs = Array.isArray(args) ? args : [];
  const positionalPage = extraArgs.find((value) => /^(tool|blog)$/i.test(value));
  const page = pageOption(command, positionalPage);
  const opts = typeof command?.opts === 'function' ? command.opts() : {};
  const rawEnvUrl = String(process.env.npm_config_url ?? '');
  const envUrls = /^(true|false)$/i.test(rawEnvUrl)
    ? []
    : rawEnvUrl
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);
  const positionalUrls = extraArgs.filter((value) => /^https?:\/\//i.test(value));
  const urls = [...(Array.isArray(opts.url) ? opts.url : []), ...envUrls, ...positionalUrls];
  const report = await runSeoCompetitorGapReport(slug, { page, urls });
  emit(command, report, [
    `SEO competitor gap: ${report.status}`,
    `- Page: ${report.page}`,
    `- Competitors scored: ${report.competitors.filter((item) => item.status === 'scored').length}/${report.competitors.length}`,
    `- Saved report: ${report.paths.markdownPath}`,
    `- Paid research: ${report.paidResearch.allowed ? 'allowed' : 'blocked until explicit approval'}`,
    report.fetchResults?.length
      ? `- Fetch results: ${report.fetchResults.map((item) => `${item.url} ${item.status}${item.httpStatus ? ` ${item.httpStatus}` : ''}`).join(' | ')}`
      : '- Fetch results: none',
    report.warnings.length ? `- Warnings: ${report.warnings.join(' | ')}` : '- Warnings: none',
    '- Gaps we can fill:',
    ...report.opportunities.slice(0, 6).map((item) => `  - ${item}`),
  ]);
}

function seoPageScoreCommand(slug, pageArg, command) {
  const page = pageOption(command, pageArg);
  const report = buildSeoPageScoreReport(slug, { page });
  emit(command, report, [
    `SEO page score: ${report.status}`,
    `- Page: ${report.page}`,
    `- URL: ${report.url}`,
    `- Overall score: ${report.score.overall}`,
    `- Saved report: ${report.paths.markdownPath}`,
    `- Built proof: ${report.builtProof.exists ? report.builtProof.path : report.builtProof.note}`,
    report.issues.length ? `- Issues: ${report.issues.join(' | ')}` : '- Issues: none',
    report.warnings.length ? `- Warnings: ${report.warnings.join(' | ')}` : '- Warnings: none',
  ]);
}

function seoApprovalStatusCommand(slug, command) {
  const report = buildSeoApprovalStatusReport(slug);
  emit(command, report, [
    `SEO approval status: ${report.status}`,
    `- Slug: ${report.slug}`,
    `- Tool page: ${report.pages.tool.status}${report.pages.tool.approved ? ` by ${report.pages.tool.approvedBy || 'human'}` : ''}`,
    `- Blog page: ${report.pages.blog.status}${report.pages.blog.approved ? ` by ${report.pages.blog.approvedBy || 'human'}` : ''}`,
    `- Can proceed to next slug: ${report.canProceedToNext ? 'yes' : 'no'}`,
    report.blockedReason ? `- Blocked: ${report.blockedReason}` : '',
    `- Saved report: ${report.paths.markdownPath}`,
  ]);
}

function routeCommand(taskParts, command) {
  const task = Array.isArray(taskParts) ? taskParts.join(' ') : String(taskParts ?? '');
  const report = buildAgentRouteReport(task);
  emit(command, report, [
    `Agent route: ${report.status}`,
    `- Lane: ${report.lane}`,
    `- Primary lens: ${report.primaryLens}`,
    `- Proof lens: ${report.proofLens}`,
    `- Saved report: ${report.paths.markdownPath}`,
    '- Read first:',
    ...report.docs.slice(0, 5).map((doc) => `  - ${doc}`),
    '- Run:',
    ...report.commands.map((cmd) => `  - ${cmd}`),
    report.issues.length ? `- Issues: ${report.issues.join(' | ')}` : '- Issues: none',
  ]);
}

function evidencePackCommand(lane, command) {
  const report = buildEvidencePackReport(lane);
  emit(command, report, [
    `Evidence pack: ${report.status}`,
    `- Lane: ${report.lane}`,
    `- Primary lens: ${report.primaryLens}`,
    `- Proof lens: ${report.proofLens}`,
    `- Saved report: ${report.paths.markdownPath}`,
    report.warnings.length ? `- Warnings: ${report.warnings.join(' | ')}` : '- Warnings: none',
    '- Commands:',
    ...report.commands.map((cmd) => `  - ${cmd}`),
  ]);
}

async function claimCheckCommand(claimParts, command) {
  const claim = Array.isArray(claimParts) ? claimParts.join(' ') : String(claimParts ?? '');
  const verifyUrls =
    command.verifyUrls ||
    process.env.npm_config_verify_urls === 'true' ||
    process.env.npm_config_verify_urls === '';
  const report = verifyUrls
    ? await runClaimCheckReport(claim, { verifyUrls: true })
    : buildClaimCheckReport(claim);
  emit(command, report, [
    `Claim check: ${report.status}`,
    `- Claim type: ${report.claimType}`,
    `- Saved report: ${report.paths.markdownPath}`,
    report.evidence.publicUrls.length ? `- Public URLs: ${report.evidence.publicUrls.join(', ')}` : '- Public URLs: none',
    report.evidence.outputPaths.length ? `- Output paths: ${report.evidence.outputPaths.join(', ')}` : '- Output paths: none',
    report.evidence.publicUrlChecks?.length
      ? `- URL checks: ${report.evidence.publicUrlChecks.map((item) => `${item.url} ${item.status}`).join(', ')}`
      : '',
    report.issues.length ? `- Issues: ${report.issues.join(' | ')}` : '- Issues: none',
    report.warnings.length ? `- Warnings: ${report.warnings.join(' | ')}` : '',
  ]);
  if (report.status === 'fail') process.exitCode = 1;
}

function toolBriefCommand(slug, command) {
  const report = buildToolBriefReport(slug);
  emit(command, report, [
    `Tool brief: ${report.status}`,
    `- Tool: ${report.tool?.name ?? slug}`,
    `- Slug: ${report.slug}`,
    `- Guide: ${report.guide.exists ? 'present' : 'missing'}`,
    `- API-ready: ${report.api.ready ? 'yes' : 'no'}`,
    `- Sitemap: ${report.sitemap.present ? 'present' : report.sitemap.note || 'not enough data'}`,
    `- Saved report: ${report.paths.markdownPath}`,
    '- Next proof commands:',
    ...report.nextProofCommands.map((cmd) => `  - ${cmd}`),
    report.issues.length ? `- Issues: ${report.issues.join(' | ')}` : '- Issues: none',
    report.warnings.length ? `- Warnings: ${report.warnings.join(' | ')}` : '',
  ]);
  if (report.status === 'fail') process.exitCode = 1;
}

function agentDoctorCommand(command) {
  const report = buildAgentDoctorReport();
  emit(command, report, [
    `Agent doctor: ${report.status}`,
    `- Docs checked: ${report.docs.length}`,
    `- Checks: ${report.checks.filter((check) => check.ok).length}/${report.checks.length}`,
    `- Saved report: ${report.paths.markdownPath}`,
    report.issues.length ? `- Issues: ${report.issues.join(' | ')}` : '- Issues: none',
    '- Commands:',
    ...report.commands.map((cmd) => `  - ${cmd}`),
  ]);
  if (report.status === 'fail') process.exitCode = 1;
}

function hasProof(row) {
  const text = `${row.page} ${row.nextAction}`.toLowerCase();
  return (
    /https?:\/\//i.test(text) ||
    /output\//i.test(text) ||
    (/public|live|verified|checked|showed|published/.test(text) && !/unverified/.test(text))
  );
}

function proofCheckCommand(command) {
  const rows = parseQueueRows(readText(evidencePaths.promotionQueue));
  const claimedRows = rows.filter((row) => row.status === 'posted' || row.status === 'done');
  const missingProof = claimedRows.filter((row) => !hasProof(row));
  const needsProof = rows.filter((row) => row.status === 'rss-connected' || row.status === 'unverified');
  const payload = {
    checked: claimedRows.length,
    missingProof,
    needsProof,
  };

  emit(command, payload, [
    `Proof check: ${claimedRows.length} claimed rows checked`,
    missingProof.length ? `- Missing proof on claimed rows: ${missingProof.length}` : '- Missing proof on claimed rows: none',
    ...missingProof.slice(0, 5).map((row) => `  - ${row.page} via ${row.channel}: ${row.status}`),
    needsProof.length ? `- Rows still needing public proof: ${needsProof.length}` : '- Rows still needing public proof: none',
    ...needsProof.slice(0, 5).map((row) => `  - ${row.page} via ${row.channel}: ${row.status}. ${row.nextAction}`),
  ]);
}

const program = new Command();

program
  .name('aft')
  .description('Internal Access Free Tools helper CLI for Codex agents.')
  .showHelpAfterError()
  .version('0.1.0');

program.command('status').description('Summarize repo, SEO, promotion, and quality report status.').option('--json', 'Output JSON.').action(statusCommand);

program.command('hostinger').description('Refresh and summarize read-only Hostinger hosting/API status.').option('--json', 'Output JSON.').action(hostingerCommand);

program.command('marketing').description('Refresh and summarize the marketing orchestrator report.').option('--json', 'Output JSON.').action(marketingCommand);

program.command('promote-next').description('Show the next safe promotion candidates and proof follow-ups.').option('--json', 'Output JSON.').action(promoteNextCommand);

program.command('indexing-gaps').description('Show current Search Console indexing gaps from local snapshots.').option('--json', 'Output JSON.').action(indexingGapsCommand);

program
  .command('indexing-protection')
  .description('Run the local indexing protection audit and summarize soft-404, sitemap, redirect, and discovery signals.')
  .option('--json', 'Output JSON.')
  .action(indexingProtectionCommand);

program
  .command('ai-crawler')
  .description('Run the AI crawler visibility audit for priority pages and non-JS crawler clarity.')
  .option('--json', 'Output JSON.')
  .action(aiCrawlerCommand);

program
  .command('hub-strength')
  .description('Run the hub strength audit for /tools/ and major category hubs.')
  .option('--json', 'Output JSON.')
  .action(hubStrengthCommand);

program
  .command('semantic-depth')
  .description('Run the first-batch priority tool semantic-depth audit.')
  .option('--json', 'Output JSON.')
  .action(semanticDepthCommand);

program
  .command('recognition')
  .description('Run the brand recognition tracker across owned promotion and search proof sources.')
  .option('--json', 'Output JSON.')
  .action(recognitionCommand);

program
  .command('usage-summary')
  .description('Summarize first-party anonymous page and tool-use analytics from local storage.')
  .option('--days <days>', 'Number of days to summarize.', '30')
  .option('--json', 'Output JSON.')
  .action(usageSummaryCommand);

program
  .command('usage-notes')
  .description('Create an original data asset readiness report from a privacy-safe production aggregate.')
  .option('--days <days>', 'Number of days to summarize.', '30')
  .option('--json', 'Output JSON.')
  .action(usageNotesCommand);

program
  .command('site-sitemap')
  .description('Summarize built XML sitemap coverage and the public HTML sitemap source.')
  .option('--json', 'Output JSON.')
  .action(siteSitemapCommand);

program
  .command('page-seo')
  .description('Check one tool page source, built page, sitemap, guide, and related-link basics.')
  .argument('<slug>', 'Tool slug, for example percentage-calculator.')
  .option('--json', 'Output JSON.')
  .action(pageSeoCommand);

program
  .command('content-score')
  .description('Score one draft/article file for generic copy, internal links, and agent-facing text.')
  .argument('<file>', 'Path to the content file.')
  .option('--json', 'Output JSON.')
  .action(contentScoreCommand);

program
  .command('ask-audit')
  .description('Compare Ask, REST run, MCP run_tool, and tool-page availability for API-ready starter examples.')
  .option('--site <url>', 'Site origin to audit.', SITE_ORIGIN)
  .option('--skip-browser', 'Skip rendered tool-page browser parity checks.')
  .option('--json', 'Output JSON.')
  .action(askAuditCommand);

program
  .command('api-ready')
  .description('Rank existing tools for safe future API registry expansion without generating code.')
  .option('--json', 'Output JSON.')
  .action(apiReadyCommand);

program
  .command('mcp-smoke')
  .description('Run a small MCP tools/list, search_tools, and run_tool smoke test.')
  .option('--site <url>', 'Site origin to audit.', SITE_ORIGIN)
  .option('--json', 'Output JSON.')
  .action(mcpSmokeCommand);

program
  .command('link-helper')
  .description('Recommend contextual internal links from Search Console, CrawlScout, sitemap, and analytics evidence.')
  .option('--json', 'Output JSON.')
  .action(linkHelperCommand);

program
  .command('seo-console')
  .description('Summarize current SEO/indexing evidence and report-only next fixes.')
  .option('--json', 'Output JSON.')
  .action(seoConsoleCommand);

program
  .command('seo-tool-queue')
  .description('Build the one-page-at-a-time SEO review queue for every tool and matching guide.')
  .option('--json', 'Output JSON.')
  .action(seoToolQueueCommand);

program
  .command('seo-tool-research')
  .description('Create the research pack for one tool page or matching blog guide.')
  .argument('<slug>', 'Tool slug, for example wallpaper-calculator.')
  .argument('[pageArg]', 'Optional page value when npm consumes --page.')
  .option('--page <page>', 'Page to review: tool or blog.', 'tool')
  .option('--json', 'Output JSON.')
  .action(seoToolResearchCommand);

program
  .command('seo-competitor-gap')
  .description('Fetch and score selected competitor pages for original SEO gap opportunities.')
  .argument('<slug>', 'Tool slug, for example wallpaper-calculator.')
  .argument('[args...]', 'Optional page/URL values when npm consumes --page or --url.')
  .option('--page <page>', 'Page to review: tool or blog.', 'tool')
  .option('--url <url>', 'Competitor URL to fetch and score. Repeat for multiple URLs.', collectOption, [])
  .option('--json', 'Output JSON.')
  .action(seoCompetitorGapCommand);

program
  .command('seo-page-score')
  .description('Score one Access Free Tools tool page or guide for SEO, tone, FAQ, links, and proof readiness.')
  .argument('<slug>', 'Tool slug, for example wallpaper-calculator.')
  .argument('[pageArg]', 'Optional page value when npm consumes --page.')
  .option('--page <page>', 'Page to score: tool or blog.', 'tool')
  .option('--json', 'Output JSON.')
  .action(seoPageScoreCommand);

program
  .command('seo-approval-status')
  .description('Show whether a tool page and blog guide have human approval before moving on.')
  .argument('<slug>', 'Tool slug, for example wallpaper-calculator.')
  .option('--json', 'Output JSON.')
  .action(seoApprovalStatusCommand);

program
  .command('route')
  .description('Route an agent task to the right local docs, specialist lenses, proof commands, and gates.')
  .argument('<task...>', 'Task text to route.')
  .option('--json', 'Output JSON.')
  .action(routeCommand);

program
  .command('evidence-pack')
  .description('Bundle the docs, proof commands, and latest evidence sources for an agent lane.')
  .argument('<lane>', 'Agent lane such as seo, api, promotion, deploy, analytics, automation, ui, or code.')
  .option('--json', 'Output JSON.')
  .action(evidencePackCommand);

program
  .command('claim-check')
  .description('Check whether a posted/fixed/live/done claim includes enough proof evidence.')
  .argument('<claim...>', 'Claim text to check.')
  .option('-u, --verify-urls', 'Fetch cited public URLs and fail the claim if any public proof URL is unreachable.')
  .option('--json', 'Output JSON.')
  .action(claimCheckCommand);

program
  .command('tool-brief')
  .description('Summarize one tool slug with tool, guide, API, sitemap, art, and proof-gap evidence.')
  .argument('<slug>', 'Tool slug, for example percentage-calculator.')
  .option('--json', 'Output JSON.')
  .action(toolBriefCommand);

program
  .command('agent-doctor')
  .description('Audit the local agent docs and helper command surface for missing routing or proof support.')
  .option('--json', 'Output JSON.')
  .action(agentDoctorCommand);

program.command('proof-check').description('Find promotion queue rows that still need public proof.').option('--json', 'Output JSON.').action(proofCheckCommand);

await program.parseAsync();
