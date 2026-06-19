# SEO Tool/Page Review Workflow

Use this workflow for the long-lived `codex/seo-tool-blog-review` branch. It reviews one Access Free Tools URL at a time, compares the page with approved competitor evidence, improves weak copy in the Access Free Tools voice, then stops for human approval before the next page starts.

## Real SEO Source Order

Use local page scores as guardrails, not as the definition of SEO success. When a score and real SEO guidance disagree, follow the evidence in this order:

1. Google Search Central guidance for helpful content, link best practices, titles, snippets, crawlability, and indexing.
2. Search Console data for Access Free Tools indexing, impressions, clicks, CTR, and average position.
3. DataForSEO for targeted keyword, competitor, and SERP evidence after paid approval.
4. Local Access Free Tools agents and docs, especially `docs/recommended-agency-agents.md`, `docs/brand-code.md`, `docs/article-writing-agent-standard.md`, and `docs/search-engine-land-seo-task-board.md`.
5. The local `seo-page-score` report as a quality checklist, never as a reason to add spammy copy or links.

For internal links, Google's useful rule is descriptive, concise, relevant anchor text with surrounding context. Link where the next page helps the reader understand or complete the task. Do not link every repeated generic word, do not chain links together, and do not force keywords into anchors just to raise a score.

## Required Agents

- Web SEO Source Research Agent: starts every page with current Google, DataForSEO, and approved agent-pattern research before making SEO claims.
- SEO Tool Research Agent: gathers local tool, guide, sitemap, Search Console, usage, and built-page evidence.
- Search Intent And Keyword Agent: maps the exact page to query intent and paid/free keyword evidence without stuffing keywords.
- Competitor Gap Analyst: scores selected competitor tool, FAQ, and blog pages for useful topic gaps. It never copies wording, examples, or structure.
- On-Page SEO Agent: checks title, description, H1, headings, canonical URL, visible content, and built HTML proof.
- Contextual Internal Link Agent: checks matching-page, related-tool, hub, and guide links for descriptive anchors and useful surrounding context.
- Micro-Agent Scope Planner: activates the relevant one-question SEO micro-agents for the current page type and parks irrelevant conditional groups.
- Smart 14 Voice Editor: rewrites generic or hard-to-read language into clear, practical, tool-specific copy a smart 14-year-old can understand.
- FAQ And Schema Specialist: checks visible FAQs, answer usefulness, schema alignment, and whether FAQ text is actually on the page.
- Evidence Collector: records source URLs, proof paths, browser screenshots, and generated reports so SEO decisions are not memory-based.
- Browser Proof Reviewer: opens the exact local or built URL in the internal browser and records layout/readability proof.
- Final SEO Judge: reads every specialist and evaluator result, lists remaining gaps, and decides whether the page is ready for human approval.
- Human Approval Gatekeeper: blocks the next page until approval for the current tool page or blog page is recorded in `docs/seo-tool-review-queue.md`.

## Commands

- `node scripts/seo-agent-workbench.mjs plan <slug> <tool|blog>`
- `node scripts/seo-agent-workbench.mjs sources <slug> <tool|blog>`
- `node scripts/seo-agent-workbench.mjs micro-plan <slug> <tool|blog>`
- `node scripts/seo-agent-workbench.mjs links <slug> <tool|blog>`
- `node scripts/seo-agent-workbench.mjs judge <slug> <tool|blog>`
- `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>`
- `npm run aft -- seo-tool-queue`
- `npm run aft -- seo-tool-research <slug> --page tool`
- `npm run aft -- seo-tool-research <slug> --page blog`
- `npm run aft -- seo-competitor-gap <slug> --page tool --url <competitor-url>`
- `npm run aft -- seo-page-score <slug> --page tool`
- `npm run aft -- seo-page-score <slug> --page blog`
- `npm run aft -- seo-approval-status <slug>`

Generated page-review reports live under `output/seo-tool-review/<slug>/<page>/`. Generated agent workbench reports live under `output/seo-agents/<slug>/<page>/`.

Some npm versions on Windows consume `--page` and `--url` as npm config. The CLI accepts those commands as written, but the warning-free equivalents are `npm run aft -- seo-tool-research <slug> tool`, `npm run aft -- seo-page-score <slug> blog`, and `npm run aft -- seo-competitor-gap <slug> tool <competitor-url>`.

## Trigger Phrase

Always use SEO agents for SEO work. If a task mentions SEO, run or explicitly reference the relevant SEO agent workbench command before making SEO recommendations, page-complete claims, deployment claims, or approval-gate claims. Each SEO task should have a specialist agent, evaluator, micro-agent scope, and final judge evidence unless the user explicitly asks for discussion only.

When the user says `SEO steps`, `SEO seps`, `begin our SEO steps`, `begin our SEO seps`, `do the SEO steps`, or `do the SEO seps` while a page is open or already in progress, treat that as approval for the complete one-page SEO process:

- Check whether the page tone matches the Access Free Tools "smart 14-year-old" voice.
- Run the SEO agent workbench so every broad specialist agent has an evaluator, the micro-agent catalog is scoped to this page type, and the final judge lists remaining gaps.
- Research the same tool/page on competitor websites, score competitor pages, and list SEO gaps or tool/page improvements we can fill with original wording.
- Use paid DataForSEO for that exact page: keyword, difficulty, competitor, and SERP evidence, after checking account balance and service status.
- Review contextual keyword internal links using Google's link guidance: link the first useful exact tool phrase, matching tool CTA, related same-category tools, and relevant hub/category pages with descriptive anchors. Do not link every generic repeat of words like "calculator".
- Apply useful page/tool improvements, run verification, save in-app browser proof, update the tracker, then commit and push the branch to GitHub.
- Stop at the human approval gate before deploying live or moving to another page.

When the user says `PAID SEO SPRINT <slug> <tool|blog>`, treat that as approval to run the full one-page workflow for that exact page:

- local research, page score, and browser proof;
- free/open competitor gap checks;
- paid DataForSEO keyword, difficulty, competitor, and SERP evidence for that page only;
- tool-specific copy, FAQ, metadata, contextual keyword internal links, or calculator improvements;
- verification checks and a fresh in-app browser proof;
- commit and push the branch to GitHub;
- stop at the human approval gate before deploying live or moving to another page.

When the user says `SEO SPRINT <slug> <tool|blog>`, run the same complete workflow, including paid DataForSEO, unless they explicitly say "no paid" for that run.

## Standing Owner Autonomy Directive

On 2026-06-19, the owner approved autonomous targeted SEO/DataForSEO judgment for this controlled page-review lane. For exact page-level SEO sprint work, agents may run needed paid DataForSEO evidence after local account balance and service-status guardrails pass, record exact proof paths, and continue without asking for another paid-run confirmation. Broad or sitewide paid crawls still need the existing capped automation and cost guardrails. When paid evidence, rendered/browser proof, page score, link audit, final judge, and proof-check pass with no blocking gaps, agents may record approval as `user autonomous completion directive`, deploy, live-verify, and update `docs/seo-tool-review-queue.md` instead of stopping for a separate human review prompt.

## Review Rules

1. Work on `codex/seo-tool-blog-review`.
2. Run `npm run aft -- seo-tool-queue` and choose the next page that is not approved.
3. Run `npm run aft -- seo-tool-research <slug> --page tool|blog`.
4. Run `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` first. For partial runs, at minimum run `plan`, `sources`, and `micro-plan` so every broad specialist, evaluator, and one-question micro-agent has a scoped job plus source evidence.
5. Open the exact page in the internal browser. Use Playwright only if the internal browser is unavailable.
6. Compare only approved competitor URLs. Default competitor sources are calculator.net, Inch Calculator, CalculatorSoup, CalculatorInn, and OmniCalc.
7. Do not use paid DataForSEO SERP, keyword, or OnPage calls unless the user explicitly approves that paid run or the Standing Owner Autonomy Directive applies. The phrases `SEO steps`, `begin our SEO steps`, `do the SEO steps`, `PAID SEO SPRINT <slug> <tool|blog>`, and `SEO SPRINT <slug> <tool|blog>` count as paid approval unless the user also says "no paid".
8. Edit only the current page source, FAQ, metadata, related links, matching guide text, or proof docs.
9. Run `npm run aft -- seo-page-score <slug> --page tool|blog`, `node scripts/seo-agent-workbench.mjs links <slug> <tool|blog>`, `node scripts/seo-agent-workbench.mjs judge <slug> <tool|blog>`, plus the page-specific checks listed in the research report.
10. Present the exact URL, report paths, browser proof, final-judge gaps, and diff to the user.
11. Do not move to the next page until that page is approved and recorded in `docs/seo-tool-review-queue.md`.

## Deployment Closeout

After any approved page is committed, pushed, deployed, and live-verified:

- Update the Progress Summary in `docs/seo-tool-review-queue.md`.
- Record the live URL, deployment/build id, commit id, and proof path in the Review Log.
- Tell the user how many page review units are left.
- Start the next page by marking it `researching`, generating the local research and page score, and loading the exact local URL in the internal browser.
- Under the Standing Owner Autonomy Directive, continue to the next exact page-level SEO sprint when local account balance and service-status guardrails pass; otherwise wait for a fresh paid SEO trigger phrase.

## Approval Format

Record approvals in `docs/seo-tool-review-queue.md`:

`| slug | page | status | approved by | approved at | proof | notes |`

Allowed statuses are `not-started`, `researching`, `edited`, `waiting-human-approval`, and `approved`.

Tool page approval and blog page approval are separate. A slug is not ready for the next slug until both rows are `approved`.

## Acceptance Checks

- `npm run aft -- page-seo <slug>`
- `npm run aft -- tool-brief <slug>`
- `npm run aft -- content-score <matching guide file>` for blog pages
- `npm run aft -- seo-page-score <slug> --page tool|blog`
- `node scripts/seo-agent-workbench.mjs judge <slug> <tool|blog>`
- Internal browser snapshot or screenshot for the exact local page
- `npm run check` before larger review milestones, GitHub updates, or branch handoff
