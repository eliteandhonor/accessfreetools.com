#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { Command } from 'commander';
import { dataForSeoRequest } from './lib/dataforseo.mjs';
import { buildSeoPageScoreReport, buildSeoToolQueueReport } from './lib/seo-tool-review.mjs';

const root = process.cwd();
const npmCommand = process.platform === 'win32' ? (process.env.ComSpec || 'cmd.exe') : 'npm';
const workspaceDir = join(root, 'agents', 'serpforge-ai');
const briefsDir = join(workspaceDir, 'briefs');
const evidenceDir = join(workspaceDir, 'evidence');
const reportsDir = join(workspaceDir, 'reports');
const tasksDir = join(workspaceDir, 'tasks');
const auditDownloadPath = join(process.env.USERPROFILE ?? 'C:\\Users\\chamb', 'Downloads', 'accessfreetools-seo-audit-report.md');
const auditEvidencePath = join(evidenceDir, 'accessfreetools-seo-audit-report-2026-05-24.md');
const deepAuditDownloadPdfPath = join(process.env.USERPROFILE ?? 'C:\\Users\\chamb', 'Downloads', 'SEO_Audit_Report_accessfreetools.pdf');
const deepAuditPdfEvidencePath = join(evidenceDir, 'SEO_Audit_Report_accessfreetools-2026-05-25.pdf');
const deepAuditTextEvidencePath = join(evidenceDir, 'SEO_Audit_Report_accessfreetools-2026-05-25.txt');
const deepAuditMarkdownEvidencePath = join(evidenceDir, 'SEO_Audit_Report_accessfreetools-2026-05-25.md');
const deepAuditTaskBoardPath = join(tasksDir, 'deep-audit-agent-board.md');
const sitemapUrls = [
  'https://accessfreetools.com/sitemap.xml',
  'https://accessfreetools.com/sitemap-pages.xml',
  'https://accessfreetools.com/sitemap-tools.xml',
  'https://accessfreetools.com/sitemap-blog.xml',
  'https://accessfreetools.com/sitemap-categories.xml',
  'https://accessfreetools.com/sitemap-gallery.xml',
  'https://accessfreetools.com/sitemap-images.xml',
  'https://accessfreetools.com/feed.xml',
];

const deepAuditStatusLabels = new Set(['confirmed', 'already-fixed', 'needs-proof', 'rejected-stale']);

const deepAuditAgents = [
  {
    name: 'Main Deep Audit Coordinator',
    file: 'main-audit-coordinator.md',
    lane: 'orchestration',
    mission: 'Import the PDF, dedupe findings against local SERPForge evidence, assign sub-agent work, and produce the sprint board.',
    proof: ['deep-audit-import', 'deep-audit-agents', 'deep-audit-sprint'],
  },
  {
    name: 'Technical Headers Agent',
    file: 'technical-headers-agent.md',
    lane: 'technical',
    mission: 'Verify and plan HSTS, cache headers, CDN caching, preloads, trailing-slash redirects, 404 UX, and production header proof.',
    proof: ['technical-header-plan', 'npm run check', 'npm run check:production-sitemap'],
  },
  {
    name: 'Crawl And Indexation Agent',
    file: 'crawl-indexation-agent.md',
    lane: 'crawl-indexation',
    mission: 'Use robots, sitemaps, Search Console, URL Inspection, canonical checks, and DataForSEO OnPage evidence to separate real blockers from stale crawler noise.',
    proof: ['crawl-plan', 'npm run aft -- seo-console', 'npm run search-console:inspect-key-urls'],
  },
  {
    name: 'Metadata And Heading Agent',
    file: 'metadata-heading-agent.md',
    lane: 'on-page',
    mission: 'Plan title, description, H1/H2/H3, blog listing heading, and CTR rewrites in smart 14-year-old voice.',
    proof: ['heading-metadata-plan', 'sitewide-seo-audit', 'all-pages-human-tone-report'],
  },
  {
    name: 'Content Depth Agent',
    file: 'content-depth-agent.md',
    lane: 'content-depth',
    mission: 'Expand weak hubs, About, Password Generator, and GSC/DataForSEO pages with useful examples, limits, and practical next steps.',
    proof: ['content-depth-plan', 'npm run aft -- semantic-depth', 'npm run aft -- hub-strength'],
  },
  {
    name: 'E-E-A-T Trust Agent',
    file: 'eeat-trust-agent.md',
    lane: 'trust',
    mission: 'Plan bylines, review notes, disclaimers, source citations, Person/Organization schema, and risk-specific trust blocks.',
    proof: ['eeat-author-plan', 'eeat-plan', 'npm run check:structured-data'],
  },
  {
    name: 'Image And Listing UX Agent',
    file: 'image-listing-ux-agent.md',
    lane: 'images-ux',
    mission: 'Check homepage, tool, blog, category, gallery, and listing visual coverage; keep images specific, lightweight, and correctly loaded.',
    proof: ['image-alt-audit', 'image-alt-plan', 'image-sitemap-plan', 'gallery-seo-plan'],
  },
  {
    name: 'Internal Link And Anchor Agent',
    file: 'internal-link-anchor-agent.md',
    lane: 'internal-links',
    mission: 'Add contextual in-body links, vary repeated anchors, connect tool-guide-hub paths, and avoid link stuffing.',
    proof: ['npm run aft -- link-helper', 'npm run aft -- hub-strength'],
  },
  {
    name: 'Authority And Outreach Agent',
    file: 'authority-outreach-agent.md',
    lane: 'authority',
    mission: 'Prepare directory, Product Hunt, AlternativeTo, education/resource, roundup, and broken-link outreach targets as drafts only.',
    proof: ['authority-plan', 'npm run marketing:orchestrate', 'npm run aft -- recognition'],
  },
  {
    name: 'Social Discovery Agent',
    file: 'social-discovery-agent.md',
    lane: 'promotion',
    mission: 'Plan Pinterest, Reddit, Bluesky/X, Quora, Medium, and DEV discovery work through existing promotion quality gates.',
    proof: ['social-discovery-plan', 'npm run marketing:orchestrate', 'npm run aft -- proof-check'],
  },
  {
    name: 'DataForSEO Market Agent',
    file: 'dataforseo-market-intelligence-agent.md',
    lane: 'dataforseo-gsc',
    mission: 'Run account/status gates, targeted Labs, live SERP, and OnPage checks; do not use the Backlinks API.',
    proof: ['dataforseo-plan', 'dataforseo-sitewide-audit', 'all-pages-dataforseo'],
  },
  {
    name: 'Audit Sprint Judge',
    file: 'audit-sprint-judge.md',
    lane: 'final-judge',
    mission: 'Block done claims unless local checks, DataForSEO proof, GSC proof, build checks, and human-tone checks all pass.',
    proof: ['deep-audit-sprint', 'audit-sprint', 'all-pages-human-tone-report'],
  },
];

const deepAuditFindings = [
  {
    id: 'hsts-missing',
    priority: 'P0',
    lane: 'technical',
    owner: 'Technical Headers Agent',
    status: 'confirmed',
    finding: 'The audit reports missing HSTS. Live header probes should keep this confirmed until Strict-Transport-Security is present on production HTTPS responses.',
    task: 'Add or configure production HSTS after checking Hostinger/CDN ownership, then verify the live header.',
    proof: 'technical-header-plan plus live HEAD response.',
  },
  {
    id: 'cache-max-age-zero',
    priority: 'P0',
    lane: 'technical',
    owner: 'Technical Headers Agent',
    status: 'confirmed',
    finding: 'The audit reports public cache headers with max-age=0/dynamic behavior on HTML routes.',
    task: 'Plan CDN/static cache rules for built assets and HTML without breaking tool freshness.',
    proof: 'technical-header-plan and production header sample.',
  },
  {
    id: 'trailing-slash-no-redirect',
    priority: 'P0',
    lane: 'technical',
    owner: 'Technical Headers Agent',
    status: 'confirmed',
    finding: 'The audit reports non-canonical no-slash URLs returning 200 instead of 301 to trailing-slash canonicals.',
    task: 'Add or configure trailing-slash 301 behavior only after checking Astro, Hostinger, and sitemap canonicals.',
    proof: 'technical-header-plan and redirect probe for /tools.',
  },
  {
    id: 'sitemap-index-submitted',
    priority: 'P0',
    lane: 'crawl-indexation',
    owner: 'Crawl And Indexation Agent',
    status: 'already-fixed',
    finding: 'The PDF says eight sitemap/feed endpoints are successful.',
    task: 'Keep submitting and verifying the canonical sitemap set through the existing GSC flow.',
    proof: 'gsc-submit-sitemaps and check:production-sitemap.',
  },
  {
    id: 'gsc-url-examples',
    priority: 'P0',
    lane: 'crawl-indexation',
    owner: 'Crawl And Indexation Agent',
    status: 'needs-proof',
    finding: 'The audit names Google-side blockers and stale discovered/crawled-not-indexed examples, including wallpaper-calculator context.',
    task: 'Use Search Console exports and URL Inspection before assigning exact URL fixes.',
    proof: 'npm run search-console:inspect-key-urls and npm run aft -- seo-console.',
  },
  {
    id: 'short-titles',
    priority: 'P1',
    lane: 'on-page',
    owner: 'Metadata And Heading Agent',
    status: 'needs-proof',
    finding: 'The audit flags short titles for BMI, Password Generator, hubs, and other pages.',
    task: 'Use sitewide page rows to list exact short titles, then rewrite only page-specific snippets in smart 14-year-old voice.',
    proof: 'heading-metadata-plan and sitewide-seo-audit.',
  },
  {
    id: 'meta-description-length',
    priority: 'P1',
    lane: 'on-page',
    owner: 'Metadata And Heading Agent',
    status: 'needs-proof',
    finding: 'The audit reports mixed too-short and too-long meta descriptions.',
    task: 'Generate a URL-by-URL metadata repair queue from built HTML, not generic category advice.',
    proof: 'heading-metadata-plan and all-pages-human-tone-report.',
  },
  {
    id: 'blog-listing-h2-overload',
    priority: 'P1',
    lane: 'on-page',
    owner: 'Metadata And Heading Agent',
    status: 'needs-proof',
    finding: 'The audit flags blog listing H2 overload.',
    task: 'Verify heading counts in built HTML and plan a listing card heading hierarchy that is better for scanning.',
    proof: 'heading-metadata-plan.',
  },
  {
    id: 'tool-h3-depth',
    priority: 'P1',
    lane: 'on-page',
    owner: 'Metadata And Heading Agent',
    status: 'needs-proof',
    finding: 'The audit says tool pages use shallow H1/H2 depth and need H3 section detail where it helps readers.',
    task: 'Add H3s only when they help examples, mistakes, formulas, or result interpretation.',
    proof: 'page SEO workbench for each edited tool/blog page.',
  },
  {
    id: 'content-depth-hubs-about-password',
    priority: 'P1',
    lane: 'content-depth',
    owner: 'Content Depth Agent',
    status: 'needs-proof',
    finding: 'The audit calls out hubs, About, and Password Generator as weak or thin content priorities.',
    task: 'Use GSC/DataForSEO evidence to prioritize expansion, then write practical examples and honest limits.',
    proof: 'content-depth-plan, semantic-depth, hub-strength.',
  },
  {
    id: 'ymyl-trust-blocks',
    priority: 'P1',
    lane: 'trust',
    owner: 'E-E-A-T Trust Agent',
    status: 'needs-proof',
    finding: 'The audit calls for author/reviewer bylines, citations, and disclaimers on sensitive finance, health, tax, construction, electrical, pregnancy, BAC, AI, and password pages.',
    task: 'Plan reusable trust blocks and schema without overclaiming medical, legal, tax, or safety advice.',
    proof: 'eeat-author-plan and structured-data check.',
  },
  {
    id: 'listing-images',
    priority: 'P1',
    lane: 'images-ux',
    owner: 'Image And Listing UX Agent',
    status: 'needs-proof',
    finding: 'The audit says listing surfaces have weak or missing images.',
    task: 'Plan specific images for homepage, tools, blog, category, and gallery listings without exposing queued or failed-QA art.',
    proof: 'image-alt-audit, gallery:qa, images:sitemap-check.',
  },
  {
    id: 'image-dimensions',
    priority: 'P1',
    lane: 'images-ux',
    owner: 'Image And Listing UX Agent',
    status: 'already-fixed',
    finding: 'The audit says all images lack dimensions, but current tool/gallery image markup and QA include width/height handling for approved art.',
    task: 'Keep this under QA and only reopen if a built-page check finds missing dimensions.',
    proof: 'images:qa and images:sitemap-check.',
  },
  {
    id: 'alt-text-specificity',
    priority: 'P1',
    lane: 'images-ux',
    owner: 'Image And Listing UX Agent',
    status: 'needs-proof',
    finding: 'The audit and user feedback flag generic image alt text that does not match the actual tool image.',
    task: 'Audit approved tool art and rewrite alt/caption metadata around tool purpose, inputs, outputs, formulas, examples, and guide context.',
    proof: 'image-alt-audit and image-alt-plan.',
  },
  {
    id: 'anchor-repetition',
    priority: 'P2',
    lane: 'internal-links',
    owner: 'Internal Link And Anchor Agent',
    status: 'needs-proof',
    finding: 'The audit says internal links are strong but anchors repeat too much and need better contextual in-body placement.',
    task: 'Use the link helper before editing anchors so useful reader paths stay above raw SEO anchor variation.',
    proof: 'npm run aft -- link-helper.',
  },
  {
    id: 'homepage-external-links',
    priority: 'P2',
    lane: 'authority',
    owner: 'Authority And Outreach Agent',
    status: 'rejected-stale',
    finding: 'The audit suggests outbound homepage links as a low priority authority signal, but this is not automatically useful for a utility homepage.',
    task: 'Reject as a generic/stale recommendation unless a specific reader-useful citation or partner proof exists.',
    proof: 'authority-plan.',
  },
  {
    id: 'zero-social-presence',
    priority: 'P1',
    lane: 'promotion',
    owner: 'Social Discovery Agent',
    status: 'needs-proof',
    finding: 'The audit broadly says social/entity presence is absent, but local project notes show several accounts exist.',
    task: 'Verify current public profile URLs and queue only quality-gated drafts; do not post without approval.',
    proof: 'social-discovery-plan and npm run aft -- proof-check.',
  },
  {
    id: 'directory-outreach',
    priority: 'P1',
    lane: 'authority',
    owner: 'Authority And Outreach Agent',
    status: 'needs-proof',
    finding: 'The audit recommends directories, Product Hunt, AlternativeTo, resource pages, roundups, and broken-link outreach.',
    task: 'Prepare targets and drafts only; no submissions, messages, ads, or backlink claims without approval and public proof.',
    proof: 'authority-plan.',
  },
  {
    id: 'dataforseo-market-layer',
    priority: 'P0',
    lane: 'dataforseo-gsc',
    owner: 'DataForSEO Market Agent',
    status: 'confirmed',
    finding: 'User approved mandatory DataForSEO use for tools/blog pages and the audit plan requires account/status gates first.',
    task: 'Use Labs, live SERP, and OnPage only; tier depth and stop_crawl_on_match; never use Backlinks API.',
    proof: 'dataforseo-plan, all-pages-dataforseo, all-pages-serp-audit, dataforseo-sitewide-audit.',
  },
  {
    id: 'no-fake-done-claims',
    priority: 'P0',
    lane: 'final-judge',
    owner: 'Audit Sprint Judge',
    status: 'confirmed',
    finding: 'The sprint must not claim fixed, posted, submitted, indexed, ranked, or done without proof.',
    task: 'Block done until build, local SEO, DataForSEO, GSC/Search Console, and human-tone gates pass.',
    proof: 'deep-audit-sprint and all-pages-human-tone-report.',
  },
];

function ensureDirs() {
  mkdirSync(briefsDir, { recursive: true });
  mkdirSync(evidenceDir, { recursive: true });
  mkdirSync(reportsDir, { recursive: true });
  mkdirSync(tasksDir, { recursive: true });
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function rel(path) {
  return relative(root, path).replace(/\\/g, '/');
}

function run(command, args, label, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    shell: Boolean(options.shell),
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: options.timeoutMs,
  });

  return {
    label,
    command: [command, ...args].join(' '),
    status: result.status ?? 1,
    stdout: (result.stdout ?? '').trim(),
    stderr: [result.stderr ?? '', result.error ? result.error.message : ''].filter(Boolean).join('\n').trim(),
  };
}

function runAft(label, args) {
  const npmArgs =
    process.platform === 'win32'
      ? ['/d', '/s', '/c', 'npm.cmd', 'run', 'aft', '--', ...args, '--json']
      : ['run', 'aft', '--', ...args, '--json'];
  return run(npmCommand, npmArgs, label);
}

function runNpmScript(label, script, args = []) {
  const npmArgs =
    process.platform === 'win32'
      ? ['/d', '/s', '/c', 'npm.cmd', 'run', script, '--', ...args]
      : ['run', script, '--', ...args];
  return run(npmCommand, npmArgs, label);
}

function runSerpforge(label, args = [], timeoutMs = 240_000) {
  const npmArgs =
    process.platform === 'win32'
      ? ['/d', '/s', '/c', 'npm.cmd', 'run', 'serpforge', '--', ...args]
      : ['run', 'serpforge', '--', ...args];
  return run(npmCommand, npmArgs, label, { timeoutMs });
}

function runNpx(label, packageName, args = []) {
  const command = process.platform === 'win32' ? (process.env.ComSpec || 'cmd.exe') : 'npx';
  const npxArgs =
    process.platform === 'win32'
      ? ['/d', '/s', '/c', 'npx.cmd', '--yes', packageName, ...args]
      : ['--yes', packageName, ...args];
  return run(command, npxArgs, label);
}

function runWorkbench(label, args) {
  return run(process.execPath, ['scripts/seo-agent-workbench.mjs', ...args], label);
}

function parseJsonResult(result) {
  if (!result.stdout) return null;

  const jsonStart = result.stdout.indexOf('{');
  if (jsonStart < 0) return null;

  try {
    return JSON.parse(result.stdout.slice(jsonStart));
  } catch {
    return null;
  }
}

function writePair(baseDir, baseName, payload, markdown) {
  ensureDirs();
  const jsonPath = join(baseDir, `${baseName}.json`);
  const markdownPath = join(baseDir, `${baseName}.md`);
  writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  writeFileSync(markdownPath, `${markdown.trim()}\n`);
  return { jsonPath: rel(jsonPath), markdownPath: rel(markdownPath) };
}

function commandBlock(result) {
  const lines = [
    `### ${result.label}`,
    '',
    `- Command: \`${result.command}\``,
    `- Exit: ${result.status}`,
  ];

  if (result.stdout) {
    lines.push('', '```text', result.stdout.slice(0, 5000), '```');
  }

  if (result.stderr) {
    lines.push('', 'Stderr:', '', '```text', result.stderr.slice(0, 2000), '```');
  }

  return lines.join('\n');
}

function cleanPage(page) {
  const normalized = String(page || 'tool').toLowerCase();
  if (!['tool', 'blog'].includes(normalized)) {
    throw new Error('Page must be either "tool" or "blog".');
  }
  return normalized;
}

function collectOption(value, previous = []) {
  return [...previous, value];
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function readJsonFile(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function completedOnPageEvidenceDirs({ sitewideOnly = false, supplementalOnly = false } = {}) {
  if (!existsSync(reportsDir)) return null;

  return readdirSync(reportsDir, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      const isSitewide = entry.name.startsWith('dataforseo-sitewide-onpage-');
      const isOnPage = entry.name.startsWith('dataforseo-') && entry.name.includes('-onpage-');
      if (sitewideOnly) return isSitewide;
      if (supplementalOnly) return isOnPage && !isSitewide;
      return isOnPage;
    })
    .map((entry) => {
      const outputDir = join(reportsDir, entry.name);
      const summaryPath = join(outputDir, 'summary.json');
      const pagesPath = join(outputDir, 'pages.raw.json');
      const summary = readJsonFile(summaryPath);
      return {
        outputDir,
        summaryPath,
        pagesPath,
        summary,
        mtimeMs: existsSync(summaryPath) ? statSync(summaryPath).mtimeMs : 0,
      };
    })
    .filter((entry) => entry.summary?.crawlProgress === 'finished' && existsSync(entry.pagesPath))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
}

function latestCompletedOnPageEvidence() {
  return completedOnPageEvidenceDirs({ sitewideOnly: true })?.[0] ?? null;
}

function supplementalCompletedOnPageEvidence() {
  return completedOnPageEvidenceDirs({ supplementalOnly: true }) ?? [];
}

function latestReportFile(prefix, extension = '.json') {
  if (!existsSync(reportsDir)) return null;

  return readdirSync(reportsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.startsWith(prefix) && entry.name.endsWith(extension))
    .map((entry) => {
      const filePath = join(reportsDir, entry.name);
      return {
        filePath,
        mtimeMs: statSync(filePath).mtimeMs,
      };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs)[0]?.filePath ?? null;
}

function normalizeEvidenceUrl(url = '') {
  const clean = String(url).split('#')[0].split('?')[0];
  if (clean === 'https://accessfreetools.com') return 'https://accessfreetools.com/';
  return clean.endsWith('/') ? clean : `${clean}/`;
}

function latestSitewideRows() {
  const latestPath = latestReportFile('serpforge-sitewide-seo-audit-');
  const report = latestPath ? readJsonFile(latestPath) : null;
  return {
    path: latestPath,
    rows: Array.isArray(report?.rows) ? report.rows : [],
    report,
  };
}

function latestAllPagesDataForSeoRows() {
  const latestPath = latestReportFile('serpforge-all-pages-dataforseo-');
  const report = latestPath ? readJsonFile(latestPath) : null;
  return {
    path: latestPath,
    rows: Array.isArray(report?.rows) ? report.rows : [],
    report,
  };
}

function latestAllPagesSerpRows() {
  const latestPath = latestReportFile('serpforge-all-pages-serp-audit-');
  const report = latestPath ? readJsonFile(latestPath) : null;
  return {
    path: latestPath,
    rows: Array.isArray(report?.rows) ? report.rows : [],
    report,
  };
}

function latestAllPagesToneRows() {
  const latestPath = latestReportFile('serpforge-all-pages-tone-audit-');
  const report = latestPath ? readJsonFile(latestPath) : null;
  return {
    path: latestPath,
    rows: Array.isArray(report?.rows) ? report.rows : [],
    report,
  };
}

function latestReviewQueueRows() {
  const latestPath = latestReportFile('serpforge-all-pages-review-queue-');
  const report = latestPath ? readJsonFile(latestPath) : null;
  return {
    path: latestPath,
    rows: Array.isArray(report?.rows) ? report.rows : [],
    report,
  };
}

function extractOnPageItems(raw) {
  const items = raw?.response?.tasks?.[0]?.result?.[0]?.items ?? [];
  return Array.isArray(items) ? items : [];
}

function onPageItemUrl(item) {
  return item?.url ?? item?.page_url ?? item?.resource_url ?? item?.meta?.canonical ?? '';
}

function latestOnPageItems(evidence = latestCompletedOnPageEvidence()) {
  const sourceEntries = [evidence, ...supplementalCompletedOnPageEvidence()].filter(Boolean);
  const byUrl = new Map();
  const paths = [];
  const supplementalPaths = [];

  for (const source of sourceEntries) {
    const pagesPath = source.pagesPath ?? join(source.outputDir, 'pages.raw.json');
    const raw = readJsonFile(pagesPath);
    const items = extractOnPageItems(raw);
    if (!items.length) continue;
    paths.push(pagesPath);
    if (source.outputDir !== evidence?.outputDir) supplementalPaths.push(pagesPath);

    for (const item of items) {
      const itemUrl = onPageItemUrl(item);
      if (!itemUrl) continue;
      byUrl.set(normalizeEvidenceUrl(itemUrl), item);
    }
  }

  const pagesPath = evidence?.pagesPath ?? (evidence ? join(evidence.outputDir, 'pages.raw.json') : null);
  return {
    path: pagesPath,
    paths,
    supplementalPaths,
    items: [...byUrl.values()],
  };
}

function chunks(items, size) {
  const output = [];
  for (let index = 0; index < items.length; index += size) {
    output.push(items.slice(index, index + size));
  }
  return output;
}

function shortRecommendations(results) {
  const items = [];
  for (const result of results) {
    const json = parseJsonResult(result);
    if (!json) continue;

    if (Array.isArray(json.actions)) {
      for (const action of json.actions.slice(0, 3)) {
        items.push(`${action.priority ?? 'Priority'}: ${action.task ?? action.nextAction ?? JSON.stringify(action)}`);
      }
    }

    if (Array.isArray(json.suggestions)) {
      for (const suggestion of json.suggestions.slice(0, 3)) {
        items.push(`${suggestion.priority ?? 'Priority'}: link ${suggestion.source ?? 'source'} to ${suggestion.target ?? 'target'} (${suggestion.reason ?? 'internal-link opportunity'})`);
      }
    }

    if (Array.isArray(json.entries)) {
      for (const entry of json.entries.slice(0, 3)) {
        items.push(`Review ${entry.slug} ${entry.page}: ${entry.priorityReasons?.join('; ') || `score ${entry.priorityScore}`}`);
      }
    }

    if (Array.isArray(json.missingProof)) {
      for (const row of json.missingProof.slice(0, 3)) {
        items.push(`Proof needed: ${row.page ?? 'promotion row'} via ${row.channel ?? 'unknown channel'}`);
      }
    }
  }

  return [...new Set(items)].slice(0, 8);
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

function writeMarkdownFile(filePath, markdown) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${markdown.trim()}\n`);
  return rel(filePath);
}

function assertDeepAuditStatuses(rows = deepAuditFindings) {
  for (const row of rows) {
    if (!deepAuditStatusLabels.has(row.status)) {
      throw new Error(`Invalid deep audit status "${row.status}" for ${row.id}.`);
    }
  }
}

function deepAuditRowsFor(filter = {}) {
  assertDeepAuditStatuses();
  return deepAuditFindings.filter((row) => {
    if (filter.owner && row.owner !== filter.owner) return false;
    if (filter.lane && row.lane !== filter.lane) return false;
    if (filter.priority && row.priority !== filter.priority) return false;
    return true;
  });
}

function deepAuditCounts(rows = deepAuditFindings) {
  return rows.reduce(
    (summary, row) => {
      summary.total += 1;
      summary.byStatus[row.status] = (summary.byStatus[row.status] ?? 0) + 1;
      summary.byPriority[row.priority] = (summary.byPriority[row.priority] ?? 0) + 1;
      summary.byLane[row.lane] = (summary.byLane[row.lane] ?? 0) + 1;
      return summary;
    },
    { total: 0, byStatus: {}, byPriority: {}, byLane: {} },
  );
}

function deepAuditFindingTable(rows = deepAuditFindings) {
  return rows
    .map((row) => `| ${row.priority} | ${row.status} | ${row.owner} | ${row.id} | ${row.task} | ${row.proof} |`)
    .join('\n');
}

function deepAuditFallbackText() {
  const lines = [
    'COMPREHENSIVE SEO AUDIT accessfreetools.com',
    'Date: May 25, 2026',
    'Source: SEO_Audit_Report_accessfreetools.pdf',
    '',
    'Extracted workstreams:',
    '- Technical headers: HSTS, cache headers, CDN edge caching, preloads, trailing slash redirects, 404 UX.',
    '- Crawl/indexation: robots.txt, sitemap health, GSC coverage examples, URL Inspection, crawled/discovered not indexed.',
    '- Metadata/headings: short titles, meta description length, blog listing H2 overload, tool page H3 depth.',
    '- Content depth: hubs, About, Password Generator, and pages with impressions but weak clicks.',
    '- E-E-A-T: author/reviewer bylines, disclaimers, citations, Person/Organization schema, YMYL review proof.',
    '- Images/listing UX: homepage, tools, blog, category, gallery images, alt text, width/height, lazy/eager loading.',
    '- Internal links: contextual links, varied anchors, tool-guide-hub paths.',
    '- Authority/outreach: directories, Product Hunt, AlternativeTo, roundups, education/resource pages, broken-link outreach.',
    '- Social discovery: Pinterest, Reddit, Bluesky/X, Quora, Medium, DEV through existing quality gates.',
    '- DataForSEO/GSC: account/status gates, targeted Labs, live SERP, OnPage; no Backlinks API.',
    '',
    'Finding ledger:',
    ...deepAuditFindings.map((row) => `- [${row.status}] ${row.id}: ${row.finding} Task: ${row.task}`),
  ];
  return `${lines.join('\n')}\n`;
}

function deepAuditPythonCandidates() {
  const candidates = [];
  if (process.env.SERPFORGE_PYTHON) candidates.push(process.env.SERPFORGE_PYTHON);
  if (process.env.PYTHON) candidates.push(process.env.PYTHON);
  candidates.push(join(process.env.USERPROFILE ?? 'C:\\Users\\chamb', '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'python', 'python.exe'));
  candidates.push('python');
  return [...new Set(candidates)].filter((candidate) => {
    if (/[/\\]/.test(candidate)) return existsSync(candidate);
    return true;
  });
}

function extractDeepAuditPdfText(pdfPath) {
  const script = [
    'import sys',
    'from pathlib import Path',
    'pdf_path = Path(sys.argv[1])',
    'try:',
    '    import pdfplumber',
    'except Exception as exc:',
    '    print(f"pdfplumber unavailable: {exc}", file=sys.stderr)',
    '    sys.exit(2)',
    'with pdfplumber.open(str(pdf_path)) as pdf:',
    '    for page_number, page in enumerate(pdf.pages, 1):',
    '        text = page.extract_text() or ""',
    '        print(f"--- PAGE {page_number} ---")',
    '        print(text)',
  ].join('\n');

  const attempts = [];
  for (const candidate of deepAuditPythonCandidates()) {
    const result = run(candidate, ['-c', script, pdfPath], 'PDF text extraction', { timeoutMs: 120_000 });
    attempts.push(result);
    if (result.status === 0 && result.stdout.length > 500) {
      return { text: `${result.stdout.trim()}\n`, attempts, usedFallback: false };
    }
  }

  return { text: deepAuditFallbackText(), attempts, usedFallback: true };
}

function deepAuditEvidenceMarkdown(extractedText = '') {
  const counts = deepAuditCounts();
  return [
    '# SERPForge Deep Audit Evidence',
    '',
    `Source PDF: \`${rel(deepAuditPdfEvidencePath)}\``,
    `Extracted text: \`${rel(deepAuditTextEvidencePath)}\``,
    '',
    '## Status Ledger',
    '',
    `- Findings: ${counts.total}`,
    `- Confirmed: ${counts.byStatus.confirmed ?? 0}`,
    `- Already fixed: ${counts.byStatus['already-fixed'] ?? 0}`,
    `- Needs proof: ${counts.byStatus['needs-proof'] ?? 0}`,
    `- Rejected stale: ${counts.byStatus['rejected-stale'] ?? 0}`,
    '',
    '## Findings',
    '',
    '| priority | status | owner | id | task | proof |',
    '| --- | --- | --- | --- | --- | --- |',
    deepAuditFindingTable(),
    '',
    '## Extracted Text Preview',
    '',
    '```text',
    extractedText.slice(0, 12000).trim(),
    '```',
  ].join('\n');
}

function deepAuditBoardMarkdown() {
  const rowsByPriority = ['P0', 'P1', 'P2'].map((priority) => ({
    priority,
    rows: deepAuditRowsFor({ priority }),
  }));
  const extraTaskLanes = [
    {
      title: 'Live Proof Follow-Up Lane - 2026-05-25',
      source: 'agents/serpforge-ai/tasks/live-recommendation-agent-tasks-2026-05-25.md',
      rows: [
        ['confirmed', 'Crawl And Indexation Agent', 'wallpaper-tool-indexing-watch', 'Keep `/tools/wallpaper-calculator/` in the Search Console indexing watch lane until URL Inspection returns `PASS`.', '`npm run search-console:inspect-key-urls`.'],
        ['confirmed', 'Internal Link And Anchor Agent', 'wallpaper-contextual-link-cleanup', 'Fix the wallpaper tool workbench blocker by improving only useful contextual links and anchors.', '`node scripts/seo-agent-workbench.mjs all wallpaper-calculator tool`.'],
        ['confirmed', 'Technical Headers Agent', 'hostinger-html-cache-edge-proof', 'Investigate Hostinger/hcdn HTML cache behavior because live HTML still returns `Cache-Control: public, max-age=0`.', 'Fresh live HEAD response plus Hostinger-side proof before any done claim.'],
        ['confirmed', 'Content Depth Agent', 'dataforseo-low-content-rate-review', 'Review the 41 DataForSEO low-content-rate rows manually and avoid padding pages with no real reader gap.', 'Fresh DataForSEO report plus page workbench for edited URLs.'],
        ['confirmed', 'Metadata And Heading Agent', 'dataforseo-duplicate-content-groups', 'Review the 10 duplicate-content groups and differentiate only pages with real overlap.', 'DataForSEO duplicate-content rows plus page-specific workbench.'],
        ['needs-proof', 'GSC Sitemap Submission Agent', 'sitemap-pending-watch', 'Recheck `/sitemap.xml` and `/feed.xml` after Search Console processes the latest submission.', '`npm run search-console:submit-discovery`.'],
      ],
    },
    {
      title: 'GSC Performance Lane - 2026-05-26',
      source: 'agents/serpforge-ai/tasks/gsc-performance-agent-tasks-2026-05-26.md',
      rows: [
        ['confirmed', 'DataForSEO Market Agent + Search Intent And Keyword Agent', 'interest-rate-dataforseo-page-sprint', 'Make `/tools/interest-rate-calculator/` the first GSC-driven sprint because it has 915 impressions, 0 clicks, and a blocked workbench.', '`npm run serpforge -- paid-audit-sprint interest-rate-calculator tool`; `node scripts/seo-agent-workbench.mjs all interest-rate-calculator tool`.'],
        ['confirmed', 'FAQ And Schema Specialist', 'interest-rate-six-faqs', 'Add useful visible FAQs for Interest Rate Calculator; current source has 0 FAQs and page score is 81.', '`npm run aft -- seo-page-score interest-rate-calculator tool`.'],
        ['confirmed', 'Metadata And Heading Agent', 'interest-rate-source-seo-description', 'Add a source `seoDescription` for Interest Rate Calculator.', '`npm run aft -- seo-page-score interest-rate-calculator tool`.'],
        ['needs-proof', 'Metadata And Heading Agent + Content Depth Agent', 'near-page-one-ctr-sprint', 'Review near-page-one GSC pages before lower-rank bulk rewrites.', 'Page-specific workbench and DataForSEO proof for selected tool/blog pages.'],
        ['needs-proof', 'Crawl And Indexation Agent', 'gsc-coverage-url-sample-export', 'Import Search Console Coverage/Page Indexing URL examples before assigning exact 5xx or 404 fixes.', '`npm run search-console:import-coverage` after Coverage CSV export.'],
        ['watch', 'Crawl And Indexation Agent', 'legacy-url-search-console-watch', 'Keep old URL rows as redirect-watch items, not duplicate rebuilds.', 'Live 301 proof and Search Console inspection for replacement targets.'],
      ],
    },
  ].flatMap((lane) => [
    `## ${lane.title}`,
    '',
    `Source board: \`${lane.source}\``,
    '',
    '| status | owner | id | task | proof |',
    '| --- | --- | --- | --- | --- |',
    ...lane.rows.map(([status, owner, id, task, proof]) => `| ${status} | ${owner} | ${id} | ${task} | ${proof} |`),
    '',
  ]);

  return [
    '# SERPForge Deep Audit Agent Board',
    '',
    `Generated source: \`${rel(deepAuditMarkdownEvidencePath)}\``,
    '',
    '## Rules',
    '',
    '- SERPForge is the main coordinator for this audit sprint.',
    '- Sub-agents write reports to `agents/serpforge-ai/reports/` and stable tasks to `agents/serpforge-ai/tasks/`.',
    '- Allowed finding statuses are `confirmed`, `already-fixed`, `needs-proof`, and `rejected-stale`.',
    '- No agent can mark work approved, live, fixed, posted, submitted, indexed, ranked, or done without proof.',
    '- DataForSEO uses account/status gates first, then targeted Labs, live SERP, and OnPage only. Backlinks API is not used.',
    '- Public copy must use the Access Free Tools smart 14-year-old voice: clear, practical, specific, no AI/SEO/internal filler.',
    '',
    '## Agent Roster',
    '',
    '| agent | lane | file | proof commands |',
    '| --- | --- | --- | --- |',
    ...deepAuditAgents.map((agent) => `| ${agent.name} | ${agent.lane} | \`agents/serpforge-ai/agents/${agent.file}\` | ${agent.proof.map((item) => `\`${item}\``).join(', ')} |`),
    '',
    ...extraTaskLanes,
    ...rowsByPriority.flatMap(({ priority, rows }) => [
      `## ${priority} Lane`,
      '',
      '| status | owner | id | task | proof |',
      '| --- | --- | --- | --- | --- |',
      rows.length
        ? rows.map((row) => `| ${row.status} | ${row.owner} | ${row.id} | ${row.task} | ${row.proof} |`).join('\n')
        : '| needs-proof | Audit Sprint Judge | none | No rows queued. | deep-audit-sprint |',
      '',
    ]),
  ].join('\n');
}

function writeDeepAuditBoard() {
  return writeMarkdownFile(deepAuditTaskBoardPath, deepAuditBoardMarkdown());
}

function deepAuditPlanMarkdown(title, rows, extraSections = []) {
  const counts = deepAuditCounts(rows);
  return [
    `# ${title}`,
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Status Counts',
    '',
    `- Total: ${counts.total}`,
    `- Confirmed: ${counts.byStatus.confirmed ?? 0}`,
    `- Already fixed: ${counts.byStatus['already-fixed'] ?? 0}`,
    `- Needs proof: ${counts.byStatus['needs-proof'] ?? 0}`,
    `- Rejected stale: ${counts.byStatus['rejected-stale'] ?? 0}`,
    '',
    '## Findings',
    '',
    '| priority | status | owner | id | task | proof |',
    '| --- | --- | --- | --- | --- | --- |',
    deepAuditFindingTable(rows) || '| P0 | needs-proof | Audit Sprint Judge | none | No rows matched this plan. | deep-audit-sprint |',
    '',
    ...extraSections,
  ].join('\n');
}

function reportStatus(results) {
  return results.every((result) => result.status === 0) ? 'pass' : 'needs-attention';
}

function readTextIfExists(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function extractToolArtEntries() {
  const text = readTextIfExists(join(root, 'src', 'data', 'toolArtManifest.ts'));
  const match = text.match(/export const toolArtManifest = (\[[\s\S]*?\]) as const satisfies/);
  if (!match) return [];

  try {
    return JSON.parse(match[1]);
  } catch {
    return [];
  }
}

function titleFromSlug(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(' ');
}

function improvedAlt(entry) {
  const topic = titleFromSlug(entry.slug) || entry.toolName;
  if (entry.kind === 'guide') {
    return `Guide image for ${entry.toolName} showing the ${topic.toLowerCase()} workflow with example inputs and result notes.`;
  }

  return `Illustration for ${entry.toolName} showing the ${topic.toLowerCase()} inputs and the result the tool helps calculate.`;
}

function improvedCaption(entry) {
  if (entry.kind === 'guide') {
    return `${entry.toolName} guide artwork sits with the walkthrough, including inputs, examples, limits, and mistakes to check.`;
  }

  return `${entry.toolName} artwork matches the live tool workflow, the inputs users enter, and the result they came to check.`;
}

function toolArtAltIssues(entry) {
  const issues = [];
  const alt = String(entry.alt ?? '');
  const caption = String(entry.caption ?? '');
  const genericAltPatterns = [
    /^smoke-kawaii mascot (presenting|walking through)/i,
    /smoke-style kawaii mascot using visual cues/i,
    /smoke-style kawaii mascot explaining/i,
    /page props/i,
    /visual cues for/i,
    /guide notes/i,
  ];
  const genericCaptionPatterns = [
    /^A smoke-kawaii visual for the .+ tool page\.$/i,
    /^A companion smoke-kawaii visual for the .+ guide\.$/i,
    /plain-language examples, formula notes, limits, and mistakes readers should check/i,
  ];

  if (alt.length < 55) issues.push('alt-too-short');
  if (alt.length > 180) issues.push('alt-too-long');
  if (genericAltPatterns.some((pattern) => pattern.test(alt))) issues.push('generic-alt-boilerplate');
  if (!alt.toLowerCase().includes(String(entry.toolName ?? '').toLowerCase().split(' ')[0])) issues.push('alt-may-miss-tool-context');
  if (caption.length < 55) issues.push('caption-too-short');
  if (genericCaptionPatterns.some((pattern) => pattern.test(caption))) issues.push('generic-caption-boilerplate');

  return issues;
}

function stripHtml(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTagText(html = '', tag = 'title') {
  const match = String(html).match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? stripHtml(match[1]) : '';
}

function extractMetaContent(html = '', name = 'description') {
  const patternA = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
  const patternB = new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i');
  return (String(html).match(patternA)?.[1] ?? String(html).match(patternB)?.[1] ?? '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
}

function extractLinkHref(html = '', rel = 'canonical') {
  const patternA = new RegExp(`<link\\s+[^>]*rel=["'][^"']*${rel}[^"']*["'][^>]*href=["']([^"']*)["'][^>]*>`, 'i');
  const patternB = new RegExp(`<link\\s+[^>]*href=["']([^"']*)["'][^>]*rel=["'][^"']*${rel}[^"']*["'][^>]*>`, 'i');
  return String(html).match(patternA)?.[1] ?? String(html).match(patternB)?.[1] ?? '';
}

function extractHeadings(html = '', level = 1) {
  return [...String(html).matchAll(new RegExp(`<h${level}[^>]*>([\\s\\S]*?)<\\/h${level}>`, 'gi'))]
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);
}

function extractJsonLdTypes(html = '') {
  const types = [];
  for (const match of String(html).matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = stripHtml(match[1]);
    try {
      const parsed = JSON.parse(raw);
      const stack = Array.isArray(parsed) ? [...parsed] : [parsed];
      while (stack.length) {
        const item = stack.pop();
        if (!item || typeof item !== 'object') continue;
        const type = item['@type'];
        if (Array.isArray(type)) types.push(...type.map(String));
        if (typeof type === 'string') types.push(type);
        for (const value of Object.values(item)) {
          if (Array.isArray(value)) stack.push(...value);
          else if (value && typeof value === 'object') stack.push(value);
        }
      }
    } catch {
      if (/FAQPage/i.test(raw)) types.push('FAQPage');
      if (/BreadcrumbList/i.test(raw)) types.push('BreadcrumbList');
    }
  }
  return [...new Set(types)];
}

function wordCount(text = '') {
  return String(text).toLowerCase().match(/[a-z0-9]+(?:'[a-z0-9]+)?/g)?.length ?? 0;
}

function sitemapXmlFiles() {
  return [
    join(root, 'dist', 'sitemap.xml'),
    ...walk(join(root, 'dist'), (file) => /^sitemap.*\.xml$/i.test(file.split(/[\\/]/).at(-1) ?? '')),
    ...walk(join(root, 'dist', 'client'), (file) => /^sitemap.*\.xml$/i.test(file.split(/[\\/]/).at(-1) ?? '')),
  ].filter((file, index, list) => existsSync(file) && list.indexOf(file) === index);
}

function sitemapUrlsFromBuiltFiles() {
  const urls = new Set();
  for (const file of sitemapXmlFiles()) {
    const text = readTextIfExists(file);
    for (const match of text.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = match[1].trim();
      if (!/^https:\/\/accessfreetools\.com\//i.test(url)) continue;
      const pathname = new URL(url).pathname;
      if (/\.(xml|rss|atom|txt|json|png|jpe?g|webp|gif|svg|ico)$/i.test(pathname)) continue;
      if (pathname === '/feed.xml') continue;
      urls.add(url);
    }
  }
  return [...urls].sort();
}

function htmlCandidatesForUrl(url) {
  const pathname = new URL(url).pathname.replace(/^\/|\/$/g, '');
  if (!pathname) {
    return [join(root, 'dist', 'index.html'), join(root, 'dist', 'client', 'index.html')];
  }
  return [
    join(root, 'dist', pathname, 'index.html'),
    join(root, 'dist', 'client', pathname, 'index.html'),
    join(root, 'dist', `${pathname}.html`),
    join(root, 'dist', 'client', `${pathname}.html`),
  ];
}

function builtHtmlForUrl(url) {
  for (const candidate of htmlCandidatesForUrl(url)) {
    if (existsSync(candidate)) {
      return { path: rel(candidate), html: readTextIfExists(candidate), exists: true };
    }
  }
  return { path: '', html: '', exists: false };
}

function classifyUrl(url) {
  const pathname = new URL(url).pathname;
  const toolMatch = pathname.match(/^\/tools\/([^/]+)\/?$/);
  const blogMatch = pathname.match(/^\/blog\/how-to-use-([^/]+)\/?$/);
  const hubMatch = pathname.match(/^\/hubs\/([^/]+)\/?$/);
  if (toolMatch) return { type: 'tool', slug: toolMatch[1], page: 'tool' };
  if (blogMatch) return { type: 'blog', slug: blogMatch[1], page: 'blog' };
  if (pathname === '/hubs/') return { type: 'hub', slug: 'hubs', page: 'hub' };
  if (hubMatch) return { type: 'hub', slug: hubMatch[1], page: 'hub' };
  if (/^\/categories\//.test(pathname)) return { type: 'category', slug: pathname.split('/').filter(Boolean).at(-1) ?? '', page: '' };
  if (/^\/gallery\//.test(pathname)) return { type: 'gallery', slug: pathname.split('/').filter(Boolean).at(-1) ?? '', page: '' };
  return { type: pathname === '/' ? 'home' : 'site', slug: pathname.split('/').filter(Boolean).join('-') || 'home', page: '' };
}

function internalLinkCount(html = '') {
  return [...String(html).matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi)]
    .filter((match) => match[1].startsWith('/') || match[1].startsWith('https://accessfreetools.com/'))
    .length;
}

function imageAltStats(html = '') {
  const images = [...String(html).matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const missing = images.filter((tag) => !/\salt=["'][^"']+["']/i.test(tag)).length;
  const generic = images.filter((tag) => /\salt=["'](?:image|tool image|calculator image|mascot|illustration|kawaii mascot)["']/i.test(tag)).length;
  return { images: images.length, missing, generic };
}

function builtFaqCount(html = '') {
  const detailsFaqs = [...String(html).matchAll(/<details\b[\s\S]*?<summary[^>]*>([\s\S]*?\?[\s\S]*?)<\/summary>[\s\S]*?<\/details>/gi)].length;
  const headingFaqs = extractHeadings(html, 2).filter((heading) => /\?$/i.test(heading)).length + extractHeadings(html, 3).filter((heading) => /\?$/i.test(heading)).length;
  return detailsFaqs || headingFaqs;
}

function pageSeoIssues(url, built) {
  if (!built.exists) {
    return {
      title: '',
      description: '',
      canonical: '',
      h1: [],
      h2Count: 0,
      schemaTypes: [],
      internalLinks: 0,
      wordCount: 0,
      imageAlt: { images: 0, missing: 0, generic: 0 },
      issues: ['built HTML not found for sitemap URL'],
      warnings: [],
      score: 0,
    };
  }

  const html = built.html;
  const title = extractTagText(html, 'title');
  const description = extractMetaContent(html, 'description');
  const canonical = extractLinkHref(html, 'canonical');
  const h1 = extractHeadings(html, 1);
  const h2 = extractHeadings(html, 2);
  const schemaTypes = extractJsonLdTypes(html);
  const plain = stripHtml(html);
  const imageAlt = imageAltStats(html);
  const faqCount = builtFaqCount(html);
  const robots = extractMetaContent(html, 'robots');
  const issues = [];
  const warnings = [];

  if (!title) issues.push('missing title');
  else if (title.length < 25) warnings.push('title may be too short');
  else if (title.length > 70) warnings.push('title may be too long');

  if (!description) issues.push('missing meta description');
  else if (description.length < 70) warnings.push('meta description may be too short');
  else if (description.length > 170) warnings.push('meta description may be too long');

  if (h1.length !== 1) issues.push(`expected exactly one H1, found ${h1.length}`);
  if (!canonical) issues.push('missing canonical link');
  else if (canonical.replace(/\/$/, '') !== url.replace(/\/$/, '')) warnings.push('canonical does not match sitemap URL exactly');

  if (/noindex/i.test(robots)) issues.push('sitemap URL has noindex robots meta');
  if (wordCount(plain) < 180) warnings.push('visible text may be thin');
  if (internalLinkCount(html) < 5) warnings.push('low internal-link count');
  if (imageAlt.missing) issues.push(`${imageAlt.missing} image(s) missing alt text`);
  if (imageAlt.generic) warnings.push(`${imageAlt.generic} image alt value(s) look generic`);
  if (!schemaTypes.length) warnings.push('no JSON-LD schema types detected');

  const score = Math.max(0, 100 - issues.length * 18 - warnings.length * 6);
  return {
    title,
    description,
    canonical,
    h1,
    h2Count: h2.length,
    schemaTypes,
    faqCount,
    internalLinks: internalLinkCount(html),
    wordCount: wordCount(plain),
    imageAlt,
    issues,
    warnings,
    score,
  };
}

const GENERIC_CONTENT_PATTERNS = [
  { label: 'leverage jargon', pattern: /\bleverage\b/i },
  { label: 'robust jargon', pattern: /\brobust\b/i },
  { label: 'seamless jargon', pattern: /\bseamless(?:ly)?\b/i },
  { label: 'powerful-tool boilerplate', pattern: /\bpowerful (?:online )?tool\b/i },
  { label: 'quick-and-easy boilerplate', pattern: /\bquick and easy\b/i },
  { label: 'easy-to-use boilerplate', pattern: /\beasy to use\b/i },
  { label: 'designed-to-help boilerplate', pattern: /\bdesigned to help you\b/i },
  { label: 'all-in-one boilerplate', pattern: /\ball[- ]in[- ]one\b/i },
  { label: 'generic-converter wording', pattern: /\bgeneric converter\b/i },
  { label: 'template duplicate wording', pattern: /\b(\w+)\s+\1\b/i },
];

const HUMAN_TONE_BLOCKER_PATTERNS = [
  { label: 'agent-facing copy', pattern: /\b(?:SERPForge|sub-agent|DataForSEO|Search Console|Google Search Console|agent should|task board|sprint judge)\b/i },
  { label: 'search-engine-first wording', pattern: /\b(?:search engines understand|built for search engines|for search engines|SEO signals?|ranking opportunity|topical authority|indexation)\b/i },
  { label: 'AI disclosure leak', pattern: /\b(?:as an AI|AI-generated|generated by AI|large language model)\b/i },
  { label: 'generic utility-site filler', pattern: /\b(?:strongest utility sites|growing with a different promise|every useful tool should be easy to understand)\b/i },
  { label: 'internal process copy', pattern: /\b(?:crawl budget|sitewide audit|SERP gap|content gap|keyword stuffing|black hat)\b/i },
];

const HUMAN_TONE_WARNING_PATTERNS = [
  { label: 'hype word', pattern: /\b(?:ultimate|revolutionary|cutting-edge|game-changing|world-class|best-in-class)\b/i },
  { label: 'marketing filler', pattern: /\b(?:unlock|elevate|empower|streamline|supercharge|maximize your potential)\b/i },
  { label: 'stiff wording', pattern: /\b(?:utilize|individuals|facilitate|commence|endeavor|thereby)\b/i },
  { label: 'generic intro', pattern: /\bin today'?s (?:fast-paced|digital) world\b/i },
  { label: 'soft boilerplate', pattern: /\b(?:easy to use|quick and easy|designed to help you|comprehensive guide|powerful online tool)\b/i },
];

const LOW_VALUE_KEYWORD_TERMS = new Set([
  'a',
  'and',
  'access',
  'calculator',
  'calculators',
  'converter',
  'converters',
  'free',
  'for',
  'guide',
  'how',
  'online',
  'the',
  'to',
  'tool',
  'tools',
  'use',
  'with',
]);

function keywordTerms(keyword = '') {
  return [
    ...new Set(
      String(keyword)
        .toLowerCase()
        .match(/[a-z0-9]+/g)
        ?.filter((term) => term.length > 2 && !LOW_VALUE_KEYWORD_TERMS.has(term)) ?? [],
    ),
  ];
}

function termsCovered(text = '', terms = []) {
  const haystack = String(text).toLowerCase();
  return terms.filter((term) => haystack.includes(term));
}

function genericContentAudit(target, built) {
  if (!built.exists) {
    return {
      status: 'fail',
      issues: ['built HTML not found for generic-content review'],
      warnings: [],
      matchedGenericPhrases: [],
      requiredTerms: keywordTerms(target.keyword),
      coveredTerms: [],
    };
  }

  const html = built.html;
  const title = extractTagText(html, 'title');
  const description = extractMetaContent(html, 'description');
  const h1 = extractHeadings(html, 1).join(' ');
  const plain = stripHtml(html);
  const aboveFoldSignals = [title, description, h1].join(' ');
  const terms = keywordTerms(target.keyword);
  const coveredInSignals = termsCovered(aboveFoldSignals, terms);
  const coveredInBody = termsCovered(plain, terms);
  const matchedGenericPhrases = [];
  const issues = [];
  const warnings = [];

  for (const { label, pattern } of GENERIC_CONTENT_PATTERNS) {
    if (pattern.test(aboveFoldSignals)) {
      matchedGenericPhrases.push(label);
    }
  }

  if (matchedGenericPhrases.length) {
    issues.push(`generic above-fold wording: ${matchedGenericPhrases.join(', ')}`);
  }

  if (['tool', 'blog', 'category', 'hub', 'gallery'].includes(target.type) || ['tool', 'blog'].includes(target.page)) {
    const requiredSignalTerms = Math.min(2, terms.length);
    if (requiredSignalTerms > 0 && coveredInSignals.length < requiredSignalTerms) {
      issues.push(`weak page-specific title/meta/H1 coverage for keyword terms: ${terms.join(', ')}`);
    }
  }

  if (terms.length >= 2 && coveredInBody.length < Math.min(2, terms.length)) {
    warnings.push(`visible body copy may be weak for keyword terms: ${terms.join(', ')}`);
  }

  return {
    status: issues.length ? 'fail' : warnings.length ? 'attention' : 'pass',
    issues,
    warnings,
    matchedGenericPhrases,
    requiredTerms: terms,
    coveredTerms: [...new Set([...coveredInSignals, ...coveredInBody])],
  };
}

function textSample(text = '', pattern) {
  const match = String(text).match(pattern);
  if (!match || typeof match.index !== 'number') return '';
  const start = Math.max(0, match.index - 70);
  const end = Math.min(String(text).length, match.index + match[0].length + 90);
  return String(text)
    .slice(start, end)
    .replace(/\s+/g, ' ')
    .trim();
}

function tonePatternFindings(text = '', patterns = []) {
  return patterns
    .filter((item) => item.pattern.test(text))
    .map((item) => ({
      label: item.label,
      sample: textSample(text, item.pattern),
    }));
}

function smart14ToneAudit(target, built) {
  if (!built.exists) {
    return {
      status: 'fail',
      blockers: ['built HTML not found for human-tone review'],
      warnings: [],
      blockerFindings: [],
      warningFindings: [],
      title: '',
      description: '',
      h1: [],
      wordCount: 0,
    };
  }

  const html = built.html;
  const title = extractTagText(html, 'title');
  const description = extractMetaContent(html, 'description');
  const h1 = extractHeadings(html, 1);
  const plain = stripHtml(html);
  const publicText = [title, description, h1.join(' '), plain].filter(Boolean).join(' ');
  const blockerFindings = tonePatternFindings(publicText, HUMAN_TONE_BLOCKER_PATTERNS);
  const warningFindings = tonePatternFindings(publicText, HUMAN_TONE_WARNING_PATTERNS);
  const blockers = blockerFindings.map((item) => item.label);
  const warnings = warningFindings.map((item) => item.label);
  const titleWords = wordCount(title);
  const descriptionWords = wordCount(description);

  if (titleWords > 16) warnings.push('title may be too wordy for fast scanning');
  if (descriptionWords > 34) warnings.push('meta description may be too wordy for fast scanning');

  return {
    status: blockers.length ? 'fail' : 'pass',
    blockers: [...new Set(blockers)],
    warnings: [...new Set(warnings)],
    blockerFindings,
    warningFindings,
    title,
    description,
    h1,
    wordCount: wordCount(plain),
    voiceRule: 'smart 14-year-old clarity: short, practical, specific, no agent/SEO/internal filler',
  };
}

function publicPageTargets() {
  return dataForSeoSitewideTargets().map((target) => {
    const built = builtHtmlForUrl(target.url);
    const local = built.exists ? pageSeoIssues(target.url, built) : null;
    return {
      ...target,
      builtHtml: built.path,
      builtExists: built.exists,
      title: local?.title ?? '',
      h1: local?.h1 ?? [],
      localSeoScore: local?.score ?? 0,
    };
  });
}

function subAgentsForTarget(target) {
  const agents = ['Smart 14 Voice Editor Agent', 'Audit Sprint Judge'];
  if (target.page === 'tool') {
    agents.unshift('Template Differentiation Agent', 'DataForSEO Market Intelligence Agent', 'Image Alt SEO Agent');
  } else if (target.page === 'blog') {
    agents.unshift('DataForSEO Market Intelligence Agent', 'Anchor Text Agent');
  } else if (target.type === 'home') {
    agents.unshift('Template QA Agent', 'EEAT Trust Agent');
  } else if (target.type === 'category') {
    agents.unshift('Category Metadata Agent', 'Schema Systems Agent');
  } else if (target.type === 'hub') {
    agents.unshift('Topical Hub Agent', 'Anchor Text Agent');
  } else if (target.type === 'gallery') {
    agents.unshift('Gallery SEO Agent', 'Image Alt SEO Agent');
  } else if (/sitemap/i.test(target.slug)) {
    agents.unshift('HTML Sitemap Agent', 'GSC Sitemap Submission Agent');
  } else {
    agents.unshift('Template QA Agent', 'Schema Systems Agent');
  }
  return [...new Set(['Main Audit Coordinator', ...agents])];
}

function priorityForTarget(target) {
  if (['tool', 'blog'].includes(target.page)) return 'P0';
  if (target.type === 'home') return 'P0';
  if (['category', 'hub'].includes(target.type)) return 'P1';
  return 'P2';
}

function requiredProofForTarget(target) {
  const proof = ['sitewide-seo-audit', 'all-pages-tone-audit', 'all-pages-human-tone-report'];
  if (['tool', 'blog'].includes(target.page)) {
    proof.push('all-pages-dataforseo', 'all-pages-serp-audit', `${target.page === 'tool' ? 'all-tools' : 'all-blogs'}-dataforseo-sprint`);
  }
  if (target.type === 'gallery') proof.push('gallery-seo-plan', 'image-alt-audit');
  if (/sitemap/i.test(target.slug)) proof.push('html-sitemap-plan', 'gsc-submit-sitemaps');
  return proof;
}

function allPagesReviewQueueCommand() {
  ensureDirs();
  const generatedAt = new Date().toISOString();
  const rows = publicPageTargets().map((target) => ({
    url: target.url,
    page: target.page,
    type: target.type,
    slug: target.slug,
    priority: priorityForTarget(target),
    keyword: target.keyword,
    builtHtml: target.builtHtml,
    mainAgent: 'SERPForge Main Audit Coordinator',
    subAgents: subAgentsForTarget(target),
    requiredProof: requiredProofForTarget(target),
    hardRule:
      ['tool', 'blog'].includes(target.page)
        ? 'tool/blog page cannot be done without page-specific DataForSEO Labs, live SERP, and OnPage evidence'
        : 'public page cannot be done without local SEO and smart-14 tone proof',
    status: 'queued',
  }));
  rows.sort((a, b) => a.priority.localeCompare(b.priority) || a.page.localeCompare(b.page) || a.url.localeCompare(b.url));
  const counts = rows.reduce(
    (summary, row) => {
      summary.total += 1;
      summary.byPriority[row.priority] = (summary.byPriority[row.priority] ?? 0) + 1;
      summary.byPage[row.page] = (summary.byPage[row.page] ?? 0) + 1;
      if (['tool', 'blog'].includes(row.page)) summary.dataForSeoMandatory += 1;
      return summary;
    },
    { total: 0, dataForSeoMandatory: 0, byPriority: {}, byPage: {} },
  );
  const markdownRows = rows
    .map((row) => `| ${row.priority} | ${row.page} | ${row.url} | ${row.subAgents.filter((agent) => agent !== 'Main Audit Coordinator').join(', ')} | ${row.requiredProof.join(', ')} |`)
    .join('\n');
  const queueMarkdown = [
    '# SERPForge All-Pages Review Queue',
    '',
    `Generated: ${generatedAt}`,
    '',
    `Rows: ${counts.total}`,
    `Tool/blog rows with mandatory DataForSEO: ${counts.dataForSeoMandatory}`,
    '',
    '| priority | page | url | sub-agents | required proof |',
    '| --- | --- | --- | --- | --- |',
    markdownRows,
  ].join('\n');
  const taskPath = writeMarkdownFile(join(tasksDir, 'all-pages-review-queue.md'), queueMarkdown);
  const payload = {
    generatedAt,
    kind: 'all-pages-review-queue',
    status: rows.length ? 'pass' : 'needs-attention',
    taskPath,
    counts,
    rows,
    rules: [
      'SERPForge is the main coordinator.',
      'Every row has assigned sub-agents and required proof.',
      'Tool and blog rows require page-specific DataForSEO Labs, SERP, and OnPage evidence before done.',
      'No page can be marked done from a sitewide audit shortcut.',
    ],
  };
  const paths = writePair(reportsDir, `serpforge-all-pages-review-queue-${stamp()}`, payload, [
    '# SERPForge All-Pages Review Queue Report',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${payload.status}`,
    `Task queue: ${taskPath}`,
    '',
    '## Counts',
    '',
    `- Public pages: ${counts.total}`,
    `- DataForSEO mandatory tool/blog pages: ${counts.dataForSeoMandatory}`,
    `- By priority: ${Object.entries(counts.byPriority).map(([key, value]) => `${key}=${value}`).join(', ')}`,
    `- By page: ${Object.entries(counts.byPage).map(([key, value]) => `${key}=${value}`).join(', ')}`,
    '',
    '## Rules',
    '',
    ...payload.rules.map((rule) => `- ${rule}`),
  ].join('\n'));
  console.log(`SERPForge all-pages review queue: ${payload.status}`);
  console.log(`- Public pages queued: ${counts.total}`);
  console.log(`- DataForSEO mandatory tool/blog pages: ${counts.dataForSeoMandatory}`);
  console.log(`- Task queue: ${taskPath}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (payload.status !== 'pass') process.exitCode = 1;
}

function allPagesToneAuditCommand() {
  ensureDirs();
  const generatedAt = new Date().toISOString();
  const rows = dataForSeoSitewideTargets().map((target) => {
    const built = builtHtmlForUrl(target.url);
    const tone = smart14ToneAudit(target, built);
    return {
      url: target.url,
      page: target.page,
      type: target.type,
      slug: target.slug,
      keyword: target.keyword,
      builtHtml: built.path,
      status: tone.status,
      blockers: tone.blockers,
      warnings: tone.warnings,
      blockerFindings: tone.blockerFindings,
      warningFindings: tone.warningFindings,
      title: tone.title,
      h1: tone.h1,
      wordCount: tone.wordCount,
    };
  });
  const counts = rows.reduce(
    (summary, row) => {
      summary.total += 1;
      summary.pass += row.status === 'pass' ? 1 : 0;
      summary.fail += row.status !== 'pass' ? 1 : 0;
      summary.warningRows += row.warnings.length ? 1 : 0;
      summary.blockers += row.blockers.length;
      summary.byPage[row.page] = (summary.byPage[row.page] ?? 0) + 1;
      return summary;
    },
    { total: 0, pass: 0, fail: 0, warningRows: 0, blockers: 0, byPage: {} },
  );
  const blockerRows = rows.filter((row) => row.status !== 'pass');
  const warningRows = rows.filter((row) => row.warnings.length);
  const status = blockerRows.length ? 'needs-attention' : 'pass';
  const payload = {
    generatedAt,
    kind: 'all-pages-tone-audit',
    status,
    counts,
    voiceRule: 'smart 14-year-old clarity, practical examples, plain words, honest limits, no AI/SEO/internal filler',
    webGuidanceSources: [
      'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
      'https://developers.google.com/search/docs/appearance/google-images',
    ],
    rows,
  };
  const blockerSample = blockerRows
    .slice(0, 50)
    .map((row) => `- ${row.url}: ${row.blockers.join(', ')}${row.blockerFindings[0]?.sample ? `; sample: "${row.blockerFindings[0].sample}"` : ''}`)
    .join('\n');
  const warningSample = warningRows
    .slice(0, 40)
    .map((row) => `- ${row.url}: ${row.warnings.slice(0, 4).join(', ')}`)
    .join('\n');
  const paths = writePair(reportsDir, `serpforge-all-pages-tone-audit-${stamp()}`, payload, [
    '# SERPForge All-Pages Smart 14 Tone Audit',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status}`,
    '',
    '## Counts',
    '',
    `- Public pages checked: ${counts.total}`,
    `- Tone blocker-free: ${counts.pass}`,
    `- Tone blockers: ${counts.fail}`,
    `- Warning rows: ${counts.warningRows}`,
    '',
    '## Voice Rule',
    '',
    payload.voiceRule,
    '',
    blockerRows.length ? '## Blockers' : '## Blockers\n\n- none',
    blockerRows.length ? blockerSample : '',
    '',
    warningRows.length ? '## Warning Sample' : '## Warning Sample\n\n- none',
    warningRows.length ? warningSample : '',
  ].join('\n\n'));
  console.log(`SERPForge all-pages tone audit: ${status}`);
  console.log(`- Public pages checked: ${counts.total}`);
  console.log(`- Tone blocker-free: ${counts.pass}/${counts.total}`);
  console.log(`- Warning rows: ${counts.warningRows}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (status !== 'pass') process.exitCode = 1;
}

function evidenceMaps() {
  const sitewide = latestSitewideRows();
  const intentLedger = latestAllPagesDataForSeoRows();
  const serpLedger = latestAllPagesSerpRows();
  const toneLedger = latestAllPagesToneRows();
  const reviewQueue = latestReviewQueueRows();
  const latestOnPage = latestCompletedOnPageEvidence();
  const onPageEvidence = latestOnPageItems(latestOnPage);
  return {
    sitewide,
    intentLedger,
    serpLedger,
    toneLedger,
    reviewQueue,
    latestOnPage,
    onPageEvidence,
    localByUrl: new Map(sitewide.rows.map((row) => [normalizeEvidenceUrl(row.url), row])),
    intentByUrl: new Map(intentLedger.rows.map((row) => [normalizeEvidenceUrl(row.url), row])),
    serpByUrl: new Map(serpLedger.rows.map((row) => [normalizeEvidenceUrl(row.url), row])),
    toneByUrl: new Map(toneLedger.rows.map((row) => [normalizeEvidenceUrl(row.url), row])),
    onPageByUrl: new Map(onPageEvidence.items.map((item) => [normalizeEvidenceUrl(item.url), item])),
  };
}

function onPageLiveIssues(onPage) {
  const checks = onPage?.checks ?? {};
  return [
    checks.is_broken ? 'broken page' : '',
    checks.is_4xx_code ? '4xx status' : '',
    checks.is_5xx_code ? '5xx status' : '',
    checks.no_title ? 'missing title' : '',
    checks.no_description ? 'missing description' : '',
    checks.no_h1_tag ? 'missing h1' : '',
    checks.no_image_alt ? 'image missing alt' : '',
    checks.has_micromarkup_errors ? 'schema errors' : '',
    checks.canonical === false ? 'canonical issue' : '',
  ].filter(Boolean);
}

function pageProofRows(targets = dataForSeoSitewideTargets()) {
  const maps = evidenceMaps();
  return targets.map((target) => {
    const key = normalizeEvidenceUrl(target.url);
    const built = builtHtmlForUrl(target.url);
    const local = maps.localByUrl.get(key);
    const intent = maps.intentByUrl.get(key);
    const serp = maps.serpByUrl.get(key);
    const onPage = maps.onPageByUrl.get(key);
    const tone = maps.toneByUrl.get(key) ?? smart14ToneAudit(target, built);
    const onPageIssues = onPageLiveIssues(onPage);
    const toolBlog = ['tool', 'blog'].includes(target.page);
    const blockers = [];

    if (local?.status !== 'pass') blockers.push(`local SEO status is ${local?.status ?? 'missing'}`);
    if ((tone.status ?? 'fail') !== 'pass') blockers.push(`smart-14 tone status is ${tone.status ?? 'missing'}`);

    if (toolBlog) {
      if (!intent || intent.dataForSeoSearchIntentStatus !== 'covered') blockers.push('missing DataForSEO Labs Search Intent evidence');
      if (!serp) blockers.push('missing DataForSEO live SERP evidence');
      else if (serp.status !== 'pass') blockers.push(`DataForSEO live SERP status is ${serp.status}`);
      if (!onPage) blockers.push('missing DataForSEO OnPage evidence for this exact page');
      if (onPageIssues.length) blockers.push(`DataForSEO OnPage issues: ${onPageIssues.join(', ')}`);
    }

    return {
      url: target.url,
      page: target.page,
      type: target.type,
      slug: target.slug,
      tier: target.tier,
      keyword: target.keyword,
      builtHtml: built.path,
      localSeoStatus: local?.status ?? 'missing',
      localSeoScore: local?.score ?? null,
      toneStatus: tone.status ?? 'missing',
      toneBlockers: tone.blockers ?? [],
      toneWarnings: tone.warnings ?? [],
      dataForSeoMandatory: toolBlog,
      dataForSeoSearchIntentStatus: intent?.dataForSeoSearchIntentStatus ?? 'missing',
      dataForSeoSearchIntentLabel: intent?.dataForSeoSearchIntentLabel ?? null,
      dataForSeoSerpStatus: serp?.status ?? 'missing',
      dataForSeoSerpAccessRank: serp?.accessRank ?? null,
      dataForSeoOnPageStatus: onPage ? 'covered' : 'missing',
      dataForSeoOnPageScore: onPage?.onpage_score ?? null,
      dataForSeoOnPageHttpStatus: onPage?.status_code ?? null,
      dataForSeoOnPageIssues: onPageIssues,
      blockers,
      done: blockers.length === 0,
    };
  });
}

function summarizeProofRows(rows) {
  return rows.reduce(
    (summary, row) => {
      summary.total += 1;
      summary.done += row.done ? 1 : 0;
      summary.blocked += row.done ? 0 : 1;
      summary.dataForSeoMandatory += row.dataForSeoMandatory ? 1 : 0;
      summary.dataForSeoMandatoryDone += row.dataForSeoMandatory && row.done ? 1 : 0;
      summary.tonePass += row.toneStatus === 'pass' ? 1 : 0;
      summary.localSeoPass += row.localSeoStatus === 'pass' ? 1 : 0;
      summary.intentCovered += row.dataForSeoSearchIntentStatus === 'covered' ? 1 : 0;
      summary.serpCovered += row.dataForSeoSerpStatus !== 'missing' ? 1 : 0;
      summary.onPageCovered += row.dataForSeoOnPageStatus === 'covered' ? 1 : 0;
      summary.byPage[row.page] = (summary.byPage[row.page] ?? 0) + 1;
      return summary;
    },
    {
      total: 0,
      done: 0,
      blocked: 0,
      dataForSeoMandatory: 0,
      dataForSeoMandatoryDone: 0,
      tonePass: 0,
      localSeoPass: 0,
      intentCovered: 0,
      serpCovered: 0,
      onPageCovered: 0,
      byPage: {},
    },
  );
}

function sitewideSeoAuditCommand(options = {}) {
  ensureDirs();
  const generatedAt = new Date().toISOString();
  const urls = sitemapUrlsFromBuiltFiles();
  const toolQueue = buildSeoToolQueueReport({ write: true });
  const rows = [];

  for (const url of urls) {
    const classification = classifyUrl(url);
    const built = builtHtmlForUrl(url);
    const builtAudit = pageSeoIssues(url, built);
    let pageScore = null;

    if (classification.slug && ['tool', 'blog'].includes(classification.page)) {
      try {
        const scoreReport = buildSeoPageScoreReport(classification.slug, { page: classification.page, write: options.writePageScores !== false });
        pageScore = {
          status: scoreReport.status,
          overall: scoreReport.score.overall,
          issues: scoreReport.issues,
          warnings: scoreReport.warnings,
          report: scoreReport.paths?.markdownPath ?? '',
        };
      } catch (error) {
        pageScore = {
          status: 'not-enough-data',
          overall: 0,
          issues: [error instanceof Error ? error.message : String(error)],
          warnings: [],
          report: '',
        };
      }
    }

    const combinedIssues = [...builtAudit.issues, ...(pageScore?.issues ?? [])];
    const combinedWarnings = [...builtAudit.warnings, ...(pageScore?.warnings ?? [])];
    const publicIssues = combinedIssues.filter((issue) => {
      if (/source record has \d+ FAQs/i.test(issue) && builtAudit.faqCount >= 6) return false;
      if (/source record is missing seoDescription/i.test(issue) && builtAudit.description) return false;
      if (/Missing seoDescription in source/i.test(issue) && builtAudit.description) return false;
      if (/Missing seoTitle in source/i.test(issue) && builtAudit.title) return false;
      return true;
    });
    const publicWarnings = combinedWarnings.filter((warning) => {
      if (/source record has \d+ FAQs/i.test(warning) && builtAudit.faqCount >= 6) return false;
      if (/source record is missing seoDescription/i.test(warning) && builtAudit.description) return false;
      if (/Missing seoDescription in source/i.test(warning) && builtAudit.description) return false;
      if (/Missing seoTitle in source/i.test(warning) && builtAudit.title) return false;
      return true;
    });
    const combinedScore = pageScore ? Math.round((builtAudit.score + pageScore.overall) / 2) : builtAudit.score;
    const publicScore = publicIssues.length || publicWarnings.length ? combinedScore : builtAudit.score;
    rows.push({
      url,
      type: classification.type,
      slug: classification.slug,
      page: classification.page,
      builtHtml: built.path,
      title: builtAudit.title,
      descriptionLength: builtAudit.description.length,
      h1: builtAudit.h1,
      canonical: builtAudit.canonical,
      schemaTypes: builtAudit.schemaTypes,
      faqCount: builtAudit.faqCount,
      internalLinks: builtAudit.internalLinks,
      wordCount: builtAudit.wordCount,
      imageAlt: builtAudit.imageAlt,
      builtScore: builtAudit.score,
      pageScore,
      score: publicScore,
      status: publicIssues.length ? 'fail' : publicWarnings.length ? 'attention' : 'pass',
      issues: publicIssues,
      warnings: publicWarnings,
      sourceOnlyFindingsSuppressed: combinedIssues.length + combinedWarnings.length - publicIssues.length - publicWarnings.length,
    });
  }

  const severity = { fail: 0, attention: 1, pass: 2 };
  rows.sort((a, b) => severity[a.status] - severity[b.status] || a.score - b.score || b.issues.length - a.issues.length || a.url.localeCompare(b.url));

  const byStatus = rows.reduce((summary, row) => {
    summary[row.status] = (summary[row.status] ?? 0) + 1;
    return summary;
  }, {});

  const byType = rows.reduce((summary, row) => {
    summary[row.type] = (summary[row.type] ?? 0) + 1;
    return summary;
  }, {});

  const report = {
    generatedAt,
    kind: 'serpforge-sitewide-seo-audit',
    status: rows.some((row) => row.status === 'fail') ? 'needs-attention' : rows.some((row) => row.status === 'attention') ? 'attention' : 'pass',
    summary: {
      sitemapUrls: urls.length,
      byStatus,
      byType,
      toolQueuePages: toolQueue.summary?.pages ?? 0,
    },
    rules: [
      'This is a sitewide evidence pass, not human approval.',
      'Fixes still use the one-page SEO workbench and human approval gate.',
      'Paid DataForSEO evidence remains gated by account and status checks.',
    ],
    topPriorityRows: rows.slice(0, 60),
    rows,
  };

  const issueRows = report.topPriorityRows
    .map((row, index) => {
      const problems = [...row.issues, ...row.warnings].slice(0, 4).join('; ') || 'no immediate issue';
      return `| ${index + 1} | ${row.score} | ${row.status} | ${row.type} | ${row.url} | ${problems} |`;
    })
    .join('\n');

  const markdown = `# SERPForge Sitewide SEO Audit

Generated: ${generatedAt}

- Status: ${report.status}
- Sitemap URLs checked: ${urls.length}
- Tool/blog review units: ${toolQueue.summary?.pages ?? 0}
- Pass: ${byStatus.pass ?? 0}
- Attention: ${byStatus.attention ?? 0}
- Fail: ${byStatus.fail ?? 0}

## Scope

This report checks every built sitemap URL for title, meta description, H1, canonical, indexability, internal links, image alt coverage, schema, visible text depth, and built HTML availability. Tool and blog URLs also receive the local SEO page score.

## Top Priority Rows

| # | score | status | type | url | top issues |
| ---: | ---: | --- | --- | --- | --- |
${issueRows || '| 1 | 100 | pass | none | none | no sitemap URLs found |'}

## Guardrails

- Use \`node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>\` before editing a page.
- Use \`npm run serpforge -- paid-audit-sprint <slug> <tool|blog>\` only after DataForSEO gates pass.
- Do not mark a page fixed or approved from this report alone.
`;

  const paths = writePair(reportsDir, `serpforge-sitewide-seo-audit-${stamp()}`, report, markdown);
  console.log(`SERPForge sitewide SEO audit: ${report.status}`);
  console.log(`- URLs checked: ${urls.length}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  return report.status === 'pass' ? 0 : 1;
}

function createPlanReport(kind, title, sections, extra = {}) {
  const payload = {
    generatedAt: new Date().toISOString(),
    kind,
    status: 'ready',
    ...extra,
  };
  const baseName = `serpforge-${kind}-${stamp()}`;
  const markdown = [
    `# ${title}`,
    '',
    `Generated: ${payload.generatedAt}`,
    `Status: ${payload.status}`,
    '',
    ...sections,
  ].join('\n');
  const paths = writePair(reportsDir, baseName, payload, markdown);
  console.log(`${title}: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  return { payload, paths };
}

function toolboxCommand() {
  const tools = [
    {
      name: 'Orientation',
      command: 'npm run serpforge -- orientation',
      purpose: 'Build a read-only SEO status pack for SERPForge before choosing work.',
      writes: 'agents/serpforge-ai/reports/serpforge-orientation-*.md',
    },
    {
      name: 'Page Review',
      command: 'npm run serpforge -- page <slug> <tool|blog>',
      purpose: 'Run the local page brief, research, score, SEO workbench, and approval status checks for one page.',
      writes: 'agents/serpforge-ai/reports/serpforge-page-*.md and output/seo-agents/<slug>/<page>/',
    },
    {
      name: 'Source Evidence',
      command: 'npm run serpforge -- sources <slug> <tool|blog>',
      purpose: 'Collect the page brief, local research, page score, and workbench source-evidence stage when a full review is premature.',
      writes: 'agents/serpforge-ai/reports/serpforge-page-*.md and output/seo-agents/<slug>/<page>/source-evidence.md',
    },
    {
      name: 'SEO Workbench',
      command: 'node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>',
      purpose: 'Activate the specialist SEO council, micro-agents, evaluator checks, link audit, and final judge.',
      writes: 'output/seo-agents/<slug>/<page>/',
    },
    {
      name: 'Opportunity Finder',
      command: 'npm run serpforge -- opportunity',
      purpose: 'Rank next SEO actions from Search Console snapshots, queue, links, indexing gaps, usage, and marketing evidence.',
      writes: 'agents/serpforge-ai/reports/serpforge-opportunity-*.md',
    },
    {
      name: 'Technical Sweep',
      command: 'npm run serpforge -- technical',
      purpose: 'Run report-only technical SEO checks for indexing, sitemap, hubs, semantic depth, and AI crawler visibility.',
      writes: 'agents/serpforge-ai/reports/serpforge-technical-*.md',
    },
    {
      name: 'Content Brief',
      command: 'npm run serpforge -- brief <slug> <tool|blog>',
      purpose: 'Create an SEO content brief from tool evidence, local research, page score, and source evidence.',
      writes: 'agents/serpforge-ai/briefs/serpforge-brief-*.md',
    },
    {
      name: 'CTR Rewrites',
      command: 'npm run serpforge -- ctr <slug> <tool|blog>',
      purpose: 'Draft safe title and meta description options aligned to search intent.',
      writes: 'agents/serpforge-ai/briefs/serpforge-ctr-*.md',
    },
    {
      name: 'Validation Gate',
      command: 'npm run serpforge -- validate <slug> <tool|blog>',
      purpose: 'Run the final pre-approval proof chain, including page SEO, workbench, structured data, and approval status.',
      writes: 'agents/serpforge-ai/reports/serpforge-validate-*.md',
    },
    {
      name: 'Competitor Gap',
      command: 'npm run serpforge -- competitor <slug> <tool|blog> --url <competitor-url>',
      purpose: 'Run targeted competitor gap analysis without broad paid research.',
      writes: 'agents/serpforge-ai/reports/serpforge-competitor-*.md',
    },
    {
      name: 'Lighthouse External CLI',
      command: 'npm run serpforge -- lighthouse <url>',
      purpose: 'Use the Lighthouse CLI through npx for lab performance, accessibility, best-practices, and SEO evidence.',
      writes: 'agents/serpforge-ai/reports/lighthouse-*.json and serpforge-lighthouse-*.md',
    },
    {
      name: 'Audit Task System',
      command: 'npm run serpforge -- audit-import && npm run serpforge -- audit-tasks && npm run serpforge -- audit-sprint',
      purpose: 'Import the SEO audit, refresh the shared task board, and combine sub-agent lanes into a sprint report.',
      writes: 'agents/serpforge-ai/evidence/, agents/serpforge-ai/tasks/, agents/serpforge-ai/reports/',
    },
    {
      name: 'Deep Audit Agent Sprint',
      command: 'npm run serpforge -- deep-audit-import && npm run serpforge -- deep-audit-agents && npm run serpforge -- deep-audit-sprint',
      purpose: 'Import the PDF audit, assign deep-audit sub-agents, and produce proof-labeled technical, content, trust, authority, social, DataForSEO, and GSC sprint evidence.',
      writes: 'agents/serpforge-ai/evidence/, agents/serpforge-ai/tasks/deep-audit-agent-board.md, agents/serpforge-ai/reports/',
    },
    {
      name: 'Image And Gallery SEO',
      command: 'npm run serpforge -- image-alt-audit && npm run serpforge -- gallery-seo-plan',
      purpose: 'Find weak tool-art alt/caption text and keep approved galleries indexable as image SEO assets.',
      writes: 'agents/serpforge-ai/reports/serpforge-image-*.md and serpforge-gallery-*.md',
    },
    {
      name: 'GSC Sitemap Submission',
      command: 'npm run serpforge -- gsc-submit-sitemaps',
      purpose: 'Submit the canonical sitemap set and feed through Google Search Console owner OAuth.',
      writes: 'output/search-console-discovery.json and agents/serpforge-ai/reports/serpforge-gsc-*.md',
    },
    {
      name: 'DataForSEO Paid Sprint',
      command: 'npm run serpforge -- paid-audit-sprint <slug> <tool|blog>',
      purpose: 'Run DataForSEO account/status gates, targeted paid keyword evidence, and the page workflow.',
      writes: 'agents/serpforge-ai/reports/serpforge-paid-audit-sprint-*.md',
    },
    {
      name: 'Marketing Orchestrator',
      command: 'npm run marketing:orchestrate',
      purpose: 'Rank broad marketing, SEO, internal-link, and promotion next actions without publishing.',
      writes: 'output/marketing-orchestrator/',
    },
    {
      name: 'AFT Agent Doctor',
      command: 'npm run aft -- agent-doctor',
      purpose: 'Verify local agent docs and helper command surface after agent-system edits.',
      writes: 'output/agent-tools/agent-doctor/latest.md',
    },
  ];

  const payload = {
    generatedAt: new Date().toISOString(),
    workspace: rel(workspaceDir),
    tools,
    guardrails: [
      'Do not run broad paid DataForSEO research without explicit user approval.',
      'Google Search Console remains the indexing and performance source of truth.',
      'SERPForge can say ready-for-human-approval, not approved.',
      'Public promotion, paid ads, DNS, hosting, and account writes need explicit approval.',
    ],
  };

  const markdown = [
    '# SERPForge Tool Access',
    '',
    `Generated: ${payload.generatedAt}`,
    '',
    '## Tools',
    '',
    ...tools.flatMap((tool) => [
      `### ${tool.name}`,
      '',
      `- Command: \`${tool.command}\``,
      `- Purpose: ${tool.purpose}`,
      `- Writes: \`${tool.writes}\``,
      '',
    ]),
    '## Guardrails',
    '',
    ...payload.guardrails.map((item) => `- ${item}`),
  ].join('\n');

  const paths = writePair(evidenceDir, 'tool-access', payload, markdown);
  console.log(`SERPForge tool access: ready`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function orientationCommand() {
  const results = [
    runAft('AFT status', ['status']),
    runAft('SEO evidence pack', ['evidence-pack', 'seo']),
    runAft('Marketing overview', ['marketing']),
    runAft('SEO tool queue', ['seo-tool-queue']),
    runAft('Indexing gaps', ['indexing-gaps']),
    runAft('Promotion proof check', ['proof-check']),
  ];

  const payload = {
    generatedAt: new Date().toISOString(),
    workspace: rel(workspaceDir),
    status: results.every((item) => item.status === 0) ? 'pass' : 'needs-attention',
    results: results.map((result) => ({
      ...result,
      parsedJson: parseJsonResult(result),
    })),
  };

  const baseName = `serpforge-orientation-${stamp()}`;
  const markdown = [
    '# SERPForge Orientation Report',
    '',
    `Generated: ${payload.generatedAt}`,
    `Status: ${payload.status}`,
    '',
    ...results.map(commandBlock),
  ].join('\n\n');

  const paths = writePair(reportsDir, baseName, payload, markdown);
  console.log(`SERPForge orientation: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  for (const result of results) {
    console.log(`- ${result.label}: exit ${result.status}`);
  }
}

function opportunityCommand() {
  const results = [
    runAft('AFT status', ['status']),
    runAft('SEO console', ['seo-console']),
    runAft('Link helper', ['link-helper']),
    runAft('Indexing gaps', ['indexing-gaps']),
    runAft('Usage summary', ['usage-summary']),
    runAft('SEO tool queue', ['seo-tool-queue']),
    runAft('Marketing overview', ['marketing']),
    runAft('Promotion proof check', ['proof-check']),
  ];
  const recommendations = shortRecommendations(results);
  const payload = {
    generatedAt: new Date().toISOString(),
    workspace: rel(workspaceDir),
    status: results.every((item) => item.status === 0) ? 'pass' : 'needs-attention',
    recommendations,
    results: results.map((result) => ({ ...result, parsedJson: parseJsonResult(result) })),
  };
  const baseName = `serpforge-opportunity-${stamp()}`;
  const markdown = [
    '# SERPForge Opportunity Report',
    '',
    `Generated: ${payload.generatedAt}`,
    `Status: ${payload.status}`,
    '',
    '## Best Next Actions',
    '',
    ...(recommendations.length ? recommendations.map((item) => `- ${item}`) : ['- Not enough data for ranked recommendations.']),
    '',
    ...results.map(commandBlock),
  ].join('\n\n');
  const paths = writePair(reportsDir, baseName, payload, markdown);
  console.log(`SERPForge opportunity: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  recommendations.slice(0, 5).forEach((item, index) => console.log(`- ${index + 1}. ${item}`));
}

function technicalCommand() {
  const results = [
    runAft('SEO console', ['seo-console']),
    runAft('Indexing gaps', ['indexing-gaps']),
    runAft('Indexing protection', ['indexing-protection']),
    runAft('Site sitemap', ['site-sitemap']),
    runAft('Hub strength', ['hub-strength']),
    runAft('Semantic depth', ['semantic-depth']),
    runAft('AI crawler visibility', ['ai-crawler']),
  ];
  const recommendations = shortRecommendations(results);
  const payload = {
    generatedAt: new Date().toISOString(),
    workspace: rel(workspaceDir),
    status: results.every((item) => item.status === 0) ? 'pass' : 'needs-attention',
    recommendations,
    results: results.map((result) => ({ ...result, parsedJson: parseJsonResult(result) })),
  };
  const baseName = `serpforge-technical-${stamp()}`;
  const markdown = [
    '# SERPForge Technical SEO Report',
    '',
    `Generated: ${payload.generatedAt}`,
    `Status: ${payload.status}`,
    '',
    '## Priority Notes',
    '',
    ...(recommendations.length ? recommendations.map((item) => `- ${item}`) : ['- No immediate technical recommendation surfaced from local reports.']),
    '',
    ...results.map(commandBlock),
  ].join('\n\n');
  const paths = writePair(reportsDir, baseName, payload, markdown);
  console.log(`SERPForge technical: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  for (const result of results) console.log(`- ${result.label}: exit ${result.status}`);
}

function pageCommand(slug, page, options) {
  const cleanPage = cleanPageType(page);

  const results = [
    runAft('Tool brief', ['tool-brief', slug]),
    runAft('SEO page research', ['seo-tool-research', slug, cleanPage]),
    runAft('SEO page score', ['seo-page-score', slug, cleanPage]),
  ];

  if (!options.skipWorkbench) {
    const workbenchMode = options.sourcesOnly ? 'sources' : 'all';
    results.push(runWorkbench(`SEO workbench ${workbenchMode}`, [workbenchMode, slug, cleanPage]));
  }

  results.push(runAft('SEO approval status', ['seo-approval-status', slug]));

  const payload = {
    generatedAt: new Date().toISOString(),
    slug,
    page: cleanPage,
    workspace: rel(workspaceDir),
    status: results.every((item) => item.status === 0) ? 'pass' : 'needs-attention',
    workbenchSkipped: Boolean(options.skipWorkbench),
    results: results.map((result) => ({
      ...result,
      parsedJson: parseJsonResult(result),
    })),
  };

  const baseName = `serpforge-page-${slug}-${cleanPage}-${stamp()}`;
  const markdown = [
    `# SERPForge Page Review: ${slug} (${cleanPage})`,
    '',
    `Generated: ${payload.generatedAt}`,
    `Status: ${payload.status}`,
    `SEO workbench: ${payload.workbenchSkipped ? 'skipped by flag' : 'run'}`,
    '',
    ...results.map(commandBlock),
    '',
    '## Gate',
    '',
    '- This report is evidence for SERPForge review only.',
    '- If the checks pass, the page can be described as ready-for-human-approval, not approved.',
  ].join('\n\n');

  const paths = writePair(reportsDir, baseName, payload, markdown);
  console.log(`SERPForge page review: ${payload.status}`);
  console.log(`- Slug: ${slug}`);
  console.log(`- Page: ${cleanPage}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  for (const result of results) {
    console.log(`- ${result.label}: exit ${result.status}`);
  }

  if (payload.status !== 'pass') process.exitCode = 1;
}

function sourcesCommand(slug, page) {
  pageCommand(slug, page, { sourcesOnly: true, skipWorkbench: false });
}

function cleanPageType(page) {
  return cleanPage(page);
}

function briefCommand(slug, page) {
  const cleanPageValue = cleanPage(page);
  const results = [
    runAft('Tool brief', ['tool-brief', slug]),
    runAft('SEO page research', ['seo-tool-research', slug, cleanPageValue]),
    runAft('SEO page score', ['seo-page-score', slug, cleanPageValue]),
    runWorkbench('SEO workbench sources', ['sources', slug, cleanPageValue]),
  ];
  const research = parseJsonResult(results[1]) ?? {};
  const score = parseJsonResult(results[2]) ?? {};
  const tool = research.tool ?? {};
  const issues = [...(score.issues ?? []), ...(score.warnings ?? [])];
  const payload = {
    generatedAt: new Date().toISOString(),
    slug,
    page: cleanPageValue,
    status: results.every((item) => item.status === 0) ? 'pass' : 'needs-attention',
    tool,
    score: score.score ?? null,
    issues,
    results: results.map((result) => ({ ...result, parsedJson: parseJsonResult(result) })),
  };
  const baseName = `serpforge-brief-${slug}-${cleanPageValue}-${stamp()}`;
  const markdown = [
    `# SERPForge Content Brief: ${slug} (${cleanPageValue})`,
    '',
    `Generated: ${payload.generatedAt}`,
    `Status: ${payload.status}`,
    '',
    '## Page',
    '',
    `- URL: ${research.url ?? 'not enough data'}`,
    `- Tool: ${tool.name ?? slug}`,
    `- Category: ${tool.category ?? 'not enough data'}`,
    `- Summary: ${tool.summary ?? tool.description ?? 'not enough data'}`,
    '',
    '## Search Intent',
    '',
    `- Primary intent: finish a ${tool.name ?? slug} task quickly and understand the answer.`,
    '- Secondary intent: check formula/logic, avoid common mistakes, and decide whether the result is safe to rely on.',
    '',
    '## Content Priorities',
    '',
    `- Overall score: ${score.score?.overall ?? 'not enough data'}`,
    `- FAQ score: ${score.score?.sections?.faqQuality ?? 'not enough data'}`,
    `- Trust/limits score: ${score.score?.sections?.trustAndLimits ?? 'not enough data'}`,
    '',
    '## Recommended Work',
    '',
    ...(issues.length ? issues.map((item) => `- ${item}`) : ['- No blocking content issues surfaced in the local score.']),
    '- Keep examples practical, numeric, and specific to this tool.',
    '- Keep any final state at ready-for-human-approval until the user approves the exact page.',
    '',
    ...results.map(commandBlock),
  ].join('\n\n');
  const paths = writePair(briefsDir, baseName, payload, markdown);
  console.log(`SERPForge brief: ${payload.status}`);
  console.log(`- Saved brief: ${paths.markdownPath}`);
  for (const result of results) console.log(`- ${result.label}: exit ${result.status}`);
}

function ctrCommand(slug, page) {
  const cleanPageValue = cleanPage(page);
  const results = [
    runAft('SEO page research', ['seo-tool-research', slug, cleanPageValue]),
    runAft('SEO page score', ['seo-page-score', slug, cleanPageValue]),
  ];
  const research = parseJsonResult(results[0]) ?? {};
  const score = parseJsonResult(results[1]) ?? {};
  const tool = research.tool ?? {};
  const name = tool.name ?? slug.replace(/-/g, ' ');
  const titleOptions = [
    `${name} | Free Online Tool`,
    `${name}: Fast Free Calculator`,
    `Free ${name} With Examples`,
  ].map((text) => ({ text, length: text.length }));
  const metaOptions = [
    tool.description || research.source?.seoDescription || `Use this free ${name} to get a quick result with clear inputs, examples, and honest limits.`,
    `Use the free ${name} for quick answers, practical examples, common mistakes, and plain-language result notes.`,
    `Calculate with ${name} online. Check inputs, formula notes, examples, FAQs, and what the result does and does not prove.`,
  ].map((text) => ({ text, length: text.length }));
  const payload = {
    generatedAt: new Date().toISOString(),
    slug,
    page: cleanPageValue,
    status: results.every((item) => item.status === 0) ? 'pass' : 'needs-attention',
    titleOptions,
    metaOptions,
    currentTitle: research.builtProof?.title ?? '',
    currentDescription: research.builtProof?.description ?? '',
    score: score.score ?? null,
    results: results.map((result) => ({ ...result, parsedJson: parseJsonResult(result) })),
  };
  const baseName = `serpforge-ctr-${slug}-${cleanPageValue}-${stamp()}`;
  const markdown = [
    `# SERPForge CTR Rewrites: ${slug} (${cleanPageValue})`,
    '',
    `Generated: ${payload.generatedAt}`,
    `Status: ${payload.status}`,
    '',
    '## Current Snippet',
    '',
    `- Title: ${payload.currentTitle || 'not enough data'}`,
    `- Description: ${payload.currentDescription || 'not enough data'}`,
    '',
    '## Title Options',
    '',
    ...titleOptions.map((item) => `- ${item.text} (${item.length} chars)`),
    '',
    '## Meta Description Options',
    '',
    ...metaOptions.map((item) => `- ${item.text} (${item.length} chars)`),
    '',
    '## Guardrail',
    '',
    '- Do not use clickbait. Pick the version that best matches the page content and search intent.',
    '',
    ...results.map(commandBlock),
  ].join('\n\n');
  const paths = writePair(briefsDir, baseName, payload, markdown);
  console.log(`SERPForge CTR: ${payload.status}`);
  console.log(`- Saved brief: ${paths.markdownPath}`);
}

function validateCommand(slug, page) {
  const cleanPageValue = cleanPage(page);
  const results = [
    runAft('Tool brief', ['tool-brief', slug]),
    runAft('Page SEO', ['page-seo', slug]),
    runAft('SEO page score', ['seo-page-score', slug, cleanPageValue]),
    runWorkbench('SEO workbench all', ['all', slug, cleanPageValue]),
    runAft('SEO approval status', ['seo-approval-status', slug]),
    runNpmScript('Structured data check', 'check:structured-data'),
  ];
  const payload = {
    generatedAt: new Date().toISOString(),
    slug,
    page: cleanPageValue,
    status: results.every((item) => item.status === 0) ? 'pass' : 'needs-attention',
    results: results.map((result) => ({ ...result, parsedJson: parseJsonResult(result) })),
  };
  const baseName = `serpforge-validate-${slug}-${cleanPageValue}-${stamp()}`;
  const markdown = [
    `# SERPForge Validation: ${slug} (${cleanPageValue})`,
    '',
    `Generated: ${payload.generatedAt}`,
    `Status: ${payload.status}`,
    '',
    '## Approval Rule',
    '',
    '- Passing validation means ready for human approval, not approved.',
    '- Human approval must be recorded in `docs/seo-tool-review-queue.md` before moving to the next approval unit.',
    '',
    ...results.map(commandBlock),
  ].join('\n\n');
  const paths = writePair(reportsDir, baseName, payload, markdown);
  console.log(`SERPForge validate: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  for (const result of results) console.log(`- ${result.label}: exit ${result.status}`);
  if (payload.status !== 'pass') process.exitCode = 1;
}

async function competitorCommand(slug, args, command) {
  const values = Array.isArray(args) ? args : [];
  const pageArg = values.find((value) => /^(tool|blog)$/i.test(value)) ?? 'tool';
  const cleanPageValue = cleanPage(pageArg);
  const opts = typeof command?.opts === 'function' ? command.opts() : command ?? {};
  const positionalUrls = values.filter((value) => /^https?:\/\//i.test(value));
  const envUrl = process.env.npm_config_url && !/^(true|false)$/i.test(process.env.npm_config_url) ? [process.env.npm_config_url] : [];
  const urls = [...(opts.url ?? []), ...positionalUrls, ...envUrl];
  const aftArgs = ['seo-competitor-gap', slug, cleanPageValue, ...urls.flatMap((url) => ['--url', url])];
  const results = [runAft('SEO competitor gap', aftArgs)];
  const payload = {
    generatedAt: new Date().toISOString(),
    slug,
    page: cleanPageValue,
    urls,
    status: results.every((item) => item.status === 0) ? 'pass' : 'needs-attention',
    results: results.map((result) => ({ ...result, parsedJson: parseJsonResult(result) })),
  };
  const baseName = `serpforge-competitor-${slug}-${cleanPageValue}-${stamp()}`;
  const markdown = [
    `# SERPForge Competitor Gap: ${slug} (${cleanPageValue})`,
    '',
    `Generated: ${payload.generatedAt}`,
    `Status: ${payload.status}`,
    '',
    ...(urls.length ? urls.map((url) => `- Competitor: ${url}`) : ['- Competitor: not provided']),
    '',
    '## Guardrail',
    '',
    '- Use competitors for gaps only. Do not copy wording, structure, examples, or brand voice.',
    '',
    ...results.map(commandBlock),
  ].join('\n\n');
  const paths = writePair(reportsDir, baseName, payload, markdown);
  console.log(`SERPForge competitor: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  for (const result of results) console.log(`- ${result.label}: exit ${result.status}`);
  if (payload.status !== 'pass') process.exitCode = 1;
}

function lighthouseCommand(url, args, command) {
  ensureDirs();
  const values = Array.isArray(args) ? args : [];
  const opts = typeof command?.opts === 'function' ? command.opts() : command ?? {};
  const presetValue = values.find((value) => /^(desktop|mobile)$/i.test(value)) ?? opts.preset ?? process.env.npm_config_preset;
  const preset = presetValue === 'desktop' ? 'desktop' : 'mobile';
  const lighthouseJsonPath = join(reportsDir, `lighthouse-${slugify(url)}-${preset}-${stamp()}.json`);
  const lighthouseArgs = [
    'lighthouse',
    url,
    '--quiet',
    '--output=json',
    `--output-path=${lighthouseJsonPath}`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--chrome-flags=--headless=new --no-sandbox',
  ];
  if (preset === 'desktop') {
    lighthouseArgs.push('--preset=desktop');
  }
  const result = runNpx('Lighthouse CLI', 'lighthouse', lighthouseArgs.slice(1));
  const lighthouseReport = readJsonFile(lighthouseJsonPath);
  const categoryScores = lighthouseReport?.categories
    ? Object.fromEntries(
        Object.entries(lighthouseReport.categories).map(([key, value]) => [
          key,
          value.score == null ? null : Math.round(Number(value.score) * 100),
        ]),
      )
    : null;
  const runtimeError = lighthouseReport?.runtimeError ?? null;
  const hasScoredCategories =
    categoryScores && Object.values(categoryScores).every((score) => Number.isFinite(score));
  const payload = {
    generatedAt: new Date().toISOString(),
    url,
    preset,
    status: lighthouseReport && !runtimeError && hasScoredCategories ? 'pass' : 'needs-attention',
    lighthouseJsonPath: rel(lighthouseJsonPath),
    categoryScores,
    runtimeError,
    cleanupWarning: result.status !== 0 && lighthouseReport ? result.stderr : '',
    result,
  };
  const baseName = `serpforge-lighthouse-${slugify(url)}-${preset}-${stamp()}`;
  const markdown = [
    '# SERPForge Lighthouse External CLI Report',
    '',
    `Generated: ${payload.generatedAt}`,
    `URL: ${url}`,
    `Preset: ${preset}`,
    `Status: ${payload.status}`,
    `Lighthouse JSON: ${payload.lighthouseJsonPath}`,
    '',
    '## Scores',
    '',
    ...(categoryScores
      ? Object.entries(categoryScores).map(([key, value]) => `- ${key}: ${value ?? 'not scored'}`)
      : ['- Lighthouse did not produce a readable JSON report.']),
    runtimeError
      ? [
          '',
          '## Runtime Error',
          '',
          `- Code: ${runtimeError.code ?? 'unknown'}`,
          `- Message: ${runtimeError.message ?? 'unknown'}`,
        ].join('\n\n')
      : '',
    '',
    '## Note',
    '',
    '- Lighthouse is external lab evidence. Use it with Search Console, local proof, and workbench evidence before making SEO claims.',
    payload.cleanupWarning ? '- Lighthouse produced a readable report but exited nonzero during Chrome temp cleanup.' : '',
    '',
    commandBlock(result),
  ].join('\n\n');
  const paths = writePair(reportsDir, baseName, payload, markdown);
  console.log(`SERPForge Lighthouse: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  console.log(`- Lighthouse JSON: ${payload.lighthouseJsonPath}`);
  if (categoryScores) {
    for (const [key, value] of Object.entries(categoryScores)) console.log(`- ${key}: ${value ?? 'not scored'}`);
  }
  if (payload.status !== 'pass') process.exitCode = 1;
}

function deepAuditImportCommand() {
  ensureDirs();
  const source = existsSync(deepAuditDownloadPdfPath) ? deepAuditDownloadPdfPath : deepAuditPdfEvidencePath;
  if (!existsSync(source)) {
    throw new Error(`Deep audit PDF not found at ${deepAuditDownloadPdfPath} or ${deepAuditPdfEvidencePath}.`);
  }

  if (source !== deepAuditPdfEvidencePath) {
    copyFileSync(source, deepAuditPdfEvidencePath);
  }

  const extraction = extractDeepAuditPdfText(deepAuditPdfEvidencePath);
  writeFileSync(deepAuditTextEvidencePath, extraction.text);
  writeMarkdownFile(deepAuditMarkdownEvidencePath, deepAuditEvidenceMarkdown(extraction.text));

  const stat = statSync(deepAuditPdfEvidencePath);
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'deep-audit-import',
    status: stat.size > 0 && extraction.text.length > 500 && !extraction.usedFallback ? 'pass' : 'needs-attention',
    source: rel(source),
    pdfEvidencePath: rel(deepAuditPdfEvidencePath),
    textEvidencePath: rel(deepAuditTextEvidencePath),
    markdownEvidencePath: rel(deepAuditMarkdownEvidencePath),
    bytes: stat.size,
    extractedCharacters: extraction.text.length,
    usedFallbackExtraction: extraction.usedFallback,
    extractionAttempts: extraction.attempts.map((attempt) => ({
      command: attempt.command,
      status: attempt.status,
      stderr: attempt.stderr.slice(0, 500),
    })),
    findingCounts: deepAuditCounts(),
  };
  const paths = writePair(reportsDir, `serpforge-deep-audit-import-${stamp()}`, payload, [
    '# SERPForge Deep Audit Import',
    '',
    `Status: ${payload.status}`,
    `Source: ${payload.source}`,
    `PDF evidence: ${payload.pdfEvidencePath}`,
    `Text evidence: ${payload.textEvidencePath}`,
    `Markdown evidence: ${payload.markdownEvidencePath}`,
    `PDF bytes: ${payload.bytes}`,
    `Extracted characters: ${payload.extractedCharacters}`,
    `Fallback extraction used: ${payload.usedFallbackExtraction}`,
    '',
    '## Finding Counts',
    '',
    `- Total: ${payload.findingCounts.total}`,
    `- Confirmed: ${payload.findingCounts.byStatus.confirmed ?? 0}`,
    `- Already fixed: ${payload.findingCounts.byStatus['already-fixed'] ?? 0}`,
    `- Needs proof: ${payload.findingCounts.byStatus['needs-proof'] ?? 0}`,
    `- Rejected stale: ${payload.findingCounts.byStatus['rejected-stale'] ?? 0}`,
  ].join('\n'));
  console.log(`SERPForge deep audit import: ${payload.status}`);
  console.log(`- PDF evidence: ${payload.pdfEvidencePath}`);
  console.log(`- Text evidence: ${payload.textEvidencePath}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function deepAuditAgentsCommand() {
  ensureDirs();
  const taskBoardPath = writeDeepAuditBoard();
  const agents = deepAuditAgents.map((agent) => {
    const filePath = join(workspaceDir, 'agents', agent.file);
    return {
      ...agent,
      path: rel(filePath),
      exists: existsSync(filePath),
    };
  });
  const missingAgents = agents.filter((agent) => !agent.exists);
  const rows = deepAuditFindings.map((row) => ({
    ...row,
    agentFile: agents.find((agent) => agent.name === row.owner)?.path ?? '',
  }));
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'deep-audit-agents',
    status: missingAgents.length ? 'needs-attention' : 'pass',
    taskBoardPath,
    agents,
    missingAgents: missingAgents.map((agent) => agent.name),
    counts: deepAuditCounts(rows),
    rows,
  };
  const agentRows = agents
    .map((agent) => `| ${agent.exists ? 'present' : 'missing'} | ${agent.name} | ${agent.lane} | \`${agent.path}\` | ${agent.proof.join(', ')} |`)
    .join('\n');
  const paths = writePair(reportsDir, `serpforge-deep-audit-agents-${stamp()}`, payload, [
    '# SERPForge Deep Audit Agents',
    '',
    `Status: ${payload.status}`,
    `Task board: ${taskBoardPath}`,
    '',
    '## Agent Files',
    '',
    '| status | agent | lane | file | proof |',
    '| --- | --- | --- | --- | --- |',
    agentRows,
    '',
    '## Audit Finding Ledger',
    '',
    '| priority | status | owner | id | task | proof |',
    '| --- | --- | --- | --- | --- | --- |',
    deepAuditFindingTable(rows),
  ].join('\n'));
  console.log(`SERPForge deep audit agents: ${payload.status}`);
  console.log(`- Task board: ${taskBoardPath}`);
  console.log(`- Agents present: ${agents.length - missingAgents.length}/${agents.length}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (payload.status !== 'pass') process.exitCode = 1;
}

function liveHeaderProbe() {
  const probeScript = [
    'const urls = ["https://accessfreetools.com/","https://accessfreetools.com/tools","https://accessfreetools.com/tools/","https://accessfreetools.com/robots.txt","https://accessfreetools.com/sitemap.xml"];',
    '(async () => {',
    '  const rows = [];',
    '  for (const url of urls) {',
    '    try {',
    '      const response = await fetch(url, { method: "HEAD", redirect: "manual" });',
    '      rows.push({',
    '        url,',
    '        status: response.status,',
    '        location: response.headers.get("location") || "",',
    '        cacheControl: response.headers.get("cache-control") || "",',
    '        hsts: response.headers.get("strict-transport-security") || "",',
    '        contentType: response.headers.get("content-type") || "",',
    '        server: response.headers.get("server") || ""',
    '      });',
    '    } catch (error) {',
    '      rows.push({ url, error: String(error) });',
    '    }',
    '  }',
    '  console.log(JSON.stringify({ rows }, null, 2));',
    '})();',
  ].join('\n');
  return run(process.execPath, ['-e', probeScript], 'Live header and redirect probe', { timeoutMs: 90_000 });
}

function technicalHeaderPlanCommand() {
  ensureDirs();
  const probe = liveHeaderProbe();
  const parsed = parseJsonResult(probe) ?? {};
  const rowsByUrl = new Map((parsed.rows ?? []).map((row) => [row.url, row]));
  const home = rowsByUrl.get('https://accessfreetools.com/');
  const noSlash = rowsByUrl.get('https://accessfreetools.com/tools');
  const technicalRows = deepAuditRowsFor({ owner: 'Technical Headers Agent' }).map((row) => {
    let status = row.status;
    let liveProof = 'not probed';
    if (row.id === 'hsts-missing') {
      liveProof = home ? `home HSTS="${home.hsts || ''}"` : 'home header unavailable';
      status = home?.hsts ? 'already-fixed' : home ? 'confirmed' : 'needs-proof';
    }
    if (row.id === 'cache-max-age-zero') {
      liveProof = home ? `home cache-control="${home.cacheControl || ''}"` : 'home header unavailable';
      status = /max-age=0/i.test(home?.cacheControl ?? '') ? 'confirmed' : home ? 'needs-proof' : 'needs-proof';
    }
    if (row.id === 'trailing-slash-no-redirect') {
      liveProof = noSlash ? `/tools status=${noSlash.status} location="${noSlash.location || ''}"` : '/tools probe unavailable';
      status = noSlash?.status >= 300 && noSlash?.status < 400 ? 'already-fixed' : noSlash ? 'confirmed' : 'needs-proof';
    }
    return { ...row, status, liveProof };
  });
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'technical-header-plan',
    status: technicalRows.some((row) => row.status === 'confirmed' || row.status === 'needs-proof') ? 'ready' : 'pass',
    rows: technicalRows,
    liveProbe: probe,
    liveProbeRows: parsed.rows ?? [],
    requiredProof: ['npm run check', 'npm run check:production-sitemap', 'live HEAD probes after deploy'],
  };
  const paths = writePair(reportsDir, `serpforge-technical-header-plan-${stamp()}`, payload, [
    '# SERPForge Technical Header Plan',
    '',
    `Status: ${payload.status}`,
    '',
    '## Findings',
    '',
    '| priority | status | id | task | live proof | final proof |',
    '| --- | --- | --- | --- | --- | --- |',
    ...technicalRows.map((row) => `| ${row.priority} | ${row.status} | ${row.id} | ${row.task} | ${row.liveProof} | ${row.proof} |`),
    '',
    '## Required Proof',
    '',
    ...payload.requiredProof.map((item) => `- \`${item}\``),
    '',
    commandBlock(probe),
  ].join('\n'));
  console.log(`SERPForge technical header plan: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function headingMetadataPlanCommand() {
  const rows = deepAuditRowsFor({ owner: 'Metadata And Heading Agent' });
  const paths = writePair(reportsDir, `serpforge-heading-metadata-plan-${stamp()}`, {
    generatedAt: new Date().toISOString(),
    kind: 'heading-metadata-plan',
    status: 'ready',
    owner: 'Metadata And Heading Agent',
    rows,
    proofInputs: ['sitewide-seo-audit', 'all-pages-human-tone-report', 'page SEO workbench per edited slug'],
  }, deepAuditPlanMarkdown('SERPForge Heading And Metadata Plan', rows, [
    '## Smart 14 Voice Rules',
    '',
    '- Titles must say what the page does, not what an SEO agent wants to rank for.',
    '- Meta descriptions should sound like a helpful teen explaining the page fast: task, result, limit.',
    '- Fix blog listing heading depth only after verifying built HTML heading counts.',
  ]));
  console.log('SERPForge heading metadata plan: ready');
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function contentDepthPlanCommand() {
  const rows = deepAuditRowsFor({ owner: 'Content Depth Agent' });
  const paths = writePair(reportsDir, `serpforge-content-depth-plan-${stamp()}`, {
    generatedAt: new Date().toISOString(),
    kind: 'content-depth-plan',
    status: 'ready',
    owner: 'Content Depth Agent',
    rows,
    priorityTargets: ['hubs', 'about', 'password-generator', 'GSC pages with impressions and weak clicks'],
  }, deepAuditPlanMarkdown('SERPForge Content Depth Plan', rows, [
    '## Depth Standard',
    '',
    '- Add examples, mistakes, formulas, source notes, and result interpretation only where they help a real reader.',
    '- Use DataForSEO and GSC proof to decide which pages are worth expanding first.',
    '- Keep public copy plain: no agent, SEO, ranking, or internal task-board wording.',
  ]));
  console.log('SERPForge content depth plan: ready');
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function eeatAuthorPlanCommand() {
  const rows = deepAuditRowsFor({ owner: 'E-E-A-T Trust Agent' });
  const paths = writePair(reportsDir, `serpforge-eeat-author-plan-${stamp()}`, {
    generatedAt: new Date().toISOString(),
    kind: 'eeat-author-plan',
    status: 'ready',
    owner: 'E-E-A-T Trust Agent',
    rows,
    sensitiveGroups: ['finance', 'health', 'tax', 'electrical', 'construction', 'AI', 'pregnancy', 'BAC', 'password/security'],
  }, deepAuditPlanMarkdown('SERPForge E-E-A-T Author And Trust Plan', rows, [
    '## Trust Block Requirements',
    '',
    '- Reviewer or editorial note for sensitive tools.',
    '- Last reviewed date and what changed.',
    '- Formula/source citation when a page depends on an official method.',
    '- Honest warning when the tool is not medical, legal, tax, financial, or safety advice.',
    '- Person/Organization schema only when visible page facts support it.',
  ]));
  console.log('SERPForge E-E-A-T author plan: ready');
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function authorityPlanCommand() {
  const rows = deepAuditRowsFor({ lane: 'authority' });
  const results = [
    runNpmScript('Marketing orchestrator', 'marketing:orchestrate'),
    runAft('Recognition', ['recognition']),
  ];
  const status = results.every((result) => result.status === 0) ? 'ready' : 'needs-proof';
  const paths = writePair(reportsDir, `serpforge-authority-plan-${stamp()}`, {
    generatedAt: new Date().toISOString(),
    kind: 'authority-plan',
    status,
    owner: 'Authority And Outreach Agent',
    rows,
    noSubmitRule: 'Draft only. No submissions, messages, backlinks, or live claims without approval and public proof.',
    results,
  }, deepAuditPlanMarkdown('SERPForge Authority And Outreach Plan', rows, [
    '## Outreach Rules',
    '',
    '- Prepare Product Hunt, AlternativeTo, directory, roundup, education/resource, and broken-link targets as drafts.',
    '- Use DataForSEO/SERP research to understand fit, not to scrape or spam.',
    '- Never claim a backlink or placement until the public URL proves it.',
    '',
    ...results.map(commandBlock),
  ]));
  console.log(`SERPForge authority plan: ${status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function socialDiscoveryPlanCommand() {
  const rows = deepAuditRowsFor({ lane: 'promotion' });
  const results = [
    runNpmScript('Marketing orchestrator', 'marketing:orchestrate'),
    runAft('Promotion proof check', ['proof-check']),
  ];
  const status = results.every((result) => result.status === 0) ? 'ready' : 'needs-proof';
  const paths = writePair(reportsDir, `serpforge-social-discovery-plan-${stamp()}`, {
    generatedAt: new Date().toISOString(),
    kind: 'social-discovery-plan',
    status,
    owner: 'Social Discovery Agent',
    rows,
    channels: ['Pinterest', 'Reddit', 'Bluesky/X', 'Quora', 'Medium', 'DEV'],
    noPostRule: 'Draft and report only. No posting, messages, account writes, or live claims without approval and public proof.',
    results,
  }, deepAuditPlanMarkdown('SERPForge Social Discovery Plan', rows, [
    '## Channel Rules',
    '',
    '- Use each platform quality gate before a draft is considered ready.',
    '- Keep posts useful first: answer a real question and disclose ownership when linking.',
    '- Never mark posted or updated from an editor or submit button alone.',
    '',
    ...results.map(commandBlock),
  ]));
  console.log(`SERPForge social discovery plan: ${status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function auditImportCommand() {
  ensureDirs();
  const source = existsSync(auditDownloadPath) ? auditDownloadPath : auditEvidencePath;
  if (!existsSync(source)) {
    throw new Error(`Audit report not found at ${auditDownloadPath} or ${auditEvidencePath}.`);
  }
  if (source !== auditEvidencePath) {
    copyFileSync(source, auditEvidencePath);
  }
  const stat = statSync(auditEvidencePath);
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'audit-import',
    status: 'pass',
    source: rel(source),
    evidencePath: rel(auditEvidencePath),
    bytes: stat.size,
  };
  const paths = writePair(reportsDir, `serpforge-audit-import-${stamp()}`, payload, [
    '# SERPForge Audit Import',
    '',
    `Status: ${payload.status}`,
    `Source: ${payload.source}`,
    `Evidence: ${payload.evidencePath}`,
    `Bytes: ${payload.bytes}`,
  ].join('\n'));
  console.log('SERPForge audit import: pass');
  console.log(`- Evidence: ${payload.evidencePath}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function auditTasksCommand() {
  ensureDirs();
  const taskBoard = readTextIfExists(join(tasksDir, 'audit-task-board.md'));
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'audit-tasks',
    status: taskBoard ? 'pass' : 'needs-attention',
    taskBoardPath: rel(join(tasksDir, 'audit-task-board.md')),
    lanes: ['template-risk', 'crawl-stability', 'metadata', 'schema', 'eeat', 'hubs', 'internal-links', 'dataforseo', 'gallery-seo', 'sitemap-submission', 'alt-seo'],
  };
  const paths = writePair(reportsDir, `serpforge-audit-tasks-${stamp()}`, payload, [
    '# SERPForge Audit Tasks',
    '',
    `Status: ${payload.status}`,
    `Task board: ${payload.taskBoardPath}`,
    '',
    '## Lanes',
    '',
    ...payload.lanes.map((lane) => `- ${lane}`),
  ].join('\n'));
  console.log(`SERPForge audit tasks: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (payload.status !== 'pass') process.exitCode = 1;
}

function templateQaCommand() {
  const files = walk(join(root, 'src'), (file) => /\.(astro|ts|tsx|md|json)$/.test(file));
  const patterns = [
    { id: 'tools-tools', regex: /tools tools/i },
    { id: 'examples-from-the-calculator', regex: /Examples from the calculator/i },
    { id: 'choose-look-fresh', regex: /Choose look Fresh/i },
    { id: 'read-the-main-answer-first', regex: /Read the main answer first/i },
    { id: 'check-units-signs-decimals-mode', regex: /Check the units, signs, decimal places, and mode/i },
  ];
  const findings = [];

  for (const file of files) {
    const text = readTextIfExists(file);
    for (const pattern of patterns) {
      if (pattern.regex.test(text)) {
        findings.push({ file: rel(file), pattern: pattern.id });
      }
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'template-qa',
    status: findings.length ? 'needs-attention' : 'pass',
    findings,
  };
  const paths = writePair(reportsDir, `serpforge-template-qa-${stamp()}`, payload, [
    '# SERPForge Template QA',
    '',
    `Status: ${payload.status}`,
    `Findings: ${findings.length}`,
    '',
    ...(findings.length ? ['## Findings', '', ...findings.map((item) => `- ${item.pattern}: \`${item.file}\``)] : ['No audit template-copy patterns found in source files.']),
  ].join('\n'));
  console.log(`SERPForge template QA: ${payload.status}`);
  console.log(`- Findings: ${findings.length}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function metadataPlanCommand() {
  createPlanReport('metadata-plan', 'SERPForge Category Metadata Plan', [
    '## Rewrite Targets',
    '',
    '- Finance: Free Finance Calculators: Mortgage, Loan, Tax & Savings Tools',
    '- Converters: Free Unit & Conversion Calculators: Length, Mass, Temperature & More',
    '- Health & Fitness: Free Health & Fitness Calculators: BMI, Calories, BMR & Pregnancy',
    '- Developer Tools: Free Developer Tools: JSON, Base64, Subnet, UTM & Password Utilities',
    '- AI Tools: Free Browser AI Tools: OCR, Summarizer, Token Estimator & More',
    '- Home & Projects: Free Home Project Calculators: Paint, Concrete, Tile, Roofing & More',
    '',
    '## Proof',
    '',
    '- Run page-specific scores before making public edits.',
    '- Run `npm run check:structured-data` after metadata/template edits.',
  ], { owner: 'Category Metadata Agent' });
}

function schemaPlanCommand() {
  createPlanReport('schema-plan', 'SERPForge Schema Systems Plan', [
    '## Page Type Coverage',
    '',
    '- Homepage: `WebSite` and `Organization`.',
    '- Category pages: `CollectionPage`, `BreadcrumbList`.',
    '- Tool pages: `WebApplication` or `SoftwareApplication`, `BreadcrumbList`.',
    '- Guide pages: `Article` or `TechArticle`, `BreadcrumbList`.',
    '- About page: `Organization`, `AboutPage`.',
    '- Contact page: `ContactPage`, `Organization`.',
    '- Gallery pages: `CollectionPage`, `BreadcrumbList` with visible gallery content.',
    '',
    '## Proof',
    '',
    '- `npm run check:structured-data`',
  ], { owner: 'Schema Systems Agent' });
}

function eeatPlanCommand() {
  createPlanReport('eeat-plan', 'SERPForge EEAT Trust Plan', [
    '## Sensitive Areas',
    '',
    '- Health, fitness, pregnancy, BAC, finance, tax, electrical, construction, AI, and password/security tools.',
    '',
    '## Trust Block Requirements',
    '',
    '- Editorial owner or reviewer note.',
    '- Last reviewed date and what changed.',
    '- Formula source or official reference when available.',
    '- Assumptions and limitations.',
    '- Clear escalation advice for medical, tax, legal, financial, safety, or construction decisions.',
  ], { owner: 'EEAT Trust Agent' });
}

function hubPlanCommand() {
  createPlanReport('hub-plan', 'SERPForge Topical Hub Plan', [
    '## Hubs',
    '',
    '- Mortgage & Home Loan Calculators.',
    '- Percentage & Ratio Calculators.',
    '- Home Material Calculators.',
    '- Browser AI Tools.',
    '- Developer Utility Tools.',
    '',
    '## Each Hub Needs',
    '',
    '- Intent-led intro.',
    '- Tool-by-task comparison.',
    '- Links to tools and matching guides.',
    '- Useful FAQs only when they answer real hub questions.',
    '- Source or review notes for sensitive topics.',
  ], { owner: 'Topical Hub Agent' });
}

function crawlPlanCommand() {
  const results = [
    runAft('Indexing gaps', ['indexing-gaps']),
    runAft('Indexing protection', ['indexing-protection']),
    runAft('Site sitemap', ['site-sitemap']),
  ];
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'crawl-plan',
    status: reportStatus(results),
    results: results.map((result) => ({ ...result, parsedJson: parseJsonResult(result) })),
    tasks: ['Investigate 429 HTML responses', 'Verify static crawl paths for all tools', 'Validate sitemap index', 'Check robots/canonicals', 'Separate public HTML pages from expensive API/tool actions'],
  };
  const paths = writePair(reportsDir, `serpforge-crawl-plan-${stamp()}`, payload, [
    '# SERPForge Crawl Stability Plan',
    '',
    `Status: ${payload.status}`,
    '',
    '## Tasks',
    '',
    ...payload.tasks.map((task) => `- ${task}`),
    '',
    ...results.map(commandBlock),
  ].join('\n\n'));
  console.log(`SERPForge crawl plan: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function gallerySeoPlanCommand() {
  const entries = extractToolArtEntries();
  const approved = entries.filter((entry) => entry.status === 'approved');
  createPlanReport('gallery-seo-plan', 'SERPForge Gallery SEO Plan', [
    '## Strategy',
    '',
    '- Gallery SEO is deliberate and indexable for approved assets.',
    '- Queued, draft, rejected, placeholder, or failed-QA art remains hidden.',
    '- Gallery cards must link back to matching tool or guide pages.',
    '- Gallery pages should explain category context and image purpose.',
    '',
    '## Current Manifest Snapshot',
    '',
    `- Manifest entries: ${entries.length}`,
    `- Approved entries: ${approved.length}`,
    '',
    '## Proof',
    '',
    '- `npm run images:qa`',
    '- `npm run images:sitemap-check`',
    '- `npm run gallery:qa`',
  ], { owner: 'Gallery SEO Agent', manifestEntries: entries.length, approvedEntries: approved.length });
}

function imageAltAuditCommand() {
  const entries = extractToolArtEntries().filter((entry) => entry.status === 'approved');
  const findings = entries
    .map((entry) => ({ entry, issues: toolArtAltIssues(entry) }))
    .filter((item) => item.issues.length > 0);
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'image-alt-audit',
    status: findings.length ? 'needs-attention' : 'pass',
    totals: { approvedEntries: entries.length, findings: findings.length },
    findings: findings.map(({ entry, issues }) => ({
      slug: entry.slug,
      kind: entry.kind,
      toolName: entry.toolName,
      issues,
      currentAlt: entry.alt,
      currentCaption: entry.caption,
    })),
  };
  const paths = writePair(reportsDir, `serpforge-image-alt-audit-${stamp()}`, payload, [
    '# SERPForge Image Alt SEO Audit',
    '',
    `Status: ${payload.status}`,
    `Approved entries checked: ${entries.length}`,
    `Findings: ${findings.length}`,
    '',
    ...(findings.length
      ? ['## Findings', '', ...findings.slice(0, 80).map(({ entry, issues }) => `- ${entry.slug} ${entry.kind}: ${issues.join(', ')}`)]
      : ['No weak approved alt/caption metadata found.']),
  ].join('\n'));
  console.log(`SERPForge image alt audit: ${payload.status}`);
  console.log(`- Findings: ${findings.length}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function imageAltPlanCommand() {
  const entries = extractToolArtEntries().filter((entry) => entry.status === 'approved');
  const recommendations = entries
    .map((entry) => ({ entry, issues: toolArtAltIssues(entry) }))
    .filter((item) => item.issues.length > 0)
    .map(({ entry, issues }) => ({
      slug: entry.slug,
      kind: entry.kind,
      toolName: entry.toolName,
      issues,
      recommendedAlt: improvedAlt(entry),
      recommendedCaption: improvedCaption(entry),
    }));
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'image-alt-plan',
    status: recommendations.length ? 'ready' : 'pass',
    recommendations,
  };
  const paths = writePair(reportsDir, `serpforge-image-alt-plan-${stamp()}`, payload, [
    '# SERPForge Image Alt SEO Plan',
    '',
    `Status: ${payload.status}`,
    `Recommendations: ${recommendations.length}`,
    '',
    ...(recommendations.length
      ? ['## Recommended Metadata', '', ...recommendations.slice(0, 80).map((item) => `- ${item.slug} ${item.kind}: alt="${item.recommendedAlt}" caption="${item.recommendedCaption}"`)]
      : ['No approved image metadata recommendations are needed right now.']),
  ].join('\n'));
  console.log(`SERPForge image alt plan: ${payload.status}`);
  console.log(`- Recommendations: ${recommendations.length}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function imageSitemapPlanCommand() {
  const results = [
    runNpmScript('Image sitemap check', 'images:sitemap-check'),
    runNpmScript('Gallery QA', 'gallery:qa'),
  ];
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'image-sitemap-plan',
    status: reportStatus(results),
    sitemaps: sitemapUrls.filter((url) => /gallery|images/.test(url)),
    results,
  };
  const paths = writePair(reportsDir, `serpforge-image-sitemap-plan-${stamp()}`, payload, [
    '# SERPForge Image Sitemap Plan',
    '',
    `Status: ${payload.status}`,
    '',
    '## Sitemaps',
    '',
    ...payload.sitemaps.map((url) => `- ${url}`),
    '',
    ...results.map(commandBlock),
  ].join('\n\n'));
  console.log(`SERPForge image sitemap plan: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function htmlSitemapPlanCommand() {
  const results = [runAft('Site sitemap', ['site-sitemap'])];
  const sitemapSource = readTextIfExists(join(root, 'src', 'pages', 'sitemap.astro'));
  const requiredSections = ['Public pages', 'Smoke-kawaii gallery', 'Category hubs', 'Guides'];
  const missingSections = requiredSections.filter((section) => !sitemapSource.includes(section));
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'html-sitemap-plan',
    status: missingSections.length ? 'needs-attention' : reportStatus(results),
    missingSections,
    results: results.map((result) => ({ ...result, parsedJson: parseJsonResult(result) })),
  };
  const paths = writePair(reportsDir, `serpforge-html-sitemap-plan-${stamp()}`, payload, [
    '# SERPForge HTML Sitemap Plan',
    '',
    `Status: ${payload.status}`,
    '',
    '## Required Sections',
    '',
    ...requiredSections.map((section) => `- ${section}${missingSections.includes(section) ? ' (missing)' : ''}`),
    '',
    '- Future topical hubs should be added after hub pages exist.',
    '',
    ...results.map(commandBlock),
  ].join('\n\n'));
  console.log(`SERPForge HTML sitemap plan: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function dataForSeoPlanCommand() {
  const results = [
    runNpmScript('DataForSEO account', 'dataforseo:account', ['--', '--min-balance=2', '--warn-balance=10']),
    runNpmScript('DataForSEO status', 'dataforseo:status'),
  ];
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'dataforseo-plan',
    status: reportStatus(results),
    targets: [
      'Use Labs related keywords for one exact page topic.',
      'Use SERP competitor checks only for selected priority terms.',
      'Use stop_crawl_on_match when checking Access Free Tools rankings.',
      'Do not use Backlinks API.',
    ],
    results,
  };
  const paths = writePair(reportsDir, `serpforge-dataforseo-plan-${stamp()}`, payload, [
    '# SERPForge DataForSEO Plan',
    '',
    `Status: ${payload.status}`,
    '',
    '## Paid Research Rules',
    '',
    ...payload.targets.map((target) => `- ${target}`),
    '',
    ...results.map(commandBlock),
  ].join('\n\n'));
  console.log(`SERPForge DataForSEO plan: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (payload.status !== 'pass') process.exitCode = 1;
}

function keywordFromUrl(url) {
  const classification = classifyUrl(url);
  if (classification.type === 'home') return 'free online tools';
  if (classification.type === 'category') return `${classification.slug.replace(/-/g, ' ')} tools`;
  if (classification.type === 'gallery') return `${classification.slug.replace(/-/g, ' ')} tool images`;
  if (classification.page === 'blog') return `how to use ${classification.slug.replace(/-/g, ' ')}`;
  if (classification.page === 'tool') return classification.slug.replace(/-/g, ' ');
  return classification.slug.replace(/-/g, ' ') || 'access free tools';
}

function dataForSeoSitewideTargets() {
  return sitemapUrlsFromBuiltFiles().map((url) => {
    const classification = classifyUrl(url);
    const keyword = keywordFromUrl(url);
    const tier =
      classification.type === 'home' ||
      classification.type === 'category' ||
      /mortgage|loan|tax|bmi|calorie|concrete|wallpaper|percentage|ocr|token|password/i.test(keyword)
        ? 'A'
        : classification.page === 'tool'
          ? 'B'
          : 'C';
    return {
      url,
      type: classification.type,
      slug: classification.slug,
      page: classification.page || classification.type,
      keyword,
      tier,
      dataForSeoUse:
        'Covered by the sitewide OnPage crawl. Use Labs/SERP only for this page if it becomes a focused sprint target.',
      serpDepth: tier === 'A' ? 50 : tier === 'B' ? 20 : 10,
      stopCrawlOnMatch: true,
    };
  });
}

function dataForSeoSitewideAuditCommand(options = {}) {
  ensureDirs();
  const generatedAt = new Date().toISOString();
  const noWait = Boolean(options.noWait || options.wait === false || process.env.npm_config_wait === 'false' || process.env.npm_config_no_wait === 'true');
  const skipWaterfall = Boolean(options.skipWaterfall || process.env.npm_config_skip_waterfall === 'true');
  const reuseLatest = Boolean(options.reuseLatest || process.env.npm_config_reuse_latest === 'true');
  const targets = dataForSeoSitewideTargets();
  const gates = [
    runNpmScript('DataForSEO account', 'dataforseo:account', ['--', '--min-balance=2', '--warn-balance=10']),
    runNpmScript('DataForSEO status', 'dataforseo:status'),
  ];
  const gateReports = {
    account: readJsonFile(join(root, 'output', 'dataforseo-account.json')),
    status: readJsonFile(join(root, 'output', 'dataforseo-status.json')),
  };
  const gateStatus = reportStatus(gates);
  const reusableEvidence = reuseLatest ? latestCompletedOnPageEvidence() : null;
  const outputDir = reusableEvidence?.outputDir ?? join(reportsDir, `dataforseo-sitewide-onpage-${stamp()}`);
  const onPageArgs = [
    'scripts/seo-onpage-audit.mjs',
    '--target=https://accessfreetools.com/',
    '--max-crawl-pages=1000',
    `--output-dir=${outputDir}`,
    '--min-balance=2',
    '--warn-balance=10',
  ];

  if (noWait) onPageArgs.push('--no-wait');
  if (skipWaterfall) onPageArgs.push('--skip-waterfall');

  const onPageResult =
    gateStatus === 'pass' && reusableEvidence
      ? {
          label: 'DataForSEO OnPage sitewide crawl',
          command: 'reuse latest completed DataForSEO OnPage evidence',
          status: 0,
          stdout: `Reused completed DataForSEO OnPage evidence from ${rel(reusableEvidence.summaryPath)}.`,
          stderr: '',
        }
      : gateStatus === 'pass'
      ? run(process.execPath, onPageArgs, 'DataForSEO OnPage sitewide crawl', {
          timeoutMs: noWait ? 180_000 : 3_900_000,
        })
      : {
          label: 'DataForSEO OnPage sitewide crawl',
          command: `${process.execPath} ${onPageArgs.join(' ')}`,
          status: 1,
          stdout: '',
          stderr: 'Skipped because DataForSEO account/status gates did not pass.',
        };

  const onPageSummary = readJsonFile(join(outputDir, 'summary.json'));
  const status = gateStatus === 'pass' && onPageResult.status === 0 ? 'pass' : 'needs-attention';
  const payload = {
    generatedAt,
    kind: 'dataforseo-sitewide-audit',
    status,
    scope: {
      target: 'https://accessfreetools.com/',
      maxCrawlPages: 1000,
      publicPageTargets: targets.length,
      noWait,
      skipWaterfall,
      reuseLatest,
      reusedOnPageEvidence: reusableEvidence ? rel(reusableEvidence.summaryPath) : null,
    },
    rules: [
      'This command uses DataForSEO OnPage for sitewide page evidence instead of one paid SERP call per URL.',
      'Account and status gates must pass before any paid crawl starts.',
      'SERP/Labs checks remain targeted with tiered depth and stop_crawl_on_match.',
      'Backlinks API is not used.',
    ],
    targets,
    gates,
    gateReports,
    onPageResult,
    onPageSummary,
  };
  const targetRows = targets
    .slice(0, 80)
    .map((target) => `| ${target.tier} | ${target.page} | ${target.url} | ${target.keyword} | ${target.serpDepth} |`)
    .join('\n');
  const paths = writePair(reportsDir, `serpforge-dataforseo-sitewide-audit-${stamp()}`, payload, [
    '# SERPForge DataForSEO Sitewide Audit',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status}`,
    `Public page targets: ${targets.length}`,
    `OnPage output: ${rel(outputDir)}`,
    '',
    '## DataForSEO Gates',
    '',
    gateReports.account?.publicIp || gateReports.status?.publicIp
      ? `- Current public IP: ${gateReports.account?.publicIp || gateReports.status?.publicIp}`
      : '- Current public IP: not captured',
    '',
    ...gates.map(commandBlock),
    '',
    '## Paid Sitewide OnPage Crawl',
    '',
    commandBlock(onPageResult),
    '',
    onPageSummary
      ? `## OnPage Summary\n\n- Pages crawled: ${onPageSummary.pagesCrawled ?? 'n/a'}\n- Broken pages: ${onPageSummary.counts?.brokenPages ?? 'n/a'}\n- Broken links: ${onPageSummary.counts?.brokenLinks ?? 'n/a'}\n- Low-score pages: ${onPageSummary.counts?.lowScorePages ?? 'n/a'}`
      : '## OnPage Summary\n\n- Not available because the paid crawl did not complete.',
    '',
    '## Page Target Sample',
    '',
    '| tier | page | url | keyword | SERP depth if sprinted |',
    '| --- | --- | --- | --- | ---: |',
    targetRows,
  ].join('\n\n'));
  console.log(`SERPForge DataForSEO sitewide audit: ${status}`);
  console.log(`- Page targets: ${targets.length}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (status !== 'pass') process.exitCode = 1;
}

async function allPagesDataForSeoCommand() {
  ensureDirs();
  const generatedAt = new Date().toISOString();
  const targets = dataForSeoSitewideTargets();
  const gates = [
    runNpmScript('DataForSEO account', 'dataforseo:account', ['--', '--min-balance=2', '--warn-balance=10']),
    runNpmScript('DataForSEO status', 'dataforseo:status'),
  ];
  const gateStatus = reportStatus(gates);
  const latestOnPage = latestCompletedOnPageEvidence();
  const onPageEvidence = latestOnPageItems(latestOnPage);
  const onPageByUrl = new Map(onPageEvidence.items.map((item) => [normalizeEvidenceUrl(item.url), item]));
  const sitewide = latestSitewideRows();
  const localByUrl = new Map(sitewide.rows.map((row) => [normalizeEvidenceUrl(row.url), row]));
  const uniqueKeywords = [...new Set(targets.map((target) => target.keyword).filter(Boolean))];
  const intentResponses = [];
  let intentError = '';

  if (gateStatus === 'pass') {
    for (const [index, keywordChunk] of chunks(uniqueKeywords, 1000).entries()) {
      try {
        intentResponses.push(
          await dataForSeoRequest('/dataforseo_labs/google/search_intent/live', {
            keywords: keywordChunk,
            language_code: 'en',
            tag: `serpforge-all-pages-intent-${generatedAt.replace(/[:.]/g, '-')}-${index + 1}`,
          }),
        );
      } catch (error) {
        intentError = error instanceof Error ? error.message : String(error);
        break;
      }
    }
  }

  const intentItems = intentResponses.flatMap((response) =>
    response.tasks?.flatMap((task) => task.result?.flatMap((result) => result.items ?? []) ?? []) ?? [],
  );
  const intentByKeyword = new Map(intentItems.map((item) => [String(item.keyword).toLowerCase(), item]));
  const rows = targets.map((target) => {
    const normalizedUrl = normalizeEvidenceUrl(target.url);
    const local = localByUrl.get(normalizedUrl);
    const onPage = onPageByUrl.get(normalizedUrl);
    const built = builtHtmlForUrl(target.url);
    const genericAudit = genericContentAudit(target, built);
    const intent = intentByKeyword.get(String(target.keyword).toLowerCase());
    const intentLabel = intent?.keyword_intent?.label ?? null;
    const intentProbability = intent?.keyword_intent?.probability ?? null;
    const liveOnPageChecks = onPage?.checks ?? {};
    const strictNeedsOnPage = ['tool', 'blog'].includes(target.page);
    const liveIssues = [
      liveOnPageChecks.is_broken ? 'broken page' : '',
      liveOnPageChecks.is_4xx_code ? '4xx status' : '',
      liveOnPageChecks.is_5xx_code ? '5xx status' : '',
      liveOnPageChecks.no_title ? 'missing title' : '',
      liveOnPageChecks.no_description ? 'missing description' : '',
      liveOnPageChecks.no_h1_tag ? 'missing h1' : '',
      liveOnPageChecks.no_image_alt ? 'image missing alt' : '',
      liveOnPageChecks.has_micromarkup_errors ? 'schema errors' : '',
      liveOnPageChecks.canonical === false ? 'canonical issue' : '',
    ].filter(Boolean);

    return {
      url: target.url,
      type: target.type,
      page: target.page,
      slug: target.slug,
      tier: target.tier,
      keyword: target.keyword,
      localSeoStatus: local?.status ?? 'missing-local-row',
      localSeoScore: local?.score ?? null,
      localBuiltHtml: local?.builtHtml ?? null,
      genericContentStatus: genericAudit.status,
      genericContentIssues: genericAudit.issues,
      genericContentWarnings: genericAudit.warnings,
      genericMatchedPhrases: genericAudit.matchedGenericPhrases,
      genericRequiredTerms: genericAudit.requiredTerms,
      genericCoveredTerms: genericAudit.coveredTerms,
      dataForSeoSearchIntentStatus: intent ? 'covered' : 'missing',
      dataForSeoSearchIntent: intent?.keyword_intent ?? null,
      dataForSeoSearchIntentLabel: intentLabel,
      dataForSeoSearchIntentProbability: intentProbability,
      dataForSeoSecondaryIntents: intent?.secondary_keyword_intents ?? null,
      dataForSeoOnPageStatus: onPage ? 'covered' : 'not-in-latest-live-onpage-crawl',
      dataForSeoOnPageScore: onPage?.onpage_score ?? null,
      dataForSeoOnPageHttpStatus: onPage?.status_code ?? null,
      dataForSeoOnPageCanonical: onPage?.meta?.canonical ?? null,
      dataForSeoOnPageTitle: onPage?.meta?.title ?? null,
      dataForSeoOnPageIssues: liveIssues,
      complete:
        local?.status === 'pass' &&
        genericAudit.status === 'pass' &&
        Boolean(intent) &&
        (!strictNeedsOnPage || Boolean(onPage)) &&
        liveIssues.length === 0,
      completionNote: onPage
        ? 'Local SEO pass plus DataForSEO Search Intent and live OnPage evidence.'
        : strictNeedsOnPage
          ? 'Blocked: tool/blog pages require DataForSEO live OnPage evidence for this exact URL.'
          : 'Local SEO pass plus DataForSEO Search Intent evidence; live OnPage crawl did not include this URL, usually because the page is local-only until deployment or is not an HTML crawl target.',
    };
  });

  const counts = rows.reduce(
    (summary, row) => {
      summary.total += 1;
      summary.localPass += row.localSeoStatus === 'pass' ? 1 : 0;
      summary.genericPass += row.genericContentStatus === 'pass' ? 1 : 0;
      summary.genericAttention += row.genericContentStatus === 'attention' ? 1 : 0;
      summary.genericFail += row.genericContentStatus === 'fail' ? 1 : 0;
      summary.intentCovered += row.dataForSeoSearchIntentStatus === 'covered' ? 1 : 0;
      const intentLabel = row.dataForSeoSearchIntentLabel ?? 'missing';
      summary.intentLabels[intentLabel] = (summary.intentLabels[intentLabel] ?? 0) + 1;
      if (typeof row.dataForSeoSearchIntentProbability === 'number' && row.dataForSeoSearchIntentProbability < 0.6) summary.weakIntentConfidence += 1;
      summary.onPageCovered += row.dataForSeoOnPageStatus === 'covered' ? 1 : 0;
      summary.toolBlogOnPageCovered += ['tool', 'blog'].includes(row.page) && row.dataForSeoOnPageStatus === 'covered' ? 1 : 0;
      summary.toolBlogOnPageRequired += ['tool', 'blog'].includes(row.page) ? 1 : 0;
      summary.complete += row.complete ? 1 : 0;
      summary.liveOnPageIssues += row.dataForSeoOnPageIssues.length ? 1 : 0;
      summary.byPage[row.page] = (summary.byPage[row.page] ?? 0) + 1;
      summary.byTier[row.tier] = (summary.byTier[row.tier] ?? 0) + 1;
      return summary;
    },
    {
      total: 0,
      localPass: 0,
      genericPass: 0,
      genericAttention: 0,
      genericFail: 0,
      intentCovered: 0,
      intentLabels: {},
      weakIntentConfidence: 0,
      onPageCovered: 0,
      toolBlogOnPageCovered: 0,
      toolBlogOnPageRequired: 0,
      complete: 0,
      liveOnPageIssues: 0,
      byPage: {},
      byTier: {},
    },
  );
  const missingRows = rows.filter(
    (row) =>
      row.localSeoStatus !== 'pass' ||
      row.genericContentStatus !== 'pass' ||
      row.dataForSeoSearchIntentStatus !== 'covered' ||
      (['tool', 'blog'].includes(row.page) && row.dataForSeoOnPageStatus !== 'covered') ||
      row.dataForSeoOnPageIssues.length > 0,
  );
  const localOnlyRows = rows.filter((row) => row.dataForSeoOnPageStatus !== 'covered');
  const status =
    gateStatus === 'pass' &&
    intentResponses.length > 0 &&
    counts.localPass === counts.total &&
    counts.genericPass === counts.total &&
    counts.intentCovered === counts.total &&
    counts.toolBlogOnPageCovered === counts.toolBlogOnPageRequired &&
    counts.liveOnPageIssues === 0
      ? 'pass'
      : 'needs-attention';
  const payload = {
    generatedAt,
    kind: 'all-pages-dataforseo',
    status,
    gates,
    sources: {
      sitewideSeoReport: sitewide.path ? rel(sitewide.path) : null,
      onPageEvidenceDir: latestOnPage?.outputDir ? rel(latestOnPage.outputDir) : null,
      onPagePagesRaw: onPageEvidence.path ? rel(onPageEvidence.path) : null,
      onPageSupplementalPagesRaw: onPageEvidence.supplementalPaths.map((itemPath) => rel(itemPath)),
      dataForSeoSearchIntentEndpoint: '/dataforseo_labs/google/search_intent/live',
    },
    counts,
    rules: [
      'Every target receives DataForSEO Labs Search Intent evidence in one bulk paid request.',
      'Every target receives a page-specific generic-content guard based on Google people-first, title/snippet, and image-alt guidance.',
      'Latest completed DataForSEO OnPage crawl is attached when the live crawler saw that exact URL.',
      'Supplemental one-page DataForSEO OnPage crawls are merged when the broad crawl misses a public URL.',
      'Backlinks API is not used.',
      'Rows without live OnPage coverage are not called live-fixed; they require deployment and a fresh crawl if they are local-only pages.',
    ],
    intentApiCalls: intentResponses.length,
    intentCost: intentResponses.reduce((total, response) => total + Number(response.cost ?? 0), 0),
    intentTaskCost: intentResponses.reduce(
      (total, response) => total + Number(response.tasks?.reduce((taskTotal, task) => taskTotal + Number(task.cost ?? 0), 0) ?? 0),
      0,
    ),
    intentError,
    rows,
  };
  const sampleRows = rows
    .slice(0, 80)
    .map(
      (row) =>
        `| ${row.localSeoStatus} | ${row.genericContentStatus} | ${row.dataForSeoSearchIntentStatus} | ${row.dataForSeoSearchIntentLabel ?? 'missing'} | ${row.dataForSeoOnPageStatus} | ${row.page} | ${row.url} | ${row.keyword} |`,
    )
    .join('\n');
  const missingSample = missingRows
    .slice(0, 40)
    .map(
      (row) =>
        `- ${row.url}: local=${row.localSeoStatus}; generic=${row.genericContentStatus}; intent=${row.dataForSeoSearchIntentStatus}; liveOnPage=${row.dataForSeoOnPageStatus}; issues=${[
          ...row.genericContentIssues,
          ...row.dataForSeoOnPageIssues,
        ].join(', ') || 'none'}`,
    )
    .join('\n');
  const localOnlySample = localOnlyRows
    .slice(0, 30)
    .map((row) => `- ${row.url}`)
    .join('\n');
  const paths = writePair(reportsDir, `serpforge-all-pages-dataforseo-${stamp()}`, payload, [
    '# SERPForge All-Pages DataForSEO Ledger',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status}`,
    '',
    '## Counts',
    '',
    `- Public page targets: ${counts.total}`,
    `- Local SEO pass: ${counts.localPass}`,
    `- Generic-content guard pass: ${counts.genericPass}`,
    `- Generic-content attention: ${counts.genericAttention}`,
    `- Generic-content fail: ${counts.genericFail}`,
    `- DataForSEO Search Intent covered: ${counts.intentCovered}`,
    `- DataForSEO weak intent confidence: ${counts.weakIntentConfidence}`,
    `- DataForSEO live OnPage covered: ${counts.onPageCovered}`,
    `- Tool/blog DataForSEO live OnPage covered: ${counts.toolBlogOnPageCovered}/${counts.toolBlogOnPageRequired}`,
    `- Rows with live OnPage issues: ${counts.liveOnPageIssues}`,
    `- Complete by local + DataForSEO evidence gate: ${counts.complete}`,
    '',
    '## Evidence Sources',
    '',
    `- Sitewide SEO: ${payload.sources.sitewideSeoReport ?? 'missing'}`,
    `- DataForSEO OnPage: ${payload.sources.onPageEvidenceDir ?? 'missing'}`,
    `- DataForSEO supplemental OnPage pages: ${payload.sources.onPageSupplementalPagesRaw.join(', ') || 'none'}`,
    `- DataForSEO Search Intent endpoint: ${payload.sources.dataForSeoSearchIntentEndpoint}`,
    `- DataForSEO Search Intent API calls: ${payload.intentApiCalls}`,
    `- DataForSEO Search Intent cost: ${payload.intentTaskCost ?? payload.intentCost ?? 'n/a'}`,
    `- DataForSEO Search Intent labels: ${Object.entries(counts.intentLabels).map(([label, count]) => `${label}=${count}`).join(', ') || 'none'}`,
    '',
    '## Rules',
    '',
    ...payload.rules.map((rule) => `- ${rule}`),
    '',
    missingRows.length ? '## Rows Needing Attention' : '## Rows Needing Attention\n\n- none',
    missingRows.length ? missingSample : '',
    '',
    localOnlyRows.length ? '## Rows Without Live OnPage Coverage' : '## Rows Without Live OnPage Coverage\n\n- none',
    localOnlyRows.length ? localOnlySample : '',
    '',
    '## Sample Ledger Rows',
    '',
    '| local SEO | generic guard | DataForSEO intent | intent label | DataForSEO OnPage | page | url | keyword |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    sampleRows,
    '',
    ...gates.map(commandBlock),
  ].join('\n\n'));
  console.log(`SERPForge all-pages DataForSEO ledger: ${status}`);
  console.log(`- Public page targets: ${counts.total}`);
  console.log(`- Local SEO pass: ${counts.localPass}/${counts.total}`);
  console.log(`- Generic-content guard pass: ${counts.genericPass}/${counts.total}`);
  console.log(`- DataForSEO Search Intent covered: ${counts.intentCovered}/${counts.total}`);
  console.log(`- DataForSEO live OnPage covered: ${counts.onPageCovered}/${counts.total}`);
  console.log(`- Tool/blog DataForSEO live OnPage covered: ${counts.toolBlogOnPageCovered}/${counts.toolBlogOnPageRequired}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (status !== 'pass') process.exitCode = 1;
}

function serpDepthForTarget(target) {
  if (target.tier === 'A') return 20;
  return 10;
}

function serpOrganicItems(response) {
  return (
    response?.tasks?.[0]?.result?.[0]?.items
      ?.filter((item) => item.type === 'organic')
      .map((item) => ({
        rankGroup: item.rank_group ?? null,
        rankAbsolute: item.rank_absolute ?? null,
        title: item.title ?? '',
        url: item.url ?? '',
        domain: item.domain ?? '',
        breadcrumb: item.breadcrumb ?? '',
        description: item.description ?? '',
      })) ?? []
  );
}

function titleTermCoverage(title = '', keyword = '') {
  const terms = keywordTerms(keyword);
  const covered = termsCovered(title, terms);
  return {
    required: terms,
    covered,
    ratio: terms.length ? Number((covered.length / terms.length).toFixed(2)) : 1,
  };
}

function serpAuditIssues(row, local, organicItems) {
  const issues = [];
  const warnings = [];
  const titleCoverage = titleTermCoverage(local?.title ?? '', row.keyword);
  const h1Coverage = titleTermCoverage((local?.h1 ?? []).join(' '), row.keyword);
  const competitorTitles = organicItems.slice(0, 5).map((item) => item.title).filter(Boolean);
  const accessResult = organicItems.find((item) => /(^|\.)accessfreetools\.com$/i.test(item.domain) || /https:\/\/accessfreetools\.com\//i.test(item.url));

  if (!organicItems.length) issues.push('DataForSEO SERP returned no organic results');
  if (titleCoverage.required.length >= 2 && titleCoverage.ratio < 0.5) issues.push(`title weak for query terms: ${titleCoverage.required.join(', ')}`);
  if (h1Coverage.required.length >= 2 && h1Coverage.ratio < 0.5) issues.push(`H1 weak for query terms: ${h1Coverage.required.join(', ')}`);
  if (!accessResult) warnings.push('Access Free Tools was not found in top SERP depth for the target keyword');

  const competitorUsesCalculator = competitorTitles.filter((title) => /\bcalculator\b/i.test(title)).length;
  const ourTitleUsesCalculator = /\bcalculator\b/i.test(local?.title ?? '');
  if (row.type === 'tool' && competitorUsesCalculator >= 3 && !ourTitleUsesCalculator) {
    issues.push('SERP competitors strongly signal calculator intent but page title does not');
  }

  const competitorUsesGuide = competitorTitles.filter((title) => /\b(how to|guide|use)\b/i.test(title)).length;
  const ourTitleUsesGuide = /\b(how to|guide|use)\b/i.test(local?.title ?? '');
  if (row.page === 'blog' && competitorUsesGuide >= 3 && !ourTitleUsesGuide) {
    warnings.push('SERP competitors strongly signal guide intent; confirm title is guide-shaped');
  }

  return {
    issues,
    warnings,
    accessRank: accessResult?.rankGroup ?? null,
    titleCoverage,
    h1Coverage,
    topCompetitorTitles: competitorTitles,
  };
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

async function allPagesSerpAuditCommand(options = {}) {
  ensureDirs();
  const generatedAt = new Date().toISOString();
  const targets = dataForSeoSitewideTargets();
  const limit = Number(options.limit ?? process.env.npm_config_limit ?? 0);
  const concurrency = Math.max(1, Math.min(20, Number(options.concurrency ?? process.env.npm_config_concurrency ?? 8)));
  const maxEstimatedCost = Number(options.maxEstimatedCost ?? process.env.npm_config_max_estimated_cost ?? 5);
  const selectedTargets = limit > 0 ? targets.slice(0, limit) : targets;
  const estimatedCost = selectedTargets.reduce((total, target) => total + 0.002 * Math.ceil(serpDepthForTarget(target) / 10), 0);
  const gates = [
    runNpmScript('DataForSEO account', 'dataforseo:account', ['--', '--min-balance=2', '--warn-balance=10']),
    runNpmScript('DataForSEO status', 'dataforseo:status'),
  ];
  const gateStatus = reportStatus(gates);
  const sitewide = latestSitewideRows();
  const localByUrl = new Map(sitewide.rows.map((row) => [normalizeEvidenceUrl(row.url), row]));
  const intentLedger = latestAllPagesDataForSeoRows();
  const intentByUrl = new Map(intentLedger.rows.map((row) => [normalizeEvidenceUrl(row.url), row]));

  if (estimatedCost > maxEstimatedCost) {
    const payload = {
      generatedAt,
      kind: 'all-pages-serp-audit',
      status: 'needs-attention',
      error: `Estimated DataForSEO SERP cost ${estimatedCost.toFixed(4)} USD is above the configured max ${maxEstimatedCost.toFixed(4)} USD.`,
      targets: selectedTargets.length,
      estimatedCost,
      maxEstimatedCost,
      gates,
    };
    const paths = writePair(reportsDir, `serpforge-all-pages-serp-audit-${stamp()}`, payload, [
      '# SERPForge All-Pages SERP Audit',
      '',
      `Status: ${payload.status}`,
      payload.error,
    ].join('\n\n'));
    console.log(`SERPForge all-pages SERP audit: ${payload.status}`);
    console.log(`- Saved report: ${paths.markdownPath}`);
    process.exitCode = 1;
    return;
  }

  const rows =
    gateStatus === 'pass'
      ? await mapConcurrent(selectedTargets, concurrency, async (target, index) => {
          const depth = serpDepthForTarget(target);
          const local = localByUrl.get(normalizeEvidenceUrl(target.url));
          const intent = intentByUrl.get(normalizeEvidenceUrl(target.url));
          try {
            const response = await dataForSeoRequest('/serp/google/organic/live/advanced', {
              keyword: target.keyword,
              location_name: 'United States',
              language_code: 'en',
              device: 'desktop',
              os: 'windows',
              depth,
              stop_crawl_on_match: [{ match_type: 'domain', match_value: 'accessfreetools.com' }],
              target_search_mode: 'any',
              find_targets_in: ['organic'],
              tag: `serpforge-all-pages-serp-${generatedAt.replace(/[:.]/g, '-')}-${index + 1}`,
            });
            const organicItems = serpOrganicItems(response);
            const review = serpAuditIssues(target, local, organicItems);
            return {
              url: target.url,
              page: target.page,
              type: target.type,
              slug: target.slug,
              tier: target.tier,
              keyword: target.keyword,
              depth,
              status: review.issues.length ? 'needs-attention' : 'pass',
              cost: response.tasks?.[0]?.cost ?? response.cost ?? null,
              dataForSeoIntent: intent?.dataForSeoSearchIntentLabel ?? null,
              dataForSeoIntentProbability: intent?.dataForSeoSearchIntentProbability ?? null,
              localTitle: local?.title ?? '',
              localH1: local?.h1 ?? [],
              accessRank: review.accessRank,
              titleCoverage: review.titleCoverage,
              h1Coverage: review.h1Coverage,
              issues: review.issues,
              warnings: review.warnings,
              topOrganic: organicItems.slice(0, 10),
              topCompetitorTitles: review.topCompetitorTitles,
            };
          } catch (error) {
            return {
              url: target.url,
              page: target.page,
              type: target.type,
              slug: target.slug,
              tier: target.tier,
              keyword: target.keyword,
              depth,
              status: 'needs-attention',
              cost: 0,
              dataForSeoIntent: intent?.dataForSeoSearchIntentLabel ?? null,
              localTitle: local?.title ?? '',
              localH1: local?.h1 ?? [],
              accessRank: null,
              titleCoverage: titleTermCoverage(local?.title ?? '', target.keyword),
              h1Coverage: titleTermCoverage((local?.h1 ?? []).join(' '), target.keyword),
              issues: ['DataForSEO SERP request failed'],
              warnings: [],
              error: error instanceof Error ? error.message : String(error),
              topOrganic: [],
              topCompetitorTitles: [],
            };
          }
        })
      : selectedTargets.map((target) => ({
          url: target.url,
          page: target.page,
          type: target.type,
          slug: target.slug,
          tier: target.tier,
          keyword: target.keyword,
          depth: serpDepthForTarget(target),
          status: 'needs-attention',
          cost: 0,
          accessRank: null,
          issues: ['DataForSEO gates did not pass'],
          warnings: [],
          topOrganic: [],
        }));

  const counts = rows.reduce(
    (summary, row) => {
      summary.total += 1;
      summary.pass += row.status === 'pass' ? 1 : 0;
      summary.needsAttention += row.status !== 'pass' ? 1 : 0;
      summary.notFoundInSerp += row.accessRank ? 0 : 1;
      summary.cost += Number(row.cost ?? 0);
      summary.byPage[row.page] = (summary.byPage[row.page] ?? 0) + 1;
      summary.byTier[row.tier] = (summary.byTier[row.tier] ?? 0) + 1;
      return summary;
    },
    { total: 0, pass: 0, needsAttention: 0, notFoundInSerp: 0, cost: 0, byPage: {}, byTier: {} },
  );
  counts.cost = Number(counts.cost.toFixed(4));

  const attentionRows = rows.filter((row) => row.status !== 'pass');
  const status = gateStatus === 'pass' && selectedTargets.length > 0 && !attentionRows.length ? 'pass' : 'needs-attention';
  const payload = {
    generatedAt,
    kind: 'all-pages-serp-audit',
    status,
    scope: {
      targets: selectedTargets.length,
      totalAvailableTargets: targets.length,
      location: 'United States',
      language: 'en',
      concurrency,
      estimatedCost: Number(estimatedCost.toFixed(4)),
      maxEstimatedCost,
      endpoint: '/serp/google/organic/live/advanced',
    },
    webGuidanceSources: [
      'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
      'https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets',
      'https://developers.google.com/search/docs/appearance/google-images',
      'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
      'https://dataforseo.com/update/serp-api-crawl-stop-on-match',
      'https://docs.dataforseo.com/v3/serp-se-type-live-advanced/',
    ],
    rules: [
      'Every page target receives live Google organic SERP evidence from DataForSEO unless a request error is recorded.',
      'Depth is tiered: A pages use depth 20, B/C pages use depth 10.',
      'stop_crawl_on_match targets accessfreetools.com with target_search_mode=any and find_targets_in=organic to avoid deeper crawl spend when the domain appears.',
      'Backlinks API is not used.',
      'A missing Access Free Tools rank is an opportunity warning, not a copy-fix failure by itself.',
    ],
    gates,
    sources: {
      sitewideSeoReport: sitewide.path ? rel(sitewide.path) : null,
      allPagesIntentLedger: intentLedger.path ? rel(intentLedger.path) : null,
    },
    counts,
    rows,
  };

  const attentionSample = attentionRows
    .slice(0, 50)
    .map((row) => `- ${row.url}: ${row.issues.join('; ')}${row.error ? ` (${row.error})` : ''}`)
    .join('\n');
  const sampleRows = rows
    .slice(0, 80)
    .map((row) => `| ${row.status} | ${row.tier} | ${row.accessRank ?? 'not top-depth'} | ${row.page} | ${row.url} | ${row.keyword} | ${row.topOrganic[0]?.title ?? 'n/a'} |`)
    .join('\n');
  const paths = writePair(reportsDir, `serpforge-all-pages-serp-audit-${stamp()}`, payload, [
    '# SERPForge All-Pages Live SERP Audit',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status}`,
    '',
    '## Counts',
    '',
    `- Page targets checked: ${counts.total}`,
    `- SERP audit pass: ${counts.pass}`,
    `- SERP audit needs attention: ${counts.needsAttention}`,
    `- Access Free Tools not found within target depth: ${counts.notFoundInSerp}`,
    `- Actual DataForSEO SERP cost: ${counts.cost}`,
    `- Estimated max cost before run: ${payload.scope.estimatedCost}`,
    '',
    '## Rules',
    '',
    ...payload.rules.map((rule) => `- ${rule}`),
    '',
    attentionRows.length ? '## Rows Needing Copy/Technical Attention' : '## Rows Needing Copy/Technical Attention\n\n- none',
    attentionRows.length ? attentionSample : '',
    '',
    '## Sample SERP Rows',
    '',
    '| status | tier | AFT rank | page | url | keyword | top organic title |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    sampleRows,
    '',
    ...gates.map(commandBlock),
  ].join('\n\n'));

  console.log(`SERPForge all-pages live SERP audit: ${status}`);
  console.log(`- Page targets checked: ${counts.total}`);
  console.log(`- SERP audit pass: ${counts.pass}/${counts.total}`);
  console.log(`- Access Free Tools not found within target depth: ${counts.notFoundInSerp}`);
  console.log(`- DataForSEO SERP cost: ${counts.cost}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (status !== 'pass') process.exitCode = 1;
}

function dataForSeoSprintForPageTypeCommand(page) {
  ensureDirs();
  const generatedAt = new Date().toISOString();
  const cleanPageValue = cleanPage(page);
  const gates = [
    runNpmScript('DataForSEO account', 'dataforseo:account', ['--', '--min-balance=2', '--warn-balance=10']),
    runNpmScript('DataForSEO status', 'dataforseo:status'),
  ];
  const gateStatus = reportStatus(gates);
  const targets = dataForSeoSitewideTargets().filter((target) => target.page === cleanPageValue);
  const rows = pageProofRows(targets);
  const counts = summarizeProofRows(rows);
  const maps = evidenceMaps();
  const blockedRows = rows.filter((row) => !row.done);
  const status = gateStatus === 'pass' && blockedRows.length === 0 && targets.length > 0 ? 'pass' : 'needs-attention';
  const payload = {
    generatedAt,
    kind: `all-${cleanPageValue}s-dataforseo-sprint`,
    status,
    page: cleanPageValue,
    gates,
    counts,
    hardRules: [
      `${cleanPageValue} pages require page-specific DataForSEO Labs Search Intent evidence.`,
      `${cleanPageValue} pages require page-specific DataForSEO live Google SERP evidence.`,
      `${cleanPageValue} pages require DataForSEO OnPage evidence for the exact URL.`,
      'No Backlinks API is used.',
      'No page is marked done while proof is missing.',
    ],
    sources: {
      sitewideSeoReport: maps.sitewide.path ? rel(maps.sitewide.path) : null,
      allPagesDataForSeoLedger: maps.intentLedger.path ? rel(maps.intentLedger.path) : null,
      allPagesSerpAudit: maps.serpLedger.path ? rel(maps.serpLedger.path) : null,
      allPagesToneAudit: maps.toneLedger.path ? rel(maps.toneLedger.path) : null,
      dataForSeoOnPageEvidence: maps.latestOnPage?.outputDir ? rel(maps.latestOnPage.outputDir) : null,
    },
    rows,
  };
  const blockedSample = blockedRows
    .slice(0, 60)
    .map((row) => `- ${row.url}: ${row.blockers.join('; ')}`)
    .join('\n');
  const paths = writePair(reportsDir, `serpforge-all-${cleanPageValue}s-dataforseo-sprint-${stamp()}`, payload, [
    `# SERPForge All-${cleanPageValue === 'tool' ? 'Tools' : 'Blogs'} DataForSEO Sprint`,
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status}`,
    '',
    '## Counts',
    '',
    `- Pages checked: ${counts.total}`,
    `- Done by hard rule: ${counts.done}/${counts.total}`,
    `- Local SEO pass: ${counts.localSeoPass}/${counts.total}`,
    `- Smart 14 tone pass: ${counts.tonePass}/${counts.total}`,
    `- DataForSEO Search Intent covered: ${counts.intentCovered}/${counts.total}`,
    `- DataForSEO live SERP covered: ${counts.serpCovered}/${counts.total}`,
    `- DataForSEO OnPage covered: ${counts.onPageCovered}/${counts.total}`,
    '',
    '## Evidence Sources',
    '',
    `- Sitewide SEO: ${payload.sources.sitewideSeoReport ?? 'missing'}`,
    `- DataForSEO intent ledger: ${payload.sources.allPagesDataForSeoLedger ?? 'missing'}`,
    `- DataForSEO live SERP audit: ${payload.sources.allPagesSerpAudit ?? 'missing'}`,
    `- Tone audit: ${payload.sources.allPagesToneAudit ?? 'missing'}`,
    `- DataForSEO OnPage: ${payload.sources.dataForSeoOnPageEvidence ?? 'missing'}`,
    '',
    blockedRows.length ? '## Blocked Pages' : '## Blocked Pages\n\n- none',
    blockedRows.length ? blockedSample : '',
    '',
    ...gates.map(commandBlock),
  ].join('\n\n'));
  console.log(`SERPForge all-${cleanPageValue}s DataForSEO sprint: ${status}`);
  console.log(`- Pages checked: ${counts.total}`);
  console.log(`- Done by hard rule: ${counts.done}/${counts.total}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (status !== 'pass') process.exitCode = 1;
}

function resolvePageTarget(value, page = '') {
  const targets = dataForSeoSitewideTargets();
  const raw = String(value || '').trim();
  const pageFilter = page ? String(page).toLowerCase() : '';
  let url = '';

  if (/^https?:\/\//i.test(raw)) {
    url = raw;
  } else if (raw.startsWith('/')) {
    url = new URL(raw, 'https://accessfreetools.com').toString();
  }

  if (url) {
    const match = targets.find((target) => normalizeEvidenceUrl(target.url) === normalizeEvidenceUrl(url));
    if (match) return match;
  }

  const slug = raw.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).at(-1) ?? raw;
  const candidates = targets.filter((target) => {
    if (pageFilter && target.page !== pageFilter && target.type !== pageFilter) return false;
    return target.slug === slug || target.url.includes(`/${slug}/`);
  });
  const preferred = candidates.find((target) => target.page === 'tool') ?? candidates.find((target) => target.page === 'blog') ?? candidates[0];
  if (!preferred) {
    throw new Error(`No public sitemap page matched "${value}". Run npm run serpforge -- all-pages-review-queue to see valid rows.`);
  }
  return preferred;
}

async function pageHumanToneSprintCommand(value, pageOrOptions = {}, maybeOptions = {}) {
  const options =
    typeof pageOrOptions === 'string'
      ? { ...maybeOptions, page: pageOrOptions }
      : pageOrOptions;
  ensureDirs();
  const generatedAt = new Date().toISOString();
  const target = resolvePageTarget(value, options.page || '');
  const built = builtHtmlForUrl(target.url);
  const tone = smart14ToneAudit(target, built);
  const local = pageSeoIssues(target.url, built);
  const gates = [
    runNpmScript('DataForSEO account', 'dataforseo:account', ['--', '--min-balance=2', '--warn-balance=10']),
    runNpmScript('DataForSEO status', 'dataforseo:status'),
  ];
  const gateStatus = reportStatus(gates);
  const onPage = evidenceMaps().onPageByUrl.get(normalizeEvidenceUrl(target.url));
  const onPageIssues = onPageLiveIssues(onPage);
  let intentResponse = null;
  let serpResponse = null;
  let paidError = '';

  if (gateStatus === 'pass' && ['tool', 'blog'].includes(target.page)) {
    try {
      intentResponse = await dataForSeoRequest('/dataforseo_labs/google/search_intent/live', {
        keywords: [target.keyword],
        language_code: 'en',
        tag: `serpforge-page-human-tone-intent-${slugify(target.url)}-${generatedAt.replace(/[:.]/g, '-')}`,
      });
      serpResponse = await dataForSeoRequest('/serp/google/organic/live/advanced', {
        keyword: target.keyword,
        location_name: 'United States',
        language_code: 'en',
        device: 'desktop',
        os: 'windows',
        depth: serpDepthForTarget(target),
        stop_crawl_on_match: [{ match_type: 'domain', match_value: 'accessfreetools.com' }],
        target_search_mode: 'any',
        find_targets_in: ['organic'],
        tag: `serpforge-page-human-tone-serp-${slugify(target.url)}-${generatedAt.replace(/[:.]/g, '-')}`,
      });
    } catch (error) {
      paidError = error instanceof Error ? error.message : String(error);
    }
  }

  const organicItems = serpOrganicItems(serpResponse);
  const serpReview = ['tool', 'blog'].includes(target.page) ? serpAuditIssues(target, { title: local.title, h1: local.h1 }, organicItems) : null;
  const pageResults =
    gateStatus === 'pass' && ['tool', 'blog'].includes(target.page)
      ? [
          runAft('SEO page score', ['seo-page-score', target.slug, target.page]),
          runWorkbench('SEO workbench all', ['all', target.slug, target.page]),
        ]
      : [];
  const intentItems =
    intentResponse?.tasks?.flatMap((task) => task.result?.flatMap((result) => result.items ?? []) ?? []) ?? [];
  const intent = intentItems[0] ?? null;
  const blockers = [
    ...local.issues,
    ...tone.blockers.map((blocker) => `tone: ${blocker}`),
    ...(['tool', 'blog'].includes(target.page) && !intent ? ['missing page-specific DataForSEO Labs Search Intent evidence'] : []),
    ...(['tool', 'blog'].includes(target.page) && !serpResponse ? ['missing page-specific DataForSEO live SERP evidence'] : []),
    ...(['tool', 'blog'].includes(target.page) && !onPage ? ['missing DataForSEO OnPage evidence for this exact URL'] : []),
    ...(['tool', 'blog'].includes(target.page) ? onPageIssues.map((issue) => `DataForSEO OnPage: ${issue}`) : []),
    ...(serpReview?.issues ?? []).map((issue) => `DataForSEO SERP: ${issue}`),
    ...pageResults.filter((result) => result.status !== 0).map((result) => `${result.label} failed`),
  ];
  const status = gateStatus === 'pass' && !paidError && blockers.length === 0 ? 'pass' : 'needs-attention';
  const payload = {
    generatedAt,
    kind: 'page-human-tone-sprint',
    status,
    target,
    tone,
    local,
    gates,
    dataForSeo: {
      required: ['tool', 'blog'].includes(target.page),
      intentStatus: intent ? 'covered' : 'missing',
      intent: intent?.keyword_intent ?? null,
      serpStatus: serpResponse ? 'covered' : 'missing',
      serpCost: serpResponse?.tasks?.[0]?.cost ?? null,
      serpAccessRank: serpReview?.accessRank ?? null,
      onPageStatus: onPage ? 'covered' : 'missing',
      onPageScore: onPage?.onpage_score ?? null,
      onPageIssues,
      paidError,
    },
    pageResults,
    blockers,
    done: status === 'pass',
  };
  const paths = writePair(reportsDir, `serpforge-page-human-tone-sprint-${target.slug}-${target.page}-${stamp()}`, payload, [
    `# SERPForge Page Human-Tone Sprint: ${target.url}`,
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status}`,
    `Keyword: ${target.keyword}`,
    '',
    '## Done Rule',
    '',
    '- Smart 14 tone blocker-free.',
    '- Local SEO has no blocker.',
    '- Tool/blog pages have page-specific DataForSEO Labs, live SERP, and OnPage proof.',
    '',
    blockers.length ? '## Blockers' : '## Blockers\n\n- none',
    blockers.length ? blockers.map((blocker) => `- ${blocker}`).join('\n') : '',
    '',
    '## DataForSEO',
    '',
    `- Search Intent: ${payload.dataForSeo.intentStatus}`,
    `- Live SERP: ${payload.dataForSeo.serpStatus}`,
    `- OnPage: ${payload.dataForSeo.onPageStatus}`,
    paidError ? `- Paid error: ${paidError}` : '',
    '',
    ...gates.map(commandBlock),
    '',
    ...pageResults.map(commandBlock),
  ].join('\n\n'));
  console.log(`SERPForge page human-tone sprint: ${status}`);
  console.log(`- URL: ${target.url}`);
  console.log(`- DataForSEO required: ${payload.dataForSeo.required}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (status !== 'pass') process.exitCode = 1;
}

function allPagesHumanToneReportCommand() {
  ensureDirs();
  const generatedAt = new Date().toISOString();
  const rows = pageProofRows();
  const counts = summarizeProofRows(rows);
  const maps = evidenceMaps();
  const blockedRows = rows.filter((row) => !row.done);
  const status = blockedRows.length ? 'needs-attention' : 'pass';
  const payload = {
    generatedAt,
    kind: 'all-pages-human-tone-report',
    status,
    counts,
    doneRule: [
      'Reader-facing copy is smart-14 tone and blocker-free.',
      'Generic AI, SEO, and internal process wording is absent from public copy.',
      'Local page SEO checks pass.',
      'Tool/blog pages have DataForSEO Labs Search Intent, live SERP, and OnPage proof for the exact URL.',
      'SERPForge final judge has no blocker.',
    ],
    sources: {
      reviewQueue: maps.reviewQueue.path ? rel(maps.reviewQueue.path) : null,
      sitewideSeoReport: maps.sitewide.path ? rel(maps.sitewide.path) : null,
      toneAudit: maps.toneLedger.path ? rel(maps.toneLedger.path) : null,
      allPagesDataForSeoLedger: maps.intentLedger.path ? rel(maps.intentLedger.path) : null,
      allPagesSerpAudit: maps.serpLedger.path ? rel(maps.serpLedger.path) : null,
      dataForSeoOnPageEvidence: maps.latestOnPage?.outputDir ? rel(maps.latestOnPage.outputDir) : null,
    },
    rows,
  };
  const blockedSample = blockedRows
    .slice(0, 80)
    .map((row) => `- ${row.url}: ${row.blockers.join('; ')}`)
    .join('\n');
  const paths = writePair(reportsDir, `serpforge-all-pages-human-tone-report-${stamp()}`, payload, [
    '# SERPForge All-Pages Human-Tone Final Judge',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status}`,
    '',
    '## Counts',
    '',
    `- Public pages judged: ${counts.total}`,
    `- Done by hard rule: ${counts.done}/${counts.total}`,
    `- Blocked: ${counts.blocked}`,
    `- DataForSEO mandatory tool/blog rows done: ${counts.dataForSeoMandatoryDone}/${counts.dataForSeoMandatory}`,
    `- Local SEO pass: ${counts.localSeoPass}/${counts.total}`,
    `- Smart 14 tone pass: ${counts.tonePass}/${counts.total}`,
    `- DataForSEO Search Intent covered: ${counts.intentCovered}`,
    `- DataForSEO live SERP covered: ${counts.serpCovered}`,
    `- DataForSEO OnPage covered: ${counts.onPageCovered}`,
    '',
    '## Evidence Sources',
    '',
    `- Review queue: ${payload.sources.reviewQueue ?? 'missing'}`,
    `- Sitewide SEO: ${payload.sources.sitewideSeoReport ?? 'missing'}`,
    `- Tone audit: ${payload.sources.toneAudit ?? 'missing'}`,
    `- DataForSEO intent ledger: ${payload.sources.allPagesDataForSeoLedger ?? 'missing'}`,
    `- DataForSEO SERP audit: ${payload.sources.allPagesSerpAudit ?? 'missing'}`,
    `- DataForSEO OnPage: ${payload.sources.dataForSeoOnPageEvidence ?? 'missing'}`,
    '',
    blockedRows.length ? '## Blocked Pages' : '## Blocked Pages\n\n- none',
    blockedRows.length ? blockedSample : '',
  ].join('\n\n'));
  console.log(`SERPForge all-pages human-tone report: ${status}`);
  console.log(`- Public pages judged: ${counts.total}`);
  console.log(`- Done by hard rule: ${counts.done}/${counts.total}`);
  console.log(`- DataForSEO mandatory tool/blog rows done: ${counts.dataForSeoMandatoryDone}/${counts.dataForSeoMandatory}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (status !== 'pass') process.exitCode = 1;
}

function allPagesHumanToneSprintCommand() {
  ensureDirs();
  const generatedAt = new Date().toISOString();
  const results = [
    runSerpforge('All-pages review queue', ['all-pages-review-queue'], 120_000),
    runSerpforge('Sitewide SEO audit', ['sitewide-seo-audit'], 180_000),
    runSerpforge('All-pages smart 14 tone audit', ['all-pages-tone-audit'], 180_000),
    runSerpforge('DataForSEO sitewide OnPage audit', ['dataforseo-sitewide-audit', '--reuse-latest'], 300_000),
    runSerpforge('All-pages DataForSEO intent ledger', ['all-pages-dataforseo'], 300_000),
    runSerpforge('All-pages DataForSEO live SERP audit', ['all-pages-serp-audit'], 900_000),
    runSerpforge('All-tools DataForSEO sprint', ['all-tools-dataforseo-sprint'], 180_000),
    runSerpforge('All-blogs DataForSEO sprint', ['all-blogs-dataforseo-sprint'], 180_000),
    runSerpforge('All-pages human-tone final judge', ['all-pages-human-tone-report'], 180_000),
  ];
  const status = reportStatus(results);
  const payload = {
    generatedAt,
    kind: 'all-pages-human-tone-sprint',
    status,
    results,
    rules: [
      'This sprint is continuous batch mode for every public sitemap HTML page.',
      'Tool/blog pages require DataForSEO Labs, live SERP, and OnPage proof.',
      'The final judge refuses done status if any page has blockers.',
      'Backlinks API is not used.',
    ],
  };
  const paths = writePair(reportsDir, `serpforge-all-pages-human-tone-sprint-${stamp()}`, payload, [
    '# SERPForge All-Pages Human-Tone Sprint',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status}`,
    '',
    '## Rules',
    '',
    ...payload.rules.map((rule) => `- ${rule}`),
    '',
    ...results.map(commandBlock),
  ].join('\n\n'));
  console.log(`SERPForge all-pages human-tone sprint: ${status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (status !== 'pass') process.exitCode = 1;
}

async function paidAuditSprintCommand(slug, page) {
  const cleanPageValue = cleanPage(page);
  const gates = [
    runNpmScript('DataForSEO account', 'dataforseo:account', ['--', '--min-balance=2', '--warn-balance=10']),
    runNpmScript('DataForSEO status', 'dataforseo:status'),
  ];
  const gateStatus = reportStatus(gates);
  const keyword = slug.replace(/-/g, ' ');
  let paidEvidence = null;
  let paidError = '';

  if (gateStatus === 'pass') {
    try {
      paidEvidence = await dataForSeoRequest('/dataforseo_labs/google/related_keywords/live', {
        keyword,
        location_name: 'United States',
        language_code: 'en',
        depth: 1,
        limit: 10,
        order_by: ['keyword_data.keyword_info.search_volume,desc'],
      });
    } catch (error) {
      paidError = error instanceof Error ? error.message : String(error);
    }
  }

  const pageResults = gateStatus === 'pass'
    ? [
        runAft('SEO page research', ['seo-tool-research', slug, cleanPageValue]),
        runAft('SEO page score', ['seo-page-score', slug, cleanPageValue]),
        runWorkbench('SEO workbench all', ['all', slug, cleanPageValue]),
      ]
    : [];
  const status = gateStatus === 'pass' && paidEvidence && pageResults.every((result) => result.status === 0) ? 'pass' : 'needs-attention';
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'paid-audit-sprint',
    slug,
    page: cleanPageValue,
    keyword,
    status,
    gates,
    paidEvidence,
    paidError,
    pageResults,
  };
  const paths = writePair(reportsDir, `serpforge-paid-audit-sprint-${slug}-${cleanPageValue}-${stamp()}`, payload, [
    `# SERPForge Paid Audit Sprint: ${slug} (${cleanPageValue})`,
    '',
    `Status: ${status}`,
    `Keyword: ${keyword}`,
    paidError ? `Paid evidence error: ${paidError}` : '',
    '',
    '## DataForSEO Gates',
    '',
    ...gates.map(commandBlock),
    '',
    paidEvidence ? '## Paid Evidence\n\n- DataForSEO related keyword response saved in JSON report.' : '## Paid Evidence\n\n- No paid evidence saved.',
    '',
    '## Page Workflow',
    '',
    ...(pageResults.length ? pageResults.map(commandBlock) : ['Page workflow skipped because DataForSEO gates did not pass.']),
  ].join('\n\n'));
  const reviewEvidenceDir = join(root, 'output', 'seo-tool-review', slug, cleanPageValue);
  mkdirSync(reviewEvidenceDir, { recursive: true });
  writeFileSync(join(reviewEvidenceDir, 'dataforseo-paid.json'), `${JSON.stringify(payload, null, 2)}\n`);
  writeFileSync(
    join(reviewEvidenceDir, 'dataforseo-paid.md'),
    [
      `# DataForSEO Paid Evidence: ${slug} ${cleanPageValue}`,
      '',
      `Generated: ${payload.generatedAt}`,
      `Status: ${status}`,
      `Keyword: ${keyword}`,
      paidError ? `Paid evidence error: ${paidError}` : 'Paid evidence error: none',
      '',
      '## Gates',
      '',
      ...gates.map((gate) => `- ${gate.label}: ${gate.status === 0 ? 'pass' : 'blocked'}`),
      '',
      '## Evidence',
      '',
      paidEvidence
        ? '- DataForSEO Labs related keyword response is saved in `dataforseo-paid.json` for this exact page sprint.'
        : '- No paid DataForSEO evidence was saved.',
    ].join('\n'),
  );
  console.log(`SERPForge paid audit sprint: ${status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  console.log(`- Saved page evidence: ${rel(join(reviewEvidenceDir, 'dataforseo-paid.md'))}`);
  if (status !== 'pass') process.exitCode = 1;
}

function gscSubmitSitemapsCommand() {
  const tokenPath = join(root, process.env.GSC_TOKEN_PATH ?? '.local/search-console-token.json');
  const token = readJsonFile(tokenPath);
  const scopes = String(token?.scope ?? '');
  const hasManageScope = scopes.includes('https://www.googleapis.com/auth/webmasters');
  const hasRefreshPath = Boolean(token?.refresh_token || (token?.access_token && Number(token?.expires_at ?? 0) > Date.now() + 60_000));
  const result =
    hasManageScope && hasRefreshPath
      ? run(process.execPath, ['scripts/search-console.mjs', '--submit-all-sitemaps'], 'Google Search Console full sitemap submission', { timeoutMs: 60_000 })
      : {
          label: 'Google Search Console full sitemap submission',
          command: `${process.execPath} scripts/search-console.mjs --submit-all-sitemaps`,
          status: 1,
          stdout: '',
          stderr:
            'Search Console owner OAuth token with webmasters manage scope was not available for non-interactive sitemap submission. Run node scripts/search-console.mjs --submit-all-sitemaps in an interactive session to authorize, then rerun this SERPForge command.',
        };
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'gsc-submit-sitemaps',
    status: result.status === 0 ? 'pass' : 'needs-attention',
    sitemaps: sitemapUrls,
    result,
  };
  const paths = writePair(reportsDir, `serpforge-gsc-submit-sitemaps-${stamp()}`, payload, [
    '# SERPForge Google Search Console Sitemap Submission',
    '',
    `Status: ${payload.status}`,
    '',
    '## Submitted Sitemaps',
    '',
    ...sitemapUrls.map((url) => `- ${url}`),
    '',
    commandBlock(result),
  ].join('\n\n'));
  console.log(`SERPForge GSC sitemap submission: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
  if (payload.status !== 'pass') process.exitCode = 1;
}

function deepAuditSprintCommand() {
  ensureDirs();
  const results = [
    runSerpforge('Deep audit import', ['deep-audit-import'], 180_000),
    runSerpforge('Deep audit agents', ['deep-audit-agents'], 120_000),
    runSerpforge('Technical header plan', ['technical-header-plan'], 120_000),
    runSerpforge('Heading metadata plan', ['heading-metadata-plan'], 120_000),
    runSerpforge('Content depth plan', ['content-depth-plan'], 120_000),
    runSerpforge('E-E-A-T author plan', ['eeat-author-plan'], 120_000),
    runSerpforge('Authority plan', ['authority-plan'], 240_000),
    runSerpforge('Social discovery plan', ['social-discovery-plan'], 240_000),
    runSerpforge('DataForSEO plan', ['dataforseo-plan'], 180_000),
    runSerpforge('All-pages human-tone final judge', ['all-pages-human-tone-report'], 180_000),
    runSerpforge('DataForSEO sitewide audit', ['dataforseo-sitewide-audit', '--reuse-latest'], 240_000),
    runNpmScript('Search Console key URLs', 'search-console:inspect-key-urls'),
    runAft('SEO console', ['seo-console']),
    runNpmScript('Marketing orchestrator', 'marketing:orchestrate'),
  ];
  const proofCommands = [
    'npm run check',
    'npm run serpforge -- all-pages-human-tone-report',
    'npm run serpforge -- dataforseo-sitewide-audit',
    'npm run search-console:inspect-key-urls',
    'npm run aft -- seo-console',
    'npm run marketing:orchestrate',
  ];
  const counts = deepAuditCounts();
  const blockedRows = deepAuditFindings.filter((row) => ['confirmed', 'needs-proof'].includes(row.status));
  const status = results.every((result) => result.status === 0) && !blockedRows.length ? 'ready-for-human-approval' : 'needs-proof';
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'deep-audit-sprint',
    status,
    findingCounts: counts,
    blockedRows,
    proofCommands,
    results,
    rules: [
      'This is a planning and evidence sprint, not a live-fix claim.',
      'Confirmed and needs-proof rows stay open until exact proof is attached.',
      'Promotion and outreach agents draft only; no public posting, submission, messaging, or backlink claims.',
      'DataForSEO uses account/status gates, targeted Labs, live SERP, and OnPage only; Backlinks API is not used.',
      'Some PDF findings may be stale or generic, so sub-agents must verify before creating fix tasks.',
    ],
  };
  const blockedTable = blockedRows
    .map((row) => `| ${row.priority} | ${row.status} | ${row.owner} | ${row.id} | ${row.task} | ${row.proof} |`)
    .join('\n');
  const paths = writePair(reportsDir, `serpforge-deep-audit-sprint-${stamp()}`, payload, [
    '# SERPForge Deep Audit Sprint',
    '',
    `Status: ${status}`,
    '',
    '## Rules',
    '',
    ...payload.rules.map((rule) => `- ${rule}`),
    '',
    '## Required Proof Commands',
    '',
    ...proofCommands.map((command) => `- \`${command}\``),
    '',
    '## Open Findings',
    '',
    '| priority | status | owner | id | task | proof |',
    '| --- | --- | --- | --- | --- | --- |',
    blockedTable || '| P0 | already-fixed | Audit Sprint Judge | none | No open findings. | deep-audit-sprint |',
    '',
    '## Command Evidence',
    '',
    ...results.map(commandBlock),
  ].join('\n\n'));
  console.log(`SERPForge deep audit sprint: ${status}`);
  console.log(`- Findings: ${counts.total}`);
  console.log(`- Confirmed: ${counts.byStatus.confirmed ?? 0}`);
  console.log(`- Needs proof: ${counts.byStatus['needs-proof'] ?? 0}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

function auditSprintCommand() {
  const results = [
    runSerpforge('All-pages review queue', ['all-pages-review-queue'], 120_000),
    runSerpforge('Sitewide SEO audit', ['sitewide-seo-audit'], 120_000),
    runSerpforge('All-pages smart 14 tone audit', ['all-pages-tone-audit'], 180_000),
    runSerpforge('DataForSEO sitewide audit', ['dataforseo-sitewide-audit', '--reuse-latest'], 240_000),
    runSerpforge('All-pages DataForSEO ledger', ['all-pages-dataforseo'], 240_000),
    runSerpforge('All-pages live SERP audit', ['all-pages-serp-audit'], 600_000),
    runSerpforge('All-tools DataForSEO sprint', ['all-tools-dataforseo-sprint'], 180_000),
    runSerpforge('All-blogs DataForSEO sprint', ['all-blogs-dataforseo-sprint'], 180_000),
    runSerpforge('All-pages human-tone final judge', ['all-pages-human-tone-report'], 180_000),
    runSerpforge('Template QA', ['template-qa']),
    runSerpforge('HTML sitemap plan', ['html-sitemap-plan']),
    runSerpforge('Image alt audit', ['image-alt-audit']),
    runSerpforge('DataForSEO plan', ['dataforseo-plan']),
  ];
  const byLabel = new Map(results.map((result) => [result.label, result]));
  const passed = (label) => {
    const result = byLabel.get(label);
    return result?.status === 0 && /\b(pass|ready)\b/i.test(`${result.stdout}\n${result.stderr}`);
  };
  const bestNextActions = [];
  if (
    passed('Sitewide SEO audit') &&
    passed('All-pages smart 14 tone audit') &&
    passed('All-pages DataForSEO ledger') &&
    passed('All-pages live SERP audit') &&
    passed('All-tools DataForSEO sprint') &&
    passed('All-blogs DataForSEO sprint') &&
    passed('All-pages human-tone final judge') &&
    passed('Template QA') &&
    passed('Image alt audit')
  ) {
    bestNextActions.push('Deploy the local SEO fixes, then rerun the sitewide and DataForSEO audits against production for live proof.');
  } else {
    if (!passed('All-pages smart 14 tone audit')) bestNextActions.push('Clear smart-14 tone blockers before claiming public copy is human-clean.');
    if (!passed('All-pages DataForSEO ledger')) bestNextActions.push('Clear all-pages DataForSEO ledger gaps before claiming every page has paid evidence.');
    if (!passed('All-pages live SERP audit')) bestNextActions.push('Clear all-pages live SERP audit copy/technical issues before claiming every page has external SERP evidence.');
    if (!passed('All-tools DataForSEO sprint')) bestNextActions.push('Clear mandatory DataForSEO proof gaps for every tool page.');
    if (!passed('All-blogs DataForSEO sprint')) bestNextActions.push('Clear mandatory DataForSEO proof gaps for every blog guide.');
    if (!passed('All-pages human-tone final judge')) bestNextActions.push('Clear final all-pages done-rule blockers before calling the sprint complete.');
    if (!passed('Image alt audit')) bestNextActions.push('Repair approved image alt, caption, and title metadata before expanding gallery SEO.');
    if (!passed('Template QA')) bestNextActions.push('Fix P0 template copy findings before publishing more tools.');
    if (!passed('Sitewide SEO audit')) bestNextActions.push('Clear remaining sitewide SEO attention rows before requesting approval.');
  }
  bestNextActions.push('Submit the full sitemap set to Search Console when an owner OAuth token with webmasters manage scope is available.');
  bestNextActions.push('Run paid page sprints one slug at a time with DataForSEO gates when deeper keyword or SERP evidence is needed.');
  bestNextActions.push('Keep this sprint as ready for human approval only; do not claim live production fixes until deployment and production proof complete.');
  const payload = {
    generatedAt: new Date().toISOString(),
    kind: 'audit-sprint',
    status: results.some((result) => result.status !== 0) ? 'needs-attention' : 'ready-for-human-approval',
    results,
    bestNextActions,
  };
  const paths = writePair(reportsDir, `serpforge-audit-sprint-${stamp()}`, payload, [
    '# SERPForge Audit Sprint',
    '',
    `Status: ${payload.status}`,
    '',
    '## Best Next Actions',
    '',
    ...payload.bestNextActions.map((action) => `- ${action}`),
    '',
    ...results.map(commandBlock),
  ].join('\n\n'));
  console.log(`SERPForge audit sprint: ${payload.status}`);
  console.log(`- Saved report: ${paths.markdownPath}`);
}

const program = new Command();

program
  .name('serpforge')
  .description('SERPForge AI helper tools for Access Free Tools SEO work.')
  .showHelpAfterError()
  .version('0.1.0');

program
  .command('toolbox')
  .description('Write the SERPForge tool-access inventory and guardrails.')
  .action(toolboxCommand);

program
  .command('orientation')
  .description('Run read-only status, evidence, queue, indexing, and proof checks for SERPForge.')
  .action(orientationCommand);

program
  .command('opportunity')
  .description('Rank next SEO opportunities from existing local evidence and proof checks.')
  .action(opportunityCommand);

program
  .command('technical')
  .description('Run the SERPForge technical SEO sweep.')
  .action(technicalCommand);

program.command('deep-audit-import').description('Import the PDF deep SEO audit into SERPForge evidence.').action(deepAuditImportCommand);

program.command('deep-audit-agents').description('Create/report the deep audit agent roster and sprint board.').action(deepAuditAgentsCommand);

program.command('technical-header-plan').description('Verify and plan HSTS, cache headers, preloads, redirects, and 404 UX.').action(technicalHeaderPlanCommand);

program.command('heading-metadata-plan').description('Plan title, meta description, and heading fixes from the PDF audit.').action(headingMetadataPlanCommand);

program.command('content-depth-plan').description('Plan content depth fixes for hubs, About, Password Generator, and weak-click pages.').action(contentDepthPlanCommand);

program.command('eeat-author-plan').description('Plan author, reviewer, citation, disclaimer, and trust-block fixes.').action(eeatAuthorPlanCommand);

program.command('authority-plan').description('Draft authority and outreach targets without submitting or claiming backlinks.').action(authorityPlanCommand);

program.command('social-discovery-plan').description('Plan social discovery drafts through existing promotion quality gates.').action(socialDiscoveryPlanCommand);

program.command('deep-audit-sprint').description('Combine PDF deep-audit agents, proof inputs, and open blockers into a sprint report.').action(deepAuditSprintCommand);

program.command('audit-import').description('Import the downloaded SEO audit into SERPForge evidence.').action(auditImportCommand);

program.command('audit-tasks').description('Report the SERPForge audit task board and lanes.').action(auditTasksCommand);

program.command('template-qa').description('Scan source for audit template-copy risks.').action(templateQaCommand);

program.command('metadata-plan').description('Create category title and meta rewrite tasks.').action(metadataPlanCommand);

program.command('schema-plan').description('Create structured-data tasks by page type.').action(schemaPlanCommand);

program.command('eeat-plan').description('Create sensitive-page E-E-A-T trust block tasks.').action(eeatPlanCommand);

program.command('hub-plan').description('Create mid-level topical hub tasks.').action(hubPlanCommand);

program.command('crawl-plan').description('Create crawl stability, sitemap, robots, and canonical tasks.').action(crawlPlanCommand);

program.command('dataforseo-plan').description('Run DataForSEO gates and write paid research targets.').action(dataForSeoPlanCommand);

program
  .command('dataforseo-sitewide-audit')
  .description('Run DataForSEO-gated sitewide OnPage audit for every public page.')
  .option('--no-wait', 'Create the DataForSEO OnPage task and save the task id without waiting for completion.')
  .option('--skip-waterfall', 'Skip extra waterfall checks for priority URLs.')
  .option('--reuse-latest', 'Reuse the newest completed sitewide OnPage evidence instead of starting a paid crawl.')
  .action(dataForSeoSitewideAuditCommand);

program.command('all-pages-review-queue').description('Build the public page-by-page SEO review queue with sub-agent ownership.').action(allPagesReviewQueueCommand);

program.command('all-pages-tone-audit').description('Audit every public page for smart 14-year-old human tone blockers.').action(allPagesToneAuditCommand);

program
  .command('page-human-tone-sprint')
  .description('Run the per-page human-tone and DataForSEO proof sprint for one public URL or slug.')
  .argument('<urlOrSlug>', 'Public URL, path, or slug to review.')
  .argument('[page]', 'Optional page type, usually tool or blog.')
  .option('--page <type>', 'Narrow slug lookup to tool, blog, category, hub, gallery, home, or site.')
  .action(pageHumanToneSprintCommand);

program.command('all-pages-dataforseo').description('Attach DataForSEO Search Intent evidence to every built sitemap page.').action(allPagesDataForSeoCommand);

program
  .command('all-pages-serp-audit')
  .description('Run DataForSEO live Google SERP evidence for every built sitemap page.')
  .option('--limit <count>', 'Limit page targets for a smoke run.')
  .option('--concurrency <count>', 'Concurrent one-task SERP requests.', '8')
  .option('--max-estimated-cost <usd>', 'Stop if estimated SERP spend would exceed this USD cap.', '5')
  .action(allPagesSerpAuditCommand);

program.command('all-tools-dataforseo-sprint').description('Require per-tool DataForSEO intent, SERP, and OnPage evidence before done.').action(() => dataForSeoSprintForPageTypeCommand('tool'));

program.command('all-blogs-dataforseo-sprint').description('Require per-blog DataForSEO intent, SERP, and OnPage evidence before done.').action(() => dataForSeoSprintForPageTypeCommand('blog'));

program.command('all-pages-human-tone-sprint').description('Run the continuous all-pages SEO, tone, and mandatory DataForSEO sprint.').action(allPagesHumanToneSprintCommand);

program.command('all-pages-human-tone-report').description('Merge all-page SEO, tone, and DataForSEO evidence into the final done-rule report.').action(allPagesHumanToneReportCommand);

program.command('gallery-seo-plan').description('Create deliberate gallery SEO tasks.').action(gallerySeoPlanCommand);

program.command('image-alt-audit').description('Audit approved tool-art alt text and captions.').action(imageAltAuditCommand);

program.command('image-alt-plan').description('Create improved alt/caption recommendations for approved tool art.').action(imageAltPlanCommand);

program.command('image-sitemap-plan').description('Check image and gallery sitemap evidence.').action(imageSitemapPlanCommand);

program.command('html-sitemap-plan').description('Audit the HTML sitemap route and discovery coverage.').action(htmlSitemapPlanCommand);

program.command('gsc-submit-sitemaps').description('Submit the full canonical sitemap set through Google Search Console.').action(gscSubmitSitemapsCommand);

program.command('sitewide-seo-audit').description('Audit every built sitemap URL and merge tool/blog SEO scores where possible.').action(sitewideSeoAuditCommand);

program.command('all-pages-seo').description('Alias for sitewide-seo-audit.').action(sitewideSeoAuditCommand);

program.command('audit-sprint').description('Combine SERPForge audit lanes into a sprint report.').action(auditSprintCommand);

program
  .command('paid-audit-sprint')
  .description('Run DataForSEO-gated paid audit sprint evidence for one page.')
  .argument('<slug>', 'Tool slug, for example percentage-calculator.')
  .argument('[page]', 'Page type: tool or blog.', 'tool')
  .action(paidAuditSprintCommand);

program
  .command('page')
  .description('Run the SERPForge page-review toolchain for one tool page or blog guide.')
  .argument('<slug>', 'Tool slug, for example wallpaper-calculator.')
  .argument('[page]', 'Page type: tool or blog.', 'tool')
  .option('--sources-only', 'Run only the workbench source-evidence stage instead of the full workbench.')
  .option('--skip-workbench', 'Skip the SEO workbench. Use only when collecting partial evidence.')
  .action(pageCommand);

program
  .command('sources')
  .description('Run the SERPForge source-evidence chain for one tool page or blog guide.')
  .argument('<slug>', 'Tool slug, for example wallpaper-calculator.')
  .argument('[page]', 'Page type: tool or blog.', 'tool')
  .action(sourcesCommand);

program
  .command('brief')
  .description('Create a SERPForge SEO content brief for one tool page or blog guide.')
  .argument('<slug>', 'Tool slug, for example wallpaper-calculator.')
  .argument('[page]', 'Page type: tool or blog.', 'tool')
  .action(briefCommand);

program
  .command('ctr')
  .description('Create safe title and meta description rewrite options.')
  .argument('<slug>', 'Tool slug, for example wallpaper-calculator.')
  .argument('[page]', 'Page type: tool or blog.', 'tool')
  .action(ctrCommand);

program
  .command('validate')
  .description('Run final pre-approval SEO validation for one page.')
  .argument('<slug>', 'Tool slug, for example wallpaper-calculator.')
  .argument('[page]', 'Page type: tool or blog.', 'tool')
  .action(validateCommand);

program
  .command('competitor')
  .description('Run targeted competitor gap analysis for one page.')
  .argument('<slug>', 'Tool slug, for example wallpaper-calculator.')
  .argument('[args...]', 'Optional page value and competitor URL values.')
  .option('--url <url>', 'Competitor URL to fetch and score. Repeat for multiple URLs.', collectOption, [])
  .action(competitorCommand);

program
  .command('lighthouse')
  .description('Run the external Lighthouse CLI through npx and save lab SEO/page-experience evidence.')
  .argument('<url>', 'URL to audit.')
  .argument('[args...]', 'Optional preset value: mobile or desktop.')
  .option('--preset <preset>', 'Audit preset: mobile or desktop.', 'mobile')
  .action(lighthouseCommand);

await program.parseAsync();
