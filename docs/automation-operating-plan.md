# Access Free Tools Automation Operating Plan

Last updated: 2026-05-10

This file records the Codex automation jobs that keep Access Free Tools checked without relying on chat memory.

## Active 10am Automations

| Automation | Cadence | Purpose | Safe limits |
| --- | --- | --- | --- |
| Access Free Tools Marketing Orchestrator | Daily at 10:00 | Owns the daily SEO/promotion overview and deduped next-action plan: DataForSEO status only when needed, Search Console key URLs, sitemap/feed/robots health, IndexNow, Pinterest RSS, Medium, Reddit, Bluesky, and Quora queue status. | Report-only by default. No passwords, no ads, no public-post completion claims without public URL/profile proof. Report DataForSEO balance only when it is below warning/stop/top-up thresholds or when an API error affects the task. |
| AFT Weekly QA Audit | Weekly on Monday | Runs local QA gates, smoke tests, external-link checks, and a deep audit without paid crawl. | Reports fixes; does not push automatically from the scheduled run. |
| AFT Monthly OnPage Crawl | Monthly on day 1 | Runs a paid DataForSEO OnPage crawl when balance is safely above the warning threshold. | Skips paid crawl at or below 10 USD; never uses Backlinks API. |
| AFT Weekly Promotion Draft Review | Weekly on Wednesday at 10:00 | Refreshes Pinterest assets, Pinterest RSS reports, Medium drafts, Reddit drafts, Bluesky drafts, Quora drafts, writing-quality scores, and promotion/internal-link opportunities. | No paid ads, outreach emails, password storage, or duplicate platform reports; RSS feeds exclude already-posted pins; Reddit and Quora drafts must stay disclosed and answer-first. |
| Medium Promotion Agent | Weekly on Wednesday at 10:00 | Specialist quality pass for Medium draft/image/article readiness. | Do not repeat the full daily SEO report. Mention DataForSEO only if a keyword check changes the recommendation or a warning/error blocks publishing. |
| Pinterest Promotion Agent | Tuesday, Thursday, Saturday at 10:00 | Specialist Pinterest board, RSS, image, and Pin-angle recommendations. | Do not repeat Search Console or DataForSEO summaries unless a specific URL or keyword changes the Pin plan. |
| AFT Reddit Promotion Agent | Weekly on Friday at 10:00 | Runs the Reddit draft agent and quality gate, then recommends safe profile posts or replies. | External-browser account work only; no password storage, subreddit posting, direct messages, or paid ads. |

## Paused Or Removed Automations

These jobs were retired on 2026-05-09 to reduce repeated reports:

| Automation | Status | Reason |
| --- | --- | --- |
| DataForSEO Balance Watch | Removed | Balance/top-up checks already live inside the daily SEO/promotion review, weekly SEO self-evaluation, monthly OnPage crawl, and deep audit. A separate top-up-only report was duplicate noise. |
| AFT Daily SEO Pulse | Paused | Its duties are now owned by Access Free Tools Daily SEO Promotion Review. |
| Daily Promotion Agent | Paused | Its daily promotion overview overlapped with Access Free Tools Daily SEO Promotion Review. |
| Weekly Content Promotion Agent | Paused | Its weekly plan overlapped with AFT Weekly Promotion Draft Review. |

## Automation Prompt Rules

Use these rules when creating or editing agents:

- Load `docs/brand-code.md` before drafting public copy, social posts, blog guides, or promotional articles.
- Use `docs/marketing-orchestrator.md` and `npm run marketing:orchestrate` for the daily priority decision. The orchestrator decides what should happen next; platform agents decide how to draft for their platform.
- Start active automations with `npm run automation:env-check` and read `output/automation-environment.md` before reporting service failures. If that report says DataForSEO is healthy, do not repeat stale `fetch failed` claims from older memory files. If Search Console needs OAuth, use the latest saved Search Console exports and ask Brendan for a manual OAuth refresh only when fresh Search Console data is truly required.
- Give each automation one clear owner lane: daily overview, weekly QA, monthly paid crawl, weekly promotion queue, or platform specialist.
- Do not repeat DataForSEO balance in every report. The daily overview owns routine balance monitoring. Other agents only mention balance when it is below warning, stop, or top-up thresholds, or when an API failure changes the recommendation.
- Start from repo context: read `AGENTS.md`, this file, the relevant platform guide, and the latest output report before recommending work.
- Produce evidence-backed recommendations: URL or slug, evidence source, why it matters, priority, and the exact next action.
- Separate facts from ideas. Do not mark something `posted`, `indexed`, `fixed`, or `complete` without proof from a public URL, generated report, command output, or screenshot.
- Keep output short enough to act on. Prefer 3 wins, 3 problems, and 1 highest-priority action when a report could become long.
- Avoid broad paid research by default. Use Search Console first, DataForSEO for targeted market/SERP evidence, and monthly OnPage only when the account balance is safely above the warning threshold.
- Promotion agents should be useful-first: answer real questions, disclose ownership when linking, and avoid duplicate posts, mass replies, direct messages, or paid ads.

## SEO Prompt Research Notes

The 2026-05-09 review of the Medium article "10 Claude Prompts That Actually Rank You on Google" (`https://medium.com/@hii_mohit/10-claude-prompts-that-actually-rank-you-on-google-cbcf055a783d`) found useful prompt patterns, but most examples are for local SEO and Google Business Profile work. Access Free Tools should adapt the pattern, not the local-business tasks.

Source checks used for these rules:

- Google Search Central: creating helpful, reliable, people-first content.
- Google Search Central: SEO Starter Guide title and content guidance.
- Google Search Central: link best practices for crawlable links and helpful anchor text.
- OpenAI prompt engineering guidance: put instructions first, separate context clearly, specify outcome/format/tone, and use examples where they reduce ambiguity.

Useful patterns to keep:

- Load site context once before each agent run: website, mission, priority categories, target pages, competitors, active channels, and current biggest SEO problem.
- Use Search Console page-2 opportunities: find queries around positions 8-20 or 11-20, then check title, H1, first visible copy, FAQ depth, and internal links before recommending exact copy.
- Compare competitor SERPs for patterns, but do not copy wording, layouts, or thin keyword pages.
- Mine user language from Search Console queries, Medium/Quora/Reddit questions, and platform comments so headings and examples match how people actually ask.
- Ask agents for exact edits, drafts, links, and page targets, not vague strategy.
- Keep a monthly executive report readable in five minutes: wins, problems, one priority action, and what changed.

Patterns to avoid for this project:

- Google Business Profile category, review, service, and citation prompts unless Access Free Tools later becomes a local service business.
- City/service page factories. They are not relevant to a global utility app site and can easily create thin pages.
- Backlink outreach prompts that require expensive tools, cold email, or risky automation. Use organic promotion and earned links first.

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

For the monthly automation, use the single guarded wrapper instead of hand-writing the gate steps:

```powershell
npm run automation:monthly-onpage
```

That command checks DataForSEO account balance, service health, and the 10 USD broad-crawl warning threshold before starting any paid crawl. It writes a concise report under `output/monthly-onpage/YYYY-MM-DD/` and should be the only command the `AFT Monthly OnPage Crawl` automation needs to run.

On 2026-05-08, a paid DataForSEO OnPage crawl checked 491 production URLs and found no broken pages, broken links, missing titles, missing descriptions, non-indexable pages, redirect chains, duplicate tags, low-score pages, or large resources. The only direct SEO fix was one overlong blog title, and the OnPage progress logger was updated to read DataForSEO's nested crawl status correctly.

## Promotion Rules

Promotion automation is allowed to draft, score, queue, prepare images, and recommend the next post. Public posting still needs exact post-level approval unless the user has already approved the exact post and channel, because it can affect the brand, account trust, and platform policy standing.

Pinterest RSS automation is the exception for pre-approved feed items: an item can be placed in RSS only when it is marked `rss-ready`, has a board, has an optimized Pin image, and is not already marked `posted`.

On 2026-05-08, Pinterest accepted the non-empty board RSS feeds for Finance
Calculators, Home Project Calculators, Free Online Calculators, and School And
Study Tools in the external browser. Automation should now monitor public boards
for imported Pins and keep those items as `rss-connected` until visible board
proof exists. Do not connect empty board feeds.

On 2026-05-08, production Pinterest board RSS feeds returned HTTP 200, but the
public board HTML did not yet expose the checked RSS-only item slugs. Keep
RSS-only queue items marked `rss-connected` until imported pins are visible on a
public board or profile page.

Reddit automation is draft-first. Run `npm run promotion:reddit:quality` before using a reply, read the target community rules, disclose ownership, and keep the answer useful even without the Access Free Tools link.

Quora automation is draft-first. Run `npm run promotion:quora:quality` before
using an answer draft, search for an exact matching question, disclose
ownership when linking, use at most one Access Free Tools link, and never mark
an answer live without a public Quora answer URL.

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

On 2026-05-10, the daily promotion run found multiple Chrome extension
backends. The working backend was the one whose `user.openTabs()` listed the
logged-in social tabs. Claim a tab with `await chromeBrowser.user.claimTab(id)`;
direct `tabs.get()` is unreliable before a user tab is claimed. Bluesky posting
worked by claiming the live tab, using the visible `Compose new post` control,
confirming the rich-text editor content, clicking the enabled `Publish` button,
then reopening the public profile and extracting the permalink from the visible
post. Keep this proof flow before marking a Bluesky item `posted`.

## Evidence Locations

Audit and promotion output is local evidence and should stay out of Git:

```text
output/deep-audit/
output/promotion/
```

Keep repo changes focused on reusable scripts, site code, docs, and tests.
