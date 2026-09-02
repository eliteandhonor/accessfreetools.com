import { describe, expect, it } from 'vitest';

import {
  DEFAULT_GEO_PAGES,
  GEO_SECOND_OPINION_SOURCE,
  analyzeRenderedPage,
  buildGeoSecondOpinionSummary,
  isSourcesHeading,
  isAllowedAuditBaseUrl,
  isAllowedPageRequest,
  renderGeoSecondOpinionMarkdown,
} from './geo-second-opinion.mjs';

function makeEvidence(overrides = {}) {
  return {
    route: '/blog/example/',
    requestedUrl: 'http://127.0.0.1:4321/blog/example/',
    finalUrl: 'http://127.0.0.1:4321/blog/example/',
    status: 200,
    lang: 'en',
    title: 'A useful example article',
    description: 'A practical description of the example article and what the reader will learn.',
    canonical: 'https://accessfreetools.com/blog/example/',
    robots: 'index,follow',
    h1: ['A useful example article'],
    headings: [
      { level: 1, text: 'A useful example article' },
      { level: 2, text: 'Quick answer' },
      { level: 2, text: 'What I tested' },
      { level: 2, text: 'Sources' },
    ],
    mainVisible: true,
    mainWordCount: 780,
    mainTextHash: 'a'.repeat(64),
    firstParagraphWordCount: 76,
    paragraphWordCounts: [76, 91, 64, 113, 58],
    selfContainedPassageCount: 5,
    paragraphsWithNumbers: 2,
    sectionCount: 3,
    sectionsWithExternalSources: 2,
    internalLinkCount: 6,
    externalSourceCount: 4,
    externalSourceHosts: ['developers.google.com', 'playwright.dev'],
    listCount: 2,
    tableCount: 1,
    hasAuthorSignal: true,
    hasPublishedOrModifiedDate: true,
    hasSourcesSection: true,
    jsonLdTypes: ['BlogPosting', 'BreadcrumbList'],
    invalidJsonLdCount: 0,
    blockedExternalRequestCount: 0,
    elapsedMs: 120,
    ...overrides,
  };
}

describe('GEO second-opinion audit', () => {
  it('pins the reviewed upstream source and audits exactly ten representative pages', () => {
    expect(GEO_SECOND_OPINION_SOURCE.commit).toBe('5d068e9ca34f50789b68de2a5029ac04aad8cdaa');
    expect(DEFAULT_GEO_PAGES).toHaveLength(10);
    expect(new Set(DEFAULT_GEO_PAGES.map((page) => page.route)).size).toBe(10);
    expect(DEFAULT_GEO_PAGES.map((page) => page.route)).toEqual(
      expect.arrayContaining([
        '/',
        '/tools/',
        '/tools/kawaii-calculator/',
        '/tools/text-to-speech-audiobook-generator/',
        '/blog/browser-text-to-speech-kokoro-vs-supertonic/',
        '/developers/mcp/',
      ]),
    );
  });

  it('allows only loopback previews and the Access Free Tools production origins', () => {
    expect(isAllowedAuditBaseUrl('http://127.0.0.1:4321')).toBe(true);
    expect(isAllowedAuditBaseUrl('http://localhost:4321')).toBe(true);
    expect(isAllowedAuditBaseUrl('https://accessfreetools.com')).toBe(true);
    expect(isAllowedAuditBaseUrl('https://www.accessfreetools.com')).toBe(true);
    expect(isAllowedAuditBaseUrl('http://accessfreetools.com')).toBe(false);
    expect(isAllowedAuditBaseUrl('http://192.168.1.20:4321')).toBe(false);
    expect(isAllowedAuditBaseUrl('https://example.com')).toBe(false);
  });

  it('blocks third-party browser requests while allowing same-origin and inert URLs', () => {
    const baseUrl = 'http://127.0.0.1:4321';
    expect(isAllowedPageRequest('http://127.0.0.1:4321/_astro/app.js', baseUrl)).toBe(true);
    expect(isAllowedPageRequest('data:image/png;base64,AA==', baseUrl)).toBe(true);
    expect(isAllowedPageRequest('blob:http://127.0.0.1:4321/id', baseUrl)).toBe(true);
    expect(isAllowedPageRequest('https://www.clarity.ms/tag/example', baseUrl)).toBe(false);
    expect(isAllowedPageRequest('https://resources.infolinks.com/js/infolinks_main.js', baseUrl)).toBe(false);
  });

  it('produces a clearly labeled heuristic review without retaining page body text', () => {
    const result = analyzeRenderedPage(makeEvidence());

    expect(result.evidence.mainText).toBeUndefined();
    expect(result.heuristic.label).toBe('heuristic-second-opinion');
    expect(result.heuristic.score).toBeGreaterThanOrEqual(80);
    expect(result.heuristic.rating).toBe('strong-signals');
    expect(result.technicalFindings).toEqual([]);
    expect(result.disclaimer).toContain('not a ranking prediction');
  });

  it('separates technical observations from heuristic writing suggestions', () => {
    const result = analyzeRenderedPage(makeEvidence({
      status: 404,
      canonical: '',
      h1: [],
      mainVisible: false,
      invalidJsonLdCount: 1,
      firstParagraphWordCount: 8,
      selfContainedPassageCount: 0,
      hasSourcesSection: false,
    }));

    expect(result.technicalFindings.map((finding) => finding.code)).toEqual(
      expect.arrayContaining(['http-status', 'missing-canonical', 'h1-count', 'main-not-visible', 'invalid-json-ld']),
    );
    expect(result.heuristicFindings.map((finding) => finding.code)).toContain('thin-opening-context');
    expect(result.heuristicFindings.every((finding) => finding.kind === 'heuristic')).toBe(true);
  });

  it('does not apply long-form passage and number expectations to navigation hubs', () => {
    const result = analyzeRenderedPage(makeEvidence({
      route: '/tools/',
      kind: 'hub',
      firstParagraphWordCount: 14,
      selfContainedPassageCount: 0,
      paragraphsWithNumbers: 0,
      externalSourceCount: 0,
      externalSourceHosts: [],
      hasSourcesSection: false,
      hasAuthorSignal: false,
      hasPublishedOrModifiedDate: false,
    }));

    const codes = result.heuristicFindings.map((finding) => finding.code);
    expect(codes).not.toContain('thin-opening-context');
    expect(codes).not.toContain('few-self-contained-passages');
    expect(codes).not.toContain('no-concrete-number-signal');
  });

  it('recognizes natural source heading variants used by owner-written articles', () => {
    expect(isSourcesHeading('Sources')).toBe(true);
    expect(isSourcesHeading('Sources I checked')).toBe(true);
    expect(isSourcesHeading('What I checked')).toBe(true);
    expect(isSourcesHeading('Related tools')).toBe(false);
  });

  it('keeps heuristic prompts from becoming work on protected observation pages', () => {
    const result = analyzeRenderedPage(makeEvidence({
      route: '/tools/kawaii-calculator/',
      kind: 'tool',
      changePolicy: 'protected-observation',
      selfContainedPassageCount: 0,
    }));

    expect(result.changePolicy).toBe('protected-observation');
    expect(result.heuristicFindings).toEqual([]);
    expect(result.suppressedHeuristicFindings.map((finding) => finding.code)).toContain(
      'few-self-contained-passages',
    );
  });

  it('summarizes findings without turning the diagnostic into a release gate', () => {
    const pages = [
      analyzeRenderedPage(makeEvidence()),
      analyzeRenderedPage(makeEvidence({
        route: '/tools/example/',
        requestedUrl: 'http://127.0.0.1:4321/tools/example/',
        finalUrl: 'http://127.0.0.1:4321/tools/example/',
        hasSourcesSection: false,
        externalSourceCount: 0,
        externalSourceHosts: [],
      })),
    ];
    const summary = buildGeoSecondOpinionSummary({ pages, generatedAt: '2026-09-02T00:00:00.000Z' });
    const markdown = renderGeoSecondOpinionMarkdown(summary);

    expect(summary.releaseGate).toBe(false);
    expect(summary.operationalStatus).toBe('complete');
    expect(summary.source.commit).toBe(GEO_SECOND_OPINION_SOURCE.commit);
    expect(markdown).toContain('Heuristic, Not A Ranking Prediction');
    expect(markdown).toContain('This report cannot approve a page');
    expect(markdown).not.toContain('mainText');
  });
});
