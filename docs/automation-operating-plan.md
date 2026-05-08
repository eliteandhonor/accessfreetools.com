# Access Free Tools Automation Operating Plan

Last updated: 2026-05-08

This file records the Codex automation jobs that keep Access Free Tools checked without relying on chat memory.

## Active 10am Automations

| Automation | Cadence | Purpose | Safe limits |
| --- | --- | --- | --- |
| AFT Daily SEO Pulse | Daily | Checks DataForSEO balance/status, key Search Console URLs, SEO self-evaluation, IndexNow key, sitemap, feed, and robots health. | No broad paid SERP or backlink calls. |
| AFT Weekly QA Audit | Weekly on Monday | Runs local QA gates, smoke tests, external-link checks, and a deep audit without paid crawl. | Reports fixes; does not push automatically from the scheduled run. |
| AFT Monthly OnPage Crawl | Monthly on day 1 | Runs a paid DataForSEO OnPage crawl when balance is safely above the warning threshold. | Skips paid crawl at or below 10 USD; never uses Backlinks API. |
| AFT Weekly Promotion Draft Review | Weekly on Wednesday at 10:00 | Refreshes Pinterest assets, Pinterest RSS reports, Medium drafts, Reddit drafts, and writing-quality scores. | No paid ads, outreach emails, or password storage; RSS feeds exclude already-posted pins; Reddit drafts must stay disclosed and community-rule aware. |
| AFT Reddit Promotion Agent | Weekly on Friday at 10:00 | Runs the Reddit draft agent and quality gate, then recommends safe profile posts or replies. | External-browser account work only; no password storage, subreddit posting, direct messages, or paid ads. |

## Local Commands

Use these commands when running the same checks manually:

```bash
npm run automation:chrome-check
npm run seo:daily
npm run search-console:submit-discovery
npm run search-console:inspect-key-urls
npm run audit:deep:no-paid
npm run promotion:weekly-review
npm run seo:onpage-audit
```

Use the paid OnPage crawl only after `npm run dataforseo:account -- -- --min-balance=2` and `npm run dataforseo:status` are healthy. The emergency top-up threshold is 2 USD, and broad paid work should stop at 5 USD.

On 2026-05-08, a paid DataForSEO OnPage crawl checked 491 production URLs and found no broken pages, broken links, missing titles, missing descriptions, non-indexable pages, redirect chains, duplicate tags, low-score pages, or large resources. The only direct SEO fix was one overlong blog title, and the OnPage progress logger was updated to read DataForSEO's nested crawl status correctly.

## Promotion Rules

Promotion automation is allowed to draft, score, queue, prepare images, and recommend the next post. Public posting still needs exact post-level approval unless the user has already approved the exact post and channel, because it can affect the brand, account trust, and platform policy standing.

Pinterest RSS automation is the exception for pre-approved feed items: an item can be placed in RSS only when it is marked `rss-ready`, has a board, has an optimized Pin image, and is not already marked `posted`.

On 2026-05-08, Pinterest accepted the non-empty board RSS feeds for Finance
Calculators, Home Project Calculators, Free Online Calculators, and School And
Study Tools in the external browser. Automation should now monitor public boards
for imported Pins and keep those items as `rss-connected` until visible board
proof exists. Do not connect empty board feeds.

Reddit automation is draft-first. Run `npm run promotion:reddit:quality` before using a reply, read the target community rules, disclose ownership, and keep the answer useful even without the Access Free Tools link.

After a public post is approved and published, update `docs/promotion-queue.md` with the live URL, date, channel, and source page.

Medium automation must treat hero images as part of the quality gate, not an
afterthought. `npm run promotion:medium:quality` regenerates hero images and
fails if the title or detail text crosses the safe artwork area. A live Medium
post is not complete until the public URL shows a clean hero image, saved alt
text, large H1, bold H2 headings, SEO settings, and canonical/source URL.

Codex Chrome control status should be checked with
`npm run automation:chrome-check` before relying on browser-control automation.
On 2026-05-08, Chrome showed the Codex extension installed and the native host
registered. Edge also showed the extension installed, and the missing Edge
native host registry entry was added to point at the same OpenAI manifest. After
that fix, `npm run automation:chrome-check` reported Chrome and Edge as
installed and native-host ready. After restarting Codex on 2026-05-08, the
Chrome skill path worked through the extension browser runtime: it listed the
live Chrome tabs, found the logged-in Pinterest and Medium tabs, claimed the
Medium tab read-only, verified the live Stories page, and released the tab
without closing it. Do not wait for a separate `chrome.*` tool namespace; the
supported route is the `@chrome` skill with the generic browser runtime and
`agent.browsers.get('extension')`. If that route fails after one retry, follow
the Chrome skill's extension and native-host checks before falling back.

## Evidence Locations

Audit and promotion output is local evidence and should stay out of Git:

```text
output/deep-audit/
output/promotion/
```

Keep repo changes focused on reusable scripts, site code, docs, and tests.
