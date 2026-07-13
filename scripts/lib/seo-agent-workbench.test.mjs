import { describe, expect, it } from 'vitest';

import {
  buildSeoAgentPlanReport,
  buildSeoFinalJudgeReport,
  buildSeoLinkAuditReport,
  buildSeoMicroAgentPlanReport,
  buildSeoSourceEvidenceReport,
  SEO_AGENT_COUNCIL,
  SEO_WEB_RESEARCH_SOURCES,
} from './seo-agent-workbench.mjs';
import { countSeoMicroAgents, SEO_MICRO_AGENT_GROUPS } from './seo-micro-agent-catalog.mjs';

describe('seo agent workbench', () => {
  it('defines one evaluator and web research start for every SEO agent', () => {
    expect(SEO_WEB_RESEARCH_SOURCES.length).toBeGreaterThanOrEqual(4);
    expect(SEO_AGENT_COUNCIL.length).toBeGreaterThanOrEqual(8);
    expect(SEO_AGENT_COUNCIL.every((agent) => agent.startWithWebResearch)).toBe(true);
    expect(SEO_AGENT_COUNCIL.every((agent) => agent.oneJob && agent.evaluator && agent.evaluatorJob)).toBe(true);
    expect(SEO_AGENT_COUNCIL.map((agent) => agent.id)).toContain('final-judge');
  });

  it('creates a per-page plan with agent commands, evaluators, and human gate', () => {
    const report = buildSeoAgentPlanReport('wallpaper-calculator', {
      page: 'blog',
      write: false,
    });

    expect(report.kind).toBe('seo-agent-plan');
    expect(report.route).toBe('/blog/how-to-use-wallpaper-calculator/');
    expect(report.matchingRoute).toBe('/tools/wallpaper-calculator/');
    expect(report.approvalGate.humanApprovalRequired).toBe(true);
    expect(report.agents[0].pageCommand.join(' ')).toContain('Google Search Central');
    expect(report.agents.some((agent) => agent.evaluator === 'Anchor Text Evaluator')).toBe(true);
  });

  it('creates source evidence so every agent starts from web research', () => {
    const report = buildSeoSourceEvidenceReport('wallpaper-calculator', {
      page: 'blog',
      write: false,
    });

    expect(report.kind).toBe('seo-agent-source-evidence');
    expect(report.sources.map((source) => source.url)).toContain(
      'https://developers.google.com/search/docs/crawling-indexing/links-crawlable',
    );
    expect(report.agentCheckpoints).toHaveLength(SEO_AGENT_COUNCIL.length);
    expect(report.agentCheckpoints.every((item) => item.mustStartWithWebResearch)).toBe(true);
  });

  it('loads the user micro-agent catalog and activates blog-relevant groups', () => {
    const report = buildSeoMicroAgentPlanReport('wallpaper-calculator', {
      page: 'blog',
      write: false,
    });

    expect(SEO_MICRO_AGENT_GROUPS.length).toBe(21);
    expect(countSeoMicroAgents()).toBeGreaterThan(250);
    expect(report.kind).toBe('seo-micro-agent-plan');
    expect(report.catalog.activeAgents).toBeGreaterThan(200);
    expect(report.activeGroups.map((group) => group.title)).toContain('News, blog, and publisher agents');
    expect(report.parkedGroups.map((group) => group.title)).toContain('Ecommerce on-page agents');
    expect(report.parkedGroups.map((group) => group.title)).toContain('Local on-page SEO agents');
  });

  it('treats editorial articles as independent blog routes with their own owner directive', () => {
    const plan = buildSeoAgentPlanReport('open-source-projects-behind-access-free-tools', {
      page: 'editorial',
      write: false,
    });
    const microPlan = buildSeoMicroAgentPlanReport('open-source-projects-behind-access-free-tools', {
      page: 'editorial',
      write: false,
    });

    expect(plan.route).toBe('/blog/open-source-projects-behind-access-free-tools/');
    expect(plan.matchingRoute).toBeNull();
    expect(plan.approvalGate.humanApprovalRequired).toBe(false);
    expect(plan.approvalGate.approvalRecord).toBe('docs/editorial-content-program.md');
    expect(microPlan.activeGroups.map((group) => group.title)).toContain('News, blog, and publisher agents');
  });

  it('audits internal links and flags generic anchors while requiring the matching page', () => {
    const html = `
      <main>
        <a href="/tools/wallpaper-calculator/">Open the Wallpaper Calculator with price per roll</a>
        <a href="/tools/square-footage-calculator/">Check a wall with the Square Footage Calculator</a>
        <a href="/tools/paint-calculator/">calculator</a>
      </main>
    `;
    const report = buildSeoLinkAuditReport('wallpaper-calculator', {
      page: 'blog',
      html,
      write: false,
    });

    expect(report.kind).toBe('seo-agent-link-audit');
    expect(report.status).toBe('pass');
    expect(report.summary.matchingLinks).toBe(1);
    expect(report.summary.genericAnchors).toBe(1);
    expect(report.score).toBeGreaterThanOrEqual(85);
  });

  it('requires descriptive link depth instead of a matching tool for editorial articles', () => {
    const html = `
      <main>
        <a href="/blog/free-ai-skills-open-source-tools-organic-growth/">Read my earlier AI skills field notes</a>
        <a href="/tools/image-to-text-ocr-tool/">Try the browser Image to Text OCR Tool</a>
        <a href="/why-access-free-tools/">See why I build Access Free Tools</a>
      </main>
    `;
    const report = buildSeoLinkAuditReport('open-source-projects-behind-access-free-tools', {
      page: 'editorial',
      html,
      write: false,
    });

    expect(report.status).toBe('pass');
    expect(report.matchingRoute).toBeNull();
    expect(report.summary.internalLinks).toBe(3);
    expect(report.summary.descriptiveLinks).toBe(3);
  });

  it('blocks the final judge when paid, competitor, or browser proof is missing', () => {
    const report = buildSeoFinalJudgeReport('wallpaper-calculator', {
      page: 'blog',
      html: '<a href="/tools/wallpaper-calculator/">Open the Wallpaper Calculator with price per roll</a>',
      reviewFiles: ['research.md', 'page-score.md'],
      workbenchFiles: [],
      pageScoreJson: {
        score: {
          overall: 100,
          sections: {
            tone: 100,
            faqQuality: 100,
          },
        },
      },
      researchJson: {
        tone: {
          score: 100,
        },
      },
      write: false,
    });

    expect(report.kind).toBe('seo-agent-final-judge');
    expect(report.status).toBe('blocked');
    expect(report.remainingGaps.map((gap) => gap.agent)).toContain('Web SEO Source Research Agent');
    expect(report.remainingGaps.map((gap) => gap.agent)).toContain('Search Intent And Keyword Agent');
    expect(report.remainingGaps.map((gap) => gap.agent)).toContain('Competitor Gap Analyst');
    expect(report.remainingGaps.map((gap) => gap.agent)).toContain('Browser Proof Reviewer');

    const keywordEvaluation = report.evaluations.find((item) => item.agent === 'Search Intent And Keyword Agent');
    expect(keywordEvaluation?.evidence).toBe('Paid DataForSEO evidence is missing for this page.');
  });

  it('allows the final judge to reach the human approval gate when every agent has evidence', () => {
    const report = buildSeoFinalJudgeReport('wallpaper-calculator', {
      page: 'blog',
      html: '<a href="/tools/wallpaper-calculator/">Open the Wallpaper Calculator with price per roll</a>',
      reviewFiles: [
        'research.md',
        'page-score.md',
        'dataforseo-paid.md',
        'competitor-gap-inchcalculator.md',
        'browser-proof-paid-dataforseo.png',
        'browser-proof-paid-dataforseo-dom.txt',
      ],
      workbenchFiles: ['source-evidence.md', 'micro-agent-plan.md'],
      pageScoreJson: {
        score: {
          overall: 100,
          sections: {
            tone: 100,
            faqQuality: 100,
          },
        },
      },
      researchJson: {
        tone: {
          score: 100,
        },
      },
      write: false,
    });

    expect(report.status).toBe('ready-for-human-approval');
    expect(report.remainingGaps).toHaveLength(0);
    expect(report.humanGate.status).toBe('waiting-human-approval');

    const keywordEvaluation = report.evaluations.find((item) => item.agent === 'Search Intent And Keyword Agent');
    expect(keywordEvaluation?.evidence).toBe('Paid DataForSEO evidence exists for this page.');
  });

  it('allows a proven editorial article to reach the autonomous release gate', () => {
    const slug = 'open-source-projects-behind-access-free-tools';
    const route = `/blog/${slug}/`;
    const articleWords = 'useful source checked example limitation reader '.repeat(150);
    const html = `<!doctype html><html><head>
      <title>8 Open-Source Tools I Use to Build a Website</title>
      <meta name="description" content="Brendan Chambers shares the open-source browser, AI, OCR, testing, and web tools used behind Access Free Tools, with honest limits and source links." />
      <link rel="canonical" href="https://accessfreetools.com${route}" />
      <script type="application/ld+json">{"@type":"BlogPosting"}</script>
    </head><body><main>
      <h1>8 Open-Source Projects I Use to Build Access Free Tools</h1>
      <p>By Brendan Chambers</p>
      <p>${articleWords}</p>
      <a href="/blog/free-ai-skills-open-source-tools-organic-growth/">Read my earlier AI skills field notes</a>
      <a href="/tools/image-to-text-ocr-tool/">Try the browser Image to Text OCR Tool</a>
      <a href="/why-access-free-tools/">See why I build Access Free Tools</a>
      <a href="https://astro.build/">Astro</a>
      <a href="https://react.dev/">React</a>
      <a href="https://www.typescriptlang.org/">TypeScript</a>
      <p>How this article was made</p>
    </main></body></html>`;
    const report = buildSeoFinalJudgeReport(slug, {
      page: 'editorial',
      html,
      sourceEvidence: true,
      microPlan: true,
      paidEvidence: true,
      browserPng: true,
      editorialQuality: {
        stopSlop: { score: 44 },
      },
      write: false,
    });

    expect(report.status).toBe('ready-for-release');
    expect(report.remainingGaps).toHaveLength(0);
    expect(report.humanGate.required).toBe(false);
    expect(report.humanGate.status).toBe('user-autonomous-completion-directive');
  });
});
