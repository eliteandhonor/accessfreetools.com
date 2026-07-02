# Access Free Tools Next Agent Tasks

Generated: 2026-07-02

Use this task board after `npm run aft -- status` and `npm run aft -- seo-console`. Do not use older May or June notes as the source of truth for current SEO recovery.

## Evidence Snapshot

- Branch: `main`.
- Recovery PR `#55` merged as commit `6092a12d34b72ca30f1fb3d81c0304a3bf4a832b`.
- Hostinger Node build `019f22f1-1fee-70b9-ab72-943ea88f35fe` completed with `entry=app.js`.
- `npm run check:live-ask`: pass; `/api/v1/ask` uses `access-free-tools-parser`, `/api/v1/tools` returns 20 tools, and MCP exposes `search_tools`, `get_tool_schema`, `run_tool`, and `fetch_tool_guide`.
- `npm run aft -- ask-audit`, `npm run aft -- api-ready`, and `npm run aft -- mcp-smoke`: pass after deploy.
- `npm run check:production-sitemap`: 646 OK URLs, 4 redirects, 0 hard failures after deploy.
- `npm run aft -- status`: DataForSEO live balance 14.47 USD, Hostinger OK, promotion queue 67 rows, indexing gaps 0, GSC performance import present with 103 deindexed URLs and 25 high-impression zero-click pages.
- `npm run aft -- seo-tool-queue`: pass, 598 approved page review units, 0 remaining, active gate none.
- `npm run aft -- proof-check`: pass, no missing public proof on claimed rows.
- `npm run aft -- seo-console`: attention, but completed recovery pages and the monitor-only `/sitemap/` row are suppressed.
- `npm run maintenance:audit`: pass, dirty files none before this task-board refresh, safe cleanup candidates 451.19 MB.
- `npm run check`: pass, 222 tests, build, links, site audit, structured data, performance budget, AI asset guard, image QA, gallery QA, secrets, and npm audit.
- `npm run search-console:submit-discovery` and `npm run search-console:inspect-key-urls`: blocked because `.local/google-search-console-client-secret.json` is missing.

## Completed Local Recovery Batches

- Tier A recovery batch: 13 pages have targeted paid DataForSEO evidence, competitor-gap evidence, fresh render proof, refreshed page-score/research reports, and SEO workbench final judges with 0 remaining gaps.
- First CTR batch plus follow-ons: 17 pages have exact-page proof and final SEO workbench judges with 0 remaining gaps.
- Follow-on deindexed batch: retaining wall tool, quadratic formula tool, concrete guide, annuity payout guide, pension guide, and UUID guide have final judges with 0 remaining gaps.
- `/sitemap/` is intentionally `noindex,follow`, excluded from XML sitemaps, and should be monitored rather than rewritten as a search landing page.

## Task 1: Restore Search Console OAuth And Submit Discovery

Priority: High

Work:

- Restore the local Search Console OAuth client secret at `.local/google-search-console-client-secret.json`, set `GSC_CLIENT_SECRET_PATH`, pass `--client-secret=...`, or keep one `client_secret_*.json` file in `.local/`.
- Run `npm run search-console:submit-discovery`.
- Run `npm run search-console:inspect-key-urls`.
- Inspect representative recovered URLs from Tier A, CTR, and follow-on deindexed batches.
- Keep URL Inspection results separate from ranking/indexing claims; record exact status, fetch result, robots/indexing state, and canonical match.

Definition of done:

- Discovery submission report exists.
- URL inspection report exists or records a new exact OAuth/access blocker.
- Recovery audit handoff names any URLs that still need manual request-indexing or follow-up.

## Task 2: Work The Next SEO Console Batch

Priority: Medium

Current targets from `npm run aft -- seo-console`:

- `/blog/`
- `/tools/mileage-calculator/`
- `/tools/flooring-calculator/`
- `/blog/how-to-use-big-number-calculator/`
- `/blog/how-to-use-molarity-calculator/`
- `/tools/mortgage-calculator-uk/`

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
- Run `npm run maintenance:clean:safe` only after Search Console follow-up is restored or explicitly deferred.
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
- Hostinger Node build `019f22f1-1fee-70b9-ab72-943ea88f35fe` completed with `entry=app.js`.
- Post-deploy live Ask/API/MCP checks passed.
- Production sitemap has 0 hard failures.
