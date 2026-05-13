# Google Search Central Notes

Last reviewed: 2026-05-13

These notes are the current SEO baseline for Access Free Tools. Use them before
changing indexing, redirect, sitemap, content-quality, or promotion logic.

## Sources

- Google Search Central documentation hub: https://developers.google.com/search/docs?hl=en
- Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Redirects and Google Search: https://developers.google.com/search/docs/crawling-indexing/301-redirects
- HTTP status codes, network errors, and Google Search: https://developers.google.com/search/docs/advanced/crawling/http-network-errors
- Sitemaps overview: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Page indexing report: https://support.google.com/webmasters/answer/7440203

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
and `public/.htaccess`. The `.htaccess` fallback matters because Hostinger can
serve the static output before the Node middleware sees the request.

After deployment, run:

```bash
npm run search-console:submit-discovery
npm run search-console:inspect-key-urls
npm run indexnow:submit
```

Then wait for Search Console to reprocess the old URLs. Redirect warnings for
old moved URLs can be normal, but 5xx errors are not.

## 2026-05-09 Discovery Follow-Up

Search Console now reports the homepage, Basic Calculator, and Image to Text
OCR Tool as submitted and indexed. The larger `/tools/` and `/blog/` hubs, plus
the Wallpaper Calculator and Watts to Amps Calculator tool pages, still need
more crawl time. The current best action is to strengthen clean internal links,
keep the sitemap and feed submitted, and avoid creating duplicate thin pages for
the same topics.

The homepage now links directly to Watts to Amps, Wallpaper, OCR, the matching
guides, `/tools/`, and `/blog/`. The daily Search Console inspection set also
tracks those priority pages so agents do not miss the remaining discovery gap.

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
Use `npm run search-console:submit-discovery` and `npm run indexnow:submit`
after the next deploy; do not use npm argument forwarding for Search Console
flags because npm 11 can treat those flags as npm config.
