# Compatibility Cache And Export Helpers: Independent Review

## Findings

**None in the bounded helper/harness changes reviewed.** Independently executed **57/57 small pure probes passed**, plus read-only consistency checks against the supplied short-run report and selected current files. No critical issue found.

Date: 2026-09-08. Workspace T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`. Scope: explicit verified-cache mode, cache integrity and request handling, browser selection, unchanged selected application bytes, current export validation, cleanup wiring, and the supplied short-run evidence. This judgment does not cover the active hour run or cold model-network delivery.

## Source Review

- [transcriber-model-cache.mjs:8](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/scripts/lib/transcriber-model-cache.mjs:8): verifies the manifest digest before trusting its contents; requires matching repository/revision, complete metadata, valid confined paths, regular non-symlink files with matching real paths, sizes and SHA-256 values, distinct URLs, and required files. Model bodies are retained as verified snapshots, so later on-disk replacement does not change the served bytes.
- [transcriber-browser-compatibility.mjs:80](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/scripts/transcriber-browser-compatibility.mjs:80): explicit `--verified-model-cache` chooses the selected model's hardcoded manifest/revision. The conflicting remote-observation mode is rejected before setup. Cache verification precedes browser launch. Installed ORT version/lock metadata and actual artifact hashes are separately recorded; this is not independent external-download or package-origin verification.
- [transcriber-browser-compatibility.mjs:139](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/scripts/transcriber-browser-compatibility.mjs:139): classification occurs before cache lookup. Blocked requests abort. A permitted model request must match the exact URL in the in-memory cache; a miss records `blocked-cache-miss` and aborts instead of reaching the network. Fulfilled responses use the verified buffer, no-store, and the local origin's CORS header. The cache branch does not replace application worker code or redirect it to a modified worker.
- [transcriber-browser-compatibility.mjs:109](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/scripts/transcriber-browser-compatibility.mjs:109): preserves the requested Playwright engine and branded Chrome/Edge channel. Cache mode changes response delivery, not selected browser identity. The static server streams existing build files; selected source/harness and built-file hashes are checked after cleanup.
- [transcriber-compatibility-exports.mjs:18](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/scripts/lib/transcriber-compatibility-exports.mjs:18): consumes complete current SRT serializer atoms instead of stripping tags/entities from arbitrary text. VTT is compared against its single-encoding representation, and TXT against the exact displayed text list. Literal tags, entities, whitespace, and continuation-looking text remain content. The helper explicitly documents that it checks the existing export structure and cross-format timing, not an independent reader or original source timestamps.
- [transcriber-browser-compatibility.mjs:259](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/scripts/transcriber-browser-compatibility.mjs:259): the harness supplies displayed textarea values and all three actual download bodies to the new export validator. Source inspection confirms the stale broad unescape predicate was replaced on this path.
- [transcriber-browser-compatibility.mjs:270](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/scripts/transcriber-browser-compatibility.mjs:270) and [line 284](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/scripts/transcriber-browser-compatibility.mjs:284): normal completion resets the page and records tracked worker/URL release. Finally clears the timer, closes the launched browser and server, records stopped states, and makes cleanup/source/build mismatch fail the result. These tracked states are explicitly not native-allocation-release proof.

## Independent Pure Evidence

Used the code-review-and-quality review approach and read both new helpers, their tests, the harness integration, and the exact supplied report. Executed actual source, not substitute implementations:

| Probe Group | Count | Result |
| --- | ---: | --- |
| Cache loader, actual source with virtual filesystem | 21 | Pass |
| Export validator with actual current serializer | 20 | Pass |
| Actual cache-route callback with stub requests/routes | 10 | Pass |
| Actual engine/channel selection with stub engines | 5 | Pass |
| Actual incompatible-mode guard | 1 | Pass |

Cache probes covered exact pinned URLs, post-validation disk replacement, changed manifest and same-length file corruption, wrong/incomplete metadata, duplicate/missing files, traversal/absolute paths, symlink/directory/realpath escape, and size/hash rejection. The virtual filesystem used small synthetic buffers only; it created no files and read no model weights.

Route probes covered valid fulfill, before-start rejection, cache miss, unpinned revision, private URL/body/encoded-header content, non-GET requests, remote origin rejection, and allowed static reads. The actual callback was extracted with the TypeScript AST and invoked with stubs, not a browser. Selected Chrome, Edge, Chromium, Firefox, and WebKit options were likewise evaluated with inert engines; none was launched.

Export probes covered plain/literal markup and entities, literal continuation syntax, blank/cue-like/RTL text, CR/CRLF, long ASCII and guarded UTF-8, blank edited captions, changed content, cross-format timing, missing/reordered cues, truncation, stripped guards, double-decoding, final whitespace, removed required continuations, and caller immutability. No FFmpeg process was run by this reviewer. The parent's update reports the export worker's 71/71 focused passes including four FFmpeg 7.1 imports; that remains separately attributed evidence, not this reviewer's execution count.

## Supplied Short-Run Evidence

Read [chrome-short/report.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/compatibility/2026-09-08T10-21-27-048Z-chrome-short/report.json), generated 2026-09-08T10:21:27.163Z and finished 10:21:34.144Z. It records Chrome 152.0.7977.83, `fixtureName: short`, duration 5.544 seconds, `networkMode: verified-model-cache`, `status: pass`, all 12 recorded checks true, and no failures. This is the existing parent's run, not a browser rerun by this reviewer.

The model cache record names the selected English repository/revision, manifest SHA-256 `b56f41d191489804a50dc78b0ce6f81848767d977549f7c4442750bba1df6611`, 13 cached files, and 45,065,000 model bytes. It explicitly excludes cold external-download proof. Nine model/runtime response identities account for 15 classified model requests. The report records 77 transcript characters and nonempty TXT/SRT/VTT outputs with hashes.

Cleanup records 3 created and 3 terminated workers, 0 live workers, 0 object URLs, browser stopped, and server stopped. The report retains one blocked environment-origin request and network-failure counters instead of silently omitting them; this review does not independently attribute every failure counter. Reported memory is sampled aggregate process working set, not heap or a bounded-memory result.

Read-only consistency verification matched all 12 recorded source/harness files to current disk bytes. Also matched the selected ASR worker bundle, media worker bundle, and tool HTML to their recorded built hashes. Independently rehashed the small manifest, then matched every cached model response's hash/length against it and runtime response records against the report's runtime artifact records. Did not reread large model/runtime binaries or independently rehash the other 65 build entries.

## Bound Hashes

| Source Or Evidence Under T | SHA-256 |
| --- | --- |
| `scripts/transcriber-browser-compatibility.mjs` | `9fca282e99ec0312d2dcdfce806c9de5e46425c1f1c0f93188cfe0ddd4e622c6` |
| `scripts/lib/transcriber-model-cache.mjs` | `990b49796458d6660d4bf4eeef6c2a3aa7f88f6bce90b57e18bae097f5839701` |
| `scripts/lib/transcriber-model-cache.test.mjs` | `22a0687ba5be26b8c73e8e542b4abb05e85d8074f343f3e963eb3540f241bad1` |
| `scripts/lib/transcriber-compatibility-exports.mjs` | `36e76ed9b846b2e7f604e34e0406c5d164f1c72250a12311d6dc5e4bef05ad21` |
| `scripts/lib/transcriber-compatibility-exports.test.mjs` | `5cf389fc2be2453058df4cd088bcb58cd6c19abc7e57b800f933ca2b5fd734c2` |
| `scripts/lib/transcriber-browser-proof.mjs` | `27b17c43aba4118665f80e6ae8f6bf34644c40ab89462dd694a27ccdeb2819b7` |
| `src/lib/browserTranscriber.ts` | `c0fb96417e6a4ad6e7719ed998fe162ae2f04fcb8465333644ed7ac5b9443f84` |
| `output/browser-transcriber-pilot/compatibility/2026-09-08T10-21-27-048Z-chrome-short/report.json` | `ebff8c2a379c5ccdd6d0c94e1786699aa82ab0116314d95e111255890d22d62e` |
| `dist/client/_astro/transcriber-asr.worker-B5YRR9ns.js` | `2fb0e38ea559b423a887ae19c885c687b79507944e983fc294b72c17630afe2a` |
| `dist/client/_astro/transcriber-media.worker-DI2BT23-.js` | `1157071c02c703b67fcd267eaf09e14f27312f85d6ed8996095e3ae102818988` |
| `dist/client/tools/audio-video-transcriber/index.html` | `16b7b970880bbfeb1374b269c599b0943e091beb3b613f5d7d7d1a6b5a96c580` |

## Limits And Ownership

No npm, Vitest, build, model inference/import, browser, FFmpeg, fullcheck, network, or parent-process inspection/control ran. No file under T was edited or created. The active hour case, its resources, and its output were not inspected; no conclusion about its progress or outcome is made here. No broad existing compatibility or product gates were reopened. Only this exclusively assigned review report was written. No cold model-network pass, whole-product approval, or broader status change is implied.
