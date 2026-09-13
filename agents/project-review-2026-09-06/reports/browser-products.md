# Browser Products Review

Date: 2026-09-06. Status: evidence_ready for coordinator review, not release approval.

## Scope And Baseline

- `R` = `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.
- `T` = `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`.
- Every `R/...:line` or `T/...:line` below resolves against those exact absolute worktree roots. References are one-based source lines.
- R HEAD and origin/main both verified as `90d6dcab0580a91ca66382f2414d95e8817469e5`.
- T HEAD is the same revision, but the transcriber implementation is dirty/untracked source. Findings against T are **not deployed-product findings**.
- Review only. No application changes, dependency installation, full build/check, commits, deployment, publishing, indexing submissions, purchases, global settings changes, or other-worktree writes were performed. This is the only assigned report written.
- Review method: source inspection, 102 focused existing tests, small synthetic Node reproductions, and a primary WebVTT specification check. No browser UI or physical-device test was executed in this review.
- Coordinator update supplied at close-out: main passed 565 unit tests and 110 smoke tests, with the audit exception remaining. Those results were reported by the coordinator, not independently rerun by this specialist. They do not cover away the targeted defects below; no full model benchmark is needed to complete this review.

### Scope Separation

| Evidence Class | Items | Meaning |
| --- | --- | --- |
| Current-main product defects | BP-01, BP-03, BP-07, BP-08, BP-09, BP-10 | Present in the verified R baseline; no live incident is inferred. |
| Unreleased transcriber product defects | BP-02, BP-04, BP-05, BP-06 | Present only in the inspected dirty T implementation; not deployed defects. |
| Evidence-gate defects | BP-11 in main; BP-12 in the draft | The checks can overstate readiness; this is not a claim of actual indexing failure or data leakage. |
| Missing proof, not a measured failure | Readiness sections and BP-G5 | Full-hour/device/model/privacy measurements remain future acceptance work, not required review execution. |

## Findings

### BP-01 [P1] JSON input-byte limit does not bound the dense output allocation

- Location/scope: `R/src/lib/jsonToCsv.ts:169`, especially lines 170-179; called synchronously by `R/src/components/JsonToCsvConverter.tsx:82`.
- Trigger: an array of small records with mostly distinct keys. The converter unions all keys and allocates every row/column intersection, followed by another set of row strings and the CSV string.
- Evidence: actual conversion of 500 distinct-key records used 6,281 input bytes but created 250,000 cells and 254,279 CSV bytes. A generated 50,000-record input is only 827,781 bytes, below 5 MB, but implies 2.5 billion cells. That large conversion was deliberately NOT executed.
- Confidence: high, direct helper reproduction and allocation path. Impact: a valid small local file can monopolize the main thread or exhaust the tab's memory, losing unsaved work. No exact device crash threshold is claimed.
- Minimal task: reject excessive column count, row-times-column count, nesting depth, and estimated output bytes before dense allocation. Preserve the current small-input behavior; a worker is not a substitute for allocation limits.
- Acceptance: sparse 50,000-key input fails before dense allocation; explicit boundary tests for each bound; ordinary irregular rows, escaping, BOM and delimiters still pass; a browser stress test retains responsive controls and a recoverable error.

### BP-02 [P1, Draft Only] Transcriber deduplication deletes legitimate repeated speech

- Location/scope: `T/src/lib/browserTranscriber.ts:201` (unconditional call at 202), `:157` (word matching); used by `T/src/components/AudioVideoTranscriber.tsx:480`.
- Trigger: any incoming segment starts with the previous segment's ending word(s), including segments separated by silence. This is applied to every incoming segment, not just the five-second block overlap.
- Evidence: completed `{start:0,end:1,text:'Yes.'}` followed by `{start:10,end:11,text:'Yes.'}` and `{start:12,end:13,text:'Yes, proceed.'}` produces only the first segment and `proceed.` at 12 seconds. Actual speech is removed despite no temporal overlap.
- Confidence: high, direct helper reproduction. Impact: transcript and all exports silently omit words, including repeated answers or instructions.
- Minimal task: constrain deduplication to the known overlapping source interval and match time-aligned boundary tokens/segments. Keep raw-to-normalized token indexes aligned; punctuation-only tokens currently make their counts differ. Do not deduplicate ordinary adjacent ASR segments.
- Acceptance: preserve non-overlapping repeated words/sentences; collapse genuine overlapping duplicate speech once; cover punctuation-only tokens, repeated short answers, Japanese/Chinese text, and a sentence spanning 295-300 seconds. Compare against a synthetic known transcript, not merely nonempty output.

### BP-03 [P2] TTS model-load errors orphan pending chapter promises

- Location/scope: `R/src/components/TextToSpeechAudiobookGenerator.tsx:509`, especially 511-520; pending job assignment at `:585`, chapter promise at `:598`.
- Trigger: start chapter generation without a loaded model and receive a normal worker `{type:'error'}` during tokenizer/model loading. The chapter is in `pendingJobRef`, not `activeJobRef`.
- Evidence: the handler clears the pending reference and watchdog but rejects only the active job. An AST-extracted execution of the actual handler returned `pendingChapterRejected:0`, `pendingReferenceCleared:true`, `workerTerminated:true`.
- Confidence: high. Impact: queue.run remains pending, the chapter is not marked failed/retryable, and the visible non-busy error state no longer describes the queue state. This differs from onerror/onmessageerror, which correctly consider pending jobs.
- Minimal task: settle the pending or active chapter job exactly once before clearing references, using the same error lifecycle for model-load and inference failures.
- Acceptance: fake-worker error before ready makes queue.run settle as failed, exposes one retry, leaves no watchdog/listener, and preserves prior chapter MP3s; retry succeeds after a failed load. Also test errors after a watchdog fallback.

### BP-04 [P2, Draft Only] Packet-local resampling distorts the source timeline

- Location/scope: `T/src/workers/transcriber-media.worker.ts:113` through 136, especially `:124`; `T/src/lib/browserTranscriber.ts:133`; absolute ASR time reconstruction at `T/src/workers/transcriber-asr.worker.ts:104`.
- Trigger: source packets whose frame count does not map to an integral 16 kHz sample count, or tracks with timestamp gaps/offsets. Each packet is independently rounded and starts interpolation at phase zero. Packets are appended without positioning them on a timestamp-aligned PCM timeline.
- Evidence: 12,919 packets of 1,024 frames at 44,100 Hz contain 299.978594 seconds, but the current helper produces 300.366750 seconds: +0.388156 seconds within one block. This is a synthetic packetization reproduction, not a measured codec/device run. Five-minute blocks reset to absolute starts, so it would be incorrect to simply multiply this drift by twelve and call that full-hour drift.
- Confidence: high for rounding/phase and omitted gap handling; real decoder packetization remains untested. Impact: caption seek/export timing drifts within blocks; discontinuities or delayed audio can be shifted further because elapsed gaps are discarded.
- Minimal task: preserve fractional resampling phase across packets, position output against source timestamps, and explicitly handle gaps/overlapping packets and the final tail. Evaluate a proven band-limited resampler; separately quantify aliasing rather than asserting recognition-quality loss from code alone.
- Acceptance: packet-size-invariant output within one 16 kHz sample for 44.1/48 kHz mono/stereo; tone/impulse fixtures; leading offset, internal gap and packet overlap; markers near every block boundary over 60 minutes. Report decode timing error separately from ASR alignment error.

### BP-05 [P2, Draft Only] Cancelled WebGPU jobs enter the fallback path and create another worker

- Location/scope: `T/src/components/AudioVideoTranscriber.tsx:419`, `:457` (fallback catches), `:369` (worker creation), `:505` (cancel).
- Trigger: Stop/Reset/file replacement aborts a pending WebGPU load or transcription. The rejection enters a catch that treats every error, including AbortError, as a WebGPU failure.
- Evidence: fallback calls loadSpeechWorker with an already-aborted signal. AST-extracted execution of the real loadSpeechWorker/postAndWaitAsr functions reports `AbortError`, `workersCreatedAfterAbort:1`, `workerRetained:true`. Creation happens before the wait helper checks the signal. This does not prove a second model downloads, but it does prove a worker is recreated and retained after cancellation.
- Confidence: high. Impact: cancellation does not leave all workers unloaded; stale fallback paths can change backend/notice state during a replacement operation. The operation guard in the outer catch arrives too late to prevent those side effects.
- Minimal task: reject AbortError/stale operation before fallback, check signal before creating or terminating shared workers, and dispose a newly-created worker when setup fails. Carry operation/request identity through all completions.
- Acceptance: Stop, Reset, replacement and unmount during load/decode/inference leave zero workers and no stale state changes; same tests during WebGPU-to-WASM retry; genuine WebGPU errors retry exactly once. Check valid and invalid dropped files while busy because dropFile does not share the button's busy guard.

### BP-06 [P2, Draft Only] Caption serialization does not preserve edited plain text

- Location/scope: `T/src/lib/browserTranscriber.ts:226` through 249; editable textarea at `T/src/components/AudioVideoTranscriber.tsx:744`.
- Trigger: edit a caption to contain a blank line or literal markup such as `<test>` or `&amp;`, then export WebVTT. safeCueText replaces arrows and CR only; blank lines and cue markup are emitted verbatim.
- Evidence: the helper emits `alpha\n\nbeta <test> & text` inside one cue unchanged. A blank line ends a WebVTT cue, and literal `<`/`&` need cue-text escaping. This is a format correctness issue, not evidence of executable-script injection. [W3C WebVTT syntax and parsing](https://www.w3.org/TR/webvtt1/#webvtt-cue-text).
- Confidence: high for invalid/lossy WebVTT serialization; no actual player-import test was run. Impact: exported captions can lose text or acquire unintended formatting, even though TXT looks correct. SRT blank-line handling also needs format-specific validation.
- Minimal task: use format-specific serialization, escape WebVTT text, and normalize blank lines without silently discarding words. Keep TXT plain text.
- Acceptance: export and parse/import captions containing blank lines, CRLF, literal tags, ampersands/entities, arrows, emoji and RTL text; assert visible text and cue count, not just file size. Use an independent parser and real HTML track playback.

### BP-07 [P2] TTS reads the whole file before enforcing import size limits

- Location/scope: `R/src/components/TextToSpeechAudiobookGenerator.tsx:945`, compared with TXT validation at `:949`, Markdown import at `:963`, and EPUB import at `:973`.
- Trigger: choose a huge TXT/Markdown/EPUB or unsupported file through the picker. accept is a picker hint, not a size guard.
- Evidence: file.arrayBuffer runs before extension/metadata validation. Parser-level 64 KB/8 MB checks occur after allocation. The pilot's `localDocumentInputIsBounded` check in `R/scripts/tts-browser-pilot.mjs:120` only searches for source strings and cannot detect this ordering error.
- Confidence: high, source control flow. Impact: memory pressure and a long read precede the promised bounded rejection; Cancel invalidates the result but does not abort that read.
- Minimal task: validate extension, MIME and declared size before reading bytes, retaining the parser's later byte-length verification. Bound or abort the actual read where practical.
- Acceptance: oversized and unsupported File test doubles have arrayBuffer calls equal to zero; maximum valid files still import; cancel/replacement cannot publish stale results. Do not allocate a real multi-gigabyte fixture to test rejection.

### BP-08 [P2] OCR can show a previous file's text after the selected file changes

- Location/scope: `R/src/components/AiBrowserTool.tsx:723`, `:741`, `:784`, `:797`; worker lifetime at `:629` and `:658`.
- Trigger: begin OCR on image A, then choose image B or change language while recognition is pending. File/language controls remain enabled while only the action buttons are disabled.
- Evidence: selection clears result but does not invalidate the pending request. Completion always calls setResult(nextResult); no generation identity, AbortSignal or mounted cleanup is present. The worker terminates after recognize settles, but there is no user cancellation path for slow/stalled work.
- Confidence: high from source; not browser-reproduced. Impact: A's text appears under B's selection, with confusing language/result provenance; large images or stalled loads cannot be stopped from the tool.
- Minimal task: disable input replacement while busy or invalidate/terminate the prior operation; expose bounded cancellation and enforce image byte/pixel limits before OCR allocation.
- Acceptance: delayed fake OCR followed by replacement/language change never renders A as B; cancel and unmount terminate workers; test oversized dimensions and corrupt images; retry after failure. Verify English, Spanish, French, German, Italian and Portuguese with the actual self-hosted assets in browsers.

### BP-09 [P2] Four in a Row can lose its only keyboard tab stop

- Location/scope: `R/src/components/FourInARowGame.tsx:150` through 159 and `:243` through 244.
- Trigger: the focused column fills, or arrow navigation targets a full column. Only focusedColumn has tabIndex=0, but it can also be disabled. Other playable columns remain tabIndex=-1.
- Confidence: high, native disabled-button behavior and source state; no browser keyboard run was executed. Impact: keyboard users can tab past the entire playable board and cannot reliably re-enter it.
- Minimal task: keep the roving tab stop on a legal enabled column, skip full columns during navigation, and restore focus after computer turns/reset without stealing unrelated focus.
- Acceptance: friend-mode keyboard-only fill of a column, Left/Right/Home/End across full columns, Tab/Shift+Tab re-entry, AI turn, undo and reset. There must be one enabled tab stop whenever human moves are legal.

### BP-10 [P2] Undo can inflate game-pilot starts and completions

- Location/scope: `R/src/components/FourInARowGame.tsx:55`, `:74`, `:132`; rate calculation at `R/scripts/lib/four-in-a-row-pilot-report.mjs:31` through 36 and `:61`.
- Trigger: finish a round, undo the winning move, then win again. Each win emits Complete round, while undo only reverses the UI score. Undoing the first move then playing also emits another Start round without an explicit new round.
- Confidence: high from event paths; no production-data contamination claim. Impact: completion rates and the 100-start evidence gate can be inflated by normal interaction. A synthetic aggregate with 100 starts and 150 completions is accepted as decision-ready after the date/owner gates and prints 150% completion.
- Minimal task: define round lifecycle and emit start/completion once per local round using in-memory state only; do not add board/move/identity telemetry. Preserve correct visible score undo behavior; flag incompatible historical event definitions in reports.
- Acceptance: win/undo/re-win emits one completion; first-move undo/replay emits one start; New round resets lifecycle; Play again and actual first move have distinct replay/start meanings. Invalid/nonfinite counts and impossible rates are diagnostic blockers, not silently accepted decision evidence.

### BP-11 [P2] Pilot readiness accepts evidence without an adequate time window

- Location/scope: JSON-to-CSV inspection selection `R/scripts/lib/new-tool-growth-pilot-report.mjs:41` through 79 and discovery gate `:113`; game CLI discards source metadata at `R/scripts/four-in-a-row-pilot-report.mjs:49` through 58, then gates only date/count/owner at `R/scripts/lib/four-in-a-row-pilot-report.mjs:34` through 36.
- Trigger: saved discovery inspections predate the JSON release, or an old game aggregate is reused after September 7. Latest-among-available is not necessarily recent or post-release. Game counts arrive without generatedAt or measurement-window validation.
- Evidence: a synthetic 2020 inspection plus July 19 sitemap/CrawlScout reports produced `nextReleaseReady:true` on September 6 with no issues. The concrete discovery defect is lack of even a post-launch check. Sitemap/CrawlScout age checks match the documented post-release floor, but that floor alone is not a current regression check.
- Confidence: high, direct analyzer reproduction and CLI inspection. Impact: a release-review/expansion decision can be based on evidence that does not cover the release/current decision period. These analyzers do not themselves publish anything.
- Minimal task: preserve and validate evidence generatedAt, measured window, target and production provenance; reject missing/future/pre-launch discovery evidence. Define a bounded decision-evidence age separately from historical 28/56-day checkpoints. Do not infer new affected URLs solely from aggregate CrawlScout row counts.
- Acceptance: dated synthetic fixtures for missing, malformed, future, pre-launch, stale and fresh evidence; old snapshots remain historical, not ready; unchanged aggregate size with changed URL membership is not called regression-free without comparable URL evidence. Game report must identify the actual measurement window and verified owner exclusion.

### BP-12 [P2, Draft Only] Transcriber privacy checks can pass without detecting content-bearing GET requests

- Location/scope: `T/scripts/transcriber-browser-pilot.mjs:125` through 149, `:323` through 324, `:337`, `:345` and `:351`.
- Trigger: content is placed in an allowed GET URL, or an unexpected request is caught/aborted without a console error. noMediaUploadRequest checks only non-GET count; userContentNotInAnalytics is a narrow source regex. Unexpected external requests are recorded but are not directly a failure condition.
- Confidence: high for coverage defect; **no actual media/transcript leak was observed or alleged**. Impact: green privacy labels do not establish the browser-only confidentiality contract. The localhost pilot also does not exercise production-host-gated analytics/Clarity.
- Minimal task: run a controlled synthetic-content sentinel across page and worker request URLs, headers and bodies; fail unexpected destinations/requests explicitly; test the analytics adapter separately with production gating controlled locally. Keep fixture text/filenames out of saved logs. Verify relevant storage and telemetry sinks, not just upload APIs.
- Acceptance: intentional GET-query, POST-body, beacon, worker-fetch and telemetry sentinel mutations each fail; clean pinned asset requests pass; model laziness is checked per page/context before every start; edited text and filenames remain absent from network/storage evidence. A short model smoke cannot satisfy this privacy gate by having nonempty downloads.

## Readiness And Remaining Coverage

### TTS And OCR

- TTS has separate lazy Supertonic/Kokoro workers, pinned model revisions, selected-voice loading, sequential chapter generation, and termination-based cancellation. Kokoro validates US/UK dialect against the assigned voice, checks adapter availability, splits oversized phoneme/token input, and disposes per-inference tensors. MP3 encoding is real, shared, mono 128 kbps with 24 kHz and 44.1 kHz source support. These are inspected architecture properties, not new device compatibility results.
- Existing import/parser tests cover hostile documents; favourites are bounded validated voice IDs. The fresh focused run includes these helpers, chapter queue/ZIP and MP3 tests. It does not exercise the React worker lifecycle that BP-03 finds.
- `R/src/lib/browserTtsFeatureSoak.test.ts:30` returns four mock bytes per chapter. Its 100-chapter result proves queue/ZIP orchestration, not 100 real model generations or browser memory headroom. `R/scripts/run-tts-feature-soak.mjs:29` correctly labels this mock scope. Preserve that distinction.
- `R/scripts/tts-browser-pilot.mjs` is largely static source-string and asset-presence checking, despite its name. It is not a real-browser compatibility harness. The older browser evidence in `R/docs/tts-audiobook-pilot.md` is historical and was not refreshed here.
- Keep TTS's existing noindex/sitemap exclusion at `R/src/data/indexationPolicy.ts:41` and `:48` until a Release Judge evaluates current proof. Date passage is not permission. Physical Android, iOS and Safari remain unproven here; 390px desktop emulation and Windows WebKit are not equivalent evidence.
- OCR's six offered language files exist locally with nonzero sizes. Availability is not accuracy or loadability proof. `R/scripts/editorial-ocr-experiment.mjs:195` explicitly distinguishes its Node harness from the browser runtime; its English/Spanish experiment does not establish six-language/browser support.
- Remaining TTS/OCR tests: offline/cold/warm asset loading, HTTP failures, no-progress watchdog behavior, repeated model switches, real 10,000-character generation, chapter retry/cancel/reorder/download round trips, peak CPU/GPU memory and post-unload recovery. Supertonic partial-session failure cleanup and real-language pronunciation quality need dedicated measurement; no confirmed GPU leak is asserted from this review.

### Unfinished Transcriber

- Inspected code keeps media in BlobSource, decodes one five-minute overlapping block at a time, closes AudioSamples in finally, and transfers PCM buffers rather than cloning them into ASR. The ASR model is q8 Whisper Tiny, with separate pinned English/multilingual repositories; language options omit multilingual-only fields for English. No hosted inference path was found in the inspected workers/UI.
- Five-minute 16 kHz mono PCM alone is about 19.2 MB. The decoder retains packet chunks then concatenates them, transiently requiring roughly twice that PCM payload before considering decoder/model/runtime allocations. This is an allocation estimate, not a measured memory peak or full-hour safety claim.
- Missing-ended ASR timestamp handling also needs a focused regression: `T/src/workers/transcriber-asr.worker.ts:105` converts null to zero, and `T/src/lib/browserTranscriber.ts:206` can then turn a late segment into a 1 ms cue. Use block end or a defensible subsequent timestamp; preserve uncertainty. The test must inject an actual `{timestamp:[positiveStart,null]}` output and verify bounded, useful caption timing.
- postAndWaitMedia/postAndWaitAsr have abort/error handling but no timeout or no-progress watchdog. The ASR worker does not emit the transcription-progress event handled by the UI. Long stalled inference can remain busy indefinitely until manual cancellation. Define measured time budgets and an indeterminate state; do not invent progress percentages or reuse TTS's 90-second limit without measurement.
- Existing `T/src/lib/browserTranscriber.test.ts` tests helpers, including only a four-sample resampling example, basic overlap, simple exports and the one-hour constant. It does not run a one-hour fixture, media worker decoding, ASR worker lifecycle, device memory or privacy traffic capture. These draft tests were read, not executed in the dirty worktree.
- `T/scripts/transcriber-browser-pilot.mjs:16` uses the short Bella TTS sample; Chromium is launched at `:86`. Optional model-smoke exercises that short fixture and nonempty downloads, not WER, timestamp fidelity or caption parsing. The mobile context only inspects media. --multilingual with Auto on the same English sample does not prove multilingual recognition quality.
- T's noindex and sitemap exclusions at `T/src/data/indexationPolicy.ts:55` and `:62` explicitly require the 60-minute privacy/memory/real-browser gates. No fresh one-hour, Chrome/Edge device, Firefox, physical Safari/iOS/Android, slow-device, multiple-track, unusual-codec or sustained-memory evidence was produced here. Do not promote the draft or interpret any older smoke pass as this evidence.

### Pilot Decisions

- Four in a Row's configured earliest review is September 7, 2026 at +10:00, with at least 100 starts and owner exclusion. On the review's September 6 date, the date gate has not elapsed. No production usage was fetched and no readiness decision was made. Fix event validity and source-window gaps before using the counts to justify another game or Games category.
- JSON-to-CSV's configured day-56 checkpoint is September 12, 2026 at 17:53:34 +10:00. Day-28 and earliest-next-release dates have elapsed, but neither proves current discovery, demand or regression safety. No new-tool release is authorized by this report.
- For future exact-page SEO handoff, use `node scripts/seo-agent-workbench.mjs all json-to-csv-converter tool` and the separate `blog` invocation, with evaluator/micro-agent scope and final judge; use the same command shape for TTS/transcriber only after product evidence is ready. These are references, NOT commands executed here. No SEO approval, indexing or research conclusion is claimed.

## Recommended Goals And Agent Ownership

All below are proposed `planned` tasks for the coordinator to deduplicate, not agents spawned or implementations approved. Acceptance evidence should be stored under `output/browser-products/<goal-id>/` with source revision, fixture identifiers, runtime/device versions and a text-free result summary; the Release Judge independently reviews it.

| Goal | Owner | Priority | Minimal Work And Completion Gate |
| --- | --- | --- | --- |
| BP-G1: Bound browser conversion memory | Browser Converter Engineer | P1 | BP-01 and BP-07; reject before dangerous allocation/read; threshold unit tests plus responsive-browser rejection proof. |
| BP-G2: Preserve transcript content and time | Audio DSP / Caption Engineer | P1, draft | BP-02, BP-04, BP-06 and missing-end timestamps; known transcript fixtures, packetization invariance, independent caption round trips, and full-hour timing markers pass before readiness. |
| BP-G3: Settle every browser worker operation | Browser Runtime Engineer | P2 | BP-03, BP-05 and OCR replacement/cancel in BP-08; deterministic error/abort races with exactly-once settlement, no retained worker, preserved completed output and successful retry. |
| BP-G4: Make confidentiality test failures decisive | Browser Privacy QA Engineer | P1 gate, draft | BP-12; intentional sentinel leaks fail in all supported transports and workers; clean requests/storage/telemetry pass without saved private content. |
| BP-G5: Complete measured model/device readiness | Browser Compatibility QA Engineer | P1 gate | After G2-G4, run full-hour transcriber and real maximum-text TTS jobs on named desktop devices/backends, then physical devices before adding their support claims. Record peak/recovered memory, elapsed time, correctness, cancellation, downloads and console failures. No purchases/server fallback. |
| BP-G6: Restore keyboard play and valid pilot events | Game UX / Instrumentation Engineer | P2 | BP-09/BP-10; browser keyboard lifecycle tests and exact milestone-count assertions; mark old analytics definition boundaries explicitly. |
| BP-G7: Make pilot decisions use current, scoped evidence | Pilot Evidence Evaluator | P2 | BP-11; validate report provenance/windows, date gates and owner exclusion; synthetic stale/invalid fixtures fail; fresh read-only production evidence remains distinct from Search Console discovery/indexing. |
| BP-G8: Decide, do not assume, release readiness | Release & Proof Judge | Blocking gate | Review evidence from G1-G7 in exact page/feature scope. Coordinator owns full build/check. Keep TTS and transcriber policy unchanged until explicit approval; no auto-release from this report. |

Minimal real-device matrix for BP-G5: Chrome and Edge on a named Windows desktop, WASM and usable WebGPU where available; Firefox desktop fallback; physical Safari/macOS and iOS plus Android only before claiming those targets. For each claimed transcriber path, use 44.1/48 kHz mono/stereo audio, one multi-track container, a source with an audio offset/gap, 5-minute boundaries, and a full 60-minute/near-byte-limit case. Add one low-memory device run or keep that device class explicitly unsupported. For every path, cancel during download/decode/inference/export and run again. A failed target must have an honest unsupported/recovery state rather than a broadened pass label.

## Inspected Modules And Evidence

- Full principal source reads: `R/src/components/TextToSpeechAudiobookGenerator.tsx` lifecycle/import/settings sections; `R/src/workers/{supertonic,kokoro}.worker.ts`; `R/src/lib/{mp3Encoder,browserTtsChapterQueue,jsonToCsv,fourInARow}.ts`; `R/src/components/{JsonToCsvConverter,FourInARowGame}.tsx`; OCR/config/UI sections of `R/src/components/AiBrowserTool.tsx`.
- Focused/supporting reads and searches: browserTts model registry, input/import/Markdown/EPUB/chapter/archive/preferences helpers and tests, Kokoro text tests, Supertonic session construction, feature soak and pilot scripts, OCR experiment, AI lazy-assets references, indexation policy, game/new-tool report CLIs and analyzer tests. The 102-test run is not a claim of exhaustive line-by-line review of all helper implementations.
- T: all of browserTranscriber.ts, both workers, AudioVideoTranscriber.tsx, transcriber-browser-pilot.mjs and browserTranscriber.test.ts; language/worker-type wiring and draft route/indexation integration were inspected in their consumers. No exhaustive media-library internals, every language entry, entire global CSS or all dirty metadata changes were reviewed.
- Owning docs: R AGENTS.md and campaign AGENTS.md; T AGENTS.md hash matched R; agents/tts-audiobook/AGENTS.md; docs/tts-audiobook-pilot.md, docs/tts-browser-import-security.md, docs/analytics-dashboard.md, docs/new-tool-growth-pilot.md, docs/brand-code.md, relevant Google Search Central operating notes and SEO-workbench workflow references. Global code-review skill consulted. Provenance-cleaning skill inspected; this private engineering report was not sent to an inspection/cleaning service, and no provenance or required disclosure was removed.

### Actual Commands And Results

All executed shell commands used PowerShell, normally in R. Read-only git/status/source inspection also ran in the explicitly allowed T worktree.

1. `git status --short` in R and T; `git rev-parse HEAD origin/main` in R; `git rev-parse HEAD` in T. Verified baselines and existing dirty/untracked state without changes.
2. `Get-Content AGENTS.md`; `Get-Content agents/project-review-2026-09-06/AGENTS.md`; grouped owning-doc reads; `rg --files` filename inventories; `rg -n` targeted symbol/path searches; line-numbered PowerShell `Get-Content ... | ForEach-Object` extracts. `Get-FileHash AGENTS.md, C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/AGENTS.md` proved identical instructions. Initial literal-glob rg probes returned Windows path errors; directory searches with `-g` or exact filenames supplied the relevant evidence. These were search errors, not application/test failures.
3. `node --version` returned v24.20.0; `Test-Path node_modules/vitest/vitest.mjs` returned True. Coordinator-provided dependencies were used; none were installed by this review.
4. `node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/browserTts src/lib/kokoroBrowserText.test.ts src/lib/mp3Encoder.test.ts src/lib/fourInARow.test.ts src/lib/jsonToCsv.test.ts scripts/lib/four-in-a-row-pilot-report.test.mjs scripts/lib/new-tool-growth-pilot-report.test.mjs --reporter=dot` passed **17 files / 102 tests**, Vitest 4.1.10, 633 ms reported duration. Includes mock chapter soak and real encoder unit tests, not real speech inference.
5. `node --experimental-strip-types --input-type=module -e '<inline synthetic helper harness>'` imported T/browserTranscriber.ts read-only and exercised packet resampling, repeated-speech merge and edited-caption VTT export. Outputs are recorded under BP-02/BP-04/BP-06. Input sizes/timestamps and synthetic strings are stated there for reproduction.
6. `node --experimental-strip-types --input-type=module -e '<inline CSV harness>'` imported R/jsonToCsv.ts, converted `Array.from({length:500},(_,i)=>({['k'+i]:i}))`, and measured the serialized 50,000-record input WITHOUT converting it. Outputs recorded under BP-01.
7. Two `node --input-type=module -e '<inline AST/VM harness>'` executions used the installed TypeScript parser to extract the actual named functions, transpile them in memory, and execute with stub workers/refs: TTS handleWorkerMessage on pending model-load error; transcriber loadSpeechWorker/postAndWaitAsr with an aborted signal. They wrote no harness files and made no network/model requests. Outputs under BP-03/BP-05. These are focused function probes, not React/browser integration tests.
8. `node --input-type=module -e '<inline pilot analyzer harness>'` imported both report analyzer modules, passed synthetic post-review 100-start/150-completion game counts and the pre-launch discovery fixture described in BP-11. No production analytics, private identifiers or Search Console API was accessed.
9. `Get-ChildItem public/ai-models/tesseract/lang -File | Select-Object Name, Length` found all six OCR language assets, 6,279,601 to 10,923,060 bytes. No content/accuracy claim follows from those sizes.
10. `node --input-type=module -e '<inline SHA-256 inventory>'` read the five T files below. Primary-source web open/find checked W3C WebVTT cue syntax. No live product browsing was performed.

Inline harness labels above summarize the executed `-e` payloads rather than pretending they are saved scripts. Exact tool-call command payloads are retained in the task execution history. Future implementation owners should turn the stated fixtures into maintained regression tests.

### Draft Source Identity

T's uncommitted content was read at these SHA-256 hashes; HEAD alone does not identify the draft:

| File In T | SHA-256 |
| --- | --- |
| src/lib/browserTranscriber.ts | 9b8bdfc2166b4af95de35f926973e0da1ffc65cc4422bf6be76e0abafc0c3742 |
| src/components/AudioVideoTranscriber.tsx | 2c47af42efc8e15806701c4d4ac596b81d34199c7b83ed976f1f60dd755c1853 |
| src/workers/transcriber-media.worker.ts | fe0043c5ffb165ed6cbf25c50e6eea7c2754d5c7f063c386cabb2dd75d84a7f3 |
| src/workers/transcriber-asr.worker.ts | ca7cf47dbfca727da8e3a2bf6b100ce3408fdb388daef7dc93203604407a3825 |
| scripts/transcriber-browser-pilot.mjs | 01fb80d13d2e2efc167c54580f8ba03af2e26a124370c6121e7b9a9fc7430170 |

## Unsupported Conclusions

This report does not establish live failures, broad browser/mobile compatibility, measured one-hour completion or memory safety, OCR accuracy across six languages, TTS pronunciation quality, production privacy compliance, current indexing/discovery, user demand, pilot completion, legal/license clearance or release approval. No model/codec/worker download was exercised. Full build/check, rendered UI/accessibility, production asset delivery/security headers, library-version interoperability and live request capture remain coordinator/implementation follow-up gates. The older smoke evidence is historical only; it was not used as broad compatibility proof.
