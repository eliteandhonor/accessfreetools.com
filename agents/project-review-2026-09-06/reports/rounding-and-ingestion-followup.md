# Rounding And Evidence Ingestion Follow-Up

2026-09-06, Australia/Brisbane. Worktree `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus uncommitted implementation. No deployment, approval, provider refresh or public action.

## R1 Numeric Reproduction

The independent batch-one rejudge found that a three-payment loan with principal 100000 and annual rate 1e-16 percent rounded its payment below principal / paymentCount. This caused the inverse-rate and zero-fee APR helpers to reject the forward result.

- Added 80 forward/inverse/APR composition cases across principals 1e-12, 0.01, 100000 and 1e12; payment counts 1, 2, 3, 7 and 12; and rates 0, 1e-16, 1e-14 and 1e-12 percent.
- Added 12 scaled insufficient-payment cases, each checking three material shortfalls. Existing upper-ceiling and tiny-principal bracket regressions remain unchanged.
- RED at 13:38:32: `node node_modules/vitest/vitest.mjs run src/lib/calculator.numeric.test.ts -t R1 --reporter=dot` exited 1: seven failed, 85 passed, 117 deliberately filtered. The exact reported principal/term failed.
- Changed only the stable forward helper: its result is at least principal / paymentCount. This enforces the mathematical floor for the existing nonnegative-rate domain. No broad inverse tolerance, zero shortcut or bracket relaxation.
- GREEN at 13:38:46: `node node_modules/vitest/vitest.mjs run src/lib/calculator.numeric.test.ts tests/api/numericResults.test.ts --reporter=dot` exited 0: 257 passed in two files. The independent discounted-payment sum checks a relative residual even for tiny principals.

Independent R1 rejudge and the newly requested browser error/recovery coverage are pending at this entry. The previous 1349-test full check predates R1 and is not proof for this final patch.

## EV-01 Real Saved-Report Ingestion

Inventoried all eleven registered Git worktree output roots. Three existing roots contain recognized inspection reports: the original promotion checkout (494 valid reports), August 26 recovery (28), and OCR article worktree (8). The other roots were empty before this review's merged output. One matching JSON file in the original root is not a valid inspection report and is excluded by the existing reader.

Executed the existing merge CLI in the review worktree, once for each nonempty root:

```powershell
node scripts/merge-search-console-inspection-reports.mjs --input-root="C:/Users/chamb/OneDrive/Desktop/accessfreetools.com/output"
node scripts/merge-search-console-inspection-reports.mjs --input-root="C:/Users/chamb/OneDrive/Desktop/accessfreetools-aug26-search-recovery/output"
node scripts/merge-search-console-inspection-reports.mjs --input-root="C:/Users/chamb/OneDrive/Desktop/accessfreetools-tesseract-ocr/output"
npm run aft -- indexing-gaps
npm run marketing:orchestrate
```

All exited 0. The partial merges retained previous URLs, producing 406, 406 and finally 409 observations. Only ignored output in the review worktree was written. No source reports or registry were changed, and no Google API call or indexing request ran.

At 03:41:09 UTC, the final inventory has 14 fresh and 395 stale observations, with no missing original date or path. The newest original observation is September 2 at 00:52:56 UTC, not September 6. The actual indexing CLI lists 126 gap records: three fresh and 123 stale, explicitly warns that the merged report does not refresh each URL, and recommends refreshing historical evidence before taking action. These sample counts are not sitewide coverage or proof of today's Google state. Aggregate exports remain absent from this isolated worktree.

Proof under ignored `output/project-review-followup/integration/`:

- `inspection-ingestion-evidence.json`: intended roots, every matching file's SHA-256, counts and merged output hash.
- `indexing-gaps-imported-2026-09-06.log` and `marketing-imported-2026-09-06.log`: actual consumer output after ingestion.
- `tts-browser-check-2026-09-06.log`: static TTS readiness check passed.
- `tts-feature-soak-2026-09-06.log`: one pure queue/archive soak passed. This uses mock MP3 bytes, not model inference or device compatibility evidence.

The ingestion path and BR-02 command evidence have been sent for independent acceptance review. No task is self-approved by this report.
