# BR-03 Independent Local Task Acceptance

Date: 2026-09-06. Independent Release Judge verdict: **BR-03 LOCAL APPROVE**. No blocking finding in the exact input-bounds, operation-identity, cancellation, stale-message, language-fixture and retry contract. Confidence: high for the source-bound local behavior tested below. This does not approve deployment or the whole current worktree.

## Contract And Scope

Workspace: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus existing dirty source. HEAD alone is not the implementation identity.

Exact campaign BR-03 completion: "Delayed imageA result never appears under imageB/languageB. Cancel/unmount terminates worker; corrupt/oversized pixel and byte inputs fail before dangerous allocation; language fixtures and retry pass."

Read the campaign instructions and exact BR-03/SEC-02 entries, browser-runtime task instructions, OCR implementation and runtime follow-up review, relevant browser acceptance context, and the actual component/helpers/tests. SEC-02 is locally `approved` in the campaign and its independent [recorder judgment](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/reports/clarity-recorder-judge.md). Its local dependency is satisfied. An older browser-runtime note retaining an open SEC-02 dependency does not overturn that explicit judgment; live privacy closure remains separate.

## Acceptance Findings

| Requirement | Source and independent result |
| --- | --- |
| Byte and pixel preflight | PASS. `src/lib/browserOcrInput.ts:1,19,29,124` bounds metadata and actual bytes to 10,485,760, image area to 8,000,000 pixels, and each side to 8192. Encoded PNG/JPEG/WebP structure and dimensions are checked before browser decode. Decoded dimensions are rechecked before canvas sizing. Parser tests cover exact boundaries, overflowing/zero dimensions, truncated containers/prefixes, animation, duplicate/conflicting frames, actual bytes disagreeing with metadata, and pre-aborted input. |
| Mounted rejection before allocation | PASS. Actual mounted component rejects oversized file metadata with zero reads, and huge PNG/JPEG/WebP headers after reading but with zero decodes/workers. Each case recovers on valid replacement. Corrupt compressed pixels with bounded headers fail at browser decode before worker startup. Unexpected decoded dimensions close the bitmap and never create a worker. These are synthetic inputs and real browser decoding, not dangerous full-size allocations. |
| A/B operation identity | PASS. `AiBrowserTool.tsx:684` clears identity before abort; `:707,717,734,739,743` gate progress, result/history, error and final loading state. Mounted image-only, language-only and combined replacements ignore stale A success, rejection, progress and finalization before/during/after B. B remains busy until B finishes; only the current result enters history. Foreign/duplicate/malformed worker packets do not publish results or duplicate history. |
| Cancellation and unmount | PASS. `browserOcrWorker.ts:25,36,49,52` owns the native handle immediately and settles once, removes timer/abort callbacks, clears worker listeners and terminates. Cancel/retry and unmount were independently tested at load, loadLanguage, initialize and recognize, with late messages injected afterward. No later stage starts after unmount. `AiBrowserTool.tsx:692,783,797,835` connects replacement and Cancel OCR to that boundary. |
| Pending read/decode/encode cleanup | PASS. Existing mounted cases check cancelled header reads and bitmap arrival after unmount. Two new adversarial mounted cases additionally hold PNG encoding across cancellation and B/French startup, and hold normalized-PNG reading across unmount. Late A cannot create a worker, publish a result or clear B's loading state. Bitmaps close; temporary canvases reset to zero dimensions. |
| Partial failures and recovery | PASS. Worker rejection and watchdog permit retry. A new mounted case injects progress containing partial text, rejects with raw worker details, then resolves a retry with non-string text. Neither partial text nor raw error details becomes result/history; Copy remains disabled. A third valid attempt clears the error, produces exactly one history result, and leaves all three workers terminated with no callbacks/timers/listeners. |
| Language fixtures | PASS. All six selections (`eng`, `spa`, `fra`, `deu`, `ita`, `por`) reach the controlled worker and rendered result language. This proves selection/operation provenance and UI behavior, not native multilingual recognition accuracy. |

No corrective source task is requested for BR-03. Parent may record its local task approval. The minimal remaining integration action is the already-planned updated full check after EV-03 work, not an expansion of BR-03 into unrelated manual/device/live gates.

## Fresh Executed Evidence

All new runtime proof is under `output/project-review-followup/BR-03-task-judge/` in the stated workspace.

- `node output/project-review-followup/BR-03-task-judge/run.mjs`: exit 0; **69 passed, 15 intentionally filtered/skipped**, three files, Vitest 4.1.10, 55.39 seconds. Parent process/report completed 10:47:20.798 UTC.
- `node output/project-review-followup/BR-03-task-judge/run.mjs bounds`: exit 0; **4 passed**, 8.65 seconds; completed 10:48:17.761 UTC. This corrects the first run's name-filter miss on quoted parameter labels for byte/huge-dimension cases. It does not repeat the complete browser suite; both logs and reports remain retained.
- Total: **73 distinct passing cases: 41 existing parser/input tests, 29 selected existing mounted cases, and three new adversarial mounted cases**. No failed assertion, retry waiver, enlarged deadline, model download or inference run was used.
- All test invocations used `--maxWorkers 1 --no-file-parallelism --no-cache`, the ignored judge-only config and explicit test-name filters. Exact executable/arguments, source hashes and exits are in `report-2026-09-06T10-46-24.565Z.json` and `report-2026-09-06T10-48-08.236Z.json`; detailed results are `focused.log` and `focused-bounds.log`.

Mounted tests execute the actual React `AiBrowserTool` and input helpers in isolated headless Chromium **151.0.7922.34**, with real synthetic image decoding and controlled native-worker messages. The harness fulfills page requests locally; no route forwards a request. Worker replacement is installed before component actions, so no OCR model/core/language network inference occurs. Existing helper/mount code is extracted with the installed TypeScript parser into an ignored generated fixture; only the three independent case bodies are appended. Test-only in-memory component compilation writes no site build or application file. User Chrome is not used.

New cases are inspectable at `mounted-extra.test.ts:175`, `:206`, and `:242`. The judge inspected [mounted-recovery.png](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/BR-03-task-judge/mounted-recovery.png): the valid third result and single history row are visible. This intentionally unstyled component fixture proves mounted state, not production page styling, a whole-site screenshot or native recognition. Page-error collections were empty at teardown.

## Source Binding

Eleven source/test/config paths were byte-hashed before and after both runs, with no change. Every bound file matches its entry in `output/project-review-followup/SEC-01/recheck-2026-09-06T09-54-01.641Z/source-files.json`, the source manifest used by the previous completed 2,405-test full check. This preserves scoped historical integration support without claiming that later EV-03 work or the whole present checkout passed that check.

| Principal file | SHA-256 |
| --- | --- |
| `src/components/AiBrowserTool.tsx` | `d1fc472ac90707d22d6f7e48c62fac8392c75f1f46166e0c2cf9d92b8adb327f` |
| `src/lib/browserOcrInput.ts` | `809821a7fd9b0511f1395c6eb66b77b73ff6cfa434462a5095ba4ebb468a449f` |
| `src/lib/browserOcrWorker.ts` | `8479ef7b08c78ddcd07fafc2cdcb5b5335a8b07cf395c22fca3da197259713b6` |
| `src/components/BrowserOcrLifecycle.test.ts` | `6a49c2847ec35bd8068fd8ba30ead4387fc1537cc5add7fd2fac1ca7b0830770` |
| `src/lib/browserOcrInput.test.ts` | `84fad469c271a53e98850caff6ae62154fa56e4977b4d339f7d3218cdb427963` |
| `src/pages/tools/[slug].astro` | `5ad15a8bc7a39b123ccf167bdfa0fcb73d0c534162273da73a9a256575e67784` |

The JSON reports also bind the untouched offline OCR test, shared content-audit test, package/lock and Vitest config. The real offline inference test was **not executed** in this assignment. Earlier native English/packet-parity evidence is retained as historical evidence, not relabeled as fresh execution here.

## Limits And Cleanup

The worker watchdog starts at worker construction, not during native File read/decode/PNG encoding. Those bounded browser promises are not themselves abortable; tested invalidation prevents their late completion from starting OCR or publishing state, and releases resources when they settle. This is not a claim of immediate native decoder preemption, maximum-size device memory measurement or exhaustive codec fuzzing.

No new model inference, real-device/manual compatibility, live privacy or deployment proof is claimed or required to reopen this bounded local decision. No site build, install, fullcheck, media/model download, external provider call, credential/public action, commit, source/test mutation, coordinator metadata, task-board or worklog change was performed. Existing tests/source remained untouched; new fixtures and logs are confined to the ignored judge proof directory, plus this new report.

Both owned Vitest sessions exited zero and browser teardown completed. Process inventories captured descendants of each owned test PID, including `node.exe`, `esbuild.exe`, `chrome-headless-shell.exe` and console hosts. After each run, matching PID plus creation-time checks found **zero surviving owned processes**: `remainingOwnedProcesses: []` in both reports. The first inventory observed 30 descendants over the run, the bounds-only run 10; no unrelated/parent process was stopped. Temporary bitmap/canvas, worker listener/timer and stale-result cleanup is separately covered by the mounted assertions.

**Final disposition: BR-03 LOCAL APPROVE on the bound dirty source. Deployment remains unapproved; updated whole-worktree integration remains parent-owned.**
