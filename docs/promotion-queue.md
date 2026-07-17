# Promotion Queue

This queue gives the Daily Promotion Agent and Weekly Content Promotion Agent a
safe place to plan work. Public posting, emails, paid ads, and affiliate changes
still require approval.

## Status Labels

- `needs draft`: promotion copy has not been written yet.
- `needs approval`: ready for the user to approve or edit.
- `approved`: user approved the idea, but it has not been posted.
- `rss-ready`: approved for Pinterest RSS auto-publish and excluded from manual reposting until Pinterest processes it.
- `rss-connected`: the Pinterest board feed is connected, but public Pins have not been visibly imported yet.
- `posted`: user posted it or confirmed it was published and the live page was checked.
- `unverified`: a submit flow appeared to run, but the live page was not visible afterward.
- `blocked`: the channel or account cannot safely publish right now.
- `waiting`: submitted to discovery/indexing and waiting for search engines.
- `done`: no current action needed.

## Priority Pages

Pinterest Business account status: created by the user on 2026-05-06. Use
Pinterest as the first active promotion channel. Reddit account status:
created by the user on 2026-05-07 as `u/accessfreetools`; setup and posting
must stay useful-first, disclosed, and community-rule aware. On 2026-05-13, an
external Chrome check of `https://www.reddit.com/user/accessfreetools/submitted/`
showed "This account has been banned," so Reddit promotion is blocked until the
account is restored or the user approves a new account path. Medium login was
started by the user on 2026-05-06 with
`contact@accessfreetools.com`; Medium profile setup is complete at
`https://medium.com/@accessfreetools`. Pinterest domain verification file is live and external
read-only review reached the Pinterest Business Hub for `accessfreetools.com`.
Public profile cleanup is done at `https://au.pinterest.com/accessfreetools/`.
The branded avatar is live, starter boards are created, 8 organic starter pins
are published, and duplicate draft cleanup is complete. Use Pinterest's organic
`/pin-creation-tool/` flow for pins; do not use the ad-focused pin builder.
Pinterest RSS auto-publish should use the future-pins feed
`https://accessfreetools.com/pinterest-feed.xml` or a matching board feed under
`/pinterest/*.xml`, not the normal blog RSS feed, so only approved image-backed
promotion pages are sent to Pinterest. Already-posted manual pins are excluded
from RSS to avoid duplicates.
Use `npm run promotion:medium:starter` to generate publish-ready Medium
companion drafts; it is draft-only and does not publish. Generated drafts include
canonical/source URL notes, tags, preview text, and an approval checklist.
Use `npm run promotion:reddit:quality` to generate and score Reddit profile-post
and helpful-reply drafts; it is draft-only and does not publish.
The attempted first Reddit profile post on 2026-05-07 is unverified. A Reddit
submit result was recorded, but a later external-browser check showed no posts
on `u/accessfreetools`, and the saved permalink returned "Page not found."
On 2026-05-13, a public Chrome check showed the account is banned. Do not treat a Reddit post as posted or try more Reddit promotion until that account status is resolved.
Second-wave Pinterest assets and Medium drafts were regenerated on 2026-05-07
after DataForSEO intent checks confirmed the target topics are informational.
The user approved the batch, and the 8 second-wave organic Pinterest pins were
published and verified on 2026-05-07 with the no-ads publisher.
Latest promotion QA on 2026-05-07 regenerated 10 Medium companion drafts and
passed `npm run promotion:medium:quality` with every draft above the SEO,
originality, human-interest, and overall score thresholds. These drafts are
ready for external Medium publishing, but they are not marked `posted` unless a
live Medium URL is visible and checked.
The first live Medium companion post was repaired on 2026-05-07 after review:
the missing branded hero image, image alt text, Medium SEO title/description,
canonical link, and reader-interest topics were added in the external Medium
editor, then the live article was checked:
`https://medium.com/@accessfreetools/how-to-pick-the-right-free-online-calculator-c13c791f08d5`.
The second live Medium companion post was published, updated with a branded
hero image, Medium SEO title/description, canonical link, reader-interest topics,
and checked on 2026-05-07:
`https://medium.com/@accessfreetools/how-percentage-calculators-help-with-discounts-and-tips-33b1f6fa6ea4`.
The live wallpaper Medium post was manually fixed by the user on 2026-05-08
after a hero-image collision was found. The external-browser public page now
shows a clean hero image and readable H1 at
`https://medium.com/@accessfreetools/what-waste-percent-means-in-a-wallpaper-calculator-8189dc219150`.
On 2026-05-08, the ad-revenue Medium companion article was prepared in the
external Chrome Medium editor with rich H2 formatting, branded hero image,
saved alt text, reader interests, SEO title/description, and canonical/source
URL. Medium blocked the live publish because the account had reached its
"maximum of two stories in the past 24 hours" limit.
On 2026-05-09, `npm run promotion:medium:quality` regenerated the 10 Medium
drafts and hero images; all drafts passed the SEO, originality, human-interest,
and overall quality thresholds. The ad-revenue article was then published in
external Chrome and verified on its public URL with the corrected H1, readable
branded hero image, saved alt text, Medium SEO title/description, three focused
topics, and visible H2 section headings:
`https://medium.com/@accessfreetools/how-to-think-about-ad-revenue-before-your-site-has-big-traffic-beef3ad9529c`.
On 2026-05-10, the mortgage Medium draft was stopped before publishing because
the writing felt too generic. The Medium quality gate now includes a
reader-desire score, opening-scene checks, real problem/tension checks,
numbered-example checks, and self-referential filler blocking. The improved
mortgage article was then fixed live in external Chrome: the bad agent-facing
copy was removed, the contextual tool link plus final tool/guide links were
verified, the branded hero image was restored with alt text, and the public
article was checked at
`https://medium.com/@accessfreetools/things-you-should-know-before-trusting-a-mortgage-payment-estimate-679a79eaa1cc`.
On 2026-07-14, the GitHub repository-safety Medium article was published and
verified on its public URL after a final republish. The live response confirmed
the custom SEO title and description, canonical link to the original Access
Free Tools guide, literal smoke-kawaii hero alt text, five focused topics,
free-reader access, H1/H2 structure, and contextual Access Free Tools links:
`https://medium.com/@accessfreetools/github-stars-are-not-a-security-review-what-i-check-instead-a1a261be3fbe`.
Follow-up from the 2026-05-07 review: Medium posts now require a branded hero
image, alt text, canonical/source URL metadata, and focused tags in the local
quality gate before future public posting. The live percentage article now uses
the generated `public/medium/percentage-calculator-discounts.jpg` hero image,
a shorter Medium SEO title, a 149-character SEO description, and a canonical
link to `/blog/how-to-use-percentage-calculator/`. A later same-day external
browser review found its section headings had pasted as normal paragraphs, so
the article body was re-applied as rich content and the live H1/H2 format was
verified.
Pinterest RSS remains ready on the site side: use
`https://accessfreetools.com/pinterest-feed.xml` for the future-pins feed or
the board-specific feeds under `/pinterest/*.xml`. On 2026-05-08, the external
browser Pinterest settings page accepted these non-empty board feeds:
`/pinterest/finance-calculators.xml`, `/pinterest/home-project-calculators.xml`,
`/pinterest/free-online-calculators.xml`, and
`/pinterest/school-and-study-tools.xml`. Pinterest showed "RSS feed added" for
each one. Do not mark the individual feed items `posted` until Pinterest imports
them and the public board shows the Pins.
Later on 2026-05-08, the board feed URLs were checked on production and returned
HTTP 200. On 2026-05-09, public-board HTML checks showed the RSS imports were
visible for percent-off, recipe-scaler, watts-to-amps, concrete,
mortgage-amortization, and word-counter. Ad-revenue and unit-price were still
not visible in public board HTML and remain `rss-connected`.
On 2026-05-13, the board RSS feeds still returned the pending Ad Revenue and
Unit Price items. A later review found the first attempted Unit Price organic
Pin was made while the browser/profile context was wrong, so that Pin did not
count as Access Free Tools proof. The Unit Price item was then redone through
the user's external Chrome session with the visible `/accessfreetools/` account
context and verified on the public Free Online Calculators board plus direct
Pin URL: `https://au.pinterest.com/pin/1148277236265110127/`. The Ad Revenue
RSS import was then verified on the public Finance Calculators board and direct
Pin URL: `https://au.pinterest.com/pin/1148277236264769497/`. The old Reddit
percentage post still remained unverified, and the public Reddit profile now
shows the account is banned, so Reddit remains blocked until the account is
restored or replaced.
On 2026-05-14, the six remaining RSS-ready items were reconciled against public
board proof already recorded in this queue: watts-to-amps, percent-off,
mortgage-amortization, concrete, recipe-scaler, and word-counter are now marked
posted in the Pinterest feed source and excluded from future RSS imports. A
zero-item future RSS queue is clean when there are no newly approved image-backed
Pins waiting to be imported.
On 2026-07-17, the complete Pinterest archive was reconciled through the owner's
logged-in Microsoft Edge session. All 59 posted archive items now have direct
public Pin URLs recorded in `src/data/pinterestFeed.ts`; the 25 older rows that
previously had board-level proof were opened individually and verified for live
title, expected board, and the exact Access Free Tools destination path. The
53 prepared publisher definitions also map to archive rows with their local
assets present, while the six older RSS/archive-only rows remain intentionally
outside the publisher definitions. No eligible RSS-ready or approved Pinterest
item remains. Historical duplicate Pins were left public rather than deleted.
Correction from the catalog-level audit later on 2026-07-17: this proved only
the existing 59-item archive, not the owner's requirement to promote every
public app. The site has 302 public tool apps; only 44 distinct tool pages had
Pinterest proof, leaving 258 apps to prepare, publish, and verify. The full
Pinterest goal stays active until `npm run promotion:pinterest:coverage` reports
302 apps with direct public Pin proof and zero apps waiting in RSS.
The all-app release was deployed on 2026-07-17 with Astro 7 on Node 24. The six
non-empty board feeds were then visibly connected in the owner's logged-in
Microsoft Edge session: Finance Calculators, Home Project Calculators, Free
Online Calculators, School And Study Tools, Health And Fitness Calculators, and
AI Browser Tools. Connection proof is saved at
`output/promotion/pinterest-six-rss-feeds-connected-2026-07-17.png`. This is
setup proof only. Keep all 258 catalog entries `rss-ready` until each imported
Pin is visible publicly and its direct Pin URL and expected destination are
recorded.
The first follow-up board audit at 2026-07-17 22:13 AEST still showed the old
board totals and no catalog imports. The generated RSS had rendered date-only
values at noon UTC, which placed the new items hours in the future when the
feeds were connected. `src/data/pinterestFeedXml.ts` was corrected to render
date-only Pinterest timestamps at midnight UTC, with a regression test. Keep
the queue active and recheck the public boards after Pinterest reads the
corrected feed.
The owner's Microsoft Edge Pinterest session was verified later on 2026-07-17.
Because the browser extension still refused local file chooser uploads, the
official Pinterest Save button URL was used with the already-deployed vertical
asset and exact tool destination. The 401K Calculator Pin is publicly visible
on Finance Calculators at
`https://au.pinterest.com/pin/1148277236269785514/`; its Visit site link points
to `/tools/401k-calculator/` with Pinterest organic tracking parameters. The
direct proof is recorded in `src/data/pinterestAppProof.json`, so this app must
be excluded from future RSS imports.
Later on 2026-05-14, a fresh organic Pinterest Pin was published through the
user's logged-in external Chrome session for the Watts to Amps Calculator. The
public Pin was checked on the Home Project Calculators board and direct Pin URL:
`https://au.pinterest.com/pin/1148277236265166271/`. Its Visit Site link points
to `https://accessfreetools.com/tools/watts-to-amps-calculator/?utm_source=Pinterest&utm_medium=organic&utm_campaign=watts_to_amps_before_convert`.
On 2026-07-15, three new organic Pinterest Pins were prepared through the
logged-in external Chrome session and published by the owner. Chrome's
file-chooser API returned `Not allowed`, but the native Windows `Open` dialog
was active and provided the working upload path without using Pinterest's
ad-focused `pin-builder`. Public Pin pages then verified the intended boards,
descriptions, AI-modified disclosures, and organic Visit Site links:
`https://au.pinterest.com/pin/1148277236269606694/` for Sales Tax,
`https://au.pinterest.com/pin/1148277236269606692/` for Kawaii Calculator, and
`https://au.pinterest.com/pin/1148277236269606687/` for Concrete Block.
Later on 2026-07-15, eight more approved organic Pins were uploaded one at a
time through the standard Create Pin form and verified on their public Pin
pages. The verified batch covers Interest Rate, Date, Fraction, Gas Mileage,
Oven Temperature, Golf Handicap, Flooring, and Area. Each public check matched
the intended destination URL, description, board, and AI-modified disclosure.
The public Pin URLs are recorded in the queue rows below and in
`src/data/pinterestFeed.ts`. That prepared batch is exhausted; follow-on Pins
are now being selected one at a time from current search evidence, generated,
published, and publicly checked before another asset is prepared. The first
follow-on Pin, Engine Horsepower Calculator, was verified at
`https://au.pinterest.com/pin/1148277236269618404/` with its destination,
description, board, alt text, and AI-modified disclosure intact. The Markup And
Margin guide followed at `https://au.pinterest.com/pin/1148277236269619244/`
with the Finance Calculators board and guide destination publicly verified. The
Matrix Calculator followed at `https://au.pinterest.com/pin/1148277236269619652/`
with the School And Study Tools board and exact tool destination verified. The
Loan Calculator followed at `https://au.pinterest.com/pin/1148277236269620279/`
with the Finance Calculators board and fixed-rate planning limits intact. The
Triangle Calculator followed at `https://au.pinterest.com/pin/1148277236269620399/`
with the School And Study Tools board and exact tool destination verified. The
Horsepower Converter followed at `https://au.pinterest.com/pin/1148277236269620640/`
with the Free Online Calculators board and exact converter destination verified.
The Target Heart Rate Calculator followed at
`https://au.pinterest.com/pin/1148277236269621271/` with the Health And Fitness
Calculators board, exact destination, and educational health limitation verified.
The Mileage Reimbursement Calculator followed at
`https://au.pinterest.com/pin/1148277236269621684/` with the Finance Calculators
board, exact destination, and rate-source limitation verified. The VA Mortgage
Funding Fee guide followed at `https://au.pinterest.com/pin/1148277236269622865/`
with the Finance Calculators board, exact guide destination, and planning-only
eligibility limitation verified. The UK Mortgage Repayment guide followed at
`https://au.pinterest.com/pin/1148277236269623241/` with the Finance Calculators
board, exact guide destination, and lender-quote limitation verified. The
Molarity, Moles And Grams guide followed at
`https://au.pinterest.com/pin/1148277236269623415/` with the School And Study
Tools board, exact guide destination, and chemistry safety limitation verified.
The Big Number Calculator guide followed at
`https://au.pinterest.com/pin/1148277236269623703/` with the School And Study
Tools board, exact guide destination, and whole-number limitation verified. The
Rounding Calculator guide followed at
`https://au.pinterest.com/pin/1148277236269623817/` with the School And Study
Tools board and exact guide destination verified. The BMR Mifflin-St Jeor guide
followed at `https://au.pinterest.com/pin/1148277236269624100/` with the Health
And Fitness Calculators board, exact guide destination, and non-prescriptive
health limitation verified. The 4-Band Resistor Calculator followed at
`https://au.pinterest.com/pin/1148277236269625000/` with the School And Study
Tools board, exact tool destination, and multimeter safety limitation verified.
The Take-Home Paycheck Calculator followed at
`https://au.pinterest.com/pin/1148277236269626168/` with the Finance Calculators
board, exact tool destination, and payroll-estimate limitation verified.
The Mortgage Refinance guide followed at
`https://au.pinterest.com/pin/1148277236269632349/` with the Finance Calculators
board, exact guide destination, and payment-versus-total-cost limitation verified.
The Statistics Calculator followed at
`https://au.pinterest.com/pin/1148277236269634450/` with the School And Study
Tools board, exact tool destination, and descriptive-statistics scope verified.
The Half-Life Calculator guide followed at
`https://au.pinterest.com/pin/1148277236269634943/` with the School And Study
Tools board, exact guide destination, and study-only decay-math limitation verified.
The Copper Wire Resistance Calculator followed at
`https://au.pinterest.com/pin/1148277236269636196/` with the School And Study
Tools board, exact tool destination, and simplified electrical-planning limitation verified.
The Transparent Nutrition Points Calculator followed at
`https://au.pinterest.com/pin/1148277236269637171/` with the Health And Fitness
Calculators board, exact tool destination, and non-affiliation and nutrition limitation verified.
The Sales Commission Calculator guide followed at
`https://au.pinterest.com/pin/1148277236269639699/` with the Finance Calculators
board, exact guide destination, and commission-plan limitation verified.
The Day Of The Week Calculator guide followed on 2026-07-17 at
`https://au.pinterest.com/pin/1148277236269780621/`. The public Pin verified the
Free Online Calculators board, exact guide destination, literal image alt text,
full description, `Dates` and `Calculator` topics, and AI-modified disclosure.
The upload used the native Windows picker from the user's signed-in Edge session
after the extension file-chooser API returned `Not allowed`.
The matching Watts to Amps Medium companion article was also published through
the user's logged-in external Chrome session on 2026-05-14 after
`npm run promotion:medium:quality` passed. The public page was checked for H1,
H2 headings, branded hero image alt text, visible tool and guide links, and all
five topics:
`https://medium.com/@accessfreetools/watts-to-amps-is-simple-math-but-electrical-context-matters-6fc9625389b7`.
Bluesky is the recommended next organic platform as of 2026-05-08. The user
created `https://bsky.app/profile/accessfreetools.bsky.social`; the profile was
updated through the Bluesky API with the approved display name, bio, and branded
avatar. Public profile audit passed on 2026-05-08 after the public avatar and
author feed were checked. Use `docs/bluesky-promotion-agent.md`, run
`npm run promotion:bluesky:profile-audit`, and run
`npm run promotion:bluesky:quality` before future Bluesky batches. Do not mark
Bluesky posts `posted` unless the public Bluesky profile shows a live post URL.
On 2026-05-14, the build-in-public Bluesky post for
`/why-access-free-tools/` was published through the logged-in external Chrome
session after the API publisher was blocked by missing local Bluesky env vars.
The public profile showed the post text, mission-page link card, and permalink:
`https://bsky.app/profile/accessfreetools.bsky.social/post/3mlrrl7pmzk2i`.
DEV Community is the recommended next technical blogging channel as of
2026-05-13. Use it only for developer, browser AI, Markdown, JSON, encoding,
token, API, and productivity topics. Drafts and quality checks are local with
`npm run promotion:devto:quality`. On 2026-05-13, the user-created DEV account
finished onboarding and profile setup, but DEV returned "Forbidden" on
`/new` with the message that the account is suspended and has limited access.
Keep DEV drafts ready, but do not try to publish there again until the account
is restored by DEV support or the user approves a clean replacement path. Never
mark a DEV article posted without a public DEV URL.
Daily follow-up automation `Access Free Tools Daily SEO Promotion Review` was
created on 2026-05-08 for 10:00 AM local time. It should run the SEO/promotion
proof commands, check Pinterest RSS import evidence, refresh draft quality
reports, and only update docs for verified public proof.
Quora was created by the user on 2026-05-08 with
`contact@accessfreetools.com`. Use `docs/quora-promotion-agent.md` and
`npm run promotion:quora:quality`. Quora is answer-first: find exact matching
questions, answer fully on Quora, disclose ownership, use at most one Access
Free Tools link, and do not mark anything `posted` without a public Quora answer
URL.
Quora profile setup was externally verified on 2026-05-08: display name
`Access Free Tools`, credential `Built Access Free Tools calculators and
guides`, a disclosure-friendly bio, and the topics `Computer Technology`,
`Home Improvement`, `Shopping`, `Mathematics`, and `Calculators` were visible
on the public profile. The branded avatar from
`public/pinterest/access-free-tools-avatar.png` was uploaded and externally
verified on the public profile on 2026-05-08.
First Quora promotion was published on 2026-05-08 as a profile post because
matching percentage question pages were visible but did not expose an answer
editor for the new account. The external Chrome profile check showed `1 Post`,
the live post text, and the Access Free Tools percentage calculator link on
`https://www.quora.com/profile/Brendan-1929`. Quora also exposed the timestamp
slug
`https://www.quora.com/profile/Brendan-1929/How-to-calculate-a-discount-without-guessing-Short-answer-percent-off-means-you-multiply-the-original-price-by-the-dis`.
On 2026-05-09, `npm run promotion:quora:quality` regenerated 8 Quora drafts and
all passed. A direct answer was published to an exact matching Markdown table
question. The public answer was verified with the question text, useful answer,
ownership disclosure, and one Access Free Tools link visible:
`https://www.quora.com/How-do-I-make-a-Markdown-table-of-two-columns-out-of-a-list-whose-items-alternate-to-each-column/answer/Access-Free-Tools`.
Later on 2026-05-09, the Quora Space was checked again at
`https://accessfreetoolssspace.quora.com/` and a wallpaper waste-percent Space
post was published. The public permalink showed the Space title, post text,
ownership disclosure, and the wallpaper calculator destination link:
`https://accessfreetoolssspace.quora.com/Wallpaper-waste-percent-is-not-a-mystery-fee-It-is-extra-wallpaper-for-trimming-corners-pattern-matching-damaged-str`.
On 2026-05-10, a new Image to Text OCR Tool Space post was published after
`npm run promotion:quora:quality` passed 8/8 drafts. External Chrome proof
showed the public OCR explanation, ownership disclosure, sensitive-document
warning, and live destination link:
`https://accessfreetoolssspace.quora.com/Copying-text-from-a-screenshot-is-usually-an-OCR-problem-not-a-copy-paste-problem-OCR-means-optical-character-recogni`.
On 2026-05-14, the Watts to Amps Quora draft was used twice after
`npm run promotion:quora:quality` passed. A Space post was published to
`https://accessfreetoolssspace.quora.com/` with the 600 W example, ownership
disclosure, electrical-safety limit, and live tool link visible. A direct
answer was also published to the exact matching question:
`https://www.quora.com/How-do-I-convert-watts-to-amps-quickly-and-accurately/answer/Access-Free-Tools?prompt_topic_bio=1`.
Quora Space safe setup was corrected and externally verified on 2026-05-08.
The public Space title is `Access Free Tools Guides`, with the verified URL
`https://accessfreetoolssspace.quora.com/`. Quora kept its generated slug even
after the public title was cleaned up, so use the verified URL unless the
platform later confirms a working slug change. The Space description, custom
visuals, and share-to-feed prompt are complete. The invite prompt remains
intentionally skipped because bulk invitations or contact imports are a spam
risk. The first Space post was published and externally verified with the
public post text, ownership disclosure, and percentage-calculator link visible.

SEO proof from 2026-05-08:

- Search Console shows the homepage, Basic Calculator, Calculators category,
  AI Tools category, Ad Revenue Calculator tool/guide, and Markdown Table
  Generator indexed.
- Search Console still reports `/tools/`, `/blog/`, Wallpaper Calculator,
  Watts to Amps Calculator, and Image to Text OCR Tool as discovered, unknown,
  or not indexed yet. These need internal-link help and continued promotion,
  not more duplicate pages.
- `npm run search-console:submit-discovery` resubmitted
  `sitemap.xml` and `feed.xml`; Google reported zero sitemap errors and zero
  warnings while processing remains pending.
- `npm run indexnow:submit` submitted 621 URLs and returned HTTP 200.
- Production redirect proof passed for legacy URLs such as `/calculators` to
  `/categories/calculators/` and `/deep-research` to `/categories/ai-tools/`.

SEO proof from 2026-05-09:

- Search Console now reports Image to Text OCR Tool as submitted and indexed.
- `/tools/`, `/blog/`, Wallpaper Calculator, and Watts to Amps Calculator still
  need crawl/indexing time; the homepage now links directly to those priority
  tools and their matching guides.
- Production redirect proof still passes for `/calculators`, `/deep-research`,
  `/advanced-age-calculator`, and the old AdSense earnings URL, with zero hard
  failures in the production sitemap sample.

SEO proof from 2026-05-10:

- The blocked daily SEO run was retried and passed: DataForSEO account/status,
  Search Console key URL inspection, SEO self-evaluation, and IndexNow key
  verification all completed.
- Search Console confirms `/categories/calculators/`, `/categories/ai-tools/`,
  `/tools/ad-revenue-calculator/`, and `/blog/how-to-use-ad-revenue-calculator/`
  are submitted and indexed, so the old `/calculators`, `/deep-research`, and
  AdSense-earnings redirect targets have stronger proof.
- `/tools/`, `/blog/`, `/tools/age-calculator/`, `/tools/watts-to-amps-calculator/`,
  and `/tools/wallpaper-calculator/` still need crawl or indexing time.
- `/blog/how-to-use-wallpaper-calculator/` improved to crawled but not indexed
  with a successful mobile fetch, which is progress but not a completed index
  win.
- Pinterest RSS health is still clean: 8 RSS-ready future items, 6 board feeds,
  and 0 report issues.
- Promotion draft quality was refreshed for Medium, Reddit, Bluesky, and Quora:
  Medium passed 10/10 drafts, Reddit passed 16/16 drafts, Bluesky passed 8/8
  drafts, and Quora passed 8/8 drafts. No new public post was marked live
  without a public URL.
- Daily promotion follow-up on 2026-05-10 used the external Chrome extension
  workflow, reran platform quality gates, and published the approved
  Ad Revenue Calculator Bluesky post. Public profile proof showed the post text,
  destination card, and permalink:
  `https://bsky.app/profile/accessfreetools.bsky.social/post/3mlhkxzok5k2a`.
- Daily promotion follow-up on 2026-05-13 used the external Chrome promotion
  workflow and current quality gates before marking anything live. Bluesky
  Mortgage and Quora Space Ad Revenue posts were public-page verified with
  destination links. The Medium AI Tools article was caught with a blank-body
  publish issue, repaired live, and only marked posted after the public body,
  disclosure, and Access Free Tools link were visible.

| Priority | Page | Main Angle | Channel | Status | Next Action |
| --- | --- | --- | --- | --- | --- |
| High | `/tools/` | Free online tools library with calculators, converters, AI tools, and guides | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/free-calculator-resources/` | Free calculator resources hub for common calculations | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/free-calculator-resources/` | How to pick the right free online calculator | Medium | posted | Live article updated in the external Medium editor on 2026-05-07 with hero image, alt text, SEO title/description, canonical link, topics, and live image/H2 check: `https://medium.com/@accessfreetools/how-to-pick-the-right-free-online-calculator-c13c791f08d5` |
| High | `/tools/basic-calculator/` | Simple everyday calculator with guide and keyboard support | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/tools/percentage-calculator/` | Discounts, percent change, markups, and reverse percentages | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/tools/mortgage-calculator/` | Estimate monthly payments and understand amortization | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/finance-calculators/` on 2026-05-06 |
| High | `/tools/401k-calculator/` | Project contributions, employer match, and estimated retirement-account growth | Pinterest | posted | Public Pin and exact tool destination verified through Microsoft Edge on 2026-07-17: `https://au.pinterest.com/pin/1148277236269785514/`. |
| High | `/tools/sales-tax-calculator/` | Add sales tax, find pre-tax price, or check a final total | Pinterest | posted | Public Pin and Finance Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269606694/` links to `https://accessfreetools.com/tools/sales-tax-calculator/?utm_source=Pinterest&utm_medium=organic`. |
| High | `/tools/interest-rate-calculator/` | Compare loan and savings interest estimates with clear finance limits | Pinterest | posted | Public Pin and Finance Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269611927/`. |
| High | `/tools/date-calculator/` | Add or subtract days and count time between dates | Pinterest | posted | Public Pin and Free Online Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269612963/`. |
| High | `/tools/fraction-calculator/` | Add, subtract, multiply, divide, and simplify fractions | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269613324/`. |
| High | `/tools/gas-mileage-calculator/` | Estimate fuel economy, fuel used, and trip cost | Pinterest | posted | Public Pin and Free Online Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269613499/`. |
| Medium | `/tools/oven-temperature-converter/` | Convert Celsius, Fahrenheit, and gas mark for recipes | Pinterest | posted | Public Pin and Free Online Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269614140/`. |
| Medium | `/tools/golf-handicap-calculator/` | Estimate a golf handicap while explaining official-result limits | Pinterest | posted | Public Pin and Health And Fitness Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269614203/`. |
| Medium | `/tools/flooring-calculator/` | Estimate room flooring, pack coverage, and waste allowance | Pinterest | posted | Public Pin and Home Project Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269614243/`. |
| Medium | `/tools/area-calculator/` | Calculate common-shape areas with units and formulas | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269614267/`. |
| High | `/tools/engine-horsepower-calculator/` | Solve horsepower, torque, RPM, and estimated wheel horsepower without implying a dyno result | Pinterest | posted | Public Pin and Free Online Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269618404/`. |
| High | `/blog/how-to-use-markup-calculator/` | Explain markup versus margin with worked pricing examples | Pinterest | posted | Public Pin and Finance Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269619244/`. |
| High | `/tools/matrix-calculator/` | Work through 2x2 and 3x3 matrix operations and determinants | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269619652/`. |
| High | `/tools/loan-calculator/` | Estimate fixed-rate payment, amount, rate, term, and total interest | Pinterest | posted | Public Pin and Finance Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269620279/`. |
| High | `/tools/triangle-calculator/` | Check triangle sides, third-side range, area, angles, and type | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269620399/`. |
| High | `/tools/horsepower-calculator/` | Convert mechanical or metric horsepower, watts, and kilowatts | Pinterest | posted | Public Pin and Free Online Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269620640/`. |
| High | `/tools/target-heart-rate-calculator/` | Estimate age-based exercise zones or convert a timed pulse count to BPM with health limits | Pinterest | posted | Public Pin and Health And Fitness Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269621271/`. |
| High | `/tools/mileage-calculator/` | Calculate mileage reimbursement from miles, an allowed rate, and eligible trip extras | Pinterest | posted | Public Pin and Finance Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269621684/`. |
| High | `/blog/how-to-use-va-mortgage-calculator/` | Explain VA funding-fee status, financed fees, payment inputs, and lender paperwork | Pinterest | posted | Public Pin and Finance Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269622865/`. |
| High | `/blog/how-to-use-mortgage-calculator-uk/` | Explain UK repayment estimates from property price, deposit, rate, term, fees, and LTV | Pinterest | posted | Public Pin and Finance Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269623241/`. |
| High | `/blog/how-to-use-molarity-calculator/` | Explain molarity, moles, grams, final solution volume, and unit conversion formulas | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269623415/`. |
| High | `/blog/how-to-use-big-number-calculator/` | Explain exact huge-integer arithmetic, quotient, remainder, and safe copying | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269623703/`. |
| High | `/blog/how-to-use-rounding-calculator/` | Explain decimal-place, significant-figure, place-value, and method-based rounding | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269623817/`. |
| High | `/blog/how-to-use-bmr-calculator/` | Explain Mifflin-St Jeor resting-energy estimates and BMR versus TDEE context | Pinterest | posted | Public Pin and Health And Fitness Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269624100/`. |
| High | `/tools/resistor-calculator/` | Decode 4-band resistor colors into ohms, tolerance, minimum, and maximum values | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269625000/`. |
| High | `/tools/take-home-paycheck-calculator/` | Estimate net pay from salary, pay schedule, pretax deductions, entered tax percentages, and FICA | Pinterest | posted | Public Pin and Finance Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269626168/`. |
| High | `/blog/how-to-use-refinance-calculator/` | Compare refinance payment savings, closing costs, break-even time, and total cost | Pinterest | posted | Public Pin and Finance Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269632349/`. |
| High | `/tools/statistics-calculator/` | Summarize one data set with center, quartiles, variance, and standard deviation | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269634450/`. |
| High | `/blog/how-to-use-half-life-calculator/` | Explain remaining amount, elapsed time, half-life, matching units, and decay steps | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269634943/`. |
| High | `/tools/wire-resistance-calculator/` | Estimate copper wire resistance from AWG size, one-way length, and conductor count | Pinterest | posted | Public Pin and School And Study Tools board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269636196/`. |
| High | `/tools/nutrition-points-calculator/` | Compare equal-serving food labels with an original transparent points formula | Pinterest | posted | Public Pin and Health And Fitness Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269637171/`. |
| High | `/blog/how-to-use-commission-calculator/` | Explain gross commission, split, base pay, bonus, and written-plan limitations | Pinterest | posted | Public Pin and Finance Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269639699/`. |
| High | `/blog/how-to-use-day-of-the-week-calculator/` | Find a weekday from a calendar date with ISO and Sunday-based indexes | Pinterest | posted | Public Pin and Free Online Calculators board verified on 2026-07-17 with exact destination, literal alt text, AI-modified disclosure, and relevant topics: `https://au.pinterest.com/pin/1148277236269780621/`. |
| High | `/tools/ad-revenue-calculator/` | Estimate RPM, CTR, CPC, impressions, and ad revenue | Medium | posted | Published and public-page checked on 2026-05-09 with H1, hero image, alt text, SEO title/description, topics, and H2 headings verified: `https://medium.com/@accessfreetools/how-to-think-about-ad-revenue-before-your-site-has-big-traffic-beef3ad9529c` |
| High | `/tools/ad-revenue-calculator/` | Explain RPM, CTR, CPC, impressions, and earnings-estimate limits | Bluesky | posted | Public post verified on 2026-05-10: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mlhkxzok5k2a` |
| High | `/tools/percentage-calculator/` | Discounts, tips, markups, and percent change | Medium | posted | Live article published and checked on 2026-05-07: `https://medium.com/@accessfreetools/how-percentage-calculators-help-with-discounts-and-tips-33b1f6fa6ea4`; branded hero image, alt text, Medium SEO title/description, canonical link, reader-interest topics, and live H1/H2 formatting verified in the external browser |
| High | `/tools/percentage-calculator/` | Discount, tip, markup, and percent-change micro tip | Bluesky | posted | Public post verified on 2026-05-08: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mld43shj2u2h` |
| High | `/tools/mortgage-calculator/` | Early home-shopping payment estimate with finance limits | Medium | posted | Live article fixed and public-page checked on 2026-05-10 with H1, one branded hero image, alt text, H2 headings, contextual tool link, final tool/guide links, and no agent-facing filler: `https://medium.com/@accessfreetools/things-you-should-know-before-trusting-a-mortgage-payment-estimate-679a79eaa1cc` |
| High | `/blog/how-to-check-github-project-before-installing/` | Seven checks for evaluating a GitHub repository before installation | Medium | posted | Published and public-response checked on 2026-07-14 with custom SEO title/description, canonical link, literal hero alt text, five topics, free access, H1/H2 structure, and contextual site links verified: `https://medium.com/@accessfreetools/github-stars-are-not-a-security-review-what-i-check-instead-a1a261be3fbe`. |
| High | `/tools/mortgage-calculator/` | Mortgage planning estimate with finance limits | Bluesky | posted | Public post verified on 2026-05-13 with finance-estimate wording and tool link: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mlplqpvm2r2g` |
| High | `/why-access-free-tools/` | Build-in-public story about using Codex to grow the free utility website | Bluesky | posted | Public post verified on 2026-05-14 with the mission-page link card visible: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mlrrl7pmzk2i`. |
| High | `/why-access-free-tools/` | How I used Codex to build a safer backlink workflow | Medium | needs approval | First-person owner story prepared in external Chrome on 2026-07-03 at Medium edit URL `https://medium.com/p/12ac1e4dee58/edit` and saved locally at `output/promotion/medium/codex-backlink-workflow.md`. Added a bonus list of sites that passed the profile/backlink filter. Medium quality passed at 99 overall, and Stop Slop scans passed for banned AI tells, em dashes, and public `-ly` words. Smoke-kawaii hero image uploaded to the Medium draft with alt text, topics saved as `SEO`, `Backlinks`, `Codex`, `Search`, and `Automation`, and Medium SEO title/description saved. Canonical/source URL intentionally left unset because this is an original Medium article, not a republished article. Draft remains unpublished pending owner approval. |
| High | `/why-access-free-tools/` | Build-in-public story about using Codex to grow the free utility website | DEV Community | blocked | Draft `codex-build-utility-website` passed `npm run promotion:devto:quality` on 2026-05-13 with score 100 and no warnings. External Chrome checked DEV `/new`, but the user-created account still returned "Forbidden" with a suspended/limited-access warning. Do not mark posted without a public DEV URL. |
| Medium | `/tools/bmi-calculator/` | BMI estimate with health disclaimer and plain-language result notes | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/health-and-fitness-calculators/` on 2026-05-06 |
| Medium | `/tools/kawaii-calculator/` | Cute everyday arithmetic, percentage, memory, and keyboard checks | Pinterest | posted | Public Pin and Free Online Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269606692/` links to `https://accessfreetools.com/tools/kawaii-calculator/?utm_source=Pinterest&utm_medium=organic`. |
| Medium | `/tools/concrete-block-calculator/` | Wall-size, opening, waste, and concrete-block quantity planning | Pinterest | posted | Public Pin and Home Project Calculators board verified on 2026-07-15: `https://au.pinterest.com/pin/1148277236269606687/` links to `https://accessfreetools.com/tools/concrete-block-calculator/?utm_source=Pinterest&utm_medium=organic`. |
| Medium | `/tools/bmi-calculator/` | BMI estimate limits explained carefully | Medium | posted | Published on 2026-05-15 and public-page checked with no draft label, H1/H2 formatting, hero image alt text, ownership disclosure, tool link, and guide link visible: `https://medium.com/@accessfreetools/the-biggest-mistake-people-make-with-bmi-calculator-results-d46d0ceacd41`. Proof screenshot: `output/promotion/medium/bmi-result-limits-live-2026-05-15.png` |
| Medium | `/tools/wallpaper-calculator/` | Rolls, wall area, pattern repeat, and waste percent explained | Pinterest, Medium | posted | Pinterest published; Medium live article manually fixed by the user and externally checked on 2026-05-08: `https://medium.com/@accessfreetools/what-waste-percent-means-in-a-wallpaper-calculator-8189dc219150` |
| Medium | `/tools/wallpaper-calculator/` | Waste percent and roll-estimate micro tip | Bluesky | posted | Public post verified on 2026-05-09: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mlfy2wnkek2y` |
| Medium | `/tools/watts-to-amps-calculator/` | Electrical conversion with voltage and phase reminders | Medium | posted | Live article published and public-page checked on 2026-05-14 with H1, H2 headings, branded hero image alt text, tool link, guide link, and topics verified: `https://medium.com/@accessfreetools/watts-to-amps-is-simple-math-but-electrical-context-matters-6fc9625389b7`. |
| Medium | `/tools/watts-to-amps-calculator/` | Watts, amps, voltage, and electrical-caution micro tip | Bluesky | posted | Public post verified through the Bluesky public API on 2026-05-09: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mlgchubhy42h` |
| Medium | `/tools/watts-to-amps-calculator/` | Explain watts, volts, amps, and electrical caution | Reddit | blocked | Draft passed quality, but Reddit promotion is blocked because the public `u/accessfreetools` profile showed "This account has been banned" on 2026-05-13. |
| Medium | `/tools/watts-to-amps-calculator/` | Watts alone is not enough: voltage, phase, and power factor change the amps estimate | Pinterest | posted | Organic Pin published through the user's logged-in external Chrome session and public-page checked on 2026-05-14: `https://au.pinterest.com/pin/1148277236265166271/` links to `https://accessfreetools.com/tools/watts-to-amps-calculator/?utm_source=Pinterest&utm_medium=organic&utm_campaign=watts_to_amps_before_convert`. |
| Medium | `/categories/ai-tools/` | Browser-side AI tools with privacy notes | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/ai-browser-tools/` on 2026-05-06 |
| Medium | `/categories/ai-tools/` | Browser-side AI tools with privacy notes | Medium | posted | Live article repaired and public-page checked on 2026-05-13 with title, body, disclosure, and Access Free Tools category link visible: `https://medium.com/@accessfreetools/what-no-one-tells-you-about-browser-only-ai-tools-and-privacy-c65dfc30a34b`. Follow-up polish: recheck hero image/advanced Medium SEO settings because the editor fought the rich paste. |
| Medium | `/tools/image-to-text-ocr-tool/` | OCR text extraction in the browser with privacy limits | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/ai-browser-tools/` on 2026-05-06 |
| Medium | `/tools/image-to-text-ocr-tool/` | Browser OCR image-quality and privacy micro tip | Bluesky | posted | Public post verified on 2026-05-08: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mld43thfov2a` |
| Medium | `/tools/image-to-text-ocr-tool/` | Explain OCR image quality and browser privacy limits | Reddit | blocked | Draft passed quality, but Reddit promotion is blocked because the public `u/accessfreetools` profile showed "This account has been banned" on 2026-05-13. |
| Medium | `/tools/image-to-text-ocr-tool/` | Why screenshot text copying fails and how browser OCR helps | DEV Community | blocked | DEV draft passed quality, but the user-created account returned "Forbidden" on `/new` with a suspended/limited-access warning on 2026-05-13. |
| Medium | `/tools/voltage-drop-calculator/` | Wire length, current, voltage, and percent drop explained safely | Pinterest, Medium | posted | Published to `https://au.pinterest.com/accessfreetools/home-project-calculators/` on 2026-05-07; Medium draft is approved but not posted |
| Medium | `/tools/sand-calculator/` | Estimate sand volume and weight for practical home projects | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/home-project-calculators/` on 2026-05-07 |
| Medium | `/tools/markdown-table-generator/` | Make clean Markdown tables without hand-spacing rows | Pinterest, Medium | posted | Published to `https://au.pinterest.com/accessfreetools/school-and-study-tools/` on 2026-05-07; Medium draft is approved but not posted |
| Medium | `/tools/markdown-table-generator/` | Clean Markdown tables for docs and README files | Bluesky | posted | Public post verified on 2026-05-08: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mld43sxrjy2h` |
| Medium | `/tools/markdown-table-generator/` | Broken README table rows and separator mistakes | DEV Community | blocked | DEV draft passed quality, but posting is blocked until DEV restores the account or the user approves a replacement account path. |
| Medium | `/tools/body-surface-area-calculator/` | BSA estimate with height, weight, and health-result limits | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/health-and-fitness-calculators/` on 2026-05-07 |
| Medium | `/tools/speed-calculator/` | Calculate speed, distance, or time with simple examples | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/school-and-study-tools/` on 2026-05-07 |
| Medium | `/tools/payment-calculator/` | Estimate loan payment from principal, rate, and term | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/finance-calculators/` on 2026-05-07 |
| Medium | `/tools/hex-calculator/` | Hex, decimal, and binary number-base learning helper | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/school-and-study-tools/` on 2026-05-07 |
| Medium | `/tools/amp-hours-to-watt-hours-calculator/` | Convert battery capacity using amp-hours and voltage | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/home-project-calculators/` on 2026-05-07 |
| Medium | `/tools/watts-to-amps-calculator/` | Electrical conversion with voltage and phase reminders | Pinterest RSS | posted | Public Home Project Calculators board HTML showed the RSS import on 2026-05-09 |
| High | `/tools/ad-revenue-calculator/` | Estimate RPM, CTR, CPC, impressions, and ad revenue | Pinterest RSS | posted | Public Finance Calculators board and direct Pin checked on 2026-05-13: `https://au.pinterest.com/pin/1148277236264769497/` links to `https://accessfreetools.com/tools/ad-revenue-calculator/?utm_source=Pinterest&utm_medium=organic`. |
| Medium | `/tools/percent-off-calculator/` | Sale price, discount amount, and savings check | Pinterest RSS | posted | Public Free Online Calculators board HTML showed the RSS import on 2026-05-09 |
| High | `/tools/mortgage-amortization-calculator/` | Payment breakdown across principal and interest | Pinterest RSS | posted | Public Finance Calculators board HTML showed the RSS import on 2026-05-09 |
| Medium | `/tools/concrete-calculator/` | Slabs, footings, posts, and concrete volume | Pinterest RSS | posted | Public Home Project Calculators board HTML showed the RSS import on 2026-05-09 |
| Medium | `/tools/concrete-calculator/` | Concrete volume planning with construction limits | Bluesky | posted | Public post verified on 2026-05-15 with construction-limit wording and the concrete calculator link: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mluadyejjc2t` |
| High | `/tools/percentage-calculator/` | Calculate percent off, discount amount, and sale price | Quora | posted | First Quora profile post published and externally verified on 2026-05-08 at `https://www.quora.com/profile/Brendan-1929`; timestamp slug shown as `https://www.quora.com/profile/Brendan-1929/How-to-calculate-a-discount-without-guessing-Short-answer-percent-off-means-you-multiply-the-original-price-by-the-dis` |
| Medium | `/tools/wallpaper-calculator/` | Explain waste percent, pattern repeat, and roll estimates | Quora Space | posted | Space post published and verified on 2026-05-09: `https://accessfreetoolssspace.quora.com/Wallpaper-waste-percent-is-not-a-mystery-fee-It-is-extra-wallpaper-for-trimming-corners-pattern-matching-damaged-str` |
| Medium | `/tools/watts-to-amps-calculator/` | Explain watts, volts, amps, and why voltage changes current | Quora | posted | Direct answer published and public-page checked on 2026-05-14 with the exact question, 600 W example, ownership disclosure, electrical-safety limit, and live tool link visible: `https://www.quora.com/How-do-I-convert-watts-to-amps-quickly-and-accurately/answer/Access-Free-Tools?prompt_topic_bio=1`. |
| Medium | `/tools/watts-to-amps-calculator/` | Watts, volts, and why the same watts can mean different amps | Quora Space | posted | Space post published and public feed checked on 2026-05-14 with the 600 W example, ownership disclosure, electrical-safety limit, and live tool link visible: `https://accessfreetoolssspace.quora.com/`. |
| Medium | `/tools/markdown-table-generator/` | Fix broken Markdown table rows and separators | Quora | posted | Direct answer published and public-page checked on 2026-05-09: `https://www.quora.com/How-do-I-make-a-Markdown-table-of-two-columns-out-of-a-list-whose-items-alternate-to-each-column/answer/Access-Free-Tools` |
| Medium | `/tools/image-to-text-ocr-tool/` | Explain OCR image quality and browser privacy limits | Quora Space | posted | Space post published and public-page checked on 2026-05-10 with OCR explanation, ownership disclosure, sensitive-document warning, and the live tool link: `https://accessfreetoolssspace.quora.com/Copying-text-from-a-screenshot-is-usually-an-OCR-problem-not-a-copy-paste-problem-OCR-means-optical-character-recogni` |
| Medium | `/tools/concrete-calculator/` | Estimate concrete volume while avoiding unit mistakes | Quora | done | Direct-answer draft passed `npm run promotion:quora:quality`, but matching Quora question pages did not expose a working answer editor. The Space fallback below was posted and verified, so do not treat this as a fresh approved item unless a new exact-match question with a working editor is found. |
| Medium | `/tools/concrete-calculator/` | Concrete slab unit conversion and waste allowance example | Quora Space | posted | Space fallback used on 2026-05-15 after direct-answer pages did not expose a working answer editor. Public permalink verified with the 181 5/8 in by 50 1/2 in by 3 in example, ownership disclosure, construction-limit wording, and live concrete-calculator link visible: `https://accessfreetoolssspace.quora.com/Concrete-slab-estimates-are-mostly-unit-conversion-not-magic-Example-if-a-slab-is-181-5-8-in-by-50-1-2-in-by-3-in-c` |
| High | `/tools/ad-revenue-calculator/` | Explain RPM, pageviews, and ad revenue estimate limits | Quora Space | posted | Space post published and verified on 2026-05-13 with RPM example, estimate limits, ownership disclosure, and tool link: `https://accessfreetoolssspace.quora.com/How-to-estimate-ad-revenue-without-pretending-RPM-is-a-promise-Ad-revenue-math-usually-starts-with-RPM-which-means-rev` |
| High | `/tools/mortgage-calculator/` | Explain mortgage calculator estimates before lender approval | Quora | posted | Direct answer to "How accurate are mortgage calculators?" published and public-page checked on 2026-05-13 with estimate limits, ownership disclosure, and the live tool link: `https://www.quora.com/How-accurate-are-mortgage-calculators/answer/Access-Free-Tools` |
| Medium | `/tools/recipe-scaler/` | Resize ingredient amounts without guessing | Pinterest RSS | posted | Public Free Online Calculators board HTML showed the RSS import on 2026-05-09 |
| Medium | `/tools/unit-price-calculator/` | Compare price per unit while shopping | Pinterest | posted | Organic Pin redone through the user's external Chrome session on 2026-05-13 after verifying the active account was `/accessfreetools/`; public proof: `https://au.pinterest.com/pin/1148277236265110127/` links to `https://accessfreetools.com/tools/unit-price-calculator/?utm_source=Pinterest&utm_medium=organic`. |
| Medium | `/tools/word-counter/` | Count words, characters, sentences, and reading time | Pinterest RSS | posted | Public School And Study Tools board HTML showed the RSS import on 2026-05-09 |
| Medium | `/tools/json-formatter/` | Spot broken JSON before it wastes debug time | DEV Community | blocked | DEV draft passed quality, but posting is blocked until DEV restores the account or the user approves a replacement account path. |
| Medium | `/tools/prompt-token-estimator/` | Explain token cost before pasting long AI prompts | DEV Community | blocked | DEV draft passed quality, but posting is blocked until DEV restores the account or the user approves a replacement account path. |
| High | `/tools/ad-revenue-calculator/` | Explain RPM, pageviews, and earnings-estimate limits | Reddit | blocked | Draft passed quality, but Reddit promotion is blocked because the public `u/accessfreetools` profile showed "This account has been banned" on 2026-05-13. |
| High | `/tools/mortgage-calculator/` | Mortgage payment ballpark with lender-limit warning | Reddit | blocked | Draft passed quality, but Reddit promotion is blocked because the public `u/accessfreetools` profile showed "This account has been banned" on 2026-05-13. |
| High | `/tools/percentage-calculator/` | Discount, tip, markup, and percent-change help | Reddit | blocked | The old submit flow remains unverified, and Reddit promotion is now blocked because the public `u/accessfreetools` profile showed "This account has been banned" on 2026-05-13. |
| Medium | `/tools/wallpaper-calculator/` | Explain waste percent for wallpaper roll planning | Reddit | blocked | Draft passed quality, but Reddit promotion is blocked because the public `u/accessfreetools` profile showed "This account has been banned" on 2026-05-13. |
| Medium | `/tools/concrete-calculator/` | Concrete volume estimate with construction limits | Reddit | blocked | Draft passed quality, but Reddit promotion is blocked because the public `u/accessfreetools` profile showed "This account has been banned" on 2026-05-13. |
| Medium | `/tools/markdown-table-generator/` | Markdown table cleanup for docs and READMEs | Reddit | blocked | Draft passed quality, but Reddit promotion is blocked because the public `u/accessfreetools` profile showed "This account has been banned" on 2026-05-13. |
| High | `/tools/percentage-calculator/` | Start-here calculator setup mistakes and percent-off example | Quora Space | posted | Space created and first post externally verified on 2026-05-08: `https://accessfreetoolssspace.quora.com/Start-here-how-to-use-a-calculator-without-guessing-Most-calculator-mistakes-are-not-math-mistakes-They-are-setup-mis`; Space URL: `https://accessfreetoolssspace.quora.com/`; later checklist correction verified description, visuals, and share-to-feed while intentionally leaving bulk invites skipped |
| Low | `/blog/` | Guide library for tool examples and explanations | Medium | waiting | Monitor index status before heavier promotion |

## Draft Template

```text
Page:
Audience:
Problem:
Useful explanation:
Link:
Disclosure needed:
Approval status:
Posted URL:
Follow-up date:
```

## Weekly Promotion Rhythm

1. Pick 3 priority pages.
2. Create organic Pinterest pins and draft-first Reddit/Medium companion content.
3. Check whether each target page is indexed or pending.
4. Add or recommend internal links from related tools and guides.
5. Use RSS-ready status only for pages that already have approved pin copy, a real image, a board, and a useful page.
6. Record posted URLs after the user confirms publishing.
