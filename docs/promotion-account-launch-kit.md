# Promotion Account Launch Kit

This kit sets up the first promotion channels for Access Free Tools:
Pinterest Business, Reddit, Medium, Bluesky, and Quora.
These accounts need the owner to create
or approve them because they require identity, password, email, CAPTCHA, and
terms acceptance. The Promotion Agent can prepare drafts and track work, but it
must not create accounts, post publicly, send outreach, or use paid promotion
without approval.

## Shared Brand Details

- Brand name: Access Free Tools
- Website: https://accessfreetools.com/
- Contact email: contact@accessfreetools.com
- Short description: Fast, practical browser tools built one useful utility at a time.
- Longer description: Access Free Tools offers free calculators, converters, AI text tools, home project helpers, finance estimators, and plain-language guides that run quickly in the browser.
- Primary audience: students, homeowners, creators, small business owners, finance shoppers, DIY users, and anyone who needs a quick calculation without signup.
- Safe promise: Free online tools with clear examples, privacy-friendly browser-first behavior where possible, and no fake ad boxes.

## Username Ideas

Try these in order:

1. accessfreetools
2. accessfree_tools
3. accessfreetoolscom
4. access.tools
5. accessfreecalculators

Use `accessfreetools` whenever available.

## Pinterest Business

Status: Created by the user on 2026-05-06.
Domain claim status: Pinterest HTML verification file is live at
`https://accessfreetools.com/pinterest-95119.html`. External read-only review
on 2026-05-06 reached the Pinterest Business Hub and showed
`accessfreetools.com` as the business profile, so the claim appears connected.
Agent review status: external read-only review is working through the isolated
local Edge profile. The agent must not enter the account password.
Public profile status: updated and verified on 2026-05-06 at
`https://au.pinterest.com/accessfreetools/` with display name
`Access Free Tools`, username `accessfreetools`, verified website
`accessfreetools.com`, and the approved short bio.
Avatar status: branded Access Free Tools avatar uploaded on 2026-05-06.
Starter organic board status: `Free Online Calculators`, `Finance Calculators`,
`Health And Fitness Calculators`, `Home Project Calculators`, and `AI Browser
Tools` were created on 2026-05-06.
Starter organic pin status: the first 8 starter pins were published and
verified on 2026-05-06. Failed duplicate drafts from the first automation
attempt were deleted.
Pinterest RSS status: dedicated image-backed RSS feeds are available for
Pinterest auto-publish. Use those feeds instead of `/feed.xml`, because the
normal feed is for blog readers and does not carry the dedicated Pin images.
The current RSS feeds only include future `rss-ready` pins, not already-posted
manual pins, so Pinterest does not duplicate the starter batches.

Security note: the account password must stay out of Git, docs, automation
prompts, and reports. If a password was shared in chat or screenshots, change it
inside Pinterest after setup is stable.

Purpose: Pinterest can help evergreen utility content because people search for
project, finance, recipe, classroom, and home-planning ideas.

Setup fields:

- Account type: Business
- Display name: Access Free Tools
- Username: accessfreetools
- Website: https://accessfreetools.com/
- Bio: Free calculators, converters, AI text tools, and practical guides for everyday math, home projects, finance, school, and browser tasks.
- Email: contact@accessfreetools.com

Recommended profile checks:

- Confirm the public username is `accessfreetools`. Done 2026-05-06.
- Confirm the public profile URL is added here after the profile username is saved. Done 2026-05-06.
- Confirm the website field points to `https://accessfreetools.com/`. Done 2026-05-06.
- Confirm the profile name is `Access Free Tools`, not only the email address. Done 2026-05-06.
- Add the short bio above. Done 2026-05-06.
- Add a simple branded logo or mark. Done 2026-05-06.
- Enable two-factor authentication if Pinterest offers it for the account.

Starter boards:

- Free Online Calculators. Created 2026-05-06.
- Finance Calculators. Created 2026-05-06.
- Home Project Calculators. Created 2026-05-06.
- Health And Fitness Calculators. Created 2026-05-06.
- School And Study Tools
- AI Browser Tools. Created 2026-05-06.
- Conversion Tools

First pin targets:

- https://accessfreetools.com/tools/. Published 2026-05-06.
- https://accessfreetools.com/free-calculator-resources/. Published 2026-05-06.
- https://accessfreetools.com/tools/basic-calculator/. Published 2026-05-06.
- https://accessfreetools.com/tools/percentage-calculator/. Published 2026-05-06.
- https://accessfreetools.com/tools/mortgage-calculator/. Published 2026-05-06.
- https://accessfreetools.com/tools/bmi-calculator/. Published 2026-05-06.
- https://accessfreetools.com/tools/wallpaper-calculator/. Published 2026-05-06.
- https://accessfreetools.com/categories/ai-tools/. Published 2026-05-06.
- https://accessfreetools.com/tools/image-to-text-ocr-tool/. Published 2026-05-06.
- https://accessfreetools.com/tools/watts-to-amps-calculator/

Pin title style:

- Keep titles literal and search-friendly.
- Use the tool name first.
- Avoid exaggerated promises.

Example pin titles:

- Free Percentage Calculator For Discounts And Percent Change
- Mortgage Calculator With Monthly Payment And Amortization Guide
- Wallpaper Calculator To Estimate Rolls And Waste Percent
- Free Image To Text OCR Tool That Runs In Your Browser

Organic posting workflow:

- Use Pinterest's organic `https://au.pinterest.com/pin-creation-tool/` flow.
- Do not use `pin-builder` because it is ad-focused and can lead into campaign
  setup.
- Pick or create the board before pressing Publish.
- After a publish attempt, confirm the board page shows the pin and then remove
  any leftover unpublished duplicate drafts.
- Repeatable local command: run `npm run promotion:pinterest-assets`, then run
  `node scripts/pinterest-organic-publisher.mjs --slug=percentage-calculator --publish`.
  To replay the full starter set safely, run `npm run promotion:pinterest:starter`;
  already-published pins are skipped after board-page verification.
  The command uses the local external Edge profile at
  `.local/pinterest-browser-profile`, refuses ad/campaign/billing flows, skips
  pins already visible on their board, and cleans failed drafts.

RSS auto-publish workflow:

- Run `npm run promotion:pinterest:rss-report` before connecting or changing a
  feed. Use only feeds with at least one RSS-ready item.
- Use the broad future-pins feed only if Pinterest asks for one general feed:
  `https://accessfreetools.com/pinterest-feed.xml`.
- Prefer board-specific feeds when Pinterest lets you map a feed to a board:
  `https://accessfreetools.com/pinterest/free-online-calculators.xml`,
  `https://accessfreetools.com/pinterest/home-project-calculators.xml`,
  `https://accessfreetools.com/pinterest/finance-calculators.xml`,
  `https://accessfreetools.com/pinterest/health-and-fitness-calculators.xml`,
  `https://accessfreetools.com/pinterest/ai-browser-tools.xml`, and
  `https://accessfreetools.com/pinterest/school-and-study-tools.xml`.
- Keep feed items curated in `src/data/pinterestFeed.ts`.
- Do not connect `/feed.xml` to Pinterest because it is the general guide RSS
  feed and does not include the dedicated Pinterest images.

## Reddit

Status: Created by the user on 2026-05-07 with username `accessfreetools`
and public email `contact@accessfreetools.com`. The password must not be stored
in Git, docs, local reports, shell history, or automation prompts. After setup
is stable, change the password because it was shared in chat.

Purpose: Reddit can build trust only when replies are genuinely helpful. This
channel should be used carefully. Do not drop links into communities without
reading their rules.

Setup fields:

- Username: accessfreetools. Done 2026-05-07.
- Profile display name: Access Free Tools
- Profile bio: Free browser calculators, converters, and practical guides. I share helpful explanations and only link when it genuinely fits the question.
- Website link: https://accessfreetools.com/
- Public profile: https://www.reddit.com/user/accessfreetools/
- Optional official business tooling: enable Reddit Pro if Reddit offers it for
  this account. Use organic profile and analytics features only; do not run ads.

Recommended profile checks:

- Confirm the username is `accessfreetools`.
- Set profile display name to `Access Free Tools`.
- Add the Reddit Bio from `docs/promotion-share-kit.md`.
- Add `https://accessfreetools.com/` as the website/profile link when Reddit
  exposes the field.
- Add the same Access Free Tools avatar used on Pinterest and Medium.
- Verify email and enable two-factor authentication if available.
- Do not connect billing, ads, or paid campaigns.

Rules for the Promotion Agent:

- Never mass-post links.
- Never pretend to be an unrelated user.
- Always disclose when linking to Access Free Tools.
- Only suggest a link when the answer still helps without the link.
- Do not post in finance, tax, health, or pregnancy communities unless the wording is cautious and non-professional.
- Read each community's rules before drafting.
- Use `npm run promotion:reddit:quality` before any public Reddit post or reply.
- Keep generated drafts under `output/promotion/reddit/`; that folder is local
  evidence and ignored by Git.

Helpful reply template:

```text
You can estimate this by breaking it into the inputs first:

1. [Explain the key input in simple terms.]
2. [Explain the formula or decision point.]
3. [Explain how to read the result.]

I built a free browser tool for this here if you want to check the math: [URL]
No signup needed, and the page explains the inputs too.
```

Starter communities to research, not auto-post:

- Math homework/help communities where calculators are allowed
- DIY/home improvement communities for material calculators
- Personal finance communities only when rules allow tools and disclosures
- Web developer communities for text, JSON, URL, and AI utility tools

First safe Reddit workflow:

- Run `npm run promotion:reddit:quality` to create and score drafts.
- Start with one profile post on `u/accessfreetools`, not a subreddit.
- Spend the first week answering only directly relevant questions.
- When linking, disclose ownership and keep the answer useful without the link.
- Record any live Reddit URL in `docs/promotion-queue.md`.

## Quora

Status: Created by the user on 2026-05-08 with
`contact@accessfreetools.com`. Public profile setup was externally verified on
2026-05-08. The password must not be stored in Git, docs, local reports, shell
history, or automation prompts.

Purpose: Quora is useful for direct question-style searches, especially
calculator questions like "how do I calculate percent off" or "what does
wallpaper waste percent mean". It should be used as an answer-first channel,
not a backlink drop.

Setup fields:

- Profile name: Access Free Tools
- Credential/topic line: Built Access Free Tools calculators and guides
- Topics: Computer Technology, Home Improvement, Shopping, Mathematics, and
  Calculators
- Website link: Quora did not expose a dedicated website field during setup; use
  disclosed, useful post/answer links only when the link genuinely helps.
- Bio: Free calculators, converters, browser AI tools, and plain-English guides
  for everyday math, shopping, school, finance estimates, home projects, and
  developer tasks. Built by Brendan Chambers at accessfreetools.com.
- Avatar: pending until Quora exposes a clear profile-image upload path. Use the
  same Access Free Tools logo used on Pinterest, Medium, and Bluesky.
- Space: Access Free Tools Guides. Created and externally verified on
  2026-05-08 at `https://accessfreetoolssspace.quora.com/`. Quora kept the
  generated slug even after the public title was cleaned up, so use this
  verified URL unless the platform later confirms a working slug change.

Rules for the Promotion Agent:

- Never mass-answer similar questions.
- Never paste the same answer repeatedly.
- Always disclose when linking to Access Free Tools.
- Use at most one Access Free Tools link per answer.
- Do not use affiliate links on Quora.
- Do not answer professional finance, health, electrical, construction, or
  medical-adjacent questions as advice.
- Do not bulk-invite followers, import contacts, or treat Space posts as a
  replacement for helpful direct answers.
- Run `npm run promotion:quora:quality` before any public Quora answer is used.
- Keep generated drafts under `output/promotion/quora/`; that folder is local
  evidence and ignored by Git.

First safe Quora workflow:

- Run `npm run promotion:quora:quality` to create and score drafts.
- Search Quora for one exact question at a time.
- Only answer if the answer is useful without the link.
- Include a short answer, formula or logic, example, common mistake, limitation,
  disclosure, and one optional link.
- Record any live Quora answer URL in `docs/promotion-queue.md`.
- If no matching answer editor is available, use the Space for one useful
  summary post and record the public Space permalink after checking the live
  feed. The first Space post was published and verified on 2026-05-08 for the
  Percentage Calculator.

## Medium

Status: User logged in on Medium with `contact@accessfreetools.com` on
2026-05-06 using Medium's email sign-in flow. The agent must not store a
password, recovery link, email code, or session cookie. Public profile setup
was completed in the external browser on 2026-05-06 at
`https://medium.com/@accessfreetools` with display name `Access Free Tools`,
username `accessfreetools`, the approved short bio, and the branded Access Free
Tools avatar.

Purpose: Medium can work as a discovery and trust channel, but we should avoid
copying full Access Free Tools guides word-for-word. Use short explainers,
summaries, and canonical links back to the original guide.

Setup fields:

- Profile name: Access Free Tools. Done 2026-05-06.
- Username: accessfreetools. Done 2026-05-06.
- Profile URL: https://medium.com/@accessfreetools. Done 2026-05-06.
- Bio: Clear guides for free calculators, converters, finance estimators, home project calculators, and school-friendly utilities. Updated 2026-05-06.
- Website: Medium did not show a dedicated free website field during setup, so
  use links inside approved companion posts and canonical/source URLs when
  Medium offers them.
- Avatar: branded Access Free Tools avatar. Done 2026-05-06.

Publication idea:

- Name: Access Free Tools Guides
- Tagline: Simple guides for calculators, converters, project estimators, and everyday online utilities.

Agent workflow:

- Generate companion drafts with `npm run promotion:medium:starter`.
- Drafts are saved locally under `output/promotion/medium/` and ignored by Git.
- The command is draft-only: it does not sign in, publish, send email, run ads,
  or store credentials.
- Copy one approved draft into Medium manually, add the canonical/source link
  shown in the draft, and publish only after the user approves the post.
- Medium's help docs say imported stories automatically add a canonical link to
  the original source, but our default workflow still uses shorter companion
  posts so we do not duplicate the full Access Free Tools guide.

Medium post rules:

- Use short companion posts, not duplicate full blog pages.
- Link to the original Access Free Tools guide as the main source.
- Add a disclosure when discussing future affiliate products.
- Keep the tone useful and plain.
- Do not put first-wave Medium posts behind a paywall.
- Do not add affiliate links until the affiliate disclosure is visible near the
  link and the site disclosure page is referenced where needed.

Starter Medium post ideas:

- How To Pick The Right Free Calculator Online
- How Percentage Calculators Help With Discounts, Tips, And Markups
- What Waste Percent Means In A Wallpaper Calculator
- Why Browser-Only AI Tools Are Useful For Privacy
- How To Estimate Monthly Mortgage Payments Without Getting Lost
- What A BMI Calculator Can And Cannot Tell You
- How To Think About Ad Revenue Before Your Site Has Big Traffic
- Watts To Amps Is Simple Math, But Electrical Context Matters

Recommended profile checks:

- Confirm display name is `Access Free Tools`. Done 2026-05-06.
- Confirm username is `accessfreetools`. Done 2026-05-06.
- Confirm public profile URL is `https://medium.com/@accessfreetools`. Done
  2026-05-06.
- Add website `https://accessfreetools.com/` when Medium exposes a profile link
  field, or use canonical/source links in approved posts.
- Add the Medium Bio from `docs/promotion-share-kit.md`. Done 2026-05-06.
- Add the same branded Access Free Tools avatar used on Pinterest. Done
  2026-05-06.
- If Medium offers profile social links, add Pinterest after the profile is
  stable: `https://au.pinterest.com/accessfreetools/`.

## Bluesky

Status: Recommended next organic platform on 2026-05-08 after the local
promotion review and organic-traffic platform research. The user created the
account on 2026-05-08 at `https://bsky.app/profile/accessfreetools.bsky.social`.
Public profile audit passed on 2026-05-08 after the display name, approved bio,
and branded avatar were updated through the Bluesky API. The first three starter
posts were verified on the public author feed. Use
`docs/bluesky-promotion-agent.md` before future setup or publishing.

Purpose: Bluesky is useful for short, helpful calculator tips that point to a
specific tool page. It is the next best automation fit because it has a posting
API and does not require fragile browser publishing once the account and app
password are created.

Setup fields:

- Preferred handle: `accessfreetools.com` if domain verification is available.
- Current handle: `accessfreetools.bsky.social`.
- Future preferred handle: `accessfreetools.com` if domain verification is available.
- Display name: Access Free Tools. Done 2026-05-08.
- Avatar: branded Bluesky-specific Access Free Tools avatar from
  `public/bluesky/access-free-tools-avatar.png`. Done and visually checked on
  2026-05-08.
- Website: https://accessfreetools.com/
- Bio: Access Free Tools shares free calculators, converters, AI text tools, and practical guides for everyday math, home projects, finance, school, and browser tasks. Done 2026-05-08.

Agent workflow:

- Generate and score local drafts with `npm run promotion:bluesky:quality`.
- Audit the public profile with `npm run promotion:bluesky:profile-audit`.
- Generate the channel avatar with `npm run promotion:bluesky:avatar`.
- After an app password exists, update the display name, bio, and branded
  avatar with
  `npm run promotion:bluesky:profile-update`.
- Keep credentials in local environment variables only:
  `BLUESKY_HANDLE` and `BLUESKY_APP_PASSWORD`.
- Do not use the normal account password in scripts.
- Publish only after the user approves the exact batch with
  `npm run promotion:bluesky:publish`.
- Verify the public Bluesky profile and post URLs before marking anything
  `posted`.

## Account Security Checklist

- Use a unique password for each account.
- Turn on two-factor authentication where available.
- Store recovery codes somewhere private.
- Do not commit passwords, API tokens, or backup codes to Git.
- Use `contact@accessfreetools.com` as the public business email.
- Keep personal recovery email/phone private.

## What The User Needs To Do

1. Keep Pinterest and Medium login/recovery details private and enable 2FA where available.
2. Finish Reddit profile setup and email verification.
3. Review and approve the first Medium companion draft before any public post.
4. Verify email and any phone/CAPTCHA steps.
5. Add the website URL to each profile when the platform exposes a safe public
   website field.
6. Tell Codex which usernames were accepted.

After that, the Promotion Agent can maintain drafts, queue posts for approval,
and recommend safe next actions.
