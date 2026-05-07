# Access Free Tools Automation Operating Plan

Last updated: 2026-05-07

This file records the Codex automation jobs that keep Access Free Tools checked without relying on chat memory.

## Active 10am Automations

| Automation | Cadence | Purpose | Safe limits |
| --- | --- | --- | --- |
| AFT Daily SEO Pulse | Daily | Checks DataForSEO balance/status, key Search Console URLs, SEO self-evaluation, IndexNow key, sitemap, feed, and robots health. | No broad paid SERP or backlink calls. |
| AFT Weekly QA Audit | Weekly on Monday | Runs local QA gates, smoke tests, external-link checks, and a deep audit without paid crawl. | Reports fixes; does not push automatically from the scheduled run. |
| AFT Monthly OnPage Crawl | Monthly on day 1 | Runs a paid DataForSEO OnPage crawl when balance is safely above the warning threshold. | Skips paid crawl at or below 10 USD; never uses Backlinks API. |
| AFT Weekly Promotion Draft Review | Weekly on Wednesday | Refreshes Pinterest assets, Medium drafts, and writing-quality scores. | No public posting, ads, outreach emails, or password storage without exact approval. |

## Local Commands

Use these commands when running the same checks manually:

```bash
npm run seo:daily
npm run search-console:submit-discovery
npm run search-console:inspect-key-urls
npm run audit:deep:no-paid
npm run promotion:weekly-review
npm run seo:onpage-audit
```

Use the paid OnPage crawl only after `npm run dataforseo:account -- -- --min-balance=2` and `npm run dataforseo:status` are healthy. The emergency top-up threshold is 2 USD, and broad paid work should stop at 5 USD.

## Promotion Rules

Promotion automation is allowed to draft, score, queue, prepare images, and recommend the next post. Public posting still needs exact post-level approval because it can affect the brand, account trust, and platform policy standing.

After a public post is approved and published, update `docs/promotion-queue.md` with the live URL, date, channel, and source page.

## Evidence Locations

Audit and promotion output is local evidence and should stay out of Git:

```text
output/deep-audit/
output/promotion/
```

Keep repo changes focused on reusable scripts, site code, docs, and tests.
