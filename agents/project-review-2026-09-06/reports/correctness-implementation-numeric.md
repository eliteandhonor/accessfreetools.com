# COR-03, COR-04, COR-05 Numeric Implementation Evidence

Date: 2026-09-06. Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`.
Branch: `codex/gpt6-review-implementation`. HEAD observed during verification: `243d71d1d832b398cba86d5c7fcc70deefa25f25`.
The earlier review's `90d6dcab0580a91ca66382f2414d95e8817469e5` is historical, not the implementation worktree revision observed here.

Implementation and local test evidence only. No self-approval, production claim, campaign status change, or release claim. The coordinator and Release Judge retain their acceptance gates.

## Ownership And Inspection

Source changes are limited to `src/lib/calculator.ts` and `src/lib/apiToolRegistry.ts`. New regression files are `src/lib/calculator.numeric.test.ts` and `tests/api/numericResults.test.ts`. This report is the only other file authored by this worker.

Read root/campaign AGENTS, campaign correctness task definitions and COR-03/04/05 manifest conditions, `reports/correctness.md`, `docs/ask-api-mcp-alpha.md`, and the installed TDD skill. Inspected the existing calculator and registry tests, REST/MCP tests, `src/pages/api/v1/run/[slug].ts`, `src/pages/mcp.ts`, `src/lib/aftMcpServer.ts`, `src/lib/apiHttp.ts`, the age/date branches of `src/components/UtilityCalculator.tsx`, package test definitions, and direct shared-payment consumers.

Existing and concurrent changes outside this ownership were preserved. No edits to Ask routing, HTTP policy, MCP/route source, package files, global campaign files, or correctness worklog. No commits, dependency installs, builds, deployments, publishing, or live service calls were performed by this worker.

## COR-03: Calendar Decomposition

- Implementation: [shared interval helper](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:9170), [age consumer](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:9334), [date-difference consumer](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:9373).
- Convention: orient the interval from earlier to later; choose the greatest whole-month offset whose clamped date does not exceed the later date. Apply `years * 12 + months` as ONE offset from the original earlier date, then add remaining UTC days. Split months into nonnegative years and 0-11 months. This matches `calculateDateShift`; independently clamping years and then months is not the reconstruction convention.
- Reversed date differences retain `direction: backward` and positive magnitudes. Age still rejects an as-of date before birth. Total elapsed days and the existing next-birthday calculation remain separate.
- Confirmed result for Jan 31 to Mar 1, 2026: age `0 years, 1 month, 1 day`; date difference `calendarYears: 0, calendarMonths: 1, calendarDays: 1, days: 29`. Leap-year Jan 31 to Mar 1 has the same components and 30 total days.
- [Regression evidence](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.numeric.test.ts:24): 17 explicit interval fixtures, 1,284 generated intervals over leap/non-leap calendars, reconstructed later dates, nonnegative components, reversed intervals, same-day values, Jan 29/30/31, and Feb 29 birthdays. A Feb 29 birthday reaches one year on Feb 28 in a non-leap year under this convention.
- [REST/MCP evidence](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/numericResults.test.ts:120): actual in-process handlers serialize the corrected calendar components for forward, reversed, and leap-year fixtures.
- Confidence: high for tested helper and handler behavior. Browser source directly interpolates the corrected fields, but rendered/browser acceptance remains unproven. Existing age explanation copy describes years/months subtraction without spelling out the single-clamp convention; a UI owner may clarify that copy, outside this worker's ownership.

## COR-04: Non-Finite Result Boundary

- Implementation: [recursive numeric invariant](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/apiToolRegistry.ts:1473) runs on `run.result` after calculation and before `runApiTool` returns success. It traverses object/array values and throws on numeric `NaN`, `Infinity`, or `-Infinity`.
- Error: `Tool result exceeds the supported numeric range. Try smaller inputs.` No formatted-answer string matching or conversion to null is used. Intentional nulls and nonnumeric values are preserved.
- Existing, unmodified REST handling returns HTTP 400 with `ok: false` and a message, without `run`. Existing MCP handling returns HTTP 200 for the protocol response with tool `isError: true` and the error text.
- [Regression evidence](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/numericResults.test.ts:45): positive/negative basic multiplication overflow, percentage overflow, true mortgage overflow, nested object/array non-finite values, and nested intentional nulls. Real successful baking-pan output retains `scaledServings: null`; a finite `1e308` basic result stays successful. Successful warnings, inputs, assumptions, steps, tool URL, and guide URL are compared with the direct runner.
- The mortgage overflow fixture uses `homePrice: 1e308`, `annualRatePercent: 100000`, and 30 years: the actual payment is unrepresentable. The historical `principal: 100000`, rate `100000` fixture now computes a finite payment after COR-05, so it is separately tested as a legitimate success rather than forcing an unnecessary rejection.
- Confidence: high for the shared JSON-like result boundary and tested in-process transport contracts. This is not a general serializer, cyclic-object, or custom `toJSON` compatibility guarantee.

## COR-05: Stable Loan Payments

- Implementation: [shared payment helper](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:4652) now computes `principal * (r / -expm1(-n * log1p(r)))`. It retains the exact zero-rate branch, avoids subtracting nearly equal growth values, and avoids positive-exponent growth overflow. Dividing before multiplying by principal also avoids an unnecessary intermediate underflow near zero.
- [Inverse principal](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:4696) uses the corresponding stable discounted factor. [Canadian frequency conversion](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:7374) uses `expm1(log1p(annualRatePercent / 100 / 2) * 2 / paymentsPerYear)` without changing semiannual compounding or payment-count conventions.
- Direct helper callers reviewed: `calculateLoanPayment`, `calculateInterestRateFromPayment`, `solveRateForPayment` (via APR), and `calculateCanadianMortgage`. Inverse-rate search bounds and stopping rules were not expanded. Mortgage and loan summaries are tested through their existing public helpers; mortgage is the registered API loan calculation, not a newly invented standalone loan endpoint.
- [Independent reference](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.numeric.test.ts:8): sum the discounted value of each unit payment in a loop and divide principal by that sum. This does not copy the closed-form production formula. It remains a binary64 reference, not an arbitrary-precision oracle.
- [Regression evidence](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.numeric.test.ts:91): zero and logarithmically spaced rates from `1e-16` to `1e-6`, ordinary rates, `1200`/`100000` percent, one-payment/30-year/100-year terms, principal reconstruction, inverse rate, APR with zero/nonzero fees, and Canadian 12/24/26/52 payments per year. Existing currency-precision calculator fixtures also pass.
- Payment-reference tolerance: absolute `1e-9` or relative `1e-11`, whichever is larger. Repayment/interest tolerance: `1e-7` for the tested principal of 100000. Inverse principal tolerance: `1e-6`. Near-zero continuity also uses the first-order limit `P/n * (1 + r*(n+1)/2)`.
- Confirmed reproduction after fix: `calculateLoanSummary(100000, 1e-12, 30)` returns payment `277.77777777781955`, total paid `100000.00000001503`, and total interest `1.5032128430902958e-8`. Previously payment was about `260.62497843587596`, with interest about `-6175.00776308465`.
- Confidence: high for tested numerical ranges and callers. No independent validation of tax rules, financial advice, every downstream finance formula, or inverse rates beyond existing solver bounds is claimed.

## Executed Tests

Commands ran from the implementation worktree using its installed dependencies. Focused REST/MCP tests call real handlers with local Request objects; `fetch` is stubbed to throw and verified unused. Request IDs/client identifiers isolate rate buckets, and token setup is test-only.

| Phase / exact command | Outcome |
| --- | --- |
| COR-03 RED: `node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.numeric.test.ts` | Exit 1: 13 failed, 6 passed. Reproduced negative days and reconstruction errors before source edits. |
| COR-03 GREEN: `node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.numeric.test.ts src/lib/calculator.test.ts` | Exit 0: 2 files, 154 tests passed. |
| COR-04 RED: `node node_modules/vitest/vitest.mjs run --configLoader runner tests/api/numericResults.test.ts` | Exit 1: 15 failed, 13 passed. Confirmed REST 200/MCP absent `isError` on overflow before boundary fix. |
| COR-04 GREEN: `node node_modules/vitest/vitest.mjs run --configLoader runner tests/api/numericResults.test.ts src/lib/apiToolRegistry.test.ts tests/api/apiRoutes.test.ts tests/api/mcp.test.ts` | Exit 0: 4 files, 63 tests passed. |
| COR-05 RED: `node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.numeric.test.ts tests/api/numericResults.test.ts -t COR-05` | Exit 1: 34 failed, 37 passed. The name filter excluded 47 other tests; none were disabled in source. |
| Combined GREEN: `node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.numeric.test.ts src/lib/calculator.test.ts tests/api/numericResults.test.ts src/lib/apiToolRegistry.test.ts tests/api/apiRoutes.test.ts tests/api/mcp.test.ts` | Exit 0: 6 files, 288 passed, no skips; 599 ms. Includes all 135 existing broad calculator tests, 86 new calculator tests, and 32 new numeric API tests. |
| Full repository: `npm.cmd test` | Exit 1: 68 files passed, 6 failed; 960 tests passed, 65 failed; 85.26 s. Snapshot taken while other workers were editing their areas. |
| `npm.cmd run typecheck` | Exit 0. |
| `npm.cmd run typecheck:ts6` | Exit 0. |
| `git diff --check -- src/lib/calculator.ts src/lib/apiToolRegistry.ts` | Exit 0; only Git's LF-to-CRLF advisory, no whitespace errors. |

Additional read-only proof: `git status --short --branch`, `git rev-parse HEAD`, source/test `rg` and PowerShell reads, and a `node --input-type=module -e` harness invoking age, date difference, tiny/high-rate loans, inverse principal, and Canadian mortgage. Observed outputs are recorded above. An initial search guessed `scripts/agent-cli.mjs`, which does not exist; package definitions supplied the smoke/build coupling instead. No agent CLI command was executed.

The full-suite failures at that snapshot were in these unowned, concurrently edited test files. They were not fixed or independently diagnosed by this worker and must not be read as a completed cross-worker regression review:

| Test file | Failed |
| --- | ---: |
| `scripts/lib/promotion-channel-policy.test.mjs` | 5 |
| `scripts/lib/new-tool-growth-pilot-report.test.mjs` | 12 |
| `scripts/lib/search-console-inspection-reports.test.mjs` | 11 |
| `scripts/lib/promotion-public-action-guard.test.mjs` | 2 |
| `tests/api/askToolRouter.test.ts` | 12 |
| `src/components/BrowserTtsLifecycle.test.ts` | 23 |

## Missing Acceptance Proof

- COR-03/05 browser rendering, interaction, screenshot, and functional smoke evidence remain outstanding. `npm run test:smoke` starts with `npm run build`, so it was intentionally not run under the explicit no-build instruction. Static inspection of UI interpolation is not browser proof.
- COR-04 `npm run aft -- api-ready` and `npm run aft -- mcp-smoke` report gates were not run; no additional report artifacts outside this ownership were generated by this worker. In-process REST/MCP assertions do not replace these gates or prove live HTTP/server-adapter behavior.
- A clean full-suite rerun after other workers finish, campaign acceptance review, and Release Judge approval remain outstanding. No build, deploy, or production verification is claimed.
- Minimal remaining handoff: coordinator/browser owner verifies the date text and tiny-rate finance flows, reruns the campaign's allowed gates after integration, and submits exact evidence to the Release Judge. This report does not mark COR-03/04/05 approved.
