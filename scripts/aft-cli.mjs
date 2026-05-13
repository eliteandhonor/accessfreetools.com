import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { Command } from 'commander';

const SITE_ORIGIN = 'https://accessfreetools.com';
const root = process.cwd();

const evidencePaths = {
  brandCode: 'docs/brand-code.md',
  agentCli: 'docs/agent-cli.md',
  marketingPlan: 'output/marketing-orchestrator/daily-plan.json',
  promotionQueue: 'docs/promotion-queue.md',
  seoEvaluation: 'output/seo-agent-self-evaluation.json',
  searchConsole: 'output/search-console-url-inspection.json',
  dataForSeoAccount: 'output/dataforseo-account.json',
  dataForSeoStatus: 'output/dataforseo-status.json',
  hostingerStatus: 'output/hostinger/status.json',
  mediumQuality: 'output/promotion/medium-quality-report.json',
  redditQuality: 'output/promotion/reddit-quality-report.json',
  blueskyQuality: 'output/promotion/bluesky/bluesky-quality-report.json',
  quoraQuality: 'output/promotion/quora-quality-report.json',
  pinterestRss: 'output/promotion/pinterest-rss-report.json',
};

const analyticsEventsPath = resolve(root, process.env.AFT_ANALYTICS_DIR ?? '.local/analytics', 'events.ndjson');

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

function runNodeScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
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
    const titleType = name.endsWith('Generator')
      ? 'Free Online Generator'
      : name.endsWith('Calculator')
        ? 'Free Online Calculator'
        : 'Free Online Tool';
    return {
      file: relative(root, file).replace(/\\/g, '/'),
      block,
      slug,
      name,
      category: extractProperty(block, 'category'),
      seoTitle: extractProperty(block, 'seoTitle') || (isUtilityFactoryBlock && name ? `${name} | ${titleType}` : ''),
      seoDescription: extractProperty(block, 'seoDescription') || (isUtilityFactoryBlock ? description : ''),
      faqCount: countProperty(block, 'question') + (isUtilityFactoryBlock ? 5 : 0),
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
  const distRoots = [join(root, 'dist', 'client'), join(root, 'dist')].filter(existsSync);
  const urls = new Set();

  for (const distRoot of distRoots) {
    const sitemapFiles = walk(distRoot, (file) => /^sitemap.*\.xml$/i.test(basename(file)));
    for (const sitemapFile of sitemapFiles) {
      const text = readFileSync(sitemapFile, 'utf8');
      for (const match of text.matchAll(/<loc>([\s\S]*?)<\/loc>/g)) {
        urls.add(decodeHtml(match[1].trim()));
      }
    }
  }

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
  const balance = getDataForSeoBalance();
  const hostinger = getHostingerStatus();
  const marketingPlan = readJson(evidencePaths.marketingPlan);

  const payload = {
    scripts: Object.keys(packageJson?.scripts ?? {}).length,
    brandCodePresent: Boolean(readText(evidencePaths.brandCode)),
    agentCliDocPresent: Boolean(readText(evidencePaths.agentCli)),
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
    qualityReports,
  };

  emit(command, payload, [
    'Access Free Tools agent CLI status',
    `- Scripts: ${payload.scripts}`,
    `- Brand code: ${payload.brandCodePresent ? 'present' : 'missing'}`,
    `- Agent CLI docs: ${payload.agentCliDocPresent ? 'present' : 'missing'}`,
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
  const payload = { count: gaps.length, gaps: gaps.slice(0, 20) };

  emit(command, payload, [
    `Indexing gaps: ${gaps.length}`,
    ...gaps.slice(0, 10).map((gap, index) => `${index + 1}. ${gap.url} - ${gap.state}${gap.lastCrawlTime ? ` (last crawl ${gap.lastCrawlTime})` : ''}`),
    gaps.length
      ? 'Recommended action: improve contextual internal links, submit discovery, and use one quality-passed promotion item when useful.'
      : 'No indexing gaps found in the current local snapshot.',
  ]);
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
      : ['  No tool actions recorded yet.']),
    '- Top pages:',
    ...(summary.topPages.length
      ? summary.topPages.slice(0, 5).map((item, index) => `  ${index + 1}. ${item.label} - ${item.count} views`)
      : ['  No page views recorded yet.']),
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

  emit(command, payload, [
    `Content score: ${payload.file}`,
    `- Words: ${wordCount}; headings: ${headingCount}; numbers: ${numberCount}; Access Free Tools links: ${accessLinks.length}`,
    mediumResult ? `- Medium scores: SEO ${mediumResult.scores?.seo}, originality ${mediumResult.scores?.originality}, human interest ${mediumResult.scores?.humanInterest}, reader desire ${mediumResult.scores?.readerDesire}, overall ${mediumResult.scores?.overall}` : '- Medium report match: none',
    issues.length ? `- Issues: ${issues.join(' | ')}` : '- Issues: none',
    warnings.length ? `- Warnings: ${warnings.join(' | ')}` : '- Warnings: none',
  ]);
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
  .command('usage-summary')
  .description('Summarize first-party anonymous page and tool-use analytics from local storage.')
  .option('--days <days>', 'Number of days to summarize.', '30')
  .option('--json', 'Output JSON.')
  .action(usageSummaryCommand);

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

program.command('proof-check').description('Find promotion queue rows that still need public proof.').option('--json', 'Output JSON.').action(proofCheckCommand);

program.parse();
