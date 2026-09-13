# Clarity Account Settings Verification

Observed 2026-09-06, approximately 02:53 UTC, in the owner-authorized external Chrome session. Read-only account inspection; no setting was changed and no visitor recording was opened.

## Verified Account State

- Access Free Tools project `xg7bzx9dxo` is signed in. The previous login gate is resolved.
- Settings > Masking: Balanced selected, Strict and Relaxed not selected. The loaded accessibility state and screenshot agree.
- Mask by element: no custom selectors listed. No account-level unmask override was visible.
- Settings > IP blocking: the loaded page explicitly says no IP addresses are blocked. No raw IP was copied into this report.
- This does not verify the current browser's Access Free Tools local opt-out, server-side owner exclusions, recorder payload masking, or historical sessions.

## Meaning For SEC-02

Balanced masking alone does not prove that arbitrary alphabetic OCR output, generated summaries, errors or Ask messages stay private. Microsoft documents explicit `data-clarity-mask` attributes for a node and its descendants, independently of project defaults. The pending local SEC-02 patch applies those boundaries to the tool workspace and Ask island. It is not deployed yet.

The isolated synthetic component tests pass, but the integrated Astro build, real-recorder interception proof and independent approval remain separate gates. Do not describe the account settings check as proof that all production outputs are already masked. No confirmed historical leak has been established.

## Aggregate Snapshot, Not A Performance Verdict

Dashboard filter: Last 3 days. Read at 2026-09-06 approximately 02:51 UTC.

- 22 sessions; 13 bot sessions excluded; 22 unique users shown.
- 1.27 pages/session, 66.61% scroll depth, 1.7 minutes active time.
- Dead clicks: 6 sessions (27.27%); quick backs: 1 session (4.55%); rage clicks: 0.
- JavaScript errors: 0 recorded in this filtered snapshot.
- Performance widget: 7 measured pageviews, score 64, LCP 3.2 seconds, INP 310 ms, CLS 1.
- Kawaii Calculator: 9 sessions; Random Number Generator: 3 sessions in Top pages.

The performance sample is too small for a site-wide conclusion. Owner exclusion is not yet confirmed. Investigate route-level layout shifts and dead-click targets before choosing fixes; do not rewrite Kawaii copy or equate session counts with verified tool starts. This is neither Search Console/CrUX evidence nor a current first-party production-analytics refresh.

The loaded URL performance tab subsequently showed two measured routes:

| Route | Score | LCP | INP | CLS |
| --- | --- | --- | --- | --- |
| Random Number Generator | 91 | 1.1 s | 170 ms | 0 |
| Kawaii Calculator | 53 | 3.2 s | 460 ms | 1 |

These are aggregate Clarity widget observations from the same seven-pageview sample; no per-route sample size was shown. UX-03 should first reproduce Kawaii layout/interaction behavior in an owner-excluded browser and identify the shifting element before changing code. Protect its title, intent, content and search signals. No visitor recording or heatmap was opened.

## Next Gates

1. Obtain the owner's decision before adding their current IP to the Clarity exclusion list. No change made.
2. Verify the site's browser opt-out through its visible Privacy controls and a no-request browser test. IP exclusion is supplementary; changing addresses and mobile connections need browser-level exclusion.
3. Finish integrated masking/recorder tests, judge the exact patch, and deploy only through the normal release gates.

Primary documentation checked during this inspection:

- [Microsoft Clarity masking](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking)
- [Microsoft Clarity IP exclusion](https://learn.microsoft.com/en-us/clarity/setup-and-installation/ip-exclusion)

Browser proof is the live Settings accessibility state and screenshots captured in this task. No screenshot file path is claimed.

## Built-Page Verification, 2026-09-06

The coordinator built the implementation worktree on Node 24 and ran the complete desktop/mobile Playwright smoke suite: 128 passed, exit 0 (`output/project-review-followup/integration/smoke-final-fixtures-2026-09-06.log`). New actual-Astro checks cover Text Case Converter and Ask synthetic results remaining inside explicit mask boundaries after hydration. A virtual production-origin test serves this same local build, observes the real initial Clarity-load attempt and first-party analytics request, selects the visible browser opt-out, then verifies neither is attempted again after reload. All telemetry is intercepted; no test session is sent to production analytics.

The separate six-workflow masking fixture also passed all 12 desktop/mobile cases after the calculator explanation edits (`output/project-review-followup/integration/clarity-isolated-2026-09-06.log`). These results resolve built-page and browser-opt-out test gaps, not the real-recorder payload gate. The Clarity SDK itself was not executed by these tests. No account IP exclusion or production deployment was performed. The signed-in dashboard is retained as a browser handoff while the owner decision is outstanding.
