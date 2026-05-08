# Organic Traffic Platform Research

This review uses Google Search Console, DataForSEO, and public platform
documentation to choose the next promotion channel after Pinterest, Medium, and
Reddit.

## Current Search Baseline

DataForSEO is healthy and the local account check on 2026-05-08 showed a
balance of 49.03 USD, so no top-up is needed yet. The latest local
`seo:self-evaluate` report showed early traction but very low click volume:

- 470 Google impressions.
- 1 Google click.
- 0.21% CTR.
- 56.9 average position.
- Homepage and Basic Calculator indexed.
- `/tools/` and `/blog/` discovered but not indexed in the sampled report.

The practical goal is not just links. The goal is more crawl discovery, better
brand proof, useful off-site explanations, and more chances for real users to
see the strongest tool pages.

## Platform Ranking

| Rank | Platform | Fit | Automation | Risk | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | Bluesky | Strong for short utility tips and direct tool links | API-friendly after account setup | Low to medium | Set up next |
| 2 | Pinterest RSS | Already active and aligned with visual evergreen search | Native RSS auto-publish | Low | Keep feeding curated items |
| 3 | Medium | Good for explainers and trust | API is not a good path; browser/manual checks needed | Medium | Keep publishing slower, higher-quality posts |
| 4 | Reddit | Useful only with careful community participation | Automation is risky | High | Use profile + manual/helpful replies only |
| 5 | LinkedIn | Good later for business and finance calculators | API permissions are heavier | Medium | Later, after a company page exists |
| 6 | YouTube Shorts | Strong future upside for tutorial snippets | Needs video pipeline and channel setup | Medium | Later, after image/video QA is stable |
| 7 | Quora | Can answer exact questions | Public posting automation is risky | High | Manual-only later |

## Recommendation

Set up **Bluesky** next.

Why:

- The post API is documented and simple enough for local automation.
- Posts are short, which matches calculator tips and quick examples.
- A brand account can disclose ownership naturally.
- The agent can draft, score, and publish from environment variables after the
  user creates the account and app password.
- It does not require paid ads, browser automation, or community rule guessing.

## What The Agent Added

- `npm run promotion:bluesky`
- `npm run promotion:bluesky:quality`
- `npm run promotion:bluesky:publish`
- A draft generator for eight priority tool posts.
- A quality reviewer that blocks long posts, extra links, hype phrases, and
  missing risk-limit wording.
- Weekly promotion review now includes Bluesky draft QA.

## Next User Action

Create the Bluesky account and app password when ready. Use:

- Preferred handle: `accessfreetools.com`
- Fallback handle: `accessfreetools.bsky.social`
- Display name: `Access Free Tools`
- Bio: `Free calculators, converters, AI text tools, and practical guides for everyday math, home projects, finance, school, and browser tasks.`
- Website: `https://accessfreetools.com/`

After that, the agent can run the local publishing flow and verify the live
profile before marking posts as posted.

## Research Notes

- Google's content guidance supports useful, people-first pages instead of
  search-engine-first posting.
- Pinterest's official RSS auto-publish docs support our current board-feed
  plan and say each feed can map to a board, with new feed content added as
  Pins within a normal delay window.
- Reddit's official spam guidance means we should not automate subreddit link
  posting from a new account.
- Medium's public API docs repository is archived and says the API is no longer
  recommended, so browser/manual public-page verification remains safer.
- LinkedIn's Posts API exists, but it requires OAuth scopes and member or
  organization permissions, so it is not the fastest next channel.

## Sources

- Google helpful content:
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Pinterest RSS auto-publish:
  https://help.pinterest.com/en/business/article/auto-publish-pins-from-your-rss-feed
- Reddit spam guidance:
  https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam
- Medium API docs:
  https://github.com/Medium/medium-api-docs
- LinkedIn Posts API:
  https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
- Bluesky creating a post:
  https://docs.bsky.app/docs/tutorials/creating-a-post
- Bluesky resolving identities:
  https://docs.bsky.app/docs/advanced-guides/resolving-identities
