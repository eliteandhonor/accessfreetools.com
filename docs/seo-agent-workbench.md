# SEO Agent Workbench

Use this workbench for every SEO task. Also use it when the user says `SEO steps`, `SEO seps`, or asks for a separate SEO agent team. It gives every SEO job one specialist agent, one evaluator agent, scoped micro-agents, and one final judge before approval.

The workbench is evidence-first. Every agent starts with source research, then uses the page-specific local, browser, competitor, or paid DataForSEO tool assigned to that role.

Do not make SEO recommendations, page-complete claims, deployment claims, or approval-gate claims without running or explicitly referencing the relevant workbench command and saved report.

## Source Rules

Use sources in this order:

1. Google Search Central docs for real SEO guidance.
2. Google Search Console data for Access Free Tools performance when available.
3. DataForSEO for paid keyword, SERP, competitor, and OnPage evidence after explicit approval or under the Standing Owner Autonomy Directive in `docs/seo-tool-review-workflow.md`.
4. Local Access Free Tools docs and generated reports.
5. Local scores as guardrails only.

Public source checks for this workbench:

- Google SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Google Link Best Practices: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Google Helpful Content: `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- DataForSEO APIs: `https://dataforseo.com/apis`
- Agency agent pattern reference: `https://github.com/msitarzewski/agency-agents`

## Commands

- `node scripts/seo-agent-workbench.mjs plan <slug> <tool|blog>`
  - Builds the agent/evaluator plan for one page.
  - Saves `output/seo-agents/<slug>/<page>/plan.md` and `.json`.
- `node scripts/seo-agent-workbench.mjs sources <slug> <tool|blog>`
  - Records the public SEO sources, local docs, and source checkpoint each agent must start from.
  - Saves `output/seo-agents/<slug>/<page>/source-evidence.md` and `.json`.
- `node scripts/seo-agent-workbench.mjs micro-plan <slug> <tool|blog>`
  - Builds the full micro-agent catalog for the page and separates active agents from parked conditional agents.
  - Saves `output/seo-agents/<slug>/<page>/micro-agent-plan.md` and `.json`.
- `node scripts/seo-agent-workbench.mjs links <slug> <tool|blog>`
  - Audits built HTML internal links, matching-page links, generic anchors, and keyword-stuffed anchors.
  - Saves `output/seo-agents/<slug>/<page>/link-audit.md` and `.json`.
- `node scripts/seo-agent-workbench.mjs judge <slug> <tool|blog>`
  - Reads page research, paid DataForSEO, competitor gap, page score, internal-link audit, and browser proof.
  - Saves `output/seo-agents/<slug>/<page>/final-judge.md` and `.json`.
- `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>`
  - Runs plan, source evidence, micro-agent plan, link audit, and final judge for one page.

## Micro-Agent Catalog

The broad agent council manages evidence and final judgment. The micro-agent catalog breaks the work into one-question agents like `Primary Keyword Mapper Agent`, `H1 Writer Agent`, `Meta Robots Agent`, `Anchor Text Agent`, `Schema-to-Content Match Agent`, `LCP Detection Agent`, and `Change Log Agent`.

For tool and blog reviews, the workbench activates the groups that normally matter:

- Page targeting
- Content planning
- Content writing
- Content quality
- Title, meta, and SERP appearance
- Heading and HTML structure
- Indexability and crawlability
- Internal linking
- Structured data
- Image SEO
- Core Web Vitals and page experience
- Accessibility that supports on-page SEO
- E-E-A-T and trust
- AI-search readiness
- On-page QA and monitoring

For blog pages, it also activates `News, blog, and publisher agents`.

Conditional groups stay parked unless the page actually needs them:

- Video and audio SEO
- Ecommerce on-page SEO
- Service business on-page SEO
- Local on-page SEO
- International and multilingual on-page SEO

This keeps the agent list complete without forcing product, local, service, video, or translation checks onto a normal calculator guide.

## Agent Council

| Agent | One job | Evaluator |
| --- | --- | --- |
| Web SEO Source Research Agent | Start with current public SEO guidance and record what applies to the exact page. | Source Evidence Evaluator |
| Search Intent And Keyword Agent | Map query intent, related terms, and useful subtopics without stuffing keywords. | Keyword Evidence Evaluator |
| Competitor Gap Analyst | Compare approved competitors and list original gaps we can fill. | Competitor Originality Evaluator |
| On-Page SEO Agent | Check title, description, H1, headings, canonical URL, visible content, and built HTML. | On-Page Evidence Evaluator |
| Contextual Internal Link Agent | Add useful descriptive internal links to matching and related pages. | Anchor Text Evaluator |
| Micro-Agent Scope Planner | Activate relevant one-question SEO micro-agents and park irrelevant conditional groups. | Micro-Agent Scope Evaluator |
| Smart 14 Voice Editor | Make copy natural, specific, plain, and useful to a smart 14-year-old reader. | Reader Clarity Evaluator |
| FAQ And Schema Specialist | Check visible FAQs, schema alignment, common mistakes, and honest limits. | FAQ Schema Evaluator |
| Browser Proof Reviewer | Open the exact local page and save screenshot plus DOM proof. | Visual Proof Evaluator |
| Final SEO Judge | Read all evidence, list remaining gaps, and decide whether the page can ask for approval. | Approval Gatekeeper |

## Final Judge Rules

The final judge must block the page when required evidence is missing:

- local research report
- source-evidence report from the workbench
- micro-agent plan from the workbench when using the expanded SEO steps
- paid DataForSEO report when the run includes paid SEO steps
- competitor gap report
- page score report
- contextual internal-link audit
- tone score of 90 or higher
- FAQ score of 90 or higher when available
- browser screenshot and DOM proof

If all agents pass, the page is only `ready-for-human-approval`. It is not approved, live, or done until the exact page is approved and the tracker records it. Under the Standing Owner Autonomy Directive, a fully proven exact page-level run can be recorded as `user autonomous completion directive`.
