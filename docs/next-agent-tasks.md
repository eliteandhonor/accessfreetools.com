# Access Free Tools Next Agent Tasks

Updated: 2026-07-29

Run `npm run automation:env-check`, `npm run aft -- status`, `npm run aft -- seo-console`, and `npm run aft -- proof-check` before choosing work. Command output and the latest normalized reports are the source of truth. Old build IDs, old screenshots, and June approval gates are historical evidence only.

## Current Evidence

- Read `agents/serpforge-ai/campaigns/2026-07-29-search-recovery/` for the current Google, Bing, CrawlScout, OpenSEO, agent, and proof handoff. July 9 and July 13 notes are historical baselines.
- The July 29 Google chart contains 48 clicks and 29,838 impressions across 87 days. Its page export contains 597 ranking URLs, 49 clicks, and 31,728 impressions; privacy filtering means these dimensions must not be substituted for chart totals.
- The matching Bing overview contains 67 clicks and 3,367 impressions. Latest fixed 28-day Bing clicks rose from 20 to 44.
- The latest CrawlScout supplied sample contains 118 not-indexed rows, down from 124 on July 18. It is not a complete crawl total.
- The controlled SEO queue is complete: 604 of 604 page review units are approved, with no active gate.
- Production is Astro 7 on Node 24. The latest production sitemap check passed 660 URLs with 0 hard failures.
- `/sitemap/` remains `noindex,follow` and excluded from XML. `/feed.xml` is an RSS feed and is not submitted to Google as a sitemap.
- The Four in a Row tool and guide are live, in XML and image sitemaps, and submitted through IndexNow and Search Console discovery. The latest exact inspection says the tool URL is unknown to Google and the guide is `Discovered - currently not indexed`, both normal watch states immediately after release.

## Task 1: July 29 Evidence And Recrawl Recovery

Priority: High, evidence-only

- First finish EV-01 through EV-03 on the dated campaign board so `aft` reads the ZIP-native Google report, matching Bing evidence, and newest inspection for each URL.
- Protect the seven confirmed recoveries from duplicate edits: Repayment guide, Watt Hours to Amp Hours tool, Mileage guide, Mean/Median/Mode/Range guide, Markdown Table guide, Concrete guide, and AI Token Cost tool.
- Request indexing in order for Character Counter, CD Calculator, Siding tool, Siding guide, and Right Triangle guide. Use later quota for Mileage and Date recrawl.
- Record successful requests only after visible Search Console confirmation. A button click is not proof.
- Keep `/gallery/converters/` in watch status through August 11 because Google crawled it on July 28.

Definition of done: a fresh Google crawl date and exact state are recorded. A manual request click alone is not an indexing result.

## Task 2: Four In A Row Pilot Evidence

Priority: High, collect until 2026-09-07

- The ignored local analytics token was configured and verified on 2026-07-13. Run `npm run analytics:production:game`, then `npm run pilot:four-in-a-row`, to refresh the private aggregate and decision gate.
- Never use `.local/analytics/events.ndjson` as production engagement evidence.
- The owner's current Chrome browser is excluded through the public Privacy Policy control, and the production API reports owner exclusion configured. Keep other owner/test browsers excluded as they are used.
- Keep the pilot collecting until at least 2026-09-07 and at least 100 measured production starts.
- Do not add another game or a Games category before the gate passes.
- The active `Weekly SEO And Pilot Evidence` heartbeat owns the recurring evidence refresh.

Definition of done: the review date, production-start threshold, owner exclusion, Search Console evidence, and aggregate behavior evidence all pass. Until then the correct decision is `collecting`, not `expand`.

## Task 3: Ranking And CTR Watch

Priority: Medium after a fresh export window

- Keep CTR work separate from index recovery.
- Do not reopen the July recovery pages from the old aggregate export. Many were improved after Google's recorded crawl and now need recrawl time.
- Use OpenSEO first for Basic Calculator, `/tools/`, Concrete Mesh, Mileage, and Character Counter. Use DataForSEO only for unresolved intent, with no more than 15 phrases and USD 0.50.
- Google impressions rose while clicks fell in the latest fixed 28-day comparison. Do not treat pages around positions 40-70 as title-only CTR problems.
- Protect the Kawaii Calculator wording unless newer evidence contradicts Bing's qualified-click cluster.
- Run `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` for every supported page-level change and record completed URLs in `docs/seo-console-completions.json`.

Definition of done: a change has current query evidence, browser proof, a passing workbench judge, and a later comparison window. Aggregate zero-click status alone is not enough.

## Task 4: Production Analytics Readiness

Priority: Medium, measurement collecting

- Production analytics decisions require `npm run analytics:production`; game decisions require `npm run analytics:production:game`.
- The private production aggregate was fetched successfully on 2026-07-13. The initial 30-day report contains one Privacy Policy page view recorded during owner setup before the browser opt-out was enabled and zero tool actions. Treat that setup event as owner traffic, not public-demand evidence.
- Keep the token in the ignored `.local/analytics-dashboard.env` file. Never commit a token, raw event log, IP, or visitor identifier.

Definition of done: owner/test traffic remains excluded and the genuine production readiness thresholds are met. The private fetch and current-browser exclusion prerequisites are complete.

## Completed And Retained

- Four in a Row release, live verification, discovery submission, visual/accessibility QA, and milestone analytics are complete.
- The seven July 18 recovery URLs listed in Task 1 now have indexed evidence and must not be reopened without newer contrary proof.
- Safe cleanup completed on July 13. The follow-up retention audit passed with `output/`, `agents/`, `.local/`, and cited proof preserved.
- SEO review queue and proof ledger pass. Do not reopen the historical `text-case-converter` gate.

## Always-On Runtime Rules

- Production and local releases use Node 24 and Astro 7.
- Ask/API/MCP use Astro Node routes; do not add PHP fallbacks or duplicate tool data.
- Public promotion requires its platform quality gate and visible public proof. Draft or button-click state is not proof.
- No page is bulk-noindexed, merged, removed from XML sitemaps, or publicly promoted from aggregate data alone.
