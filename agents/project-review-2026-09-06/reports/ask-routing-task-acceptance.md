# COR-01 And COR-02 Local Task Acceptance

Independent Release And Proof Judge, 2026-09-06, Australia/Brisbane. User-authorized delegation, limited to these two tasks.

| Task | LOCAL Task Acceptance | Basis |
| --- | --- | --- |
| COR-01 | **APPROVE** | Complete electrical qualifiers, metric concrete dimensions, and token-price denominators are preserved or terminally declined in the tested parser/fallback modes. Independent golden inputs/results and adversarial checks pass. No remaining acceptance gap found within this task. |
| COR-02 | **REJECT** | A fully parenthesized arithmetic chain bypasses the terminal calculation guard and accepts a partial provider fixture as HTTP 200 success. Eight dedicated judge tests fail. |

These decisions apply only to the fingerprinted local implementation. They do not approve the whole release, deployment, production behavior, SEC-01, COR-06, or the authentication threat boundary. No coordinator manifest, task status, or shared worklog was changed.

## Confirmed Blocking Finding

### COR02-JUDGE-01 [P1]: Parenthesized Chains Can Regain A Partial Fallback Answer

**Confidence: high for local behavior with a controlled provider fixture.** No claim about the frequency of real-provider misrouting or a production incident.

The complete arithmetic matcher at [askToolRouter.ts:399](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:399) does not accept parentheses. The terminal classifier at [askToolRouter.ts:426](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:426) expects a numeric token immediately before the operator; a closing `)` breaks that match. These questions therefore return `null` at line 430 instead of declining. [Fallback dispatch:538](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:538) then accepts the supplied tool call; [route correction:436](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:436) also returns the unchanged route when reparsing produces `null`. The real deterministic runner and REST handler subsequently report success.

| Exact Question | In-Memory Provider Fixture | Observed Parser-First And Local-Fallback-Enabled Result | Required Outcome |
| --- | --- | --- | --- |
| `What is (2) + (3) * (4)?` | `basic-calculator`, `{left:2,operator:'+',right:3}` | HTTP 200, `ok:true`, `route.source:ollama`, result `5`, answer `2 + 3 = 5.` | Complete result 14 or explicit decline; never 5 |
| `Calculate (12) / (3) - (2)` | `basic-calculator`, `{left:12,operator:'/',right:3}` | HTTP 200, `ok:true`, result `4`, answer `12 / 3 = 4.` | Complete result 2 or explicit decline; never 4 |
| `Calculate (2) plus (3) times (4)` | `basic-calculator`, `{left:2,operator:'+',right:3}` | HTTP 200, `ok:true`, result `5` | Complete result 14 or explicit decline; never 5 |

Each failing REST request invoked the fetch stub exactly once; there was no external request. All three questions decline with HTTP 400, no `run`, and zero stub calls in forced-fallback mode. Direct `answerUtilityQuestion` also incorrectly resolves the first example in both model-enabled modes. This gives six failing REST cases plus two failing direct-chatbot cases, with the same results on repeated runs.

**Minimal follow-up, owner correctness:** make unsupported grouped/chained arithmetic terminal before provider routing, including operators following closing delimiters and the existing word-form operators. A conservative decline is sufficient; do not build a general expression engine for this task. Preserve unrelated model-routed utility requests.

**Reacceptance gate:** keep [the dedicated chain fixtures:114](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/askRoutingTaskAcceptance.judge.test.ts:114), [REST decline assertions:182](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/askRoutingTaskAcceptance.judge.test.ts:182), and [direct-call assertion:191](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/askRoutingTaskAcceptance.judge.test.ts:191) intact. They must return explicit unsupported errors with no successful partial `run` and no provider invocation across all three modes. Rerun both focused files and retain grouped numbers, signs, decimals, scientific notation, percentages, dates, and existing model-routing controls.

## Exact Acceptance And Fresh Evidence

Authoritative COR-01 `doneRule`: "Three-phase/PF, metric concrete and per-1000 token questions preserve complete inputs or decline. Assert structured inputs plus results. Parser-first and fallback paths cannot silently reinterpret units; tests never call external models."

- [Electrical parser:110](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:110) extracts phase/PF, validates the remaining complete question, rejects duplicates/conflicts, and preserves the numbers. The original 600 W / 120 V / three-phase / PF 0.8 question returns exactly those structured inputs and `amps:3.608439182435161`. Independent expectation: `600 / (120 * sqrt(3) * 0.8)`. DC, single-phase, three-phase, fractional/percentage PF, scientific notation, and reverse amps-to-watts are covered. Invalid PF, duplicate PF, line-to-neutral and extra load conditions decline without fallback.
- [Concrete parser:142](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:142) converts units explicitly. The original `3 by 4 meters, 10 cm deep` case returns feet/inches corresponding to 3 m, 4 m, and 0.1 m, with `cubicMeters:1.32` including the disclosed default 10% waste. Independent metric/centimeter/millimeter and mixed-unit fixtures verify normalized inputs, 0%/5% waste and volume. Missing units, repeated waste and extra volume conditions decline. The documented inch-depth starter retains its legacy feet assumption; it is not evidence that unspecified metric dimensions may be guessed.
- [Token-cost parser:177](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:177) normalizes denominators, including separate input/output bases. The original per-1000 question gives `inputPricePerMillion:2000`, `outputPricePerMillion:8000`, total `$6,000.00`, and `$6.00` per request, not $6 total. Per-1K/per-1M aliases, the reverse mixed-denominator case, grouped/scientific counts, and decimal rates are verified. Unsupported denominators, malformed grouping and discount conditions decline.
- Dedicated COR-01 evidence: **87/87 tests pass**: 17 independent structured-input/result cases and 12 terminal-decline cases, each in parser-first, forced-fallback and local-fallback-enabled modes. Every one makes zero fetch-stub calls. Existing tests additionally compare full runner results, warnings, assumptions, answers and URLs.

Authoritative COR-02 `doneRule`: "18% of 1,000 returns180; chained arithmetic and ISO date questions route correctly or decline, never succeed on a prefix. Cover grouping, sign, decimals, scientific notation and leftover operators with no-network REST tests."

- [Anchored matcher:102](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:102), [numeric validation:94](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:94), and [percentage routing:220](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:220) correctly return `{percent:18,value:1000}` and result 180 for the exact grouped-percentage question. Independent fixtures verify negative signs, leading decimals, exponent notation and grouped arithmetic results.
- [Date routing:210](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:210) runs before arithmetic. May 1 to May 15 and its reversal both retain complete ISO inputs and return 14 days. Leap-date/same-date controls work; invalid dates, timestamps and inclusive/extra arithmetic conditions decline.
- Existing 453 tests pass, including malformed grouping, ASCII chains, Unicode operators, factorials, and prior MBps/Mbps fixes. **Passing checks are not adequate full coverage:** all-parenthesized ASCII/word-operator chains were absent and bypass the terminal classifier.
- Dedicated COR-02 evidence: **91 passed, 8 failed, 99 total**. The unfulfilled chained-arithmetic/fallback acceptance clause is sufficient to reject the task despite the successful percentage/date fixes.

## Source Identity And Review Scope

Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`; verified branch `codex/gpt6-review-implementation`; HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus the pre-existing uncommitted implementation. Campaign baseline remains `90d6dcab0580a91ca66382f2414d95e8817469e5`; no fetch or checkout was performed. Node `v24.20.0`, installed Vitest `4.1.10`.

Read root and campaign AGENTS, campaign COR-01/COR-02 acceptance, campaign-relative `agents/release-judge/AGENT.md` and `reference.md`, original correctness findings, prior batch-two rejudge and Ask fix report, and relevant correctness implementation guidance. Read current full router, dedicated existing Ask regression file, REST handler, HTTP helper, registry schemas/selected runners, deterministic electrical/concrete implementations, package/Vitest configuration, and scoped diff. Historical reports were orientation only; their counts, older line numbers and fingerprints were not treated as fresh acceptance proof. Authentication and other correctness-task adjudication were excluded.

Before tests, SHA-256 was captured for **605 pre-existing files** across `src`, `tests`, `scripts`, the campaign, root AGENTS, package files, Vitest config, and Ask documentation. After all tests, **all 605 matched exactly**. The dedicated test's final before/after hash also matches. Full inventory and timestamps: [before](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-01-02-judge/source-before.json), [after](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-01-02-judge/source-after-tests.json), [comparison](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-01-02-judge/hash-comparison.json). Snapshot interval: 09:40:57Z to 09:44:53Z on 2026-09-06.

| Path | SHA-256, Identical Before And After Tests |
| --- | --- |
| `src/lib/askToolRouter.ts` | `EB32A4B86BF1336816C275F9AB30C59CC4F6131583AAC98BEBF49FB836D4741D` |
| `src/lib/apiToolRegistry.ts` | `FC220B64902373ECC6E9BFF1834ED50B01B8023326AB8AF6E63E3FC50B45B792` |
| `src/lib/calculator.ts` | `9BB0CBF25B273841FB8886A2C66D685C6AEF050FB8745D2D6077111D96A20848` |
| `src/lib/apiHttp.ts` | `ED324C6CBF709E6601868F11F46C0818B79852BCF0F8B7CEDCA953B21E577589` |
| `src/lib/askRequest.ts` | `075565229EB8F23790CBDFE9E49B0E6BD27E33A21980DCCB2380E24413A6EA53` |
| `src/pages/api/v1/ask.ts` | `4876289BC029DABDE9BD9179A757D724FE3A0DC9EA8DC10433E6791AF4E17780` |
| `tests/api/askToolRouter.test.ts` | `CA921D567181466D902E53A877336F55134BEE672C995D0847B8ACF0F16AEB4D` |
| New `tests/api/askRoutingTaskAcceptance.judge.test.ts`, final run | `83CE3EAD539B69261CB678DD5F6BB6990991F849A1C0B990E0134F00A617F2A4` |

## Executed Tests

All invocations were bounded synchronous runs, with **maxWorkers 2**. No tests/assertions in existing files were changed. The dedicated test uses expected inputs and independent result literals/formulas rather than calling the production runner as its numerical oracle. Both suites replace private environment loading and fetch with test-only mocks; actual router, registry, calculations and in-process REST handlers run. No listening server, external model, provider network request or live endpoint is involved. The existing suite has intentional mock-only mortgage routing controls; the dedicated fixture deliberately offers a partial response to reveal unsafe fallback.

| Start AEST | Test Files | JSON/Log Stem In Proof Directory | Outcome | Vitest Duration / Exit |
| --- | --- | --- | --- | --- |
| 19:40:58 | Existing `tests/api/askToolRouter.test.ts` | `existing-tests` | 453 passed | 669 ms / 0 |
| 19:43:34 | New `tests/api/askRoutingTaskAcceptance.judge.test.ts` | `judge-tests` | 178 passed, 8 failed | 569 ms / 1 |
| 19:44:01 | Both files | `combined-tests` | 631 passed, 8 failed | 724 ms / 1 |
| 19:44:51 | Both files, final dedicated-test version | `final-tests` | 631 passed, 8 failed, 0 skipped | 920 ms / 1 |

The final fixture refinement supplies `12 / 3` for the division chain rather than the generic `2 + 3` mock. It strengthens the realistic-prefix reproduction and changes no decline assertion. The saved `judge-observations.json` is from this final run, containing 183 REST observations; three direct-call assertions are captured in the test reports. Earlier logs retain their original generic fixture. Repeated runs are not counted as extra distinct coverage: **639 distinct final tests**.

Exact final command, with stdout/stderr redirected to `output/project-review-followup/COR-01-02-judge/final-tests.log`:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner tests/api/askToolRouter.test.ts tests/api/askRoutingTaskAcceptance.judge.test.ts --maxWorkers=2 --reporter=verbose --reporter=json --outputFile.json=output/project-review-followup/COR-01-02-judge/final-tests.json --no-color
```

The first three commands use the same options, the file selections and output stems shown in the table. Read-only commands included `git status --short --branch`, `git branch --show-current`, `git rev-parse HEAD`, `git diff -- src/lib/askToolRouter.ts`, `git check-ignore`, `rg`, `Get-Content`, structured JSON parsing and `Get-FileHash`. File scope/whitespace and process checks followed report creation.

## Changes, Process Cleanup And Limits

Authored files, and only these non-ignored files:

1. [Dedicated judge test](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/askRoutingTaskAcceptance.judge.test.ts). Intentionally retains eight failing regression checks pending the production fix; not weakened, skipped or marked as expected failures.
2. [This acceptance report](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/reports/ask-routing-task-acceptance.md).

Ignored generated proof, all under `output/project-review-followup/COR-01-02-judge/`: `source-before.json`, `source-after-tests.json`, `hash-comparison.json`, `judge-test-before.json`, `judge-test-final-before.json`, `existing-tests.json`, `existing-tests.log`, `judge-tests.json`, `judge-tests.log`, `combined-tests.json`, `combined-tests.log`, `final-tests.json`, `final-tests.log`, `judge-observations.json`, `git-status-before.txt`, `git-status-after-tests.txt`, `owned-process-check.json`, and `final-scope-check.json`.

All four test invocations exited. No server/background helper was started. The post-test process check found zero matching owned Node test processes; no unrelated processes were stopped. All owned process lifetimes are complete.

Intentionally not run: full `npm test`, `npm run aft -- ask-audit`, build, install/npm ci, dependency audit, browser rendering, live endpoints, model inference, deployment, commit or public actions. The campaign's broad evidence-command string is not claimed executed: this delegation requested bounded no-network LOCAL task adjudication. Parent retains isolated clean-install SEC-01 and authentication/threat-boundary work, plus broader integration/release gates. The provenance-hygiene skill was consulted, but its HTTP inspection service was not invoked under this no-network scope; no mark/disclosure cleaning or rewrite was performed.

## Independent Rejudge: 2026-09-06, 19:54 AEST

This dated addendum follows the parent's explicit "Fix ready" message. Everything above remains the historical rejection of router SHA-256 `EB32A4B86BF1336816C275F9AB30C59CC4F6131583AAC98BEBF49FB836D4741D`; it has not been rewritten into a pass. The decisions below apply to the newly tested source only.

| Task | Updated LOCAL Task Acceptance | Fresh Basis |
| --- | --- | --- |
| COR-01 | **APPROVE** | All 87 dedicated input/result/decline checks pass again with zero fetch-stub calls; all existing Ask regressions also pass. No remaining scoped gap found. |
| COR-02 | **APPROVE** | All 108 dedicated checks pass, including the original eight unchanged failing checks and nine additional square-bracket, brace and nested-parenthesis mode cases. The complete-input/fallback gap COR02-JUDGE-01 is resolved on this snapshot. |

**Source inspection:** [the parent's terminal classifier at askToolRouter.ts:427](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:427) now recognizes a numeric token or closing `)`, `]`, or `}` before existing ASCII/word-form operators. The supported complete parser still runs first; unsupported grouped chains throw before provider routing. No new expression engine or fallback was introduced. The judge did not edit application source or the regex.

**Judge harness changes only:** [afterAll:137](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/askRoutingTaskAcceptance.judge.test.ts:137) now creates the output directory recursively before writing observations, with the necessary `mkdirSync` import. Added `[2] + [3] * [4]`, `{2} + {3} * {4}`, and `((2)) + ((3)) * ((4))` to the existing decline table, generating nine cases across its three modes. No prior question, expected value, assertion, or failure semantics was changed. A saved before/after diff confirmed these are the only test changes.

**Fresh execution:** 19:51:31 AEST, two files, **648 passed, 0 failed, 0 skipped**, exit 0, Vitest duration 707 ms. This comprises 453 existing tests plus 195 dedicated tests (87 COR-01 and 108 COR-02). All 192 dedicated REST observations have zero fetch-stub calls; each grouped-chain request now returns HTTP 400, `ok:false`, an error message and no `run`. The three direct-chatbot cases also pass. The existing mock-only mortgage controls continue to pass. No real provider/network call occurred. A new pre-fix red run was not attempted because the parent fix was already present when this follow-up began; the original independent red logs remain available.

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner tests/api/askToolRouter.test.ts tests/api/askRoutingTaskAcceptance.judge.test.ts --maxWorkers=2 --reporter=verbose --reporter=json --outputFile.json=output/project-review-followup/COR-01-02-judge/rejudge/tests.json --no-color
```

Fresh proof: [test log](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-01-02-judge/rejudge/tests.log), [structured test results](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-01-02-judge/rejudge/tests.json), and [REST observations](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-01-02-judge/rejudge/observations.json).

**Missing-directory verification:** a separate local probe extracted the actual `afterAll` callback using the installed TypeScript parser and executed it with only `import.meta.url` rebound to an isolated fixture location. Its output directory initially did not exist; the callback created it and wrote the expected observation. [Fixture proof](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-01-02-judge/rejudge/mkdir-fixture.json). This verifies the harness hook, not a full clean-install/fullcheck run.

**Source identity:** worktree/branch/HEAD remain as recorded above. All **606 files** in the before/after test inventory matched exactly during this follow-up (the prior 605-file inventory plus the dedicated test). [Before tests](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-01-02-judge/rejudge/source-before-tests.json) and [after tests](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-01-02-judge/rejudge/source-after-tests.json) contain every fingerprint. Principal SHA-256 values, identical before and after this retest:

| File | SHA-256 |
| --- | --- |
| `src/lib/askToolRouter.ts` | `B557E7B294F3F5DCF93933C1D7E2F66B1BF80E7C3890BF8C9CA7B8CB8B6AAA52` |
| `tests/api/askRoutingTaskAcceptance.judge.test.ts` | `FCD6030E76733452265ECC07DC1B41C02306D4BE6395541AFAC974E698393400` |
| `tests/api/askToolRouter.test.ts` | `CA921D567181466D902E53A877336F55134BEE672C995D0847B8ACF0F16AEB4D` |

**Historical-proof qualification:** the original `final-tests.json` and `final-tests.log` still record the 09:44:51Z rejection run (631 passed, 8 failed). The shared root `judge-observations.json` had already been regenerated at 09:50:13Z before this follow-up began; it is not the rejection-era observation snapshot. Its entry-state contents were preserved as `rejudge/pre-rejudge-observations.json` and restored after this retest. This rejudge's observations are stored separately, as linked above. The original report was also archived in `rejudge/historical-report.md` before this append.

**Changed files this follow-up:** only the dedicated judge test and this append to the report are non-ignored edits. Generated proof under `output/project-review-followup/COR-01-02-judge/rejudge/`: `source-before-edits.json`, `source-before-tests.json`, `source-after-tests.json`, `judge-test-before.txt`, `historical-report.md`, `pre-rejudge-observations.json`, `tests.json`, `tests.log`, `observations.json`, `mkdir-fixture.json`, `fresh-output-fixture/output/project-review-followup/COR-01-02-judge/judge-observations.json`, and `final-scope-check.json`.

The test and fixture processes exited; no judge-owned server/background process remains. Parent processes were left alone. No campaign/task/worklog/package/application edit, install, build, fullcheck, commit or live action was performed. The parent's earlier clean fullcheck excluded this newly created judge file and is not being represented as coverage of it. The new fullcheck, isolated clean-install SEC-01, auth threat boundary and whole-release approval remain with the parent and are **not** granted by these two LOCAL task approvals.
