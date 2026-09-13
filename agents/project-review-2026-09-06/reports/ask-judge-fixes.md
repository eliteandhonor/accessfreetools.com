# Ask Judge Fixes: J2-01, J2-02, J2-03

Recorded 2026-09-06, 13:20 AEST. Local implementation and regression evidence only, not independent approval, full COR-01/COR-02 completion, or release proof.

## Source And Scope

- Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.
- Verified branch: `codex/gpt6-review-implementation`; HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`. Campaign baseline: `90d6dcab0580a91ca66382f2414d95e8817469e5`. This report describes the uncommitted patch, not HEAD alone.
- Read root/campaign `AGENTS.md`, relevant campaign definitions/task-board rows, `reports/implementation-batch-two-judge.md`, COR-01/COR-02 in `reports/correctness.md`, correctness worklog, `docs/ask-api-mcp-alpha.md`, and `docs/brand-code.md`. Inspected the complete router/test harness, REST Ask handler, download runner contract, selected adjacent API tests, package test command, and Vitest configuration.
- Applied scoped TDD, debugging, Git preservation, and self-review guidance. The lightweight memory registry search found no relevant entry and supplied no evidence.
- Only source/test edits: `src/lib/askToolRouter.ts` and `tests/api/askToolRouter.test.ts`. Only documentation edits: this report and an append to `agents/correctness/worklog.md`.
- The pre-edit router/test SHA-256 values matched the judge's recorded source. In-memory comparison against these starting files confirms 12 added/7 removed router lines and 77 added/0 removed test lines. Earlier Ask fixes and all 345 existing tests remain intact. Other dirty files were not restored or edited. Task-board and campaign hashes remained unchanged.

## Findings And Fixes

### J2-01: Unicode Arithmetic

**Confirmed consequence:** the no-network REST reproduction of `What is 2\u00d73\u00d74?` returned HTTP 200 with the deliberately partial provider call `{left:2, operator:'*', right:3}`, answering 6. Multiplication, division, and minus variants also bypassed terminal classification in model-enabled modes. Confidence: high for these executed local paths; no claim about real-provider frequency or production incidents.

**Minimal fix:** [the pre-normalization guard](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:195) terminally rejects U+00D7, U+00F7, and U+2212 before any parser success or provider fallback. It intentionally does not translate or evaluate these symbols. The existing supported operator grammar is unchanged.

**Acceptance demonstrated:** [15 Unicode fixtures per mode](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/askToolRouter.test.ts:254) cover the exact judge example, compact/spaced chains, parenthesized operands, mixed operators, and single-operation controls. All return HTTP 400, `ok:false`, an error message, no `run`, and zero fetch calls despite a plausible partial provider fixture. Unicode single-operation syntax is deliberately declined rather than added to the parser.

### J2-02: Attached Uppercase-B Speed Units

**Confirmed consequence:** `80MBps` returned a successful download run with `speedMbps:80`; the same speed written `80 MBps` already declined. Uppercase B was lost before matching, causing an eightfold byte/bit reinterpretation. Confidence: high, reproduced through the real in-process REST handler.

**Minimal fix:** preserve the punctuation-normalized original case, use [the existing complete-question matcher with an optional case-insensitive flag](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:94), then [capture and inspect the complete speed unit](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:254). An uppercase B gets the existing MBps clarification. This removes the whitespace-dependent leading word boundary without adding a byte-speed conversion or new grammar.

**Acceptance demonstrated:** [four explicit spellings per mode](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/askToolRouter.test.ts:276). Both `80MBps` and `80 MBps` return HTTP 400 with no run/provider call. Both `80Mbps` and `80 Mbps` return parser success with exactly `{fileSize:5,fileUnit:'GB',speedMbps:80,efficiencyPercent:90}`. Results and answers equal the deterministic runner; independent assertions require effective speed 72 Mbps and `5e9 * 8 / (72 * 1e6)` seconds, approximately 555.5555555556. All four spellings make zero fetch calls.

### J2-03: Factorial Suffixes

**Confirmed consequence:** `Calculate 2 + 3!` returned 5 after removing `!`; lone factorial questions could also reach a partial provider route. The expanded regression reproduced `Calculate |-3|!` returning absolute value 3 after stripping its factorial. Confidence: high, executed REST reproductions.

**Minimal fix:** [the same pre-normalization guard](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:196) rejects `!` following a numeric operand or closing parenthesis, bracket, or absolute-value bar, including intervening whitespace. This runs before punctuation cleanup. It does not implement factorial calculation, and sentence exclamation after a unit name remains compatible.

**Acceptance demonstrated:** [16 factorial fixtures per mode](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/tests/api/askToolRouter.test.ts:301) cover terminal factorials, factorials before question marks/periods, whitespace, repeated factorial signs, decimal operands, lone operands, parenthesized/bar expressions, nonterminal factorials, percentages, and averages. All return HTTP 400 with no run and zero provider calls. The added `Convert 300 Ah at 12 V to watt-hours!` compatibility fixture still produces the existing deterministic result.

## Exact Red And Green Evidence

Runtime: Node `v24.20.0`, installed Vitest `4.1.10`. All five test runs used this exact command from the review worktree:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner tests/api/askToolRouter.test.ts --reporter=dot
```

| Start, AEST | Phase | Result | Exit | Duration |
| --- | --- | --- | --- | --- |
| 13:16:47 | Initial red, before router edits | 53 failed, 391 passed, 444 total | 1 | 830 ms |
| 13:17:34 | Red with exact J2-01 judge example, still before router edits | 55 failed, 392 passed, 447 total | 1 | 767 ms |
| 13:18:01 | Initial green | 447 passed | 0 | 718 ms |
| 13:18:54 | J2-03 absolute-bar expansion red | 3 failed, 450 passed, 453 total | 1 | 702 ms |
| 13:19:09 | Final green | **453 passed, 0 failed, 0 skipped** | 0 | 704 ms |

The final suite comprises all 345 pre-existing cases plus 108 added checks: 45 Unicode, 12 speed-unit, 48 factorial, and 3 punctuation-compatibility checks. Each group runs in parser-first, forced-fallback, and local-fallback-enabled modes. It invokes the actual REST handler, router, and deterministic runners without a listening server. Private environment loading and fetch are mocked; no credentials are loaded. Existing mock-only mortgage routing remains covered. No tests were weakened, removed, or disabled.

`git diff --check -- src/lib/askToolRouter.ts tests/api/askToolRouter.test.ts` exited 0. Git reported only its LF-to-CRLF working-copy advisory. Read-only source/state checks used `git status`, `git rev-parse HEAD`, `git branch --show-current`, scoped `git diff`, `rg`, `Get-Content`, structured campaign JSON parsing, and `Get-FileHash`.

## Final Fingerprints

SHA-256 after final testing; paths relative to the worktree:

| Path | SHA-256 |
| --- | --- |
| `src/lib/askToolRouter.ts` | `8D3AD9C111ACF56E9437BB68737516DA080B797A4BE3115ABD3D548B425D6690` |
| `tests/api/askToolRouter.test.ts` | `CA921D567181466D902E53A877336F55134BEE672C995D0847B8ACF0F16AEB4D` |

## Limits And Handoff

All test processes exited, the final one at approximately 13:19:10 AEST. Source/test changes are complete for this assignment; no owned test, server, or background process remains active. Only report/worklog completion and read-only checks followed the final test.

No COR-06 authentication, authorization, timeout, disconnect, provider transport, or REST/MCP policy edits. No J2-04/J2-05 work, task-board/status changes, installs, audits, full test suite, typecheck, build, full check, dev server, browser verification, live Ask/API/MCP audit, deployment, commit, publication, paid calls, or real provider requests. The provenance HTTP service was not invoked in this no-network assignment; no marks or disclosures were removed.

Coverage is deliberately bounded to the named operator variants and fixtures, not arbitrary Unicode expressions or universal model interpretation. Guarding these symbols conservatively may decline other questions containing them. This is the requested safe-decline policy, not a parser feature expansion. Browser presentation and production behavior remain unverified. The coordinator/Release Judge must independently review the resulting exact patch and supply any broader acceptance/release evidence; no campaign task is self-approved here.
