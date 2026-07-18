# Access Free Tools Agent CLI

Last updated: 2026-07-18

`npm run aft -- ...` is the internal command surface for Codex agents working on Access Free Tools. It keeps daily orientation short, repeatable, and proof-based without replacing the existing scripts.

The CLI is for agent support only. It must not publish posts, edit live social content, run ads, store passwords, open browsers, or mark promotion work complete.

## Commands

- `npm run aft -- status`
  - Summarizes brand-code presence, agent CLI docs, recommended agency-agent routing docs, marketing report age, DataForSEO live-or-cached balance, promotion queue counts, indexing gaps, and platform quality reports, including DEV Community when its report exists.
  - Treat `DataForSEO: live ...` as fresh proof. Treat `DataForSEO: cached ...; live check note: ...` as a temporary API/network warning, not a low-balance proof.

- `npm run aft -- route "<task>"`
  - Routes a plain-language task to the right local docs, specialist lens, proof lens, proof commands, and approval gates.
  - Routing rules live in `docs/agent-routing-rules.json` so future agents can update lanes without editing CLI code.
  - Saves `output/agent-tools/route/latest.json` and `.md`.

- `npm run aft -- evidence-pack <lane>`
  - Bundles the docs, proof commands, and latest evidence source status for one lane: `seo-review`, `seo`, `api`, `promotion`, `deploy`, `analytics`, `automation`, `ui`, or `code`.
  - Saves `output/agent-tools/evidence-pack/latest.json` and `.md`.

- `npm run aft -- claim-check "<claim>"`
  - Checks whether a `posted`, `fixed`, `updated`, `done`, `live`, or production-ready claim includes public URL, screenshot, or generated-report proof.
  - Cited `output/`, `public/`, or `dist/` proof paths must exist. Add `--verify-urls` when the public URL itself should be fetched before making the claim.
  - Saves `output/agent-tools/claim-check/latest.json` and `.md`.

- `npm run aft -- tool-brief <slug>`
  - Summarizes one tool's source record, guide, API readiness, renderer signal, sitemap coverage, image/art status, built internal-link evidence, anonymous usage signal, Search Console gap state, deep-review status, related tools, and next proof commands.
  - Saves `output/agent-tools/tool-brief/latest.json` and `.md`.

- `npm run aft -- agent-doctor`
  - Audits current agent docs and the `aft` command surface for missing routing/proof support.
  - Saves `output/agent-tools/agent-doctor/latest.json` and `.md`.

- `npm run aft -- marketing`
  - Runs the existing read-only marketing orchestrator and summarizes its 1 to 3 recommended actions.

- `npm run aft -- hostinger`
  - Runs the read-only Hostinger status command and summarizes websites, orders, domains, and any API blockers. Use this before claiming Hostinger or deployment access is broken.

- `npm run aft -- promote-next`
  - Reads `docs/promotion-queue.md` and shows safe promotion candidates plus rows that still need public proof.

- `npm run aft -- indexing-gaps`
  - Reads Search Console and SEO snapshots in `output/` and lists URLs that are unknown, discovered, crawled but not indexed, or otherwise not passing.
  - Also summarizes the latest imported Google Coverage CSV export when `npm run search-console:import-coverage` has been run.

- `node scripts/search-console.mjs --row-limit=1000 --performance-page=https://accessfreetools.com/tools/example/`
  - Pulls current Search Console performance evidence for one exact canonical page, including its query rows and page/query pairs.
  - Use `--start=YYYY-MM-DD` and `--end=YYYY-MM-DD` for a fixed comparison window. The row limit defaults to 1,000 and is capped at the Search Analytics API maximum of 25,000.
  - Set `GSC_REPORT_PATH=output/search-console/<name>.json` when the page-specific report should not replace the general performance snapshot.

- `npm run aft -- indexing-protection`
  - Runs the local indexing protection audit and summarizes soft-404 risk, sitemap coverage, canonical/indexability issues, legacy redirect proof, Search Console gaps, and CrawlScout signals.

- `npm run aft -- ai-crawler`
  - Runs the local built-HTML AI crawler visibility audit for priority pages and confirms important content, links, trust wording, and AI privacy/model-limit notes are visible without client JavaScript.

- `npm run aft -- hub-strength`
  - Runs the hub audit for `/tools/`, `/categories/calculators/`, `/categories/ai-tools/`, finance, health, home-project, developer, converter, and text hubs. Use it after internal-link or hub-copy changes.

- `npm run aft -- semantic-depth`
  - Runs the first-batch priority tool depth audit for Mortgage, Loan, BMI, Calorie, Income Tax, Salary, Watts to Amps, Wallpaper, OCR, and Prompt Token Estimator. It checks built tool/guide pages, semantic term coverage, related links, and deep-review records.

- `npm run aft -- recognition`
  - Runs the recognition tracker across Medium, Pinterest, Quora, Bluesky, DEV, Reddit, Search Console, Bing, and CrawlScout evidence. It separates public proof URLs from drafts, blocked channels, and unverified attempts.

- `npm run aft -- usage-summary` (local QA log only; not production-demand proof)
- `npm run analytics:production` (private production aggregate)
  - Fetches an authenticated, privacy-safe production aggregate with visitors, page views, tool-use actions, top tools, and top pages. Use `-- --days=<number>` for a different range.

- `npm run pilot:new-tool-growth`
  - Creates a read-only JSON to CSV pilot checkpoint from the newest exact URL inspections, production sitemap check, CrawlScout sample, search performance, and production analytics evidence.
  - Keeps the Time Zone Meeting Planner blocked until the 14-day wait has passed, at least one pilot URL is discovered, the post-release sitemap has no hard failures, and a post-release CrawlScout sample has not regressed.
  - Saves `output/new-tool-growth-pilot/latest.json` and `.md`.

- `npm run aft -- usage-notes`
  - Creates an original data asset readiness report and draft outline from the fresh production aggregate only. It never falls back to local QA events and stays `not-ready` until there are enough real visitors, enough tool actions, and production owner exclusion is confirmed.

- `npm run aft -- site-sitemap`
  - Checks built XML sitemap coverage and confirms the public HTML sitemap source exists.

- `npm run aft -- page-seo <slug>`
  - Checks one tool slug for source metadata, FAQ/example counts, related tools, built page metadata, matching guide, and sitemap coverage.

- `npm run aft -- content-score <file>`
  - Checks one content file for generic phrases, agent-facing text, concrete examples, and Access Free Tools links. Medium drafts are matched against the Medium quality report when possible.
  - Also writes the latest internal report to `output/agent-tools/content-quality/latest.json` and `.md`.

- `npm run aft -- ask-audit`
  - Checks the production or selected site origin for Ask/API/MCP parity on the first deterministic utility questions: percentage, concrete, download time, and watts to amps.
  - Saves `output/agent-tools/ask-audit/latest.json` and `.md`.
  - Any missing Search/API/tool-page evidence must be reported as `not enough data`; do not guess.

- `npm run aft -- api-ready`
  - Ranks existing tools for future `apiToolRegistry` expansion without generating code.
  - Saves `output/agent-tools/api-ready/latest.json` and `.md`.

- `npm run aft -- mcp-smoke`
  - Runs MCP `tools/list`, `search_tools`, and `run_tool` checks against the selected site origin.
  - Saves `output/agent-tools/mcp-smoke/latest.json` and `.md`.

- `npm run aft -- link-helper`
  - Recommends internal links from available sitemap, Search Console, CrawlScout, and anonymous analytics evidence.
  - Saves `output/agent-tools/link-helper/latest.json` and `.md`.

- `npm run aft -- seo-console`
  - Summarizes indexing, sitemap, CrawlScout, IndexNow, DataForSEO, and marketing-orchestrator evidence into a report-only fix queue.
  - Saves `output/agent-tools/seo-console/latest.json` and `.md`.

- `npm run aft -- seo-tool-queue`
  - Builds the page-level review queue for every canonical tool and matching blog guide.
  - Saves `output/seo-tool-review/queue/latest.json` and `.md`.

- `npm run aft -- seo-tool-research <slug> --page tool|blog`
  - Creates the one-page research pack with source data, built-page proof, tone hits, specialist agents, competitor seeds, and approval gates.
  - Saves `output/seo-tool-review/<slug>/<page>/research.json` and `.md`.

- `npm run aft -- seo-competitor-gap <slug> --page tool|blog --url <competitor-url>`
  - Fetches and scores selected competitor pages for metadata, headings, FAQs, schema hints, examples, readability, and topic gaps.
  - Paid DataForSEO research is blocked by default; competitor content is only for original topic-gap research.
  - Saves `output/seo-tool-review/<slug>/<page>/competitor-gap.json` and `.md`.

- `npm run aft -- seo-page-score <slug> --page tool|blog`
  - Scores our page for SEO fit, tool specificity, FAQ quality, internal links, tone, trust/limits, and built-page proof.
  - Saves `output/seo-tool-review/<slug>/<page>/page-score.json` and `.md`.

- `npm run aft -- seo-approval-status <slug>`
  - Reads `docs/seo-tool-review-queue.md` and shows whether the tool page and blog guide are both approved before the next slug can begin.
  - Saves `output/seo-tool-review/<slug>/approval-status.json` and `.md`.

- `node scripts/seo-agent-workbench.mjs plan <slug> <tool|blog>`
  - Creates the separate SEO agent council plan with one specialist job, one evaluator job, required evidence, and human gate.
  - Saves `output/seo-agents/<slug>/<page>/plan.json` and `.md`.

- `node scripts/seo-agent-workbench.mjs sources <slug> <tool|blog>`
  - Records the web research sources and local-doc checkpoints every SEO specialist agent must start from.
  - Saves `output/seo-agents/<slug>/<page>/source-evidence.json` and `.md`.

- `node scripts/seo-agent-workbench.mjs micro-plan <slug> <tool|blog>`
  - Builds the one-question SEO micro-agent catalog for the page and parks conditional groups that do not apply.
  - Saves `output/seo-agents/<slug>/<page>/micro-agent-plan.json` and `.md`.

- `node scripts/seo-agent-workbench.mjs links <slug> <tool|blog>`
  - Audits built HTML internal links for matching-page links, descriptive anchors, generic anchors, and keyword stuffing.
  - Saves `output/seo-agents/<slug>/<page>/link-audit.json` and `.md`.

- `node scripts/seo-agent-workbench.mjs judge <slug> <tool|blog>`
  - Checks specialist/evaluator evidence and lists remaining gaps before the human approval gate.
  - Saves `output/seo-agents/<slug>/<page>/final-judge.json` and `.md`.

- `npm run aft -- proof-check`
  - Finds promotion queue rows that claim a live or done status without visible public proof, and rows intentionally waiting for proof.

Every command supports `--json` for structured agent use. For strict machine parsing, read stdout only or use npm's silent mode:

```powershell
npm run --silent aft -- status --json
```

On some Windows/npm versions, command options like `--page tool` and `--url https://...` are consumed as npm config and produce a warning. The SEO review commands also accept warning-free positional fallbacks such as `npm run aft -- seo-tool-research wallpaper-calculator tool` and `npm run aft -- seo-competitor-gap wallpaper-calculator tool https://www.inchcalculator.com/wallpaper-calculator/`.

## Proof Rules

The CLI can summarize proof, but it cannot create proof by itself. Public promotion can only be marked `posted`, `updated`, `done`, or `fixed` when one of these is visible:

- A public URL showing the post or change.
- A public profile or feed view showing the item.
- A screenshot saved in `output/`, with the exact path present locally.
- A generated report proving a non-public action, such as RSS health or sitemap verification, with the exact path present locally.

## Recommended Agent Flow

1. Start with `npm run aft -- status`.
2. Run `npm run aft -- route "<task>"` to choose the first docs, specialist lens, proof lens, and approval gates.
3. Run `npm run aft -- evidence-pack <lane>` when you need the latest proof bundle for the routed lane.
4. Read `docs/recommended-agency-agents.md` when choosing a specialist lens for the current workstream.
5. Run `npm run aft -- marketing` when choosing SEO, internal-link, content, or promotion work.
6. Run `npm run aft -- hostinger` before Hostinger, DNS, deployment, or hosting-environment claims.
7. If the user provides Google Coverage CSVs, run `npm run search-console:import-coverage` before indexing claims. It finds the newest Access Free Tools Coverage export in Downloads; use `node scripts/import-google-coverage-export.mjs --dir="C:\path\to\export"` only when the folder is somewhere else.
8. If the user provides a CrawlScout/deindexed URL CSV, run `npm run crawlscout:import` for the newest matching Downloads file, or `node scripts/import-crawlscout-export.mjs --file="C:\path\to\deindexed.csv"` when the file is elsewhere, before using CrawlScout as evidence. It writes `output/crawlscout/crawlscout-summary.json` and `.md`; the report is a local URL sample unless the export itself includes full crawl totals.
9. Run `npm run aft -- indexing-protection` after Search Engine Land-style indexing, soft-404, or discovery work.
10. Run `npm run aft -- ai-crawler` after hub, tool-page, or AI-search visibility work.
11. Run `npm run aft -- hub-strength` after changing hub copy, category discovery, or internal-link pathways.
12. Run `npm run aft -- semantic-depth` after changing priority tool pages, guides, FAQs, or audit wording.
13. Run `npm run aft -- recognition` before claiming brand/promotion proof across public platforms.
14. Use `npm run analytics:production` when deciding which tools deserve more internal links, guides, social promotion, or UX improvements. Use `npm run aft -- usage-summary` only for local QA diagnostics.
15. Use `npm run aft -- usage-notes` before planning any public "what people are using" content.
16. Use `npm run aft -- site-sitemap` after builds or sitemap changes.
17. Use `npm run aft -- page-seo <slug>` before improving a tool page or guide.
18. Use `npm run aft -- tool-brief <slug>` before planning broader work on a specific tool.
19. Use `npm run aft -- content-score <file>` before Medium, DEV Community, Quora, Reddit, or longer promotion copy goes public.
20. Use `npm run aft -- ask-audit` after Ask/API/MCP changes and before claiming live answer quality.
21. Use `npm run aft -- api-ready` before expanding the public API registry.
22. Use `npm run aft -- mcp-smoke` after MCP route changes.
23. Use `npm run aft -- link-helper` before internal-link improvement batches.
24. Use `npm run aft -- seo-console` before choosing indexing or discovery fixes.
25. Use `npm run aft -- seo-tool-queue` before starting the controlled tool/blog review lane.
26. Use `npm run aft -- seo-tool-research <slug> --page tool|blog`, then `npm run aft -- seo-page-score <slug> --page tool|blog`, for the current page only.
27. Use `npm run aft -- seo-approval-status <slug>` before moving to the next slug.
28. Use `npm run aft -- claim-check "<claim>"` before making any live/done/fixed claim in chat or docs. Add `--verify-urls` when the claim depends on a public URL that should be fetched now.
29. Use `npm run aft -- proof-check` before changing promotion queue statuses.
30. Use `npm run aft -- agent-doctor` after editing agent docs or helper command routing.

## Specialist Lens Router

`docs/recommended-agency-agents.md` upgrades the local agents with specialist
lenses from the reviewed `msitarzewski/agency-agents` prompt library. Use it to
choose one primary lens and one proof lens, then keep the local proof command as
the source of truth.

Common pairings:

- SEO and indexing: SEO Specialist, then Evidence Collector.
- AI search and recognition: AI Citation Strategist, then Reality Checker.
- Ask/API/MCP: API And MCP Tester plus Agentic Search Optimizer, then Reality Checker.
- Promotion drafts: Technical Writer plus Legal Compliance Checker, then Evidence Collector.
- Analytics/data assets: Analytics Reporter, then Reality Checker.
- Automations and Hostinger: Automation Governance Architect, then Reality Checker.
- Narrow code fixes: Minimal Change Engineer, then task-specific tests.

The private report viewer is `/admin/agent-tools/`. It uses the analytics/admin token, is noindexed, and can refresh safe report-only checks from the browser. It also exposes read-only helper forms for route, evidence pack, claim check, tool brief, and agent doctor reports. It does not publish, edit pages, submit indexing requests, or run paid API calls. CLI Playwright parity is still the stronger proof when browser-rendered tool output matters.

For a quick no-paid proof refresh after local SEO/audit work, use `npm run audit:deep:no-paid:fast`. It skips Search Console OAuth, the full `npm run check`, and Playwright smoke while still refreshing the local audit, IndexNow, external-link report, indexing protection report, and AI crawler visibility report.

## V1 Choice

This CLI uses Node and Commander because the repo already uses Node scripts. Printing Press remains a future experiment if we later need generated Go CLIs, cached local mirrors, or shared agent-native command packages.
