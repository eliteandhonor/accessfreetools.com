# Transcriber Judge Fixes: IJ-TR-01 / IJ-TR-02

Recorded 2026-09-06 13:49 +10:00. Both findings are implemented with targeted regression evidence, ready for the coordinator's independent follow-up. **Not task approval, release approval or TR-03 completion.** No campaign statuses changed.

## Scope And Changes

- T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, branch `codex/browser-transcriber-pilot`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5`. Its unpublished 40-file draft matched the independent judge snapshot before editing. T's own node_modules is not a symlink; Node v24.20.0, Vitest 4.1.10, TypeScript 6.0.3 and installed Chromium 151.0.7922.34 were used.
- IJ-TR-01: [checkpoint](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:135) retains unedited recognition segments separately from editable captions. [Resume/merge](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:330) uses that source evidence with the unchanged TR-01 merge helper and appends only genuinely new output. Corrected/deleted captions and whitespace stay exact. Source evidence is bound to file/track/language and remains in memory only; Reset, replacement, completion and unmount discard the checkpoint. No storage, analytics, network or export path was added.
- IJ-TR-02: [ASR worker](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/workers/transcriber-asr.worker.ts:144) transports only the allowlisted `AbortError` / `TimeoutError` name alongside the existing sanitized message and request ID. [Protocol type](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberWorkerTypes.ts:67) makes this optional for existing events. [Waiter](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberLifecycle.ts:89) reconstructs the control outcome, so existing cancellation/timeout logic settles and disposes without switching backend or creating fallback workers. Unknown names remain ordinary errors; genuine GPU errors retain exactly one WASM retry.
- Production changes are confined to those four files. Only two existing TR-02 test files changed. DSP/merge/export core, media worker, legacy tests, protocol tests, indexation, artwork, registrations, package files and dependencies were not edited.

## RED First, Then GREEN

Tests were added before production edits. Existing tests were not disabled or weakened; skips below are explicit `-t IJ-TR` name filtering only.

| Time (+10:00) | Check | Result |
| --- | --- | --- |
| 13:42:53 | R1: first actual-component RED | 8 failed, 2 positive controls passed, 28 name-filtered; 23.37 s. Four overlap cases resurrected deleted/corrected speech; four control cases failed to settle in the expected state. |
| 13:44:13 | R2: diagnostic RED plus waiter tests | 10 failed, 3 passed, 40 name-filtered; 4.59 s. Moved the worker-count assertion before the eventual phase assertion: each control case directly proved 4 workers instead of 3. Waiter tests proved lost error names. No production edits yet. |
| 13:45:07 | R2: targeted GREEN after fixes | 13 passed, 40 name-filtered; 4.46 s. |
| 13:45:31 | V1: all five focused files | **99 passed, none skipped**, 13.19 s: the original 86 plus 13 new tests. |
| Same verification batch | Both scoped TypeScript checks below | **Exit 0, no diagnostics**, for each command. |

Exact commands, run in T:

```powershell
# R1
node node_modules/vitest/vitest.mjs run src/lib/browserTranscriber.tr02.test.ts -t IJ-TR --reporter=verbose --no-cache --configLoader runner
# R2 (RED and GREEN)
node node_modules/vitest/vitest.mjs run src/lib/browserTranscriber.tr02.test.ts src/lib/browserTranscriberLifecycle.tr02.test.ts -t IJ-TR --reporter=dot --no-cache --configLoader runner
# V1
node node_modules/vitest/vitest.mjs run src/lib/browserTranscriber.test.ts src/lib/browserTranscriber.dsp.test.ts src/lib/browserTranscriber.tr02.test.ts src/lib/browserTranscriberLifecycle.tr02.test.ts src/lib/browserTranscriberProtocol.tr02.test.ts --reporter=dot --no-cache --configLoader runner
# TR-01 scoped no-emit check
node node_modules/typescript/lib/tsc.js --ignoreConfig --noEmit --skipLibCheck --strict --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022,DOM --types node,vitest/globals src/lib/browserTranscriber.ts src/lib/browserTranscriber.test.ts src/lib/browserTranscriber.dsp.test.ts src/workers/transcriber-media.worker.ts src/workers/transcriber-asr.worker.ts
# TR-02 scoped no-emit check
node node_modules/typescript/lib/tsc.js --ignoreConfig --noEmit --skipLibCheck --strict --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022,DOM --types node,vitest/globals --jsx react-jsx src/components/AudioVideoTranscriber.tsx src/lib/browserTranscriber.ts src/lib/browserTranscriberLifecycle.ts src/lib/browserTranscriberWorkerTypes.ts src/lib/browserTranscriberLifecycle.tr02.test.ts src/lib/browserTranscriber.tr02.test.ts src/lib/browserTranscriberProtocol.tr02.test.ts src/workers/transcriber-media.worker.ts src/workers/transcriber-asr.worker.ts
```

## New Coverage And Its Limits

- Four [actual-component overlap cases](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.tr02.test.ts:317): failure and Stop, each with correction and deletion. The original caption occupies 295-300 seconds, inside the actual block overlap. Correction preserves leading/trailing whitespace; deletion stays empty. Retry starts at block 1, removes its repeated source overlap, retains new text at 300-305 seconds and preserves the original phrase spoken again at 310-315 seconds. No workers remain on interruption/completion.
- Four [actual-worker control cases](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.tr02.test.ts:351): AbortError and TimeoutError at both load and inference. The actual ASR worker source runs in a native Blob-backed Chromium Worker; only the Transformers model dependency is replaced with a deterministic fake. Its serialized replies and IDs are forwarded unchanged to the actual component. Assertions cover the transported name, sanitized message, final cancelled/error state, zero retained workers, unchanged WebGPU backend, no extra worker and available retry.
- Two [actual-worker positive controls](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.tr02.test.ts:368): ordinary GPU load/inference errors create exactly `['webgpu','wasm']`, retry and finish successfully. Three [waiter tests](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberLifecycle.tr02.test.ts:127) verify both control names, listener/timer cleanup and rejection of unrecognized names as ordinary errors.
- Bundling is in-memory test instrumentation (`write:false`), not a site build. Page requests are blocked; no real model, decoder, recording or provider is used. Synthetic private error detail is asserted absent from the worker reply. This does not replace the production privacy gate or a real-device memory measurement.
- The unchanged suite still passes native WebVTT literal round trips, independent SRT/TXT cases, cancellation/request-ID/watchdog regressions and synthetic DSP/timestamp checks. Synthetic-hour maximum marker errors remain 0.36281179200159386 samples at 44.1 kHz and 0.33333333340124227 at 48 kHz, with zero block-length error. These are not real-hour ASR runs.

## Final Changed-File Hashes

All paths below are relative to T. This six-file set is the complete source/test handoff; HEAD alone is insufficient because these files remain untracked draft work.

| File | Final SHA-256 |
| --- | --- |
| src/components/AudioVideoTranscriber.tsx | 2c14ef4979407d4b60e6c19a7fde8fb763eba86fbb58b8bd6918f7c799612257 |
| src/lib/browserTranscriberLifecycle.ts | 214865c82f7ea374cb5c404a881c3dbb00bf2b8b0d46fc561aaa31fb54695851 |
| src/lib/browserTranscriberWorkerTypes.ts | 217719bdc453c039b901652b74108a20131b801e70d1415d9b20c588fcd521fb |
| src/workers/transcriber-asr.worker.ts | 613a21d90e64101004c1f7a233e91b747ef5ff3e0b242361b4d1ed1162007167 |
| src/lib/browserTranscriber.tr02.test.ts | f514bb5b28a14e5cfdda87baf0d0b2507c9fb704380b5db1d612ae7451771052 |
| src/lib/browserTranscriberLifecycle.tr02.test.ts | 2138ce62257f56ad85c1aac216ecd87322c3bfa7cbe81ecdf7851858e92fc8ae |

## Preservation And Handoff

- Before/after SHA-256 inventory: all 40 original draft files remain; exactly these six changed, all other 34 are byte-identical. No new T files. The reconciled legacy test still hashes to `a32b2a24ebab6db8954c3a8106ce5701240c8a4dcd57785c6cb44977df1533ad`; the DSP/export core remains `32ec534bf214d8c25ed34a15a87eff0cfbef9ae7510de76837e460b0df066b16`.
- Model pins remain `aeaa13760958b03fac5062f457d317d3319c3168` and `517244293732ee2d58139af5814231b7e6830a0d`. The unchanged indexation file remains `8cadf55d7d4d9e66d97c5ab6ead948e034100e003bd0b83e61ad2b77e6934b48`, with tool/guide noindex and sitemap exclusions intact.
- Reviewed the exact production delta against the start snapshot. `git diff --check` passed with pre-existing unrelated LF/CRLF warnings; a separate read-only six-file whitespace assertion passed because Git does not diff the untracked source. The first overly broad read-only JSON inventory was truncated by command-output limits; the bounded retry succeeded before editing. No files were written by either inventory command.
- Only this new report and an append to the transcriber worklog were authored in R. Campaign and the previous independent-judge report are unchanged. No main-promotion-checkout edits, commits, installs, full suite/check, site builds, models/provider calls, privacy uploads, server or deployment. No provenance service/cleanup was used; disclosures are untouched.
- Coordinator owns independent follow-up. Real model/codec/browser-hour behavior, production privacy mutation tests, peak/recovered memory, physical-device compatibility, anti-aliasing/ASR-quality evaluation, watchdog calibration, seven stable beta days and separately authorized indexability release remain unperformed/unapproved here. Neither finding's synthetic fix grants those gates a pass.
