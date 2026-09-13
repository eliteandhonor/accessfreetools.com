# TTS Warm Chapters And Bounded Long-Text Judge

- Reviewed 2026-09-09 AEST; independent evidence-only follow-on to the frozen cold-retry judge.
- R = `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`; HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25`. This judges the hashed working source/build, not HEAD alone.
- Evidence base = `R/output/tts-audiobook-pilot/real-chrome-smoke/`; A-D below identify exact run directories. No other run is included.

## Verdict And Findings

**Accept the four receipts as bounded actual desktop generation/download evidence, with the provenance qualification below. No concrete source defect, harmful harness change, or false pass was established within this scope. BR-04 remains blocked and unapproved.** No product, runtime, campaign, indexability, account, deployment or release change is authorized by this report.

- **Historical harness qualification:** A and B record different harness hashes and contain no `harness.mjs` snapshot. Their historical bytes were not independently recovered; current assertions are not proof of an exact historical byte-level diff. C and D contain matching archived snapshots, independently equal to their recorded hashes and to the current script. Preserve A/B's recorded hashes as historical, not current. Future archival proof should retain the executed snapshot, as C/D already do; this is not a reason to repeat successful model downloads.
- **Scope qualification:** finite non-silent MP3s and section progress do not prove correct speech, all-word/chunk coverage, voice identity by listening, natural-book accuracy, or absence of duplicated/omitted content. Differently selected voices are supported by UI assignments, worker request construction and selected preset requests, not an independent acoustic classifier.
- **No remaining required source correction identified here.** Outstanding BR-04 acceptance proof is listed below; the narrowly successful receipts do not waive it.

## Exact Receipts

| ID / Directory | Actual Configuration | Poll-Observed Completion | Native Decode And Outputs |
| --- | --- | --- | --- |
| A `2026-09-08T15-04-43.360Z` | Edge 152.0.4191.66; Kokoro WebGPU full precision; Bella cold, then Bella/Adam chapters | Cold 50.145s; warm chapter set 5.119s | Cold/chapter 1: 4.656s, RMS 0.066725; chapter 2: 4.728s, RMS 0.105190; two MP3s and exact ZIP |
| B `2026-09-08T15-07-53.829Z` | Chrome 152.0.7977.83; Kokoro WebGPU full precision; Bella; 10,000 synthetic characters | Fresh-load generation 75.179s; sampled progress reaches section 37/37 | 9,522,816-byte MP3; 14,284,224 decoded samples at 24kHz; 595.176s; RMS 0.076987 |
| C `2026-09-08T15-10-33.086Z` | Chrome 152.0.7977.83; Supertonic WebGPU; F1 cold, then F1/M1 chapters | Cold 55.207s; warm chapter set 5.119s | Cold/chapter 1: approximately 4.415s; chapter 2: 4.650s; all finite/non-silent; two MP3s and exact ZIP |
| D `2026-09-08T15-12-12.352Z` | Edge 152.0.4191.66; Supertonic WebGPU; F1; 10,000 synthetic characters | Fresh-load generation 70.155s | 9,979,611-byte MP3; 14,969,417 decoded samples at 24kHz; 623.725708s; RMS 0.052041 |

All four report `passed: true`, no page errors, no model requests before Start, no detected synthetic sentinel, no viewport overflow, paused generated audio, and browser/server closure. Each still records an aborted local blob request and blocked AdGuard `eval`; do not describe the environment as error-free. Five-second polling makes these completion observations, not precise inference benchmarks.

## Harness And Source Review

- Inspected current `output/tts-audiobook-pilot/real-chrome-smoke.mjs` and C's identical archived `harness.mjs`. Named channel is allowlisted to Chrome/Edge; model choice is restricted to Kokoro/Supertonic and checks the corresponding default voice. Fresh browser/context, blocked service workers, no persistent account profile, request interception or mocked speech results. Existing QA CSP retains exact locked ORT version paths and the previously proven encoder `connect-src data:` allowance; these options do not widen external hosts or add `unsafe-eval`.
- Snapshot lines 174-249 run chapters in the same session before Unload. They select the second voice, assert both voice IDs, require the exact `Download all as ZIP` control and two individual MP3 buttons, download/decode each with finite samples and RMS > 0.0001, then require ZIP order/names and content hashes to equal both individual downloads. An assertion failure throws into the outer failure handler; the final success assignment cannot bypass a failed chapter branch.
- `src/components/TextToSpeechAudiobookGenerator.tsx:584` reuses the loaded matching worker; `:637` sends chapter-specific text/voice; `:729` clears prior single/chapter results before the fresh queue; `:865` seeds chapter 1 from the single text. `:1593` exposes MP3 buttons only for completed results; `:1621` uses "all" only when every chapter is complete. No source-supported stale-single-result shortcut was found. A's identical cold/chapter-1 bytes are consistent with repeating the same text/voice, not independent speech-quality proof.
- A/C record zero further `.onnx` requests during the warm phase, with only the newly selected Adam/M1 preset among recorded voice requests. This agrees with the pinned worker paths and request logs. The filename matcher is not a general detector for every future weight filename, signed URL or cache behavior, and does not measure native model memory retention.
- Long-text input is one owned, repetitive synthetic string, length 10,000 and SHA256 `891084d73369fe8bb74191633c7e6954ce87dff40ea5753dfe4d5471459c4654` in both B/D. The inspected branch asserts input length, retains the 60 x 5-second generation polling bound, and caps native decode output at 160 MiB with a 30-second subprocess timeout. It does not assert source-to-audio coverage or validate every reported section. Native decoding was inspected in receipts, not rerun by this reviewer.
- `src/workers/kokoro.worker.ts:233` and `src/workers/supertonic.worker.ts:111` remain unchanged. The earlier speculative GPU readback/phonemizer edits were not introduced. The two named models are identified by selected controls, pinned request paths, runtime status and their worker paths, not by the generic readiness copy alone.

## Independent Integrity Checks

- Rehashed all 2,145 non-agent entries of `R/output/project-review-followup/SEC-03/integration/2026-09-08T08-18-02.641Z/source-after.json`: zero current mismatches for every receipt. Manifest SHA256 `705d186184003cfc8f213ff9e33b4f2f92fb1167f21c15571728ac6010fa289e` matches all four. This verifies source binding, not a newly executed full check.
- Current selected-source hashes match A/B's 6 and C/D's 7 entries. Current actually served files under `R/dist/client` match all 19/17/20/18 recorded hashes respectively; each receipt also reports zero selected/served drift during its run. These are the recorded served subsets, not a new whole-build reproducibility audit.
- Independently parsed both saved ZIPs in memory with signature checks. Exactly two entries, ordered `01-Chapter 1.mp3`, `02-Chapter 2.mp3`, no extra entries; each decompressed byte buffer equals its individual MP3 file. Rehashed all saved MP3s/ZIPs and receipts below. No audio generation, playback, extraction writes or decoder rerun occurred.

| Receipt | Current `report.json` SHA256 | Recorded Historical Harness SHA256 |
| --- | --- | --- |
| A | `6729456400b988641388a589acab7eef1961a0c6d006fdb5a7576450bbf9c474` | `85fb746e1daa11a1e9acc49f4947815b5db90b87526f0180028f8bd305145793` |
| B | `72318d69b566c61cf4fbd157d6f00daf7805bf54faa467fd8f1ca0800fca1785` | `13199c07976ce25b838535f4fbd85585742ff29116819bfc93c96f290a812729` |
| C | `2bfa86b47c3ebe1fe3e1a2cfe383ae561f525de996f126c570edae8d71ddbd15` | `4a67b2fef31ac53a6c8835df8bcff1128f951000d92046e847e66ddbbe8b2426` |
| D | `057bccf30f1ff6d3c6500678c568c7e056bf2a498215035f541984ee86a30ff7` | `4a67b2fef31ac53a6c8835df8bcff1128f951000d92046e847e66ddbbe8b2426` |

| Saved Artifact | Bytes | SHA256 |
| --- | ---: | --- |
| A `synthetic-kokoro.mp3` and `synthetic-chapter-1.mp3` | 74,496 each | `9e3c109da09361c296cf5a5a32517d4e196515fd36c3b3e0ee79c6445e32d67c` |
| A `synthetic-chapter-2.mp3` | 75,648 | `a4928b5bce7fab02939e64a744d65ec82be37e82a1455d112a73d85d916cfdcf` |
| A `synthetic-chapters.zip` | 150,418 | `86991a790b10da1049c0360eec657b8ab13b56ba13b4d1b81b882e3bd62eb082` |
| B `synthetic-kokoro.mp3` | 9,522,816 | `dc32b6d332d15d28483bfb2d52e36a7f4b41e0262ca6444a650371ea9df751c6` |
| C `synthetic-supertonic-3.mp3` | 70,635 | `aaefa89dce907a4b8e018d7770acebcba578eb983b96240d8bfae243b23d69b0` |
| C `synthetic-chapter-1.mp3` | 70,635 | `904a398d17fc5f3fe9c791536b4039ded72b41d0770cd125857fc7d66ebc2ecb` |
| C `synthetic-chapter-2.mp3` | 74,396 | `db8c8aa331d908032a616202e53348111a15556ac64e8aa17e98c775be247ac8` |
| C `synthetic-chapters.zip` | 145,305 | `471195a81fa991bae09ae30b04454d738a6d1cb1d4ab51adcbc65a2a04160494` |
| D `synthetic-supertonic-3.mp3` | 9,979,611 | `3e7fc9cb1e51194830d42900eaaa3c44704da6039d22f718eee011aaec61e37f` |

Selected source identities are the six unchanged full hashes recorded in each receipt and the prior cold judge, plus Supertonic worker SHA256 `988ae14ba15fed0687f5d52d1573e812bc041dd15dcb4269e33b11b9c4240b92` in C/D. Prior cold judge remained frozen: SHA256 `07137c99a8004571823df1b01619cc4904fe1cf883a787fda86e3930ee21611d`.

## Remaining BR-04 Proof

- `campaign.json:607` still requires repeated model switches, load failure, watchdog, cancel/retry, native memory peak and recovery, and local-only network sentinel evidence. These successful isolated runs do not exercise those failure/recovery paths or prove allocations were released when Unload/browser close completed.
- This is four specific browser/model/workload combinations, not the complete cold/warm/10k cross-product. Physical Android/iOS/Safari and Firefox/WebKit inference/fallback status must remain explicitly tested, fallback or unverified; viewport emulation and Windows browser results cannot supply physical-device evidence.
- Cold means fresh isolated browser/context for these attempts; upstream delivery reliability and upstream caches were not measured. Warm means the same session without an observed additional main-weight request, not an offline/cache-reload or memory-soak guarantee.
- No-autoplay is the sampled player/DOM state, not a continuous audio-output trace. Sentinel detection covers the inspected literal/encoded URL and body checks under analytics opt-out and restrictive QA CSP; it is not production privacy, all encodings/headers, worker-internal CSP visibility, or global network proof.
- Preserve TTS noindex. Compatibility, seven stable beta days and separate indexability/release judgment remain required. Next bounded work should address a missing named gate with an archived harness and explicit acceptance assertions; no additional identical model download is requested by this judge.

Review used read-only `Get-Content`, `rg`, Node JSON/crypto/ZIP inspection, `git rev-parse HEAD`, and one existing saved screenshot. No tests, product execution, browser/model/network/build/install calls or source writes. Only this new report was written; prior receipts and judges were not modified. Hygiene service inspection was not invoked under the no-network constraint; no provenance cleaning was performed.
