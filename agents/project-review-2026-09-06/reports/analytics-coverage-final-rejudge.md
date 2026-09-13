# EV-04 Bounded Independent Final Rejudge

Date: 2026-09-06, 16:08 Australia/Brisbane (06:08 UTC).
Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.
Branch: `codex/gpt6-review-implementation`.
HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, plus preserved shared dirty work.

## Recommendation

**evidence_ready for the three bounded fixes. No concrete remaining finding in this scope.** J-EV04-01, J-EV04-02 and the game-coverage C1 counterexample now pass the unchanged independent assertions, and the inspected source addresses their causes. This is not final campaign/release approval, EV-05 completion or production-continuity proof. The coordinator's integrated full check remains separate.

This review started only after the EV-03 source freeze and handoff. The reviewer previously implemented the original EV-04 analytics work, but did not implement Parfit's three fixes reviewed here. This independence claim applies only to those new fixes, not to the original EV-04 implementation or the reviewer's own EV-03 fixes.

## Source Review

- **J-EV04-01 closed:** `src/lib/siteAnalytics.ts:155` checks both URL and pathname interpretations for leading-slash input before returning a normalized path. A private segment cannot disappear into a URL authority. `src/components/BaseLayout.astro:200` starts with the known `location.pathname` before separator normalization. The unchanged judge independently confirms server rejection and zero page-view/custom-action beacons for double slash, triple slash and slash/backslash cases. Normal private paths and similarly named public routes remain correct. This review covers the sanitizer and first-party tracker regions only, not Clarity, ads or routing changes.
- **J-EV04-02 closed:** `scripts/lib/production-analytics-report.mjs:14` validates coverage shape, flags, reason lists and dates. Contradictory complete/comparison claims fail closed when retained reads are partial, reasons indicate omissions or required facts are missing. Invalid coverage gets conservative partial/unknown output, comparisons disabled, and normalized reasons instead of a downstream `.join()` exception. Valid reasons and date values are retained. The original contradictory editorial-readiness and malformed-reasons assertions now pass. This consumer admission check does not create a complete/verified producer or independently establish deployment continuity.
- **J-EV04-C1 closed:** `scripts/four-in-a-row-pilot-report.mjs:54` passes normalized summary coverage into the analyzer. `scripts/lib/four-in-a-row-pilot-report.mjs:38` validates that coverage and adds it to the existing date, sample-size and owner-exclusion gates. Missing/partial/unknown coverage cannot make measurement ready merely because counts and dates meet thresholds. The report retains coverage, requested/observed dates and reasons, and labels counts as retained observations. The unchanged partial-coverage game assertion now passes. Wrapper propagation was source-reviewed, not executed against real configuration or production reports.

## Executed Evidence

Only this existing test command was run for this EV-04 rejudge:

```powershell
node --test agents/project-review-2026-09-06/reports/analytics-coverage-judge.test.mjs
```

Result: **11 passed / 0 failed / 0 skipped**, exit 0, **291.5637 ms**. The process exited before the coordinator's integrated-check handoff. No test/browser job remains running from this task.

The eleven cases comprise six leading-separator server/tracker assertions, one normal-private/similarly-named-public control, one partial/missing-coverage usage-readiness control, two malformed/contradictory coverage assertions and one game decision gate. The harness extracts the actual sanitizer through TypeScript AST, executes the actual inline tracker in an isolated VM with synthetic storage/beacons, and calls pure report helpers. It does not import the analytics configuration/log reader or execute the game wrapper's filesystem operations.

No broad Vitest suite, browser fixture, build or full check was rerun here. Parfit's reported 161 focused and 47 downstream results remain implementation evidence, not newly executed independent evidence in this report. The existing eleven-case harness and every implementation/test file were left unchanged.

## Frozen Scope

All eleven source/test SHA-256 values in Parfit's final freeze table in `analytics-coverage-judge.md` matched current files. End-of-review hashes also matched the start snapshot for those eleven files and the judge harness. Source review was limited to the five implementation regions above; the other six handoff files were hash-verified, not broadly re-reviewed or rerun.

| Inspected source or executed harness | SHA-256 |
| --- | --- |
| `src/lib/siteAnalytics.ts` | `d5567a83d3569510b04381142e2a180098a8d8698aae97a08f88f4e128c93897` |
| `src/components/BaseLayout.astro` | `c825a3b0da67225f68e6c7273534aa45cda4382c44133e6f6d82106a516b401f` |
| `scripts/lib/production-analytics-report.mjs` | `a14a4e4147cfa0152b15f3652a5ef830e4450af023d1a0f593ef14a77f2f3d8e` |
| `scripts/four-in-a-row-pilot-report.mjs` | `74f2d7a51072fa012148cc45bddece3e0d84e3c17bfec699f657717018f98a88` |
| `scripts/lib/four-in-a-row-pilot-report.mjs` | `738640458f196f82d5a99a67a760adbb5b7f9827272900904fb96f8de352f4f0` |
| `agents/project-review-2026-09-06/reports/analytics-coverage-judge.test.mjs` | `2810f77ae07079ff28207f6fa1a2fca26e5ff6742aed2d21005fd68b6d39d577` |

## Remaining Gates And Write Set

Production continuity remains **unverified** and needs authorized durable-storage, retained-interval and deployment-survival evidence before full-period comparisons or public usage claims. This scoped rejudge does not reopen the original bounded reader, retention policy, new-tool-pilot consumer attribution or other analytics consumers.

The only write for this EV-04 rejudge is this new report. No implementation/test edits, shared campaign/worklog edits, source-policy changes, real logs/config reads, retention operation, external network/provider request, spending, production action, installation, build, full check or commit occurred. EV-03's earlier freeze and all coordinator integrations remain untouched by this rejudge.
