# OCR English sample workflow proof

The downloadable file is a synthetic QA image made from the English image definition that already existed in `BrowserOcrOffline.test.ts` at base commit `c23ac9f3`. It contains `ACCESS FREE TOOLS 12345` in black 64px Arial on a white 1,200 by 220 pixel canvas, drawn at x=40, y=130. It is a workflow example, not an accuracy corpus.

## Exact sample

- Public file: `public/samples/ocr-synthetic-english.png`.
- Download URL: `/samples/ocr-synthetic-english.png`.
- File size: 23,201 bytes.
- SHA-256: `a62b60a70b2763cc4c93c8f86acb62121a2f3e145c13303e8f35629517b53be8`.
- Definition: `src/components/ocrEnglishQaFixture.ts`.
- Generator: `scripts/generate-ocr-english-qa-fixture.mjs`.

The generator uses the existing canvas recipe in installed Chromium and blocks every network request. It refuses to replace an existing file. The stored PNG is the reference artifact; a different browser or installed font may produce different PNG bytes from the same drawing recipe.

## Actual browser result

Run the focused check from the repository root with existing dependencies and model files:

```text
npm test -- src/components/BrowserOcrOffline.test.ts src/lib/browserOcrInput.test.ts
```

The October 5 run passed all 43 tests. Its native browser check completed at `2026-10-05T03:14:20.943Z`, using Node `v24.21.0`, Chromium `151.0.7922.34`, and Tesseract.js/core `7.0.0`.

The test opened a fresh browser context and downloaded the exact public PNG through a loopback-only static server. It verified the downloaded bytes and hash before selecting them in the real OCR component. Neither page load nor file selection created an OCR worker or requested OCR assets. Pressing **Read text** loaded the committed worker, core and English data and ran actual image recognition.

The extracted text was exactly:

```text
ACCESS FREE TOOLS 12345
```

The test then pressed **Copy result** and read the native browser clipboard. The clipboard contained the same exact line. The actual worker received `load`, `loadLanguage`, `initialize`, and `recognize` messages, reported recognition progress, and terminated once with message callbacks cleared. The recorded 1,928 ms interval includes result and clipboard checks; it is not a performance benchmark.

The selected asset hashes were:

| Asset | SHA-256 |
| --- | --- |
| `worker.min.js` | `576b7df7e3393e137e51849357c9adb53fe7ac1bb69bfa06cf3d61520f182c6d` |
| `core/tesseract-core-relaxedsimd-lstm.wasm.js` | `861a536cf9ef8e63cb644d57bab39c388f37f7d6b6f60024b741c5f6b39a59b3` |
| `lang/eng.traineddata.gz` | `ed350f3752f81ee8f38769edc14d92d997dababe23b565c59879372cc46a2468` |

The contract test also pins the v7 client/dispatcher and all three available local LSTM core loaders. Missing local assets cause a failure; the test cannot download replacements.

## Network and coverage limits

Every page and worker request passes through an exact loopback whitelist. All other requests are blocked. The Windows environment attempted one `http://local.adguard.org/` content-script request, which stayed blocked and is recorded separately as an environment injection. There were no unexpected application requests or page errors. This proves the component workflow in the test harness; it does not test the site's separate analytics or session replay.

Each successful run writes full packets, progress, asset hashes, output, clipboard text and blocked-request evidence to ignored `output/ocr-english-qa/latest.json`. That file is a latest-run artifact and will change on subsequent runs. This document records the run above.

Only one simple English image was recognized in this check. Existing lifecycle tests with mocked worker replies test language selection and cancellation behavior, not real recognition accuracy in those languages. This check supplies no device, memory, handwriting, document-layout or multilingual accuracy benchmark.

The six-image Node experiment's raw `output/editorial-ocr-experiment/latest.json` and `latest.md` were not found at the authorized exact paths in the isolated, original or readiness worktrees. The existing script and named OCR article retain historical numeric claims; this single-image browser check does not recreate or validate them. No new Spanish experiment was run.

The named OCR editorial and `docs/editorial-source-reviews/legacy-source-hashes.json` are unchanged by this batch. The seven legacy editorial source/owner review gates remain unresolved. No source records or owner approvals were added.

## Guide and limit changes

The generated OCR guide now links the exact PNG, shows its reference text, and explains how to check and copy the result. It describes the implemented still PNG/JPEG/WebP input, one-image workflow, dimension limits and lack of image-editing controls. The byte-limit error now says **10 MiB**, matching the existing limit of 10,485,760 bytes; validation behavior is unchanged.

The OCR-specific privacy paragraphs already describe local image inference and self-hosted assets requested after **Read text**, with separate Privacy Policy guidance for analytics/session replay. They override the generic AI guide fallback. Rendered guide and download-link checks belong to the parent batch's built-page verification.
