# New Tool Growth Pilot

## Decision

Build and release the pilot sequentially:

1. JSON to CSV Converter.
2. Time Zone Meeting Planner no sooner than 14 days after the first release passes live and discovery checks.
3. QR Code Generator no sooner than 14 days after the meeting planner passes the same checks.

Do not publish the later tools from a local backlog. Each release needs its own build, QA, indexing, and measurement evidence.

## July 18 Evidence

Bing Keyword Research used a global April 18 to July 15, 2026 window. These figures describe Bing market query impressions, not traffic already earned by Access Free Tools:

- `json to csv converter`: 2.5K exact-phrase impressions.
- Time-zone planner related phrases: 1.2K to 12.7K impressions.
- QR generator related phrases: 25.7K to 101.2K impressions.
- Later image, solar, moving-cost, viewing-distance, and air-fryer checks hit Bing's rate limit and remain unclassified.

Targeted Google keyword validation used twelve fixed phrases and cost $0.0939, below the $0.50 cap:

- `json to csv converter`: 1,900 US monthly searches, low competition.
- `convert json to csv`: 1,900, transactional intent, low competition.
- `time zone meeting planner`: 5,400, navigational intent, low competition.
- `world clock meeting planner`: 3,600, navigational intent, low competition.
- `qr code generator`: 823,000, medium competition.
- `free qr code generator`: 165,000, high competition.

The complete ignored evidence is stored under `output/seo-opportunities/new-tool-growth-pilot-2026-07-18/`.

## Release Gates

- Use Astro 7 and Node 24 only.
- Run the SEO workbench for the exact tool and guide.
- Require approved smoke-kawaii art, image sitemap coverage, gallery coverage, structured-data checks, visual checks, accessibility checks, and the full `npm run check`.
- Submit only the new tool and guide through Google Search Console discovery and IndexNow.
- Pause the sequence if the pages are not discovered, a sitemap or indexing check fails, CrawlScout gains new affected URLs, or the release does not meet the planned feature baseline.

## Measurement

Review each release after 28 and 56 days using fixed windows:

- Indexed state.
- Target-query impressions, clicks, and CTR.
- Organic landing sessions.
- Anonymous tool starts and downloads.

Build another tool cluster only when at least two pilot tools are indexed and at least one earns target-query impressions plus a meaningful tool action.
