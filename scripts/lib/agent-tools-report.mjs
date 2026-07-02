import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

export const SITE_ORIGIN = 'https://accessfreetools.com';
export const AGENT_TOOLS_OUTPUT_DIR = 'output/agent-tools';
export const AGENT_ROUTING_RULES_PATH = 'docs/agent-routing-rules.json';

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

function extractStringArray(chunk, field) {
  const start = chunk.search(new RegExp(`${field}\\s*:\\s*\\[`));
  if (start < 0) return [];

  let depth = 0;
  const text = chunk.slice(start);
  let end = -1;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '[') depth += 1;
    if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        end = index;
        break;
      }
    }
  }

  if (end < 0) return [];
  return [...text.slice(0, end).matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]);
}

function countFieldOccurrences(chunk, field) {
  return (chunk.match(new RegExp(`\\b${field}\\s*:`, 'g')) ?? []).length;
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
      const name = extractStringField(chunk, 'name') || slug;
      const description = extractStringField(chunk, 'description');
      const isUtilityFactoryBlock =
        chunk.includes('makeUtilityTool({') || text.slice(Math.max(0, (match.index ?? 0) - 120), match.index ?? 0).includes('makeUtilityTool');
      const isFinanceFactoryBlock =
        /financeTools\.ts$/.test(unixPath(relative(process.cwd(), file))) ||
        chunk.includes('makeFinanceTool({') ||
        text.slice(Math.max(0, (match.index ?? 0) - 120), match.index ?? 0).includes('makeFinanceTool');
      const isHealthFactoryBlock =
        /healthTools\.ts$/.test(unixPath(relative(process.cwd(), file))) ||
        chunk.includes('makeHealthTool({') ||
        text.slice(Math.max(0, (match.index ?? 0) - 120), match.index ?? 0).includes('makeHealthTool');
      const isAiFactoryBlock =
        /aiTools\.ts$/.test(unixPath(relative(process.cwd(), file))) ||
        chunk.includes('makeAiTool({') ||
        text.slice(Math.max(0, (match.index ?? 0) - 120), match.index ?? 0).includes('makeAiTool');
      const titleType = name.endsWith('Generator')
        ? 'Free Online Generator'
        : name.endsWith('Calculator')
          ? 'Free Online Calculator'
          : 'Free Online Tool';
      const explicitFaqCount = extractArrayLength(chunk, 'faq');
      const hasExplicitFaq = /\bfaq\s*:\s*\[/.test(chunk);
      const generatedUtilityFaqCount = !hasExplicitFaq && isUtilityFactoryBlock ? countFieldOccurrences(chunk, 'question') + 5 : 0;
      const generatedFinanceFaqCount = !hasExplicitFaq && isFinanceFactoryBlock ? countFieldOccurrences(chunk, 'question') + 7 : 0;
      const generatedHealthFaqCount = !hasExplicitFaq && isHealthFactoryBlock ? countFieldOccurrences(chunk, 'question') + 7 : 0;
      const generatedAiFaqCount = !hasExplicitFaq && isAiFactoryBlock ? countFieldOccurrences(chunk, 'question') + 7 : 0;

      records.push({
        category: extractStringField(chunk, 'category'),
        description,
        exampleCount: extractArrayLength(chunk, 'examples'),
        faqCount: hasExplicitFaq ? explicitFaqCount : generatedUtilityFaqCount || generatedFinanceFaqCount || generatedHealthFaqCount || generatedAiFaqCount,
        file: unixPath(relative(process.cwd(), file)),
        name,
        relatedCount: extractArrayLength(chunk, 'relatedSlugs'),
        relatedSlugs: extractStringArray(chunk, 'relatedSlugs'),
        seoDescription: extractStringField(chunk, 'seoDescription') || (isUtilityFactoryBlock || isHealthFactoryBlock || isAiFactoryBlock ? description : ''),
        seoTitle:
          extractStringField(chunk, 'seoTitle') ||
          (isAiFactoryBlock ? `${name} | Free Browser AI Tool` : isUtilityFactoryBlock || isHealthFactoryBlock ? `${name} | ${titleType}` : ''),
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
  if (existsSync(rootPath('src', 'pages', 'blog', `how-to-use-${slug}.astro`))) return true;
  const utilityGuides = readText('src/data/utilityBlogGuides.ts');
  return (
    utilityGuides.includes(`'${slug}':`) ||
    utilityGuides.includes(`"${slug}":`) ||
    utilityGuides.includes(`toolSlug: '${slug}'`) ||
    utilityGuides.includes(`toolSlug: "${slug}"`)
  );
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

function searchConsoleIndexingRequests() {
  const report = readJson('docs/search-console-indexing-requests.json');
  const requests = Array.isArray(report?.requests) ? report.requests : [];

  return {
    generatedAt: report?.generatedAt ?? '',
    requests,
  };
}

function searchConsoleIndexingRequestForUrl(url, requestReport = searchConsoleIndexingRequests()) {
  const normalizedUrl = String(url ?? '').replace(/\/+$/, '/');
  return requestReport.requests.find((request) => String(request?.url ?? '').replace(/\/+$/, '/') === normalizedUrl);
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

function crawlScoutSignals() {
  const report = readJson('output/crawlscout/crawlscout-summary.json');
  if (!report) {
    return {
      completed: [],
      note: 'not enough data: CrawlScout summary is missing. Export or review CrawlScout before using this source.',
      opportunities: [],
    };
  }

  const completed = [];
  const completedPaths = new Set();
  const recordCompleted = (item, note, evidence) => {
    if (!item?.path || completedPaths.has(item.path)) return;
    completedPaths.add(item.path);
    completed.push({
      evidence,
      note,
      path: item.path,
    });
  };
  const skipIfComplete = (item) => {
    if (!item?.path) return false;
    if (isSearchPerformanceMonitorOnly(item.path)) {
      recordCompleted(
        item,
        'monitor-only: HTML sitemap is noindex,follow and excluded from XML sitemaps.',
        'src/data/indexationPolicy.ts + output/indexing-protection/latest report',
      );
      return true;
    }

    const trackedCompletion = searchConsoleCompletionForPath(item.path, report);
    if (trackedCompletion) {
      const evidence = Array.isArray(trackedCompletion.evidence)
        ? trackedCompletion.evidence.join(' + ')
        : trackedCompletion.evidence || 'docs/seo-console-completions.json';
      recordCompleted(item, trackedCompletion.note ?? 'tracked SEO console completion covers this CrawlScout export.', evidence);
      return true;
    }

    if (!isSeoPageProofComplete(item.path)) return false;
    const identity = seoPageIdentityFromPath(item.path);
    recordCompleted(item, 'final SEO judge already has 0 remaining gaps for this page.', `output/seo-agents/${identity.slug}/${identity.page}/final-judge.json`);
    return true;
  };

  return {
    completed,
    note: '',
    opportunities: [
      ...(report.topKeywordSignals ?? []).slice(0, 8).map((item) => ({
        label: item.keyword,
        metric: item.impressions,
        source: 'crawlscout-keyword',
      })),
      ...(report.pageSample ?? [])
        .filter((item) => Number(item.impressions) > 0 && Number(item.clicks) === 0)
        .filter((item) => !skipIfComplete(item))
        .slice(0, 8)
        .map((item) => ({ label: item.path, metric: item.impressions, source: 'crawlscout-page' })),
    ],
  };
}

function googleCoverageExportSignals() {
  const report = readJson('output/search-console-coverage-export.json');
  if (!report) {
    return {
      actions: [],
      latest: null,
      note: 'not enough data: Google Search Console Coverage export is missing. Run npm run search-console:import-coverage after exporting Coverage CSVs.',
      totals: null,
    };
  }

  return {
    actions: report.actions ?? [],
    latest: report.latest ?? null,
    note: '',
    totals: report.totals ?? null,
  };
}

function seoPageIdentityFromPath(path) {
  const normalized = normalizeHrefToPath(path);
  if (normalized.startsWith('/tools/')) {
    return {
      page: 'tool',
      slug: normalized.replace(/^\/tools\//, '').replace(/\/$/, ''),
    };
  }

  if (normalized.startsWith('/blog/how-to-use-')) {
    return {
      page: 'blog',
      slug: normalized.replace(/^\/blog\/how-to-use-/, '').replace(/\/$/, ''),
    };
  }

  return null;
}

function finalJudgeForPath(path) {
  const identity = seoPageIdentityFromPath(path);
  if (!identity?.slug || !identity?.page) return null;
  return readJson(`output/seo-agents/${identity.slug}/${identity.page}/final-judge.json`);
}

function isSeoPageProofComplete(path) {
  const judge = finalJudgeForPath(path);
  if (!judge) return false;
  return judge.status === 'ready-for-human-approval' && (judge.remainingGaps ?? []).length === 0;
}

function isSearchPerformanceMonitorOnly(path) {
  return normalizeHrefToPath(path) === '/sitemap/';
}

function searchConsoleCompletions() {
  const report = readJson('docs/seo-console-completions.json');
  return Array.isArray(report?.completed) ? report.completed : [];
}

function completionCoversReport(completion, report) {
  const completedTime = Date.parse(completion?.completedAt ?? '');
  const sourceDataDate = report?.source?.dataDate;
  const reportTime = /^\d{4}-\d{2}-\d{2}$/.test(String(sourceDataDate ?? ''))
    ? Date.parse(`${sourceDataDate}T00:00:00+10:00`)
    : Date.parse(report?.generatedAt ?? '');

  if (!Number.isFinite(completedTime) || !Number.isFinite(reportTime)) return true;
  return reportTime <= completedTime;
}

function searchConsoleCompletionForPath(path, report) {
  const normalizedPath = normalizeHrefToPath(path);
  return searchConsoleCompletions().find((completion) => {
    if (normalizeHrefToPath(completion?.path ?? '') !== normalizedPath) return false;
    return completionCoversReport(completion, report);
  });
}

function googlePerformanceExportSignals() {
  const report = readJson('output/search-console/performance-latest.json');
  if (!report) {
    return {
      actions: [],
      note: 'not enough data: Search Console Performance/deindex export is missing. Run npm run search-console:import-performance after exporting Performance CSVs.',
      totals: null,
    };
  }

  const completed = [];
  const completedPaths = new Set();
  const recordCompleted = (item) => {
    if (!item?.path || completedPaths.has(item.path)) return;
    completedPaths.add(item.path);
    completed.push(item);
  };
  const skipIfComplete = (item) => {
    if (isSearchPerformanceMonitorOnly(item.path)) {
      recordCompleted({
        path: item.path,
        evidence: 'src/data/indexationPolicy.ts + output/indexing-protection/latest report',
        note: 'monitor-only: HTML sitemap is noindex,follow and excluded from XML sitemaps.',
      });
      return true;
    }

    const trackedCompletion = searchConsoleCompletionForPath(item.path, report);
    if (trackedCompletion) {
      const evidence = Array.isArray(trackedCompletion.evidence)
        ? trackedCompletion.evidence.join(' + ')
        : trackedCompletion.evidence || 'docs/seo-console-completions.json';
      recordCompleted({
        path: item.path,
        evidence,
        note: trackedCompletion.note ?? 'tracked SEO console completion covers the current GSC export.',
      });
      return true;
    }

    if (!isSeoPageProofComplete(item.path)) return false;
    const identity = seoPageIdentityFromPath(item.path);
    recordCompleted({
      path: item.path,
      evidence: `output/seo-agents/${identity.slug}/${identity.page}/final-judge.json`,
    });
    return true;
  };
  const tierA = (report.tierARecovery ?? [])
    .filter((item) => !skipIfComplete(item))
    .slice(0, 8)
    .map((item) => ({
      evidence: 'output/search-console/performance-latest.json',
      priority: item.evidenceFound ? 'high' : 'medium',
      task: `${item.action ?? 'classify'} ${item.path}; ${item.rationale ?? 'confirm the right recovery action before broad page edits'}`,
    }));
  const ctr = (report.opportunities?.highImpressionZeroClickPages ?? [])
    .filter((item) => !skipIfComplete(item))
    .slice(0, 8)
    .map((item) => ({
      evidence: 'output/search-console/performance-latest.json',
      priority: 'medium',
      task: `Review title/meta, above-fold answer, internal links, and page-specific evidence for ${item.path} (${item.impressions} impressions, 0 clicks).`,
    }));

  return {
    actions: [...tierA, ...ctr],
    completed,
    note: '',
    totals: report.totals ?? null,
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
  let relativePath = unixPath(relative(distRoot, filePath));
  if (relativePath.startsWith('client/')) relativePath = relativePath.slice('client/'.length);
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
  if (htmlFiles.length === 0) {
    return {
      note: 'not enough data: dist has no built HTML files, so built internal links cannot be counted until after npm run build.',
      byTarget,
    };
  }

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
  const searchConsoleDiscovery = readJson('output/search-console-discovery.json');
  const indexingRequests = searchConsoleIndexingRequests();
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
  const hasBuiltLinkEvidence = !linkEvidence.note;
  if (linkEvidence.note) warnings.push(linkEvidence.note);

  for (const gap of searchConsole.gaps.slice(0, 10)) {
    try {
      const url = new URL(gap.url);
      const target = normalizeHrefToPath(url.pathname);
      const inboundLinks = linkEvidence.byTarget[target] ?? [];
      const sourceCount = new Set(inboundLinks.map((item) => item.source)).size;
      const hasEnoughInternalLinks = sourceCount >= 3;
      const discoveryRefreshedAt = searchConsoleDiscovery?.generatedAt
        ? new Date(searchConsoleDiscovery.generatedAt).toLocaleString('en-AU', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Australia/Brisbane',
          })
        : '';
      const indexingRequest = searchConsoleIndexingRequestForUrl(gap.url, indexingRequests);
      const indexingRequestTime = formatIndexingRequestTime(indexingRequest);
      const nextProofStep = indexingRequest
        ? `Search Console UI request-indexing was submitted ${indexingRequestTime || 'recently'}; recheck after Google crawls`
        : discoveryRefreshedAt
          ? `manual request indexing or recheck after Google crawls because discovery was refreshed ${discoveryRefreshedAt}`
          : 'URL inspection/discovery after deploy';
      suggestions.push({
        anchorIdea: url.pathname.replace(/^\/tools\/|^\/blog\/how-to-use-|\/$/g, '').replace(/-/g, ' '),
        priority: hasBuiltLinkEvidence ? (hasEnoughInternalLinks ? 'medium' : 'high') : indexingRequest ? 'medium' : 'high',
        reason: hasBuiltLinkEvidence
          ? hasEnoughInternalLinks
            ? `Search Console state: ${gap.coverageState}; ${sourceCount} built pages already link here, so next proof step is ${nextProofStep}.`
            : `Search Console state: ${gap.coverageState}; only ${sourceCount} built pages link here, so add contextual support first.`
          : indexingRequest
            ? `Search Console state: ${gap.coverageState}; built link counts are unavailable until npm run build because dist is missing, but next proof step is ${nextProofStep}.`
            : `Search Console state: ${gap.coverageState}; built link counts are unavailable until npm run build, so build first before deciding whether contextual link support is needed.`,
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

  const hasHighPriorityAction = suggestions.some((suggestion) => /^high$/i.test(String(suggestion.priority)));
  const status = hasHighPriorityAction ? 'attention' : warnings.length ? 'not enough data' : 'pass';
  const report = {
    generatedAt,
    kind: 'link-helper',
    sitemap: { note: sitemap.note, urlCount: sitemap.urls.length },
    sources: {
      analytics: { note: analytics.note, topPages: analytics.topPages, topTools: analytics.topTools },
      crawlScout: { completed: crawlScout.completed, note: crawlScout.note, opportunities: crawlScout.opportunities },
      searchConsole,
      searchConsoleDiscovery: searchConsoleDiscovery ? { generatedAt: searchConsoleDiscovery.generatedAt } : null,
      searchConsoleIndexingRequests: {
        count: indexingRequests.requests.length,
        generatedAt: indexingRequests.generatedAt,
      },
    },
    linkEvidence,
    status,
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
  const indexingRequests = searchConsoleIndexingRequests();
  const coverageExport = googleCoverageExportSignals();
  const performanceExport = googlePerformanceExportSignals();
  const crawlScout = crawlScoutSignals();
  const sitemap = readSitemapUrls();
  const productionSitemap = readJson('output/production-sitemap-check.json');
  const indexNow = readJson('output/indexnow-submission.json');
  const dataForSeo = readJson('output/dataforseo-account.json');
  const warnings = [];

  if (!marketing) warnings.push('not enough data: marketing orchestrator report is missing.');
  if (searchConsole.note) warnings.push(searchConsole.note);
  if (coverageExport.note) warnings.push(coverageExport.note);
  if (performanceExport.note) warnings.push(performanceExport.note);
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
  const hasBuiltLinkEvidence = !linkEvidence.note;
  if (linkEvidence.note) warnings.push(linkEvidence.note);
  const allCurrentGapsHaveIndexingRequests =
    searchConsole.gaps.length > 0 &&
    searchConsole.gaps.every((gap) => searchConsoleIndexingRequestForUrl(gap.url, indexingRequests));
  const marketingActions = (marketing?.actions ?? marketing?.recommendations ?? [])
    .slice(0, 3)
    .flatMap((item) => {
      const task = item.title ?? item.action ?? JSON.stringify(item).slice(0, 160);
      const isRequestedIndexingRecheck = /recheck requested indexing after google crawls/i.test(task);
      if (isRequestedIndexingRecheck && allCurrentGapsHaveIndexingRequests) {
        return [
          {
            evidence:
              'output/marketing-orchestrator/daily-plan.json + docs/search-console-indexing-requests.json + output/agent-tools/link-helper/latest.md',
            priority: 'monitor',
            task:
              'Monitor requested indexing after Google crawls; current URL Inspection gaps already have request-indexing proof, so do not repeat Search Console clicks.',
          },
        ];
      }

      return [
        {
          evidence: 'output/marketing-orchestrator/daily-plan.json',
          priority: item.priority ?? 'medium',
          task,
        },
      ];
    });

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
      const indexingRequest = searchConsoleIndexingRequestForUrl(gap.url, indexingRequests);
      const indexingRequestTime = formatIndexingRequestTime(indexingRequest);
      const followUpTask = indexingRequest
        ? `Search Console UI request-indexing was submitted ${indexingRequestTime || 'recently'}; recheck after Google crawls`
        : discoveryTask;

      return {
        evidence:
          'output/search-console-url-inspection.json + output/search-console-discovery.json + docs/search-console-indexing-requests.json + output/agent-tools/link-helper/latest.md',
        priority: hasBuiltLinkEvidence ? (hasEnoughInternalLinks ? 'medium' : 'high') : indexingRequest ? 'medium' : 'high',
        task: hasBuiltLinkEvidence
          ? hasEnoughInternalLinks
            ? `${followUpTask} for ${gap.url}; built link proof already shows ${sourceCount} source pages linking to it (${gap.coverageState}).`
            : `Improve contextual links and clarity for ${gap.url}; built link proof shows only ${sourceCount} source pages linking to it (${gap.coverageState}).`
          : indexingRequest
            ? `${followUpTask} for ${gap.url}; built link proof is unavailable until npm run build, so do not infer 0 source links from the cleaned workspace (${gap.coverageState}).`
            : `Run npm run build, then rerun link-helper before deciding contextual link work for ${gap.url}; built link proof is unavailable in the cleaned workspace (${gap.coverageState}).`,
      };
    }),
    ...coverageExport.actions.slice(0, 4).map((item) => ({
      evidence: 'output/search-console-coverage-export.json',
      priority: item.priority ?? 'medium',
      task: item.task,
    })),
    ...performanceExport.actions.slice(0, 8),
    ...marketingActions,
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

  const hasHighPriorityAction = actions.some((action) => /^high$/i.test(String(action.priority)));
  const status = hasHighPriorityAction ? 'attention' : warnings.length ? 'not enough data' : 'pass';
  const report = {
    actions,
    generatedAt,
    kind: 'seo-console',
    sources: {
      crawlScout: crawlScout.note ? 'not enough data' : 'present',
      dataForSeo: dataForSeo ? 'present' : 'not enough data',
      googleCoverageExport: coverageExport.note ? 'not enough data' : 'present',
      googlePerformanceExport: performanceExport.note ? 'not enough data' : 'present',
      indexNow: indexNow ? 'present' : 'not enough data',
      marketing: marketing ? 'present' : 'not enough data',
      productionSitemap: productionSitemap ? 'present' : 'not enough data',
      searchConsoleDiscovery: searchConsoleDiscovery ? 'present' : 'not enough data',
      searchConsoleIndexingRequests: indexingRequests.requests.length ? 'present' : 'not enough data',
      searchConsole: searchConsole.note ? 'not enough data' : 'present',
      sitemap: sitemap.note ? 'not enough data' : 'present',
    },
    linkEvidence,
    coverageExport: { latest: coverageExport.latest, totals: coverageExport.totals },
    performanceExport: { completed: performanceExport.completed ?? [], totals: performanceExport.totals },
    status,
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

const commonApprovalGate = 'No public posting, paid research, deployment, or account changes without exact approval.';

const fallbackAgentLaneDefinitions = [
  {
    lane: 'seo',
    labels: ['seo', 'indexing', 'internal-link', 'search'],
    patterns: [/seo|index|ranking|search console|internal link|sitemap|crawl|semantic|keyword|serp/i],
    primaryLens: 'SEO Specialist',
    proofLens: 'Evidence Collector',
    docs: [
      'docs/recommended-agency-agents.md',
      'docs/search-engine-land-seo-task-board.md',
      'docs/seo-agent-operating-system.md',
      'docs/google-search-central-notes.md',
      'docs/agent-cli.md',
    ],
    commands: ['npm run aft -- seo-console', 'npm run aft -- link-helper', 'npm run aft -- indexing-gaps'],
    evidencePaths: [
      'output/agent-tools/seo-console/latest.json',
      'output/agent-tools/link-helper/latest.json',
      'output/search-console-url-inspection.json',
      'output/search-console/performance-latest.json',
      'output/seo-agent-self-evaluation.json',
    ],
  },
  {
    lane: 'api',
    labels: ['api', 'ask', 'mcp'],
    patterns: [/ask|api|mcp|openapi|tool runner|deterministic|schema|ollama/i],
    primaryLens: 'API And MCP Tester + Agentic Search Optimizer',
    proofLens: 'Reality Checker',
    docs: ['docs/recommended-agency-agents.md', 'docs/ask-api-mcp-alpha.md', 'docs/agent-cli.md'],
    commands: ['npm run aft -- ask-audit', 'npm run aft -- api-ready', 'npm run aft -- mcp-smoke'],
    evidencePaths: [
      'output/agent-tools/ask-audit/latest.json',
      'output/agent-tools/api-ready/latest.json',
      'output/agent-tools/mcp-smoke/latest.json',
    ],
  },
  {
    lane: 'promotion',
    labels: ['promotion', 'medium', 'reddit', 'quora', 'bluesky', 'devto'],
    patterns: [/promotion|post|medium|reddit|quora|bluesky|dev|pinterest|social|publish|space|article/i],
    primaryLens: 'Technical Writer + Legal Compliance Checker',
    proofLens: 'Evidence Collector',
    docs: [
      'docs/recommended-agency-agents.md',
      'docs/brand-code.md',
      'docs/article-writing-agent-standard.md',
      'docs/promotion-queue.md',
    ],
    commands: ['npm run aft -- proof-check', 'npm run promotion:weekly-review'],
    evidencePaths: [
      'output/promotion/medium-quality-report.json',
      'output/promotion/reddit-quality-report.json',
      'output/promotion/quora-quality-report.json',
      'output/promotion/bluesky/bluesky-quality-report.json',
      'output/promotion/devto/devto-quality-report.json',
    ],
  },
  {
    lane: 'deploy',
    labels: ['deploy', 'hostinger', 'dns', 'hosting'],
    patterns: [/hostinger|deploy|deployment|dns|hosting|production|node runtime|vps|docker/i],
    primaryLens: 'Automation Governance Architect',
    proofLens: 'Reality Checker',
    docs: ['docs/recommended-agency-agents.md', 'docs/hostinger-api-agent-guide.md', 'docs/deployment-checklist.md'],
    commands: ['npm run automation:env-check', 'npm run aft -- hostinger', 'npm run check:live-ask'],
    evidencePaths: ['output/automation-environment.md', 'output/hostinger/status.json', 'output/live-ask-check.json'],
  },
  {
    lane: 'analytics',
    labels: ['analytics', 'usage', 'data'],
    patterns: [/analytics|usage|data asset|dashboard|visitor|tool-use|events/i],
    primaryLens: 'Analytics Reporter',
    proofLens: 'Reality Checker',
    docs: ['docs/recommended-agency-agents.md', 'docs/analytics-dashboard.md', 'docs/original-data-asset-plan.md'],
    commands: ['npm run aft -- usage-summary', 'npm run aft -- usage-notes'],
    evidencePaths: ['output/agent-tools/usage-summary/latest.json', 'output/original-data-assets/latest.json'],
  },
  {
    lane: 'automation',
    labels: ['automation', 'cron', 'scheduled'],
    patterns: [/automation|cron|schedule|recurring|daily|weekly|monthly|heartbeat/i],
    primaryLens: 'Automation Governance Architect',
    proofLens: 'Reality Checker',
    docs: ['docs/recommended-agency-agents.md', 'docs/automation-operating-plan.md', 'docs/marketing-orchestrator.md'],
    commands: ['npm run automation:env-check', 'npm run aft -- status', 'npm run aft -- proof-check'],
    evidencePaths: ['output/automation-environment.md', 'output/marketing-orchestrator/daily-plan.json'],
  },
  {
    lane: 'ui',
    labels: ['ui', 'accessibility', 'images', 'gallery'],
    patterns: [/ui|layout|accessibility|image|gallery|art|css|component|mobile|form|calculator/i],
    primaryLens: 'Accessibility Auditor + Performance Benchmarker',
    proofLens: 'Evidence Collector',
    docs: ['docs/recommended-agency-agents.md', 'docs/smoke-kawaii-image-system.md', 'docs/full-site-improvement-plan.md'],
    commands: ['npm run build', 'npm run check:site', 'npm run images:qa', 'npm run gallery:qa'],
    evidencePaths: [
      'output/tool-art/qa/latest.json',
      'output/agent-tools/site-sitemap/latest.json',
      'output/check-built-site.json',
    ],
  },
  {
    lane: 'code',
    labels: ['code', 'review', 'fix'],
    patterns: [/review|bug|fix|refactor|test|typescript|script|code/i],
    primaryLens: 'Minimal Change Engineer + Code Reviewer',
    proofLens: 'Evidence Collector',
    docs: ['docs/recommended-agency-agents.md', 'AGENTS.md'],
    commands: ['npm run check'],
    evidencePaths: [],
  },
];

function normalizeLaneDefinition(definition) {
  return {
    commands: Array.isArray(definition.commands) ? definition.commands : [],
    docs: Array.isArray(definition.docs) ? definition.docs : [],
    evidencePaths: Array.isArray(definition.evidencePaths) ? definition.evidencePaths : [],
    keywords: Array.isArray(definition.keywords) ? definition.keywords : [],
    labels: Array.isArray(definition.labels) ? definition.labels : [],
    lane: String(definition.lane || ''),
    patterns: Array.isArray(definition.patterns) ? definition.patterns : [],
    primaryLens: String(definition.primaryLens || 'Minimal Change Engineer + Code Reviewer'),
    proofLens: String(definition.proofLens || 'Evidence Collector'),
  };
}

function routingRules() {
  const configured = readJson(AGENT_ROUTING_RULES_PATH);
  const lanes = Array.isArray(configured?.lanes)
    ? configured.lanes.map(normalizeLaneDefinition).filter((definition) => definition.lane)
    : [];

  return {
    approvalGates: Array.isArray(configured?.approvalGates) ? configured.approvalGates.map(String) : [],
    lanes: lanes.length ? lanes : fallbackAgentLaneDefinitions.map(normalizeLaneDefinition),
    source: lanes.length ? AGENT_ROUTING_RULES_PATH : 'fallback',
  };
}

function matchesLaneDefinition(definition, value) {
  const lower = String(value).toLowerCase();
  return (
    definition.patterns.some((pattern) => pattern.test(value)) ||
    definition.keywords.some((keyword) => lower.includes(String(keyword).toLowerCase()))
  );
}

function normalizeLane(value = '') {
  const definitions = routingRules().lanes;
  const lower = String(value).toLowerCase();
  return (
    definitions.find((definition) => definition.lane === lower || definition.labels.includes(lower)) ??
    definitions.find((definition) => matchesLaneDefinition(definition, value)) ??
    definitions.find((definition) => definition.lane === 'code')
  );
}

function sourceStatus(path) {
  const fullPath = rootPath(path);
  const present = existsSync(fullPath);
  const json = present && /\.json$/i.test(path) ? readJson(path) : null;
  return {
    generatedAt: json?.generatedAt ?? json?.timestamp ?? '',
    path,
    present,
    status: present ? 'present' : 'not enough data',
  };
}

function publicUrlsInText(text) {
  return [
    ...new Set(
      [...String(text).matchAll(/https?:\/\/[^\s)"'<>]+/g)].map((match) => match[0].replace(/[).,;:!?]+$/g, '')),
    ),
  ];
}

function outputPathsInText(text) {
  return [
    ...new Set(
      [...String(text).matchAll(/\b(?:output|public|dist)\/[^\s)"'<>]+/g)].map((match) =>
        unixPath(match[0].replace(/[).,;:!?]+$/g, '')),
      ),
    ),
  ];
}

export function buildAgentRouteReport(task = '') {
  const generatedAt = new Date().toISOString();
  const cleanTask = String(task).trim();
  const rules = routingRules();
  const definition = normalizeLane(cleanTask);
  const issues = cleanTask ? [] : ['Task text is empty, so routing fell back to the code lane.'];
  const approvalGates = rules.approvalGates.length
    ? rules.approvalGates
    : [commonApprovalGate, 'If evidence is missing, report "not enough data" instead of guessing.'];
  const report = {
    approvalGates,
    commands: definition.commands,
    docs: definition.docs,
    generatedAt,
    kind: 'agent-route',
    lane: definition.lane,
    primaryLens: definition.primaryLens,
    proofLens: definition.proofLens,
    sourceStatuses: [...definition.docs, ...definition.evidencePaths].map(sourceStatus),
    routingRulesPath: AGENT_ROUTING_RULES_PATH,
    routingRulesSource: rules.source,
    status: issues.length ? 'attention' : 'pass',
    task: cleanTask,
    issues,
  };
  const paths = writeReport(
    'route',
    report,
    `# Agent Route

Generated: ${generatedAt}

Task: ${cleanTask || 'not provided'}

Lane: ${definition.lane}
Primary lens: ${definition.primaryLens}
Proof lens: ${definition.proofLens}

## Read First

${markdownList(definition.docs.map((doc) => doc))}

## Run

${markdownList(definition.commands.map((command) => `\`${command}\``))}

## Approval Gates

${markdownList(report.approvalGates)}
`,
  );
  return { ...report, paths };
}

export function buildEvidencePackReport(lane = 'code') {
  const generatedAt = new Date().toISOString();
  const definition = normalizeLane(lane);
  const sources = [...definition.docs, ...definition.evidencePaths].map(sourceStatus);
  const missing = sources.filter((source) => !source.present && source.path.startsWith('output/'));
  const report = {
    commands: definition.commands,
    docs: definition.docs,
    generatedAt,
    kind: 'evidence-pack',
    lane: definition.lane,
    primaryLens: definition.primaryLens,
    proofLens: definition.proofLens,
    sources,
    status: missing.length ? 'attention' : 'pass',
    warnings: missing.map((source) => `not enough data: ${source.path} is missing.`),
  };
  const paths = writeReport(
    'evidence-pack',
    report,
    `# Agent Evidence Pack

Generated: ${generatedAt}

Lane: ${definition.lane}
Primary lens: ${definition.primaryLens}
Proof lens: ${definition.proofLens}

## Docs

${markdownList(definition.docs)}

## Commands

${markdownList(definition.commands.map((command) => `\`${command}\``))}

## Sources

${markdownList(sources.map((source) => `${source.status}: ${source.path}${source.generatedAt ? ` (${source.generatedAt})` : ''}`))}

## Warnings

${markdownList(report.warnings)}
`,
  );
  return { ...report, paths };
}

function outputPathChecks(outputPaths) {
  return outputPaths.map((path) => ({ exists: existsSync(rootPath(path)), path }));
}

function claimCheckMarkdown(report) {
  const urlChecks = report.evidence.publicUrlChecks ?? [];
  return `# Agent Claim Check

Generated: ${report.generatedAt}

Claim: ${report.claim || 'not provided'}
Status: ${report.status}
Claim type: ${report.claimType}

## Evidence Found

${markdownList([...report.evidence.publicUrls, ...report.evidence.outputPaths])}

## Local Proof Paths

${markdownList(
  report.evidence.outputPathChecks.map((item) => `${item.exists ? 'present' : 'missing'}: ${item.path}`),
)}

## Public URL Checks

${markdownList(urlChecks.map((item) => `${item.ok ? 'verified' : 'failed'}: ${item.url} (status ${item.status ?? 'n/a'})`))}

## Issues

${markdownList(report.issues)}

## Warnings

${markdownList(report.warnings)}
`;
}

function writeClaimCheckReport(report) {
  const paths = writeReport('claim-check', report, claimCheckMarkdown(report));
  return { ...report, paths };
}

export function buildClaimCheckReport(claim = '') {
  const generatedAt = new Date().toISOString();
  const cleanClaim = String(claim).trim();
  const publicUrls = publicUrlsInText(cleanClaim);
  const outputPaths = outputPathsInText(cleanClaim);
  const localProofChecks = outputPathChecks(outputPaths);
  const hasPublicProof = publicUrls.length > 0;
  const hasGeneratedProof = localProofChecks.some((item) => item.exists);
  const claimType = /(posted|published|fixed|updated|done|complete|live|production ready|healthy)/i.test(cleanClaim)
    ? 'live-or-done'
    : 'general';
  const issues = [];
  const warnings = [];
  if (!cleanClaim) issues.push('Claim text is empty.');
  for (const item of localProofChecks.filter((proof) => !proof.exists)) {
    if (claimType === 'live-or-done') {
      issues.push(`Proof path not found: ${item.path}`);
    } else {
      warnings.push(`Proof path not found: ${item.path}`);
    }
  }
  if (claimType === 'live-or-done' && !hasPublicProof && !hasGeneratedProof) {
    issues.push('No proof evidence found for a live/done claim.');
  }
  if (claimType === 'general' && !hasPublicProof && !hasGeneratedProof) {
    warnings.push('No proof evidence found. This is only safe as an idea or unverified note.');
  }
  const report = {
    claim: cleanClaim,
    claimType,
    evidence: { publicUrls, publicUrlChecks: [], outputPathChecks: localProofChecks, outputPaths },
    generatedAt,
    issues,
    kind: 'claim-check',
    requiredProof: ['public URL', 'public profile/feed proof', 'screenshot path', 'generated report path'],
    status: reportStatusFromIssues(issues, warnings),
    warnings,
  };
  return writeClaimCheckReport(report);
}

async function defaultPublicUrlCheck(url, { timeoutMs = 6000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  async function fetchFor(method) {
    return fetch(url, {
      headers: { accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8' },
      method,
      redirect: 'follow',
      signal: controller.signal,
    });
  }

  try {
    let response = await fetchFor('HEAD');
    if (response.status === 405 || response.status === 403) {
      response = await fetchFor('GET');
    }
    return { ok: response.status >= 200 && response.status < 400, status: response.status, url };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      ok: false,
      status: 0,
      url,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function runClaimCheckReport(claim = '', options = {}) {
  let report = buildClaimCheckReport(claim);
  if (!options.verifyUrls) return report;

  const checkUrl = options.checkUrl ?? ((url) => defaultPublicUrlCheck(url, options));
  const publicUrlChecks = [];
  const issues = [...report.issues];

  for (const url of report.evidence.publicUrls) {
    const result = await checkUrl(url);
    const normalized = {
      ok: Boolean(result?.ok),
      status: Number(result?.status ?? 0),
      url,
      ...(result?.error ? { error: String(result.error) } : {}),
    };
    publicUrlChecks.push(normalized);
    if (!normalized.ok) {
      issues.push(`Public URL did not verify: ${url} (status ${normalized.status || 'n/a'})`);
    }
  }

  report = {
    ...report,
    evidence: { ...report.evidence, publicUrlChecks },
    issues,
    status: reportStatusFromIssues(issues, report.warnings),
    urlVerification: {
      checked: true,
      count: publicUrlChecks.length,
    },
  };
  return writeClaimCheckReport(report);
}

function toolArtStatus(slug) {
  const approvals = readJson('src/data/toolArtApprovals.json');
  if (!Array.isArray(approvals)) return { status: 'not enough data', approved: false };
  const matches = approvals.filter((entry) => entry?.slug === slug);
  return {
    approved: matches.some((entry) => entry.status === 'approved'),
    entries: matches.map((entry) => ({ kind: entry.kind, status: entry.status, path: entry.publicPath })),
    status: matches.length ? 'present' : 'not enough data',
  };
}

function deepReviewStatus(slug) {
  const path = 'src/data/toolDeepAudit.ts';
  const text = readText(path);
  if (!text) return { deepReviewed: false, path, status: 'not enough data' };

  const needles = [`slug: '${slug}'`, `slug: "${slug}"`];
  const slugIndex = needles.map((needle) => text.indexOf(needle)).find((index) => index >= 0) ?? -1;
  if (slugIndex < 0) return { deepReviewed: false, path, status: 'not enough data' };

  const nextRecord = text.indexOf('\n  {', slugIndex + 1);
  const block = text.slice(slugIndex, nextRecord > slugIndex ? nextRecord : slugIndex + 1400);
  const status = block.match(/status:\s*['"]([^'"]+)['"]/)?.[1] ?? 'not enough data';
  const reviewedAt =
    block.match(/reviewedAt:\s*['"]([^'"]+)['"]/)?.[1] ?? block.match(/reviewedOn:\s*['"]([^'"]+)['"]/)?.[1] ?? '';
  return {
    deepReviewed: status === 'deep-reviewed',
    path,
    reviewedAt,
    status,
  };
}

function toolAnalyticsStatus(slug) {
  const signals = analyticsSignals();
  const toolRow = signals.topTools.find((row) => row[0] === slug);
  const pagePath = `/tools/${slug}/`;
  const pageRow = signals.topPages.find((row) => row[0] === pagePath);

  return {
    note: signals.note,
    pagePath,
    pageViews: pageRow?.[1] ?? 0,
    status: signals.note ? 'not enough data' : 'present',
    toolActions: toolRow?.[1] ?? 0,
  };
}

function toolSearchConsoleStatus(slug) {
  const url = `${SITE_ORIGIN}/tools/${slug}/`;
  const report = searchConsoleGaps();
  const gap = report.gaps.find((item) => item.url === url || item.url === url.replace(/\/$/, ''));

  return {
    coverageState: gap?.coverageState ?? '',
    gap: gap ?? null,
    note: report.note,
    status: report.note ? 'not enough data' : gap ? 'attention' : 'pass',
    url,
  };
}

export function buildToolBriefReport(slug = '') {
  const generatedAt = new Date().toISOString();
  const cleanSlug = String(slug).trim();
  const tool = extractToolRecords().find((record) => record.slug === cleanSlug) ?? null;
  const apiSlugs = extractApiRegistrySlugs();
  const sitemap = readSitemapUrls();
  const targetPath = `/tools/${cleanSlug}/`;
  const sitemapUrl = `${SITE_ORIGIN}${targetPath}`;
  const linkEvidence = builtInternalLinkEvidence([targetPath]);
  const searchConsole = toolSearchConsoleStatus(cleanSlug);
  const deepReview = deepReviewStatus(cleanSlug);
  const issues = [];
  const warnings = [];
  if (!cleanSlug) issues.push('Tool slug is required.');
  if (!tool) issues.push(`No tool record found for ${cleanSlug || '(empty slug)'}.`);
  if (sitemap.note) warnings.push(sitemap.note);
  if (linkEvidence.note) warnings.push(linkEvidence.note);
  if (searchConsole.note) warnings.push(searchConsole.note);

  const report = {
    api: {
      ready: apiSlugs.has(cleanSlug),
      registryPath: 'src/lib/apiToolRegistry.ts',
    },
    art: toolArtStatus(cleanSlug),
    analytics: toolAnalyticsStatus(cleanSlug),
    deepReview,
    generatedAt,
    guide: {
      exists: hasGuide(cleanSlug),
      path: `src/pages/blog/how-to-use-${cleanSlug}.astro`,
      url: `${SITE_ORIGIN}/blog/how-to-use-${cleanSlug}/`,
    },
    issues,
    kind: 'tool-brief',
    linkEvidence,
    nextProofCommands: [
      `npm run aft -- page-seo ${cleanSlug}`,
      'npm run aft -- link-helper',
      'npm run aft -- usage-summary',
      'npm run aft -- site-sitemap',
    ],
    related: {
      count: tool?.relatedSlugs?.length ?? tool?.relatedCount ?? 0,
      slugs: tool?.relatedSlugs ?? [],
    },
    renderer: {
      exists: hasToolRenderer(cleanSlug),
    },
    searchConsole,
    sitemap: {
      present: sitemap.urls.includes(sitemapUrl),
      url: sitemapUrl,
      urlCount: sitemap.urls.length,
      note: sitemap.note,
    },
    slug: cleanSlug,
    status: reportStatusFromIssues(issues, warnings),
    tool,
    warnings,
  };
  const paths = writeReport(
    'tool-brief',
    report,
    `# Tool Brief: ${cleanSlug || 'unknown'}

Generated: ${generatedAt}

Status: ${report.status}

## Tool

${tool ? `- ${tool.name} (${tool.slug})\n- Category: ${tool.category}\n- Examples: ${tool.exampleCount}\n- FAQs: ${tool.faqCount}` : '- not enough data: tool record missing'}

## Evidence

- Deep review: ${deepReview.status}
- Search Console: ${searchConsole.status}
- Usage: ${report.analytics.status}
- Related tools: ${report.related.count}

## Proof Commands

${markdownList(report.nextProofCommands.map((command) => `\`${command}\``))}

## Gaps

${markdownList([...issues, ...warnings])}
`,
  );
  return { ...report, paths };
}

export function buildAgentDoctorReport() {
  const generatedAt = new Date().toISOString();
  const aftCli = readText('scripts/aft-cli.mjs');
  const docs = [
    'AGENTS.md',
    'docs/recommended-agency-agents.md',
    AGENT_ROUTING_RULES_PATH,
    'docs/agent-cli.md',
    'docs/seo-tool-review-workflow.md',
    'docs/seo-tool-review-queue.md',
    'docs/marketing-orchestrator.md',
    'docs/seo-agent-operating-system.md',
    'docs/ask-api-mcp-alpha.md',
    'docs/automation-operating-plan.md',
    'docs/analytics-dashboard.md',
    'docs/hostinger-api-agent-guide.md',
    'docs/medium-promotion-agent.md',
    'docs/reddit-promotion-agent.md',
    'docs/quora-promotion-agent.md',
    'docs/bluesky-promotion-agent.md',
    'docs/devto-promotion-agent.md',
  ].map((path) => ({ path, present: existsSync(rootPath(path)) }));
  const commandIds = [
    'route',
    'evidence-pack',
    'claim-check',
    'tool-brief',
    'seo-tool-queue',
    'seo-tool-research',
    'seo-page-score',
    'seo-approval-status',
    'agent-doctor',
  ];
  const rules = routingRules();
  const checks = [
    ...commandIds.map((id) => ({
      id: `aft-${id}-command`,
      ok: aftCli.includes(`command('${id}')`) || aftCli.includes(`command("${id}")`),
    })),
    {
      id: 'routing-rules-config',
      ok:
        rules.source === AGENT_ROUTING_RULES_PATH &&
        rules.lanes.some((definition) => definition.lane === 'seo') &&
        rules.lanes.some((definition) => definition.lane === 'seo-review'),
    },
    {
      id: 'recommended-routing-doc',
      ok: docs.some((doc) => doc.path === 'docs/recommended-agency-agents.md' && doc.present),
    },
    {
      id: 'proof-policy-present',
      ok: /not enough data|proof/i.test(readText('docs/recommended-agency-agents.md')),
    },
  ];
  const issues = [
    ...docs.filter((doc) => !doc.present).map((doc) => `Missing agent doc: ${doc.path}`),
    ...checks.filter((check) => !check.ok).map((check) => `Failed check: ${check.id}`),
  ];
  const report = {
    checks,
    commands: [
      'npm run aft -- status',
      'npm run aft -- route "<task>"',
      'npm run aft -- evidence-pack api',
      'npm run aft -- claim-check "<claim>"',
      'npm run aft -- tool-brief percentage-calculator',
      'npm run aft -- seo-tool-queue',
      'npm run aft -- seo-tool-research wallpaper-calculator --page tool',
      'npm run aft -- seo-page-score wallpaper-calculator --page tool',
      'npm run aft -- seo-approval-status wallpaper-calculator',
      'npm run aft -- agent-doctor',
    ],
    docs,
    generatedAt,
    issues,
    kind: 'agent-doctor',
    status: reportStatusFromIssues(issues),
  };
  const paths = writeReport(
    'agent-doctor',
    report,
    `# Agent Doctor

Generated: ${generatedAt}

Status: ${report.status}

## Docs

${markdownList(docs.map((doc) => `${doc.present ? 'OK' : 'Missing'} ${doc.path}`))}

## Checks

${markdownList(checks.map((check) => `${check.ok ? 'OK' : 'Fail'} ${check.id}`))}

## Issues

${markdownList(issues)}
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
