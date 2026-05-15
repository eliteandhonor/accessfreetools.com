import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

export const SITE_ORIGIN = 'https://accessfreetools.com';
export const AGENT_TOOLS_OUTPUT_DIR = 'output/agent-tools';

export const askAuditCases = [
  {
    button: 'Calculate percentage',
    expected: ['43.2'],
    inputs: { mode: 'percent-of', percent: 18, value: 240 },
    question: 'What is 18% of 240?',
    slug: 'percentage-calculator',
    visibleExpected: ['43.2'],
  },
  {
    button: 'Calculate download time',
    expected: ['9m 16s'],
    forbidden: [/555\.?5{3,}/i, /9\.2592592593 minutes/i],
    inputs: { efficiencyPercent: 90, fileSize: 5, fileUnit: 'GB', speedMbps: 80 },
    question: 'How long will a 5GB file take to download at 80 Mbps?',
    slug: 'download-time-calculator',
    visibleExpected: ['9m 16s'],
  },
  {
    button: 'Calculate amps',
    expected: ['5 amps'],
    inputs: { phase: 'single-phase', powerFactor: 1, volts: 120, watts: 600 },
    question: 'Convert 600 watts to amps at 120 volts.',
    slug: 'watts-to-amps-calculator',
    visibleExpected: ['5 A'],
  },
  {
    button: 'Estimate concrete',
    expected: ['74 80 lb bags'],
    inputs: { depthInches: 4, lengthFeet: 10, wastePercent: 10, widthFeet: 12 },
    question: 'How much concrete for a 10 by 12 slab 4 inches thick?',
    slug: 'concrete-calculator',
    visibleExpected: ['74', '80 lb'],
  },
];

export const genericContentPhrases = [
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
  'whether you are a beginner or an expert',
];

export const agentFacingPhrases = [
  'this medium post should',
  'this post should',
  'this article should',
  'agent should',
  'draft should',
  'reader-facing',
  'quality gate',
  'seo agent',
  'promotion agent',
  'internal instruction',
];

function rootPath(...parts) {
  return resolve(process.cwd(), ...parts);
}

function unixPath(value) {
  return value.replace(/\\/g, '/');
}

export function safeJsonParse(text, fallback = null) {
  if (!text) return fallback;

  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

export function readJson(relativePath) {
  const file = rootPath(relativePath);
  if (!existsSync(file)) return null;
  return safeJsonParse(readFileSync(file, 'utf8'));
}

function readText(relativePath) {
  const file = rootPath(relativePath);
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
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

function markdownList(items, empty = '- none') {
  return items.length ? items.map((item) => `- ${item}`).join('\n') : empty;
}

function reportStatusFromIssues(issues, warnings = []) {
  if (issues.length) return 'fail';
  if (warnings.length) return 'attention';
  return 'pass';
}

function writeReport(kind, report, markdown) {
  const dir = rootPath(AGENT_TOOLS_OUTPUT_DIR, kind);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(join(dir, 'latest.md'), `${markdown.trim()}\n`);
  return {
    jsonPath: unixPath(relative(process.cwd(), join(dir, 'latest.json'))),
    markdownPath: unixPath(relative(process.cwd(), join(dir, 'latest.md'))),
  };
}

function readSitemapUrls() {
  const candidates = [
    rootPath('dist', 'client', 'sitemap.xml'),
    rootPath('dist', 'sitemap.xml'),
    rootPath('public', 'sitemap.xml'),
  ];
  const sitemapPath = candidates.find((file) => existsSync(file));
  if (!sitemapPath) {
    return { urls: [], note: 'not enough data: built sitemap.xml was not found. Run npm run build first.' };
  }

  const baseDir = dirname(sitemapPath);
  const visited = new Set();
  const urls = new Set();

  function readSitemap(file) {
    const normalized = resolve(file);
    if (visited.has(normalized) || !existsSync(normalized)) return;
    visited.add(normalized);

    const text = readFileSync(normalized, 'utf8');
    const locs = [...text.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => match[1].trim());

    if (/<sitemapindex\b/i.test(text)) {
      for (const loc of locs) {
        try {
          const url = new URL(loc);
          readSitemap(join(baseDir, url.pathname.replace(/^\/+/, '')));
        } catch {
          // Ignore malformed child sitemap URLs in this helper; site checks own hard failures.
        }
      }
      return;
    }

    for (const loc of locs) urls.add(loc);
  }

  readSitemap(sitemapPath);
  return { urls: [...urls], note: '' };
}

function extractStringField(chunk, field) {
  const match = chunk.match(new RegExp(`${field}\\s*:\\s*(['"\`])([\\s\\S]*?)\\1\\s*,`, 'm'));
  return match?.[2]?.replace(/\s+/g, ' ').trim() ?? '';
}

function extractArrayLength(chunk, field) {
  const start = chunk.search(new RegExp(`${field}\\s*:\\s*\\[`));
  if (start < 0) return 0;

  let depth = 0;
  let objectCount = 0;
  const text = chunk.slice(start);

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '[') depth += 1;
    if (char === ']') {
      depth -= 1;
      if (depth === 0) break;
    }
    if (char === '{' && depth === 1) objectCount += 1;
  }

  if (objectCount > 0) return objectCount;
  const body = text.match(/\[([\s\S]*?)\]/)?.[1] ?? '';
  return body.split(',').map((item) => item.trim()).filter(Boolean).length;
}

export function extractToolRecords() {
  const dataFiles = walk(rootPath('src', 'data'), (file) => /(?:tools|Tools)\.ts$/.test(file)).filter(
    (file) => !/toolIcons|toolAliases|toolDeepAudit|toolSearchIndex/i.test(file),
  );
  const records = [];

  for (const file of dataFiles) {
    const text = readFileSync(file, 'utf8');
    const slugMatches = [...text.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];

    for (let index = 0; index < slugMatches.length; index += 1) {
      const match = slugMatches[index];
      const next = slugMatches[index + 1];
      const chunk = text.slice(match.index ?? 0, next?.index ?? text.length);
      const slug = match[1];

      records.push({
        category: extractStringField(chunk, 'category'),
        description: extractStringField(chunk, 'description'),
        exampleCount: extractArrayLength(chunk, 'examples'),
        faqCount: extractArrayLength(chunk, 'faq'),
        file: unixPath(relative(process.cwd(), file)),
        name: extractStringField(chunk, 'name') || slug,
        relatedCount: extractArrayLength(chunk, 'relatedSlugs'),
        seoDescription: extractStringField(chunk, 'seoDescription'),
        slug,
        summary: extractStringField(chunk, 'summary'),
      });
    }
  }

  const unique = new Map();
  for (const record of records) {
    if (!unique.has(record.slug)) unique.set(record.slug, record);
  }
  return [...unique.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

function extractApiRegistrySlugs() {
  const text = readText('src/lib/apiToolRegistry.ts');
  return new Set([...text.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]));
}

function hasGuide(slug) {
  return existsSync(rootPath('src', 'pages', 'blog', `how-to-use-${slug}.astro`));
}

function hasToolRenderer(slug) {
  const toolPage = readText('src/pages/tools/[slug].astro');
  const utilityCalculator = readText('src/components/UtilityCalculator.tsx');
  const financeCalculator = readText('src/components/FinanceCalculator.tsx');
  return [toolPage, utilityCalculator, financeCalculator].some((text) => text.includes(`'${slug}'`) || text.includes(`"${slug}"`));
}

function apiCandidateRisk(category = '') {
  if (/finance|tax/i.test(category)) return 'finance';
  if (/health|fitness|pregnancy/i.test(category)) return 'health';
  if (/home|project|construction/i.test(category)) return 'construction';
  if (/developer|text|converters|everyday|calculators|ai-tools/i.test(category)) return 'low';
  return 'medium';
}

export function buildApiReadyReport() {
  const generatedAt = new Date().toISOString();
  const apiSlugs = extractApiRegistrySlugs();
  const tools = extractToolRecords();
  const candidates = tools
    .filter((tool) => !apiSlugs.has(tool.slug))
    .map((tool) => {
      const renderer = hasToolRenderer(tool.slug);
      const guide = hasGuide(tool.slug);
      const risk = apiCandidateRisk(tool.category);
      const score =
        (renderer ? 35 : 0) +
        (guide ? 15 : 0) +
        (tool.exampleCount >= 3 ? 15 : 0) +
        (tool.faqCount >= 6 ? 15 : 0) +
        (tool.seoDescription ? 10 : 0) +
        (risk === 'low' ? 10 : risk === 'medium' ? 5 : 0);
      const blockers = [];
      if (!renderer) blockers.push('not enough data: no obvious interactive renderer mapping found');
      if (!guide) blockers.push('missing matching guide page');
      if (tool.exampleCount < 3) blockers.push(`only ${tool.exampleCount} examples`);
      if (tool.faqCount < 6) blockers.push(`only ${tool.faqCount} FAQs`);

      return {
        blockers,
        category: tool.category,
        exampleCount: tool.exampleCount,
        faqCount: tool.faqCount,
        guide,
        name: tool.name,
        renderer,
        risk,
        score,
        slug: tool.slug,
      };
    })
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  const report = {
    generatedAt,
    kind: 'api-ready',
    status: 'pass',
    summary: {
      apiReadyTools: apiSlugs.size,
      candidatesChecked: candidates.length,
      totalToolRecords: tools.length,
    },
    currentApiTools: [...apiSlugs].sort(),
    recommendedNext: candidates.slice(0, 15),
    rules: [
      'Report-only: this does not generate code.',
      'Low-risk, rendered, guide-backed tools should be added first.',
      'Finance, health, construction, and electrical tools need warning text before API exposure.',
    ],
  };

  const paths = writeReport(
    'api-ready',
    report,
    `# API Tool Registry Builder

Generated: ${generatedAt}

Status: ${report.status}

- API-ready tools: ${apiSlugs.size}
- Tool records checked: ${tools.length}
- Candidate tools: ${candidates.length}

## Recommended Next

${markdownList(
  report.recommendedNext.map(
    (tool) =>
      `${tool.name} (${tool.slug}) - score ${tool.score}, risk ${tool.risk}${
        tool.blockers.length ? `; blockers: ${tool.blockers.join('; ')}` : ''
      }`,
  ),
)}
`,
  );

  return { ...report, paths };
}

async function readResponseJson(response) {
  const text = await response.text();
  return safeJsonParse(text, { raw: text });
}

async function postJson(url, body, headers = {}) {
  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: { accept: 'application/json', 'content-type': 'application/json', ...headers },
    method: 'POST',
  });
  return { body: await readResponseJson(response), ok: response.ok, status: response.status, url };
}

function includesExpected(value, expected) {
  const text = JSON.stringify(value).toLowerCase();
  return expected.every((item) => text.includes(String(item).toLowerCase()));
}

function includesForbidden(value, forbidden = []) {
  const text = JSON.stringify(value);
  return forbidden.filter((pattern) => pattern.test(text)).map((pattern) => pattern.toString());
}

function humanAnswerSurface(value) {
  return {
    answer: value?.answer ?? '',
    runAnswer: value?.run?.answer ?? '',
  };
}

async function fillVisibleTool(page, testCase) {
  const fillByLabelText = async (label, value) => {
    await page
      .locator('label')
      .filter({ hasText: new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) })
      .locator('input, textarea')
      .first()
      .fill(String(value));
  };
  const selectByLabelText = async (label, value) => {
    await page
      .locator('label')
      .filter({ hasText: new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) })
      .locator('select')
      .first()
      .selectOption(String(value));
  };

  if (testCase.slug === 'percentage-calculator') {
    await fillByLabelText('Percentage', testCase.inputs.percent);
    await fillByLabelText('Of value', testCase.inputs.value);
    return;
  }

  if (testCase.slug === 'download-time-calculator') {
    await fillByLabelText('File size', testCase.inputs.fileSize);
    await selectByLabelText('File unit', testCase.inputs.fileUnit);
    await fillByLabelText('Speed Mbps', testCase.inputs.speedMbps);
    await fillByLabelText('Efficiency %', testCase.inputs.efficiencyPercent);
    return;
  }

  if (testCase.slug === 'watts-to-amps-calculator') {
    await fillByLabelText('Watts', testCase.inputs.watts);
    await fillByLabelText('Volts', testCase.inputs.volts);
    await selectByLabelText('Phase / current type', testCase.inputs.phase);
    await fillByLabelText('Power factor', testCase.inputs.powerFactor);
    return;
  }

  if (testCase.slug === 'concrete-calculator') {
    await fillByLabelText('Length (ft)', testCase.inputs.lengthFeet);
    await fillByLabelText('Width (ft)', testCase.inputs.widthFeet);
    await fillByLabelText('Depth (in)', testCase.inputs.depthInches);
    await fillByLabelText('Extra waste (%)', testCase.inputs.wastePercent);
  }
}

async function runVisibleToolChecks(site, results, warnings) {
  let chromium;
  try {
    ({ chromium } = await import('@playwright/test'));
  } catch (error) {
    warnings.push(
      `not enough data: Playwright is unavailable for rendered tool parity (${error instanceof Error ? error.message : String(error)}).`,
    );
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    for (const result of results) {
      const testCase = askAuditCases.find((item) => item.slug === result.slug);
      if (!testCase) continue;

      try {
        await page.goto(`${site}/tools/${testCase.slug}/`, { waitUntil: 'networkidle' });
        await fillVisibleTool(page, testCase);
        await page.getByRole('button', { name: testCase.button }).click();
        await page.waitForTimeout(250);
        const mainText = await page.locator('main').innerText({ timeout: 5000 });
        const missing = testCase.visibleExpected.filter((expected) => !mainText.toLowerCase().includes(expected.toLowerCase()));
        result.page = {
          checkedWithBrowser: true,
          expected: testCase.visibleExpected,
          ok: missing.length === 0,
          snippet: mainText.slice(0, 1000),
          status: 200,
        };
        if (missing.length) result.issues.push(`Rendered tool page did not show: ${missing.join(', ')}`);
      } catch (error) {
        result.page = {
          checkedWithBrowser: true,
          error: error instanceof Error ? error.message : String(error),
          ok: false,
          status: 0,
        };
        result.issues.push(`Rendered tool page check failed: ${result.page.error}`);
      }
    }
  } finally {
    await browser.close();
  }
}

export async function runAskAudit(options = {}) {
  const site = (options.site || process.env.AFT_SITE_URL || SITE_ORIGIN).replace(/\/$/, '');
  const generatedAt = new Date().toISOString();
  const results = [];
  const issues = [];
  const warnings = [];

  let registryCount = 0;
  try {
    const response = await fetch(`${site}/api/v1/tools`, { headers: { accept: 'application/json' } });
    const body = await readResponseJson(response);
    registryCount = Array.isArray(body.tools) ? body.tools.length : 0;
    if (!response.ok || !body.ok || registryCount < 10) {
      issues.push(`not enough data: ${site}/api/v1/tools did not return the live registry.`);
    }
  } catch (error) {
    issues.push(`not enough data: API registry fetch failed (${error instanceof Error ? error.message : String(error)}).`);
  }

  for (const testCase of askAuditCases) {
    const result = {
      ask: { ok: false, status: 0 },
      issues: [],
      mcp: { ok: false, status: 0 },
      page: { ok: false, status: 0 },
      run: { ok: false, status: 0 },
      slug: testCase.slug,
    };

    try {
      result.run = await postJson(`${site}/api/v1/run/${testCase.slug}`, { inputs: testCase.inputs });
      if (!result.run.ok || !includesExpected(result.run.body, testCase.expected)) {
        result.issues.push('REST run result did not include the expected deterministic answer.');
      }
      const forbidden = includesForbidden(humanAnswerSurface(result.run.body), testCase.forbidden);
      if (forbidden.length) result.issues.push(`REST run exposed forbidden formatting: ${forbidden.join(', ')}`);
    } catch (error) {
      result.issues.push(`REST run failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      result.ask = await postJson(`${site}/api/v1/ask`, { message: testCase.question });
      if (!result.ask.ok || result.ask.body?.route?.tool_slug !== testCase.slug) {
        result.issues.push(`Ask routed to ${result.ask.body?.route?.tool_slug ?? 'unknown'} instead of ${testCase.slug}.`);
      }
      if (!includesExpected(result.ask.body, testCase.expected)) {
        result.issues.push('Ask answer did not include the expected deterministic result.');
      }
      const forbidden = includesForbidden(humanAnswerSurface(result.ask.body), testCase.forbidden);
      if (forbidden.length) result.issues.push(`Ask exposed forbidden formatting: ${forbidden.join(', ')}`);
      if (result.ask.body?.route?.source && !['parser', 'ollama'].includes(result.ask.body.route.source)) {
        result.issues.push(`Ask returned unsupported route source: ${result.ask.body.route.source}.`);
      }
    } catch (error) {
      result.issues.push(`Ask request failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      result.mcp = await postJson(
        `${site}/mcp`,
        {
          id: `${testCase.slug}-run`,
          jsonrpc: '2.0',
          method: 'tools/call',
          params: { arguments: { inputs: testCase.inputs, slug: testCase.slug }, name: 'run_tool' },
        },
        { accept: 'application/json, text/event-stream' },
      );
      if (!result.mcp.ok || !includesExpected(result.mcp.body, testCase.expected)) {
        result.issues.push('MCP run_tool result did not include the expected deterministic answer.');
      }
    } catch (error) {
      result.issues.push(`MCP request failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    results.push(result);
  }

  if (options.browser !== false) {
    await runVisibleToolChecks(site, results, warnings);
  } else {
    warnings.push('not enough data: rendered tool parity was skipped by --skip-browser.');
  }

  for (const result of results) {
    if (result.issues.length) issues.push(`${result.slug}: ${result.issues.join(' | ')}`);
  }

  const status = reportStatusFromIssues(issues, warnings);
  const report = {
    generatedAt,
    kind: 'ask-audit',
    site,
    status,
    summary: {
      cases: askAuditCases.length,
      issues: issues.length,
      registryCount,
      warnings: warnings.length,
    },
    issues,
    results,
    warnings,
  };
  const paths = writeReport(
    'ask-audit',
    report,
    `# Ask Quality Auditor

Generated: ${generatedAt}

Status: ${status}

- Site: ${site}
- API registry tools: ${registryCount || 'not enough data'}
- Cases checked: ${askAuditCases.length}

## Issues

${markdownList(issues)}

## Warnings

${markdownList(warnings)}
`,
  );

  return { ...report, paths };
}

export async function runMcpSmoke(options = {}) {
  const site = (options.site || process.env.AFT_SITE_URL || SITE_ORIGIN).replace(/\/$/, '');
  const generatedAt = new Date().toISOString();
  const issues = [];
  const checks = [];

  async function check(label, body, expected = []) {
    try {
      const result = await postJson(`${site}/mcp`, body, { accept: 'application/json, text/event-stream' });
      const expectedOk = includesExpected(result.body, expected);
      const ok = result.ok && expectedOk;
      checks.push({ body, expected, label, ok, response: result.body, status: result.status });
      if (!ok) issues.push(`${label} did not return expected MCP data.`);
    } catch (error) {
      checks.push({ error: error instanceof Error ? error.message : String(error), label, ok: false });
      issues.push(`${label} failed.`);
    }
  }

  await check('tools/list', { id: 1, jsonrpc: '2.0', method: 'tools/list', params: {} }, ['run_tool', 'search_tools']);
  await check(
    'search_tools percentage',
    {
      id: 2,
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { arguments: { query: 'percentage' }, name: 'search_tools' },
    },
    ['percentage-calculator'],
  );
  await check(
    'run_tool percentage',
    {
      id: 3,
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        arguments: { inputs: { mode: 'percent-of', percent: 18, value: 240 }, slug: 'percentage-calculator' },
        name: 'run_tool',
      },
    },
    ['43.2'],
  );

  const status = reportStatusFromIssues(issues);
  const report = {
    checks,
    generatedAt,
    issues,
    kind: 'mcp-smoke',
    site,
    status,
    summary: { checks: checks.length, issues: issues.length },
  };
  const paths = writeReport(
    'mcp-smoke',
    report,
    `# MCP Playground Smoke

Generated: ${generatedAt}

Status: ${status}

${markdownList(checks.map((check) => `${check.label}: ${check.ok ? 'pass' : 'fail'}`))}

## Issues

${markdownList(issues)}
`,
  );

  return { ...report, paths };
}

function searchConsoleGaps() {
  const report = readJson('output/search-console-url-inspection.json');
  if (!report?.inspections) {
    return {
      gaps: [],
      note: 'not enough data: Search Console inspection snapshot is missing. Run npm run search-console:inspect-key-urls when OAuth is available.',
    };
  }

  return {
    gaps: report.inspections
      .filter((item) => !/submitted and indexed/i.test(`${item.coverageState ?? ''}`))
      .map((item) => ({
        coverageState: item.coverageState ?? 'unknown',
        lastCrawlTime: item.lastCrawlTime ?? '',
        url: item.inspectionUrl,
      })),
    note: '',
  };
}

function crawlScoutSignals() {
  const report = readJson('output/crawlscout/crawlscout-summary.json');
  if (!report) {
    return {
      note: 'not enough data: CrawlScout summary is missing. Export or review CrawlScout before using this source.',
      opportunities: [],
    };
  }

  return {
    note: '',
    opportunities: [
      ...(report.topKeywordSignals ?? []).slice(0, 8).map((item) => ({
        label: item.keyword,
        metric: item.impressions,
        source: 'crawlscout-keyword',
      })),
      ...(report.pageSample ?? [])
        .filter((item) => Number(item.impressions) > 0 && Number(item.clicks) === 0)
        .slice(0, 8)
        .map((item) => ({ label: item.path, metric: item.impressions, source: 'crawlscout-page' })),
    ],
  };
}

function analyticsSignals() {
  const eventsPath = resolve(process.cwd(), process.env.AFT_ANALYTICS_DIR ?? '.local/analytics', 'events.ndjson');
  if (!existsSync(eventsPath)) {
    return {
      note: 'not enough data: first-party analytics events file is missing.',
      topPages: [],
      topTools: [],
    };
  }

  const events = readFileSync(eventsPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => safeJsonParse(line))
    .filter(Boolean);
  const pages = new Map();
  const tools = new Map();

  for (const event of events) {
    if (event.type === 'page_view') pages.set(event.pagePath, (pages.get(event.pagePath) ?? 0) + 1);
    if (event.type === 'tool_action' && event.toolSlug) tools.set(event.toolSlug, (tools.get(event.toolSlug) ?? 0) + 1);
  }

  return {
    note: '',
    topPages: [...pages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10),
    topTools: [...tools.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10),
  };
}

function routeFromBuiltHtml(filePath) {
  const distRoot = rootPath('dist');
  const relativePath = unixPath(relative(distRoot, filePath));
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) return `/${relativePath.replace(/\/index\.html$/, '/')}`;
  return `/${relativePath.replace(/\.html$/, '/')}`;
}

function normalizeHrefToPath(href) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return '';

  try {
    const url = href.startsWith('http')
      ? new URL(href)
      : new URL(href, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN) return '';
    const pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    return pathname;
  } catch {
    return '';
  }
}

function stripHtml(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function builtInternalLinkEvidence(targetPaths) {
  const distRoot = rootPath('dist');
  const targets = [...new Set(targetPaths.map(normalizeHrefToPath).filter(Boolean))];
  const byTarget = Object.fromEntries(targets.map((target) => [target, []]));

  if (!existsSync(distRoot) || targets.length === 0) {
    return {
      note: existsSync(distRoot)
        ? ''
        : 'not enough data: dist is missing, so built internal links cannot be counted until after npm run build.',
      byTarget,
    };
  }

  const htmlFiles = walk(distRoot, (file) => file.endsWith('.html'));
  const seen = new Set();
  const anchorPattern = /<a\b[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf8');
    const source = routeFromBuiltHtml(filePath);
    let match;
    while ((match = anchorPattern.exec(html))) {
      const target = normalizeHrefToPath(match[2]);
      if (!targets.includes(target)) continue;
      const anchorText = stripHtml(match[3]);
      const key = `${source} -> ${target} -> ${anchorText}`;
      if (seen.has(key)) continue;
      seen.add(key);
      byTarget[target].push({ source, anchorText });
    }
  }

  return { note: '', byTarget };
}

export function buildLinkHelperReport() {
  const generatedAt = new Date().toISOString();
  const sitemap = readSitemapUrls();
  const searchConsole = searchConsoleGaps();
  const crawlScout = crawlScoutSignals();
  const analytics = analyticsSignals();
  const warnings = [sitemap.note, searchConsole.note, crawlScout.note, analytics.note].filter(Boolean);
  const suggestions = [];
  const gapTargets = searchConsole.gaps
    .map((gap) => {
      try {
        return new URL(gap.url).pathname;
      } catch {
        return '';
      }
    })
    .filter(Boolean);
  const linkEvidence = builtInternalLinkEvidence(gapTargets);
  if (linkEvidence.note) warnings.push(linkEvidence.note);

  for (const gap of searchConsole.gaps.slice(0, 10)) {
    try {
      const url = new URL(gap.url);
      const target = normalizeHrefToPath(url.pathname);
      const inboundLinks = linkEvidence.byTarget[target] ?? [];
      const sourceCount = new Set(inboundLinks.map((item) => item.source)).size;
      const hasEnoughInternalLinks = sourceCount >= 3;
      suggestions.push({
        anchorIdea: url.pathname.replace(/^\/tools\/|^\/blog\/how-to-use-|\/$/g, '').replace(/-/g, ' '),
        priority: hasEnoughInternalLinks ? 'medium' : 'high',
        reason: hasEnoughInternalLinks
          ? `Search Console state: ${gap.coverageState}; ${sourceCount} built pages already link here, so next proof step is URL inspection/discovery after deploy.`
          : `Search Console state: ${gap.coverageState}; only ${sourceCount} built pages link here, so add contextual support first.`,
        target: url.pathname,
      });
    } catch {
      // skip malformed snapshot entries
    }
  }

  for (const [slug, count] of analytics.topTools.slice(0, 8)) {
    suggestions.push({
      anchorIdea: slug.replace(/-/g, ' '),
      priority: 'medium',
      reason: `First-party analytics recorded ${count} tool actions.`,
      target: `/tools/${slug}/`,
    });
  }

  for (const item of crawlScout.opportunities.slice(0, 8)) {
    suggestions.push({
      anchorIdea: item.label,
      priority: 'medium',
      reason: `CrawlScout ${item.source} signal with ${item.metric} impressions.`,
      target: item.label.startsWith('/') ? item.label : '/tools/',
    });
  }

  const report = {
    generatedAt,
    kind: 'link-helper',
    sitemap: { note: sitemap.note, urlCount: sitemap.urls.length },
    sources: {
      analytics: { note: analytics.note, topPages: analytics.topPages, topTools: analytics.topTools },
      crawlScout: { note: crawlScout.note, opportunities: crawlScout.opportunities },
      searchConsole,
    },
    linkEvidence,
    status: warnings.length ? 'attention' : 'pass',
    suggestions,
    warnings,
  };
  const paths = writeReport(
    'link-helper',
    report,
    `# Internal Link Helper

Generated: ${generatedAt}

Status: ${report.status}

- Sitemap URLs: ${sitemap.urls.length || 'not enough data'}
- Suggestions: ${suggestions.length}

## Suggestions

${markdownList(suggestions.slice(0, 20).map((item) => `${item.priority}: link to ${item.target} using "${item.anchorIdea}" because ${item.reason}`))}

## Built Internal Link Evidence

${markdownList(
  Object.entries(linkEvidence.byTarget).map(([target, links]) => {
    const sourceCount = new Set(links.map((item) => item.source)).size;
    const sample = links
      .slice(0, 5)
      .map((item) => `${item.source} ("${item.anchorText || 'image/link'}")`)
      .join('; ');
    return `${target}: ${sourceCount} source pages, ${links.length} total links${sample ? ` - ${sample}` : ''}`;
  }),
)}

## Source Warnings

${markdownList(warnings)}
`,
  );

  return { ...report, paths };
}

export function buildSeoConsoleReport() {
  const generatedAt = new Date().toISOString();
  const marketing = readJson('output/marketing-orchestrator/daily-plan.json');
  const searchConsole = searchConsoleGaps();
  const searchConsoleDiscovery = readJson('output/search-console-discovery.json');
  const crawlScout = crawlScoutSignals();
  const sitemap = readSitemapUrls();
  const productionSitemap = readJson('output/production-sitemap-check.json');
  const indexNow = readJson('output/indexnow-submission.json');
  const dataForSeo = readJson('output/dataforseo-account.json');
  const warnings = [];

  if (!marketing) warnings.push('not enough data: marketing orchestrator report is missing.');
  if (searchConsole.note) warnings.push(searchConsole.note);
  if (crawlScout.note) warnings.push(crawlScout.note);
  if (sitemap.note) warnings.push(sitemap.note);
  if (!productionSitemap) warnings.push('not enough data: production sitemap check report is missing.');
  if (!indexNow) warnings.push('not enough data: IndexNow report is missing.');
  if (!dataForSeo) warnings.push('not enough data: DataForSEO account report is missing.');
  const gapTargets = searchConsole.gaps
    .map((gap) => {
      try {
        return new URL(gap.url).pathname;
      } catch {
        return '';
      }
    })
    .filter(Boolean);
  const linkEvidence = builtInternalLinkEvidence(gapTargets);
  if (linkEvidence.note) warnings.push(linkEvidence.note);

  const actions = [
    ...searchConsole.gaps.slice(0, 5).map((gap) => {
      const targetPath = (() => {
        try {
          return new URL(gap.url).pathname;
        } catch {
          return '';
        }
      })();
      const inboundLinks = linkEvidence.byTarget[normalizeHrefToPath(targetPath)] ?? [];
      const sourceCount = new Set(inboundLinks.map((item) => item.source)).size;
      const hasEnoughInternalLinks = sourceCount >= 3;
      const discoveryRefreshedAt = searchConsoleDiscovery?.generatedAt
        ? new Date(searchConsoleDiscovery.generatedAt).toLocaleString('en-AU', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Australia/Brisbane',
          })
        : '';
      const discoveryTask = discoveryRefreshedAt
        ? `Search Console sitemap/feed discovery was refreshed ${discoveryRefreshedAt}; if URL Inspection still shows unknown, request indexing manually in Search Console and recheck after Google crawls`
        : 'Run URL inspection/discovery';

      return {
        evidence:
          'output/search-console-url-inspection.json + output/search-console-discovery.json + output/agent-tools/link-helper/latest.md',
        priority: hasEnoughInternalLinks ? 'medium' : 'high',
        task: hasEnoughInternalLinks
          ? `${discoveryTask} for ${gap.url}; built link proof already shows ${sourceCount} source pages linking to it (${gap.coverageState}).`
          : `Improve contextual links and clarity for ${gap.url}; built link proof shows only ${sourceCount} source pages linking to it (${gap.coverageState}).`,
      };
    }),
    ...(marketing?.actions ?? marketing?.recommendations ?? []).slice(0, 3).map((item) => ({
      evidence: 'output/marketing-orchestrator/daily-plan.json',
      priority: item.priority ?? 'medium',
      task: item.title ?? item.action ?? JSON.stringify(item).slice(0, 160),
    })),
  ];

  if (!actions.length) {
    actions.push({
      evidence: warnings.length ? 'source reports missing' : 'current reports',
      priority: warnings.length ? 'medium' : 'low',
      task: warnings.length
        ? 'Refresh missing evidence sources before making SEO claims.'
        : 'No urgent SEO fix is visible in the current local evidence.',
    });
  }

  const report = {
    actions,
    generatedAt,
    kind: 'seo-console',
    sources: {
      crawlScout: crawlScout.note ? 'not enough data' : 'present',
      dataForSeo: dataForSeo ? 'present' : 'not enough data',
      indexNow: indexNow ? 'present' : 'not enough data',
      marketing: marketing ? 'present' : 'not enough data',
      productionSitemap: productionSitemap ? 'present' : 'not enough data',
      searchConsoleDiscovery: searchConsoleDiscovery ? 'present' : 'not enough data',
      searchConsole: searchConsole.note ? 'not enough data' : 'present',
      sitemap: sitemap.note ? 'not enough data' : 'present',
    },
    linkEvidence,
    status: warnings.length ? 'attention' : 'pass',
    warnings,
  };
  const paths = writeReport(
    'seo-console',
    report,
    `# Agent SEO Fix Console

Generated: ${generatedAt}

Status: ${report.status}

## Next Actions

${markdownList(actions.map((item) => `${item.priority}: ${item.task} Evidence: ${item.evidence}`))}

## Source Warnings

${markdownList(warnings)}
`,
  );

  return { ...report, paths };
}

function firstBodyParagraph(text) {
  return (
    text
      .split(/\n{2,}/)
      .map((part) => part.replace(/^#+\s*/, '').trim())
      .find((part) => part.length > 30 && !/^!\[/.test(part)) ?? ''
  );
}

export function buildContentQualityReport(text, options = {}) {
  const lower = text.toLowerCase();
  const accessLinks = [
    ...new Set(
      [...text.matchAll(/https:\/\/accessfreetools\.com\/[^\s)`"<>]+/g)].map((match) =>
        match[0].replace(/[).,;:!?]+$/g, ''),
      ),
    ),
  ];
  const wordCount = (text.match(/\b[\w'-]+\b/g) ?? []).length;
  const headingCount = (text.match(/^#{1,3}\s+/gm) ?? []).length + (text.match(/<h[1-3]\b/gi) ?? []).length;
  const numberCount = (text.match(/\b\d+(?:\.\d+)?\b/g) ?? []).length;
  const genericHits = genericContentPhrases.filter((phrase) => lower.includes(phrase));
  const agentFacingHits = agentFacingPhrases.filter((phrase) => lower.includes(phrase));
  const opening = firstBodyParagraph(text);
  const issues = [];
  const warnings = [];
  const file = options.file ? unixPath(options.file) : '';
  const isPromotion = /promotion|medium|quora|reddit|devto|bluesky/i.test(file) || options.promotion === true;

  if (genericHits.length) issues.push(`Generic filler detected: ${genericHits.join(', ')}`);
  if (agentFacingHits.length) issues.push(`Agent-facing text detected: ${agentFacingHits.join(', ')}`);
  if (accessLinks.length < (isPromotion ? 2 : 1)) {
    issues.push(isPromotion ? 'Missing useful internal links: include both the matching tool and guide.' : 'Missing Access Free Tools link.');
  }
  if (opening.length < 80 || !/(mistake|problem|confusing|quick|example|before|why|how|cost|time|save|check)/i.test(opening)) {
    warnings.push('Opening hook is weak or too generic.');
  }
  if (numberCount < 1 && !/for example|example:/i.test(text)) {
    issues.push('No concrete example detected.');
  }
  if (isPromotion && accessLinks.length && !/disclosure|i work on access free tools|my own project/i.test(lower)) {
    issues.push('Missing ownership disclosure for promotional content.');
  }
  if (wordCount < 250) warnings.push(`Short content: ${wordCount} words.`);
  if (headingCount < 2) warnings.push(`Low heading count: ${headingCount}.`);

  return {
    accessLinks,
    agentFacingHits,
    file,
    generatedAt: new Date().toISOString(),
    genericHits,
    headingCount,
    issues,
    kind: 'content-quality',
    numberCount,
    opening: opening.slice(0, 240),
    status: reportStatusFromIssues(issues, warnings),
    warnings,
    wordCount,
  };
}

export function runContentQualityReport(filePath) {
  const fullPath = resolve(process.cwd(), filePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Content file not found: ${filePath}`);
  }

  const report = buildContentQualityReport(readFileSync(fullPath, 'utf8'), {
    file: unixPath(relative(process.cwd(), fullPath)),
  });
  const paths = writeReport(
    'content-quality',
    report,
    `# Content Quality Checker

Generated: ${report.generatedAt}

Status: ${report.status}

- File: ${report.file}
- Words: ${report.wordCount}
- Headings: ${report.headingCount}
- Access Free Tools links: ${report.accessLinks.length}

## Issues

${markdownList(report.issues)}

## Warnings

${markdownList(report.warnings)}
`,
  );
  return { ...report, paths };
}

export function readAgentToolReports() {
  const base = rootPath(AGENT_TOOLS_OUTPUT_DIR);
  const kinds = ['ask-audit', 'api-ready', 'mcp-smoke', 'link-helper', 'seo-console', 'content-quality'];

  return kinds.map((kind) => {
    const jsonPath = join(base, kind, 'latest.json');
    const markdownPath = join(base, kind, 'latest.md');
    const report = existsSync(jsonPath) ? safeJsonParse(readFileSync(jsonPath, 'utf8')) : null;
    return {
      generatedAt: report?.generatedAt ?? null,
      jsonPath: existsSync(jsonPath) ? unixPath(relative(process.cwd(), jsonPath)) : '',
      kind,
      markdownPath: existsSync(markdownPath) ? unixPath(relative(process.cwd(), markdownPath)) : '',
      report,
      status: report?.status ?? 'not-run',
      updatedAt: existsSync(jsonPath) ? new Date(statSync(jsonPath).mtimeMs).toISOString() : null,
    };
  });
}
