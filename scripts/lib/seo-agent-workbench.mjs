import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import {
  countSeoMicroAgents,
  flattenSeoMicroAgents,
  selectSeoMicroAgentGroups,
  SEO_MICRO_AGENT_GROUPS,
} from './seo-micro-agent-catalog.mjs';

const root = process.cwd();

export const SEO_WEB_RESEARCH_SOURCES = [
  {
    label: 'Google Search Central: SEO Starter Guide',
    url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
    use: 'Use as the top-level SEO quality source for helpful titles, snippets, images, links, crawlability, and people-first pages.',
  },
  {
    label: 'Google Search Central: Link best practices',
    url: 'https://developers.google.com/search/docs/crawling-indexing/links-crawlable',
    use: 'Use for internal-link and anchor-text decisions: descriptive, concise, relevant, contextual, and not keyword-stuffed.',
  },
  {
    label: 'Google Search Central: Helpful content',
    url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
    use: 'Use for reader-first review: original value, satisfying answers, trust, and no search-engine-first filler.',
  },
  {
    label: 'DataForSEO APIs',
    url: 'https://dataforseo.com/apis',
    use: 'Use for paid keyword, SERP, competitor, page-intersection, ranked-keyword, and OnPage evidence after user approval.',
  },
  {
    label: 'Google Search Central: Structured data',
    url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
    use: 'Use for schema eligibility, JSON-LD, rich-result testing, and schema-to-visible-content matching.',
  },
  {
    label: 'Google Search Central: AI features',
    url: 'https://developers.google.com/search/docs/appearance/ai-features',
    use: 'Use for AI-search readiness. Foundational SEO applies; no special AI text files or AI-only schema are required for Google.',
  },
  {
    label: 'web.dev: Core Web Vitals',
    url: 'https://web.dev/articles/vitals',
    use: 'Use for page-experience agents. Current targets are LCP within 2.5s, INP 200ms or less, and CLS 0.1 or less.',
  },
  {
    label: 'The Agency: agency-agents',
    url: 'https://github.com/msitarzewski/agency-agents',
    use: 'Use as a specialist-agent pattern: one role, one deliverable, measurable output, and a reviewer lens.',
  },
];

export const SEO_AGENT_COUNCIL = [
  {
    id: 'web-source-research',
    agent: 'Web SEO Source Research Agent',
    oneJob: 'Start with current public SEO guidance and record what applies to this exact page.',
    startWithWebResearch: true,
    tools: [
      'Google Search Central SEO Starter Guide',
      'Google Search Central Link Best Practices',
      'Google Search Central Helpful Content',
      'DataForSEO API docs',
      'agency-agents specialist pattern',
    ],
    output: 'source-evidence.md',
    evaluator: 'Source Evidence Evaluator',
    evaluatorJob: 'Reject advice that has no source URL, saved report, or local owner doc behind it.',
  },
  {
    id: 'search-intent-keywords',
    agent: 'Search Intent And Keyword Agent',
    oneJob: 'Map the page to the query, intent, related terms, and useful subtopics without stuffing keywords.',
    startWithWebResearch: true,
    tools: [
      'npm run dataforseo:account',
      'npm run dataforseo:status',
      'DataForSEO Labs related keywords',
      'DataForSEO ranked keywords',
      'DataForSEO page intersection',
      'Google Search Console evidence when available',
    ],
    output: 'dataforseo-paid.md',
    evaluator: 'Keyword Evidence Evaluator',
    evaluatorJob: 'Reject keyword decisions that are memory-based, paid-data-free when paid was required, or written as keyword stuffing.',
  },
  {
    id: 'competitor-gap',
    agent: 'Competitor Gap Analyst',
    oneJob: 'Compare approved competitor tool, FAQ, and blog pages and list original gaps Access Free Tools can fill.',
    startWithWebResearch: true,
    tools: [
      'npm run aft -- seo-competitor-gap <slug> <page> <competitor-url>',
      'calculator.net',
      'Inch Calculator',
      'CalculatorSoup',
      'CalculatorInn',
      'OmniCalc',
    ],
    output: 'competitor-gap*.md',
    evaluator: 'Competitor Originality Evaluator',
    evaluatorJob: 'Reject copied wording, copied examples, copied heading order, or gaps that do not help the reader.',
  },
  {
    id: 'on-page-seo',
    agent: 'On-Page SEO Agent',
    oneJob: 'Check title, description, H1, headings, canonical URL, visible content, and built HTML proof.',
    startWithWebResearch: true,
    tools: [
      'npm run aft -- seo-page-score <slug> <page>',
      'npm run aft -- page-seo <slug>',
      'npm run build',
      'dist/client built HTML',
    ],
    output: 'page-score.md',
    evaluator: 'On-Page Evidence Evaluator',
    evaluatorJob: 'Reject claims made only from source files when the built HTML does not prove them.',
  },
  {
    id: 'contextual-internal-links',
    agent: 'Contextual Internal Link Agent',
    oneJob: 'Add useful internal links with descriptive anchors to the matching tool, guide, related tools, and hubs.',
    startWithWebResearch: true,
    tools: [
      'node scripts/seo-agent-workbench.mjs links <slug> <page>',
      'npm run aft -- link-helper',
      'docs/brand-code.md internal linking rules',
      'Google link best practices',
    ],
    output: 'link-audit.md',
    evaluator: 'Anchor Text Evaluator',
    evaluatorJob: 'Reject generic anchors, chained links, repeated exact-match stuffing, or links that do not help the reader.',
  },
  {
    id: 'micro-agent-scope',
    agent: 'Micro-Agent Scope Planner',
    oneJob: 'Activate the relevant one-question SEO micro-agents for this page and park irrelevant conditional groups.',
    startWithWebResearch: true,
    tools: [
      'node scripts/seo-agent-workbench.mjs micro-plan <slug> <page>',
      'scripts/lib/seo-micro-agent-catalog.mjs',
      'docs/seo-agent-workbench.md',
    ],
    output: 'micro-agent-plan.md',
    evaluator: 'Micro-Agent Scope Evaluator',
    evaluatorJob: 'Reject reviews that run irrelevant local/ecommerce/video/international agents or skip relevant page-type agents.',
  },
  {
    id: 'smart-14-voice',
    agent: 'Smart 14 Voice Editor',
    oneJob: 'Make the public copy natural, specific, plain, and useful to a smart 14-year-old reader.',
    startWithWebResearch: true,
    tools: [
      'docs/brand-code.md',
      'docs/article-writing-agent-standard.md',
      'npm run aft -- seo-tool-research <slug> <page>',
      'npm run aft -- content-score <built-or-source-file>',
    ],
    output: 'research.md',
    evaluator: 'Reader Clarity Evaluator',
    evaluatorJob: 'Reject filler, fake hype, vague promises, and paragraphs that could fit any calculator site.',
  },
  {
    id: 'faq-schema',
    agent: 'FAQ And Schema Specialist',
    oneJob: 'Check visible FAQs, answer usefulness, structured-data alignment, common mistakes, and honest limits.',
    startWithWebResearch: true,
    tools: [
      'npm run aft -- seo-page-score <slug> <page>',
      'npm run aft -- page-seo <slug>',
      'npm run check:structured-data',
    ],
    output: 'page-score.md',
    evaluator: 'FAQ Schema Evaluator',
    evaluatorJob: 'Reject hidden FAQs, schema that does not match visible content, generic questions, or missing limits.',
  },
  {
    id: 'browser-proof',
    agent: 'Browser Proof Reviewer',
    oneJob: 'Open the exact local page in the in-app browser and save screenshot plus DOM proof for changed content.',
    startWithWebResearch: true,
    tools: [
      'in-app browser',
      'output/seo-tool-review/<slug>/<page>/browser-proof*.png',
      'output/seo-tool-review/<slug>/<page>/browser-proof*-dom.txt',
    ],
    output: 'browser-proof*.png and browser-proof*-dom.txt',
    evaluator: 'Visual Proof Evaluator',
    evaluatorJob: 'Reject stale proof, wrong URLs, missing screenshots, or proof that does not show the changed content.',
  },
  {
    id: 'final-judge',
    agent: 'Final SEO Judge',
    oneJob: 'Read all agent and evaluator evidence, list remaining gaps, and decide whether the page can ask for human approval.',
    startWithWebResearch: true,
    tools: [
      'node scripts/seo-agent-workbench.mjs judge <slug> <page>',
      'npm run aft -- seo-approval-status <slug>',
      'docs/seo-tool-review-queue.md',
    ],
    output: 'final-judge.md',
    evaluator: 'Human Approval Gatekeeper',
    evaluatorJob: 'Keep the next page blocked until the user approves the exact tool page or blog page.',
  },
];

const pageKinds = new Set(['tool', 'blog']);
const genericAnchorTexts = new Set([
  'click here',
  'here',
  'read more',
  'learn more',
  'website',
  'article',
  'this page',
  'more',
  'calculator',
  'tool',
  'guide',
]);

function absolute(relativePath) {
  return resolve(root, relativePath);
}

function normalizePage(page) {
  const normalized = String(page || 'tool').toLowerCase();
  return pageKinds.has(normalized) ? normalized : 'tool';
}

function ensureParent(relativePath) {
  mkdirSync(dirname(absolute(relativePath)), { recursive: true });
}

function readText(relativePath) {
  const file = absolute(relativePath);
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
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

function writeReports(basePath, report, markdown) {
  const jsonPath = `${basePath}.json`;
  const markdownPath = `${basePath}.md`;
  ensureParent(jsonPath);
  writeFileSync(absolute(jsonPath), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(absolute(markdownPath), markdown);
  return { jsonPath, markdownPath };
}

function routeFor(slug, page) {
  return page === 'blog' ? `/blog/how-to-use-${slug}/` : `/tools/${slug}/`;
}

function matchingRouteFor(slug, page) {
  return page === 'blog' ? `/tools/${slug}/` : `/blog/how-to-use-${slug}/`;
}

function builtPathFor(slug, page) {
  return page === 'blog'
    ? `dist/client/blog/how-to-use-${slug}/index.html`
    : `dist/client/tools/${slug}/index.html`;
}

function reviewDir(slug, page) {
  return `output/seo-tool-review/${slug}/${page}`;
}

function workbenchDir(slug, page) {
  return `output/seo-agents/${slug}/${page}`;
}

function listWorkbenchFiles(slug, page) {
  const dir = absolute(workbenchDir(slug, page));
  return existsSync(dir) ? readdirSync(dir) : [];
}

function listReviewFiles(slug, page) {
  const dir = absolute(reviewDir(slug, page));
  return existsSync(dir) ? readdirSync(dir) : [];
}

function reviewFileExists(slug, page, predicate) {
  return listReviewFiles(slug, page).some(predicate);
}

function stripHtml(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<([a-z0-9-]+)\b[^>]*aria-hidden=["']true["'][^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMainHtml(html = '') {
  return String(html).match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || String(html);
}

function extractInternalLinks(html = '') {
  const linkScope = extractMainHtml(html);
  return [...String(linkScope).matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      href: match[1],
      text: stripHtml(match[2]),
    }))
    .filter((link) => link.href.startsWith('/'));
}

function wordCount(text) {
  return String(text || '').split(/\s+/).filter(Boolean).length;
}

function isGenericAnchor(text) {
  const normalized = String(text || '').trim().toLowerCase();
  return genericAnchorTexts.has(normalized);
}

function repeatedAnchorWord(text) {
  const words = String(text || '').toLowerCase().match(/[a-z0-9]+/g) || [];
  if (words.length < 4) return false;
  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);
  return [...counts.values()].some((count) => count >= 3);
}

function parseScoreMarkdown(text) {
  const scoreMatch = String(text || '').match(/overall score:\s*(\d+)/i);
  const score = scoreMatch ? Number(scoreMatch[1]) : null;
  const issueLine = String(text || '').match(/issues:\s*(.+)/i)?.[1] || '';
  const warningLine = String(text || '').match(/warnings:\s*(.+)/i)?.[1] || '';
  const issues = issueLine && !/none/i.test(issueLine) ? issueLine : '';
  const warnings = warningLine && !/none/i.test(warningLine) ? warningLine : '';
  return { score, issues, warnings };
}

function reportStatusFromScore(score, issues = []) {
  if (issues.length) return 'blocked';
  if (typeof score === 'number' && score < 85) return 'attention';
  return 'pass';
}

export function buildSeoAgentPlanReport(slug, options = {}) {
  const page = normalizePage(options.page);
  const generatedAt = new Date().toISOString();
  const report = {
    kind: 'seo-agent-plan',
    status: 'ready',
    generatedAt,
    slug,
    page,
    route: routeFor(slug, page),
    matchingRoute: matchingRouteFor(slug, page),
    firstStepForEveryAgent: 'Do web/source research first, then run the page-specific local or paid evidence tool.',
    webResearchSources: SEO_WEB_RESEARCH_SOURCES,
    agents: SEO_AGENT_COUNCIL.map((agent, index) => ({
      order: index + 1,
      ...agent,
      pageCommand: agent.tools.map((tool) => tool.replaceAll('<slug>', slug).replaceAll('<page>', page)),
    })),
    approvalGate: {
      humanApprovalRequired: true,
      approvalRecord: 'docs/seo-tool-review-queue.md',
      nextPageBlockedUntilApproved: true,
    },
  };

  const markdown = renderAgentPlan(report);
  if (options.write !== false) {
    report.paths = writeReports(`${workbenchDir(slug, page)}/plan`, report, markdown);
  }
  return report;
}

export function buildSeoSourceEvidenceReport(slug, options = {}) {
  const page = normalizePage(options.page);
  const generatedAt = new Date().toISOString();
  const report = {
    kind: 'seo-agent-source-evidence',
    status: 'ready',
    generatedAt,
    slug,
    page,
    route: routeFor(slug, page),
    sources: SEO_WEB_RESEARCH_SOURCES,
    agentCheckpoints: SEO_AGENT_COUNCIL.map((agent) => ({
      agent: agent.agent,
      evaluator: agent.evaluator,
      mustStartWithWebResearch: agent.startWithWebResearch,
      sourceUse: sourceUseForAgent(agent.id),
    })),
    localDocs: [
      'docs/brand-code.md',
      'docs/seo-tool-review-workflow.md',
      'docs/seo-agent-workbench.md',
      'docs/dataforseo-knowledgebase-notes.md',
      'docs/recommended-agency-agents.md',
    ],
  };

  const markdown = renderSourceEvidence(report);
  if (options.write !== false) {
    report.paths = writeReports(`${workbenchDir(slug, page)}/source-evidence`, report, markdown);
  }
  return report;
}

export function buildSeoMicroAgentPlanReport(slug, options = {}) {
  const page = normalizePage(options.page);
  const groups = selectSeoMicroAgentGroups(page, options);
  const activeGroups = groups.filter((group) => group.status === 'active');
  const parkedGroups = groups.filter((group) => group.status === 'parked');
  const activeAgents = flattenSeoMicroAgents(activeGroups);
  const parkedAgents = flattenSeoMicroAgents(parkedGroups);
  const generatedAt = new Date().toISOString();
  const report = {
    kind: 'seo-micro-agent-plan',
    status: 'ready',
    generatedAt,
    slug,
    page,
    route: routeFor(slug, page),
    catalog: {
      groups: SEO_MICRO_AGENT_GROUPS.length,
      totalAgents: countSeoMicroAgents(),
      activeGroups: activeGroups.length,
      activeAgents: activeAgents.length,
      parkedGroups: parkedGroups.length,
      parkedAgents: parkedAgents.length,
    },
    rules: [
      'Every micro-agent owns one SEO question only.',
      'Every micro-agent gets an evaluator with the same narrow scope.',
      'Parked agents stay documented but do not slow the page review unless the page type needs them.',
      'The broad SEO agent council remains responsible for evidence, integration, final judgment, and human approval.',
    ],
    activeGroups,
    parkedGroups,
    activeAgents,
    parkedAgents,
  };

  const markdown = renderMicroAgentPlan(report);
  if (options.write !== false) {
    report.paths = writeReports(`${workbenchDir(slug, page)}/micro-agent-plan`, report, markdown);
  }
  return report;
}

export function buildSeoLinkAuditReport(slug, options = {}) {
  const page = normalizePage(options.page);
  const htmlPath = builtPathFor(slug, page);
  const html = options.html ?? readText(htmlPath);
  const links = extractInternalLinks(html);
  const matchingRoute = matchingRouteFor(slug, page);
  const matchingLinks = links.filter((link) => link.href === matchingRoute);
  const genericAnchors = links.filter((link) => isGenericAnchor(link.text));
  const stuffedAnchors = links.filter((link) => repeatedAnchorWord(link.text));
  const emptyAnchors = links.filter((link) => !link.text);
  const descriptiveLinks = links.filter((link) => wordCount(link.text) >= 3 && !isGenericAnchor(link.text));
  const issues = [];
  const warnings = [];

  if (!html) issues.push(`Built HTML is missing: ${htmlPath}`);
  if (!matchingLinks.length) issues.push(`Missing contextual link to matching page ${matchingRoute}`);
  if (emptyAnchors.length) issues.push(`${emptyAnchors.length} internal link(s) have empty anchor text`);
  if (genericAnchors.length) warnings.push(`${genericAnchors.length} generic internal anchor(s) found`);
  if (stuffedAnchors.length) warnings.push(`${stuffedAnchors.length} keyword-stuffed or repeated-word anchor(s) found`);
  if (links.length && descriptiveLinks.length / links.length < 0.35) {
    warnings.push('Fewer than 35% of internal anchors are descriptive multi-word anchors');
  }

  let score = 100;
  score -= issues.length * 25;
  score -= genericAnchors.length * 8;
  score -= stuffedAnchors.length * 10;
  if (links.length && descriptiveLinks.length / links.length < 0.35) score -= 8;
  score = Math.max(0, Math.min(100, score));

  const report = {
    kind: 'seo-agent-link-audit',
    status: reportStatusFromScore(score, issues),
    generatedAt: new Date().toISOString(),
    slug,
    page,
    route: routeFor(slug, page),
    matchingRoute,
    builtHtmlPath: htmlPath,
    score,
    summary: {
      internalLinks: links.length,
      descriptiveLinks: descriptiveLinks.length,
      matchingLinks: matchingLinks.length,
      genericAnchors: genericAnchors.length,
      stuffedAnchors: stuffedAnchors.length,
      emptyAnchors: emptyAnchors.length,
    },
    links,
    genericAnchors,
    stuffedAnchors,
    issues,
    warnings,
    evaluator: {
      agent: 'Contextual Internal Link Agent',
      evaluator: 'Anchor Text Evaluator',
      rule: 'Use descriptive, concise, relevant anchors with surrounding context; do not link every repeated keyword.',
    },
  };

  const markdown = renderLinkAudit(report);
  if (options.write !== false) {
    report.paths = writeReports(`${workbenchDir(slug, page)}/link-audit`, report, markdown);
  }
  return report;
}

export function buildSeoFinalJudgeReport(slug, options = {}) {
  const page = normalizePage(options.page);
  const generatedAt = new Date().toISOString();
  const reviewFiles = options.reviewFiles ?? listReviewFiles(slug, page);
  const workbenchFiles = options.workbenchFiles ?? listWorkbenchFiles(slug, page);
  const pageScoreJson = options.pageScoreJson ?? readJson(`${reviewDir(slug, page)}/page-score.json`);
  const pageScoreMd = options.pageScoreMarkdown ?? readText(`${reviewDir(slug, page)}/page-score.md`);
  const researchJson = options.researchJson ?? readJson(`${reviewDir(slug, page)}/research.json`);
  const linkAudit = options.linkAudit ?? buildSeoLinkAuditReport(slug, { page, write: false, html: options.html });
  const paidRequired = options.paidRequired !== false;
  const pageScore = pageScoreJson?.score?.overall ?? parseScoreMarkdown(pageScoreMd).score;
  const toneScore = researchJson?.tone?.score ?? pageScoreJson?.score?.sections?.tone ?? null;
  const faqScore = pageScoreJson?.score?.sections?.faqQuality ?? null;
  const proof = {
    sourceEvidence: workbenchFiles.includes('source-evidence.md') || Boolean(options.sourceEvidence),
    microPlan: workbenchFiles.includes('micro-agent-plan.md') || Boolean(options.microPlan),
    research: reviewFiles.includes('research.md') || Boolean(researchJson),
    paid: reviewFiles.includes('dataforseo-paid.md') || Boolean(options.paidEvidence),
    competitor: reviewFiles.some((name) => name.includes('competitor-gap')) || Boolean(options.competitorEvidence),
    pageScore: reviewFiles.includes('page-score.md') || Boolean(pageScoreJson),
    browserPng: reviewFiles.some((name) => name.includes('browser-proof') && name.endsWith('.png')) || Boolean(options.browserPng),
    browserDom: reviewFiles.some((name) => name.includes('browser-proof') && name.endsWith('dom.txt')) || Boolean(options.browserDom),
  };

  const evaluations = [
    evaluateAgent('web-source-research', proof.sourceEvidence, 'Source-evidence report exists for this page.', 'Run node scripts/seo-agent-workbench.mjs sources <slug> <page>.'),
    evaluateAgent(
      'search-intent-keywords',
      !paidRequired || proof.paid,
      'Paid DataForSEO evidence exists for this page.',
      'Run approved paid DataForSEO for this exact page.',
      'Paid DataForSEO evidence is missing for this page.',
    ),
    evaluateAgent('competitor-gap', proof.competitor, 'Competitor gap report exists.', 'Run competitor gap reports against approved competitor URLs.'),
    evaluateAgent('on-page-seo', proof.pageScore && pageScore !== null && pageScore >= 90, `Page score is ${pageScore ?? 'not enough data'}.`, 'Run npm run aft -- seo-page-score and fix SEO proof gaps.'),
    evaluateAgent('contextual-internal-links', linkAudit.status === 'pass', `Internal-link audit score is ${linkAudit.score}.`, 'Fix generic anchors or missing matching-page links.'),
    evaluateAgent('micro-agent-scope', proof.microPlan, 'Micro-agent plan exists for this page type.', 'Run node scripts/seo-agent-workbench.mjs micro-plan <slug> <page>.'),
    evaluateAgent('smart-14-voice', toneScore !== null && toneScore >= 90, `Tone score is ${toneScore ?? 'not enough data'}.`, 'Rewrite generic or hard-to-read copy using the brand voice.'),
    evaluateAgent('faq-schema', faqScore === null || faqScore >= 90, `FAQ score is ${faqScore ?? 'not enough data'}.`, 'Check visible FAQs, schema alignment, and useful limits.'),
    evaluateAgent('browser-proof', proof.browserPng && proof.browserDom, 'Screenshot and DOM proof exist.', 'Open the exact page in the in-app browser and save fresh proof.'),
  ];

  const blocked = evaluations.filter((item) => item.status === 'blocked');
  const attention = evaluations.filter((item) => item.status === 'attention');
  const finalStatus = blocked.length ? 'blocked' : attention.length ? 'attention' : 'ready-for-human-approval';
  const report = {
    kind: 'seo-agent-final-judge',
    status: finalStatus,
    generatedAt,
    slug,
    page,
    route: routeFor(slug, page),
    paidRequired,
    proof,
    pageScore,
    toneScore,
    faqScore,
    linkAudit: {
      status: linkAudit.status,
      score: linkAudit.score,
      issues: linkAudit.issues,
      warnings: linkAudit.warnings,
      path: linkAudit.paths?.markdownPath ?? `${workbenchDir(slug, page)}/link-audit.md`,
    },
    evaluations,
    remainingGaps: [...blocked, ...attention].map((item) => ({
      agent: item.agent,
      evaluator: item.evaluator,
      fix: item.fix,
    })),
    humanGate: {
      required: true,
      status: finalStatus === 'ready-for-human-approval' ? 'waiting-human-approval' : 'blocked-before-human-review',
      recordIn: 'docs/seo-tool-review-queue.md',
    },
  };

  const markdown = renderFinalJudge(report);
  if (options.write !== false) {
    report.paths = writeReports(`${workbenchDir(slug, page)}/final-judge`, report, markdown);
  }
  return report;
}

function evaluateAgent(id, condition, evidence, fix, blockedEvidence = evidence) {
  const agent = SEO_AGENT_COUNCIL.find((item) => item.id === id);
  return {
    id,
    agent: agent?.agent ?? id,
    evaluator: agent?.evaluator ?? 'Evaluator',
    status: condition ? 'pass' : 'blocked',
    evidence: condition ? evidence : blockedEvidence,
    fix,
  };
}

function renderAgentPlan(report) {
  const lines = [
    `# SEO Agent Workbench Plan: ${report.slug} ${report.page}`,
    '',
    `Generated: ${report.generatedAt}`,
    `Page: ${report.route}`,
    `Matching page: ${report.matchingRoute}`,
    '',
    '## First Rule',
    '',
    report.firstStepForEveryAgent,
    '',
    '## Web Research Sources',
    '',
    ...report.webResearchSources.map((source) => `- ${source.label}: ${source.url} - ${source.use}`),
    '',
    '## Agent Council',
    '',
    '| # | Agent | One job | Evaluator | Output |',
    '| - | - | - | - | - |',
    ...report.agents.map(
      (agent) => `| ${agent.order} | ${agent.agent} | ${agent.oneJob} | ${agent.evaluator} | ${agent.output} |`,
    ),
    '',
    '## Page Commands',
    '',
    ...report.agents.flatMap((agent) => [
      `### ${agent.agent}`,
      '',
      ...agent.pageCommand.map((command) => `- ${command}`),
      '',
    ]),
    '## Approval Gate',
    '',
    `Human approval required: ${report.approvalGate.humanApprovalRequired ? 'yes' : 'no'}`,
    `Record approvals in: ${report.approvalGate.approvalRecord}`,
  ];
  return `${lines.join('\n')}\n`;
}

function renderSourceEvidence(report) {
  const lines = [
    `# SEO Source Evidence: ${report.slug} ${report.page}`,
    '',
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Page: ${report.route}`,
    '',
    '## Public Sources',
    '',
    ...report.sources.map((source) => `- ${source.label}: ${source.url} - ${source.use}`),
    '',
    '## Local Docs',
    '',
    ...report.localDocs.map((doc) => `- ${doc}`),
    '',
    '## Agent Source Checkpoints',
    '',
    '| Agent | Evaluator | Source use |',
    '| - | - | - |',
    ...report.agentCheckpoints.map((item) => `| ${item.agent} | ${item.evaluator} | ${item.sourceUse} |`),
  ];
  return `${lines.join('\n')}\n`;
}

function renderMicroAgentPlan(report) {
  const lines = [
    `# SEO Micro-Agent Plan: ${report.slug} ${report.page}`,
    '',
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Page: ${report.route}`,
    '',
    '## Summary',
    '',
    `- Catalog groups: ${report.catalog.groups}`,
    `- Total micro-agents: ${report.catalog.totalAgents}`,
    `- Active groups for this page: ${report.catalog.activeGroups}`,
    `- Active micro-agents for this page: ${report.catalog.activeAgents}`,
    `- Parked groups for this page: ${report.catalog.parkedGroups}`,
    `- Parked micro-agents for this page: ${report.catalog.parkedAgents}`,
    '',
    '## Rules',
    '',
    ...report.rules.map((rule) => `- ${rule}`),
    '',
    '## Active Groups',
    '',
    ...report.activeGroups.flatMap((group) => [
      `### ${group.title}`,
      '',
      `Reason: ${group.reason}`,
      '',
      '| Micro-agent | One job | Evaluator |',
      '| - | - | - |',
      ...group.agents.map((agent) => `| ${agent.name} | ${agent.job} | ${agent.evaluator} |`),
      '',
    ]),
    '## Parked Groups',
    '',
    ...report.parkedGroups.map((group) => `- ${group.title}: ${group.reason} (${group.agents.length} agents)`),
  ];
  return `${lines.join('\n')}\n`;
}

function renderLinkAudit(report) {
  const lines = [
    `# SEO Agent Link Audit: ${report.slug} ${report.page}`,
    '',
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Score: ${report.score}`,
    `Page: ${report.route}`,
    `Matching page required: ${report.matchingRoute}`,
    `Built HTML: ${report.builtHtmlPath}`,
    '',
    '## Summary',
    '',
    `- Internal links: ${report.summary.internalLinks}`,
    `- Descriptive links: ${report.summary.descriptiveLinks}`,
    `- Matching-page links: ${report.summary.matchingLinks}`,
    `- Generic anchors: ${report.summary.genericAnchors}`,
    `- Repeated-word anchors: ${report.summary.stuffedAnchors}`,
    `- Empty anchors: ${report.summary.emptyAnchors}`,
    '',
    '## Issues',
    '',
    report.issues.length ? report.issues.map((issue) => `- ${issue}`).join('\n') : '- none',
    '',
    '## Warnings',
    '',
    report.warnings.length ? report.warnings.map((warning) => `- ${warning}`).join('\n') : '- none',
    '',
    '## Internal Links',
    '',
    ...report.links.map((link) => `- ${link.text || '(empty)'} -> ${link.href}`),
  ];
  return `${lines.join('\n')}\n`;
}

function renderFinalJudge(report) {
  const lines = [
    `# Final SEO Judge: ${report.slug} ${report.page}`,
    '',
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Page: ${report.route}`,
    `Paid DataForSEO required: ${report.paidRequired ? 'yes' : 'no'}`,
    '',
    '## Scores',
    '',
    `- Page score: ${report.pageScore ?? 'not enough data'}`,
    `- Tone score: ${report.toneScore ?? 'not enough data'}`,
    `- FAQ score: ${report.faqScore ?? 'not enough data'}`,
    `- Internal-link score: ${report.linkAudit.score}`,
    '',
    '## Agent Evaluations',
    '',
    '| Agent | Evaluator | Status | Evidence | Fix if blocked |',
    '| - | - | - | - | - |',
    ...report.evaluations.map(
      (item) => `| ${item.agent} | ${item.evaluator} | ${item.status} | ${item.evidence} | ${item.status === 'pass' ? 'none' : item.fix} |`,
    ),
    '',
    '## Remaining Gaps',
    '',
    report.remainingGaps.length
      ? report.remainingGaps.map((gap) => `- ${gap.agent}: ${gap.fix}`).join('\n')
      : '- none',
    '',
    '## Human Gate',
    '',
    `- Required: ${report.humanGate.required ? 'yes' : 'no'}`,
    `- Status: ${report.humanGate.status}`,
    `- Record in: ${report.humanGate.recordIn}`,
  ];
  return `${lines.join('\n')}\n`;
}

export function runSeoAgentWorkbench(argv = process.argv.slice(2)) {
  const [command = 'plan', slug, pageArg] = argv;
  if (!slug) {
    throw new Error('Usage: node scripts/seo-agent-workbench.mjs <plan|sources|micro-plan|links|judge|all> <slug> <tool|blog>');
  }

  const page = normalizePage(pageArg);
  if (command === 'plan') return buildSeoAgentPlanReport(slug, { page });
  if (command === 'sources') return buildSeoSourceEvidenceReport(slug, { page });
  if (command === 'micro-plan') return buildSeoMicroAgentPlanReport(slug, { page });
  if (command === 'links') return buildSeoLinkAuditReport(slug, { page });
  if (command === 'judge') return buildSeoFinalJudgeReport(slug, { page });
  if (command === 'all') {
    const plan = buildSeoAgentPlanReport(slug, { page });
    const sources = buildSeoSourceEvidenceReport(slug, { page });
    const microPlan = buildSeoMicroAgentPlanReport(slug, { page });
    const linkAudit = buildSeoLinkAuditReport(slug, { page });
    const judge = buildSeoFinalJudgeReport(slug, { page, linkAudit, sourceEvidence: true, microPlan: true });
    return {
      kind: 'seo-agent-workbench-all',
      status: judge.status,
      slug,
      page,
      paths: {
        plan: plan.paths,
        sourceEvidence: sources.paths,
        microPlan: microPlan.paths,
        linkAudit: linkAudit.paths,
        finalJudge: judge.paths,
      },
      summary: {
        agents: SEO_AGENT_COUNCIL.length,
        microAgents: microPlan.catalog.activeAgents,
        parkedMicroAgents: microPlan.catalog.parkedAgents,
        linkScore: linkAudit.score,
        judgeStatus: judge.status,
        remainingGaps: judge.remainingGaps.length,
      },
    };
  }

  throw new Error(`Unknown SEO agent workbench command: ${command}`);
}

function sourceUseForAgent(agentId) {
  if (agentId === 'contextual-internal-links') return 'Google Link Best Practices decides anchor text and link-stuffing rules.';
  if (agentId === 'micro-agent-scope') return 'Google Search Central source areas decide which narrow micro-agent groups are relevant to the page type.';
  if (agentId === 'smart-14-voice') return 'Google Helpful Content plus Access Free Tools brand voice decides whether copy helps people.';
  if (agentId === 'search-intent-keywords') return 'DataForSEO and Search Console evidence decide keyword and intent choices.';
  if (agentId === 'competitor-gap') return 'Competitor pages provide topic gaps only; original wording is required.';
  if (agentId === 'final-judge') return 'All source, local, paid, competitor, score, and browser evidence must be present before human approval.';
  return 'Google Search Central and local Access Free Tools docs set the default evidence standard.';
}
