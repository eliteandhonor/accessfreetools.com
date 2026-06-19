import { describe, expect, it } from 'vitest';

import {
  buildSeoApprovalStatusReport,
  buildSeoCompetitorGapReport,
  buildSeoPageScoreReport,
  buildSeoToolQueueReport,
  buildSeoToolResearchReport,
  SEO_REVIEW_AGENTS,
} from './seo-tool-review.mjs';

describe('seo tool/page review lane', () => {
  it('builds a page-level queue for every canonical tool and guide', () => {
    const report = buildSeoToolQueueReport({ trackerText: '', write: false });

    expect(report.kind).toBe('seo-tool-queue');
    expect(report.status).toBe('pass');
    expect(report.summary.tools).toBeGreaterThan(250);
    expect(report.summary.pages).toBe(report.summary.tools * 2);
    expect(report.summary.remainingPages).toBe(report.summary.pages);
    expect(report.summary.approvedPages).toBe(0);
    expect(report.summary.approvalUnit).toBe('page');
    expect(report.summary.firstPage).toBe('wallpaper-calculator:tool');
    expect(report.approvalGate.blocked).toBe(false);

    const wallpaperEntries = report.entries.filter((entry) => entry.slug === 'wallpaper-calculator');
    expect(wallpaperEntries.map((entry) => entry.page).sort()).toEqual(['blog', 'tool']);
    expect(wallpaperEntries.every((entry) => entry.approvalRequired)).toBe(true);
    expect(report.entries[0].slug).toBe('wallpaper-calculator');
  });

  it('skips approved pages when choosing the next actionable queue item', () => {
    const report = buildSeoToolQueueReport({
      trackerText: `
| slug | page | status | approved by | approved at | proof | notes |
| wallpaper-calculator | tool | approved | human | 2026-06-16 | output/seo-tool-review/wallpaper-calculator/tool/page-score.md | tool passed |
| wallpaper-calculator | blog | approved | human | 2026-06-16 | output/seo-tool-review/wallpaper-calculator/blog/page-score.md | blog passed |
`,
      write: false,
    });

    expect(report.status).toBe('pass');
    expect(report.summary.approvedPages).toBe(2);
    expect(report.summary.remainingPages).toBe(report.summary.pages - 2);
    expect(report.summary.firstPage).not.toContain('wallpaper-calculator');
    expect(report.entries.some((entry) => entry.slug === 'wallpaper-calculator')).toBe(false);
  });

  it('surfaces an active approval gate before ranked future pages', () => {
    const report = buildSeoToolQueueReport({
      trackerText: `
| slug | page | status | approved by | approved at | proof | notes |
| text-case-converter | tool | approved | human | 2026-06-19 | output/seo-tool-review/text-case-converter/tool/page-score.md | tool passed |
| text-case-converter | blog | edited |  |  | output/seo-tool-review/text-case-converter/blog/page-score.md | blog still needs paid evidence and approval |
`,
      write: false,
    });

    expect(report.status).toBe('blocked');
    expect(report.summary.firstPage).toBe('text-case-converter:blog');
    expect(report.approvalGate).toMatchObject({
      blocked: true,
      slug: 'text-case-converter',
      page: 'blog',
      status: 'edited',
    });
    expect(report.approvalGate.reason).toContain('record explicit human approval');
    expect(report.entries[0].slug).toBe('wallpaper-calculator');
  });

  it('creates a one-page research pack with agents, proof commands, and paid research guards', () => {
    const report = buildSeoToolResearchReport('wallpaper-calculator', { page: 'tool', write: false });

    expect(report.kind).toBe('seo-tool-research');
    expect(report.slug).toBe('wallpaper-calculator');
    expect(report.page).toBe('tool');
    expect(report.url).toBe('https://accessfreetools.com/tools/wallpaper-calculator/');
    expect(report.agents.map((agent) => agent.name)).toEqual(SEO_REVIEW_AGENTS.map((agent) => agent.name));
    expect(report.approval.required).toBe(true);
    expect(report.approval.unit).toBe('tool');
    expect(report.paidResearch.allowed).toBe(false);
    expect(report.paidResearch.requiresApproval).toBe(true);
    expect(report.source.faqCount).toBeGreaterThanOrEqual(6);
    expect(report.source.seoDescription).toContain('wallpaper rolls');
    expect(report.proofCommands).toContain('npm run aft -- page-seo wallpaper-calculator');
    expect(report.proofCommands).toContain('npm run aft -- tool-brief wallpaper-calculator');
    expect(report.browserProof.url).toBe('/tools/wallpaper-calculator/');
    expect(report.tone.genericHits).not.toContain('simple tool');
  });

  it('scores competitor pages from supplied HTML and keeps paid research blocked by default', () => {
    const html = `<!doctype html>
      <html>
        <head>
          <title>Percentage Calculator - Examples and Formula</title>
          <meta name="description" content="Calculate percentages with examples, formula notes, and common mistakes.">
          <script type="application/ld+json">{"@type":"FAQPage"}</script>
        </head>
        <body>
          <h1>Percentage Calculator</h1>
          <h2>How to use this calculator</h2>
          <p>Example: 15% of 200 is 30. Formula: part / whole x 100. Avoid mixing percent and decimal values.</p>
          <h2>What is a percentage?</h2>
          <p>A percentage is a part out of 100.</p>
          <h2>Can I use this for discounts?</h2>
          <p>Yes, use it for sale prices and tax estimates.</p>
        </body>
      </html>`;

    const report = buildSeoCompetitorGapReport('percentage-calculator', {
      page: 'tool',
      urls: ['https://competitor.example/percentage-calculator'],
      htmlByUrl: {
        'https://competitor.example/percentage-calculator': html,
      },
      write: false,
    });

    expect(report.kind).toBe('seo-competitor-gap');
    expect(report.paidResearch.allowed).toBe(false);
    expect(report.paidResearch.requiresApproval).toBe(true);
    expect(report.competitors).toHaveLength(1);
    expect(report.competitors[0].score.overall).toBeGreaterThan(60);
    expect(report.competitors[0].faq.count).toBeGreaterThanOrEqual(2);
    expect(report.opportunities.some((item) => item.toLowerCase().includes('example'))).toBe(true);
    expect(report.copyPolicy).toContain('Do not copy');
  });

  it('scores our page for SEO fit, specificity, FAQs, links, tone, trust, and proof', () => {
    const report = buildSeoPageScoreReport('percentage-calculator', { page: 'tool', write: false });

    expect(report.kind).toBe('seo-page-score');
    expect(report.slug).toBe('percentage-calculator');
    expect(report.page).toBe('tool');
    expect(report.score.overall).toBeGreaterThan(0);
    expect(report.score.sections).toHaveProperty('seoFit');
    expect(report.score.sections).toHaveProperty('toolSpecificity');
    expect(report.score.sections).toHaveProperty('faqQuality');
    expect(report.score.sections).toHaveProperty('internalLinks');
    expect(report.score.sections).toHaveProperty('tone');
    expect(report.score.sections).toHaveProperty('trustAndLimits');
    expect(report.score.sections).toHaveProperty('builtProof');
    expect(report.proofCommands).toContain('npm run aft -- page-seo percentage-calculator');
    expect(report.proofCommands).toContain('npm run aft -- tool-brief percentage-calculator');
  });

  it('blocks next-page selection until both tool and blog approvals are recorded', () => {
    const noApproval = buildSeoApprovalStatusReport('percentage-calculator', {
      trackerText: '',
      write: false,
    });

    expect(noApproval.pages.tool.approved).toBe(false);
    expect(noApproval.pages.blog.approved).toBe(false);
    expect(noApproval.canProceedToNext).toBe(false);

    const oneApproval = buildSeoApprovalStatusReport('percentage-calculator', {
      trackerText: `
| slug | page | status | approved by | approved at | proof | notes |
| percentage-calculator | tool | approved | human | 2026-05-18 | output/seo-tool-review/percentage-calculator/tool/page-score.md | tool passed |
| percentage-calculator | blog | waiting-human-approval |  |  |  | blog still pending |
`,
      write: false,
    });

    expect(oneApproval.pages.tool.approved).toBe(true);
    expect(oneApproval.pages.blog.approved).toBe(false);
    expect(oneApproval.canProceedToNext).toBe(false);

    const bothApproved = buildSeoApprovalStatusReport('percentage-calculator', {
      trackerText: `
| slug | page | status | approved by | approved at | proof | notes |
| percentage-calculator | tool | approved | human | 2026-05-18 | output/seo-tool-review/percentage-calculator/tool/page-score.md | tool passed |
| percentage-calculator | blog | approved | human | 2026-05-18 | output/seo-tool-review/percentage-calculator/blog/page-score.md | guide passed |
`,
      write: false,
    });

    expect(bothApproved.pages.tool.approved).toBe(true);
    expect(bothApproved.pages.blog.approved).toBe(true);
    expect(bothApproved.canProceedToNext).toBe(true);
  });
});
