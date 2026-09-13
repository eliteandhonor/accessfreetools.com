# OP-01 Release Identity Implementation Judge

Date: 2026-09-06. Verdict: **request implementation changes**. Five confirmed findings, eight failing judge cases. This is not OP-01 approval, campaign approval, a full-check pass, or deployment proof.

Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`.
HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25` (`docs: record GPT-6 project review and accountable follow-up goals`). The reviewed implementation is uncommitted on top of that revision; HEAD alone does not identify it. The primary promotion checkout was not used for execution.

Read the root and campaign AGENTS.md, campaign release contract, operations review, and Hostinger API agent guide. Scope covers release-identity.mjs and its existing tests, both new build/check wrappers, edited Hostinger deployment/status scripts, package build/check scripts, and directly involved mirror/runtime helpers. Only the judge test and this report were authored. Implementation, manifests, package files, shared source, and existing build output were not edited.

## Confirmed Findings

### RI-J1 [P1]: A verified check receipt does not validate the build it certifies

Location: [scripts/run-verified-check.mjs:17](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/run-verified-check.mjs:17), lines 17-20; receipt construction at [scripts/lib/release-identity.mjs:33](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/release-identity.mjs:33), lines 33-40. Confidence: high, reproduced through unchanged wrapper copies.

The check wrapper only observes source before/after the child and its exit status. It never reads either built identity. In the fixture, the child changes tracked source, runs the real build wrapper against those bytes, then restores the file before returning success. The artifact contains `uncommitted-source`; the real build identity correctly says `clean: false`; final Git status is clean. Nevertheless the real check wrapper exits 0 and writes `verified: true`. Its output includes both `Build source identity: ...; unverified.` and `Release source receipt: verified` in the same run. Separate missing-identity and wrong-SHA identity fixtures also receive verified receipts.

Consequence: a receipt accepted by the deployment gate can certify a SHA even though the local build checked under that receipt was not built from that clean SHA. This is a false provenance claim, not merely a missing diagnostic. The missing/mismatched fixtures use a successful no-build child to isolate the wrapper contract; they do not claim that the complete current check:steps pipeline was run or would pass without its artifacts.

Minimal task: before verifying a receipt, validate the freshly produced local build identity against the check's initial/final clean source and Node version. Require consistent mirrored identities and bind the artifact to this invocation so a previous build is not accepted. Missing, dirty, mismatched, or stale build evidence must retain an unverified receipt and return nonzero from the release check. Keep ordinary diagnostic/dirty-build policy separate if it is intentionally supported.

Acceptance: judge test lines [209](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/release-identity.judge.test.mjs:209) and [219](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/release-identity.judge.test.mjs:219) pass without weakening the assertions; the clean positive wrapper case still passes. Add a same-SHA previous-build case and a mirrored-identity disagreement case when implementing the fix. Current outcome: **3 failures** (dirty artifact, missing identity, mismatched identity).

### RI-J2 [P1]: Git status alone treats hidden tracked modifications as clean

Location: [scripts/lib/release-identity.mjs:19](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/release-identity.mjs:19), lines 19-20. Confidence: high, reproduced with real Git repositories and both index flags.

For a tracked file marked `--assume-unchanged` or `--skip-worktree`, editing its bytes leaves the chosen porcelain command empty. `captureReleaseSource()` returns `clean: true` and the committed SHA although `git show HEAD:source.txt` differs from the actual input file. Both build identity and check receipts rely on this result, so their before/after comparison cannot detect these edits.

Consequence: builds/checks using modified tracked inputs can be labeled as the clean committed source. No remote attacker or credential compromise is needed; an existing local index flag is sufficient. This review does not claim those flags are currently set on the real worktree.

Minimal task: reject source states whose index trust flags hide changes, or independently compare the tracked working bytes against the committed tree without relying on those flags. Do not clear flags or otherwise modify the user's index as part of a read-only capture.

Acceptance: both parameterized cases at [judge test:178](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/release-identity.judge.test.mjs:178) return unverified source; normal clean, staged, tracked, and untracked cases retain their existing behavior. Current outcome: **2 failures**.

### RI-J3 [P2]: Inherited Git environment can identify a different checkout

Location: [scripts/lib/release-identity.mjs:14](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/release-identity.mjs:14), lines 14-18. Confidence: high, reproduced in an isolated subprocess.

Setting `cwd` on execFileSync does not neutralize inherited `GIT_DIR` and `GIT_WORK_TREE`. With those variables pointing at clean fixture B, capture run from dirty fixture A reports clean source from B. The Astro wrapper still builds from process cwd A. The explicit cwd parameter therefore does not establish which source was identified.

Consequence: invoking the release tooling from a Git-aware parent process with foreign repository variables can attach another checkout's clean identity to the build. This is an environment compatibility/provenance failure, not a demonstrated remote exploit.

Minimal task: explicitly reject or safely neutralize inherited repository/index selectors, and verify that the resolved worktree is the intended build root. Preserve normal linked-worktree support; requiring a .git directory rather than allowing a .git file is not an acceptable repair.

Acceptance: [judge test:186](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/release-identity.judge.test.mjs:186) fails closed or captures dirty A rather than clean B. Add linked-worktree and alternate-index cases with the fix. Current outcome: **1 failure**.

### RI-J4 [P2]: The imported mirror can exit successfully before identity generation

Location: [scripts/build-site.mjs:13](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/build-site.mjs:13), lines 13-15; imported early exit at [scripts/mirror-static-output.mjs:7](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/mirror-static-output.mjs:7), lines 7-9. Confidence: high for the reproduced wrapper path; no full Astro build was run.

When the successful build child leaves no dist/client, the imported mirror executes `process.exit(0)`. That terminates the new build wrapper before either _build.json write. The wrapper exits 0 with `Static mirror skipped` and no identity. This pre-existing mirror exit becomes significant when identity generation is appended after importing it. The current Astro server configuration normally supplies dist/client; the fixture establishes the missing-output/configuration-drift compatibility path, not a present production build failure.

Minimal task: check the required output before importing the mirror, or isolate its process exit and explicitly validate successful mirror output before generating identity. Missing required output must exit nonzero and must not leave an old identity usable as new-build proof.

Acceptance: [judge test:233](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/release-identity.judge.test.mjs:233) returns nonzero with no usable new identity; ordinary build failure and the mirrored positive case still pass. Add a pre-existing stale _build.json case during repair. Current outcome: **1 failure**.

### RI-J5 [P2]: Status uses a stale source snapshot after awaiting live identity

Location: [scripts/hostinger-status.mjs:120](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/hostinger-status.mjs:120), lines 120-127. Confidence: high, reproduced with the real status wrapper and a synthetic fetch boundary.

Source and receipt are captured before the asynchronous identity request and reused afterward. A tracked edit during that request leaves the actual worktree dirty, yet the report exits 0 with `Status: ok`, `testedSource: ok`, and `deployedSource: ok`. The request can wait up to 15 seconds, so concurrent work has a practical window to invalidate the local snapshot. The deployment script already captures source after its identity fetch; status does not.

Consequence: the newly generated status report can falsely claim parity with current clean tested source. This does not mean the served SHA necessarily changed or that the live Hostinger timeout is a site failure.

Minimal task: after fetching, recapture local source and revalidate the receipt before creating both source checks. Fail closed if the source/receipt changed during the observation instead of reporting the initial snapshot as current proof.

Acceptance: [judge test:298](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/release-identity.judge.test.mjs:298) reports attention and nonzero exit after a mid-fetch edit. Add a mid-fetch HEAD/receipt replacement case with the fix. Current outcome: **1 failure**.

## Executed Verification

Runtime: Node v24.20.0; installed Vitest v4.1.10. No dependency installs.

Final focused command, run from the review worktree:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner scripts/lib/release-identity.test.mjs scripts/lib/release-identity.judge.test.mjs scripts/lib/hostinger-build-status.test.mjs scripts/lib/hostinger-deploy-config.test.mjs --maxWorkers=2 --no-cache --reporter=verbose
```

Result at 19:11:45 Australia/Brisbane: **exit 1; 63 tests; 55 passed, 8 failed; 16.84 seconds**. All original 43 focused tests passed. The new judge file has 20 cases: 12 passing controls and 8 intentionally retained failing contract assertions. These are normal failing tests, not skips or expected-failure annotations. They require implementation fixes before integration can pass the test gate.

The preliminary two-file run before adding the explicit wrong-build-SHA case exited 1: 55 tests, 48 passed and 7 failed, 16.29 seconds. Both runs used maxWorkers=2. Supporting commands included git status --short, git log -1, scoped git diff, rg/Get-Content inspection, Node package-resolution checks, SHA-256 source checks, and temporary-directory cleanup inspection. A diagnostic require.resolve of `vitest/vitest.mjs` returned ERR_PACKAGE_PATH_NOT_EXPORTED; the verified direct local CLI path above ran successfully. This was not a project defect.

Confirmed passing behavior: normal mirrored identity and clean receipt; prior receipt invalidation before failed checks or missing npm invocation; nonzero Astro child failures; matching synthetic status; missing/timeout/mismatched live identities produce attention; a Hostinger runtime timeout prevents overall ok; dirty source or mismatched origin/main stops deployment before account lookup; failed live identity verification leaves the synthetic request pending and causes no automatic retry.

Fixtures copy the real wrappers, identity helper, mirror, and runtime/config helpers byte-for-byte. Only npm's child steps, Astro compilation, and Hostinger API/fetch are synthetic boundaries. Fixture artifacts contain a tiny text input, not the website. Git repositories/remotes are temporary local directories. Fixture children use an environment allowlist and no real credentials; Hostinger calls are in-process stubs, and fetch/socket boundaries reject real network access. No real build, full check, deployment, public mutation, or Hostinger MCP call occurred. The fake deployment POST is only a local call log, not an API request.

Both owned command sessions completed. All temporary `aft-release-judge-*` directories were removed and their absence checked; no servers or detached processes were launched. Existing workspace build/report output was not a fixture target.

## Source Fingerprints

SHA-256 values were unchanged between initial inspection and the completed focused run:

| File | SHA-256 |
| --- | --- |
| scripts/lib/release-identity.mjs | 745E01169E4012D46BF1ED16514C348CDC27CA5BC61EB4F86717AA00D82DA9C9 |
| scripts/lib/release-identity.test.mjs | B28BE909A4FD7B9F086852A2380F05E7FE8C7E28DBEACE95FF048A4F3616AD4D |
| scripts/build-site.mjs | 5E9C1C7F69EC70AA70F593EF57584B7847007F535EAA2D7A2B1539FB15D2E626 |
| scripts/run-verified-check.mjs | C740D89974591813CC2019E07804C706239A90026FE199A465530D900DC168B3 |
| scripts/hostinger-node-deploy.mjs | 36F5FCDADF01CDFE7CDE239A56B788359B817FB25DB4C44BFCA9247A26AE3B4B |
| scripts/hostinger-status.mjs | 7DDD5BF8BC231BCC810F3AF2C53C08BDB6DACBC5CA3967713DBE09B147AF8FAA |
| package.json | 2A1FB51BB2B99978E20F0DD538DF02A845796445DCC29F0EB293BC571458F74F |

## Untested And Pending

The actual full check, actual Astro compilation, hosted Git metadata availability, live _build.json serving/cache behavior, Hostinger build-source correspondence, live Ask/API/MCP/sitemap behavior, and automation reconciliation remain unverified here. The reported Hostinger MCP timeout and lack of a full check for this uncommitted implementation remain parent-provided pending evidence, not independently diagnosed incidents. No deployed-source claim is made.

Package build/check wiring was inspected: build points to build-site.mjs; check points to run-verified-check.mjs; check:steps retains the earlier ordered full gate. That structural inspection is not execution of the full gate. The parent retains automation reconciliation and integration ownership. Fix and rerun these focused assertions, then obtain the separately required clean-SHA full-check and live release proof before any release approval.

## Independent Re-review After Parent Fixes

2026-09-06, same worktree and HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25`, revised uncommitted implementation. This section supersedes the earlier test outcomes for this revised source; the original red baseline remains intact above. **All eight original red assertions now pass unchanged. One additional P2 aggregation failure remains, reproduced below. No overall OP-01, full-check, or release approval is granted.**

The only change to existing judge fixture code is in seedProof: construct the identity before the receipt and pass `buildIdentity: identity` to createCheckReceipt. This is the legitimate new API contract, not an assertion relaxation. One new test was added for the real status aggregation defect introduced by using two independent post-fetch source checks. Implementation, package, manifest, and original unit-test files were not edited by this sidecar.

### RI-J6 [P2]: Overall status ignores a failing final tested-source check

Location: [scripts/hostinger-status.mjs:126](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/hostinger-status.mjs:126), with the two captures at lines 121-123. Confidence: high, reproduced through the real status wrapper and real Git commands.

The repair correctly moves source capture after fetch, but deployedSource and testedSource now use separate captures. An edit between them makes testedSource fail while deployedSource retains the first clean snapshot. The overall status expression checks deployedSource and nodeRuntime but omits testedSource, so the completed report is internally contradictory:

```text
Status: ok
testedSource: attention (current Git source is dirty or unavailable)
deployedSource: ok (tested and deployed source <fixture SHA>)
```

Consequence: current dirty source is explicitly detected, yet the status command still signals success. This is a new aggregation case, not a failure of the original mid-fetch assertion; that assertion now passes.

The new case at [judge test:306](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/release-identity.judge.test.mjs:306) uses a fixture-local scheduling hook that delegates to the real execFileSync, then changes the fixture input after the first completed Git scan. It does not stub the validators or Git results. The second real capture detects the edit, establishing that the ignored failure is present in the report before aggregation.

Minimal task: include `checks.testedSource?.ok` in the overall success requirement. Do not allow an explicitly failing source check to be overridden by an earlier successful check. Acceptance: the new case reports attention and exits nonzero; all 68 other focused cases remain green. Current outcome: **1 failing test** at line 328. The implementation remains parent's responsibility.

### Original Finding Recheck

| Finding | Independent result on repaired implementation |
| --- | --- |
| RI-J1 | The three original dirty/missing/mismatched-build assertions pass. run-verified-check.mjs:10-16 reads both mirrors and supplies build evidence; release-identity.mjs:73-78 validates clean matching build identity and the check time interval. Parent added five pure receipt cases for missing/dirty/wrong-SHA/before-window/after-window builds, all passing. |
| RI-J2 | Both hidden-index-flag cases pass. release-identity.mjs:30 detects lowercase assume-unchanged flags and S skip-worktree flags without modifying the index. |
| RI-J3 | Foreign Git environment case passes. release-identity.mjs:14-16 rejects redirect/index selectors; lines 23-27 also verify the real repository root against cwd. Linked-worktree/alternate-index positive compatibility was inspected structurally, not newly exercised. |
| RI-J4 | Missing dist/client now exits nonzero before mirror import at build-site.mjs:13. The original missing-client, child-failure, and clean mirrored-build cases pass. |
| RI-J5 | The original mutation-during-fetch assertion passes because status captures source after fetching at hostinger-status.mjs:121-123. The newly separated final snapshot exposed RI-J6 above. |

Exit-policy limit: run-verified-check.mjs:26 still propagates a successful child as exit 0 even when its receipt is unverified. The original RI-J1 receipt/deployment-boundary assertions now pass; the earlier recommendation for a nonzero release-check exit on unverified evidence was not implemented. Do not treat a diagnostic check exit 0 alone as clean-SHA release proof. This rerun does not establish a separate accepted diagnostic/release command policy.

### Re-review Commands And Outcomes

Both runs used the exact four-file focused command in Executed Verification above, with `--maxWorkers=2 --no-cache --reporter=verbose`, Node v24.20.0, and Vitest v4.1.10:

- At 19:17:55 Australia/Brisbane: **exit 0; 68/68 passed; 21.55 seconds**. This includes the original 43 focused tests, five parent-added receipt cases, and all 20 unchanged judge cases after adapting seedProof.
- At 19:19:26 Australia/Brisbane, after adding only RI-J6's case: **exit 1; 68 passed, 1 failed, 69 total; 22.89 seconds**. All original eight red assertions remain green. Only the new final-source aggregation assertion fails.

Both command sessions completed, and all owned temporary fixture directories were removed. No full build, full check, live Hostinger/MCP request, deployment, public mutation, credential access, or install was performed. The real wrappers still ran solely against isolated synthetic build/API boundaries and temporary Git repositories. Shared source/build output was not used as a fixture target.

### Re-reviewed Source Fingerprints

SHA-256 values captured for the repaired source before the rerun:

| File | SHA-256 |
| --- | --- |
| scripts/lib/release-identity.mjs | EAF514B3CCF8C6A2C188CDB2A83D83A7823A3D1E396833D0FC840285FE864475 |
| scripts/lib/release-identity.test.mjs | 88B853FDBFA059C30A4C7D9266E5FC9AE4227F313DA46A1CD999580CAA692FB0 |
| scripts/build-site.mjs | 823FE1AB4AFC66D84418C2B720239203D514B5E99F5A088101C45526C66EACC9 |
| scripts/run-verified-check.mjs | 74F862E0F1A7AA26D8463FEFF6FD2A45B96AEEEA0D4D5BF7B30703535174DEAF |
| scripts/hostinger-node-deploy.mjs | 36F5FCDADF01CDFE7CDE239A56B788359B817FB25DB4C44BFCA9247A26AE3B4B |
| scripts/hostinger-status.mjs | 4D5861C9FE70BF871AF3C1BCB99A3727676B2D84066EC1BF598236775B627E9A |
| package.json | 2A1FB51BB2B99978E20F0DD538DF02A845796445DCC29F0EB293BC571458F74F |

Remaining coverage limits include the actual full check/compilation, live identity delivery and deployed-build correspondence, automation reconciliation, concurrent receipt replacement, and an explicit wrapper-level test for disagreeing mirror files. None is inferred passed from these focused cases. The parent must integrate and rejudge RI-J6, then retain the independent clean-SHA and live-proof gates.

## Final Focused Closeout After RI-J6 Fix

2026-09-06. The parent added the required `checks.testedSource?.ok` condition to [scripts/hostinger-status.mjs:126](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/hostinger-status.mjs:126). Overall success now requires base account evidence, runtime proof, tested-source proof, and deployed-source proof. This section supersedes the preceding red RI-J6 outcome for the revised implementation; prior runs remain historical evidence.

Executed the same four-file command with `--maxWorkers=2 --no-cache --reporter=verbose` at **19:22:46 Australia/Brisbane**. Result: **exit 0; all 69 tests passed across 4 files; 22.67 seconds**, Node v24.20.0 and Vitest v4.1.10. The suite contains 48 existing/parent unit cases and 21 judge cases. RI-J6's second-source-check failure case passes, as do all eight original red assertions and the positive controls. No tests or fixtures were edited or added for this final run.

The reproduced implementation findings RI-J1 through RI-J6 are resolved within this bounded focused review. This is not overall OP-01 approval or authorization to release. The parent/owner retains integration, full-check, and live-proof judgment; no actual build, full check, live deployment, or automation reconciliation was performed by this sidecar.

Policy clarification supplied by the owner for this closeout: development full checks may intentionally exit 0 on dirty source while retaining an unverified receipt. Deployment must always require a verified receipt, never a successful development command exit alone. This explicitly resolves the earlier exit-policy question; the development exit behavior is not treated as an outstanding implementation defect under that clarified policy. The focused receipt validators and real deployment-wrapper rejection cases remain green.

Final source SHA-256: hostinger-status.mjs `3EDD5EB0105BC60AFCC5C9D98809FB03D0FF4877607E7EACE58BAAAC2C4D9520`. Unchanged judge-test SHA-256: `5F5845544E9287263A823B0FFB4E31F82D5E16B136124B3DFC1691B6007DFD40`. Both were checked before and after the run. Other reviewed implementation hashes at run start match the preceding re-review table. Only this report was appended in the final pass; implementation, package, manifest, tests, and existing build output were not changed by this sidecar.

The owned test command exited normally. All temporary `aft-release-judge-*` directories were removed and absence checked. No owned processes or servers remain. Bounded sidecar work is closed; actual release remains pending the separate owner judge, full-check, and live-proof gates.
