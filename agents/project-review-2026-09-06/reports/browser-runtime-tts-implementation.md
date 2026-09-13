# BR-02 TTS Runtime Implementation

Date: 2026-09-06. Source stable; focused evidence ready for coordinator and Release Judge review. Not self-approved and not a live-release or model-readiness approval.

## Scope And Revision

- Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.
- Branch verified: `codex/gpt6-review-implementation`.
- HEAD observed during verification: `243d71d1d832b398cba86d5c7fcc70deefa25f25`. The worktree has concurrent coordinator/specialist changes; the TTS patch is uncommitted. The campaign's historical review baseline is `90d6dcab0580a91ca66382f2414d95e8817469e5`, not a claim that current HEAD still equals that baseline.
- Read the root and campaign AGENTS, browser-runtime BR-02 task, `reports/browser-products.md`, `docs/tts-browser-import-security.md`, TDD guidance, actual component, import/input helpers, chapter queue, parser/queue tests, and TTS evidence scripts.
- Actual component: `src/components/TextToSpeechAudiobookGenerator.tsx`; no `BrowserTts*.tsx` product component exists. The new focused test is `src/components/BrowserTtsLifecycle.test.ts`.
- Owned edits only: that component/test, `src/lib/browserTtsInput.ts`, `src/lib/browserTtsInput.test.ts`, `src/lib/browserTtsImport.ts`, `src/lib/browserTtsImport.test.ts`, and this report.
- No edits to JSON-to-CSV, OCR, transcriber, workers, shared type contracts, package files, campaign manifest/task board, shared worklog, or other specialists' files. No install, full suite, shared build/check, commit, deploy, model download, or public action performed by this specialist.

## Confirmed Findings And Fixes

Source references below are relative to the exact worktree above and are one-based.

| Finding | Evidence And Implementation | Confidence / Consequence |
| --- | --- | --- |
| BP-03: pre-ready worker error dropped the pending chapter promise | Real mounted component reproduced no Retry button and a still-running chapter after `{type:'error'}`. `src/components/TextToSpeechAudiobookGenerator.tsx:322` rejects each distinct pending/active job before clearing references; `:617` guards chapter settlement and removes its abort listener once. | High for controlled runtime. Previously the queue could remain locked indefinitely. |
| Native worker errors retained resources; old-worker callbacks affected replacement workers | Corrected RED run showed retained native-error workers/listeners and an old error terminating the fallback worker. Cleanup at `src/components/TextToSpeechAudiobookGenerator.tsx:331` detaches handlers, clears watchdog/model references, and terminates. Identity-guarded callbacks at `:565` ignore prior-worker messages/errors. | High for fake-worker browser reproduction. Prevents stale worker callbacks from failing a replacement job. |
| Timeout, Stop, unload, and unmount need consistent settlement | `src/components/TextToSpeechAudiobookGenerator.tsx:390` preserves the existing single Kokoro compatibility fallback, then terminally rejects timeout jobs; `:432` settles cancellation/reset. Unmount at `:303` invalidates imports, aborts/settles jobs, disposes resources, and revokes page-owned audio URLs. Async queue UI updates are mounted-guarded at `:656`. | High for tested component/queue paths. Completed MP3 results are retained on failure, retry, Stop, and model unload; URLs are released on page unmount. |
| BP-07: unsupported/oversized files were fully read before metadata validation | Browser File doubles confirmed `arrayBuffer` was called once on rejection. Preflight now runs at `src/components/TextToSpeechAudiobookGenerator.tsx:960`, before the read at `:971`. `src/lib/browserTtsImport.ts:94` exposes metadata-only validation reused by the byte validator at `:125`. `src/lib/browserTtsInput.ts:15` validates TXT size/MIME and optionally exact bytes read. | High: browser tests assert zero reads for all metadata rejection fixtures. Parser byte equality/content checks remain after the bounded read. |

No cross-product lifecycle abstraction was introduced. Existing single-file unsupported/response analytics categories were preserved. The chapter queue and worker message contracts were not changed.

## Limits And Input Contract

- TXT: **65,536 bytes**, unchanged (`MAX_TTS_TEXT_FILE_BYTES`). Markdown: **65,536 bytes**, unchanged. EPUB: **8,388,608 bytes**, unchanged.
- Narration and aggregate chapter limit remains **10,000 characters**. Archive entry, expansion, markup, compression-ratio, and chapter-count limits remain unchanged.
- TXT MIME handling now requires the actual `text/plain` media type, still accepting blank MIME and legitimate parameters such as `text/plain; charset=UTF-8`. It rejects `text/plain-not-really`, which the previous prefix check accepted.
- Existing Markdown and EPUB MIME allowlists are unchanged. Case-insensitive extensions still work.
- Non-integer, negative, non-finite, zero, oversized, unsupported-extension, and incompatible-MIME metadata fail before `arrayBuffer`.
- TXT now also rejects a mismatch between metadata size and returned bytes. Markdown/EPUB retain their existing exact-byte checks and structured content/security parsers.
- Import cancellation/replacement/unmount invalidates the operation. Delayed reads cannot publish text or a completion action; returned buffers are wiped in `finally`. An already-started `File.arrayBuffer()` itself is not abortable here, but its admitted size is bounded. No claim of immediate cancellation of the underlying browser read.
- Exact-ceiling metadata tests cover TXT/Markdown/EPUB. A valid 65,536-byte Markdown document imports through the real component. TXT's independent 10,000-character cap still applies even when file-byte metadata is admissible. A full 8 MiB EPUB UI fixture was not run; friendly/hostile EPUB parsing and the exact 8 MiB metadata boundary were tested separately.

## Executed Checks

All commands ran in the stated worktree using existing dependencies. Node was `v24.20.0`; Vitest reported `v4.1.10`. The installed Playwright Chromium revision is `1234` (manifest browser version `151.0.7922.34`).

| Command / Stage | Result |
| --- | --- |
| `npm.cmd test -- src/components/BrowserTtsLifecycle.test.ts` initial RED | 23 failed / 7 passed. File-read rejection bugs reproduced. Eleven worker tests initially used an incorrect button locator and are not counted as valid worker defect evidence. Locator corrected before the next RED run. |
| `npm.cmd test -- src/components/BrowserTtsLifecycle.test.ts -t "settles a pre-ready\|ignores an old worker" --reporter=verbose` corrected RED | All four selected tests failed for the intended runtime outcomes: missing Retry, retained native-error resources, and stale error terminating fallback. Other tests were filtered out, not disabled. |
| `npm.cmd test -- src/lib/browserTtsInput.test.ts src/lib/browserTtsImport.test.ts` RED | 5 failed / 11 passed: four malformed TXT sizes accepted, plus the not-yet-implemented metadata-only API. |
| `npm.cmd test -- src/components/BrowserTtsLifecycle.test.ts src/lib/browserTtsInput.test.ts src/lib/browserTtsImport.test.ts --reporter=verbose` first GREEN | **46 passed**, three files. |
| `npm.cmd test -- src/components/BrowserTtsLifecycle.test.ts --reporter=verbose` expanded browser coverage | **35 passed**, including preservation, fallback outcomes, stale retry events, and exact-ceiling Markdown import. |
| `npm.cmd test -- src/components/BrowserTtsLifecycle.test.ts src/lib/browserTts src/lib/kokoroBrowserText.test.ts src/lib/mp3Encoder.test.ts` final scoped regression | **113 passed**, 14 files, 15.01 seconds. No test skipped in this run. This is TTS-only, not a full repository suite. |
| Scoped `tsc.cmd` and `tsc6.cmd` commands below | Both passed. An initial guessed `typescript/bin/tsc` path was absent; checked the installed wrappers instead. First valid compiler run caught one test-only implicit-any annotation; fixed before both successful runs. |
| `npm.cmd run tts:browser-check` | **PASS**. Static source/asset contract check, not live-browser/model proof. |
| `npm.cmd run tts:feature-soak` | **1 passed**: 100 chapters / 10,000 characters / one active generator / audio-only ZIP with mock MP3 bytes. Not inference or memory-readiness proof. |
| Scoped `git diff --check` | Passed; Git emitted only existing LF-to-CRLF normalization notices. |

The scoped compiler invocation, run separately with both `node_modules/.bin/tsc.cmd` and `node_modules/.bin/tsc6.cmd`:

```powershell
node_modules/.bin/tsc.cmd --ignoreConfig --noEmit --skipLibCheck --strict --module esnext --target es2022 --moduleResolution bundler --jsx react-jsx --types node,vitest/globals src/components/TextToSpeechAudiobookGenerator.tsx src/components/BrowserTtsLifecycle.test.ts src/lib/browserTtsInput.test.ts src/lib/browserTtsImport.test.ts
node_modules/.bin/tsc6.cmd --ignoreConfig --noEmit --skipLibCheck --strict --module esnext --target es2022 --moduleResolution bundler --jsx react-jsx --types node,vitest/globals src/components/TextToSpeechAudiobookGenerator.tsx src/components/BrowserTtsLifecycle.test.ts src/lib/browserTtsInput.test.ts src/lib/browserTtsImport.test.ts
```

The 14 final test files comprise `BrowserTtsLifecycle`, `browserTtsInput`, `browserTtsImport`, `browserTtsMarkdownImport`, `browserTtsEpubImport`, `browserTtsChapterQueue`, `browserTtsChapters`, `browserTtsArchive`, `browserTtsEstimate`, `browserTtsModels`, `browserTtsPreferences`, `browserTtsFeatureSoak`, `kokoroBrowserText`, and `mp3Encoder`.

Generated command evidence:

- `output/tts-audiobook-pilot/browser-check.json` and `browser-check.md`.
- `output/tts-feature-campaign/chapter-soak/latest.json` and `latest.md`.
- Detailed RED/GREEN command output is in this task's tool transcript; no complete raw browser-test log or screenshot artifact was saved by this specialist.

## Acceptance Evidence And Missing Proof

- The browser suite mounts the actual React component and actual chapter queue, not AST-extracted handler strings. It bundles only its test entry in memory (`write: false`); it does not generate shared Astro build output.
- Worker events, 90-second watchdog triggers, selected File reads, and tiny MP3 result bytes are controlled fakes. DOM actions drive generation, Retry, Stop, unload, and import. Tests assert queue settlement/counts, unlocked retry, attempts, retained result identity/URLs, detached worker handlers, cleared watchdog/abort listeners, no stale publication, and no uncaught page exceptions.
- Every page request is intercepted and fulfilled locally. This prevents downloads during the test, but is not a production privacy/network sentinel or real worker-loading test. Synthetic four-byte MP3 results prove preservation of the result reference and download availability, not decodable audio or listening quality.
- **Missing live proof:** production/Astro integration, actual worker construction and inference, cold/warm model downloads, real download/playback round trips, full-size EPUB UI import, 10,000-character real speech, actual 90-second wall-clock stalls, CPU/GPU memory, browser network/storage/privacy sentinels, and named Chrome/Edge/Firefox/WebKit/physical Android/iOS/Safari readiness. No device or beta-exit claims are made.
- Minimal remaining task: coordinator runs integrated build/check when other lanes are stable; independent browser QA/Release Judge evaluates BR-02 against the focused evidence and schedules real-runtime proof through BR-04. Preserve existing noindex/beta gates. Only the Release Judge can approve implementation or release.

TTS source stability and the 113-test green result were reported to the coordinator before writing this report. No further component/helper edits are planned for this handoff.
