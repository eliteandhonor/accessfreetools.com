# Browser-Only Text to Speech MP3 Pilot

## Decision

The pilot uses the existing Access Free Tools Astro 7 application on Hostinger Node 24. It does not require or permit a VPS purchase, separate TTS server, paid inference API, Redis queue, Docker deployment, DNS record, background worker, or Brendan's PC.

Supertonic 3 runs in a Web Worker on the visitor's device through ONNX Runtime Web. The same worker encodes the generated samples as a 128 kbps MP3. The Hostinger site serves the page and JavaScript. Pinned model files are fetched from Hugging Face only when the visitor starts the first generation.

The tool and guide remain `noindex,follow` and outside XML sitemaps until browser compatibility and the seven-day beta gate pass.

## Product Scope

The product is deliberately small:

1. Paste up to 10,000 characters.
2. Choose a known language, one of ten fixed voices, and reading speed.
3. Confirm permission to use the text and accept the model terms.
4. Press **Generate MP3**.
5. Preview the result and press **Download MP3**.

There is no TXT or EPUB upload, chapter parser, model-load button, WAV output, account, server queue, URL import, voice upload, or voice cloning.

## Cost Boundary

- No hosting purchase or plan upgrade.
- No VPS, cloud GPU, paid speech API, or separately billed compute.
- No new DNS host such as `tts.accessfreetools.com`.
- No server-side storage, queue, cron job, database, or retention service.
- No requirement for Brendan's computer to remain powered on.
- Stop the feature rather than adding paid infrastructure if browser inference is not reliable enough.

## Browser Architecture

1. The Astro page loads the React interface only on the TTS route.
2. Pasted text stays in the current browser tab.
3. The first generation downloads about 398 MB of pinned Supertonic ONNX assets from Hugging Face.
4. A dedicated browser worker prefers WebGPU and falls back to WebAssembly.
5. The worker generates 44.1 kHz mono samples and encodes them as a 128 kbps MP3 with pinned `wasm-media-encoders`.
6. The MP3 uses a temporary object URL in the current tab. Access Free Tools does not upload or retain it.

The speech implementation is adapted from Supertone's MIT-licensed browser example at commit `7e2804f96016a7028cb1ed627353c61c1e9dd281`. The model is pinned to revision `3cadd1ee6394adea1bd021217a0e650ede09a323` and remains subject to its OpenRAIL-M license. MP3 encoding uses the MIT-licensed `wasm-media-encoders@0.7.0` package.

## Honest Limits

- Pasted text only, up to 10,000 characters per generation.
- 31 named language choices plus `Language not specified, best effort`. The fallback is not language detection.
- Ten fixed voices: F1-F5 and M1-M5.
- Speed from 0.9x to 1.5x.
- 128 kbps mono MP3 preview and download.
- No file input, M4B, merged book, ZIP, account, sharing link, voice upload, or cloning.
- Model download, inference speed, memory use, and compatibility depend on the visitor's browser and device.
- WebAssembly can be substantially slower than WebGPU.
- Refreshing or closing the tab discards generated audio that has not been downloaded.

## Privacy And Analytics

- Pasted text and generated audio do not go to Access Free Tools.
- Hugging Face receives ordinary model-file requests after generation begins, but those requests do not contain the pasted text.
- Text, status, and audio surfaces use Microsoft Clarity masking.
- Analytics may record model ready, generation started, generation completed, cancellation, and download. They must not record text, language, voice, or output.
- The tool requires a rights and model-terms confirmation before generation.

## Model And Dependency Pins

- Supertonic source commit: `7e2804f96016a7028cb1ed627353c61c1e9dd281`
- Supertonic 3 model revision: `3cadd1ee6394adea1bd021217a0e650ede09a323`
- `onnxruntime-web`: `1.27.0`
- `wasm-media-encoders`: `0.7.0`
- Model download: approximately 398 MB before one voice-style file

Primary sources:

- https://github.com/supertone-inc/supertonic
- https://huggingface.co/Supertone/supertonic-3/tree/3cadd1ee6394adea1bd021217a0e650ede09a323
- https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE
- https://onnxruntime.ai/docs/tutorials/web/
- https://github.com/arseneyr/wasm-media-encoders

## Internal Command

```powershell
npm run tts:browser-check
```

The check verifies pinned dependencies and model revision, the dedicated worker, WebGPU/WASM fallback, MP3 creation and download, Clarity masking, the explicit model size, paste-only input, and absence of a rejected server runtime.

## Release Gates

1. Unit, type, build, security, site, schema, image, SEO, and accessibility checks pass.
2. The route-specific worker, model runtime, and MP3 encoder do not load on unrelated pages.
3. Current Chrome and Edge generate, preview, and download a valid MP3 on desktop.
4. Firefox, Safari, Android, and iOS are tested and documented as pass, fallback, or unsupported. Do not guess.
5. Cancellation releases the worker and in-memory model.
6. No pasted text appears in network requests, logs, analytics, or Clarity.
7. A publicly accessible but `noindex` production beta remains stable for seven days.
8. The Release Judge records the evidence before changing index policy.

If the model download, device memory, browser support, or third-party model hosting is not good enough, keep the pages noindexed or remove the pilot. Paid infrastructure is not the fallback.
