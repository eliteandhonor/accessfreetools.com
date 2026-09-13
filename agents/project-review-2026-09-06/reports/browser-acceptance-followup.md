# Browser Acceptance Follow-up

Date: 2026-09-06 AEST. Status: source-ready for coordinator smoke and screenshot review, not browser-verified or release-approved.

Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`. Branch: `codex/gpt6-review-implementation`. HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, plus existing concurrent edits. The coordinator owns R1 in `src/lib/calculator.ts` and its pure tests; neither was edited here. The coordinator reports a fresh build passed in `output/project-review-followup/integration/build-r1-2026-09-06.log`; this specialist did not execute or independently validate that build.

## Owned Files

- `tests/numeric-regressions.spec.ts`
- `tests/json-csv-resource-limits.spec.ts`
- `tests/calendar-convention.spec.ts`
- `agents/project-review-2026-09-06/reports/browser-acceptance-followup.md`

## Acceptance Added

1. Numeric UI: [three-payment forward reproduction](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/numeric-regressions.spec.ts:51), [both inverse entry points](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/numeric-regressions.spec.ts:65), and [APR](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/numeric-regressions.spec.ts:129) await real FinanceCalculator hydration. Forward/APR enter principal 100000, rate 1e-16 percent and 0.25 years; APR uses zero fees. Inverse uses the supported unrounded floor `100000 / 3`, not the cents-only displayed payment or the old below-floor rounding artifact. Both inverse screens accept 19200%, explicitly reject a $1600001 monthly payment over 30 years and a genuinely insufficient $30000 three-payment input, then recalculate to 6%. APR accepts 19200%, rejects 19200.01% with no fees and 19000% with $1100 fees, then recalculates to 6%. Errors must show the exact source message and disable Copy answer; recovery requires the new result, no alert and enabled Copy answer. Existing assertions remain.
2. JSON bounded response: [the probe](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/json-csv-resource-limits.spec.ts:20) starts `performance.mark` in a capture listener on the actual Convert JSON click, before React's handler. It measures the first timer turn, DOM outcome mutation, and a timer after the next animation frame. Each phase must finish within a fixed generous 5000 ms; outcome waiting is separately bounded at 8000 ms. The existing 50000-row unique-key input is below 5 MB but implies 2.5 billion expanded cells. The same probe measures successful conversion afterward as a positive control. The explicit 250000-cell rejection, unavailable invalid download, error clearance, request sentinels, LF textarea and CRLF downloaded bytes are all preserved. [The JSON record](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/json-csv-resource-limits.spec.ts:94) retains both scenarios' actual timings and the budget before assertions on timing run.
3. Calendar retention: [age](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/calendar-convention.spec.ts:49), [reversed difference](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/calendar-convention.spec.ts:65), and [date reconstruction](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/calendar-convention.spec.ts:77) retain locator screenshots. Result and explanatory steps are separate readable regions, with no full-page capture. All original component, total-day, direction, explanation and reconstruction assertions remain.

Labels and error expectations came from `src/components/FinanceCalculator.tsx` and `src/lib/calculator.ts`, not old dist. Additional inspected paths: root/campaign AGENTS, `reports/implementation-batch-one-rejudge.md` under this campaign, `src/components/JsonToCsvConverter.tsx`, `src/components/UtilityCalculator.tsx`, `src/lib/calculator.numeric.test.ts`, `playwright.config.ts`, `scripts/run-playwright-smoke.mjs`, and `.gitignore`.

## Durable Evidence Contract

All three specs write to `output/project-review-followup/browser-acceptance/<project>/<sanitized-test-id>-retry-<n>/`. Desktop/mobile and retries cannot overwrite one another. A later run of the same test/retry replaces that case's prior files; the coordinator should include the final files and source identity in the integration manifest.

Screenshots use locator capture, disabled animations and CSS-pixel scale, then `testInfo.attach` with the same file path. Finance retains results and the relevant calculator panel for errors; JSON retains the rejected tool and successful result. Calendar retains results and formula steps separately. JSON also writes and attaches `json-responsiveness.json` with timestamp, project, test ID, retry, input bytes, implied cells and all six measured durations. No screenshots or timing results were generated during this source-only pass.

## Verification And Handoff

- Executed an in-memory TypeScript `createProgram` check over the three owned specs: `noEmit`, `strict`, `skipLibCheck`, ES2022 target, ESNext module, Bundler resolution and Node types. Zero diagnostics, exit 0. This is static checking, not test execution.
- Executed scoped `git diff --check`, exit 0. The specs were already untracked; this command alone does not validate their contents. A direct owned-file whitespace/ASCII check supplements it.
- Executed `git check-ignore -v output/project-review-followup/browser-acceptance/desktop/example.png`: ignored by `.gitignore:12:output`. No ignore configuration was changed.
- Read-only exploration used `Get-Content`, `rg`, `git status`, `git log`, and `Get-FileHash`; no application or dependency mutation was performed.
- No build, fullcheck, browser, server, install, test-suite execution, settings/provider operation, external network request, publishing, deployment, commit, worklog or campaign-status write ran here. Service-based provenance inspection was not run because network/service operations are outside this assignment; no provenance removal or extra cleaned file was attempted.

Confidence: high that source assertions address the reported missing acceptance; runtime compatibility, screenshot legibility and actual response budgets remain untested. The 5-second bound is a regression safety ceiling for this fixture, not a claim of sub-50ms responsiveness, INP, or whole-site performance. Request sentinels cover only the instrumented URLs/bodies, not blanket privacy certification.

Coordinator next action: run the entire smoke suite against the fresh R1 build, inspect the retained desktop/mobile screenshots and both JSON timing records, and refresh the final evidence manifest. These three files define 11 cases per viewport (22 across the existing desktop/mobile projects); this is a source count, not a pass count. Acceptance requires all relevant assertions and budgets passing plus visual review. Source-ready does not close J2/J3/J4 or R1 by itself.

## Source Fingerprints

SHA-256, raw file bytes; this report is excluded:

| File | SHA-256 |
| --- | --- |
| `tests/numeric-regressions.spec.ts` | `11a73929000a931e824194901ae10760fdd7fa22306728ff69e4f8f2d546dff7` |
| `tests/json-csv-resource-limits.spec.ts` | `d640293e16bc98ceebbbe7324ffa63bbd1bead17c3b4c55a1617f447c5aaacd3` |
| `tests/calendar-convention.spec.ts` | `410c61a0a927f6868f72a322881783a682cb0dc058f02376008844a50365f2d3` |
