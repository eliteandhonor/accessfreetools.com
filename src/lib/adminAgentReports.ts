import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { tools } from '../data/tools';
import { answerUtilityQuestion } from './askToolRouter';
import { listApiTools, runApiTool } from './apiToolRegistry';
import { summarizeAnalytics } from './siteAnalytics';

export const AGENT_TOOLS_OUTPUT_DIR = 'output/agent-tools';
export const AGENT_TOOL_KINDS = [
  'ask-audit',
  'api-ready',
  'mcp-smoke',
  'link-helper',
  'seo-console',
  'content-quality',
] as const;

export type AgentToolKind = (typeof AGENT_TOOL_KINDS)[number];

const SITE_ORIGIN = 'https://accessfreetools.com';
const ASK_AUDIT_CASES = [
  {
    expected: ['43.2'],
    forbidden: [] as RegExp[],
    inputs: { mode: 'percent-of', percent: 18, value: 240 },
    question: 'What is 18% of 240?',
    slug: 'percentage-calculator',
  },
  {
    expected: ['9m 16s'],
    forbidden: [/555\.?5{3,}/i, /9\.2592592593 minutes/i],
    inputs: { efficiencyPercent: 90, fileSize: 5, fileUnit: 'GB', speedMbps: 80 },
    question: 'How long will a 5GB file take to download at 80 Mbps?',
    slug: 'download-time-calculator',
  },
  {
    expected: ['5 amps'],
    forbidden: [] as RegExp[],
    inputs: { phase: 'single-phase', powerFactor: 1, volts: 120, watts: 600 },
    question: 'Convert 600 watts to amps at 120 volts.',
    slug: 'watts-to-amps-calculator',
  },
  {
    expected: ['74 80 lb bags'],
    forbidden: [] as RegExp[],
    inputs: { depthInches: 4, lengthFeet: 10, wastePercent: 10, widthFeet: 12 },
    question: 'How much concrete for a 10 by 12 slab 4 inches thick?',
    slug: 'concrete-calculator',
  },
];

function rootPath(...parts: string[]) {
  return resolve(process.cwd(), ...parts);
}

function unixPath(value: string) {
  return value.replace(/\\/g, '/');
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch (error) {
    return { parseError: error instanceof Error ? error.message : String(error) };
  }
}

function readJsonFile(path: string) {
  if (!existsSync(path)) return null;
  return safeJsonParse(readFileSync(path, 'utf8'));
}

function readTextFile(path: string) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function markdownList(items: string[], empty = '- none') {
  return items.length ? items.map((item) => `- ${item}`).join('\n') : empty;
}

function stripHtml(text: string) {
  return text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function reportStatus(issues: string[], warnings: string[] = []) {
  if (issues.length) return 'fail';
  if (warnings.length) return 'attention';
  return 'pass';
}

function builtHtmlPath(pagePath: string) {
  const cleanPath = pagePath.replace(/^\/+|\/+$/g, '');
  return rootPath('dist', cleanPath, 'index.html');
}

async function sourceContainsLink(origin: string | undefined, source: string, target: string) {
  let text = readTextFile(builtHtmlPath(source));

  if (!text && origin) {
    try {
      const response = await fetch(`${origin.replace(/\/$/, '')}${source}`, {
        headers: { accept: 'text/html' },
      });
      if (response.ok) text = await response.text();
    } catch {
      // Missing network proof is handled by returning null below.
    }
  }

  if (!text) return null;

  return text.includes(`href="${target}"`) || text.includes(`href='${target}'`);
}

function writeReport(kind: AgentToolKind, report: Record<string, unknown>, markdown: string) {
  const dir = rootPath(AGENT_TOOLS_OUTPUT_DIR, kind);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(join(dir, 'latest.md'), `${markdown.trim()}\n`);
  return {
    jsonPath: unixPath(relative(process.cwd(), join(dir, 'latest.json'))),
    markdownPath: unixPath(relative(process.cwd(), join(dir, 'latest.md'))),
  };
}

function includesExpected(value: unknown, expected: string[]) {
  const text = JSON.stringify(value).toLowerCase();
  return expected.every((item) => text.includes(item.toLowerCase()));
}

function includesForbidden(value: unknown, forbidden: RegExp[]) {
  const text = JSON.stringify(value);
  return forbidden.filter((pattern) => pattern.test(text)).map((pattern) => pattern.toString());
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: { accept: 'application/json, text/event-stream', 'content-type': 'application/json' },
    method: 'POST',
  });
  const text = await response.text();
  return {
    body: text ? safeJsonParse(text) : {},
    ok: response.ok,
    status: response.status,
  };
}

export function readAgentToolReports() {
  const base = rootPath(AGENT_TOOLS_OUTPUT_DIR);

  return AGENT_TOOL_KINDS.map((kind) => {
    const jsonPath = join(base, kind, 'latest.json');
    const markdownPath = join(base, kind, 'latest.md');
    const report = readJsonFile(jsonPath);
    return {
      generatedAt: typeof report?.generatedAt === 'string' ? report.generatedAt : null,
      jsonPath: existsSync(jsonPath) ? unixPath(relative(process.cwd(), jsonPath)) : '',
      kind,
      markdownPath: existsSync(markdownPath) ? unixPath(relative(process.cwd(), markdownPath)) : '',
      report,
      status: typeof report?.status === 'string' ? report.status : 'not-run',
      updatedAt: existsSync(jsonPath) ? new Date(statSync(jsonPath).mtimeMs).toISOString() : null,
    };
  });
}

export async function refreshAskAuditReport() {
  const generatedAt = new Date().toISOString();
  const issues: string[] = [];
  const warnings: string[] = [];
  const results = [];

  for (const testCase of ASK_AUDIT_CASES) {
    const run = runApiTool(testCase.slug, testCase.inputs);
    const ask = await answerUtilityQuestion(testCase.question);
    const resultIssues: string[] = [];

    if (!includesExpected(run, testCase.expected)) {
      resultIssues.push('REST runner did not include the expected deterministic answer.');
    }
    if (ask.route.tool_slug !== testCase.slug) {
      resultIssues.push(`Ask routed to ${ask.route.tool_slug} instead of ${testCase.slug}.`);
    }
    if (!includesExpected(ask, testCase.expected)) {
      resultIssues.push('Ask answer did not include the expected deterministic result.');
    }

    const forbidden = includesForbidden({ answer: ask.answer, runAnswer: run.answer }, testCase.forbidden);
    if (forbidden.length) resultIssues.push(`Forbidden answer formatting found: ${forbidden.join(', ')}`);

    if (resultIssues.length) issues.push(`${testCase.slug}: ${resultIssues.join(' | ')}`);

    results.push({
      askAnswer: ask.answer,
      issues: resultIssues,
      route: ask.route,
      runAnswer: run.answer,
      slug: testCase.slug,
    });
  }

  const status = reportStatus(issues, warnings);
  const report = {
    generatedAt,
    issues,
    kind: 'ask-audit',
    notes: ['Rendered browser-page parity is checked by the CLI Playwright audit; this private browser report checks deterministic Ask/API parity.'],
    results,
    status,
    summary: { cases: ASK_AUDIT_CASES.length, issues: issues.length, warnings: warnings.length },
    warnings,
  };
  const paths = writeReport(
    'ask-audit',
    report,
    `# Ask Quality Auditor

Generated: ${generatedAt}

Status: ${status}

- Cases checked: ${ASK_AUDIT_CASES.length}
- Issues: ${issues.length}
- Warnings: ${warnings.length}

## Issues

${markdownList(issues)}

## Warnings

${markdownList(warnings)}

## Notes

${markdownList(report.notes)}
`,
  );

  return { ...report, paths };
}

export function refreshApiReadyReport() {
  const generatedAt = new Date().toISOString();
  const apiSlugs = new Set(listApiTools().map((tool) => tool.slug));
  const candidates = tools
    .filter((tool) => !apiSlugs.has(tool.slug))
    .map((tool) => {
      const risk =
        /finance|tax/i.test(tool.category) ? 'finance' : /health|fitness|pregnancy/i.test(tool.category) ? 'health' : /home|construction/i.test(tool.category) ? 'construction' : 'low';
      const score =
        (tool.examples.length >= 3 ? 25 : tool.examples.length * 6) +
        (tool.faq.length >= 6 ? 25 : tool.faq.length * 3) +
        (tool.seoDescription ? 15 : 0) +
        (tool.relatedSlugs.length >= 3 ? 15 : 0) +
        (risk === 'low' ? 20 : 5);
      return {
        category: tool.category,
        exampleCount: tool.examples.length,
        faqCount: tool.faq.length,
        name: tool.name,
        risk,
        score,
        slug: tool.slug,
      };
    })
    .sort((left, right) => right.score - left.score || left.slug.localeCompare(right.slug));

  const report = {
    currentApiTools: [...apiSlugs].sort(),
    generatedAt,
    kind: 'api-ready',
    recommendedNext: candidates.slice(0, 15),
    rules: [
      'Report-only: this does not generate code.',
      'Low-risk, guide-backed tools should be added first.',
      'Finance, health, construction, and electrical tools need warning text before API exposure.',
    ],
    status: 'pass',
    summary: { apiReadyTools: apiSlugs.size, candidatesChecked: candidates.length, totalToolRecords: tools.length },
  };
  const paths = writeReport(
    'api-ready',
    report,
    `# API Tool Registry Builder

Generated: ${generatedAt}

Status: pass

- API-ready tools: ${apiSlugs.size}
- Tool records checked: ${tools.length}
- Candidate tools: ${candidates.length}

## Recommended Next

${markdownList(candidates.slice(0, 15).map((tool) => `${tool.name} (${tool.slug}) - score ${tool.score}, risk ${tool.risk}`))}
`,
  );

  return { ...report, paths };
}

export async function refreshMcpSmokeReport(origin = SITE_ORIGIN) {
  const generatedAt = new Date().toISOString();
  const site = origin.replace(/\/$/, '');
  const issues: string[] = [];
  const checks = [];

  for (const check of [
    {
      body: { id: 1, jsonrpc: '2.0', method: 'tools/list', params: {} },
      expected: ['run_tool', 'search_tools'],
      label: 'tools/list',
    },
    {
      body: {
        id: 2,
        jsonrpc: '2.0',
        method: 'tools/call',
        params: { arguments: { query: 'percentage' }, name: 'search_tools' },
      },
      expected: ['percentage-calculator'],
      label: 'search_tools percentage',
    },
    {
      body: {
        id: 3,
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          arguments: { inputs: { mode: 'percent-of', percent: 18, value: 240 }, slug: 'percentage-calculator' },
          name: 'run_tool',
        },
      },
      expected: ['43.2'],
      label: 'run_tool percentage',
    },
  ]) {
    try {
      const response = await postJson(`${site}/mcp`, check.body);
      const ok = response.ok && includesExpected(response.body, check.expected);
      if (!ok) issues.push(`${check.label}: MCP response did not include expected evidence.`);
      checks.push({ ...check, ok, status: response.status });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      issues.push(`${check.label}: ${message}`);
      checks.push({ ...check, ok: false, status: 0 });
    }
  }

  const status = reportStatus(issues);
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

- Site: ${site}
- Checks: ${checks.length}
- Issues: ${issues.length}

## Issues

${markdownList(issues)}
`,
  );

  return { ...report, paths };
}

export async function refreshLinkHelperReport(origin?: string) {
  const generatedAt = new Date().toISOString();
  const inspection = readJsonFile(rootPath('output', 'search-console-url-inspection.json'));
  const savedAnalytics = readJsonFile(rootPath('output', 'analytics', 'summary.json'));
  const liveAnalytics = !savedAnalytics ? await summarizeAnalytics({ days: 30 }) : null;
  const warnings: string[] = [];
  const notes: string[] = [];
  if (!inspection) {
    notes.push('not enough data: Search Console inspection snapshots live on the local Codex machine, so this private browser report uses link proof and saved SEO actions instead.');
  }
  if (!savedAnalytics) {
    notes.push('Used the live first-party analytics event log because output/analytics/summary.json is a local CLI artifact.');
  }

  const linkChecks = [
    {
      priority: 'high',
      source: '/blog/how-to-use-paint-calculator/',
      target: '/tools/wallpaper-calculator/',
      why: 'Paint and wallpaper both start with wall area, so this is a natural contextual handoff.',
    },
    {
      priority: 'high',
      source: '/blog/how-to-use-flooring-calculator/',
      target: '/tools/wallpaper-calculator/',
      why: 'Flooring and wallpaper both use waste percent, but they need material-specific calculators.',
    },
    {
      priority: 'high',
      source: '/categories/home-projects/',
      target: '/tools/wallpaper-calculator/',
      why: 'Category hubs are stronger discovery paths than only the giant tools list.',
    },
    {
      priority: 'medium',
      source: '/tools/',
      target: '/tools/wallpaper-calculator/',
      why: 'The full tools hub should expose priority home-project tools directly.',
    },
  ];
  const checkedLinks = [];
  const suggestions = [];

  for (const item of linkChecks) {
    const present = await sourceContainsLink(origin, item.source, item.target);
    checkedLinks.push({ ...item, present });
    if (present === false) suggestions.push(item);
    if (present === null) warnings.push(`not enough data: could not verify ${item.source} links to ${item.target}.`);
  }

  const status = reportStatus([], warnings);
  const report = {
    checkedLinks,
    generatedAt,
    kind: 'link-helper',
    notes,
    sources: {
      analytics:
        savedAnalytics ??
        (liveAnalytics
          ? {
              generatedAt: liveAnalytics.generatedAt,
              topPages: liveAnalytics.topPages.slice(0, 10),
              topTools: liveAnalytics.topTools.slice(0, 10),
            }
          : null),
      searchConsole: inspection ? 'present' : 'not bundled into production admin',
    },
    status,
    suggestions,
    summary: { checkedLinks: checkedLinks.length, suggestions: suggestions.length, warnings: warnings.length },
    warnings,
  };
  const paths = writeReport(
    'link-helper',
    report,
    `# Internal Link Helper

Generated: ${generatedAt}

Status: ${status}

## Suggestions

${markdownList(suggestions.map((item) => `${item.priority}: ${item.source} -> ${item.target} - ${item.why}`))}

## Checked Links

${markdownList(
  checkedLinks.map((item) => {
    const state = item.present === true ? 'present' : item.present === false ? 'missing' : 'not enough data';
    return `${state}: ${item.source} -> ${item.target}`;
  }),
)}

## Warnings

${markdownList(warnings)}

## Notes

${markdownList(notes)}
`,
  );

  return { ...report, paths };
}

export function refreshSeoConsoleReport() {
  const generatedAt = new Date().toISOString();
  const warnings: string[] = [];
  const notes: string[] = [];
  const inspection = readJsonFile(rootPath('output', 'search-console-url-inspection.json'));
  const crawlScout = readJsonFile(rootPath('output', 'crawlscout', 'latest.json'));
  if (!inspection) {
    notes.push('not enough data: fresh Search Console URL inspection output is a local OAuth report, not a production browser-admin file.');
  }
  if (!crawlScout) {
    notes.push('not enough data: CrawlScout export is a local Codex evidence file, not a production browser-admin file.');
  }

  const actions = [
    {
      priority: 'high',
      task: 'Strengthen contextual links to Wallpaper Calculator from home-project guides and category hubs.',
      target: '/tools/wallpaper-calculator/',
    },
    {
      priority: 'high',
      task: 'Keep Watts to Amps linked from electrical, unit-conversion, and Ask/API pages until it indexes.',
      target: '/tools/watts-to-amps-calculator/',
    },
    {
      priority: 'medium',
      task: 'Refresh Search Console key URL inspection when OAuth is available, then submit discovery only for pages still not indexed.',
      target: '/tools/',
    },
  ];
  const status = reportStatus([], warnings);
  const report = {
    actions,
    generatedAt,
    kind: 'seo-console',
    notes,
    status,
    summary: { actions: actions.length, warnings: warnings.length },
    warnings,
  };
  const paths = writeReport(
    'seo-console',
    report,
    `# Agent SEO Fix Console

Generated: ${generatedAt}

Status: ${status}

## Next Actions

${markdownList(actions.map((item) => `${item.priority}: ${item.target} - ${item.task}`))}

## Warnings

${markdownList(warnings)}

## Notes

${markdownList(notes)}
`,
  );

  return { ...report, paths };
}

export async function refreshContentQualityReport(origin = SITE_ORIGIN) {
  const generatedAt = new Date().toISOString();
  const candidates = [
    rootPath('output', 'promotion', 'medium', 'right-free-online-calculator.md'),
    rootPath('docs', 'brand-code.md'),
  ];
  const file = candidates.find((candidate) => existsSync(candidate)) ?? '';
  let text = file ? readTextFile(file) : '';
  let source = file ? unixPath(relative(process.cwd(), file)) : '';
  let hasContextualToolLink = /(accessfreetools\.com\/tools\/|\/tools\/)/i.test(text);
  const notes: string[] = [];
  if (!text) {
    try {
      const response = await fetch(`${origin.replace(/\/$/, '')}/why-access-free-tools/`, {
        headers: { accept: 'text/html' },
      });
      if (response.ok) {
        source = '/why-access-free-tools/';
        const html = await response.text();
        hasContextualToolLink =
          /(href=["']\/tools\/|href=["']https:\/\/accessfreetools\.com\/tools\/|accessfreetools\.com\/tools\/)/i.test(
            html,
          );
        text = stripHtml(html);
        notes.push('No local draft file was bundled with production, so this private browser report checked the live mission page instead.');
      }
    } catch {
      // The warning below handles missing fallback content.
    }
  }
  const issues: string[] = [];
  const warnings: string[] = [];

  if (!text) {
    warnings.push('not enough data: no local draft file or live fallback page was available for content scoring.');
  } else {
    if (!hasContextualToolLink) issues.push('Missing contextual Access Free Tools tool link.');
    if (/this (medium post|post|article) should|agent should|quality gate/i.test(text)) {
      issues.push('Agent-facing instructions appear in reader-facing content.');
    }
    if (!/\d+/.test(text)) issues.push('No concrete numbered example found.');
    if (/ultimate guide|unlock the power|seamlessly|game changer|delve/i.test(text)) {
      issues.push('Generic filler phrase found.');
    }
  }

  const wordCount = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const status = reportStatus(issues, warnings);
  const report = {
    file: source,
    generatedAt,
    issues,
    kind: 'content-quality',
    notes,
    status,
    summary: { issues: issues.length, warnings: warnings.length, wordCount },
    warnings,
    wordCount,
  };
  const paths = writeReport(
    'content-quality',
    report,
    `# Content Quality Checker

Generated: ${generatedAt}

Status: ${status}

- File: ${report.file || 'not enough data'}
- Words: ${wordCount}

## Issues

${markdownList(issues)}

## Warnings

${markdownList(warnings)}

## Notes

${markdownList(notes)}
`,
  );

  return { ...report, paths };
}

export async function refreshAgentToolReports(options: { kind?: AgentToolKind | 'all'; origin?: string } = {}) {
  const kinds = options.kind && options.kind !== 'all' ? [options.kind] : [...AGENT_TOOL_KINDS];
  const refreshed = [];

  for (const kind of kinds) {
    try {
      if (kind === 'ask-audit') refreshed.push(await refreshAskAuditReport());
      if (kind === 'api-ready') refreshed.push(refreshApiReadyReport());
      if (kind === 'mcp-smoke') refreshed.push(await refreshMcpSmokeReport(options.origin || SITE_ORIGIN));
      if (kind === 'link-helper') refreshed.push(await refreshLinkHelperReport(options.origin || SITE_ORIGIN));
      if (kind === 'seo-console') refreshed.push(refreshSeoConsoleReport());
      if (kind === 'content-quality') refreshed.push(await refreshContentQualityReport(options.origin || SITE_ORIGIN));
    } catch (error) {
      const generatedAt = new Date().toISOString();
      const message = error instanceof Error ? error.message : String(error);
      const report = {
        generatedAt,
        issues: [message],
        kind,
        status: 'fail',
        summary: { issues: 1 },
      };
      const paths = writeReport(
        kind,
        report,
        `# ${kind}

Generated: ${generatedAt}

Status: fail

## Issues

- ${message}
`,
      );
      refreshed.push({ ...report, paths });
    }
  }

  return refreshed;
}
