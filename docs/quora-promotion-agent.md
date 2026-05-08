# Quora Promotion Agent

Status: draft-first channel started on 2026-05-08. Public profile setup was
verified in the external browser on 2026-05-08.

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
- Uses the Access Free Tools Guides Space for occasional useful summary posts
  when a direct answer opportunity is not available.
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
- Do not mark a Quora Space post live unless the public Space feed or permalink
  visibly shows the post, disclosure, and destination link.
- Do not invite followers in bulk or import contacts.
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

- Display name: Access Free Tools. Done and externally verified on 2026-05-08.
- Credential/topic line: Built Access Free Tools calculators and guides. Done
  and externally verified on 2026-05-08.
- Bio: Free calculators, converters, browser AI tools, and plain-English
  guides for everyday math, shopping, school, finance estimates, home projects,
  and developer tasks. Built by Brendan Chambers at accessfreetools.com. Done
  and externally verified on 2026-05-08.
- Topics: Computer Technology, Home Improvement, Shopping, Mathematics, and
  Calculators. Done and externally verified on 2026-05-08.
- Website: Quora did not expose a separate website field during setup; the
  first verified profile post includes the Access Free Tools page link.
- Profile avatar: still pending. Use the same Access Free Tools logo used on
  Pinterest, Medium, and Bluesky if Quora exposes a clear profile-image upload
  path.
- Do not connect ads or billing.

## Space Setup

Space name: Access Free Tools Guides.

Public Space URL: https://accessfreetoolssspace.quora.com/

Status: safe setup completed and externally verified on 2026-05-08. The Space
shows the clean public name, the plain-English calculator guide description,
custom Space visuals, and the website link to AccessFreeTools.com. Quora kept
the generated slug `accessfreetoolssspace` even after the title was cleaned up,
so use the verified URL above unless Quora later confirms a working slug
change.

Space details:

- Description: Plain-English calculator guides, browser tools, examples, and
  common mistakes to avoid. Built by AccessFreeTools.com.
- Website: https://accessfreetools.com/
- Visuals: Space icon and cover were updated with the local branded image
  `public/quora/access-free-tools-guides-cover.png` and verified in the
  external browser on 2026-05-08.
- Contributors: only the owner for now.
- Monetization/Quora+ setup: not connected.
- Invite flow: intentionally left skipped. Do not bulk-invite followers, import
  contacts, or mark that checklist item complete unless real followers or
  explicitly approved contacts exist.
- Share-to-feed setup prompt: completed in the external browser on 2026-05-08
  with a short ownership-disclosed Space share. Quora did not expose a separate
  permalink for this setup share during verification, so do not record it as a
  standalone Space post.

First Space promotion:

- Page promoted: https://accessfreetools.com/tools/percentage-calculator/
- Live Quora Space post:
  https://accessfreetoolssspace.quora.com/Start-here-how-to-use-a-calculator-without-guessing-Most-calculator-mistakes-are-not-math-mistakes-They-are-setup-mis
- External-browser proof on 2026-05-08 showed the public Space title, the post
  text, the ownership disclosure, and the live percentage-calculator link.

Use the Space lightly. A good default cadence is one helpful Space post per
week at most, mixed with direct Quora answers when exact matching questions are
available.

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
