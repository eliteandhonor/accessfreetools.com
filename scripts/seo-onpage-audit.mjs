import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import {
  dataForSeoRequest,
  findDataForSeoService,
  getDataForSeoServiceStatus,
  getDataForSeoUserData,
  summarizeDataForSeoServiceStatus,
  summarizeDataForSeoUserData,
} from './lib/dataforseo.mjs';

const SITE_ORIGIN = 'https://accessfreetools.com/';
const DEFAULT_MAX_CRAWL_PAGES = 1000;
const DEFAULT_POLL_MS = 30_000;
const DEFAULT_TIMEOUT_MINUTES = 45;
const DEFAULT_WARN_BALANCE = 10;
const DEFAULT_MIN_BALANCE = 2;
const PRIORITY_WATERFALL_URLS = [
  'https://accessfreetools.com/',
  'https://accessfreetools.com/tools/',
  'https://accessfreetools.com/blog/',
  'https://accessfreetools.com/tools/mortgage-calculator/',
  'https://accessfreetools.com/tools/bmi-calculator/',
  'https://accessfreetools.com/tools/watts-to-amps-calculator/',
  'https://accessfreetools.com/tools/image-to-text-ocr-tool/',
];

function parseArgs() {
  const args = process.argv.slice(2);
  const option = (name, fallback = undefined) =>
    args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? fallback;

  return {
    target: option('--target', SITE_ORIGIN),
    maxCrawlPages: Number(option('--max-crawl-pages', DEFAULT_MAX_CRAWL_PAGES)),
    outputDir: resolve(option('--output-dir', join('output', 'dataforseo-onpage'))),
    pollMs: Number(option('--poll-ms', DEFAULT_POLL_MS)),
    timeoutMinutes: Number(option('--timeout-minutes', DEFAULT_TIMEOUT_MINUTES)),
    minBalance: Number(option('--min-balance', DEFAULT_MIN_BALANCE)),
    warnBalance: Number(option('--warn-balance', DEFAULT_WARN_BALANCE)),
    resumeTaskId: option('--resume-task-id', ''),
    sandbox: args.includes('--sandbox'),
    noWait: args.includes('--no-wait'),
    skipWaterfall: args.includes('--skip-waterfall'),
  };
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function asAbsoluteUrl(value) {
  const url = new URL(value);
  url.hash = '';
  return url.toString();
}

function taskResult(response) {
  return response?.tasks?.[0]?.result?.[0] ?? {};
}

function taskItems(response) {
  return taskResult(response).items ?? [];
}

function firstTaskId(response) {
  return response?.tasks?.[0]?.id ?? '';
}

function statusSummaryLine(summary) {
  const result = taskResult(summary);
  return `crawl ${result.crawl_progress ?? 'unknown'} | pages ${result.pages_in_queue ?? 0} queued, ${
    result.pages_crawled ?? 0
  } crawled | checks ${result.checks?.status ?? 'unknown'}`;
}

function pageUrl(item) {
  return item.url ?? item.page_url ?? item.resource_url ?? item.meta?.canonical ?? '';
}

function issueCount(items, predicate) {
  return items.filter(predicate).length;
}

function endpointPath(name) {
  return `/on_page/${name}`;
}

async function getEndpointReport(name, payload, options) {
  try {
    const response = await dataForSeoRequest(endpointPath(name), payload, options);
    return {
      ok: true,
      endpoint: name,
      response,
      itemCount: taskItems(response).length,
    };
  } catch (error) {
    return {
      ok: false,
      endpoint: name,
      message: error instanceof Error ? error.message : String(error),
      details: error?.details ?? null,
    };
  }
}

async function preflight(options) {
  const accountResponse = await getDataForSeoUserData();
  const account = summarizeDataForSeoUserData(accountResponse);

  if (!options.sandbox && account.balance <= options.minBalance) {
    throw new Error(
      `DataForSEO balance is ${account.balance.toFixed(2)} ${account.currency}, at or below the ${options.minBalance.toFixed(
        2,
      )} emergency top-up threshold.`,
    );
  }

  if (!options.sandbox && account.balance <= options.warnBalance) {
    throw new Error(
      `DataForSEO balance is ${account.balance.toFixed(2)} ${account.currency}, below the ${options.warnBalance.toFixed(
        2,
      )} paid crawl warning threshold.`,
    );
  }

  let serviceStatus;
  let serviceStatusWarning = '';

  try {
    serviceStatus = summarizeDataForSeoServiceStatus(await getDataForSeoServiceStatus({ sandbox: options.sandbox }));
  } catch (error) {
    if (!options.sandbox) {
      throw error;
    }

    serviceStatusWarning =
      error instanceof Error ? `Sandbox service status unavailable: ${error.message}` : `Sandbox service status unavailable.`;
    serviceStatus = {
      generatedAt: new Date().toISOString(),
      statusCode: null,
      statusMessage: 'sandbox-unavailable',
      rateLimit: error?.rateLimit ?? null,
      services: [],
      warning: serviceStatusWarning,
    };
  }
  const onPage = findDataForSeoService(serviceStatus, 'on_page');

  if (!options.sandbox && onPage?.status !== 'ok') {
    throw new Error(`DataForSEO OnPage service is not healthy: ${onPage?.status ?? 'missing'}`);
  }

  return { account, serviceStatus, serviceStatusWarning };
}

async function createTask(options) {
  const startUrl = asAbsoluteUrl(options.target);
  const targetHost = new URL(startUrl).hostname;
  const payload = {
    target: targetHost,
    start_url: startUrl,
    max_crawl_pages: options.maxCrawlPages,
    load_resources: true,
    enable_javascript: true,
    enable_browser_rendering: true,
    custom_user_agent:
      'AccessFreeToolsDeepAudit/1.0 (+https://accessfreetools.com/contact/; technical SEO audit)',
  };
  const response = await dataForSeoRequest('/on_page/task_post', payload, options);
  const taskId = firstTaskId(response);

  if (!taskId) {
    throw new Error('DataForSEO did not return an OnPage task id.');
  }

  return { taskId, payload, response };
}

async function waitForSummary(taskId, options) {
  const startedAt = Date.now();
  const timeoutAt = startedAt + options.timeoutMinutes * 60 * 1000;
  let lastSummary;

  while (Date.now() < timeoutAt) {
    try {
      lastSummary = await dataForSeoRequest(`/on_page/summary/${taskId}`, undefined, options);
    } catch (error) {
      const waiting = (error?.details?.statusIssues ?? []).some((issue) => issue.code === 40601 || issue.code === 40602);

      if (!waiting) {
        throw error;
      }

      console.log(`OnPage ${taskId}: task is still queued at DataForSEO`);
      await sleep(options.pollMs);
      continue;
    }

    const result = taskResult(lastSummary);
    console.log(`OnPage ${taskId}: ${statusSummaryLine(lastSummary)}`);

    if (result.crawl_progress === 'finished') {
      return lastSummary;
    }

    if (result.crawl_progress === 'failed') {
      throw new Error(`DataForSEO OnPage crawl failed for task ${taskId}.`);
    }

    await sleep(options.pollMs);
  }

  throw new Error(`Timed out waiting for DataForSEO OnPage task ${taskId}. Last summary saved in memory only.`);
}

function summarizeOnPage(taskId, reports) {
  const summary = taskResult(reports.summary);
  const pages = taskItems(reports.pages?.response);
  const resources = taskItems(reports.resources?.response);
  const links = taskItems(reports.links?.response);
  const duplicateTags = taskItems(reports.duplicateTags?.response);
  const nonIndexable = taskItems(reports.nonIndexable?.response);
  const redirectChains = taskItems(reports.redirectChains?.response);
  const duplicateContent = reports.duplicateContent ?? [];
  const waterfall = reports.waterfall ?? [];
  const lowScorePages = pages
    .filter((item) => Number(item.onpage_score ?? 100) < 80)
    .sort((a, b) => Number(a.onpage_score ?? 100) - Number(b.onpage_score ?? 100))
    .slice(0, 20);
  const brokenPages = pages.filter((item) => item.checks?.is_broken === true || Number(item.status_code ?? 200) >= 400);
  const missingTitle = issueCount(pages, (item) => !item.meta?.title);
  const missingDescription = issueCount(pages, (item) => !item.meta?.description);
  const titleTooLong = pages.filter((item) => item.checks?.title_too_long === true);
  const titleTooShort = pages.filter((item) => item.checks?.title_too_short === true);
  const lowContentRate = pages.filter((item) => item.checks?.low_content_rate === true || item.checks?.low_character_count === true);
  const largeResources = resources
    .filter((item) => Number(item.size ?? 0) > 500 * 1024)
    .sort((a, b) => Number(b.size ?? 0) - Number(a.size ?? 0))
    .slice(0, 20);
  const brokenLinks = links.filter((item) => item.is_broken || Number(item.status_code ?? 200) >= 400).slice(0, 50);

  return {
    generatedAt: new Date().toISOString(),
    taskId,
    crawlProgress: summary.crawl_progress ?? 'unknown',
    crawlStatus: summary.crawl_status ?? null,
    pagesCrawled: summary.crawl_status?.pages_crawled ?? summary.pages_crawled ?? pages.length,
    pagesInQueue: summary.crawl_status?.pages_in_queue ?? summary.pages_in_queue ?? 0,
    checks: summary.checks ?? {},
    pageMetrics: summary.page_metrics ?? {},
    counts: {
      pages: pages.length,
      resources: resources.length,
      links: links.length,
      duplicateTags: duplicateTags.length,
      duplicateContent: duplicateContent.length,
      nonIndexable: nonIndexable.length,
      redirectChains: redirectChains.length,
      waterfall: waterfall.length,
      brokenPages: brokenPages.length,
      brokenLinks: brokenLinks.length,
      missingTitle,
      missingDescription,
      titleTooLong: titleTooLong.length,
      titleTooShort: titleTooShort.length,
      lowContentRate: lowContentRate.length,
      lowScorePages: lowScorePages.length,
      largeResources: largeResources.length,
    },
    topIssues: {
      lowScorePages: lowScorePages.map((item) => ({
        url: pageUrl(item),
        statusCode: item.status_code ?? null,
        onpageScore: item.onpage_score ?? null,
        checks: item.checks ?? {},
      })),
      brokenPages: brokenPages.slice(0, 20).map((item) => ({
        url: pageUrl(item),
        statusCode: item.status_code ?? null,
        checks: item.checks ?? {},
      })),
      brokenLinks: brokenLinks.map((item) => ({
        url: item.url_to ?? item.url ?? '',
        source: item.url_from ?? '',
        statusCode: item.status_code ?? null,
      })),
      largeResources: largeResources.map((item) => ({
        url: item.url ?? item.resource_url ?? '',
        type: item.resource_type ?? item.content_type ?? '',
        size: item.size ?? 0,
      })),
      titleTooLong: titleTooLong.slice(0, 20).map((item) => ({
        url: pageUrl(item),
        title: item.meta?.title ?? '',
        titleLength: item.meta?.title_length ?? null,
      })),
      titleTooShort: titleTooShort.slice(0, 20).map((item) => ({
        url: pageUrl(item),
        title: item.meta?.title ?? '',
        titleLength: item.meta?.title_length ?? null,
      })),
      lowContentRate: lowContentRate.slice(0, 30).map((item) => ({
        url: pageUrl(item),
        title: item.meta?.title ?? '',
        onpageScore: item.onpage_score ?? null,
        lowContentRate: item.checks?.low_content_rate ?? false,
        lowCharacterCount: item.checks?.low_character_count ?? false,
      })),
      nonIndexable: nonIndexable.slice(0, 20).map((item) => ({
        url: pageUrl(item),
        reason: item.reason ?? item.checks ?? {},
      })),
      redirectChains: redirectChains.slice(0, 20),
      duplicateTags: duplicateTags.slice(0, 20),
      duplicateContent: duplicateContent.slice(0, 10).map((item) => ({
        url: item.url,
        ok: item.ok,
        itemCount: item.itemCount,
        message: item.message ?? '',
      })),
    },
  };
}

function markdownReport(summary) {
  const lines = [
    '# DataForSEO OnPage Audit',
    '',
    `Generated: ${summary.generatedAt}`,
    `Task: ${summary.taskId}`,
    `Crawl progress: ${summary.crawlProgress}`,
    `Pages crawled: ${summary.pagesCrawled}`,
    '',
    '## Counts',
    '',
  ];

  for (const [key, value] of Object.entries(summary.counts)) {
    lines.push(`- ${key}: ${value}`);
  }

  lines.push('', '## Priority Findings', '');

  if (summary.topIssues.brokenPages.length === 0 && summary.topIssues.brokenLinks.length === 0) {
    lines.push('- No broken pages or broken links were returned by the OnPage report.');
  }

  for (const item of summary.topIssues.lowScorePages.slice(0, 10)) {
    lines.push(`- Low score: ${item.url || 'unknown URL'} (${item.onpageScore ?? 'n/a'})`);
  }

  for (const item of summary.topIssues.brokenPages.slice(0, 10)) {
    lines.push(`- Broken page: ${item.url || 'unknown URL'} (${item.statusCode ?? 'n/a'})`);
  }

  for (const item of summary.topIssues.brokenLinks.slice(0, 10)) {
    lines.push(`- Broken link: ${item.url || 'unknown URL'} from ${item.source || 'unknown source'}`);
  }

  for (const item of summary.topIssues.largeResources.slice(0, 10)) {
    lines.push(`- Large resource: ${item.url || 'unknown URL'} (${Math.round(Number(item.size ?? 0) / 1024)} KB)`);
  }

  for (const item of summary.topIssues.titleTooLong.slice(0, 10)) {
    lines.push(`- Long title: ${item.url || 'unknown URL'} (${item.titleLength ?? 'n/a'} chars)`);
  }

  for (const item of summary.topIssues.lowContentRate.slice(0, 10)) {
    lines.push(`- Low content signal: ${item.url || 'unknown URL'} (${item.onpageScore ?? 'n/a'} score)`);
  }

  lines.push('', '## Next Action Rule', '');
  lines.push(
    'Treat this report as evidence. Fix confirmed hard issues first, then review low-score pages manually before changing titles, content, or redirects.',
  );

  return `${lines.join('\n')}\n`;
}

async function main() {
  const options = parseArgs();
  mkdirSync(options.outputDir, { recursive: true });
  console.log(`Saving DataForSEO OnPage audit evidence to ${options.outputDir}`);

  const preflightReport = await preflight(options);
  writeJson(join(options.outputDir, 'preflight.json'), {
    generatedAt: new Date().toISOString(),
    sandbox: options.sandbox,
    account: preflightReport.account,
    serviceStatus: preflightReport.serviceStatus,
    serviceStatusWarning: preflightReport.serviceStatusWarning,
  });

  if (preflightReport.serviceStatusWarning) {
    console.log(preflightReport.serviceStatusWarning);
  }

  let taskId = options.resumeTaskId;
  let taskPost;

  if (!taskId) {
    taskPost = await createTask(options);
    taskId = taskPost.taskId;
    writeJson(join(options.outputDir, 'task-post.json'), taskPost);
    console.log(`Created DataForSEO OnPage task ${taskId}`);
  } else {
    console.log(`Resuming DataForSEO OnPage task ${taskId}`);
  }

  if (options.noWait) {
    writeJson(join(options.outputDir, 'task-pending.json'), {
      generatedAt: new Date().toISOString(),
      taskId,
      note: 'Task was created but not waited on because --no-wait was passed.',
    });
    console.log(`Task ${taskId} created. Re-run with --resume-task-id=${taskId} to collect results.`);
    return;
  }

  const summary = await waitForSummary(taskId, options);
  writeJson(join(options.outputDir, 'summary.raw.json'), summary);

  const basePayload = { id: taskId, limit: options.maxCrawlPages };
  const reports = {
    summary,
    pages: await getEndpointReport('pages', basePayload, options),
    duplicateTags: await getEndpointReport('duplicate_tags', basePayload, options),
    nonIndexable: await getEndpointReport('non_indexable', basePayload, options),
    redirectChains: await getEndpointReport('redirect_chains', basePayload, options),
    links: await getEndpointReport('links', basePayload, options),
    resources: await getEndpointReport('resources', basePayload, options),
  };

  writeJson(join(options.outputDir, 'pages.raw.json'), reports.pages);
  writeJson(join(options.outputDir, 'duplicate-tags.raw.json'), reports.duplicateTags);
  writeJson(join(options.outputDir, 'non-indexable.raw.json'), reports.nonIndexable);
  writeJson(join(options.outputDir, 'redirect-chains.raw.json'), reports.redirectChains);
  writeJson(join(options.outputDir, 'links.raw.json'), reports.links);
  writeJson(join(options.outputDir, 'resources.raw.json'), reports.resources);

  const duplicateCandidates = taskItems(reports.pages.response)
    .filter((item) => item.duplicate_content === true || item.checks?.duplicate_content === true || item.checks?.is_duplicate === true)
    .map((item) => pageUrl(item))
    .filter(Boolean)
    .slice(0, 10);
  reports.duplicateContent = [];

  for (const url of duplicateCandidates) {
    const response = await getEndpointReport('duplicate_content', { id: taskId, url, limit: 100 }, options);
    reports.duplicateContent.push({ url, ...response, response: undefined });
    writeJson(join(options.outputDir, `duplicate-content-${reports.duplicateContent.length}.raw.json`), response);
  }

  reports.waterfall = [];
  if (!options.skipWaterfall) {
    for (const url of PRIORITY_WATERFALL_URLS) {
      const response = await getEndpointReport('waterfall', { id: taskId, url }, options);
      reports.waterfall.push({ url, ...response, response: undefined });
      writeJson(
        join(options.outputDir, `waterfall-${url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '')}.raw.json`),
        response,
      );
    }
  }

  const compactSummary = summarizeOnPage(taskId, reports);
  writeJson(join(options.outputDir, 'summary.json'), compactSummary);
  writeText(join(options.outputDir, 'summary.md'), markdownReport(compactSummary));

  console.log(`Saved DataForSEO OnPage summary to ${join(options.outputDir, 'summary.md')}`);

  if (compactSummary.counts.brokenPages > 0) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  if (error?.details) {
    console.error(JSON.stringify(error.details, null, 2));
  }
  process.exit(1);
});
