# R1 Rounding Fix: Independent Re-Judge

Date: 2026-09-06, 13:42-13:45 AEST. **Verdict: R1 resolved; approve the bounded numeric fix and its regression coverage. No remaining hard defect was found in this scope.** Browser acceptance remains pending with Zeno. This is not approval of the full batch, campaign, integration snapshot, or release.

Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`. Observed HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, plus uncommitted changes. Runtime: Node `v24.20.0`, Vitest `4.1.10`. Inspected the payment helper, its nonnegative-rate callers, inverse/APR validation and solver, new numeric tests, and the focused existing numeric API cases. Prior J1/J3/J4, Ask, evidence, TTS, transcriber, and unrelated work were not re-judged.

## Findings

- The [payment floor](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:4660) enforces `payment >= principal / paymentCount` for the supported nonnegative-rate model. It corrects forward rounding at its source. The exact zero-rate branch remains; inverse lower-bound validation, exact zero-payment equality, residual tolerance, finite checks and the 19200-percent ceiling remain intact. No broad inverse tolerance was introduced.
- The exact prior failure now succeeds: principal `100000`, annual rate `1e-16` percent, term `0.25` years, fees `0` produces payment `33333.333333333336`, equal to `100000 / 3`. Both actual-payment inverse rate and zero-fee APR return `0`; total interest is `0`. The former `assert.doesNotThrow` reproduction now exits 0.
- The [80 composition cases](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.numeric.test.ts:128) meaningfully close the test gap: they feed actual forward payments into both inverse/APR consumers, cover four principal scales and five short payment counts, require the payment floor and finite nonnegative solved rates, and check an independent discounted-payment residual using relative error. The near-zero rate tolerance permits convergence to zero, which is appropriate here; the strict floor and relative residual prevent an absolute tolerance from concealing failures at tiny principal scales.
- The [12 insufficient-payment cases](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.numeric.test.ts:146) each check three relative shortfalls, for 36 rejection assertions. Existing ordinary-rate, Canadian-payment, fee-adjusted APR, supported-ceiling, above-ceiling and tiny-principal bracket tests still pass. Coverage is adequate for R1; no additional numeric task is requested.

## Independent Evidence

Executed offline with installed dependencies and caching disabled:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner --no-cache src/lib/calculator.numeric.test.ts -t 'COR-05 stable loan annuity' --reporter=dot
node node_modules/vitest/vitest.mjs run --configLoader runner --no-cache tests/api/numericResults.test.ts -t 'stable COR-05 mortgage payment' --reporter=dot
```

Results: **189 annuity tests passed**, 20 unrelated calendar cases filtered/skipped, exit 0 at 13:42:59 AEST; **four focused REST/MCP mortgage cases passed**, 44 other cases filtered/skipped, exit 0 at 13:43:00 AEST. Total: **193 selected tests passed**, including all 92 new R1 tests. These counts do not claim an independent rerun of the worker's reported 257-test numeric/API run or its reported red phase.

Exact original reproduction, independently executed with additional assertions for payment equality and zero inverse/APR results:

```powershell
node --input-type=module -e 'import assert from "node:assert/strict"; import {calculateAprEstimate} from "./src/lib/calculator.ts"; assert.doesNotThrow(()=>calculateAprEstimate({principal:100000,annualRatePercent:1e-16,years:0.25,fees:0}));'
```

Additional in-memory `node --input-type=module -e` probes imported the actual calculator module and asserted:

- **672 near-zero calls passed:** the original 560-call matrix plus 112 calls at principal `1e-12`. Principals: `0.01, 1, 1000, 100000, 1e12, 1e-12`; payment counts: `1, 2, 3, 12, 120, 360, 1200`; annual percentage rates: `0, 1e-20, 1e-18, 1e-16, 1e-14, 1e-12, 1e-10, 1e-8`; both inverse and zero-fee APR. Every forward payment met the zero-rate floor. Every solved rate was finite and nonnegative; exact zero inputs returned zero.
- The independent oracle summed discounted unit payments rather than reusing the production closed form. Maximum relative payment residual was `4.0251005651510125e-14`, below the probe's `1e-12` limit. Maximum recovered-rate error was `1.9161639355869155e-13` percentage points, below `1e-8`.
- **126 insufficient payments rejected:** all six principal scales and seven payment counts, with relative shortfalls `1e-8`, `0.01` and `0.5`. The floor does not make underpayment an accepted inverse solution.
- **30 ceiling checks passed:** actual forward payments at `19199, 19200, 19200.01, 20000, 100000` percent, for one payment, 30 years and 100 years, through inverse rate and zero-fee APR. Supported-edge results recovered the rate; above-ceiling inputs retained the explicit supported-range error.

Scoped `git diff --check` exited 0 with only an LF-to-CRLF advisory. All test/probe processes completed. No filesystem source/test mutation was used for reproductions.

## Approval Limits

**Missing acceptance, not a confirmed R1 defect:** Zeno's desktop/mobile inverse/APR result, range-error and recovery acceptance is still pending and was not read, run or marked passed here. Earlier reported integration/full-check/smoke results are not substituted for that new browser acceptance. No install, full suite, typecheck, build, full check, browser/server, provider/network call, publishing, or deployment was performed by this judge. No new broad task was created.

This report supersedes only the open R1 numeric finding in `implementation-batch-one-rejudge.md`; that historical report and all other approval limits remain untouched. No campaign, worklog, application, test or approval-row edit was made. The only authored file is `agents/project-review-2026-09-06/reports/rounding-fix-rejudge.md`.

## Source Identity

The following hashes were captured before and after focused execution. Combined SHA-256 at 13:44:20 AEST: `2359f6ae8c81c4ccfe7c127abe3a49ef311dde737b53143b2c6c9b3b5bb0ac0b`. Algorithm: sort slash-separated paths; hash UTF-8 path, NUL, raw file bytes, NUL for each file. This report is excluded.

| File | SHA-256 |
| --- | --- |
| `src/lib/calculator.numeric.test.ts` | `4390d2ae9b1a2c14776e012b29531e5e1daf22b317af9b297303255f5aeaa890` |
| `src/lib/calculator.ts` | `9bb0cbf25b273841fb8886a2c66d685c6aef050fb8745d2d6077111d96a20848` |
| `tests/api/numericResults.test.ts` | `a586f181998e8fcb7be9d39c1ad543a96f815da777cf97538b3da2d476f7e70c` |
