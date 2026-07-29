import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  askAuditCases,
  buildAgentDoctorReport,
  buildAgentRouteReport,
  buildApiReadyReport,
  buildClaimCheckReport,
  buildContentQualityReport,
  buildEvidencePackReport,
  buildLinkHelperReport,
  buildSeoConsoleReport,
  buildToolBriefReport,
  extractToolRecords,
  runClaimCheckReport,
} from './agent-tools-report.mjs';

const preservedFiles = new Map();
const preservedEnv = new Map();

function preserveAndWrite(relativePath, content) {
  const absolutePath = resolve(process.cwd(), relativePath);
  if (!preservedFiles.has(absolutePath)) {
    preservedFiles.set(absolutePath, {
      content: existsSync(absolutePath) ? readFileSync(absolutePath, 'utf8') : '',
      existed: existsSync(absolutePath),
    });
  }

  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content);
}

function temporarilyRemoveFile(relativePath) {
  const absolutePath = resolve(process.cwd(), relativePath);
  if (!preservedFiles.has(absolutePath)) {
    preservedFiles.set(absolutePath, {
      content: existsSync(absolutePath) ? readFileSync(absolutePath, 'utf8') : '',
      existed: existsSync(absolutePath),
    });
  }
  rmSync(absolutePath, { force: true });
}

function preserveEnv(name, value) {
  if (!preservedEnv.has(name)) preservedEnv.set(name, process.env[name]);
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function removeDirectoryIfEmpty(relativePath) {
  const absolutePath = resolve(process.cwd(), relativePath);
  if (!existsSync(absolutePath)) return;
  if (readdirSync(absolutePath).length === 0) rmSync(absolutePath, { force: true, recursive: true });
}

describe('agent tools reports', () => {
  beforeEach(() => {
    preserveEnv('AFT_AGENT_TOOLS_DIST_ROOT', resolve(process.cwd(), '.agent-tools-test-dist'));
  });

  afterEach(() => {
    rmSync(resolve(process.cwd(), 'dist/test-link-fixture'), { force: true, recursive: true });
    rmSync(resolve(process.cwd(), 'dist/client/test-link-fixture'), { force: true, recursive: true });
    rmSync(resolve(process.cwd(), '.agent-tools-test-dist'), { force: true, recursive: true });
    rmSync(resolve(process.cwd(), '.agent-tools-test-missing-dist'), { force: true, recursive: true });
    rmSync(resolve(process.cwd(), '.agent-tools-test-local-analytics'), { force: true, recursive: true });
    removeDirectoryIfEmpty('dist');
    rmSync(resolve(process.cwd(), 'output/agent-tools-test'), { force: true, recursive: true });
    rmSync(resolve(process.cwd(), 'output/agent-tools/test-proof'), { force: true, recursive: true });
    for (const [absolutePath, original] of preservedFiles.entries()) {
      if (original.existed) {
        mkdirSync(dirname(absolutePath), { recursive: true });
        writeFileSync(absolutePath, original.content);
      } else {
        rmSync(absolutePath, { force: true });
      }
    }
    preservedFiles.clear();
    for (const [name, original] of preservedEnv.entries()) {
      if (original === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = original;
      }
    }
    preservedEnv.clear();
  });

  it('keeps Ask audit fixtures focused on deterministic tool-runner parity', () => {
    expect(askAuditCases.map((testCase) => testCase.slug)).toEqual([
      'percentage-calculator',
      'download-time-calculator',
      'watts-to-amps-calculator',
      'concrete-calculator',
    ]);
    expect(askAuditCases.find((testCase) => testCase.slug === 'percentage-calculator')?.expected).toContain('43.2');
    expect(askAuditCases.find((testCase) => testCase.slug === 'download-time-calculator')?.expected).toContain('9m 16s');
  });

  it('extracts source tool records for registry expansion scoring', () => {
    const tools = extractToolRecords();
    const percentage = tools.find((tool) => tool.slug === 'percentage-calculator');

    expect(tools.length).toBeGreaterThan(250);
    expect(percentage?.exampleCount).toBeGreaterThanOrEqual(3);
    expect(percentage?.faqCount).toBeGreaterThanOrEqual(6);
  });

  it('ranks API candidates without removing existing API-ready tools', () => {
    const report = buildApiReadyReport();

    expect(report.currentApiTools).toContain('percentage-calculator');
    expect(report.currentApiTools).toContain('download-time-calculator');
    expect(report.recommendedNext.length).toBeGreaterThan(0);
    expect(report.recommendedNext.every((tool) => tool.slug !== 'percentage-calculator')).toBe(true);
  });

  it('flags generic, agent-facing, and link-poor content', () => {
    const report = buildContentQualityReport(
      [
        '# Ultimate guide',
        '',
        'This Medium post should seamlessly unlock the power of calculators for everyone.',
        '',
        'Use a calculator for better results.',
      ].join('\n'),
      { file: 'output/promotion/medium/bad-draft.md' },
    );

    expect(report.status).toBe('fail');
    expect(report.issues.join(' ')).toMatch(/Generic filler/i);
    expect(report.issues.join(' ')).toMatch(/Agent-facing text/i);
    expect(report.issues.join(' ')).toMatch(/Missing useful internal links/i);
    expect(report.issues.join(' ')).toMatch(/No concrete example/i);
  });

  it('passes useful disclosed promotion copy with concrete examples and internal links', () => {
    const report = buildContentQualityReport(
      [
        '# How to check a discount before you buy',
        '',
        'A discount can look good until the final price is still higher than your budget. Here is a quick way to check the number before you buy.',
        '',
        '## Example',
        '',
        'If a $240 item is 18% off, the discount is $43.20 and the new price is $196.80.',
        '',
        'Use the calculator here: https://accessfreetools.com/tools/percentage-calculator/',
        '',
        'The full guide is here: https://accessfreetools.com/blog/how-to-use-percentage-calculator/',
        '',
        'Disclosure: I work on Access Free Tools.',
      ].join('\n'),
      { file: 'output/promotion/medium/good-draft.md' },
    );

    expect(report.issues).toEqual([]);
    expect(report.accessLinks).toHaveLength(2);
  });

  it('routes agent tasks to local docs, specialist lenses, proof commands, and gates', () => {
    const report = buildAgentRouteReport('Improve Wallpaper Calculator indexing and internal links');

    expect(report.status).toBe('pass');
    expect(report.lane).toBe('seo');
    expect(report.routingRulesPath).toBe('docs/agent-routing-rules.json');
    expect(report.primaryLens).toContain('SEO Specialist');
    expect(report.proofLens).toContain('Evidence Collector');
    expect(report.docs).toContain('docs/recommended-agency-agents.md');
    expect(report.commands).toContain('npm run aft -- seo-console');
    expect(report.approvalGates).toContain('No public posting, paid research, deployment, or account changes without exact approval.');
  });

  it('builds an evidence pack for a lane with docs, commands, and source status', () => {
    const report = buildEvidencePackReport('api');

    expect(report.kind).toBe('evidence-pack');
    expect(report.lane).toBe('api');
    expect(report.docs).toContain('docs/ask-api-mcp-alpha.md');
    expect(report.commands).toContain('npm run aft -- ask-audit');
    expect(report.sources.some((source) => source.path === 'output/agent-tools/ask-audit/latest.json')).toBe(true);
    expect(report.paths.markdownPath).toBe('output/agent-tools-test/evidence-pack/latest.md');
  });

  it('claim-check fails done claims that do not include proof evidence', () => {
    const report = buildClaimCheckReport('The Medium post is fixed and live now.');

    expect(report.status).toBe('fail');
    expect(report.claimType).toBe('live-or-done');
    expect(report.issues.join(' ')).toMatch(/No proof evidence/i);
    expect(report.requiredProof).toContain('public URL');
  });

  it('claim-check fails claims that cite a missing generated proof path', () => {
    const report = buildClaimCheckReport(
      'The post is live at https://medium.com/@accessfreetools/example and screenshot proof is in output/promotion/medium/example.png',
    );

    expect(report.status).toBe('fail');
    expect(report.issues.join(' ')).toMatch(/Proof path not found/i);
    expect(report.evidence.outputPathChecks).toContainEqual({
      exists: false,
      path: 'output/promotion/medium/example.png',
    });
  });

  it('claim-check passes claims with a public URL and existing generated proof path', () => {
    const proofPath = 'output/agent-tools/test-proof/claim-proof.txt';
    const absoluteProofPath = resolve(process.cwd(), proofPath);
    mkdirSync(dirname(absoluteProofPath), { recursive: true });
    writeFileSync(absoluteProofPath, 'verified screenshot placeholder\n');

    const report = buildClaimCheckReport(
      `The post is live at https://medium.com/@accessfreetools/example and screenshot proof is in ${proofPath}`,
    );

    expect(existsSync(absoluteProofPath)).toBe(true);
    expect(report.status).toBe('pass');
    expect(report.evidence.publicUrls).toContain('https://medium.com/@accessfreetools/example');
    expect(report.evidence.outputPaths).toContain(proofPath);
    expect(report.evidence.outputPathChecks).toContainEqual({ exists: true, path: proofPath });
  });

  it('claim-check can verify public URLs when explicitly requested', async () => {
    const report = await runClaimCheckReport('The public fix is live at https://example.com/broken', {
      checkUrl: async (url) => ({ ok: false, status: 404, url }),
      verifyUrls: true,
    });

    expect(report.status).toBe('fail');
    expect(report.evidence.publicUrlChecks).toContainEqual({
      ok: false,
      status: 404,
      url: 'https://example.com/broken',
    });
    expect(report.issues.join(' ')).toMatch(/Public URL did not verify/i);
  });

  it('creates a tool brief with tool, guide, API, sitemap, and proof gaps', () => {
    const report = buildToolBriefReport('percentage-calculator');

    expect(report.kind).toBe('tool-brief');
    expect(report.slug).toBe('percentage-calculator');
    expect(report.tool?.name).toMatch(/percentage/i);
    expect(report.guide.exists).toBe(true);
    expect(report.api.ready).toBe(true);
    expect(report.deepReview.status).toBe('deep-reviewed');
    expect(report.related.count).toBeGreaterThan(0);
    expect(report.searchConsole.url).toBe('https://accessfreetools.com/tools/percentage-calculator/');
    expect(report.nextProofCommands).toContain('npm run aft -- page-seo percentage-calculator');
    expect(report.nextProofCommands).toContain('npm run analytics:production');
  });

  it('does not recommend completed SEO recovery pages or monitor-only sitemap rows', () => {
    preserveAndWrite(
      'output/search-console/performance-latest.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-02T00:00:00.000Z',
          totals: { deindexedRows: 2, pageClicks: 0, pageImpressions: 500 },
          tierARecovery: [
            {
              action: 'recover',
              evidenceFound: true,
              path: '/blog/how-to-use-proved-calculator/',
              rationale: 'already has final judge proof',
            },
          ],
          opportunities: {
            highImpressionZeroClickPages: [
              { impressions: 235, path: '/sitemap/' },
              { impressions: 316, path: '/blog/' },
              { impressions: 200, path: '/tools/open-calculator/' },
            ],
          },
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      'output/seo-agents/proved-calculator/blog/final-judge.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-02T01:00:00.000Z',
          remainingGaps: [],
          route: '/blog/how-to-use-proved-calculator/',
          status: 'ready-for-human-approval',
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      'docs/seo-console-completions.json',
      JSON.stringify(
        {
          completed: [
            {
              completedAt: '2026-07-02T01:00:00.000Z',
              evidence: ['output/seo-tool-review/blog-index/browser-proof.json'],
              note: 'hub CTR proof covers this export',
              path: '/blog/',
            },
          ],
        },
        null,
        2,
      ),
    );
    preserveAndWrite('output/agent-tools/seo-console/latest.json', '{}\n');
    preserveAndWrite('output/agent-tools/seo-console/latest.md', '# placeholder\n');

    const report = buildSeoConsoleReport();
    const actionText = report.actions.map((action) => action.task).join('\n');

    expect(actionText).not.toContain('/blog/how-to-use-proved-calculator/');
    expect(actionText).not.toContain('/sitemap/');
    expect(actionText).not.toContain('for /blog/ (316 impressions, 0 clicks)');
    expect(actionText).toContain('/tools/open-calculator/');
    expect(report.performanceExport.completed).toContainEqual(
      expect.objectContaining({ path: '/blog/how-to-use-proved-calculator/' }),
    );
    expect(report.performanceExport.completed).toContainEqual(expect.objectContaining({ path: '/sitemap/' }));
    expect(report.performanceExport.completed).toContainEqual(expect.objectContaining({ path: '/blog/' }));
  });

  it('reopens tracked SEO console completions when a newer GSC export still shows the issue', () => {
    preserveAndWrite(
      'output/search-console/performance-latest.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-03T00:00:00.000Z',
          totals: { pageClicks: 0, pageImpressions: 500 },
          opportunities: {
            highImpressionZeroClickPages: [{ impressions: 316, path: '/blog/' }],
          },
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      'docs/seo-console-completions.json',
      JSON.stringify(
        {
          completed: [
            {
              completedAt: '2026-07-02T01:00:00.000Z',
              evidence: ['output/seo-tool-review/blog-index/browser-proof.json'],
              path: '/blog/',
            },
          ],
        },
        null,
        2,
      ),
    );
    preserveAndWrite('output/agent-tools/seo-console/latest.json', '{}\n');
    preserveAndWrite('output/agent-tools/seo-console/latest.md', '# placeholder\n');

    const report = buildSeoConsoleReport();
    const actionText = report.actions.map((action) => action.task).join('\n');

    expect(actionText).toContain('for /blog/ (316 impressions, 0 clicks)');
    expect(report.performanceExport.completed).not.toContainEqual(expect.objectContaining({ path: '/blog/' }));
  });

  it('keeps tracked SEO console completions closed when the same GSC export is reimported later', () => {
    preserveAndWrite(
      'output/search-console/performance-latest.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-03T00:00:00.000Z',
          source: { dataDate: '2026-07-02' },
          totals: { pageClicks: 0, pageImpressions: 500 },
          opportunities: {
            highImpressionZeroClickPages: [{ impressions: 316, path: '/blog/' }],
          },
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      'docs/seo-console-completions.json',
      JSON.stringify(
        {
          completed: [
            {
              completedAt: '2026-07-02T23:50:00+10:00',
              evidence: ['output/seo-tool-review/blog-index/browser-proof.json'],
              path: '/blog/',
            },
          ],
        },
        null,
        2,
      ),
    );

    const report = buildSeoConsoleReport();
    const actionText = report.actions.map((action) => action.task).join('\n');

    expect(actionText).not.toContain('for /blog/ (316 impressions, 0 clicks)');
    expect(report.performanceExport.completed).toContainEqual(expect.objectContaining({ path: '/blog/' }));
  });

  it('uses request-indexing proof before recommending repeated Search Console clicks', () => {
    preserveAndWrite(
      'output/search-console-url-inspection.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-02T15:15:00.000Z',
          inspections: [
            {
              coverageState: 'Crawled - currently not indexed',
              inspectionUrl: 'https://accessfreetools.com/tools/percentage-calculator/',
              lastCrawlTime: '2026-07-01T00:00:00Z',
            },
          ],
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      'output/search-console-discovery.json',
      JSON.stringify({ generatedAt: '2026-07-02T15:14:00.000Z' }, null, 2),
    );
    preserveAndWrite(
      'docs/search-console-indexing-requests.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-02T15:20:00.000Z',
          requests: [
            {
              requestedAt: '2026-07-03T01:20:00+10:00',
              result: 'indexing-requested',
              url: 'https://accessfreetools.com/tools/percentage-calculator/',
            },
          ],
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      'output/marketing-orchestrator/daily-plan.json',
      JSON.stringify(
        {
          recommendations: [
            {
              priority: 'High',
              title: 'Recheck requested indexing after Google crawls',
            },
          ],
        },
        null,
        2,
      ),
    );
    preserveAndWrite('output/agent-tools/seo-console/latest.json', '{}\n');
    preserveAndWrite('output/agent-tools/seo-console/latest.md', '# placeholder\n');
    for (const index of [1, 2, 3]) {
      preserveAndWrite(
        `.agent-tools-test-dist/test-link-fixture/source-${index}/index.html`,
        '<a href="/tools/percentage-calculator/">Percentage calculator</a>\n',
      );
    }

    const report = buildSeoConsoleReport();
    const actionText = report.actions.map((action) => action.task).join('\n');

    expect(actionText).toContain('Search Console UI request-indexing was submitted');
    expect(actionText).toContain('recheck after Google crawls');
    expect(report.actions).toContainEqual(
      expect.objectContaining({
        priority: 'monitor',
        task: expect.stringContaining('do not repeat Search Console clicks'),
      }),
    );
    expect(report.actions).not.toContainEqual(
      expect.objectContaining({
        priority: 'High',
        task: 'Recheck requested indexing after Google crawls',
      }),
    );
    expect(actionText).not.toContain('request indexing manually');
  });

  it('does not count mirrored dist client HTML as fake public client routes', () => {
    preserveEnv('AFT_AGENT_TOOLS_DIST_ROOT', resolve(process.cwd(), '.agent-tools-test-dist'));
    preserveAndWrite(
      'output/search-console-url-inspection.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-02T15:15:00.000Z',
          inspections: [
            {
              coverageState: 'Crawled - currently not indexed',
              inspectionUrl: 'https://accessfreetools.com/tools/percentage-calculator/',
              lastCrawlTime: '2026-07-01T00:00:00Z',
            },
          ],
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      'docs/search-console-indexing-requests.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-02T15:20:00.000Z',
          requests: [
            {
              requestedAt: '2026-07-03T01:20:00+10:00',
              result: 'indexing-requested',
              url: 'https://accessfreetools.com/tools/percentage-calculator/',
            },
          ],
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      '.agent-tools-test-dist/test-link-fixture/source/index.html',
      '<a href="/tools/percentage-calculator/">Percentage calculator</a>\n',
    );
    preserveAndWrite(
      '.agent-tools-test-dist/client/test-link-fixture/source/index.html',
      '<a href="/tools/percentage-calculator/">Percentage calculator</a>\n',
    );

    const report = buildLinkHelperReport();
    const rows = report.linkEvidence.byTarget['/tools/percentage-calculator/'];

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      anchorText: 'Percentage calculator',
      source: '/test-link-fixture/source/',
    });
    expect(JSON.stringify(rows)).not.toContain('/client/');
  });

  it('does not infer zero internal links when dist was intentionally cleaned', () => {
    preserveEnv('AFT_AGENT_TOOLS_DIST_ROOT', resolve(process.cwd(), '.agent-tools-test-missing-dist'));
    temporarilyRemoveFile('output/search-console-coverage-export.json');
    temporarilyRemoveFile('output/search-console/performance-latest.json');
    temporarilyRemoveFile('output/marketing-orchestrator/daily-plan.json');
    preserveAndWrite(
      'output/search-console-url-inspection.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-02T15:15:00.000Z',
          inspections: [
            {
              coverageState: 'Crawled - currently not indexed',
              inspectionUrl: 'https://accessfreetools.com/tools/percentage-calculator/',
              lastCrawlTime: '2026-07-01T00:00:00Z',
            },
          ],
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      'docs/search-console-indexing-requests.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-02T15:20:00.000Z',
          requests: [
            {
              requestedAt: '2026-07-03T01:20:00+10:00',
              result: 'indexing-requested',
              url: 'https://accessfreetools.com/tools/percentage-calculator/',
            },
          ],
        },
        null,
        2,
      ),
    );

    const seoConsoleReport = buildSeoConsoleReport();
    const actionText = seoConsoleReport.actions.map((action) => action.task).join('\n');
    const linkHelperReport = buildLinkHelperReport();
    const suggestionText = linkHelperReport.suggestions.map((suggestion) => suggestion.reason).join('\n');

    expect(actionText).toContain('Search Console UI request-indexing was submitted');
    expect(actionText).toContain('built link proof is unavailable until npm run build');
    expect(actionText).not.toContain('only 0 source pages');
    expect(actionText).not.toContain('Improve contextual links');
    expect(seoConsoleReport.status).toBe('not enough data');
    expect(suggestionText).toContain('built link counts are unavailable until npm run build');
    expect(suggestionText).not.toContain('only 0 built pages');
    expect(suggestionText).not.toContain('add contextual support first');
    expect(linkHelperReport.status).toBe('not enough data');
  });

  it('reuses a recent built-link snapshot after safe cleanup removes dist', () => {
    preserveAndWrite(
      'output/search-console-url-inspection.json',
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          inspections: [
            {
              coverageState: 'Crawled - currently not indexed',
              inspectionUrl: 'https://accessfreetools.com/tools/percentage-calculator/',
              lastCrawlTime: '2026-07-01T00:00:00Z',
            },
          ],
        },
        null,
        2,
      ),
    );
    temporarilyRemoveFile('docs/search-console-indexing-requests.json');
    for (const index of [1, 2, 3]) {
      preserveAndWrite(
        `.agent-tools-test-dist/test-link-fixture/source-${index}/index.html`,
        '<a href="/tools/percentage-calculator/">Percentage calculator</a>\n',
      );
    }

    const builtReport = buildLinkHelperReport();
    expect(builtReport.linkEvidence.source).toBe('current-build');
    rmSync(resolve(process.cwd(), '.agent-tools-test-dist'), { force: true, recursive: true });

    const cleanedReport = buildLinkHelperReport();
    const cleanedSeoConsoleReport = buildSeoConsoleReport();
    const suggestion = cleanedReport.suggestions.find(
      (item) => item.target === '/tools/percentage-calculator/',
    );
    const seoAction = cleanedSeoConsoleReport.actions.find((item) =>
      item.task.includes('https://accessfreetools.com/tools/percentage-calculator/'),
    );

    expect(cleanedReport.linkEvidence.source).toBe('saved-build');
    expect(cleanedReport.linkEvidence.note).toMatch(/Using saved built-link proof/);
    expect(cleanedReport.linkEvidence.byTarget['/tools/percentage-calculator/']).toHaveLength(3);
    expect(suggestion).toMatchObject({ action: 'monitor', priority: 'medium' });
    expect(suggestion?.reason).toMatch(/3 built pages already link here/);
    expect(seoAction).toMatchObject({ priority: 'medium' });
    expect(seoAction?.task).toMatch(/built link proof already shows 3 source pages/);
    expect(seoAction?.task).not.toMatch(/Run npm run build|Improve contextual links/);
    expect(seoAction?.task).not.toMatch(/still shows unknown/);
  });

  it('does not use local QA events as SEO demand evidence', () => {
    preserveEnv('AFT_ANALYTICS_DIR', '.agent-tools-test-local-analytics');
    preserveEnv('AFT_PRODUCTION_ANALYTICS_REPORT_PATH', 'output/agent-tools-test/missing-production.json');
    preserveAndWrite(
      '.agent-tools-test-local-analytics/events.ndjson',
      `${JSON.stringify({ toolSlug: 'local-only-tool', type: 'tool_action' })}\n`,
    );
    temporarilyRemoveFile('output/agent-tools-test/missing-production.json');

    const report = buildLinkHelperReport();
    const suggestionTargets = report.suggestions.map((suggestion) => suggestion.target);

    expect(suggestionTargets).not.toContain('/tools/local-only-tool/');
    expect(report.sources.analytics.source).toBe('production-aggregate');
    expect(report.sources.analytics.note).toMatch(/production analytics aggregate is missing/i);
  });

  it('uses a fresh privacy-safe production aggregate for usage recommendations', () => {
    const productionPath = 'output/agent-tools-test/production-analytics.json';
    preserveEnv('AFT_PRODUCTION_ANALYTICS_REPORT_PATH', productionPath);
    preserveAndWrite(
      productionPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          summary: {
            topPages: [{ count: 7, label: 'Production tool', path: '/tools/production-only-tool/' }],
            topTools: [
              { count: 5, label: 'Production tool', path: '/tools/production-only-tool/', slug: 'production-only-tool' },
            ],
          },
        },
        null,
        2,
      ),
    );

    const report = buildLinkHelperReport();
    const suggestion = report.suggestions.find((item) => item.target === '/tools/production-only-tool/');

    expect(suggestion?.reason).toMatch(/Production analytics recorded 5 tool actions/);
    expect(report.sources.analytics).toMatchObject({
      generatedAt: expect.any(String),
      note: '',
      reportPath: productionPath,
      source: 'production-aggregate',
    });
  });

  it('does not turn monitor-only or completed CrawlScout rows into link tasks', () => {
    preserveAndWrite(
      'output/crawlscout/crawlscout-summary.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-02T00:00:00.000Z',
          pageSample: [
            { clicks: 0, impressions: 188, path: '/sitemap/', status: 'Not Indexed' },
            { clicks: 0, impressions: 63, path: '/blog/how-to-use-proved-calculator/', status: 'Not Indexed' },
            { clicks: 0, impressions: 55, path: '/tools/open-calculator/', status: 'Not Indexed' },
          ],
          topKeywordSignals: [],
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      'output/seo-agents/proved-calculator/blog/final-judge.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-02T01:00:00.000Z',
          remainingGaps: [],
          route: '/blog/how-to-use-proved-calculator/',
          status: 'ready-for-human-approval',
        },
        null,
        2,
      ),
    );

    const report = buildLinkHelperReport();
    const suggestionText = report.suggestions.map((suggestion) => suggestion.target).join('\n');

    expect(suggestionText).not.toContain('/sitemap/');
    expect(suggestionText).not.toContain('/blog/how-to-use-proved-calculator/');
    expect(suggestionText).toContain('/tools/open-calculator/');
    expect(report.sources.crawlScout.completed).toContainEqual(expect.objectContaining({ path: '/sitemap/' }));
    expect(report.sources.crawlScout.completed).toContainEqual(
      expect.objectContaining({ path: '/blog/how-to-use-proved-calculator/' }),
    );
  });

  it('reopens CrawlScout rows when only stale final judge proof exists', () => {
    preserveAndWrite(
      'output/crawlscout/crawlscout-summary.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-03T00:00:00.000Z',
          pageSample: [{ clicks: 0, impressions: 57, path: '/blog/how-to-use-proved-calculator/', status: 'Not Indexed' }],
          source: { dataDate: '2026-07-03' },
          topKeywordSignals: [],
        },
        null,
        2,
      ),
    );
    preserveAndWrite(
      'output/seo-agents/proved-calculator/blog/final-judge.json',
      JSON.stringify(
        {
          generatedAt: '2026-07-01T23:00:00.000Z',
          remainingGaps: [],
          route: '/blog/how-to-use-proved-calculator/',
          status: 'ready-for-human-approval',
        },
        null,
        2,
      ),
    );

    const report = buildLinkHelperReport();
    const suggestionText = report.suggestions.map((suggestion) => suggestion.target).join('\n');

    expect(suggestionText).toContain('/blog/how-to-use-proved-calculator/');
    expect(report.sources.crawlScout.completed).not.toContainEqual(
      expect.objectContaining({ path: '/blog/how-to-use-proved-calculator/' }),
    );
  });

  it('recognizes generated utility blog guides in tool briefs', () => {
    const report = buildToolBriefReport('wallpaper-calculator');

    expect(report.kind).toBe('tool-brief');
    expect(report.guide.exists).toBe(true);
    expect(report.issues).toEqual([]);
  });

  it('agent doctor checks the agent operating docs and command surface', () => {
    const report = buildAgentDoctorReport();

    expect(report.kind).toBe('agent-doctor');
    expect(report.docs.some((doc) => doc.path === 'docs/recommended-agency-agents.md' && doc.present)).toBe(true);
    expect(report.checks.some((check) => check.id === 'aft-route-command')).toBe(true);
    expect(report.checks.some((check) => check.id === 'routing-rules-config' && check.ok)).toBe(true);
    expect(report.commands).toContain('npm run aft -- status');
  });
});

