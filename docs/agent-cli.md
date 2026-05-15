# Access Free Tools Agent CLI

Last updated: 2026-05-13

`npm run aft -- ...` is the internal command surface for Codex agents working on Access Free Tools. It keeps daily orientation short, repeatable, and proof-based without replacing the existing scripts.

The CLI is for agent support only. It must not publish posts, edit live social content, run ads, store passwords, open browsers, or mark promotion work complete.

## Commands

- `npm run aft -- status`
  - Summarizes brand-code presence, marketing report age, DataForSEO live-or-cached balance, promotion queue counts, indexing gaps, and platform quality reports, including DEV Community when its report exists.
  - Treat `DataForSEO: live ...` as fresh proof. Treat `DataForSEO: cached ...; live check note: ...` as a temporary API/network warning, not a low-balance proof.

- `npm run aft -- marketing`
  - Runs the existing read-only marketing orchestrator and summarizes its 1 to 3 recommended actions.

- `npm run aft -- hostinger`
  - Runs the read-only Hostinger status command and summarizes websites, orders, domains, and any API blockers. Use this before claiming Hostinger or deployment access is broken.

- `npm run aft -- promote-next`
  - Reads `docs/promotion-queue.md` and shows safe promotion candidates plus rows that still need public proof.

- `npm run aft -- indexing-gaps`
  - Reads Search Console and SEO snapshots in `output/` and lists URLs that are unknown, discovered, crawled but not indexed, or otherwise not passing.
  - Also summarizes the latest imported Google Coverage CSV export when `npm run search-console:import-coverage` has been run.

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

- `npm run aft -- usage-summary`
  - Reads the local first-party analytics event log and summarizes visitors, page views, tool-use actions, top tools, and top pages. Use `--days <number>` for a different range.

- `npm run aft -- usage-notes`
  - Creates a privacy-safe original data asset readiness report and draft outline from anonymous usage events. It should stay `not-ready` until there are enough real visitors, enough tool actions, and owner traffic is filtered.

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

- `npm run aft -- proof-check`
  - Finds promotion queue rows that claim a live or done status without visible public proof, and rows intentionally waiting for proof.

Every command supports `--json` for structured agent use. For strict machine parsing, read stdout only or use npm's silent mode:

```powershell
npm run --silent aft -- status --json
```

## Proof Rules

The CLI can summarize proof, but it cannot create proof by itself. Public promotion can only be marked `posted`, `updated`, `done`, or `fixed` when one of these is visible:

- A public URL showing the post or change.
- A public profile or feed view showing the item.
- A screenshot saved in `output/`.
- A generated report proving a non-public action, such as RSS health or sitemap verification.

## Recommended Agent Flow

1. Start with `npm run aft -- status`.
2. Run `npm run aft -- marketing` when choosing SEO, internal-link, content, or promotion work.
3. Run `npm run aft -- hostinger` before Hostinger, DNS, deployment, or hosting-environment claims.
4. If the user provides Google Coverage CSVs, run `npm run search-console:import-coverage` before indexing claims. It finds the newest Access Free Tools Coverage export in Downloads; use `node scripts/import-google-coverage-export.mjs --dir="C:\path\to\export"` only when the folder is somewhere else.
5. Run `npm run aft -- indexing-protection` after Search Engine Land-style indexing, soft-404, or discovery work.
6. Run `npm run aft -- ai-crawler` after hub, tool-page, or AI-search visibility work.
7. Run `npm run aft -- hub-strength` after changing hub copy, category discovery, or internal-link pathways.
8. Run `npm run aft -- semantic-depth` after changing priority tool pages, guides, FAQs, or audit wording.
9. Run `npm run aft -- recognition` before claiming brand/promotion proof across public platforms.
10. Use `npm run aft -- usage-summary` when deciding which tools deserve more internal links, guides, social promotion, or UX improvements.
11. Use `npm run aft -- usage-notes` before planning any public "what people are using" content.
12. Use `npm run aft -- site-sitemap` after builds or sitemap changes.
13. Use `npm run aft -- page-seo <slug>` before improving a tool page or guide.
14. Use `npm run aft -- content-score <file>` before Medium, DEV Community, Quora, Reddit, or longer promotion copy goes public.
15. Use `npm run aft -- ask-audit` after Ask/API/MCP changes and before claiming live answer quality.
16. Use `npm run aft -- api-ready` before expanding the public API registry.
17. Use `npm run aft -- mcp-smoke` after MCP route changes.
18. Use `npm run aft -- link-helper` before internal-link improvement batches.
19. Use `npm run aft -- seo-console` before choosing indexing or discovery fixes.
20. Use `npm run aft -- proof-check` before changing promotion queue statuses.

The private report viewer is `/admin/agent-tools/`. It uses the analytics/admin token, is noindexed, and can refresh safe report-only checks from the browser. It does not publish, edit pages, submit indexing requests, or run paid API calls. CLI Playwright parity is still the stronger proof when browser-rendered tool output matters.

For a quick no-paid proof refresh after local SEO/audit work, use `npm run audit:deep:no-paid:fast`. It skips Search Console OAuth, the full `npm run check`, and Playwright smoke while still refreshing the local audit, IndexNow, external-link report, indexing protection report, and AI crawler visibility report.

## V1 Choice

This CLI uses Node and Commander because the repo already uses Node scripts. Printing Press remains a future experiment if we later need generated Go CLIs, cached local mirrors, or shared agent-native command packages.
