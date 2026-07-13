# Access Free Tools Next Agent Tasks

Updated: 2026-07-13

Run `npm run automation:env-check`, `npm run aft -- status`, `npm run aft -- seo-console`, and `npm run aft -- proof-check` before choosing work. Command output and the latest normalized reports are the source of truth. Old build IDs, old screenshots, and June approval gates are historical evidence only.

## Current Evidence

- Read `docs/july-9-seo-evidence-recovery.md` for the current Google, Bing, and CrawlScout handoff.
- Latest imported performance evidence: Google has 593 ranking URLs, 24,662 page impressions, 41 clicks, and 0.17% page CTR; Bing has 2,097 impressions, 32 clicks, and 1.53% CTR.
- The latest CrawlScout sample contains 137 not-indexed rows. It is a supplied sample, not a complete crawl total.
- The controlled SEO queue is complete: 604 of 604 page review units are approved, with no active gate.
- Production is Astro 7 on Node 24. The July 13 production sitemap check passed 656 URLs with 0 hard failures.
- `/sitemap/` remains `noindex,follow` and excluded from XML. `/feed.xml` is an RSS feed and is not submitted to Google as a sitemap.
- The Four in a Row tool and guide are live, in XML and image sitemaps, and submitted through IndexNow and Search Console discovery. The latest exact inspection says the tool URL is unknown to Google and the guide is `Discovered - currently not indexed`, both normal watch states immediately after release.

## Task 1: Search Console Recrawl Watch

Priority: High, evidence-only

- Exact July 13 inspection reports Personal Loan tool, Personal Loan guide, and Wallpaper guide as `Crawled - currently not indexed` with successful fetches. Their current pages already have 8, 5, and 9 built internal-link sources respectively.
- Device Battery Life, Brick, and Unit Price also have old Google crawl evidence that predates current page versions. Keep them in the rotating exact-inspection set.
- The July 13 evening Search Console batch accepted Personal Loan tool, Device Battery Life, Brick, Unit Price, and the Four in a Row tool into the priority crawl queue. Google then reported the daily quota on the Wallpaper guide. The next manual batch is limited to the Wallpaper guide, Personal Loan guide, and Four in a Row guide; do not resubmit the five accepted URLs.
- Request indexing manually only when the Search Console UI is available and the daily quota allows it. Record successful requests in `docs/search-console-indexing-requests.json`.
- Do not rewrite these pages, add duplicate links, restart broad validation, or change sitemap architecture until a fresh crawl evaluates the current versions.

Definition of done: a fresh Google crawl date and exact state are recorded. A manual request click alone is not an indexing result.

## Task 2: Four In A Row Pilot Evidence

Priority: High, collect until 2026-09-07

- Run `npm run analytics:production:game` only when the ignored local analytics token is configured, then run `npm run pilot:four-in-a-row`.
- Never use `.local/analytics/events.ndjson` as production engagement evidence.
- Keep the pilot collecting until at least 2026-09-07 and at least 100 measured production starts, with owner/test exclusion confirmed.
- Do not add another game or a Games category before the gate passes.
- The active `Weekly SEO And Pilot Evidence` heartbeat owns the recurring evidence refresh.

Definition of done: the review date, production-start threshold, owner exclusion, Search Console evidence, and aggregate behavior evidence all pass. Until then the correct decision is `collecting`, not `expand`.

## Task 3: Ranking And CTR Watch

Priority: Medium after a fresh export window

- Keep CTR work separate from index recovery.
- Do not reopen the July recovery pages from the old aggregate export. Many were improved after Google's recorded crawl and now need recrawl time.
- Re-import newer Google, Bing, and CrawlScout exports when provided, compare against the July baseline, and use exact query/page evidence before editing.
- Run `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` for every supported page-level change and record completed URLs in `docs/seo-console-completions.json`.

Definition of done: a change has current query evidence, browser proof, a passing workbench judge, and a later comparison window. Aggregate zero-click status alone is not enough.

## Task 4: Production Analytics Readiness

Priority: Medium, private setup required

- Production analytics decisions require `npm run analytics:production`; game decisions require `npm run analytics:production:game`.
- The local analytics token is currently absent, so production aggregate evidence is `not enough data`. Do not invent it and do not promote local QA events into business evidence.
- Follow `docs/analytics-dashboard.md` for private token setup. Never commit a token, raw event log, IP, or visitor identifier.

Definition of done: the private production aggregate can be fetched, owner/test traffic is excluded or explicitly documented, and readiness thresholds are met.

## Completed And Retained

- Four in a Row release, live verification, discovery submission, visual/accessibility QA, and milestone analytics are complete.
- Safe cleanup completed on July 13. The follow-up retention audit passed with `output/`, `agents/`, `.local/`, and cited proof preserved.
- SEO review queue and proof ledger pass. Do not reopen the historical `text-case-converter` gate.

## Always-On Runtime Rules

- Production and local releases use Node 24 and Astro 7.
- Ask/API/MCP use Astro Node routes; do not add PHP fallbacks or duplicate tool data.
- Public promotion requires its platform quality gate and visible public proof. Draft or button-click state is not proof.
- No page is bulk-noindexed, merged, removed from XML sitemaps, or publicly promoted from aggregate data alone.
