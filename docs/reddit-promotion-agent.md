# Reddit Promotion Agent

Status: active draft-first channel as of 2026-05-07.

The user created `u/accessfreetools` with `contact@accessfreetools.com`. Do not
store the Reddit password, recovery links, codes, cookies, or session data in
Git, docs, output reports, or automation prompts.

## What This Agent Does

- Creates helpful Reddit reply drafts and profile-post drafts.
- Scores drafts for disclosure, link restraint, risk wording, and usefulness.
- Keeps target pages aligned with the promotion queue.
- Opens an external Edge profile for setup when needed.
- Reports what needs a human step, such as CAPTCHA, email verification, or 2FA.

## What This Agent Must Not Do

- Do not mass-post links.
- Do not use the in-app browser for Reddit account work.
- Do not pretend to be an unrelated user.
- Do not run paid ads or connect billing.
- Do not post in a subreddit without reading that specific community's rules.
- Do not give finance, health, electrical, construction, or AI results as
  professional advice.

## Commands

```bash
npm run promotion:reddit
npm run promotion:reddit:quality
npm run promotion:reddit:setup-browser
```

`promotion:reddit:quality` is the normal command. It writes drafts to
`output/promotion/reddit/` and fails if a draft is too promotional, misses
ownership disclosure, uses too many links, skips community-rules reminders, or
misses important limitation wording.

`promotion:reddit:setup-browser` opens an external Edge profile at Reddit's
profile settings page. It does not store or enter the password. If Reddit asks
for login, CAPTCHA, email verification, or phone/2FA, the user must complete it.

## Best First Setup

- Display name: Access Free Tools
- Bio: Free browser calculators, converters, and practical guides. I share
  helpful explanations and only link to Access Free Tools when it fits the
  question.
- Website: https://accessfreetools.com/
- Avatar: the same Access Free Tools logo used on Pinterest and Medium.
- Optional: enable Reddit Pro if it appears for the account, using organic
  profile and analytics features only.

## First Promotion Strategy

Start with low-risk helpful answers and the Access Free Tools profile:

1. Publish one intro/profile post on `u/accessfreetools`.
2. Spend the first week answering questions where the explanation alone helps.
3. Use at most one Access Free Tools link per reply.
4. Avoid sensitive advice threads unless the limitations are crystal clear.
5. Track any live URL in `docs/promotion-queue.md`.

Best first topics:

- Percentage Calculator
- Markdown Table Generator
- Wallpaper Calculator
- Concrete Calculator
- Image To Text OCR Tool

Use extra caution for:

- Mortgage Calculator
- Ad Revenue Calculator
- Watts To Amps Calculator

Those are useful topics, but they touch money or electrical safety, so the
draft must include limits and avoid advice promises.

## Source Notes

- Reddit Help defines spam as repeated or unsolicited actions, including
  automated promotion that disrupts communities:
  https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam
- Reddit's business page describes Reddit Pro as a free way for businesses to
  find conversations, track trends, and engage organically:
  https://www.business.reddit.com/redditpro-learnmore
- Reddit Help keeps Reddit Pro documentation under the official Reddit Pro
  help section:
  https://support.reddithelp.com/hc/en-us/sections/47502727358228-About-Reddit-Pro
