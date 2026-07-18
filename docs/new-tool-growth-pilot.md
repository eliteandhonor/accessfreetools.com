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

## JSON To CSV Release Evidence

The first pilot release went live on July 18, 2026:

- Tool: `https://accessfreetools.com/tools/json-to-csv-converter/`
- Guide: `https://accessfreetools.com/blog/how-to-use-json-to-csv-converter/`
- Release commit: `5fc6b982`
- Hostinger build: `019f7437-e0f2-71e0-b6f2-b20c53f1bd69`
- Runtime: Astro 7 on Node 24.
- Production sitemap: 659 URLs checked, 0 hard failures.
- Browser proof: desktop and 390 x 844 mobile checks passed for conversion, formula protection, canonical metadata, Clarity masking, and page overflow.
- IndexNow: both exact URLs accepted with HTTP 200.
- Google Search Console: the canonical sitemap was resubmitted with 0 errors and 0 warnings. Both exact URLs were still unknown to Google immediately after release, so discovery is submitted but indexing is not yet proven.

Ignored release reports are stored under `output/search-console/`, `output/indexnow/`, and `output/playwright/json-to-csv/live/`.

The full project check passed every functional, content, image, performance, sitemap, and SEO stage before reaching a new upstream `adm-zip` advisory through `@huggingface/transformers` and `onnxruntime-node`. The release did not change those dependencies. Do not force `adm-zip@0.6.0` through an override because its extraction behavior can break the current ONNX installer. Recheck upstream package compatibility before changing the dependency tree.

The Time Zone Meeting Planner must not be released before August 1, 2026. It also remains blocked until the JSON to CSV pages are discovered and the release has no new sitemap, indexing, or CrawlScout regression.

Run the read-only checkpoint before planning that release:

`npm run pilot:new-tool-growth`

When evidence is split across worktrees, add the other workspace without copying ignored reports:

`$env:AFT_PILOT_EVIDENCE_ROOTS="C:\Users\chamb\OneDrive\Desktop\accessfreetools.com"; npm run pilot:new-tool-growth`

The checkpoint follows the rollout rule literally: the 14-day wait must pass, at least one of the two JSON to CSV URLs must be discovered, the post-release production sitemap must have no hard failures, and a post-release CrawlScout sample must not exceed the July 18 baseline of 124 affected rows. It reports indexing and usage separately without treating them as proof of discovery.

## Measurement

Review each release after 28 and 56 days using fixed windows:

- Indexed state.
- Target-query impressions, clicks, and CTR.
- Organic landing sessions.
- Anonymous tool starts and downloads.

Build another tool cluster only when at least two pilot tools are indexed and at least one earns target-query impressions plus a meaningful tool action.
