# Google Search Central Notes

Last reviewed: 2026-07-04

These notes are the current SEO baseline for Access Free Tools. Use them before
changing indexing, redirect, sitemap, content-quality, or promotion logic.

## Sources

- Google Search Central documentation hub: https://developers.google.com/search/docs?hl=en
- Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Redirects and Google Search: https://developers.google.com/search/docs/crawling-indexing/301-redirects
- HTTP status codes, network errors, and Google Search: https://developers.google.com/search/docs/advanced/crawling/http-network-errors
- Sitemaps overview: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Page indexing report: https://support.google.com/webmasters/answer/7440203
- AMP on Google Search: https://developers.google.com/search/docs/crawling-indexing/amp
- AMP validation: https://developers.google.com/search/docs/crawling-indexing/amp/validate-amp
- Mobile-first indexing best practices: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
- Mobile indexing final update: https://developers.google.com/search/blog/2024/06/mobile-indexing-vlast-final-final.doc
- Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals

## Operating Rules

1. Keep helpful content first. Every tool and guide should answer the user's
   actual task with plain examples, honest limits, and enough detail to finish
   the job without chasing search tricks.
2. Treat trust as the highest content standard, especially finance, health,
   pregnancy, tax, construction, electrical, and AI tools.
3. Use permanent redirects for old URLs that have a clear replacement page.
   Google says server-side redirects are the strongest signal for choosing the
   redirect target as canonical.
4. Do not redirect a removed page to a weak or unrelated page. If there is no
   good replacement, let the old URL return a real 404 or 410.
5. Fix 5xx reports first. Google may slow crawling for server errors, and URLs
   that keep returning server errors can fall out of the index.
6. Keep sitemap URLs limited to canonical, indexable pages. Sitemaps help Google
   discover important pages, but they do not guarantee indexing.
7. Use Search Console as the source of truth for Google indexing, then use
   DataForSEO for market, query, and competitor context.
8. Keep one responsive canonical URL per page. Do not add AMP pages,
   `rel="amphtml"`, m-dot URLs, or mobile alternates unless a later
   evidence-backed AMP pilot explicitly approves that surface.
9. When mobile or AMP comes up, run `npm run audit:mobile-seo` after `npm run
   build` and treat mobile Lighthouse as lab evidence. Search Console and CrUX
   remain the field evidence for real users.

## 2026-07-03 AMP And Mobile-First Decision

Access Free Tools should not add AMP right now. Google indexes AMP pages under
the same standards as other pages, and Google's mobile-first guidance keeps
responsive design as the lowest-maintenance setup. This site already uses one
canonical URL per page, a viewport meta tag, and responsive CSS, and it has no
intentional AMP pages, `rel="amphtml"` tags, or separate mobile URLs.

The chosen path is a mobile-first audit lane:

```bash
npm run build
npm run audit:mobile-seo
```

That command writes `output/mobile-seo-audit/latest.md` and `.json`, checks the
built HTML for viewport, canonical, robots, structured-data basics, accidental
AMP tags, and mobile alternates, then uses Playwright to proof representative
mobile and tablet layouts.

Use Core Web Vitals targets as performance goals: LCP at or below 2.5 seconds,
INP at or below 200 ms, and CLS at or below 0.1. If Lighthouse or Search
Console shows a mobile weakness, record it as a responsive performance or page
experience task, not as an AMP task.

## Current Access Free Tools Action

Search Console email on 2026-05-07 reported new indexing blockers for
`https://accessfreetools.com/`: `Server error (5xx)` and `Not found (404)`.
The immediate fix is to keep old ranking URLs from the previous site mapped to
their closest live replacement with real 301 redirects:

- `/advanced-age-calculator` -> `/tools/age-calculator/`
- `/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025` -> `/tools/ad-revenue-calculator/`
- `/calculators` -> `/categories/calculators/`
- `/deep-research` -> `/categories/ai-tools/`

Access Free Tools keeps these mappings in Astro redirects, Astro middleware,
and `public/.htaccess`. Keep `.htaccess` limited to redirects and security
headers; API, MCP, contact, analytics, and Ask traffic should reach the Astro
Node routes.

After deployment, run:

```bash
npm run search-console:submit-discovery
npm run search-console:inspect-key-urls
npm run indexnow:submit -- https://accessfreetools.com/changed-path/
```

Repeat `--url=...` for each changed canonical URL. Use
`npm run indexnow:submit-all` only for a migration, large launch, or major
sitemap change; routine releases should not resend every unchanged URL.

Then wait for Search Console to reprocess the old URLs. Redirect warnings for
old moved URLs can be normal, but 5xx errors are not. As of 2026-07-04, the
Search Console submission helper uses the XML sitemap set as the Google
discovery source, no longer submits `/feed.xml` by default, and prunes any older
feed sitemap submission when the API permits it. The feed remains live for RSS
readers and intentionally returns `noindex,follow`, so submitting it as a sitemap
only adds noise to Page indexing reports.

### 2026-07-04 Page Indexing Watch Lane

If Search Console reports that page-indexing fixes failed after the feed sitemap
cleanup, treat it as a watch-and-sample lane unless live checks show a hard
blocker. Do not restart validation immediately and do not bulk-edit every
`Crawled - currently not indexed` URL.

Use this sequence after Google has had time to recrawl:

```bash
npm run search-console:import-coverage
npm run search-console:inspect-key-urls
npm run check:production-sitemap
npm run aft -- site-sitemap
```

Then inspect a rotating sample from the latest Coverage Drilldown export. A
sample URL should have successful page fetch, indexing allowed, a matching
canonical, and no noindex/meta robots conflict. If those checks pass, the next
action is content quality or internal-link prioritization for the exact sampled
URL, not a sitewide sitemap or robots change.

## 2026-05-09 Discovery Follow-Up

Search Console now reports the homepage, Basic Calculator, and Image to Text
OCR Tool as submitted and indexed. The larger `/tools/` and `/blog/` hubs, plus
the Wallpaper Calculator and Watts to Amps Calculator tool pages, still need
more crawl time. The current best action is to strengthen clean internal links,
keep the XML sitemap set submitted, and avoid creating duplicate thin pages for
the same topics.

The homepage now links directly to Watts to Amps, Wallpaper, OCR, the matching
guides, `/tools/`, and `/blog/`. The daily Search Console inspection set also
tracks those priority pages so agents do not miss the remaining discovery gap.
Keep the RSS feed discoverable for subscribers, but do not submit it as a Google
sitemap unless a later Search Console test shows a clear benefit.

## 2026-05-10 Fresh Inspection Notes

The daily SEO run completed successfully after the previous automation report
showed a transient API fetch failure. DataForSEO, Search Console inspection,
SEO self-evaluation, and IndexNow key verification all ran without OAuth
blocking.

Search Console now confirms the old ranking redirect targets are indexable:
`/categories/calculators/`, `/categories/ai-tools/`, `/tools/ad-revenue-calculator/`,
and `/blog/how-to-use-ad-revenue-calculator/` are submitted and indexed. Keep
watching `/tools/`, `/blog/`, `/tools/age-calculator/`, `/tools/watts-to-amps-calculator/`,
`/tools/wallpaper-calculator/`, and `/blog/how-to-use-wallpaper-calculator/`.
The wallpaper guide has at least moved to "Crawled - currently not indexed,"
which means Google fetched it successfully but has not selected it for the index
yet.

## 2026-05-13 Fresh Inspection Notes

The daily SEO run completed with DataForSEO, Search Console, and IndexNow key
verification working from the browser-enabled environment. Search Console now
shows `/tools/`, `/blog/`, and `/tools/age-calculator/` as submitted and
indexed, which confirms the earlier discovery problem is improving.

Two priority tool pages remain unknown to Google:

- `/tools/watts-to-amps-calculator/`
- `/tools/wallpaper-calculator/`

Their matching guides are indexed. Keep the tool pages in sitemap coverage,
link them from indexed hubs and related guides, and avoid creating duplicate
thin pages. The tools hub and free calculator resources page now include
stronger contextual links to those pages.

Follow-up verification after the Hostinger/API deployment confirmed the live
homepage, `/tools/`, `/free-calculator-resources/`, and `sitemap-tools.xml`
all expose direct links to both remaining tool URLs. `npm run
search-console:inspect-key-urls` still reports only those two tool pages as
unknown to Google, while both matching blog guides are submitted and indexed.
Use `npm run search-console:submit-discovery` and submit the two changed tool
URLs with explicit `npm run indexnow:submit -- https://...` values after the next
deploy. Do not use npm argument forwarding for Search Console flags because npm
11 can treat those flags as npm config.

## 2026-05-14 Discovery Follow-Up

The remaining saved Search Console gaps are still the exact tool URLs for
`/tools/watts-to-amps-calculator/` and `/tools/wallpaper-calculator/`. Their
matching guides are indexed, so the next useful move is to make the tool URLs
easier to discover from indexed hubs and discovery pings.

The blog hub now links directly to both tool pages in the early-demand section,
not only to the guide pages. The default IndexNow priority URL list also now
includes the two tool URLs, their matching guides, and the calculators and
home-projects category hubs. After deployment, submit the changed tool, guide,
and hub URLs explicitly with `npm run indexnow:submit -- https://...`, run
`npm run search-console:submit-discovery`, then inspect key URLs again.

## 2026-05-15 Fresh Inspection Notes

The Search Console refresh now reports `/tools/watts-to-amps-calculator/` as
submitted and indexed. The only remaining key URL gap is
`/tools/wallpaper-calculator/`, while its matching guide is submitted and
indexed.

The next Wallpaper action is discovery and contextual support, not a duplicate
page. The Square Footage Calculator now links directly to the Wallpaper
Calculator because wall area is a natural step before wallpaper roll planning.
Paint and Flooring FAQs also now explain when to switch to Wallpaper-specific
roll, waste, and pattern-repeat math.

## 2026-07-13 Current Inspection Notes

The current key-URL inspection set confirms the homepage, `/tools/`, `/blog/`,
major category hubs, Basic Calculator, OCR, Age, Ad Revenue, Watts to Amps, and
the Wallpaper tool are submitted and indexed with successful fetches.

Three older crawl records remain `Crawled - currently not indexed`: the Personal
Loan tool, its guide, and the Wallpaper guide. Their current built pages already
have 8, 5, and 9 internal-link sources respectively. XML sitemap discovery was
refreshed on July 13, so the next action is a manual request when the Search
Console UI is available, followed by a later exact inspection. Do not add
duplicate links or rewrite these pages from the old crawl state alone.

The newly released Four in a Row tool and guide appear in the submitted XML
sitemaps. The first post-release inspection found both discovered; the later
expanded inspection reports the tool URL as unknown to Google and the guide as
`Discovered - currently not indexed`. These are new-page watch states, not
evidence of a technical indexing defect. The rotating inspection set now
includes the game pair plus Device Battery Life, Brick, and Unit Price so future
automation can compare fresh crawl dates without relying on thread memory.
