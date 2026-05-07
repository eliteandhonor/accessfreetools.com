# Google Search Central Notes

Last reviewed: 2026-05-07

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

After deployment, run:

```bash
npm run search-console:submit-discovery
npm run search-console:inspect-key-urls
npm run indexnow:submit
```

Then wait for Search Console to reprocess the old URLs. Redirect warnings for
old moved URLs can be normal, but 5xx errors are not.
