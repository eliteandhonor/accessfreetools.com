# July 29 Search Recovery Handoff

## Three Wins

1. Google impressions increased 47% in the latest fixed 28-day comparison: 9,276 versus 6,292.
2. Bing clicks increased 120% in the latest fixed 28-day comparison: 44 versus 20. Kawaii calculator queries remain the strongest Bing cluster.
3. The CrawlScout sample fell from 124 to 118 rows. Seven previously affected URLs are now confirmed indexed.

## Three Issues

1. Google clicks fell from 25 to 12 despite the impression increase.
2. Search Console still reports 125 indexing gaps, so outcomes require post-crawl evidence rather than more same-day page edits.
3. `/gallery/converters/` has a recent July 28 crawl and stays protected from rewrite or repeat submission until its August 11 recheck.

## Best Next Action

Let Google process the seven visibly confirmed recrawl requests. The active weekly SEO heartbeat will recheck `/gallery/converters/` after August 11 and refresh fixed 14-day and 28-day evidence windows.

## Active Release Blocker

- Search Console visibly confirmed all seven authorized July 29 indexing requests, including Mileage and Date.
- Hostinger build `019fad32-41d2-7372-84b4-13f224800ed3` completed on Astro 7 and Node 24 with zero dependency vulnerabilities.
- The previous build briefly passed a 659-URL sitemap check and all Ask/API/MCP checks after a restart.
- The latest docs-only deployment reproduced intermittent same-URL 307 responses and 504 timeouts on both Sydney CDN edge IPs.
- Local execution of the exact built app remains healthy, so the open blocker is Hostinger's Node upstream/CDN routing, not a code rollback candidate.
- Do not approve OPS-01 or REL-01 until Hostinger intervention or a proven platform recovery is followed by stable sitemap, Ask, API, and MCP checks.

## Do Not Repeat

- Do not edit or resubmit the seven recovered URLs.
- Do not rewrite `/gallery/converters/` before the August 11 watch date.
- Do not change the Kawaii Calculator cluster without contrary evidence.
- Do not bundle the unfinished Browser AI article into this campaign release.
