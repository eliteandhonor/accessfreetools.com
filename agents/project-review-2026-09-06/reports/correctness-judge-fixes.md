# J2 And J4 Correctness Judge Fixes

Recorded 2026-09-06, 13:03 AEST. Implementation evidence only, not self-approval or release approval.

Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`.
Branch verified: `codex/gpt6-review-implementation`.
Observed HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, plus existing and new uncommitted changes.
Runtime: Node `v24.20.0`, installed Vitest `4.1.10`.

## Scope And Preservation

Read root/campaign AGENTS, `implementation-batch-one-judge.md`, `correctness-implementation-numeric.md`, correctness worklog, `docs/brand-code.md`, `docs/writing-quality-system.md`, and `docs/ask-api-mcp-alpha.md`. Applied installed TDD, writing, Git, browser-testing, and provenance-hygiene guidance within the owner's restrictions. Inspected both rate solvers, payment helper and callers, calendar helper/consumers, existing focused tests, and Vitest/Playwright configuration.

Only these source/test paths were edited:

- `src/lib/calculator.ts`: J2 inverse-rate and APR solver path only.
- `src/lib/calculator.numeric.test.ts`: J2 boundary/residual cases and the J4 leap fixture.
- `src/lib/apiToolRegistry.ts`: J4 date assumptions and steps only.
- `tests/api/numericResults.test.ts`: J4 actual in-process REST/MCP assertions.
- `src/components/UtilityCalculator.tsx`: age/date result explanation strings only, including date-shift reconstruction wording.
- NEW `tests/calendar-convention.spec.ts`: focused J4 browser assertions.

This report and an appended correctness worklog entry are the only documentation edits. Existing forward-payment, inverse-principal, Canadian-payment, calendar-helper and recursive finite-result patches were preserved. A diff against HEAD includes those earlier workers' changes; they are not new work from this assignment. `tests/numeric-regressions.spec.ts` was read but never edited. Coordinator-owned J1/J3, Clarity, dependency, campaign/global, and other workers' files were not edited or restored by this worker.

## J2: Explicit Bounded Solver

Confirmed consequence before the fix: a finite payment requiring more than the solver's upper rate could produce the plausible but wrong 19200% ceiling. Fee-adjusted APR could do the same even when the nominal input rate was within the supported interval. Confidence: high from failing regression tests against actual helpers.

- [Inverse consumer](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:5109) now uses the [existing APR solver](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:6570). This puts both affected callers behind the same bounded validation without introducing a separate abstraction or changing forward-payment mathematics.
- The existing effective maximum monthly rate of 16 is explicit. Expansion takes at most four doublings from 1, followed by 100 bisections. The upper payment must be finite and bracket the requested payment before bisection.
- Above-range inputs throw `Required rate exceeds the supported rate range of 0% to 19200% per year.` They no longer return a saturated success. Exact ceiling solutions remain supported.
- Non-finite endpoint, midpoint, or reconstruction values throw `Rate calculation exceeds the supported numeric range. Try smaller inputs.` A conservative rejection of a non-finite bracket endpoint is intentional even when another numerical strategy might recover a solution.
- Every accepted nonzero rate reconstructs payment within `max(1e-9, payment * 1e-11)` in input currency units. The zero-rate shortcut requires exact equality with the zero-rate payment; it cannot bypass bracket validation simply because the principal is tiny.
- [Independent tests](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.numeric.test.ts:128) sum discounted unit payments rather than copy the production closed form. Supported 19199% and 19200% cases cover one payment, 30 years, and 100 years, checking recovered rates and reconstructed payments. Rejection cases cover 19200.01%, 20000%, and the judge's 100000% reproduction. Separate APR cases explicitly exercise zero and nonzero fees, so an inverse-rate assertion cannot hide an APR failure.
- Fee fixtures at 19000% check 0/1/500 fees with independent residuals and reject 1100/50000/99999 fees that push APR above the bound. Principal scaling at `1e-12` and `1e12`, plus a non-finite endpoint case at `1e308`, covers scale-sensitive shortcuts and explicit numerical rejection.

Minimal task addressed: J2 / COR-05 direct-consumer correctness. Demonstrated local acceptance: supported rates reconstruct, unbracketed rates explicitly fail, and no arbitrary ceiling success escapes the solver. This is not a broader finance-policy review or financial guidance.

## J4: One Calendar Convention

Confirmed consequence before the fix: browser steps described subtracting years then months, whereas the helper applies one combined offset from the original earlier date. API text omitted the rule. The calendar mathematics was not changed by this assignment. Confidence: high for helper, source copy, and in-process API evidence; rendered browser acceptance remains pending.

- [Age steps](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/UtilityCalculator.tsx:5142), [date steps](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/UtilityCalculator.tsx:5189), and [API assumptions/steps](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/apiToolRegistry.ts:1438) now explain the same method: use the largest whole-month offset that does not pass the later date, apply it once from the earlier date, and use the target month's last day if the original day is missing. Split that offset into years/months, then count remaining days.
- Reversed date inputs retain the same nonnegative magnitude, with direction reported separately. Total elapsed UTC days are counted separately from calendar components. Age still requires birth on or before the as-of date.
- [Date-shift wording](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/UtilityCalculator.tsx:5171) explicitly combines `years * 12 + months` into one offset before weeks/days. No component layout, inputs, helper math, or unrelated copy was refactored.
- The leap fixture `2024-02-29` to `2025-03-28` remains **1 year, 0 months, 28 days**, with **393 total days**. The combined 12-month shift reaches 2025-02-28; adding 28 days reaches 2025-03-28. A 13-month offset from the original leap date would reach 2025-03-29 and is too large.
- [REST/MCP fixtures](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/numericResults.test.ts:68) cover that leap interval plus Jan 29/30/31 to Mar 1, in both input orders. They assert exact explanation strings, independent expected numbers/direction/elapsed days, and single-offset reconstruction through `calculateDateShift`. Existing network stubs remain active and assert no fetch use.
- [New browser spec](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/calendar-convention.spec.ts:24) has four fixtures in both desktop/mobile projects. Each checks age, forward/reversed differences, total-day separation, displayed formula text, and reconstruction through the actual date-shift controls. Age and reversed-date screenshots are attached when executed. External requests are blocked and analytics requests intercepted.

Minimal task addressed: J4 / COR-03 explanation parity. Local numeric/API acceptance is demonstrated. Browser collection is demonstrated, not rendered acceptance.

## Exact Red/Green Evidence

All commands ran in the worktree above with already installed dependencies. Times are AEST on 2026-09-06. No tests were disabled in source.

### RED, 12:58:33

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.numeric.test.ts tests/api/numericResults.test.ts --reporter=dot
```

Exit 1: **28 failed, 128 passed, 156 total**, two files, 584 ms. Before source edits. Nine inverse-rate over-bound cases and three fee-driven APR cases did not throw; 16 REST/MCP fixtures lacked the required explanation.

### RED Expansion, 12:59:17

The same exact command after splitting out six explicit above-bound APR cases, still before source edits: exit 1, **34 failed, 128 passed, 162 total**, two files, 576 ms. This independently reproduced the judge's zero-fee APR failure as well as nonzero-fee saturation.

### GREEN, 13:00:24

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.numeric.test.ts src/lib/calculator.test.ts tests/api/numericResults.test.ts src/lib/apiToolRegistry.test.ts tests/api/apiRoutes.test.ts tests/api/mcp.test.ts --reporter=dot
```

Exit 0: **332 passed across six files, zero failures/skips**, 640 ms.

### RED Scale Check, 13:01:21

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.numeric.test.ts --reporter=dot
```

Exit 1: **1 failed, 116 passed, 117 total**, 376 ms. The newly added `1e-12` principal case exposed the first implementation's absolute-tolerance zero shortcut returning 0 instead of 19199%. The fix requires exact zero-payment equality before that shortcut. The paired `1e12` and non-finite endpoint cases already passed.

### Final GREEN, 13:01:33

The exact six-file GREEN command above: exit 0, **335 passed across six files, zero failures/skips**, 658 ms. This is the final source/test run for this worker. No test or source process remained running when source stability was announced to the coordinator.

### Browser Collection Only

```powershell
node node_modules/@playwright/test/cli.js test tests/calendar-convention.spec.ts --list
```

Exit 0: **8 collected tests in one file**, four desktop and four mobile. No app browser execution or screenshot capture was performed. `Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in @(4328, 4321, 8765) } | Select-Object LocalAddress, LocalPort, OwningProcess` showed no site listener on 4328/4321; only the local provenance service on 8765. No preview or dev server was started.

### Diff And Copy Inspection

```powershell
git diff --check -- src/lib/calculator.ts src/lib/calculator.numeric.test.ts src/lib/apiToolRegistry.ts tests/api/numericResults.test.ts src/components/UtilityCalculator.tsx tests/calendar-convention.spec.ts
```

Exit 0, only LF-to-CRLF working-copy advisories. Read-only source diff inspection confirms the UtilityCalculator change is limited to the three age/date explanation arrays.

The existing `analyzeWritingText` technical-mode library was invoked directly on the 11 unique changed explanation/error strings: **pass, 0 hard errors, 0 warnings**, 149 words/15 sentences/11 paragraphs. The report-generating CLI was intentionally not run because its shared `output/writing-quality/latest.*` files are outside this worker's ownership.

The already running local provenance service returned HTTP 200 for `/health` and `/inspect`. Scope: one supported text payload containing those 11 strings, zero errors/unsupported payloads, not a repository-wide scan. It reported **0 suspicious Layer A marks**. A low-confidence informational cadence notice is not a confirmed removable mark. No cleaning, sibling files, statistical rewrite, or disclosure removal was performed; no human-origin or undetectability claim is made.

## Source Fingerprint And Handoff

At 13:02:58 AEST, the following six source/test files had combined SHA-256 `ed25b060f7ed43a15e0fe40d617522e7fde9c2c7f15fa0f8566a4d62defb82b7`.
Algorithm: lexicographically sort slash-separated paths; hash each UTF-8 path, NUL, raw file bytes, NUL in sequence. Report/worklog files are excluded.

| File | SHA-256 |
| --- | --- |
| `src/components/UtilityCalculator.tsx` | `1f8c2d5085015a44a8236ea474e3ff72cb5845632cad38f45e697652e8a7d4d9` |
| `src/lib/apiToolRegistry.ts` | `fc220b64902373ecc6e9bff1834ed50b01b8023326ab8af6e63e3fc50b45b792` |
| `src/lib/calculator.numeric.test.ts` | `6fee300d4370280708b7a510ca5b4484668e03353bc80061c6a06d1d121fd5e8` |
| `src/lib/calculator.ts` | `e906d4b333be54a8158273f6be41b9aaad4f50025c02a93e6fd49e9ca90fd768` |
| `tests/api/numericResults.test.ts` | `a586f181998e8fcb7be9d39c1ad543a96f815da777cf97538b3da2d476f7e70c` |
| `tests/calendar-convention.spec.ts` | `134b83bba6f6b0563bb983297d6e8b4c5803529647edb1cf72a72427bb49e3e8` |

Source stability was announced to the coordinator after the final green run and before report completion. Coordinator may proceed with clean `npm ci` and full integration. This worker will not run new builds/full checks or hold a dependency/test process open.

Remaining coordinator/judge gates: clean dependency installation and integrated checks on one final snapshot; execute the new calendar browser spec and coordinator-owned numeric finance coverage against the fresh build, including explicit inverse/APR range errors; inspect screenshots; required API/MCP reports; independent re-judgement. Collected browser assertions have not yet earned acceptance. J1/J3 and Clarity results are coordinator-reported and were not independently tested here.

No install, full suite, typecheck, build, full check, preview/dev server, deploy, commit, campaign/global mutation, public action, or self-approval was performed by this assignment.
