# Quora Promotion Agent

Status: draft-first channel started on 2026-05-08.

The user created a Quora account with `contact@accessfreetools.com`. Do not
store the Quora password, recovery links, email codes, cookies, or session data
in Git, docs, output reports, or automation prompts.

## Why Quora

Quora is a good fit for Access Free Tools because people ask exact questions:
how to calculate a discount, how many rolls of wallpaper they need, how watts
convert to amps, or what RPM means for ad revenue. The goal is not to drop
links. The goal is to write answers that solve the question on Quora first, then
include one disclosed Access Free Tools link when it genuinely helps.

## What This Agent Does

- Creates Quora answer drafts for high-intent calculator questions.
- Scores drafts for usefulness, disclosure, link restraint, examples, and risk
  wording.
- Keeps Quora targets aligned with `docs/promotion-queue.md`.
- Reports the best next questions to answer.
- Leaves browser login, CAPTCHA, email verification, and identity checks to the
  user.

## What This Agent Must Not Do

- Do not mass-answer similar questions.
- Do not paste the same answer repeatedly.
- Do not use affiliate links on Quora.
- Do not pretend to be an unrelated user.
- Do not answer finance, health, electrical, construction, or AI/privacy topics
  as professional advice.
- Do not mark a Quora answer as live unless a public Quora URL is visible.
- Do not use the in-app browser for account work.

## Commands

```bash
npm run promotion:quora
npm run promotion:quora:quality
```

`promotion:quora:quality` is the normal command. It writes drafts to
`output/promotion/quora/` and fails if a draft is too promotional, misses
ownership disclosure, uses too many links, skips examples, or misses important
limitation wording.

## Best Profile Setup

- Display name: Access Free Tools
- Credential/topic line: Free calculators, converters, and practical browser
  tools
- Bio: Access Free Tools shares free browser calculators, converters, AI text
  tools, and practical guides for everyday math, home projects, finance,
  school, and browser tasks.
- Website: https://accessfreetools.com/
- Avatar: the same Access Free Tools logo used on Pinterest, Medium, and
  Bluesky.
- Do not connect ads or billing.

## First Promotion Strategy

Start with low-risk answers and direct question matches:

1. Search Quora for one exact topic, such as "how to calculate percent off".
2. Open only questions where the answer can help without the link.
3. Write the short answer, formula, example, mistake to avoid, and one optional
   disclosed tool link.
4. Use at most one Access Free Tools link.
5. Track the public URL in `docs/promotion-queue.md` after posting.

Best first topics:

- Percentage Calculator
- Wallpaper Calculator
- Markdown Table Generator
- Image To Text OCR Tool
- Concrete Calculator

Use extra caution for:

- Mortgage Calculator
- Ad Revenue Calculator
- Watts To Amps Calculator

Those topics touch finance, money, or electrical safety, so the answer must
include limits and avoid advice promises.

## Source Notes

- Quora Platform Policies require authentic, relevant, non-spammy use and
  prohibit deceptive or low-quality promotion:
  https://help.quora.com/hc/en-us/articles/360000470706-Platform-Policies
- Quora Business Profiles are intended for businesses to join conversations,
  answer under a business identity, and connect organically with audiences:
  https://quoraadsupport.zendesk.com/hc/en-us/articles/360061080592-About-Business-Profiles
