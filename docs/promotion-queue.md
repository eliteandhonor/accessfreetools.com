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
- `waiting`: submitted to discovery/indexing and waiting for search engines.
- `done`: no current action needed.

## Priority Pages

Pinterest Business account status: created by the user on 2026-05-06. Use
Pinterest as the first active promotion channel. Reddit account status:
created by the user on 2026-05-07 as `u/accessfreetools`; setup and posting
must stay useful-first, disclosed, and community-rule aware. Medium login was
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
Do not treat a Reddit post as posted unless the external profile visibly shows
the post after submission.
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
"maximum of two stories in the past 24 hours" limit. Do not mark it posted until
the account can publish again and the public URL is visibly checked.
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
the board-specific feeds under `/pinterest/*.xml`. The latest RSS report found
8 RSS-ready future items and no feed issues. On 2026-05-08, the external
browser Pinterest settings page accepted these non-empty board feeds:
`/pinterest/finance-calculators.xml`, `/pinterest/home-project-calculators.xml`,
`/pinterest/free-online-calculators.xml`, and
`/pinterest/school-and-study-tools.xml`. Pinterest showed "RSS feed added" for
each one. Do not mark the individual feed items `posted` until Pinterest imports
them and the public board shows the Pins.
Bluesky is the recommended next organic platform as of 2026-05-08. The user
created `https://bsky.app/profile/accessfreetools.bsky.social`; the profile was
updated through the Bluesky API with the approved display name, bio, and branded
avatar. Public profile audit passed on 2026-05-08 after the public avatar and
author feed were checked. Use `docs/bluesky-promotion-agent.md`, run
`npm run promotion:bluesky:profile-audit`, and run
`npm run promotion:bluesky:quality` before future Bluesky batches. Do not mark
Bluesky posts `posted` unless the public Bluesky profile shows a live post URL.

| Priority | Page | Main Angle | Channel | Status | Next Action |
| --- | --- | --- | --- | --- | --- |
| High | `/tools/` | Free online tools library with calculators, converters, AI tools, and guides | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/free-calculator-resources/` | Free calculator resources hub for common calculations | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/free-calculator-resources/` | How to pick the right free online calculator | Medium | posted | Live article updated in the external Medium editor on 2026-05-07 with hero image, alt text, SEO title/description, canonical link, topics, and live image/H2 check: `https://medium.com/@accessfreetools/how-to-pick-the-right-free-online-calculator-c13c791f08d5` |
| High | `/tools/basic-calculator/` | Simple everyday calculator with guide and keyboard support | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/tools/percentage-calculator/` | Discounts, percent change, markups, and reverse percentages | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/tools/mortgage-calculator/` | Estimate monthly payments and understand amortization | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/finance-calculators/` on 2026-05-06 |
| High | `/tools/ad-revenue-calculator/` | Estimate RPM, CTR, CPC, impressions, and ad revenue | Medium, Reddit | waiting | Medium draft prepared in the external Chrome editor on 2026-05-08 with hero image, alt text, topics, SEO title/description, and canonical URL; Medium blocked publishing because the account reached the two-stories-per-24-hours limit, so retry after the 24-hour window and verify the public URL before marking posted |
| High | `/tools/ad-revenue-calculator/` | Explain RPM, CTR, CPC, impressions, and earnings-estimate limits | Bluesky | needs approval | Draft generated by `npm run promotion:bluesky:quality`; publish only after Bluesky account and app password exist |
| High | `/tools/percentage-calculator/` | Discounts, tips, markups, and percent change | Medium | posted | Live article published and checked on 2026-05-07: `https://medium.com/@accessfreetools/how-percentage-calculators-help-with-discounts-and-tips-33b1f6fa6ea4`; branded hero image, alt text, Medium SEO title/description, canonical link, reader-interest topics, and live H1/H2 formatting verified in the external browser |
| High | `/tools/percentage-calculator/` | Discount, tip, markup, and percent-change micro tip | Bluesky | posted | Public post verified on 2026-05-08: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mld43shj2u2h` |
| High | `/tools/mortgage-calculator/` | Early home-shopping payment estimate with finance limits | Medium | approved | Medium draft approved on 2026-05-07; finance limits included |
| High | `/tools/mortgage-calculator/` | Mortgage planning estimate with finance limits | Bluesky | needs approval | Draft generated by `npm run promotion:bluesky:quality`; publish only after Bluesky account and app password exist |
| Medium | `/tools/bmi-calculator/` | BMI estimate with health disclaimer and plain-language result notes | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/health-and-fitness-calculators/` on 2026-05-06 |
| Medium | `/tools/bmi-calculator/` | BMI estimate limits explained carefully | Medium | approved | Medium draft approved on 2026-05-07; health limits included |
| Medium | `/tools/wallpaper-calculator/` | Rolls, wall area, pattern repeat, and waste percent explained | Pinterest, Medium | posted | Pinterest published; Medium live article manually fixed by the user and externally checked on 2026-05-08: `https://medium.com/@accessfreetools/what-waste-percent-means-in-a-wallpaper-calculator-8189dc219150` |
| Medium | `/tools/wallpaper-calculator/` | Waste percent and roll-estimate micro tip | Bluesky | needs approval | Draft generated by `npm run promotion:bluesky:quality`; publish only after Bluesky account and app password exist |
| Medium | `/tools/watts-to-amps-calculator/` | Electrical conversion with voltage and phase reminders | Reddit, Medium | approved | Medium draft approved on 2026-05-07; electrical limits included |
| Medium | `/tools/watts-to-amps-calculator/` | Watts, amps, voltage, and electrical-caution micro tip | Bluesky | needs approval | Draft generated by `npm run promotion:bluesky:quality`; publish only after Bluesky account and app password exist |
| Medium | `/tools/watts-to-amps-calculator/` | Explain watts, volts, amps, and electrical caution | Reddit | approved | Draft generated by `npm run promotion:reddit:quality`; use only where community rules allow disclosed self-links |
| Medium | `/categories/ai-tools/` | Browser-side AI tools with privacy notes | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/ai-browser-tools/` on 2026-05-06 |
| Medium | `/categories/ai-tools/` | Browser-side AI tools with privacy notes | Medium | approved | Medium draft approved on 2026-05-07; privacy wording included |
| Medium | `/tools/image-to-text-ocr-tool/` | OCR text extraction in the browser with privacy limits | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/ai-browser-tools/` on 2026-05-06 |
| Medium | `/tools/image-to-text-ocr-tool/` | Browser OCR image-quality and privacy micro tip | Bluesky | posted | Public post verified on 2026-05-08: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mld43thfov2a` |
| Medium | `/tools/image-to-text-ocr-tool/` | Explain OCR image quality and browser privacy limits | Reddit | approved | Draft generated by `npm run promotion:reddit:quality`; avoid sensitive document threads |
| Medium | `/tools/voltage-drop-calculator/` | Wire length, current, voltage, and percent drop explained safely | Pinterest, Medium | posted | Published to `https://au.pinterest.com/accessfreetools/home-project-calculators/` on 2026-05-07; Medium draft is approved but not posted |
| Medium | `/tools/sand-calculator/` | Estimate sand volume and weight for practical home projects | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/home-project-calculators/` on 2026-05-07 |
| Medium | `/tools/markdown-table-generator/` | Make clean Markdown tables without hand-spacing rows | Pinterest, Medium | posted | Published to `https://au.pinterest.com/accessfreetools/school-and-study-tools/` on 2026-05-07; Medium draft is approved but not posted |
| Medium | `/tools/markdown-table-generator/` | Clean Markdown tables for docs and README files | Bluesky | posted | Public post verified on 2026-05-08: `https://bsky.app/profile/accessfreetools.bsky.social/post/3mld43sxrjy2h` |
| Medium | `/tools/body-surface-area-calculator/` | BSA estimate with height, weight, and health-result limits | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/health-and-fitness-calculators/` on 2026-05-07 |
| Medium | `/tools/speed-calculator/` | Calculate speed, distance, or time with simple examples | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/school-and-study-tools/` on 2026-05-07 |
| Medium | `/tools/payment-calculator/` | Estimate loan payment from principal, rate, and term | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/finance-calculators/` on 2026-05-07 |
| Medium | `/tools/hex-calculator/` | Hex, decimal, and binary number-base learning helper | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/school-and-study-tools/` on 2026-05-07 |
| Medium | `/tools/amp-hours-to-watt-hours-calculator/` | Convert battery capacity using amp-hours and voltage | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/home-project-calculators/` on 2026-05-07 |
| Medium | `/tools/watts-to-amps-calculator/` | Electrical conversion with voltage and phase reminders | Pinterest RSS | rss-connected | Home Project Calculators RSS feed connected on 2026-05-08; wait for Pinterest import proof |
| High | `/tools/ad-revenue-calculator/` | Estimate RPM, CTR, CPC, impressions, and ad revenue | Pinterest RSS | rss-connected | Finance Calculators RSS feed connected on 2026-05-08; wait for Pinterest import proof |
| Medium | `/tools/percent-off-calculator/` | Sale price, discount amount, and savings check | Pinterest RSS | rss-connected | Free Online Calculators RSS feed connected on 2026-05-08; wait for Pinterest import proof |
| High | `/tools/mortgage-amortization-calculator/` | Payment breakdown across principal and interest | Pinterest RSS | rss-connected | Finance Calculators RSS feed connected on 2026-05-08; wait for Pinterest import proof |
| Medium | `/tools/concrete-calculator/` | Slabs, footings, posts, and concrete volume | Pinterest RSS | rss-connected | Home Project Calculators RSS feed connected on 2026-05-08; wait for Pinterest import proof |
| Medium | `/tools/concrete-calculator/` | Concrete volume planning with construction limits | Bluesky | needs approval | Draft generated by `npm run promotion:bluesky:quality`; publish only after Bluesky account and app password exist |
| Medium | `/tools/recipe-scaler/` | Resize ingredient amounts without guessing | Pinterest RSS | rss-connected | Free Online Calculators RSS feed connected on 2026-05-08; wait for Pinterest import proof |
| Medium | `/tools/unit-price-calculator/` | Compare price per unit while shopping | Pinterest RSS | rss-connected | Free Online Calculators RSS feed connected on 2026-05-08; wait for Pinterest import proof |
| Medium | `/tools/word-counter/` | Count words, characters, sentences, and reading time | Pinterest RSS | rss-connected | School And Study Tools RSS feed connected on 2026-05-08; wait for Pinterest import proof |
| High | `/tools/ad-revenue-calculator/` | Explain RPM, pageviews, and earnings-estimate limits | Reddit | approved | Draft generated by `npm run promotion:reddit:quality`; avoid income-promise threads |
| High | `/tools/mortgage-calculator/` | Mortgage payment ballpark with lender-limit warning | Reddit | approved | Draft generated by `npm run promotion:reddit:quality`; only use when finance community rules allow |
| High | `/tools/percentage-calculator/` | Discount, tip, markup, and percent-change help | Reddit | unverified | Re-publish only after the external Edge profile can verify the post appears under `u/accessfreetools` posts |
| Medium | `/tools/wallpaper-calculator/` | Explain waste percent for wallpaper roll planning | Reddit | approved | Draft generated by `npm run promotion:reddit:quality`; useful for DIY threads when rules allow |
| Medium | `/tools/concrete-calculator/` | Concrete volume estimate with construction limits | Reddit | approved | Draft generated by `npm run promotion:reddit:quality`; avoid structural-design advice |
| Medium | `/tools/markdown-table-generator/` | Markdown table cleanup for docs and READMEs | Reddit | approved | Draft generated by `npm run promotion:reddit:quality`; safe for documentation help threads |
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
