import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

import { extractToolRecords, genericContentPhrases, readJson, SITE_ORIGIN } from './agent-tools-report.mjs';
import { loadLatestSearchConsoleInspectionEvidence } from './search-console-inspection-evidence.mjs';

export const SEO_REVIEW_OUTPUT_DIR = 'output/seo-tool-review';
export const SEO_REVIEW_TRACKER_PATH = 'docs/seo-tool-review-queue.md';

export const SEO_REVIEW_AGENTS = [
  {
    name: 'SEO Tool Research Agent',
    role: 'Collects local tool, guide, sitemap, Search Console, usage, and built-page evidence before any edits.',
  },
  {
    name: 'Competitor Gap Analyst',
    role: 'Scores approved competitor tool, FAQ, and guide pages for topic gaps we can answer in original wording.',
  },
  {
    name: 'Smart 14 Voice Editor',
    role: 'Turns generic or hard-to-read language into clear Access Free Tools copy with practical examples.',
  },
  {
    name: 'FAQ And Schema Specialist',
    role: 'Checks visible FAQs, wording usefulness, answer specificity, and structured-data alignment.',
  },
  {
    name: 'Browser Proof Reviewer',
    role: 'Opens the exact local or built URL, checks layout/readability, and records proof before approval.',
  },
  {
    name: 'Human Approval Gatekeeper',
    role: 'Blocks the next page until the current tool page or blog page has explicit human approval recorded.',
  },
];

const defaultCompetitorRoots = [
  'https://www.calculator.net/sitemap.html',
  'https://www.inchcalculator.com/sitemap/',
  'https://calculatorinn.com/sitemap/',
  'https://www.omnicalc.xyz/sitemap',
  'https://www.calculatorsoup.com/sitemap.php',
];

const pageKinds = new Set(['tool', 'blog']);

const extraGenericPhrases = [
  'easy to use',
  'quick and easy',
  'save time and effort',
  'comprehensive solution',
  'designed to help you',
  'look no further',
  'powerful tool',
  'simple tool',
  'perfect for anyone',
  'all in one',
];

const sensitiveCategoryWeights = [
  { pattern: /finance|tax|loan|mortgage|investment|payment/i, score: 35, reason: 'sensitive money category' },
  { pattern: /health|fitness|pregnancy|body|medical/i, score: 35, reason: 'sensitive health category' },
  { pattern: /construction|home|electrical|concrete|roof|paint|landscap|material/i, score: 25, reason: 'home/project estimate category' },
  { pattern: /developer|ai|text|image|pdf|json|markdown|token/i, score: 15, reason: 'technical tool category' },
];

function rootPath(...parts) {
  return resolve(process.cwd(), ...parts);
}

function unixPath(value) {
  return value.replace(/\\/g, '/');
}

function readText(relativePath) {
  const file = rootPath(relativePath);
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
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

    if (depth === 0) return source.slice(start, index + 1);
  }

  return '';
}

function toolSourceBlock(tool) {
  const text = readText(tool.file);
  const slugPattern = new RegExp(`\\bslug\\s*:\\s*['"]${tool.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`);
  const match = slugPattern.exec(text);
  return match ? extractObjectBlock(text, match.index) : text;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function normalizePage(page = 'tool') {
  const clean = String(page || 'tool').toLowerCase();
  if (!pageKinds.has(clean)) {
    throw new Error(`Unsupported SEO review page "${page}". Use "tool" or "blog".`);
  }
  return clean;
}

function findTool(slug) {
  const cleanSlug = String(slug || '').trim();
  const tool = extractToolRecords().find((record) => record.slug === cleanSlug);
  if (!tool) throw new Error(`Unknown tool slug "${slug}".`);
  return tool;
}

function toolRoute(slug) {
  return `/tools/${slug}/`;
}

function blogRoute(slug) {
  return `/blog/how-to-use-${slug}/`;
}

function routeFor(slug, page) {
  return page === 'tool' ? toolRoute(slug) : blogRoute(slug);
}

function urlFor(slug, page) {
  return `${SITE_ORIGIN}${routeFor(slug, page)}`;
}

function sourceForPage(slug, page, tool = null) {
  if (page === 'tool') return tool?.file ?? 'src/data/tools.ts';

  const directGuide = `src/pages/blog/how-to-use-${slug}.astro`;
  if (existsSync(rootPath(directGuide))) return directGuide;

  const utilityGuides = readText('src/data/utilityBlogGuides.ts');
  if (utilityGuides.includes(`'how-to-use-${slug}'`) || utilityGuides.includes(`"how-to-use-${slug}"`)) {
    return 'src/data/utilityBlogGuides.ts';
  }

  const dynamicGuide = 'src/pages/blog/[slug].astro';
  return existsSync(rootPath(dynamicGuide)) ? dynamicGuide : directGuide;
}

function builtHtmlCandidates(slug, page) {
  const route = routeFor(slug, page).replace(/^\/|\/$/g, '');
  return [
    `dist/client/${route}/index.html`,
    `dist/${route}/index.html`,
    `dist/client/${route}.html`,
    `dist/${route}.html`,
  ];
}

function readBuiltHtml(slug, page) {
  for (const candidate of builtHtmlCandidates(slug, page)) {
    if (existsSync(rootPath(candidate))) {
      return { path: candidate, html: readText(candidate), exists: true };
    }
  }
  return {
    path: '',
    html: '',
    exists: false,
    note: 'not enough data: built HTML was not found. Run npm run build before browser-proof scoring.',
  };
}

function decodeEntities(value = '') {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(html = '') {
  return decodeEntities(
    String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function words(text = '') {
  return String(text).toLowerCase().match(/[a-z0-9]+(?:'[a-z0-9]+)?/g) ?? [];
}

function wordCount(text = '') {
  return words(text).length;
}

function sentenceCount(text = '') {
  return Math.max(1, (String(text).match(/[.!?](\s|$)/g) ?? []).length);
}

function averageSentenceWords(text = '') {
  return Number((wordCount(text) / sentenceCount(text)).toFixed(1));
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function phraseHits(text = '') {
  const lower = String(text).toLowerCase();
  return unique([...genericContentPhrases, ...extraGenericPhrases].filter((phrase) => lower.includes(phrase.toLowerCase())));
}

function extractHeadings(html = '', level) {
  const pattern = new RegExp(`<h${level}[^>]*>([\\s\\S]*?)<\\/h${level}>`, 'gi');
  return [...String(html).matchAll(pattern)]
    .map((match) => stripHtml(match[1]))
    .map((heading) => heading.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function extractTitleMetaHeadings(html = '') {
  const title = stripHtml(String(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const description =
    String(html).match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)?.[1] ??
    String(html).match(/<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i)?.[1] ??
    '';

  return {
    title,
    description: decodeEntities(description).replace(/\s+/g, ' ').trim(),
    h1: extractHeadings(html, 1),
    h2: extractHeadings(html, 2),
    h3: extractHeadings(html, 3),
  };
}

function extractJsonLdTypes(html = '') {
  const scripts = [...String(html).matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];
  for (const script of scripts) {
    const text = stripHtml(script[1]).trim();
    try {
      const parsed = JSON.parse(text);
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
      if (/FAQPage/i.test(text)) types.push('FAQPage');
      if (/HowTo/i.test(text)) types.push('HowTo');
    }
  }
  return unique(types);
}

function faqQuestionsFromHtml(html = '') {
  const headings = [1, 2, 3, 4].flatMap((level) => extractHeadings(html, level));
  const buttonQuestions = [...String(html).matchAll(/<button[^>]*>([\s\S]*?\?[\s\S]*?)<\/button>/gi)].map((match) => stripHtml(match[1]));
  const dtQuestions = [...String(html).matchAll(/<dt[^>]*>([\s\S]*?\?[\s\S]*?)<\/dt>/gi)].map((match) => stripHtml(match[1]));
  return unique(
    [...headings, ...buttonQuestions, ...dtQuestions]
      .map((item) => item.trim())
      .filter((item) => item.endsWith('?') || /^(can|what|why|when|where|how|is|are|does|do)\b/i.test(item)),
  );
}

function countInternalLinks(html = '') {
  return [...String(html).matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi)].filter((match) => {
    const href = match[1];
    return href.startsWith('/') || href.startsWith(SITE_ORIGIN);
  }).length;
}

function numberSignalCount(text = '') {
  return (String(text).match(/\b\d+(?:[.,]\d+)?%?\b/g) ?? []).length;
}

function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function phraseOccurrenceCount(text = '', phrase = '') {
  const cleanPhrase = String(phrase || '').trim().toLowerCase();
  if (!cleanPhrase) return 0;
  const pattern = new RegExp(`\\b${escapeRegex(cleanPhrase).replace(/\\s+/g, '\\s+')}\\b`, 'gi');
  return (String(text).match(pattern) ?? []).length;
}

function specificitySignals(tool, text = '') {
  const lower = String(text).toLowerCase();
  const slugWords = tool.slug.split('-').filter((part) => part.length > 2);
  const nameWords = String(tool.name).toLowerCase().split(/\s+/).filter((part) => part.length > 2);
  const toolWordHits = unique([...slugWords, ...nameWords]).filter((part) => lower.includes(part)).length;
  const toolPhrases = unique([tool.name, tool.slug.replace(/-/g, ' ')]);
  const toolPhraseHits = toolPhrases.reduce((sum, phrase) => sum + phraseOccurrenceCount(lower, phrase), 0);
  return {
    toolWordHits,
    toolPhraseHits,
    numbers: numberSignalCount(text),
    examples: (lower.match(/\b(example|for example|say you|if you|let's say)\b/g) ?? []).length,
    formulas: (lower.match(/\b(formula|equation|calculate|convert|multiply|divide|rate|ratio|percent|estimate)\b/g) ?? []).length,
    mistakes: (lower.match(/\b(mistake|avoid|watch out|limit|estimate|round|approx|not exact|double-check)\b/g) ?? []).length,
  };
}

function scoreTone(tool, text = '') {
  const hits = phraseHits(text);
  const signals = specificitySignals(tool, text);
  const avgSentence = averageSentenceWords(text);
  const score =
    58 +
    Math.min(16, signals.toolWordHits * 3 + signals.toolPhraseHits * 2) +
    Math.min(10, signals.numbers) +
    Math.min(8, signals.examples * 4) +
    Math.min(8, signals.mistakes * 2) -
    hits.length * 8 -
    (avgSentence > 28 ? 12 : avgSentence > 22 ? 6 : 0);

  return {
    score: clamp(score),
    genericHits: hits,
    averageSentenceWords: avgSentence,
    signals,
  };
}

function statusFromScore(score) {
  if (score >= 80) return 'pass';
  if (score >= 65) return 'attention';
  return 'fail';
}

function weightedAverage(sections, weights) {
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);
  const total = Object.entries(weights).reduce((sum, [key, weight]) => sum + (sections[key] ?? 0) * weight, 0);
  return clamp(total / totalWeight);
}

function markdownList(items, empty = '- none') {
  return items.length ? items.map((item) => `- ${item}`).join('\n') : empty;
}

function writeReviewReport(parts, fileBase, report, markdown, write = true) {
  if (!write) return {};
  const dir = rootPath(SEO_REVIEW_OUTPUT_DIR, ...parts);
  mkdirSync(dir, { recursive: true });
  const jsonPath = join(dir, `${fileBase}.json`);
  const markdownPath = join(dir, `${fileBase}.md`);
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(markdownPath, `${markdown.trim()}\n`);
  return {
    jsonPath: unixPath(relative(process.cwd(), jsonPath)),
    markdownPath: unixPath(relative(process.cwd(), markdownPath)),
  };
}

function priorityEvidence() {
  const searchConsoleReports = [
    loadLatestSearchConsoleInspectionEvidence({ write: true }),
    readJson('output/search-console-coverage-export.json'),
    readJson('output/seo-agent-self-evaluation.json'),
  ].filter(Boolean);
  const usageReports = [
    readJson('output/agent-tools/usage-summary/latest.json'),
    readJson('output/usage-data-asset-report.json'),
  ].filter(Boolean);

  return {
    searchConsoleText: JSON.stringify(searchConsoleReports).toLowerCase(),
    usageText: JSON.stringify(usageReports).toLowerCase(),
  };
}

function searchConsolePriority(slug, evidence) {
  if (!evidence.searchConsoleText.includes(slug.toLowerCase())) return { score: 0, reason: '' };
  return { score: 45, reason: 'Search Console/local SEO report mentions this slug' };
}

function usagePriority(slug, evidence) {
  if (!evidence.usageText.includes(slug.toLowerCase())) return { score: 0, reason: '' };
  return { score: 25, reason: 'first-party usage/report evidence mentions this slug' };
}

function priorityForTool(tool, evidence) {
  const reasons = [];
  let score = 0;

  if (tool.slug === 'wallpaper-calculator') {
    score += 100;
    reasons.push('current SEO task-board fallback priority');
  }

  const searchConsole = searchConsolePriority(tool.slug, evidence);
  if (searchConsole.score) {
    score += searchConsole.score;
    reasons.push(searchConsole.reason);
  }

  const usage = usagePriority(tool.slug, evidence);
  if (usage.score) {
    score += usage.score;
    reasons.push(usage.reason);
  }

  const categoryWeight = sensitiveCategoryWeights.find((item) => item.pattern.test(tool.category) || item.pattern.test(tool.slug));
  if (categoryWeight) {
    score += categoryWeight.score;
    reasons.push(categoryWeight.reason);
  }

  if (tool.faqCount < 6) {
    score += 20;
    reasons.push(`only ${tool.faqCount} visible FAQs in source record`);
  }

  if (tool.exampleCount < 3) {
    score += 15;
    reasons.push(`only ${tool.exampleCount} examples in source record`);
  }

  if (!tool.seoDescription) {
    score += 10;
    reasons.push('missing source SEO description');
  }

  return {
    score,
    reasons: reasons.length ? reasons : ['alphabetical fallback priority'],
  };
}

function queueMarkdown(report) {
  const rows = report.entries
    .slice(0, 80)
    .map(
      (entry) =>
        `| ${entry.slug} | ${entry.page} | ${entry.status} | ${entry.priorityScore} | ${entry.url} | ${entry.priorityReasons.join('; ')} |`,
    )
    .join('\n');
  const gate = report.approvalGate?.blocked
    ? `- Active approval gate: ${report.approvalGate.slug} ${report.approvalGate.page} (${report.approvalGate.status})
- Gate action: ${report.approvalGate.reason}
- First ranked page after gate: ${report.entries[0]?.slug ?? 'none'} ${report.entries[0]?.page ?? ''}`
    : `- Active approval gate: none
- First page: ${report.entries[0]?.slug ?? 'none'} ${report.entries[0]?.page ?? ''}`;

  return `# SEO Tool Review Queue

Generated: ${report.generatedAt}

- Tools: ${report.summary.tools}
- Page review units: ${report.summary.pages}
- Approved page review units: ${report.summary.approvedPages}
- Remaining page review units: ${report.summary.remainingPages}
- Approval unit: ${report.summary.approvalUnit}
${gate}

This generated queue is report-only. Human approvals are tracked in \`${SEO_REVIEW_TRACKER_PATH}\`.

| slug | page | status | priority score | url | priority reasons |
| --- | --- | --- | ---: | --- | --- |
${rows}
`;
}

export function buildSeoToolQueueReport(options = {}) {
  const generatedAt = new Date().toISOString();
  const tools = extractToolRecords();
  const evidence = priorityEvidence();
  const trackerText =
    typeof options.trackerText === 'string' ? options.trackerText : readText(SEO_REVIEW_TRACKER_PATH);
  const approvalRows = parseApprovalRows(trackerText);
  const activeGate = activeApprovalGate(approvalRows);
  const approvalGate = activeGate.blocked ? activeGate : matchingPageApprovalGate(approvalRows);
  const ranked = tools
    .map((tool) => ({
      ...tool,
      priority: priorityForTool(tool, evidence),
    }))
    .sort((a, b) => b.priority.score - a.priority.score || a.category.localeCompare(b.category) || a.slug.localeCompare(b.slug));

  const allEntries = ranked.flatMap((tool) =>
    ['tool', 'blog'].map((page) => {
      const approval = approvalPageState(approvalRows, tool.slug, page);
      return {
        approvalRequired: true,
        approval,
        name: tool.name,
        page,
        priorityReasons: tool.priority.reasons,
        priorityScore: tool.priority.score,
        slug: tool.slug,
        source: sourceForPage(tool.slug, page, tool),
        status: approval.status,
        url: urlFor(tool.slug, page),
      };
    }),
  );
  const entries = allEntries
    .filter((entry) => !entry.approval.approved)
    .filter(
      (entry) =>
        !(
          approvalGate.blocked &&
          entry.slug === approvalGate.slug &&
          entry.page === approvalGate.page
        ),
    );
  const approvedPages = allEntries.length - entries.length - (approvalGate.blocked ? 1 : 0);

  const report = {
    generatedAt,
    kind: 'seo-tool-queue',
    status: approvalGate.blocked ? 'blocked' : entries.length ? 'pass' : 'complete',
    summary: {
      approvalUnit: 'page',
      firstPage: approvalGate.blocked
        ? `${approvalGate.slug}:${approvalGate.page}`
        : entries[0]
          ? `${entries[0].slug}:${entries[0].page}`
          : '',
      pages: allEntries.length,
      remainingPages: entries.length + (approvalGate.blocked ? 1 : 0),
      approvedPages,
      tools: tools.length,
    },
    approvalGate,
    rules: [
      'Review exactly one URL at a time.',
      'Human approval is required separately for each tool page and each blog page.',
      'Paid DataForSEO competitor calls require either explicit approval for that run or the standing owner autonomy directive.',
    ],
    entries,
  };

  const paths = writeReviewReport(['queue'], 'latest', report, queueMarkdown(report), options.write !== false);
  return { ...report, paths };
}

function builtProofSummary(slug, page) {
  const built = readBuiltHtml(slug, page);
  if (!built.exists) {
    return {
      exists: false,
      path: '',
      note: built.note,
    };
  }

  const headings = extractTitleMetaHeadings(built.html);
  return {
    exists: true,
    path: built.path,
    title: headings.title,
    description: headings.description,
    h1: headings.h1,
    internalLinks: countInternalLinks(built.html),
    wordCount: wordCount(stripHtml(built.html)),
  };
}

function localPageText(slug, page, tool) {
  const source = sourceForPage(slug, page, tool);
  const sourceText = page === 'tool' ? toolSourceBlock(tool) : readText(source);
  const built = readBuiltHtml(slug, page);
  return {
    source,
    sourceText,
    builtText: built.exists ? stripHtml(built.html) : '',
    combinedText: `${sourceText}\n${built.exists ? stripHtml(built.html) : ''}`,
  };
}

function researchMarkdown(report) {
  return `# SEO Tool Research Pack: ${report.tool.name} ${report.page}

Generated: ${report.generatedAt}

- URL: ${report.url}
- Source: ${report.source.path}
- Built proof: ${report.builtProof.exists ? report.builtProof.path : report.builtProof.note}
- FAQs: ${report.source.faqCount}
- Examples: ${report.source.exampleCount}
- Related links: ${report.source.relatedCount}
- Tone score: ${report.tone.score}
- Generic hits: ${report.tone.genericHits.length ? report.tone.genericHits.join(', ') : 'none'}

## Agents

${markdownList(report.agents.map((agent) => `${agent.name}: ${agent.role}`))}

## Competitor Starting Points

${markdownList(report.competitorSeeds.map((item) => `${item.label}: ${item.url}`))}

## Proof Commands

${markdownList(report.proofCommands.map((command) => `\`${command}\``))}

## Approval Gate

${report.approval.note}
`;
}

export function buildSeoToolResearchReport(slug, options = {}) {
  const page = normalizePage(options.page ?? process.env.npm_config_page ?? 'tool');
  const tool = findTool(slug);
  const generatedAt = new Date().toISOString();
  const text = localPageText(tool.slug, page, tool);
  const builtProof = builtProofSummary(tool.slug, page);
  const tone = scoreTone(tool, text.combinedText || `${tool.name} ${tool.summary} ${tool.description}`);
  const route = routeFor(tool.slug, page);
  const proofCommands = [
    `npm run aft -- page-seo ${tool.slug}`,
    `npm run aft -- tool-brief ${tool.slug}`,
    ...(page === 'blog' ? [`npm run aft -- content-score ${text.source}`] : []),
    `internal browser: open http://localhost:4321${route}`,
  ];

  const report = {
    generatedAt,
    kind: 'seo-tool-research',
    status: 'pass',
    slug: tool.slug,
    page,
    url: urlFor(tool.slug, page),
    tool: {
      name: tool.name,
      category: tool.category,
      summary: tool.summary,
      description: tool.description,
    },
    source: {
      path: text.source,
      exists: existsSync(rootPath(text.source)),
      faqCount: tool.faqCount,
      exampleCount: tool.exampleCount,
      relatedCount: tool.relatedCount,
      relatedSlugs: tool.relatedSlugs,
      seoDescription: tool.seoDescription,
    },
    builtProof,
    tone,
    agents: SEO_REVIEW_AGENTS,
    competitorSeeds: defaultCompetitorRoots.map((url) => ({
      label: new URL(url).hostname.replace(/^www\./, ''),
      url,
      use: 'Use saved/free/manual evidence first; fetch exact competitor pages only when selected for this page.',
    })),
    paidResearch: {
      allowed: false,
      requiresApproval: true,
      note: 'No paid DataForSEO competitor SERP, keyword, or OnPage call is allowed unless the user explicitly approves that paid run.',
    },
    browserProof: {
      url: route,
      preferred: 'internal browser',
      fallback: 'Playwright screenshot/snapshot against the local dev server',
    },
    proofCommands,
    approval: {
      required: true,
      unit: page,
      nextPageBlocked: true,
      note: `Stop after this ${page} page and record explicit human approval in ${SEO_REVIEW_TRACKER_PATH} before moving on.`,
    },
  };

  const paths = writeReviewReport([tool.slug, page], 'research', report, researchMarkdown(report), options.write !== false);
  return { ...report, paths };
}

function competitorScoreFromHtml(url, html, tool) {
  const headings = extractTitleMetaHeadings(html);
  const plainText = stripHtml(html);
  const faqQuestions = faqQuestionsFromHtml(html);
  const schemaTypes = extractJsonLdTypes(html);
  const signals = specificitySignals(tool, plainText);
  const avgSentence = averageSentenceWords(plainText);

  const sections = {
    metadata: clamp((headings.title ? 35 : 0) + (headings.description ? 35 : 0) + (headings.h1.length ? 30 : 0)),
    headings: clamp(Math.min(100, (headings.h2.length + headings.h3.length) * 14)),
    faq: clamp(Math.min(100, faqQuestions.length * 25)),
    examples: clamp(Math.min(100, signals.examples * 24 + Math.min(35, signals.numbers * 4))),
    coverage: clamp(Math.min(100, signals.formulas * 10 + signals.mistakes * 15 + signals.toolWordHits * 8)),
    schema: clamp(schemaTypes.length ? 70 + Math.min(30, schemaTypes.length * 10) : 25),
    readability: clamp(avgSentence <= 18 ? 92 : avgSentence <= 24 ? 78 : avgSentence <= 32 ? 58 : 42),
  };

  const overall = weightedAverage(sections, {
    metadata: 1.1,
    headings: 0.8,
    faq: 1,
    examples: 1,
    coverage: 1,
    schema: 0.6,
    readability: 0.7,
  });

  return {
    url,
    status: html ? 'scored' : 'not-enough-data',
    title: headings.title,
    description: headings.description,
    headings: {
      h1: headings.h1,
      h2: headings.h2.slice(0, 12),
      h3: headings.h3.slice(0, 12),
    },
    faq: {
      count: faqQuestions.length,
      questions: faqQuestions.slice(0, 12),
    },
    schemaTypes,
    signals,
    wordCount: wordCount(plainText),
    averageSentenceWords: avgSentence,
    score: {
      overall,
      sections,
      status: statusFromScore(overall),
    },
  };
}

function localOpportunityBaseline(slug, page, tool) {
  const local = localPageText(slug, page, tool);
  const text = local.combinedText || `${tool.summary} ${tool.description}`;
  const built = readBuiltHtml(slug, page);
  return {
    faqCount: tool.faqCount,
    exampleCount: tool.exampleCount,
    internalLinks: built.exists ? countInternalLinks(built.html) : tool.relatedCount,
    tone: scoreTone(tool, text),
  };
}

function competitorOpportunities(competitors, baseline) {
  const opportunities = [];
  const bestFaq = Math.max(0, ...competitors.map((item) => item.faq?.count ?? 0));
  const bestExamples = Math.max(0, ...competitors.map((item) => item.signals?.examples ?? 0));
  const bestCoverage = Math.max(0, ...competitors.map((item) => item.signals?.formulas ?? 0));
  const bestMistakes = Math.max(0, ...competitors.map((item) => item.signals?.mistakes ?? 0));

  if (bestExamples > 0) opportunities.push('Add or tighten one concrete, tool-specific example that uses real numbers and shows how the result should be interpreted.');
  if (bestFaq > baseline.faqCount) opportunities.push(`Consider useful visible FAQ coverage: competitors show up to ${bestFaq} question-style sections while our source record has ${baseline.faqCount}.`);
  if (bestCoverage > 0) opportunities.push('Check formula/logic coverage and explain the calculator math in original plain language.');
  if (bestMistakes > 0) opportunities.push('Add a short mistakes/limits note when it helps users avoid bad inputs or over-trusting estimates.');
  if (baseline.tone.genericHits.length) opportunities.push(`Replace generic phrases with tool-specific language: ${baseline.tone.genericHits.join(', ')}.`);
  if (!opportunities.length) opportunities.push('No obvious competitor gap from the supplied evidence; use browser proof and human review for the next decision.');

  opportunities.push('Use competitor evidence for topic gaps only. Write original Access Free Tools wording, examples, and FAQ answers.');
  return opportunities;
}

function competitorMarkdown(report) {
  const competitors = report.competitors
    .map(
      (item) =>
        `- ${item.url}: score ${item.score.overall}, FAQs ${item.faq.count}, title "${item.title || 'not enough data'}"`,
    )
    .join('\n');

  return `# Competitor Gap Report: ${report.slug} ${report.page}

Generated: ${report.generatedAt}

- Paid research: ${report.paidResearch.allowed ? 'allowed for this run' : 'blocked by default'}
- Competitors scored: ${report.competitors.length}

## Competitors

${competitors || '- none'}

## Gaps We Can Fill

${markdownList(report.opportunities)}

## Copy Policy

${report.copyPolicy}
`;
}

export function buildSeoCompetitorGapReport(slug, options = {}) {
  const page = normalizePage(options.page ?? process.env.npm_config_page ?? 'tool');
  const tool = findTool(slug);
  const generatedAt = new Date().toISOString();
  const urls = unique([
    ...(Array.isArray(options.urls) ? options.urls : options.url ? [options.url] : []),
    ...(typeof process.env.npm_config_url === 'string' && !/^(true|false)$/i.test(process.env.npm_config_url)
      ? [process.env.npm_config_url]
      : []),
  ]);
  const htmlByUrl = options.htmlByUrl ?? {};
  const warnings = [];

  const competitors = urls.map((url) => {
    const html = htmlByUrl[url] ?? '';
    if (!html) {
      warnings.push(`not enough data: no fetched or supplied HTML for ${url}`);
      return {
        url,
        status: 'not-enough-data',
        title: '',
        description: '',
        headings: { h1: [], h2: [], h3: [] },
        faq: { count: 0, questions: [] },
        schemaTypes: [],
        signals: {},
        wordCount: 0,
        averageSentenceWords: 0,
        score: { overall: 0, sections: {}, status: 'fail' },
      };
    }
    return competitorScoreFromHtml(url, html, tool);
  });

  const baseline = localOpportunityBaseline(tool.slug, page, tool);
  const paidAllowed = options.allowPaid === true && options.explicitPaidApproval === true;
  const paidWarning =
    options.allowPaid === true && options.explicitPaidApproval !== true
      ? 'paid DataForSEO path requested but not approved; paid research remains blocked'
      : '';
  if (paidWarning) warnings.push(paidWarning);
  if (!urls.length) warnings.push('not enough data: pass at least one --url competitor page or supply saved competitor HTML.');

  const report = {
    generatedAt,
    kind: 'seo-competitor-gap',
    status: competitors.some((item) => item.status === 'scored') ? 'pass' : 'attention',
    slug: tool.slug,
    page,
    url: urlFor(tool.slug, page),
    paidResearch: {
      allowed: paidAllowed,
      requiresApproval: true,
      note: paidAllowed
        ? 'Paid research was explicitly approved for this run.'
        : 'Paid DataForSEO competitor SERP, keyword, and OnPage calls are blocked by default.',
    },
    defaultCompetitorRoots,
    competitors,
    localBaseline: baseline,
    opportunities: competitorOpportunities(competitors.filter((item) => item.status === 'scored'), baseline),
    copyPolicy: 'Do not copy competitor wording, order, examples, or brand voice. Use evidence only to find user-helpful gaps.',
    warnings,
  };

  const paths = writeReviewReport([tool.slug, page], 'competitor-gap', report, competitorMarkdown(report), options.write !== false);
  return { ...report, paths };
}

export async function runSeoCompetitorGapReport(slug, options = {}) {
  const urls = unique(Array.isArray(options.urls) ? options.urls : options.url ? [options.url] : []);
  const htmlByUrl = { ...(options.htmlByUrl ?? {}) };
  const fetchResults = [];

  for (const url of urls) {
    if (htmlByUrl[url]) continue;
    if (!/^https?:\/\//i.test(url)) {
      fetchResults.push({ url, status: 'skipped', error: 'Only http(s) competitor URLs can be fetched.' });
      continue;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(options.timeoutMs ?? 12000));
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': 'AccessFreeTools-SEO-Review/1.0 (+https://accessfreetools.com)',
        },
        signal: controller.signal,
      });
      const text = await response.text();
      if (response.ok) htmlByUrl[url] = text.slice(0, 350_000);
      fetchResults.push({ url, status: response.ok ? 'fetched' : 'http-warning', httpStatus: response.status });
    } catch (error) {
      fetchResults.push({
        url,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  const report = buildSeoCompetitorGapReport(slug, { ...options, urls, htmlByUrl, write: false });
  const reportWithFetch = { ...report, fetchResults };
  const paths = writeReviewReport(
    [report.slug, report.page],
    'competitor-gap',
    reportWithFetch,
    competitorMarkdown(reportWithFetch),
    options.write !== false,
  );
  return { ...reportWithFetch, paths };
}

function pageScoreMarkdown(report) {
  const sections = Object.entries(report.score.sections)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  return `# SEO Page Score: ${report.slug} ${report.page}

Generated: ${report.generatedAt}

- URL: ${report.url}
- Status: ${report.status}
- Overall score: ${report.score.overall}
- Source: ${report.source.path}
- Built proof: ${report.builtProof.exists ? report.builtProof.path : report.builtProof.note}

## Section Scores

${sections}

## Issues

${markdownList(report.issues)}

## Warnings

${markdownList(report.warnings)}

## Proof Commands

${markdownList(report.proofCommands.map((command) => `\`${command}\``))}
`;
}

export function buildSeoPageScoreReport(slug, options = {}) {
  const page = normalizePage(options.page ?? process.env.npm_config_page ?? 'tool');
  const tool = findTool(slug);
  const generatedAt = new Date().toISOString();
  const local = localPageText(tool.slug, page, tool);
  const built = readBuiltHtml(tool.slug, page);
  const builtHeadings = built.exists ? extractTitleMetaHeadings(built.html) : { title: '', description: '', h1: [], h2: [], h3: [] };
  const text = local.combinedText || `${tool.name} ${tool.summary} ${tool.description}`;
  const tone = scoreTone(tool, text);
  const signals = specificitySignals(tool, text);
  const issues = [];
  const warnings = [];

  const sections = {
    seoFit: clamp((tool.seoDescription ? 35 : 0) + (builtHeadings.title ? 25 : 0) + (builtHeadings.description ? 25 : 0) + (builtHeadings.h1.length ? 15 : 0)),
    toolSpecificity: clamp(45 + Math.min(20, signals.toolWordHits * 3 + signals.toolPhraseHits * 4) + Math.min(20, numberSignalCount(text)) + Math.min(15, tool.exampleCount * 5)),
    faqQuality: clamp(Math.min(100, tool.faqCount * 14)),
    internalLinks: clamp(Math.min(100, (built.exists ? countInternalLinks(built.html) : tool.relatedCount) * 12 + tool.relatedCount * 7)),
    tone: tone.score,
    trustAndLimits: clamp(50 + Math.min(25, signals.mistakes * 5) + Math.min(25, /\b(privacy|no sign|free|estimate|double-check|not financial|not medical|limit)\b/i.test(text) ? 25 : 0)),
    builtProof: built.exists ? 100 : 35,
  };

  if (!built.exists) warnings.push(built.note);
  if (tool.faqCount < 6) warnings.push(`source record has ${tool.faqCount} FAQs; new tool standard expects six or more useful FAQs`);
  if (tool.exampleCount < 3) warnings.push(`source record has ${tool.exampleCount} examples; consider stronger examples if the page feels thin`);
  if (tone.genericHits.length) warnings.push(`generic copy hits: ${tone.genericHits.join(', ')}`);
  if (!tool.seoDescription) issues.push('source record is missing seoDescription');
  if (page === 'blog' && !existsSync(rootPath(local.source))) warnings.push(`matching guide source was not found at ${local.source}`);

  const overall = weightedAverage(sections, {
    seoFit: 1.1,
    toolSpecificity: 1.2,
    faqQuality: 1,
    internalLinks: 0.8,
    tone: 1.2,
    trustAndLimits: 0.8,
    builtProof: 0.7,
  });
  const status = issues.length ? 'fail' : statusFromScore(overall);
  const proofCommands = [
    `npm run aft -- page-seo ${tool.slug}`,
    `npm run aft -- tool-brief ${tool.slug}`,
    ...(page === 'blog' ? [`npm run aft -- content-score ${local.source}`] : []),
    `internal browser: open http://localhost:4321${routeFor(tool.slug, page)}`,
  ];

  const report = {
    generatedAt,
    kind: 'seo-page-score',
    status,
    slug: tool.slug,
    page,
    url: urlFor(tool.slug, page),
    source: {
      path: local.source,
      exists: existsSync(rootPath(local.source)),
    },
    builtProof: builtProofSummary(tool.slug, page),
    score: {
      overall,
      sections,
      status,
    },
    tone,
    proofCommands,
    issues,
    warnings,
  };

  const paths = writeReviewReport([tool.slug, page], 'page-score', report, pageScoreMarkdown(report), options.write !== false);
  return { ...report, paths };
}

function splitMarkdownRow(line) {
  return line
    .split('|')
    .map((cell) => cell.trim())
    .filter(Boolean);
}

const activeApprovalStatuses = new Set(['researching', 'edited', 'waiting-human-approval']);

function activeApprovalGate(rows) {
  const row = rows.find((item) => pageKinds.has(item.page) && activeApprovalStatuses.has(item.status.toLowerCase()));

  if (!row) {
    return {
      blocked: false,
      reason: '',
    };
  }

  return {
    blocked: true,
    slug: row.slug,
    page: row.page,
    status: row.status,
    proof: row.proof,
    notes: row.notes,
    reason: `Finish ${row.slug} ${row.page} and record explicit human approval before starting the next ranked page.`,
  };
}

function matchingPageApprovalGate(rows) {
  for (const row of rows) {
    if (!pageKinds.has(row.page) || row.status.toLowerCase() !== 'approved') continue;

    const currentState = approvalPageState(rows, row.slug, row.page);
    if (!currentState.approved) continue;

    const matchingPage = row.page === 'tool' ? 'blog' : 'tool';
    const matchingState = approvalPageState(rows, row.slug, matchingPage);
    if (matchingState.approved) continue;

    return {
      blocked: true,
      slug: row.slug,
      page: matchingPage,
      status: matchingState.status,
      proof: matchingState.proof,
      notes: matchingState.notes,
      reason: `Finish the matching ${row.slug} ${matchingPage} page before starting a different slug.`,
    };
  }

  return {
    blocked: false,
    reason: '',
  };
}

function parseApprovalRows(markdown = '') {
  const rows = [];
  for (const line of String(markdown).split('\n')) {
    if (!line.trim().startsWith('|') || line.includes('---')) continue;
    const cells = splitMarkdownRow(line);
    if (cells.length < 3 || /^slug$/i.test(cells[0])) continue;
    rows.push({
      slug: cells[0],
      page: cells[1],
      status: cells[2],
      approvedBy: cells[3] ?? '',
      approvedAt: cells[4] ?? '',
      proof: cells[5] ?? '',
      notes: cells.slice(6).join(' | '),
    });
  }
  return rows;
}

function approvalMarkdown(report) {
  return `# SEO Approval Status: ${report.slug}

Generated: ${report.generatedAt}

- Tool page approved: ${report.pages.tool.approved ? 'yes' : 'no'}
- Blog page approved: ${report.pages.blog.approved ? 'yes' : 'no'}
- Can proceed to next slug: ${report.canProceedToNext ? 'yes' : 'no'}
- Blocked reason: ${report.blockedReason || 'none'}

Approval tracker: \`${SEO_REVIEW_TRACKER_PATH}\`
`;
}

function approvalPageState(rows, slug, page) {
  const row = rows
    .filter((item) => item.slug === slug && item.page === page)
    .at(-1);

  return {
    approved: row?.status?.toLowerCase() === 'approved',
    status: row?.status ?? 'not-started',
    approvedBy: row?.approvedBy ?? '',
    approvedAt: row?.approvedAt ?? '',
    proof: row?.proof ?? '',
    notes: row?.notes ?? '',
  };
}

export function buildSeoApprovalStatusReport(slug, options = {}) {
  const tool = findTool(slug);
  const generatedAt = new Date().toISOString();
  const trackerText =
    typeof options.trackerText === 'string' ? options.trackerText : readText(SEO_REVIEW_TRACKER_PATH);
  const rows = parseApprovalRows(trackerText);
  const toolState = approvalPageState(rows, tool.slug, 'tool');
  const blogState = approvalPageState(rows, tool.slug, 'blog');
  const canProceedToNext = toolState.approved && blogState.approved;

  const report = {
    generatedAt,
    kind: 'seo-approval-status',
    status: canProceedToNext ? 'pass' : 'blocked',
    slug: tool.slug,
    pages: {
      tool: toolState,
      blog: blogState,
    },
    canProceedToNext,
    blockedReason: canProceedToNext
      ? ''
      : `Human approval is still required for ${[
          !toolState.approved ? 'tool' : '',
          !blogState.approved ? 'blog' : '',
        ].filter(Boolean).join(' and ')} page.`,
    trackerPath: SEO_REVIEW_TRACKER_PATH,
  };

  const paths = writeReviewReport([tool.slug], 'approval-status', report, approvalMarkdown(report), options.write !== false);
  return { ...report, paths };
}
