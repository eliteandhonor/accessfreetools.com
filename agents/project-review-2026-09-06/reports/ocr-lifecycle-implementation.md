# BR-03 OCR Lifecycle Implementation

Date: 2026-09-06, final source/test fingerprints recorded at 14:38:10 +10:00; source/test freeze sent to coordinator.
Disposition: implementation and focused evidence, including one real offline English inference, supplied for independent review. NOT approved, integrated, deployed, or complete multilingual/device acceptance. Campaign status remains coordinator-owned.

## Revision And Ownership

- Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`.
- Start and final HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`.
- Campaign's historical review baseline: `90d6dcab0580a91ca66382f2414d95e8817469e5`; the reproduction ran against current working source, not that historical report alone.
- Changed only OCR regions/imports/conditional lifecycle guards in `src/components/AiBrowserTool.tsx`, the five new OCR helper/test files below, this report, and appended browser-runtime worklog entries. The coordinator subsequently authorized the OCR-only expectation update at `src/data/siteContentAudit.test.ts:1377`; that explicit scope extension is included below.
- Existing shared changes were preserved. No TTS, Ask/API, provider-evidence, package, manifest, global documentation, shared policy, task-board, or campaign edits were made by this assignment.
- No shared install, full repository test/typecheck/check, build, commit, server, publication, deployment, indexing request, paid call, or model download was run.

## Inspected Material

Read campaign `AGENTS.md`, the exact BR-03 campaign entry and browser-runtime role/reference/tasks/worklog, BP-08 in `reports/browser-products.md`, and `docs/brand-code.md` before writing public errors. Followed the mounted Chromium/esbuild/Vitest pattern in `src/components/BrowserTtsLifecycle.test.ts` without editing it. Inspected `package.json`, `vitest.config.ts`, `tsconfig.json`, and the OCR component. Relevant skills consulted: test-driven-development, git-workflow-and-versioning, browser-testing-with-devtools, frontend-ui-engineering, remove-ai-marks, and code-review-and-quality. The quick memory registry search supplied no relevant implementation evidence.

Worker compatibility was checked against installed Tesseract v7 `src/createWorker.js`, `src/worker/browser/{spawnWorker,loadImage,onMessage,defaultOptions}.js`, `src/constants/defaultOptions.js`, `src/utils/resolvePaths.js`, and `src/worker-script/index.js`. The upstream [API documentation](https://github.com/naptha/tesseract.js/blob/master/docs/api.md) and [client implementation](https://github.com/naptha/tesseract.js/blob/master/src/createWorker.js) were also consulted. Installed source and the executable packet-parity test are the version-specific evidence here.

## Reproduced Findings And Changes

Confidence is high for the tested source behavior and controlled worker lifecycle. No production incident is inferred.

1. **Stale result provenance:** mounted image A recognition followed by image B, Spanish selection, or both rendered `Image A stale text` where the test required no such result. Current fixes are at `src/components/AiBrowserTool.tsx:682`, `:706`, `:734`, `:739`, and `:743`: one AbortController identity gates progress, result, history, error, and final loading state. File/language replacement invalidates the prior identity synchronously. Old settlement cannot unlock the current operation or insert a history entry. Selection controls stay usable.
2. **Unowned loading and recognition workers:** baseline unmount left termination count 0 at each of load, language loading, initialization, and recognition; no Cancel OCR control existed. `src/lib/browserOcrWorker.ts:25`, `:48`, and `:52` now own the native worker from construction, settle once, clear callbacks/timer/abort listener, and terminate on success, rejection, browser worker errors, cancellation, timeout, or unmount. `src/components/AiBrowserTool.tsx:690`, `:692`, and `:835` connect cleanup and cancellation to the mounted UI. A 90-second total worker watchdog supplies retryable failure.
3. **Unbounded image handoff:** the baseline accepted byte/pixel bombs and corrupt input into worker startup. `src/lib/browserOcrInput.ts:1`, `:29`, `:124`, `:129`, `:132`, and `:145` enforce metadata bytes, actual bytes, encoded dimensions and structural container checks BEFORE browser decoding, canvas sizing, or worker construction. Corrupt compressed image data with otherwise bounded headers is rejected by the browser decoder before any OCR worker is created. Decoded dimensions are checked again before canvas sizing.

The narrow worker adapter mirrors only Tesseract's four existing `load`, `loadLanguage`, `initialize`, and `recognize` messages. It does not implement recognition, introduce server inference, intercept the global Worker constructor, or alter Tesseract assets. The usual async `createWorker` hides its native handle until initialization resolves, so retaining that API would not meet cancellation of a stalled core/language load. The mounted test compares the adapter's actual initialization/recognition payloads with the installed client, excluding only the input image and generated IDs.

Self-hosted worker/core/language locations and the six language values (`eng`, `spa`, `fra`, `deu`, `ita`, `por`) remain unchanged. Failure recovery uses the existing Read text action and a fresh operation/worker. Cancellation clears the current result; existing successful history remains in-tab.

## Input Contract

- Input cap: 10,485,760 bytes (the UI says 10 MB), 8,000,000 pixels, and 8192 pixels on either side. Reject byte metadata before reading; validate actual read length again.
- Supported inputs are still PNG, 8-bit baseline/progressive JPEG, and static WebP (VP8, VP8L, VP8X). Filename extensions are not trusted; bytes determine the decoder MIME. Empty MIME is allowed through to header inspection.
- PNG chunk bounds, missing/duplicate headers, missing image/end chunks and animation chunks are checked. JPEG marker/segment bounds, scan termination, duplicate frames and deferred-height DNL are checked. WebP RIFF/chunk bounds, animation flags/chunks, duplicate bitstreams and conflicting canvas/bitstream dimensions are checked.
- Animated PNG/WebP and other formats including SVG, GIF, BMP, TIFF, AVIF and HEIC are now explicitly rejected, with a PNG export suggestion. This intentionally narrows the former `image/*` picker to formats whose pixel bounds can be checked here.
- Validated images are decoded locally, checked again (including EXIF width/height swaps), and re-encoded to one bounded PNG before Tesseract receives them. The normalized PNG cap is 32,065,536 bytes. Original files are not modified or written out.
- Bitmaps are closed and temporary canvases reset in `finally`, including late decode completion after cancellation/unmount. Native image read/decode/encode promises are not themselves abortable: their bounded in-flight work may finish, but cannot create a worker or publish stale state after invalidation.

## Red-Green Evidence

All commands below ran from the worktree above. Test runner: installed Vitest 4.1.10. Mounted browser: Chromium 151.0.7922.34, headless, actual React component and actual image decoding. In the lifecycle suite only the native OCR worker is controlled; the separate offline smoke below uses a genuine native worker and cached Tesseract/WASM/model bytes. All browser requests are intercepted locally. No model/analytics/download request reaches the external network.

| Run | Exact Command | Result |
| --- | --- | --- |
| RED, 14:13:09 | `npm.cmd test -- src/components/BrowserOcrLifecycle.test.ts --maxWorkers=1` | 22 failed, 6 passed, 28 total, exit 1, 37.45 s. Stale-result tests: expected 0 matching nodes, received 1. Unmount: expected one termination, received 0. Cancel control absent. Invalid-input alert absent. Six language-routing cases passed already. |
| New parser contract, 14:15:12 | `npm.cmd test -- src/lib/browserOcrInput.test.ts --maxWorkers=1` | Expected missing `./browserOcrInput` module, exit 1. This is scaffolding red, not a behavioral reproduction claim. |
| Integration iterations | `npm.cmd test -- src/components/BrowserOcrLifecycle.test.ts src/lib/browserOcrInput.test.ts --maxWorkers=1` | Initial integration attempts had 26 then 11 mounted failures; the pure parser suite passed. Corrected the harness's asynchronous startup wait to identify the new worker by its index rather than accidentally targeting a terminated previous worker on retry. Startup polling now allows bounded real decoding time. A single `-t 'preserves eng'` check also passed during diagnosis. |
| GREEN, 14:22:06 | `npm.cmd test -- src/components/BrowserOcrLifecycle.test.ts src/lib/browserOcrInput.test.ts --maxWorkers=1` | 75 passed, exit 0, 65.88 s, including installed-client packet parity and actual JPEG/WebP decoding. |
| Expanded GREEN, 14:25:03 | `npm.cmd test -- src/components/BrowserOcrLifecycle.test.ts src/lib/browserOcrInput.test.ts --maxWorkers=1` | **80 passed, 0 failed, exit 0, 71.41 s.** 39 mounted lifecycle/input tests plus 41 parser/byte-bound tests. These are distinct tests, not summed repeated executions. |
| Real cached inference and exact contract guard, 14:33:34 | `npm.cmd test -- src/components/BrowserOcrOffline.test.ts --maxWorkers=1 --reporter=verbose` | **2 passed, exit 0, 2.95 s.** Actual component, Tesseract 7.0.0 worker, relaxed-SIMD LSTM core and local English traineddata; no mocked recognition. |
| Final OCR suite, 14:34:18 | `npm.cmd test -- src/components/BrowserOcrLifecycle.test.ts src/components/BrowserOcrOffline.test.ts src/lib/browserOcrInput.test.ts --maxWorkers=1` | **83 passed, exit 0, 79.12 s.** 40 mounted lifecycle/input cases, 41 parser/input cases and 2 contract/actual offline inference cases. |
| Legacy audit RED, 14:36:37 | `npm.cmd test -- src/data/siteContentAudit.test.ts -t 'keeps browser AI tools private, lazy loaded, and fully documented' --maxWorkers=1` | 1 failed, 53 skipped, exit 1, 1.03 s. Its old `await import('tesseract.js')` source assertion no longer described the native adapter. |
| Legacy audit GREEN, 14:37:27 | Same exact focused legacy-audit command | 1 passed, 53 skipped, exit 0, 1.09 s. No unrelated expectations removed. |
| Final shared audit and strengthened offline lazy-load smoke, 14:37:30 | `npm.cmd test -- src/data/siteContentAudit.test.ts src/components/BrowserOcrOffline.test.ts --maxWorkers=1 --reporter=verbose` | **56 passed, exit 0, 4.04 s.** All 54 content-audit tests plus the two OCR offline/contract tests. Actual English recognition again passed, 1909 ms from click through evidence collection. |

These final runs cover **137 distinct passing tests**, not 83 + 56 duplicated counts: 83 OCR cases plus 54 shared content-audit cases. The final offline test also asserts zero native workers and zero worker/core/language asset requests after mount AND after file selection, before the explicit Read text click.

The authorized shared fixture edit is limited to replacing the obsolete OCR dynamic-import assertion with checks for the explicit click path, image preflight before recognition, function-scoped native worker creation, fixed local asset base and worker/core/language paths, cancellation/termination, and absence of HTTP/upload primitives in the OCR helpers. Existing Transformers/franc lazy imports, no top-level Tesseract import, public privacy wording, FAQ/example counts, guide registry checks, language assets and all non-OCR cases remain unchanged. The real offline lazy-load assertions supply behavioral evidence in addition to source-shape checks.

Final coverage includes replacement of file/language/both; stale success before/during/after B, stale failure/progress/finalization and history protection; Cancel and unmount at all four worker stages; constructor/post failures; `onerror`, `onmessageerror`, worker rejection and watchdog; retry; all six language selections/results; foreign/duplicate/malformed replies; byte, empty, unsupported, corrupt and enormous PNG/JPEG/WebP headers before decode/worker allocation; bounded headers with corrupt compressed pixels; unexpected decoded dimensions; late cancelled reads; late unmounted bitmap cleanup; exact limits and every truncated prefix of the synthetic supported headers. Every mounted test checks for no uncaught page errors.

Pure parser fixtures describe encoded structure, not real OCR or valid compressed images. Their intentionally synthetic payload/CRC bytes are not presented as inference fixtures. Mounted happy paths separately use genuine browser-generated image bytes and the genuine browser decoder.

### Real Offline Worker And Drift Guard

At the coordinator's request, `src/components/BrowserOcrOffline.test.ts` now asserts exact package versions **7.0.0** for both Tesseract client and core, plus SHA-256 pins for installed client/dispatch source, installed and public worker bytes, all three installed/public LSTM core loader variants, and the local English traineddata. A version or byte change fails this test and requires explicit adapter-contract review; it is not accepted merely because `package.json` allows a compatible semver range. This is a test/release guard, not runtime fetching or a new dependency pin in a shared manifest.

The native offline test mounts the actual OCR component, generates a 1200 x 220 white PNG with black 64px Arial text in browser memory, and requires the exact output `ACCESS FREE TOOLS 12345`. The Worker subclass delegates actual construction, posting, message dispatch, recognition and termination to the browser's native Worker; it records envelopes only. A fresh browser context has service workers blocked. Its context-wide route whitelist fulfills only already-cached files and aborts everything else, including worker-origin requests. Missing cache is a test failure, not an instruction to download.

The 14:33 smoke produced exact text in **1890 ms** measured from the Read text click through final evidence collection. It served only:

| Local Cache Path | SHA-256 |
| --- | --- |
| `public/ai-models/tesseract/worker.min.js` | `576B7DF7E3393E137E51849357C9ADB53FE7AC1BB69BFA06CF3D61520F182C6D` |
| `public/ai-models/tesseract/core/tesseract-core-relaxedsimd-lstm.wasm.js` | `861A536CF9EF8E63CB644D57BAB39C388F37F7D6B6F60024B741C5F6B39A59B3` |
| `public/ai-models/tesseract/lang/eng.traineddata.gz` | `ED350F3752F81EE8F38769EDC14D92D997DABABE23B565C59879372CC46A2468` |

Worker/core cache files match installed v7.0.0 distribution bytes. The selected `.wasm.js` contains the core; no additional WASM/network download occurred. Blocked/unexpected requests: 0. Uncaught page errors: 0. Native worker termination count: 1; component callbacks cleared. This single timing is not a device/performance benchmark.

Actual sent job IDs were `ocr-1-0` (load), `ocr-1-1` (loadLanguage), `ocr-1-2` (initialize), and `ocr-1-3` (recognize). Recognition progress arrived with **outer** action `recognize` / jobId `ocr-1-3`, while **nested** `data.jobId` remained `ocr-1-0`, as the pinned v7 core callback captures the original load job. `browserOcrWorker.ts:53` deliberately checks the outer envelope. The offline test asserts both identities against actual packets; an additional mounted controlled case verifies that such a nested load ID does not suppress the visible `recognizing text 50%` status.

### Focused Typechecks

Both commands below exited 0 on the six OCR source/test files at 14:34, including the new offline fixture. TS6 is 6.0.2; TS7 is 7.0.2. The coordinator-reported implicit-any worker callbacks are resolved by the explicit inspected worker-array return type. The later four pre-click lazy-load assertions and authorized shared audit expectation edit were transpiled/executed in the passing 14:37 run, but were not separately typechecked again after the coordinator requested a no-concurrent-process source freeze. Production component/helper code did not change after those passing typechecks. Integrated typecheck remains coordinator-owned.

```powershell
node node_modules/typescript/lib/tsc.js --ignoreConfig --noEmit --skipLibCheck --strict --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022,DOM --types node,vitest/globals --jsx react-jsx src/components/AiBrowserTool.tsx src/components/BrowserOcrLifecycle.test.ts src/components/BrowserOcrOffline.test.ts src/lib/browserOcrInput.ts src/lib/browserOcrInput.test.ts src/lib/browserOcrWorker.ts
node node_modules/@typescript/native/bin/tsc --ignoreConfig --noEmit --skipLibCheck --strict --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022,DOM --types node,vitest/globals --jsx react-jsx src/components/AiBrowserTool.tsx src/components/BrowserOcrLifecycle.test.ts src/components/BrowserOcrOffline.test.ts src/lib/browserOcrInput.ts src/lib/browserOcrInput.test.ts src/lib/browserOcrWorker.ts
```

An exploratory TS6 invocation with the additional non-default `--noUncheckedIndexedAccess` flag reported the pre-existing non-OCR `scores[0].label` at `AiBrowserTool.tsx:567`. It was left untouched as outside ownership. The normal strict commands above are the passing focused checks; the exploratory failure is not hidden or claimed fixed.

`git diff --check -- src/components/AiBrowserTool.tsx src/components/BrowserOcrLifecycle.test.ts src/lib/browserOcrInput.ts src/lib/browserOcrInput.test.ts src/lib/browserOcrWorker.ts` exited 0; Git emitted only its LF-to-CRLF working-copy warning. No full `test:smoke`, `check:ai-assets`, full build/check, or production browser audit was run: integration is coordinator-owned and shared full runs were explicitly excluded.

The remove-ai-marks service health check succeeded. Read-only `/inspect` on the two new helper texts reported zero deterministic Layer A findings. No cleaning, metadata/disclosure removal, or claim about human authorship/statistical watermark absence was made.

## Exact Source Fingerprints

SHA-256 of raw on-disk file bytes, obtained using `Get-FileHash -Algorithm SHA256`. All paths below are relative to `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`. These fingerprints identify the final offline-smoke/TS6/TS7 source, independently of concurrent work elsewhere. Production OCR source did not change during the offline-smoke addition. Git line-ending normalization can change byte hashes without a semantic source change; recheck if the coordinator stages/rewrites these files.

| Path | SHA-256 |
| --- | --- |
| `src/components/AiBrowserTool.tsx` | `D1FC472AC90707D22D6F7E48C62FAC8392C75F1F46166E0C2CF9D92B8ADB327F` |
| `src/lib/browserOcrInput.ts` | `809821A7FD9B0511F1395C6EB66B77B73FF6CFA434462A5095BA4EBB468A449F` |
| `src/lib/browserOcrWorker.ts` | `8479EF7B08C78DDCD07FAFC2CDCB5B5335A8B07CF395C22FCA3DA197259713B6` |
| `src/components/BrowserOcrLifecycle.test.ts` | `6A49C2847EC35BD8068FD8BA30EAD4387FC1537CC5ADD7FD2FAC1CA7B0830770` |
| `src/components/BrowserOcrOffline.test.ts` | `56698A3CFAD95897DDBFC0827DB797FE28FA98B564FB688280CE2D819999229F` |
| `src/lib/browserOcrInput.test.ts` | `84FAD469C271A53E98850CAFF6AE62154FA56E4977B4D339F7D3218CDB427963` |
| `src/data/siteContentAudit.test.ts` (authorized OCR expectations only) | `3AF291DF2B2B6AB6724EC2F89CDDE5B2C2A35D68CB55FF70EF880A47FDE6B677` |

## Remaining Acceptance And Limits

- **One real cached English inference is proven, not broad language readiness.** The English synthetic smoke confirms this local pinned worker/core/model combination executes through the actual component and adapter. Spanish, French, German, Italian and Portuguese have controlled routing/result attribution tests only; their actual recognition remains unverified. No production/deployed asset equivalence or real multilingual accuracy corpus is claimed.
- **Real browser/device readiness remains unverified:** Chrome/Edge cold and warm loads; large-image inference and practical recognition quality after PNG normalization; timeout suitability for slow connections; cache/load failure and retry with real assets; peak/recovered native/WASM memory; Safari/Firefox and actual Android/iOS devices. Chromium test execution does not certify these environments.
- **Bounds are input/allocation guards, not a total-memory ceiling or a decoder security proof.** No genuine huge pixel image was decoded. The browser holds bounded source/bitmap/canvas/PNG buffers, the worker receives a clone, and Tesseract adds its own WASM/model allocations. Compressed metadata adversarial fuzzing, codec vulnerabilities, real 8-MP workloads and memory reclamation timing are not proven by these tests.
- **Format limits are intentional:** animations, unsupported formats and uncommon JPEG structures are rejected; common EXIF orientation is accounted for in source but no real camera-orientation/lossless-WebP/progressive-JPEG inference corpus was run. Lossless/extended WebP and progressive JPEG have synthetic parser coverage, not a real-model corpus claim.
- No full-site styling screenshot audit or production privacy/network trace was run. The mounted tests are actual component execution, not full-site visual/device acceptance.
- SEC-02 evidence and provider refresh remain with their assigned owner; Ask/API and integration fullcheck remain with the coordinator. No dependency gate, campaign status, task approval, or release proof has been changed here.

Minimal next task: Release Judge inspects these exact source hashes and focused results; coordinator runs the authorized integration gates on stable shared source. Before BR-03's full BP-08 language acceptance is claimed, expand beyond this single English smoke to actual browser OCR for English, Spanish, French, German, Italian and Portuguese with the self-hosted assets, plus real cancel/retry and measured realistic resource behavior. Keep unavailable evidence explicitly unverified.

**Freeze:** All owned test/browser processes exited before the 14:38 handoff; no server was started. No further source/test edits or commands are running. The coordinator-reported unrelated SEO review timeout is not changed or treated as an OCR regression; integration will rerun without concurrent specialist load before any test-budget decision. Only this report and the append-only worklog were finalized after freeze. No approval claimed.
