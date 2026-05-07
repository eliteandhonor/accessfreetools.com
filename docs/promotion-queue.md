# Promotion Queue

This queue gives the Daily Promotion Agent and Weekly Content Promotion Agent a
safe place to plan work. Public posting, emails, paid ads, and affiliate changes
still require approval.

## Status Labels

- `needs draft`: promotion copy has not been written yet.
- `needs approval`: ready for the user to approve or edit.
- `approved`: user approved the idea, but it has not been posted.
- `posted`: user posted it or confirmed it was published.
- `waiting`: submitted to discovery/indexing and waiting for search engines.
- `done`: no current action needed.

## Priority Pages

Pinterest Business account status: created by the user on 2026-05-06. Use
Pinterest as the first active promotion channel. Reddit is planned but not
created yet. Medium login was started by the user on 2026-05-06 with
`contact@accessfreetools.com`; Medium profile setup is complete at
`https://medium.com/@accessfreetools`. Pinterest domain verification file is live and external
read-only review reached the Pinterest Business Hub for `accessfreetools.com`.
Public profile cleanup is done at `https://au.pinterest.com/accessfreetools/`.
The branded avatar is live, starter boards are created, 8 organic starter pins
are published, and duplicate draft cleanup is complete. Use Pinterest's organic
`/pin-creation-tool/` flow for pins; do not use the ad-focused pin builder.
Use `npm run promotion:medium:starter` to generate publish-ready Medium
companion drafts; it is draft-only and does not publish. Generated drafts include
canonical/source URL notes, tags, preview text, and an approval checklist.
Second-wave Pinterest assets and Medium drafts were regenerated on 2026-05-07
after DataForSEO intent checks confirmed the target topics are informational.
The user approved the batch, and the 8 second-wave organic Pinterest pins were
published and verified on 2026-05-07 with the no-ads publisher.

| Priority | Page | Main Angle | Channel | Status | Next Action |
| --- | --- | --- | --- | --- | --- |
| High | `/tools/` | Free online tools library with calculators, converters, AI tools, and guides | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/free-calculator-resources/` | Free calculator resources hub for common calculations | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/free-calculator-resources/` | How to pick the right free online calculator | Medium | posted | Live article updated in the external Medium editor on 2026-05-06: `https://medium.com/@accessfreetools/how-to-pick-the-right-free-online-calculator-c13c791f08d5` |
| High | `/tools/basic-calculator/` | Simple everyday calculator with guide and keyboard support | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/tools/percentage-calculator/` | Discounts, percent change, markups, and reverse percentages | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/free-online-calculators/` on 2026-05-06 |
| High | `/tools/mortgage-calculator/` | Estimate monthly payments and understand amortization | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/finance-calculators/` on 2026-05-06 |
| High | `/tools/ad-revenue-calculator/` | Estimate RPM, CTR, CPC, impressions, and ad revenue | Medium, Reddit | approved | Medium draft approved on 2026-05-07; ready to publish after the current live Medium result is reviewed |
| High | `/tools/percentage-calculator/` | Discounts, tips, markups, and percent change | Medium | approved | Medium draft approved on 2026-05-07; recommended as the next Medium post |
| High | `/tools/mortgage-calculator/` | Early home-shopping payment estimate with finance limits | Medium | approved | Medium draft approved on 2026-05-07; finance limits included |
| Medium | `/tools/bmi-calculator/` | BMI estimate with health disclaimer and plain-language result notes | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/health-and-fitness-calculators/` on 2026-05-06 |
| Medium | `/tools/bmi-calculator/` | BMI estimate limits explained carefully | Medium | approved | Medium draft approved on 2026-05-07; health limits included |
| Medium | `/tools/wallpaper-calculator/` | Rolls, wall area, pattern repeat, and waste percent explained | Pinterest, Medium | approved | Pinterest published; Medium draft approved on 2026-05-07 |
| Medium | `/tools/watts-to-amps-calculator/` | Electrical conversion with voltage and phase reminders | Reddit, Medium | approved | Medium draft approved on 2026-05-07; electrical limits included |
| Medium | `/categories/ai-tools/` | Browser-side AI tools with privacy notes | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/ai-browser-tools/` on 2026-05-06 |
| Medium | `/categories/ai-tools/` | Browser-side AI tools with privacy notes | Medium | approved | Medium draft approved on 2026-05-07; privacy wording included |
| Medium | `/tools/image-to-text-ocr-tool/` | OCR text extraction in the browser with privacy limits | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/ai-browser-tools/` on 2026-05-06 |
| Medium | `/tools/voltage-drop-calculator/` | Wire length, current, voltage, and percent drop explained safely | Pinterest, Medium | posted | Published to `https://au.pinterest.com/accessfreetools/home-project-calculators/` on 2026-05-07; Medium draft is approved but not posted |
| Medium | `/tools/sand-calculator/` | Estimate sand volume and weight for practical home projects | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/home-project-calculators/` on 2026-05-07 |
| Medium | `/tools/markdown-table-generator/` | Make clean Markdown tables without hand-spacing rows | Pinterest, Medium | posted | Published to `https://au.pinterest.com/accessfreetools/school-and-study-tools/` on 2026-05-07; Medium draft is approved but not posted |
| Medium | `/tools/body-surface-area-calculator/` | BSA estimate with height, weight, and health-result limits | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/health-and-fitness-calculators/` on 2026-05-07 |
| Medium | `/tools/speed-calculator/` | Calculate speed, distance, or time with simple examples | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/school-and-study-tools/` on 2026-05-07 |
| Medium | `/tools/payment-calculator/` | Estimate loan payment from principal, rate, and term | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/finance-calculators/` on 2026-05-07 |
| Medium | `/tools/hex-calculator/` | Hex, decimal, and binary number-base learning helper | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/school-and-study-tools/` on 2026-05-07 |
| Medium | `/tools/amp-hours-to-watt-hours-calculator/` | Convert battery capacity using amp-hours and voltage | Pinterest | posted | Published to `https://au.pinterest.com/accessfreetools/home-project-calculators/` on 2026-05-07 |
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
2. Create organic Pinterest pins first while Pinterest is the only created promotion account.
3. Check whether each target page is indexed or pending.
4. Add or recommend internal links from related tools and guides.
5. Ask the user before anything is posted publicly unless the user has explicitly approved autopilot posting for that channel.
6. Record posted URLs after the user confirms publishing.
