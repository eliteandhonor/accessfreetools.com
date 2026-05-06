# Medium Publishing Plan

Medium is now set up as a draft-first promotion channel for Access Free Tools.
The agent can prepare articles and metadata, but public publishing still needs
owner approval for each exact post.

## Current Account

- Profile URL: https://medium.com/@accessfreetools
- Display name: Access Free Tools
- Username: accessfreetools
- Email sign-in is handled by the user. Do not store credentials.
- No paid promotion, Partner Program changes, email sending, or affiliate links
  should be added without explicit approval.

## Draft Command

```bash
npm run promotion:medium:starter
```

This creates publish-ready drafts in `output/promotion/medium/` plus a queue
file at `output/promotion/medium/_publishing-queue.md`.

Before publishing or updating Medium, run:

```bash
npm run promotion:medium:quality
```

For the first calculator article only, run:

```bash
npm run promotion:medium:quality:first
```

## First Wave

1. How To Pick The Right Free Online Calculator
2. How Percentage Calculators Help With Discounts, Tips, And Markups
3. What Waste Percent Means In A Wallpaper Calculator
4. Browser-Only AI Tools: What They Are Good For
5. Estimate A Mortgage Payment Before You Fall In Love With A House
6. What A BMI Calculator Can And Cannot Tell You
7. Watts To Amps Is Simple Math, But Electrical Context Matters
8. How To Think About Ad Revenue Before Your Site Has Big Traffic

## SEO Review Notes

- First calculator post reviewed with DataForSEO on 2026-05-06. Main phrase:
  `free online calculator` with supporting phrases `online calculator`,
  `basic calculator online free`, and natural percentage-calculator examples.
- Keep article one calculator-only. Do not mention unrelated tool categories in
  that post.
- Run the same small SEO review before publishing each next Medium article.

## Publishing Checklist

- Run a quick SEO review before publishing: DataForSEO account/status, keyword
  intent, matching source URL, and no off-topic terms.
- Run the Medium writing-quality gate and fix every error before publishing.
- Check `docs/article-writing-agent-standard.md`.
- Read the exact generated draft before posting.
- Keep the disclosure that the article is from Access Free Tools.
- Set the canonical/source URL to the matching Access Free Tools page when
  Medium offers that setting.
- Keep the post free, not paywalled.
- Use the suggested tags from the draft.
- Test the link in the article before publishing.
- After publishing, record the Medium URL in `docs/promotion-queue.md`.
- Watch Search Console, Bing Webmaster Tools, and CrawlScout for discovery and
  referral signals.

## Editorial Rules

- Medium posts should be companion articles, not full duplicates of site blog
  guides.
- Use plain language, realistic examples, and clear limits.
- Use a clear "smart 14-year-old" voice: direct, practical, and understandable
  without baby talk.
- Do not copy Neil Patel's personality or any living writer's exact style. Use
  the public SEO principles only: useful structure, examples, proof, and clear
  next steps.
- Be extra careful with finance, health, electrical, tax, pregnancy, and AI
  topics.
- Do not promise income, medical outcomes, loan approval, electrical safety, or
  AI accuracy.
