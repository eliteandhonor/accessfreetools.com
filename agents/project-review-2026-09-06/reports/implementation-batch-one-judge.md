# Implementation Batch One: Independent Release Judge

Reviewed 2026-09-06, 12:45-12:52 AEST. Verdict: **request changes; no implementation or release approval**. Four P2 findings are confirmed below. No P0/P1 defect was confirmed within this limited review. Passing focused tests do not satisfy the full acceptance gates.

Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`. Branch: `codex/gpt6-review-implementation`. HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, plus uncommitted implementation changes. Runtime: Node `v24.20.0`. HEAD alone does not identify the reviewed implementation.

Read root/campaign AGENTS, campaign task definitions for SEC-01, COR-03/04/05, BR-01, PR-01 and RJ-02, Release Judge instructions/reference, original relevant findings, implementation reports, and the installed `code-review-and-quality` skill. Inspected source and callers, not only tests. PR-01 documentation is still coordinator-owned and unfinished; it was not treated as stable acceptance evidence.

## Findings By Severity

### J1 [P2] PR-01 still accepts mixed labels when normalization erases the unknown channel

- References: [normalization](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/promotion-channel-policy.mjs:80), [exact comparison after normalization](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/promotion-channel-policy.mjs:93), [public guard](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/promotion-channel-policy.mjs:103), [CLI consumer](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/aft-cli.mjs:1017).
- Reproduced without public actions: the JavaScript string `"Medium, \u672a\u77e5"` resolves to `medium`, passes `assertPublicPromotionChannel`, and survives `filterActivePromotionRows` as an approved row. `"Medium / ???"` and the non-string value `["Medium", null]` also pass. The regex removes the unrecognized portion before the supposedly exact match, and `String(...)` coerces invalid types. Existing ASCII cases `Medium, Quora` and `Unknown Medium Network` correctly fail.
- Consequence: the required one-exact-channel/fail-closed contract is not met; a mixed row can still appear as actionable. This is not a claim that the hardcoded DEV/Reddit publishers ran, or that arbitrary destinations can be passed to them.
- Minimal correction, owner Promotion: accept string values only and compare explicit IDs/aliases without deleting unrecognized punctuation or characters. Preserve only deliberate case/whitespace normalization. Add regression cases at both policy and `promote-next` boundaries for the reproductions above, null/array/object input, valid aliases, and `release-ready` versus `needs approval`.
- Acceptance: unknown or mixed values return null, the public guard throws, and CLI candidates exclude them; legitimate single-channel aliases remain usable. Confidence: high.

### J2 [P2] COR-05 extreme-rate acceptance stops before the inverse-rate/APR callers

- References: [changed payment helper](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:4658), [inverse-rate bracket](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:5125), [APR bracket](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:6613), [new caller tests](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.numeric.test.ts:114).
- Reproduced: `calculateLoanSummary(100000, 100000, 30).monthlyPayment` is now a legitimate finite `8333333.333333333`. Passing that payment to `calculateInterestRateFromPayment(100000, payment, 30)` returns `19200`, not `100000`. `calculateAprEstimate({ principal: 100000, annualRatePercent: 100000, years: 30, fees: 0 }).aprPercent` likewise returns `19200`. With zero fees the APR must recover the input nominal rate under this calculator's convention, or explicitly reject an unsupported range.
- Cause/consequence: both searches stop expanding at a monthly rate of 16 and bisect even when the solution was never bracketed. Their finite but wrong outputs escape COR-04's non-finite guard. These are real browser consumers in [FinanceCalculator](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/FinanceCalculator.tsx:2777) and [APR rendering](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/FinanceCalculator.tsx:4524).
- This ceiling predates the patch; the finding is an incomplete COR-05 direct-consumer acceptance condition exposed by newly finite extreme payments, not a claim that the patch introduced the ceiling. New forward/inverse-principal tests cover `100000%`, but inverse-rate/APR tests stop at `1200%`.
- Minimal correction, owner Correctness: explicitly reject an unbracketed solution or extend the bounded solver with finite checks. Add independent repayment/residual checks near and above the current ceiling, including the zero-fee APR reproduction and nonzero fees. Acceptance: reconstruct the supplied payment within documented tolerance or return an explicit supported-range error, never a plausible saturated rate. Confidence: high.

### J3 [P2] BR-01 browser spec fails before download/recovery proof because textarea values normalize CRLF

- Reference: [browser assertion](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/json-csv-resource-limits.spec.ts:22); the consumer assigns `result.csv` to a [textarea](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/JsonToCsvConverter.tsx:374).
- Independently reproduced in installed headless Chromium on an isolated page with network blocked: setting the textarea value to `SYNTHETICPRIVATEFIELD\r\nSYNTHETICPRIVATEVALUE` yields `SYNTHETICPRIVATEFIELD\nSYNTHETICPRIVATEVALUE` from the DOM. The exact `toHaveValue` expectation used in the new spec fails. This is an assertion defect, not a CSV-generation defect.
- Consequence: both configured projects will stop at this assertion before verifying the download and final sentinel assertion, even when conversion is correct. The integrated application spec was not run; the failing browser primitive was reproduced directly without a build.
- Minimal correction, owner Browser Runtime: expect LF in the textarea, and verify CRLF separately in the downloaded CSV bytes. Retain the sparse rejection, successful subsequent conversion, filename, and request-sentinel checks. Acceptance: execute the corrected spec against the fresh integrated build in desktop and mobile, with download-content and responsiveness evidence. Confidence: high.

### J4 [P2] COR-03's documented browser steps disagree with the new single-clamp convention

- References: [new convention](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:9171), [browser age explanation](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/UtilityCalculator.tsx:5143), [API date assumptions](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/apiToolRegistry.ts:1438).
- Reproduced: `calculateAge('2024-02-29', '2025-03-28')` returns `1 year, 0 months, 28 days`. Following the browser instruction to subtract full years first and then full months, with separate month-end clamping, instead reaches March 28 using `1 year, 1 month, 0 days`. The private report and code comment describe one combined month offset, but the browser still instructs the old sequential decomposition. API assumptions omit the clamping rule as well.
- Consequence: users cannot reproduce the displayed calendar components from the displayed method at leap/month-end boundaries. The new helper's chosen convention itself reconstructs correctly; this is a consumer/documentation acceptance gap, not a request to change its mathematics.
- Minimal correction, owner Correctness with UI owner: make browser result steps and corresponding API assumptions describe the same combined-offset clamp and earlier-to-later magnitude convention. Acceptance: browser fixtures for this leap boundary, Jan 29/30/31, reversed dates, and single-offset reconstruction show consistent numbers and explanation. Keep total elapsed days distinct. Confidence: high from source plus direct helper execution; rendered acceptance remains pending.

## Verified And Bounded

- **SEC-01:** inspected package and complete narrow lock diff. Only `fast-uri` and `qs` package records change, to `4.1.3` and `6.16.0`; all-location override tests pass. The DEV publish alias removal is PR-01, not dependency churn. Read the official [fast-uri release](https://github.com/fastify/fast-uri/releases/tag/v4.1.3) and [qs changelog](https://github.com/ljharb/qs/blob/v6.16.0/CHANGELOG.md). No additional package/lock defect found. A worker's earlier zero-audit report is not independent clean-install proof.
- **COR-03/04:** clamped reconstruction, reversal, nested numeric overflow, intentional nulls and actual in-process REST/MCP error contracts pass. Recursive finite checking occurs before shared-runner success, not after JSON serialization. No additional defect found in that boundary.
- **BR-01:** rows, columns, cells and nesting are checked before dense table generation. Sparse byte accounting includes global separators for missing fields, one CRLF per data row, escaped headers/cells, formula prefixes and BOM. Independent exact-cap probes used 256 columns, three irregular rows including an empty row, repeated multibyte/astral/quoted headers and formula-like values. Comma/BOM/protection, semicolon/no-BOM/no-protection, and tab/BOM/protection all accepted exactly **16,777,216 UTF-8 bytes** and rejected one additional ASCII byte. Inputs were 518,429 / 518,816 / 518,429 bytes; only 1,024 cells were constructed per fixture. No billion-cell allocation was attempted. No byte-undercount defect found. These probes are not yet durable repository regression tests.
- **PR-01:** DEV and Reddit subprocess denial tests pass before draft/credential/browser use. Source inspection confirms Bluesky post/profile and Pinterest publish checks precede their normal publishing/session paths. Active-channel denial permutations are not covered by the two subprocess tests. Split rows no longer inherit one shared status: voltage-drop Medium is `needs approval`; wallpaper Pinterest is `unverified`; retained posted claims explicitly remain historical. No new publication or fresh public verification was inferred from the split. Coordinator docs and final queue reconciliation still need completion.

## Executed Evidence

The following focused command ran twice with installed dependencies, last at 12:50:21 AEST: **11 files, 333 tests passed, zero skips, exit 0** (last duration 2.34 s).

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner scripts/lib/security-dependency-overrides.test.mjs src/lib/calculator.numeric.test.ts src/lib/calculator.test.ts tests/api/numericResults.test.ts src/lib/apiToolRegistry.test.ts tests/api/apiRoutes.test.ts tests/api/mcp.test.ts src/lib/jsonToCsv.test.ts scripts/lib/promotion-channel-policy.test.mjs scripts/lib/promotion-public-action-guard.test.mjs scripts/aft-cli.test.mjs
```

Read-only `node --input-type=module -e` probes imported the actual calculator, CSV and policy modules and exercised the reproductions recorded above. A separate installed `@playwright/test` Chromium probe used `page.setContent`, set/read the textarea value, and ran the exact CRLF matcher with a 100 ms timeout; it failed as recorded, then closed the browser. No site or account was opened. Scoped `git diff --check` exited 0 with only LF-to-CRLF advisories. `git rev-parse HEAD`, scoped diffs, numbered source reads and file hashes bound the inspection to current source.

Snapshot fingerprint of the following 21 files: `74fe6c6731623f4d52b029b4299cf2551cfca77c7b564bec0cf576007841bc43`. Algorithm: lexicographically sort the slash-separated paths below; SHA-256 the concatenation of each UTF-8 path, NUL, raw file bytes, NUL. Later modifications invalidate this snapshot, even if HEAD is unchanged.

```text
package.json
package-lock.json
scripts/lib/security-dependency-overrides.test.mjs
src/lib/calculator.ts
src/lib/apiToolRegistry.ts
src/lib/calculator.numeric.test.ts
tests/api/numericResults.test.ts
src/lib/jsonToCsv.ts
src/lib/jsonToCsv.test.ts
tests/json-csv-resource-limits.spec.ts
scripts/lib/promotion-channel-policy.mjs
scripts/lib/promotion-channel-policy.test.mjs
scripts/lib/promotion-public-action-guard.test.mjs
scripts/aft-cli.mjs
scripts/aft-cli.test.mjs
scripts/devto-promotion-agent.mjs
scripts/reddit-publish-profile-post.mjs
scripts/bluesky-promotion-agent.mjs
scripts/bluesky-profile-update.mjs
scripts/pinterest-organic-publisher.mjs
docs/promotion-queue.md
```

## Exact Remaining Gates

Coordinator update received after focused verification: `promotion:four-channel-review` reportedly exited 0 but deleted tracked `public/pinterest/browser-ai-vs-local-ai-privacy.png` as a generator side effect. The coordinator is investigating and restoring the exact blob; the deletion must not enter the release. This update is coordinator-reported, not independently verified by this scoped judge. Confirm restoration and the final source/asset diff before treating that run as complete acceptance evidence. Ask/TTS/EV01 were also reported source-stable; they were not added to this review. All judge-focused tests have finished, so there is no remaining test hold from this judge on coordinator-owned integration gates.

1. Resolve J1-J4 and rerun the focused cases on the resulting source. Complete coordinator-owned PR-01 documentation and reconcile final per-channel rows without elevating historical/private evidence or `needs approval` to permission. Persist edge-case coverage and test guard failures with credentials/network/browser operations mocked; no public test posts.
2. **SEC-01 clean dependency gate:** coordinator-run clean Node 24 `npm ci`, unchanged/reconciled lockfile, `npm audit --json` with zero moderate/high/critical findings, override tests and compatible API/MCP regressions. No install, audit fix or waiver was performed by this judge.
3. **Integrated gate:** on one recorded final source/lock snapshot, fresh `npm run typecheck`, `npm run typecheck:ts6`, `npm test`, `npm run build` and complete `npm run check`. The latter includes the typechecks, tests and build; an uninterrupted full check can provide those component results. Concurrent unrelated workers' earlier results cannot replace this gate. No full suite, install, build or full check was run here.
4. **Browser gate:** `npm run test:smoke` on that build, explicitly including the corrected `tests/json-csv-resource-limits.spec.ts` in both desktop/mobile projects. Obtain dated functional/screenshots for numeric month-end/leap/reversed cases, tiny-rate and extreme-supported finance results/errors, and JSON rejection/recovery/download/responsiveness. The isolated textarea probe is not integrated browser proof.
5. **Task-specific report gates:** COR-04 `npm run aft -- api-ready` and `npm run aft -- mcp-smoke`; PR-01 `npm run promotion:four-channel-review` and `npm run marketing:orchestrate`, evaluated against the final four-channel policy and completed docs. Missing/failed/stale evidence must not be described as passing. These report-generating commands were not run by this report-only judge.
6. **Release gate, only after the above:** independent re-judgement of selected tasks and dependencies on the exact proposed release revision, plus explicit authority for live writes. Deployment/public proof remains pending: Node 24/Astro 7 build identity, `npm run hostinger:status`, exact deployed revision, applicable `npm run check:live-ask` / `npm run check:production-sitemap`, and public functional proof for changed surfaces. Discovery submissions, if warranted, need their own authorized changed-URL scope. No deployment or public action is authorized by this report.

Only this report was authored. No application edits, campaign/global statuses, approvals, worklogs, dependency installs, commits, publishing, outreach, paid calls or production mutations were made. Ask/TTS/evidence/Clarity changes remain outside this review; passing the selected handler tests does not approve those concurrent edits.
