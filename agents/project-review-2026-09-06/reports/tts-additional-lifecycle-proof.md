# TTS Additional Lifecycle Proof

Date: 2026-09-06, Australia/Brisbane. Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review` (R below). Branch: `codex/gpt6-review-implementation`. Observed HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`. Tests exercise the current dirty source, not HEAD alone.

## Scope

Only the two BR-02 test gaps in [implementation-batch-two-judge.md:84](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/reports/implementation-batch-two-judge.md:84) were addressed. Requested change: add mounted EPUB parser races and controlled Worker constructor/postMessage failures, retaining the existing component and virtual-origin harness. No runtime defect was reproduced by the added cases; no runtime patch is proposed.

Read root and campaign instructions, campaign browser-runtime `AGENT.md`, `reference.md`, tasks and worklog, the BR-02 campaign acceptance entry, and `docs/tts-browser-import-security.md`. Inspected the actual component's import/worker lifecycle, chapter queue, EPUB parser and existing EPUB fixture tests. The memory registry search supplied no relevant evidence.

Only `R/src/components/BrowserTtsLifecycle.test.ts` and this report were intentionally edited. Harness controls remain inside the assigned test file; no additional harness file was needed. All 35 pre-existing tests were retained. Component/runtime files, campaign/task states, worklogs, dependencies and other agents' dirty files were not edited by this work.

## Mounted Evidence

The real React component and real chapter queue mount in headless Chromium at `http://tts.test/`. Every page request is fulfilled locally by the existing Playwright route. The existing esbuild harness bundles in memory with `write: false`; no application build, server, model download, inference call or remote service was run.

### Awaited EPUB Result

[The test-only module wrapper](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/BrowserTtsLifecycle.test.ts:96) delegates to the real EPUB parser. A locally created, stored ZIP contains the EPUB mimetype, container, package/spine and one XHTML chapter. The wrapper holds the component-facing parser promise only after the real parser has accepted that archive. It does not substitute fabricated chapter results or delay `File.arrayBuffer`.

[Four mounted tests](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/BrowserTtsLifecycle.test.ts:517) establish:

| Scenario | Asserted result |
| --- | --- |
| Positive deferred import | Real parsed title/text are available inside the held parser result, but no chapter or import action is published until release; release publishes exactly one chapter and one import action. |
| Cancel, then release | Existing chapter name/text and count remain unchanged; no stale chapter or import action appears. |
| Replace, then release old parse | A second valid EPUB publishes its own chapter first; resolving the old parse does not overwrite/append chapters or add another import action. |
| Unmount, then release | The root stays empty and no import action appears after the old parser returns. |

The tests wait for the actual parser gate before cancelling/replacing/unmounting. They then verify the parser returned and wait for the component's `finally` to clear the input bytes before making negative publication assertions. All cases assert zero workers. The import-complete signal is the existing `aft:tool-action` detail `clarityEvent: 'tts_document_import'`; the tests observe that event rather than inventing an `importcomplete` event.

This executes the operation-identity check after the awaited parser at [TextToSpeechAudiobookGenerator.tsx:999](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/TextToSpeechAudiobookGenerator.tsx:999). Confidence is high for these controlled mounted publication races.

### Worker Throws

[One-shot Worker controls](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/BrowserTtsLifecycle.test.ts:64) record constructor attempts and attempted messages, then throw `SecurityError` from construction or `DataCloneError` from the selected `postMessage` type. Successful calls retain the original fake-worker behavior.

[Ten mounted cases](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/BrowserTtsLifecycle.test.ts:264) cover:

| Phase | Throws covered | Cases |
| --- | --- | ---: |
| Initial load | Constructor; load postMessage | 2 |
| Kokoro fallback from pending preload | Constructor; fallback load postMessage | 2 |
| Kokoro fallback from active generation | Constructor; fallback load postMessage | 2 |
| Generation | Initial ready worker; fallback after pending stall; fallback after active stall; reused loaded worker on chapter two | 4 |

Each case asserts one consumed fault, the intended error, exactly one settled queue run, one failed chapter attempt, `isRunning() === false`, zero watchdogs/abort listeners, disposed worker handlers, and enabled retry/generation controls. Deliberately replayed stale ready/result/error callbacks cannot change the settled snapshot, unlock an extra operation or create an MP3. The same old callbacks cannot disturb a live retry. A real queue retry then succeeds exactly once, produces one chapter-complete action, and ignores a duplicate result. The reused-worker case preserves the earlier MP3 URL/result and its one generation attempt.

This exercises the existing catches at component [initial load:602](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/TextToSpeechAudiobookGenerator.tsx:602), [fallback load:412](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/TextToSpeechAudiobookGenerator.tsx:412), and [generation:459](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/TextToSpeechAudiobookGenerator.tsx:459). Settlement counters observe the public queue `run` and `retry` promises; they do not replace queue or component logic. Confidence is high for failure recovery and externally observable single settlement in these scenarios.

## Executed Tests

Runtime: Node `v24.20.0`, Vitest `4.1.10`, Chromium `151.0.7922.34`.

Full focused-file command: `node node_modules/vitest/vitest.mjs run --configLoader runner src/components/BrowserTtsLifecycle.test.ts --reporter=dot`.

New-case command: the same command with `-t 'controlled|awaited'`; the first development pass used `--reporter=verbose` instead of `--reporter=dot`.

| Local start | Run | Counts | Exit | Reported duration |
| --- | --- | --- | ---: | --- |
| 13:16:03 | Baseline focused file | 35 passed; 0 failed/skipped | 0 | 14.47 s |
| 13:19:27 | First new-case pass | 9 passed; 5 failed; 35 deselected | 1 | 9.32 s |
| 13:20:18 | Corrected new-case pass | 14 passed; 0 failed; 35 deselected | 0 | 9.09 s |
| 13:21:00 | Complete expanded focused file | 49 passed; 0 failed/skipped | 0 | 21.36 s |
| 13:21:57 | Repeat complete expanded focused file | 49 passed; 0 failed/skipped | 0 | 21.32 s |

The development failures were test expectations, not product failures: four expected the EPUB heading to remain in narration even though the parser intentionally separates it into the chapter title, and one expected the original generate-button label after a completed MP3 changes it to `Generate chapter set again`. Source inspection confirmed both behaviors; only test assertions were corrected. No coverage was removed or assertion relaxed to a generic success check.

Final coverage is **49 distinct tests: 35 existing plus 14 added**, not a sum of repeated executions. All final tests include the existing no-pageerror assertion. Every test process and owned browser exited before this report was written. No full test suite, typecheck, build or fullcheck was run.

## Source Binding

SHA-256 reads before and after execution matched for all five inspected runtime files. Final test-file hash binds the reported runs to these test edits.

| Path under R | SHA-256 |
| --- | --- |
| `src/components/BrowserTtsLifecycle.test.ts` before edits | `0857325D7F05B69E82E4477B21B71212470458711DF705D0B13E49C045562F39` |
| `src/components/BrowserTtsLifecycle.test.ts` after edits | `C91CFFA1EBEEB9C43248476073F64DB98BDE11DA6DCB39D89903080A5F9BDF1E` |
| `src/components/TextToSpeechAudiobookGenerator.tsx` | `C0C9522FB1225AAC334F11BEB6613A857A06404069D06B5A5FB361EEEAB0D8DF` |
| `src/lib/browserTtsChapterQueue.ts` | `B8EA66E676376DEA8FF17608EE93579954FEDFA2AE54758B6C1EA6B0F02B6309` |
| `src/lib/browserTtsEpubImport.ts` | `C810345E0A051D8729E4DB012CE142F702646A8395E277978FE876564AD86A9A` |
| `src/lib/browserTtsImport.ts` | `2B1E7F1905A8A2C522C6B1D541D7EADCD2544E4AC91C5D1641BDC82212D80AD0` |
| `src/lib/browserTtsInput.ts` | `D62C4E20C3A92985CEC8270461D2F5E6FD2733351FF17B5C967ADD92CB997567` |

Additional read-only checks: `git rev-parse HEAD`, `git branch --show-current`, `git status --short`, `node --version`, scoped `rg`/`Get-Content`, structured campaign JSON selection and `Get-FileHash`. A session-memory diff confirmed the original test bodies were retained; only the harness description and unconditional Worker constructor/postMessage implementations were replaced, alongside additions.

## Limits

- The deferred boundary is the awaited EPUB parser result, not a separately delayed module download/evaluation or a cancellation inside zip.js. The positive EPUB is a small synthetic one-chapter stored archive, not a full-size book or parser resource-bound test.
- Replacement is tested with the newer EPUB already published before the old parser returns. A still-pending replacement and rejected deferred parser promise are not separately covered by these additions.
- Worker events, constructor/postMessage exceptions, watchdog callbacks and four-byte MP3 buffers are controlled. These are mounted component/queue tests, not actual worker execution, inference, decodable audio, download/ZIP verification, real 90-second elapsed-time stalls or memory measurements.
- Only the installed headless Chromium runtime was exercised. No Chrome/Edge user-profile, Firefox/WebKit, mobile-device, GPU or real-model compatibility claim follows. The new throw cases use chapter mode; they do not separately establish single-MP3-mode recovery.
- Local request fulfillment prevents page requests reaching external services in this harness; it is not production privacy/network proof. No installation, application build/server, external network research, model/provider access, deploy, release, indexing, publication or campaign-status change was performed. The owner's running main browser build was not disturbed or revalidated.
- This report supplies the specifically requested additional BR-02 test evidence only. It is not implementation approval, full campaign acceptance, production proof or TTS beta-exit evidence.
