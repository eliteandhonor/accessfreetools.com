import { afterEach, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  askAuditCases,
  buildAgentDoctorReport,
  buildAgentRouteReport,
  buildApiReadyReport,
  buildClaimCheckReport,
  buildContentQualityReport,
  buildEvidencePackReport,
  buildSeoConsoleReport,
  buildToolBriefReport,
  extractToolRecords,
  runClaimCheckReport,
} from './agent-tools-report.mjs';

const preservedFiles = new Map();

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

describe('agent tools reports', () => {
  afterEach(() => {
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
    expect(report.paths.markdownPath).toBe('output/agent-tools/evidence-pack/latest.md');
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
    expect(report.nextProofCommands).toContain('npm run aft -- usage-summary');
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
    preserveAndWrite('output/agent-tools/seo-console/latest.json', '{}\n');
    preserveAndWrite('output/agent-tools/seo-console/latest.md', '# placeholder\n');

    const report = buildSeoConsoleReport();
    const actionText = report.actions.map((action) => action.task).join('\n');

    expect(actionText).toContain('Search Console UI request-indexing was submitted');
    expect(actionText).toContain('recheck after Google crawls');
    expect(actionText).not.toContain('request indexing manually');
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

