# Access Free Tools Next Agent Tasks

Generated: 2026-07-02

Use this task board after `npm run aft -- status` and `npm run aft -- seo-console`. Do not use older May or June notes as the source of truth for current SEO recovery.

## Evidence Snapshot

- Branch: `codex/gsc-indexation-recovery`.
- Local recovery branch has uncommitted source changes and ignored proof artifacts; do not assume the fixes are live until the commit/push/deploy flow is complete.
- `npm run aft -- status`: DataForSEO live balance 14.47 USD, Hostinger OK, promotion queue 67 rows, indexing gaps 0, GSC performance import present with 103 deindexed URLs and 25 high-impression zero-click pages.
- `npm run aft -- seo-tool-queue`: pass, 598 approved page review units, 0 remaining, active gate none.
- `npm run aft -- proof-check`: pass, no missing public proof on claimed rows.
- `npm run aft -- seo-console`: attention, but completed recovery pages and the monitor-only `/sitemap/` row are suppressed.
- `npm run maintenance:audit`: pass, safe cleanup candidates 451.21 MB.
- `npm run check`: pass, 222 tests, build, links, site audit, structured data, performance budget, AI asset guard, image QA, gallery QA, secrets, and npm audit.

## Completed Local Recovery Batches

- Tier A recovery batch: 13 pages have targeted paid DataForSEO evidence, competitor-gap evidence, fresh render proof, refreshed page-score/research reports, and SEO workbench final judges with 0 remaining gaps.
- First CTR batch plus follow-ons: 17 pages have exact-page proof and final SEO workbench judges with 0 remaining gaps.
- Follow-on deindexed batch: retaining wall tool, quadratic formula tool, concrete guide, annuity payout guide, pension guide, and UUID guide have final judges with 0 remaining gaps.
- `/sitemap/` is intentionally `noindex,follow`, excluded from XML sitemaps, and should be monitored rather than rewritten as a search landing page.

## Task 1: Release The Recovery Branch

Priority: High

Work:

- Review the current diff and commit the recovery branch.
- Push the branch or merge/push to the branch Hostinger builds from.
- Run `npm run hostinger:deploy-node` only after the exact deployment action is approved or already covered by the active owner directive.
- Hostinger deployment defaults to Node 24, `app.js`, output directory `dist`, build script `build`, and package manager `npm`.
- If Node 24 deployment fails, use `HOSTINGER_NODE_VERSION=22` only as an explicit rollback path, then redeploy the verified Node 24 build when healthy.

Definition of done:

- Latest GitHub commit contains the recovery changes.
- Hostinger latest build uses `entry=app.js`.
- `npm run check:live-ask`, `npm run aft -- ask-audit`, `npm run aft -- api-ready`, and `npm run aft -- mcp-smoke` pass after deploy.
- `npm run check:production-sitemap` reports 0 hard failures.

## Task 2: Submit Discovery And Inspect Priority URLs

Priority: High

Work:

- Run `npm run search-console:submit-discovery` after the deployed build is live.
- Run `npm run search-console:inspect-key-urls` when OAuth is available.
- Inspect representative recovered URLs from Tier A, CTR, and follow-on deindexed batches.
- Keep URL Inspection results separate from ranking/indexing claims; record exact status, fetch result, robots/indexing state, and canonical match.

Definition of done:

- Discovery submission report exists.
- URL inspection report exists or records the OAuth/access blocker.
- Recovery audit handoff names any URLs that still need manual request-indexing or follow-up.

## Task 3: Work The Next SEO Console Batch

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

## Task 4: Cleanup After Release Proof

Priority: Medium

Work:

- Run `npm run maintenance:clean:dry-run`.
- Run `npm run maintenance:clean:safe` only after deployment/Search Console follow-up is stable.
- Preserve `output/`, `agents/`, `.local/`, Codex sessions, and proof artifacts.

Definition of done:

- Dry-run lists only allowlisted rebuildable artifacts.
- Safe cleanup does not remove SEO proof, Codex state, secrets, source files, or generated evidence needed for the recovery handoff.
- `npm run maintenance:audit` still passes afterward.

## Task 5: Resume Promotion Only After Fresh Crawl Signals

Priority: Medium

Work:

- Do not amplify pages Google currently treats as uncertain until the deployed recovery branch has fresh crawl/index signals.
- Use `npm run marketing:orchestrate` for current promotion priority.
- Run platform quality gates before any Medium, Reddit, Bluesky, Quora, or DEV draft is used publicly.
- Never mark a promotion row posted, updated, or done without a public URL or visible proof.

Definition of done:

- `npm run aft -- proof-check` stays clean.
- Promotion queue updates cite proof paths or public URLs.

## Task 6: Keep API And MCP Runtime Stable

Priority: Always

Work:

- Use `docs/ask-api-mcp-alpha.md` before Ask/API/MCP changes.
- Do not add PHP fallback routes or duplicated PHP tool data.
- Run `npm run check:live-ask` after Hostinger rebuilds.

Definition of done:

- `/api/v1/tools`, `/api/openapi.json`, `/api/v1/ask`, `/mcp`, and `/admin/agent-tools/` return live Node responses after deployment.
- No static fallback is accepted for API/MCP/Admin report routes.
