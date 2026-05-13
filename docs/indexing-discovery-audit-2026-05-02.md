# Indexing And Discovery Audit - 2026-05-02

Context: Google Search Console was set up on April 30, 2026. As of May 2, 2026, the home page not being indexed yet is frustrating but still inside Google's normal window for a brand-new site. Google says newly launched sites can take a few weeks to be noticed, especially when the site has few external links.

## Research Notes

- Sight AI's indexing guide recommends direct URL Inspection submission, accurate XML sitemaps, internal links from strong pages, crawlability checks, external discovery signals, RSS, and monitoring Search Console statuses.
- Google supports XML sitemap files, sitemap index files, RSS/Atom feeds, and robots.txt sitemap discovery.
- Google ignores `priority` and `changefreq`; the useful sitemap freshness signal is an accurate `lastmod` that matches a significant page update.
- Google's unauthenticated sitemap ping endpoint is deprecated, so do not build around `google.com/ping?sitemap=...`.
- Google's Indexing API is only for job posting pages and livestream video pages, not normal calculator or blog pages.
- IndexNow is useful for Bing and other participating engines, but it is not the main Google indexing path for this site.

## Changes Made

- `/sitemap.xml` is now a sitemap index instead of one large mixed sitemap.
- Added focused sub-sitemaps:
  - `/sitemap-pages.xml`
  - `/sitemap-tools.xml`
  - `/sitemap-blog.xml`
  - `/sitemap-categories.xml`
- Sitemap `lastmod` now comes from stable content dates instead of the current build date.
- `/feed.xml` now uses stable guide dates, includes a self-referencing Atom link, and limits the feed to recent guide entries so RSS behaves like a recent-content signal.
- Article meta dates and generated guide JSON-LD now use the same stable content-date source.
- The built-site audit command now follows sitemap indexes and verifies sitemap coverage across sub-sitemaps.
- Search Console API access is configured through `npm run search-console`, with OAuth tokens stored locally in `.local/`.
- DataForSEO v3 automation is configured with a free service-status check, Sandbox support for new endpoint tests, and budget guardrails before paid research runs.
- DataForSEO showed the old `/calculators` URL ranking while not appearing in the current sitemap, so that route should permanently redirect to `/categories/calculators/`.
- Bing IndexNow is configured with a public root key file and a local submitter that verifies the production key before notifying IndexNow.

## Search Console API Baseline

Canonical HTTPS property status on May 2, 2026:

- `https://accessfreetools.com/` is verified as `siteOwner`.
- `https://accessfreetools.com/sitemap.xml` was submitted to the HTTPS property and read with zero errors and zero warnings.
- `https://accessfreetools.com/feed.xml` was submitted to the HTTPS property and is pending initial processing.
- URL Inspection API says the home page is `Submitted and indexed`.
- URL Inspection API says `/tools/basic-calculator/` is `Submitted and indexed`.
- URL Inspection API says `/tools/`, `/blog/`, and `/tools/image-to-text-ocr-tool/` are `Discovered - currently not indexed`, which is common for newer URLs and should be watched before making drastic changes.

Local reports are saved outside Git:

- `output/search-console-performance.json`
- `output/search-console-canonical-fix.json`
- `output/search-console-discovery.json`
- `output/search-console-url-inspection.json`

Repeat useful checks with:

```bash
npm run search-console:submit-discovery
npm run search-console:inspect-key-urls
npm run search-console
```

## Search Console Checklist

Run this after the next production deployment finishes:

1. Submit `https://accessfreetools.com/sitemap.xml` in Search Console.
2. In the Sitemaps report, confirm Google can read the sitemap index and the child sitemaps.
3. Inspect `https://accessfreetools.com/`.
4. Run "Test live URL" and confirm:
   - Page fetch is successful.
   - Indexing is allowed.
   - The user-declared canonical is `https://accessfreetools.com/`.
   - Google-selected canonical is either the same URL or blank while not indexed yet.
5. Request indexing once for the home page.
6. Inspect one recent tool and one recent blog guide.
7. Wait and monitor the Page indexing report. Re-requesting the same URL repeatedly will not force indexing.

The domain property `sc-domain:accessfreetools.com` is the preferred Google Search Console property because it covers protocol and subdomain variations.

## Bing Webmaster Tools And IndexNow Checklist

Run this after the next production deployment finishes:

1. Open `https://accessfreetools.com/79e3e302ad4545d592d9b53f6ae2350f.txt` and confirm it shows only the IndexNow key.
2. Run `npm run indexnow:submit` to submit the current built sitemap URLs to IndexNow.
3. In Bing Webmaster Tools, confirm `https://accessfreetools.com/sitemap.xml` is listed.
4. Review IndexNow submission status and crawl/index reports after Bing processes the URLs.
5. Use IndexNow after important content updates, not as a daily unchanged-URL blast.

## Ongoing Recommendations

- Add legitimate external links from places that make sense: GitHub repository profile/readme, social profiles, useful directory listings, and any real community posts where the tool helps.
- Keep the home page linking to the most important hubs and recent useful tools.
- Keep new tools out of the sitemap until they have a real page, FAQ, blog guide, examples, related links, and a reviewed canonical URL.
- Do not update `lastmod` for tiny footer or copyright changes.
- Use Search Console's exact exclusion reason before changing code. "Crawled - currently not indexed" is usually a content-quality or duplication signal, while "Discovered - currently not indexed" is often crawl scheduling.
- Run `npm run dataforseo:status` before paid research and keep broad competitor/keyword pulls disabled when balance is at or below `$5`.
