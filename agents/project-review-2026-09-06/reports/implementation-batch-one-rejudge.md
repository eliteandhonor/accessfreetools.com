# Implementation Batch One: Independent J1-J4 Re-Judge

Date: 2026-09-06, AEST. **Verdict: request changes for one remaining P2 correctness defect in J2's near-zero composition.** J1, J3 and J4's specific corrections are accepted within this review. J2's upper-bound saturation is fixed, but its full requested acceptance is not complete. This is not approval of the campaign, PR-01/COR/BR tasks as a whole, dependencies, or any release.

Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`. Branch: `codex/gpt6-review-implementation`. HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, plus uncommitted changes. Independently observed runtime: Node `v24.20.0`, installed Vitest `4.1.10`. HEAD alone does not identify this review's source.

Read root/campaign AGENTS, the three requested reports (`implementation-batch-one-judge.md`, `promotion-boundaries-implementation.md`, `correctness-judge-fixes.md`), brand guidance, focused source/callers/tests, and Vitest/Playwright configuration. Used the code-review-and-quality skill. Only J1-J4 and the generator PNG-preservation correction were judged. Ask, evidence-processing behavior, TTS, Clarity, transcriber, dependency remediation, campaign statuses, and publication readiness remain outside scope.

## Remaining Hard Defect

### R1 [P2] J2 rejects its own supported tiny-rate payment instead of converging to zero

- References: [forward payment arithmetic](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:4658), [inverse lower-bound check](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:5105), [solver lower-bound check](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:6582), [APR composition](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:6976).
- Exact reproduction: principal `100000`, annual rate `1e-16` percent, term `0.25` years (three payments), fees `0`. `calculateLoanSummary` returns payment `33333.33333333333`; the zero-rate payment is `33333.333333333336`. The difference is `-7.275957614183426e-12`, one floating-point step. Feeding the generated payment to `calculateInterestRateFromPayment` throws `Monthly payment is too low to repay the principal within this term`. Calling `calculateAprEstimate` directly with the same principal/rate/term and zero fees throws `Payment is too low to repay the principal within this term`.
- Cause: `expm1`/`log1p` avoid the original cancellation, but the final multiply/divide can round a nonnegative-rate payment below `principal / periods`. Both strict lower-bound checks reject that representational difference before the residual tolerance can help. The new APR check turns this small rounding difference into a hard failure. This is not an above-range input or a request to recover an unrepresentable tiny rate exactly; a convergent zero result is sufficient.
- Consequence: valid tiny positive APR inputs fail, and the forward/inverse helpers disagree. The real consumers are [APR](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/FinanceCalculator.tsx:4524), [loan solve-rate](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/FinanceCalculator.tsx:2777), and [interest-rate](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/FinanceCalculator.tsx:5014). The browser's error handling is source-inspected, not independently executed here. Ordinary-rate accuracy is not alleged to fail.
- Test-quality cause: the [forward matrix](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.numeric.test.ts:93) includes `1e-16` but only one-payment/30-year/100-year terms; it allows small negative total-interest roundoff. The [inverse/APR matrix](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.numeric.test.ts:115) starts its positive rates at `1e-12` and uses only 100 years. It does not compose actual forward payments with both inverse callers across short terms. The passing browser fixture tests only a forward loan at `1e-12` and 30 years.
- Minimal task, owner Correctness: enforce the nonnegative-rate payment floor in stable forward arithmetic, or use an equivalently precise, scale-aware lower-bound treatment in the affected composition. Do not restore a broad absolute zero shortcut that bypasses the upper bracket for tiny principals. Add the exact reproduction, several short terms and principal scales, and genuine below-zero-payment rejection cases.
- Acceptance: both affected callers accept the actual forward-generated tiny-rate payments with a finite near-zero result and an independently checked payment residual. Preserve rejection of materially insufficient payments, all above-ceiling inverse/APR cases, and the `1e-12`-principal bracket regression. Confidence: high; independently reproduced twice, including an assertion that exits 1.

Exact offline failing assertion, executed with installed Node 24:

```powershell
node --input-type=module -e 'import assert from "node:assert/strict"; import {calculateAprEstimate} from "./src/lib/calculator.ts"; assert.doesNotThrow(()=>calculateAprEstimate({principal:100000,annualRatePercent:1e-16,years:0.25,fees:0}),"A supported tiny nonnegative note rate must converge to zero-fee APR, not fail repayment validation");'
```

Actual result: exit 1, `AssertionError [ERR_ASSERTION]`, caused by `Payment is too low to repay the principal within this term` at `calculator.ts:6583`. A bounded exploratory matrix of five principal scales, seven payment counts and eight zero/tiny rates exercised both callers: 530 calls accepted and 30 calls hit this lower-bound failure. Those 30 are instances of R1, not 30 separate defects.

## Corrections Verified

| Item | Scoped Decision | Evidence And Test Quality |
| --- | --- | --- |
| J1 exact channel labels | Resolved | `promotion-channel-policy.mjs:80` now accepts strings only and normalizes only case/whitespace; explicit IDs/aliases use equality. Unknown punctuation/Unicode is retained and rejected. Policy tests cover original Unicode/punctuation/array reproductions, null/object/number inputs, the public guard, row filtering, and legitimate aliases. The actual CLI fixture proves that approved/release-ready exact active rows are candidates, while needs-approval rows remain separate and mixed/inactive rows are excluded. Twelve additional invalid values, including zero-width/null characters and fullwidth lookalikes, were independently rejected; five aliases passed. |
| J1 generator PNG preservation | Resolved | The blanket public-PNG deletion loop and removal imports are gone. Current writes generate known public JPEGs and the named avatar, not arbitrary article PNGs. The mocked filesystem/browser test executes the real generator, verifies no `rmSync` calls, and proves generation was not simply disabled. Current `public/pinterest/browser-ai-vs-local-ai-privacy.png` and HEAD both have Git blob `7ce0556a28f0cd27f9d41a4541eb5e1dd78e7c23`. No real generator or public write ran during this review. |
| J2 upper-bound rejection | Resolved for the original saturation reproduction | Both consumers use the same bounded solver. The upper payment must be finite and bracket the target before 100 bisections; accepted nonzero solutions undergo the stated residual check. Existing independent discounted-payment tests cover 19199/19200 percent, multiple terms, above-bound inputs, fee-driven crossings, tiny/large principals, and numerical rejection. Thirty additional forward-to-inverse/zero-fee-APR checks passed for 19199/19200/19200.01/20000/100000 percent across one payment, 30 years and 100 years. Required rates above 19200 percent now throw instead of returning a plausible ceiling. R1 prevents accepting the whole near-zero requirement. |
| J3 textarea/download fixture | Resolved | `tests/json-csv-resource-limits.spec.ts:24` expects LF in the textarea; line 31 verifies CRLF in the actual downloaded file, separately from its filename. The test still rejects sparse expansion, checks no download control while invalid, converts a second input, clears the error, and checks request sentinels. The consumer downloads `result.csv` through a Blob, not normalized textarea text. This is a corrected assertion with meaningful downstream checks, not a relaxed CSV contract. Coordinator evidence records both viewport executions passing. |
| J4 calendar copy and endpoint consistency | Resolved within the exposed date paths | Age, forward/reversed date differences and date-shift steps consistently describe one combined month offset and one target-month clamp; total UTC elapsed days remain separate. The registered date API uses that same helper and explanation. Sixteen actual in-process REST/MCP fixture cases passed for the leap boundary and Jan 29/30/31 in both input orders. The browser spec checks exact components, direction, total days, explanatory text and reconstruction through real shift controls, with hydration awaited. The corrected leap golden result remains `1y 0m 28d`, 393 days. Eight coordinator browser cases passed. |

Additional J4 numeric cross-check: 3,471 intervals spanning 1900, 2000, 2024, 2026 and 2100 passed independently constructed target-month anchors, maximality (the next month must overshoot), remainder days, age/date reversal parity, and actual date-shift reconstruction. This complements the repository's production-helper round trips and explicit golden fixtures; no alternate decomposition or endpoint mismatch was found. Existing registered REST/MCP date execution is covered, not hypothetical age/date-shift API endpoints or Ask routing.

## Missing Acceptance, Not Confirmed Defects

1. **J2 browser boundary/error coverage:** `tests/numeric-regressions.spec.ts:27` exercises only the forward tiny-rate loan path. The inspected smoke specs contain no inverse-rate/APR ceiling-error fixtures. After R1 is fixed, acceptance still needs desktop/mobile supported-edge results, explicit above-bound inverse/APR errors (including fees), and a successful subsequent calculation. Pure solver passes do not prove these rendered workflows. No current browser failure is inferred from this missing coverage.
2. **J3 responsiveness and visual evidence:** the corrected browser test proves rejection and subsequent usable conversion/download, with both executions recorded at about 2.2 seconds for the entire test. It does not measure event-loop stalls or an explicit interaction-latency budget, and it does not attach a screenshot. Quantified responsiveness and retained visual proof requested in the first judge report are still not established. This does not reopen the resolved LF/CRLF defect.
3. **J4 retained screenshot review:** the spec calls `testInfo.attach` for age and reversed-date screenshots, but no J4 image artifact was available in the inspected `test-results` and supplied integration directory. The configured reporter is list-only. Functional assertions passed; this judge did not inspect rendered J4 screenshots. Retain/review those images if visual acceptance is claimed.
4. **Final source identity:** the supplied `source-snapshot.json` describes integration start at 13:08:47 AEST. At closeout, hashes differ for the three corrected browser specs, `scripts/aft-cli.mjs`, and the concurrently edited `scripts/aft-cli.test.mjs`; the other 11 overlapping files in this review match it. The later successful smoke log is credited as execution evidence, not misrepresented as matching the old snapshot. A final evidence manifest must identify the corrected fixtures and current source, then be refreshed again for any R1 fix. Unrelated CLI/evidence edits were not re-judged.

The PNG preservation regression is sufficient for the reported deletion bug, but its spy assertions do not prove arbitrary files cannot be overwritten by a future generator change. An additional deny-write assertion for the owner PNG would improve durability; this is non-blocking because current destinations were inspected and the actual restored blob matches. The JSON request-sentinel test only covers the instrumented request URLs/bodies; it is not blanket privacy certification.

## Executed Evidence

All commands used already installed dependencies in the specified worktree. No install, build, full check, full suite, server, browser execution, provider/publishing command, network request, deployment, or application/test/campaign edit was performed. The generator test mocked filesystem writes and browser launch; the CLI authorization test used temporary fixtures; the J4 handler test stubbed fetch and asserted no use. Vitest caching was disabled.

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner --no-cache src/lib/calculator.numeric.test.ts src/lib/jsonToCsv.test.ts scripts/lib/promotion-channel-policy.test.mjs scripts/lib/pinterest-assets-preservation.test.mjs --reporter=dot
node node_modules/vitest/vitest.mjs run --configLoader runner --no-cache tests/api/numericResults.test.ts -t J4 --reporter=dot
node node_modules/vitest/vitest.mjs run --configLoader runner --no-cache scripts/aft-cli.test.mjs -t 'aft CLI promotion authorization' --reporter=dot
```

- 13:23:02 AEST: four files, 161 passed, zero skips, exit 0, 431 ms.
- 13:23:03 AEST: J4 handler selection, 16 passed and 32 filtered/skipped, exit 0, 524 ms.
- 13:23:05 AEST: CLI authorization selection, one passed and eight filtered/skipped, exit 0, 397 ms.
- 13:32:04 AEST: after the final fingerprint check detected a concurrent change in `scripts/aft-cli.test.mjs`, re-read its unchanged promotion fixture and reran the same authorization selection: one passed and eight filtered/skipped, exit 0, 385 ms. Other test blocks were not reviewed or executed.
- Total: **178 selected tests passed**. The 40 nonselected cases were intentionally excluded by name filters, not edited or counted as passes.
- Additional in-memory `node --input-type=module -e` probes: 30 ceiling cases, 3,471 calendar intervals, and 12 invalid/five valid channel cases passed; the near-zero probe and failing assertion reproduced R1. Probes imported actual modules and wrote no files.
- Scoped source `git diff --check` exited 0, with LF-to-CRLF advisories only. Read-only Git checks verified branch, HEAD, and PNG blob identity.

Independently read [the coordinator's final smoke log](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/integration/smoke-final-fixtures-2026-09-06.log:159): **128 passed in 35.2 seconds**, including all eight J4 cases, four numeric cases and two JSON resource-limit cases across desktop/mobile. This is coordinator-executed evidence, not an independently rerun browser suite. The owner reports smoke exit 0 and a Node 24 clean install with zero vulnerabilities; installation/audit commands were deliberately not rerun or independently re-judged.

## Reviewed Snapshot

At 13:25:50 AEST, combined SHA-256 for the following 19 inspected source/test/asset files was `d440d5284e4a65fc090aa51f540490a275dfa1403124899052844ba25dc480e6`. The closeout guard correctly detected subsequent drift: only `scripts/aft-cli.test.mjs` changed, from SHA-256 `dafdb49f23135aeeba494ae4af527e0f302fddf40f8e3bf6190180ccf2c30d4a` to `6293a19aeb286b9f437264284ec88ef42ba3e49067ff4dc3b4f15ec8142f4371`. The other 18 files were unchanged, and the scoped CLI fixture passed again as recorded above. Updated combined SHA-256: `5d4ebb0a87e366d6b6836e368c602463ad005e333ee97dbb9ba72933c2febd7d`.

Algorithm: lexicographically sort slash-separated paths; hash each UTF-8 path, NUL, raw file bytes, NUL in sequence. This report is excluded. The file inventory records inspected paths, not ownership or approval of their concurrent changes.

```text
public/pinterest/browser-ai-vs-local-ai-privacy.png
scripts/aft-cli.mjs
scripts/aft-cli.test.mjs
scripts/generate-pinterest-assets.mjs
scripts/lib/pinterest-assets-preservation.test.mjs
scripts/lib/promotion-channel-policy.mjs
scripts/lib/promotion-channel-policy.test.mjs
src/components/FinanceCalculator.tsx
src/components/JsonToCsvConverter.tsx
src/components/UtilityCalculator.tsx
src/lib/apiToolRegistry.ts
src/lib/calculator.numeric.test.ts
src/lib/calculator.ts
src/lib/jsonToCsv.test.ts
src/lib/jsonToCsv.ts
tests/api/numericResults.test.ts
tests/calendar-convention.spec.ts
tests/json-csv-resource-limits.spec.ts
tests/numeric-regressions.spec.ts
```

Only `agents/project-review-2026-09-06/reports/implementation-batch-one-rejudge.md` was authored. All test/probe processes completed. No campaign/global status, approval row, worklog, application, test, asset, dependency, or publishing state was changed by this judge. **Resolve R1 and supply the remaining scoped acceptance before claiming the full J1-J4 batch complete; no release approval is granted.**
