# Access Free Tools Next Agent Tasks

Generated: 2026-07-02

Use this task board after `npm run aft -- status` and `npm run aft -- seo-console`. Do not use older May or June notes as the source of truth for current SEO recovery.

## Evidence Snapshot

- Branch: `main`.
- Recovery PR `#55` merged as commit `6092a12d34b72ca30f1fb3d81c0304a3bf4a832b`.
- Final Hostinger Node build `019f22f6-9b54-7264-b899-486e4aa1b844` completed with `entry=app.js`.
- `npm run check:live-ask`: pass; `/api/v1/ask` uses `access-free-tools-parser`, `/api/v1/tools` returns 24 tools after the Amps to Watts Calculator API expansion, and MCP exposes `search_tools`, `get_tool_schema`, `run_tool`, and `fetch_tool_guide`.
- `npm run aft -- ask-audit`, `npm run aft -- api-ready`, and `npm run aft -- mcp-smoke`: pass after deploy.
- `npm run check:production-sitemap`: 646 OK URLs, 4 redirects, 0 hard failures after deploy.
- `npm run aft -- status`: DataForSEO live balance 14.47 USD, Hostinger OK, promotion queue 67 rows, indexing gaps 3, GSC performance import present with 103 deindexed URLs and 25 high-impression zero-click pages.
- `npm run aft -- seo-tool-queue`: pass, 598 approved page review units, 0 remaining, active gate none.
- `npm run aft -- proof-check`: pass, no missing public proof on claimed rows.
- `npm run aft -- seo-console`: attention, but completed recovery pages and the monitor-only `/sitemap/` row are suppressed.
- `npm run maintenance:audit`: pass, dirty files none before this task-board refresh, safe cleanup candidates 451.19 MB.
- `npm run check`: pass, 223 tests, build, links, site audit, structured data, performance budget, AI asset guard, image QA, gallery QA, secrets, and npm audit.
- `npm run search-console:submit-discovery`: pass after restoring ignored local OAuth files; submitted `https://accessfreetools.com/sitemap.xml` and `https://accessfreetools.com/feed.xml`; latest rerun on 2026-07-03 at 01:14 Australia/Brisbane shows sitemap API report 0 errors and 0 warnings.
- `npm run indexnow:submit`: pass on 2026-07-03 at 01:15 Australia/Brisbane; submitted 642 URLs with HTTP 200 OK.
- `npm run search-console:inspect-key-urls`: pass on 2026-07-03 at 01:15 Australia/Brisbane; 11 key URLs are `PASS` / `Submitted and indexed`; 3 key URLs are `NEUTRAL` / `Crawled - currently not indexed`: `/tools/watts-to-amps-calculator/`, `/blog/how-to-use-ad-revenue-calculator/`, and `/blog/how-to-use-watts-to-amps-calculator/`.
- Search Console UI request-indexing action: completed on 2026-07-03 at about 01:20 Australia/Brisbane for the 3 neutral URLs. Each returned the Search Console success dialog: `Indexing requested` / `URL was added to a priority crawl queue.`
- `node scripts/seo-agent-workbench.mjs judge mileage-calculator tool`: pass on the follow-up CTR review; page score 100, FAQ score 100, tone score 100, paid DataForSEO evidence present, competitor-gap evidence present, browser proof present, and 0 remaining gaps.
- `node scripts/seo-agent-workbench.mjs judge flooring-calculator tool`: pass on the follow-up CTR review; page score 100, FAQ score 100, tone score 100, paid DataForSEO evidence present, competitor-gap evidence present, browser proof present, and 0 remaining gaps.
- `/blog/` CTR hub pass: source update tightened the title, meta description, H1, above-fold copy, CollectionPage name/description, and guide shortcuts for the 316-impression zero-click GSC row. Proof: `docs/seo-console-completions.json`, `output/seo-tool-review/blog-index/browser-proof-blog-index-local-final-playwright-2026-07-02-summary.json`, `npm run check:links`, `npm run check:site`, `npm run check:structured-data`, and `npm run audit:ai-crawler`.
- `/blog/how-to-use-big-number-calculator/` CTR pass: source update replaced generic rendered FAQ cards with exact Big Number Calculator questions, refreshed the guide modified date to 2026-07-02, and revalidated intent. Proof: `docs/seo-console-completions.json`, `output/seo-tool-review/big-number-calculator/blog/page-score.md`, `output/seo-tool-review/big-number-calculator/blog/dataforseo-paid.md`, `output/seo-tool-review/big-number-calculator/blog/competitor-gap.md`, `output/seo-tool-review/big-number-calculator/blog/browser-proof-big-number-calculator-blog-local-final-playwright-2026-07-02-summary.json`, and `output/seo-agents/big-number-calculator/blog/final-judge.md`.
- `/blog/how-to-use-molarity-calculator/` CTR pass: source update tightened the title, meta description, visible FAQ set, and guide modified date around grams-to-M intent and the 0.2 M NaCl example. Proof: `docs/seo-console-completions.json`, `output/seo-tool-review/molarity-calculator/blog/page-score.md`, `output/seo-tool-review/molarity-calculator/blog/dataforseo-paid.md`, `output/seo-tool-review/molarity-calculator/blog/competitor-gap.md`, `output/seo-tool-review/molarity-calculator/blog/browser-proof-molarity-blog-local-final-playwright-2026-07-03-summary.json`, and `output/seo-agents/molarity-calculator/blog/final-judge.md`.
- `/tools/mortgage-calculator-uk/` CTR pass: source update tightened the title/meta around UK repayments, LTV, and deposit intent; replaced the generic finance FAQ lead with UK mortgage-specific questions; refreshed the tool and structured-data modified date to 2026-07-03; and revalidated with paid DataForSEO, competitor-gap, browser proof, and final SEO judge evidence. Proof: `docs/seo-console-completions.json`, `output/seo-tool-review/mortgage-calculator-uk/tool/page-score.md`, `output/seo-tool-review/mortgage-calculator-uk/tool/dataforseo-paid.md`, `output/seo-tool-review/mortgage-calculator-uk/tool/competitor-gap.md`, `output/seo-tool-review/mortgage-calculator-uk/tool/browser-proof-mortgage-uk-tool-local-final-playwright-2026-07-03-summary.json`, and `output/seo-agents/mortgage-calculator-uk/tool/final-judge.md`.

## Completed Local Recovery Batches

- Tier A recovery batch: 13 pages have targeted paid DataForSEO evidence, competitor-gap evidence, fresh render proof, refreshed page-score/research reports, and SEO workbench final judges with 0 remaining gaps.
- First CTR batch plus follow-ons: 17 pages have exact-page proof and final SEO workbench judges with 0 remaining gaps.
- Follow-on deindexed batch: retaining wall tool, quadratic formula tool, concrete guide, annuity payout guide, pension guide, and UUID guide have final judges with 0 remaining gaps.
- Follow-up CTR proof: Mileage Calculator tool has refreshed paid evidence, competitor-gap evidence, page score, browser proof, approval status, and a final SEO workbench judge with 0 remaining gaps. No source edit was needed.
- Follow-up CTR proof: Flooring Calculator tool has refreshed paid evidence, competitor-gap evidence, page score, browser proof, approval status, and a final SEO workbench judge with 0 remaining gaps. No source edit was needed.
- Follow-up CTR proof: `/blog/` has refreshed free-calculator-guide metadata, above-fold copy, and shortcut links based on the 2026-07-02 GSC performance export. It is tracked in `docs/seo-console-completions.json` so stale GSC data does not keep re-adding it to the SEO console.
- Follow-up CTR proof: `/blog/how-to-use-big-number-calculator/` has refreshed visible FAQ copy, a 2026-07-02 modified date, paid DataForSEO evidence, Calculator.net and Defuse competitor-gap evidence, rendered content proof, browser proof, approval status, and a final SEO workbench judge with 0 remaining gaps. It is tracked in `docs/seo-console-completions.json` so stale GSC data does not keep re-adding it to the SEO console.
- Follow-up CTR proof: `/blog/how-to-use-molarity-calculator/` has a refreshed formula/example-focused title and meta description, exact visible FAQ copy, a 2026-07-03 modified date, paid DataForSEO evidence, Calculator.net and Omni Calculator competitor-gap evidence, rendered content proof, browser proof, approval status, and a final SEO workbench judge with 0 remaining gaps. It is tracked in `docs/seo-console-completions.json` so stale GSC data does not keep re-adding it to the SEO console.
- Follow-up CTR proof: `/tools/mortgage-calculator-uk/` has a refreshed UK repayments/LTV/deposit title and meta description, exact visible FAQ lead copy, a 2026-07-03 tool and structured-data modified date, paid DataForSEO evidence, Calculator.net and MortgageCalculator.uk competitor-gap evidence, browser proof, approval status, and a final SEO workbench judge with 0 remaining gaps. It is tracked in `docs/seo-console-completions.json` so stale GSC data does not keep re-adding it to the SEO console.
- `/sitemap/` is intentionally `noindex,follow`, excluded from XML sitemaps, and should be monitored rather than rewritten as a search landing page.

## Task 1: Monitor Fresh Search Console Indexing

Priority: High

Work:

- Keep the restored local Search Console OAuth files in ignored `.local/` only; never commit the client secret or token.
- Discovery was refreshed on 2026-07-03 at 01:14 Australia/Brisbane; rerun only after meaningful sitemap/content changes or if the report goes stale.
- Track the 3 current neutral key URLs: `/tools/watts-to-amps-calculator/`, `/blog/how-to-use-ad-revenue-calculator/`, and `/blog/how-to-use-watts-to-amps-calculator/`.
- Search Console UI request-indexing was submitted for those three URLs on 2026-07-03 at about 01:20 Australia/Brisbane. Do not repeat the request-indexing clicks unless Search Console later shows a new reason or enough time has passed for a meaningful recrawl check.
- Recheck the three neutral URLs after Google crawls; current local evidence still shows `Crawled - currently not indexed`, successful fetch, indexing allowed, and canonical match.
- Inspect representative recovered URLs from Tier A, CTR, and follow-on deindexed batches when choosing the next recovery batch.
- Keep URL Inspection results separate from ranking/indexing claims; record exact status, fetch result, robots/indexing state, and canonical match.

Definition of done:

- Discovery submission report exists.
- URL inspection report exists.
- The 3 current neutral URLs either become `PASS` / `Submitted and indexed` or have a newer exact Google reason recorded.
- Recovery audit handoff names any URLs that still need follow-up after the 2026-07-03 request-indexing submissions.

## Task 2: Work The Next SEO Console Batch

Priority: Medium

Current targets from `npm run aft -- seo-console`:

- No active fixable page target was left by the latest local completion pass. Rerun `npm run aft -- seo-console` before choosing the next page because fresh GSC data or manual indexing work can change the queue.

Work:

- Use `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` for page-level SEO work.
- Use paid DataForSEO only where exact intent validation is useful.
- Use competitor-gap checks for original topic-gap evidence, not copied wording.
- Capture fresh browser proof and rerun the final judge before claiming a page is clear.

Definition of done:

- Each worked page has page score/research, paid evidence when needed, competitor evidence when fetchable, browser proof, and final judge 0 gaps.
- `npm run aft -- seo-console` no longer recommends the same page unless fresh GSC evidence still supports another action.

## Task 3: Cleanup After Release Proof

Priority: Medium

Work:

- Run `npm run maintenance:clean:dry-run`.
- Run `npm run maintenance:clean:safe` in a separate cleanup pass now that Search Console follow-up is restored, preserving proof paths and ignored secrets.
- Preserve `output/`, `agents/`, `.local/`, Codex sessions, and proof artifacts.

Definition of done:

- Dry-run lists only allowlisted rebuildable artifacts.
- Safe cleanup does not remove SEO proof, Codex state, secrets, source files, or generated evidence needed for the recovery handoff.
- `npm run maintenance:audit` still passes afterward.

## Task 4: Resume Promotion Only After Fresh Crawl Signals

Priority: Medium

Work:

- Do not amplify pages Google currently treats as uncertain until the deployed recovery branch has fresh crawl/index signals.
- Use `npm run marketing:orchestrate` for current promotion priority.
- Run platform quality gates before any Medium, Reddit, Bluesky, Quora, or DEV draft is used publicly.
- Never mark a promotion row posted, updated, or done without a public URL or visible proof.

Definition of done:

- `npm run aft -- proof-check` stays clean.
- Promotion queue updates cite proof paths or public URLs.

## Task 5: Keep API And MCP Runtime Stable

Priority: Always

Work:

- Use `docs/ask-api-mcp-alpha.md` before Ask/API/MCP changes.
- Do not add PHP fallback routes or duplicated PHP tool data.
- Run `npm run check:live-ask` after Hostinger rebuilds.

Definition of done:

- `/api/v1/tools`, `/api/openapi.json`, `/api/v1/ask`, `/mcp`, and `/admin/agent-tools/` return live Node responses after deployment.
- No static fallback is accepted for API/MCP/Admin report routes.

## Completed Release Work

- Recovery PR `#55` merged to `main`.
- Final Hostinger Node build `019f22f6-9b54-7264-b899-486e4aa1b844` completed with `entry=app.js`.
- Post-deploy live Ask/API/MCP checks passed.
- Production sitemap has 0 hard failures.
- Search Console discovery and key URL inspection are restored from ignored local OAuth files; three key URLs remain crawled but not indexed, and request-indexing was submitted for all three on 2026-07-03 at about 01:20 Australia/Brisbane.
