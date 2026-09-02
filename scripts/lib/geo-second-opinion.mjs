export const GEO_SECOND_OPINION_SOURCE = Object.freeze({
  name: 'geo-seo-claude',
  repository: 'https://github.com/zubair-trabzada/geo-seo-claude',
  commit: '5d068e9ca34f50789b68de2a5029ac04aad8cdaa',
  reviewedCommitUrl: 'https://github.com/zubair-trabzada/geo-seo-claude/commit/5d068e9ca34f50789b68de2a5029ac04aad8cdaa',
  adoption: 'Ideas reviewed; no upstream code, installer, dependency, agent, or prompt is bundled.',
});

export const DEFAULT_GEO_PAGES = Object.freeze([
  { route: '/', kind: 'home' },
  { route: '/tools/', kind: 'hub' },
  { route: '/free-calculator-resources/', kind: 'hub' },
  { route: '/categories/ai-tools/', kind: 'hub' },
  { route: '/tools/kawaii-calculator/', kind: 'tool', changePolicy: 'protected-observation' },
  { route: '/tools/json-to-csv-converter/', kind: 'tool' },
  { route: '/tools/text-to-speech-audiobook-generator/', kind: 'tool' },
  { route: '/blog/browser-text-to-speech-kokoro-vs-supertonic/', kind: 'editorial' },
  { route: '/blog/remove-ai-writing-tells-before-publishing/', kind: 'editorial' },
  { route: '/developers/mcp/', kind: 'developer' },
]);

const PRODUCTION_HOSTS = new Set(['accessfreetools.com', 'www.accessfreetools.com']);
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);
export const SOURCE_HEADING_PATTERN_SOURCE = '^(?:(?:sources?|references?)(?:\\s+(?:i|we)\\s+checked)?|further reading|what i checked)$';

export function isSourcesHeading(value) {
  return new RegExp(SOURCE_HEADING_PATTERN_SOURCE, 'i').test(String(value ?? '').trim());
}

function parseUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function isAllowedAuditBaseUrl(value) {
  const url = parseUrl(value);
  if (!url || url.username || url.password || url.search || url.hash) {
    return false;
  }

  if (url.protocol === 'https:' && PRODUCTION_HOSTS.has(url.hostname)) {
    return true;
  }

  return url.protocol === 'http:' && LOOPBACK_HOSTS.has(url.hostname);
}

export function isAllowedPageRequest(value, baseUrl) {
  if (/^(?:data|blob|about):/i.test(value)) {
    return true;
  }

  const resource = parseUrl(value);
  const base = parseUrl(baseUrl);
  return Boolean(resource && base && resource.origin === base.origin);
}

function finding(code, kind, message, level = 'review') {
  return { code, kind, level, message };
}

function canonicalMatchesRoute(canonical, route) {
  const url = parseUrl(canonical);
  if (!url || !PRODUCTION_HOSTS.has(url.hostname)) {
    return false;
  }

  return url.pathname === route && !url.search && !url.hash;
}

function finalPathMatchesRoute(finalUrl, route) {
  const url = parseUrl(finalUrl);
  return Boolean(url && url.pathname === route);
}

function inferPageKind(evidence) {
  if (evidence.kind) return evidence.kind;
  const configured = DEFAULT_GEO_PAGES.find((page) => page.route === evidence.route);
  if (configured) return configured.kind;
  if (evidence.route.startsWith('/blog/')) return 'editorial';
  if (evidence.route.startsWith('/tools/')) return 'tool';
  return 'page';
}

function inferChangePolicy(evidence) {
  if (evidence.changePolicy) return evidence.changePolicy;
  return DEFAULT_GEO_PAGES.find((page) => page.route === evidence.route)?.changePolicy ?? 'review-only';
}

function pageTypeThresholds(kind) {
  if (kind === 'editorial') return { openingMinimum: 25, passageMinimum: 3, sectionMinimum: 3 };
  if (kind === 'tool' || kind === 'developer') {
    return { openingMinimum: 15, passageMinimum: 1, sectionMinimum: 2 };
  }
  return { openingMinimum: 10, passageMinimum: 0, sectionMinimum: 3 };
}

function scoreSignals(evidence, kind) {
  const thresholds = pageTypeThresholds(kind);
  const sections = {
    technicalFoundation: 0,
    answerStructure: 0,
    discovery: 0,
    trustAndEvidence: 0,
  };

  if (evidence.status === 200) sections.technicalFoundation += 5;
  if (canonicalMatchesRoute(evidence.canonical, evidence.route)) sections.technicalFoundation += 5;
  if (evidence.h1?.length === 1) sections.technicalFoundation += 5;
  if (evidence.mainVisible && evidence.mainWordCount > 0) sections.technicalFoundation += 5;
  if (evidence.invalidJsonLdCount === 0 && evidence.jsonLdTypes?.length > 0) {
    sections.technicalFoundation += 5;
  }

  if (evidence.firstParagraphWordCount >= thresholds.openingMinimum && evidence.firstParagraphWordCount <= 140) {
    sections.answerStructure += 6;
  }
  if (evidence.sectionCount >= thresholds.sectionMinimum) sections.answerStructure += 5;
  if (
    (thresholds.passageMinimum === 0 && evidence.sectionCount >= thresholds.sectionMinimum)
    || (thresholds.passageMinimum > 0 && evidence.selfContainedPassageCount >= thresholds.passageMinimum)
  ) {
    sections.answerStructure += 8;
  }
  if ((evidence.listCount ?? 0) + (evidence.tableCount ?? 0) > 0) sections.answerStructure += 3;
  if (evidence.headings?.some((heading) => heading.level === 2 || heading.level === 3)) {
    sections.answerStructure += 3;
  }

  if (evidence.internalLinkCount >= 3) sections.discovery += 7;
  if (!/\bnoindex\b/i.test(evidence.robots ?? '')) sections.discovery += 5;
  if (evidence.mainWordCount >= 250) sections.discovery += 5;
  if (evidence.lang) sections.discovery += 3;
  if (finalPathMatchesRoute(evidence.finalUrl, evidence.route)) sections.discovery += 5;

  if (kind === 'editorial') {
    if (evidence.externalSourceCount >= 1) sections.trustAndEvidence += 7;
    if (evidence.paragraphsWithNumbers >= 1) sections.trustAndEvidence += 5;
    if (evidence.sectionsWithExternalSources >= 1) sections.trustAndEvidence += 4;
    if (evidence.hasSourcesSection) sections.trustAndEvidence += 4;
    if (evidence.hasAuthorSignal) sections.trustAndEvidence += 3;
    if (evidence.hasPublishedOrModifiedDate) sections.trustAndEvidence += 2;
  } else if (kind === 'home' || kind === 'hub') {
    if (evidence.internalLinkCount >= 10) sections.trustAndEvidence += 8;
    if (evidence.mainWordCount >= 300) sections.trustAndEvidence += 5;
    if ((evidence.listCount ?? 0) + (evidence.tableCount ?? 0) > 0) sections.trustAndEvidence += 5;
    if (evidence.jsonLdTypes?.length > 0) sections.trustAndEvidence += 4;
    if (evidence.sectionCount >= thresholds.sectionMinimum) sections.trustAndEvidence += 3;
  } else {
    if (evidence.externalSourceCount >= 1) sections.trustAndEvidence += 4;
    if (evidence.paragraphsWithNumbers >= 1) sections.trustAndEvidence += 6;
    if ((evidence.listCount ?? 0) + (evidence.tableCount ?? 0) > 0) sections.trustAndEvidence += 5;
    if (evidence.jsonLdTypes?.length > 0) sections.trustAndEvidence += 5;
    if (evidence.hasSourcesSection || evidence.sectionsWithExternalSources >= 1) {
      sections.trustAndEvidence += 3;
    }
    if (evidence.hasAuthorSignal || evidence.hasPublishedOrModifiedDate) sections.trustAndEvidence += 2;
  }

  const score = Math.min(100, Object.values(sections).reduce((sum, value) => sum + value, 0));
  const rating = score >= 80
    ? 'strong-signals'
    : score >= 60
      ? 'mixed-signals'
      : 'needs-review';

  return { score, rating, sections };
}

function technicalFindings(evidence) {
  const findings = [];
  if (evidence.status !== 200) {
    findings.push(finding('http-status', 'technical', `Rendered request returned HTTP ${evidence.status || 'unknown'}.`, 'warning'));
  }
  if (!finalPathMatchesRoute(evidence.finalUrl, evidence.route)) {
    findings.push(finding('unexpected-final-path', 'technical', 'The rendered browser ended on a different path.', 'warning'));
  }
  if (!evidence.lang) {
    findings.push(finding('missing-language', 'technical', 'The rendered HTML has no document language.', 'warning'));
  }
  if (!evidence.title) {
    findings.push(finding('missing-title', 'technical', 'The rendered page has no title.', 'warning'));
  }
  if (!evidence.description) {
    findings.push(finding('missing-description', 'technical', 'The rendered page has no meta description.', 'warning'));
  }
  if (!evidence.canonical) {
    findings.push(finding('missing-canonical', 'technical', 'The rendered page has no canonical URL.', 'warning'));
  } else if (!canonicalMatchesRoute(evidence.canonical, evidence.route)) {
    findings.push(finding('canonical-mismatch', 'technical', 'The canonical URL does not match the expected production route.', 'warning'));
  }
  if (evidence.h1?.length !== 1) {
    findings.push(finding('h1-count', 'technical', `Expected one rendered H1 and found ${evidence.h1?.length ?? 0}.`, 'warning'));
  }
  if (!evidence.mainVisible || evidence.mainWordCount === 0) {
    findings.push(finding('main-not-visible', 'technical', 'The rendered main content is missing or not visible.', 'warning'));
  }
  if (evidence.invalidJsonLdCount > 0) {
    findings.push(finding('invalid-json-ld', 'technical', `${evidence.invalidJsonLdCount} JSON-LD block(s) could not be parsed.`, 'warning'));
  }
  return findings;
}

function heuristicFindings(evidence, kind) {
  const findings = [];
  const thresholds = pageTypeThresholds(kind);
  if (evidence.firstParagraphWordCount < thresholds.openingMinimum) {
    findings.push(finding('thin-opening-context', 'heuristic', 'The first useful paragraph may be too short to establish the page answer or purpose.'));
  } else if (evidence.firstParagraphWordCount > 140) {
    findings.push(finding('long-opening-context', 'heuristic', 'The first useful paragraph may be doing too many jobs before the page is easy to scan.'));
  }
  if (thresholds.passageMinimum > 0 && evidence.selfContainedPassageCount < thresholds.passageMinimum) {
    findings.push(finding('few-self-contained-passages', 'heuristic', 'Few paragraphs fall inside the broad 40 to 180 word review range. Check whether key explanations stand on their own.'));
  }
  if (evidence.sectionCount < 2) {
    findings.push(finding('limited-section-structure', 'heuristic', 'The page has little section structure for readers scanning a specific question.'));
  }
  if (evidence.internalLinkCount < 3) {
    findings.push(finding('limited-contextual-discovery', 'heuristic', 'The rendered main content contains fewer than three internal links. Check whether a useful next step is missing.'));
  }
  if (kind === 'editorial' && evidence.externalSourceCount === 0) {
    findings.push(finding('no-editorial-sources', 'heuristic', 'No external source link was found in this owner-written article. Verify whether factual claims need primary sources.'));
  }
  if (kind === 'editorial' && !evidence.hasAuthorSignal) {
    findings.push(finding('no-author-signal', 'heuristic', 'No visible or structured author signal was detected for this article.'));
  }
  if (!['home', 'hub'].includes(kind) && evidence.paragraphsWithNumbers === 0) {
    findings.push(finding('no-concrete-number-signal', 'heuristic', 'No paragraph contains a number. This is only a prompt to check for useful examples, not a requirement to add statistics.'));
  }
  if (evidence.externalSourceCount > 0 && !evidence.hasSourcesSection && kind === 'editorial') {
    findings.push(finding('sources-not-grouped', 'heuristic', 'External sources exist, but no clearly labeled sources or references section was detected.'));
  }
  return findings;
}

function sanitizeEvidence(evidence) {
  return {
    route: evidence.route,
    kind: inferPageKind(evidence),
    changePolicy: inferChangePolicy(evidence),
    finalPath: parseUrl(evidence.finalUrl)?.pathname ?? '',
    status: evidence.status,
    lang: evidence.lang,
    title: evidence.title,
    descriptionLength: evidence.description?.length ?? 0,
    canonical: evidence.canonical,
    robots: evidence.robots,
    h1: evidence.h1 ?? [],
    headings: evidence.headings ?? [],
    mainVisible: Boolean(evidence.mainVisible),
    mainWordCount: evidence.mainWordCount ?? 0,
    mainTextHash: evidence.mainTextHash ?? '',
    firstParagraphWordCount: evidence.firstParagraphWordCount ?? 0,
    paragraphWordCounts: evidence.paragraphWordCounts ?? [],
    selfContainedPassageCount: evidence.selfContainedPassageCount ?? 0,
    paragraphsWithNumbers: evidence.paragraphsWithNumbers ?? 0,
    sectionCount: evidence.sectionCount ?? 0,
    sectionsWithExternalSources: evidence.sectionsWithExternalSources ?? 0,
    internalLinkCount: evidence.internalLinkCount ?? 0,
    externalSourceCount: evidence.externalSourceCount ?? 0,
    externalSourceHosts: evidence.externalSourceHosts ?? [],
    listCount: evidence.listCount ?? 0,
    tableCount: evidence.tableCount ?? 0,
    hasAuthorSignal: Boolean(evidence.hasAuthorSignal),
    hasPublishedOrModifiedDate: Boolean(evidence.hasPublishedOrModifiedDate),
    hasSourcesSection: Boolean(evidence.hasSourcesSection),
    jsonLdTypes: evidence.jsonLdTypes ?? [],
    invalidJsonLdCount: evidence.invalidJsonLdCount ?? 0,
    blockedExternalRequestCount: evidence.blockedExternalRequestCount ?? 0,
    elapsedMs: evidence.elapsedMs ?? 0,
  };
}

export function analyzeRenderedPage(evidence) {
  const kind = inferPageKind(evidence);
  const changePolicy = inferChangePolicy(evidence);
  const heuristic = scoreSignals(evidence, kind);
  const reviewPrompts = heuristicFindings(evidence, kind);
  const protectedObservation = changePolicy === 'protected-observation';
  return {
    route: evidence.route,
    kind,
    changePolicy,
    evidence: sanitizeEvidence(evidence),
    technicalFindings: technicalFindings(evidence),
    heuristic: {
      label: 'heuristic-second-opinion',
      ...heuristic,
    },
    heuristicFindings: protectedObservation ? [] : reviewPrompts,
    suppressedHeuristicFindings: protectedObservation ? reviewPrompts : [],
    disclaimer: 'This diagnostic is not a ranking prediction, citation probability, or release approval.',
  };
}

export function buildGeoSecondOpinionSummary({ pages, generatedAt = new Date().toISOString(), run = {} }) {
  const technicalFindingCount = pages.reduce((sum, page) => sum + page.technicalFindings.length, 0);
  const heuristicFindingCount = pages.reduce((sum, page) => sum + page.heuristicFindings.length, 0);
  const suppressedHeuristicFindingCount = pages.reduce(
    (sum, page) => sum + (page.suppressedHeuristicFindings?.length ?? 0),
    0,
  );
  const operationalStatus = pages.length > 0
    && pages.every((page) => Number.isFinite(page.evidence.status) && page.evidence.status > 0)
    ? 'complete'
    : 'incomplete';

  return {
    kind: 'geo-second-opinion',
    generatedAt,
    operationalStatus,
    releaseGate: false,
    approvalStatus: 'not-applicable',
    source: GEO_SECOND_OPINION_SOURCE,
    methodology: {
      renderer: 'Playwright Chromium',
      externalRequests: 'blocked',
      contentStorage: 'counts, hashes, headings, and metadata only; complete page bodies are not written',
      interpretation: 'All numeric scores and passage ranges are heuristic editorial prompts.',
      authority: 'Search Console, Bing, OpenSEO, and production analytics remain outcome evidence.',
    },
    run,
    totals: {
      pages: pages.length,
      technicalFindings: technicalFindingCount,
      heuristicFindings: heuristicFindingCount,
      suppressedHeuristicFindings: suppressedHeuristicFindingCount,
      averageHeuristicScore: pages.length
        ? Math.round(pages.reduce((sum, page) => sum + page.heuristic.score, 0) / pages.length)
        : 0,
    },
    pages,
  };
}

function markdownEscape(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function renderGeoSecondOpinionMarkdown(report) {
  const lines = [
    '# GEO Second-Opinion Audit',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '## Heuristic, Not A Ranking Prediction',
    '',
    'This report cannot approve a page, predict rankings, or prove that an AI system will cite it. It is a read-only editorial and rendering diagnostic. Search Console, Bing, OpenSEO, and production analytics remain the outcome evidence.',
    '',
    '## Run Summary',
    '',
    `- Operational status: ${report.operationalStatus}`,
    `- Pages rendered: ${report.totals.pages}`,
    `- Technical observations: ${report.totals.technicalFindings}`,
    `- Heuristic review prompts: ${report.totals.heuristicFindings}`,
    `- Suppressed prompts on protected pages: ${report.totals.suppressedHeuristicFindings}`,
    `- Average heuristic signal score: ${report.totals.averageHeuristicScore}/100`,
    `- Release gate: no`,
    `- External browser requests: ${report.methodology.externalRequests}`,
    `- Stored evidence: ${report.methodology.contentStorage}`,
    '',
    '## Reviewed Source',
    '',
    `- Repository: ${report.source.repository}`,
    `- Reviewed commit: ${report.source.commit}`,
    `- Adoption boundary: ${report.source.adoption}`,
    '',
    '## Page Results',
    '',
    '| Route | Policy | Technical | Heuristic | Review prompts | Words | Internal links | Sources |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |',
  ];

  for (const page of report.pages) {
    lines.push(`| ${markdownEscape(page.route)} | ${page.changePolicy} | ${page.technicalFindings.length} | ${page.heuristic.score}/100 (${page.heuristic.rating}) | ${page.heuristicFindings.length} | ${page.evidence.mainWordCount} | ${page.evidence.internalLinkCount} | ${page.evidence.externalSourceCount} |`);
  }

  for (const page of report.pages.filter((item) => item.technicalFindings.length || item.heuristicFindings.length)) {
    lines.push('', `### ${page.route}`, '');
    for (const item of page.technicalFindings) {
      lines.push(`- Technical [${item.code}]: ${item.message}`);
    }
    for (const item of page.heuristicFindings) {
      lines.push(`- Heuristic [${item.code}]: ${item.message}`);
    }
  }

  lines.push(
    '',
    '## Interpretation Rules',
    '',
    '- Investigate technical observations against built HTML and the existing SEO workbench.',
    '- Treat heuristic prompts as questions for a human reviewer, not instructions to add words, numbers, or sources.',
    '- Do not rewrite, submit, noindex, or publish a page from this report alone.',
    '- Do not compare scores across unrelated page types as though they were search performance metrics.',
    '',
  );

  return lines.join('\n');
}
