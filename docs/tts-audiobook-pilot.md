# Browser-Only Multilingual TTS Audiobook Pilot

## Decision

The pilot uses the existing Access Free Tools Astro 7 application on Hostinger Node 24. It does not require or permit a VPS purchase, separate TTS server, paid inference API, Redis queue, Docker deployment, DNS record, background worker, or owner PC.

Supertonic 3 runs in a Web Worker on the visitor's device through ONNX Runtime Web. The existing Hostinger site serves the page and JavaScript. Pinned model files are fetched from Hugging Face only after the visitor presses the model-load button.

Both pilot pages remain `noindex,follow` and outside XML sitemaps until production-browser testing and the seven-day beta gate pass.

## Permanent Cost Boundary

- No hosting purchase or plan upgrade.
- No VPS, cloud GPU, paid speech API, or separately billed compute.
- No new DNS host such as `tts.accessfreetools.com`.
- No server-side storage, queue, cron job, database, or retention service.
- No requirement for Brendan's computer to remain powered on.
- Stop the feature rather than adding paid infrastructure if browser inference is not reliable enough.

## Browser Architecture

1. The Astro page loads the React interface only on the TTS route.
2. Pasted text, TXT, and EPUB files are parsed locally.
3. The parser rejects unsafe ZIP paths, excessive expansion, scripts, remote resources, and unsupported formats.
4. The visitor explicitly loads about 398 MB of pinned Supertonic ONNX assets from Hugging Face.
5. A dedicated browser worker prefers WebGPU and falls back to WebAssembly.
6. The selected chapter is synthesized locally and converted to a 44.1 kHz mono WAV.
7. The audio uses a temporary object URL in the current tab. Access Free Tools does not upload or retain it.

The source implementation is adapted from Supertone's MIT-licensed browser example at commit `7e2804f96016a7028cb1ed627353c61c1e9dd281`. The model is pinned to revision `3cadd1ee6394adea1bd021217a0e650ede09a323` and remains subject to its OpenRAIL-M license.

## Honest Product Limits

- Pasted text, TXT, and EPUB only.
- Up to 10 MB compressed input, 25 MB expanded EPUB data, 1,000 ZIP entries, 100 readable chapters, and 500,000 parsed characters.
- Generate one selected chapter of at most 10,000 characters at a time.
- 31 named language choices plus `Language not specified, best effort`. The fallback is not language detection.
- Ten fixed voices: F1-F5 and M1-M5.
- Speed from 0.9x to 1.5x and 4-12 quality passes.
- WAV preview and download only. No MP3, M4B, merged book, ZIP, account, sharing link, voice upload, or cloning.
- Model download, inference speed, memory use, and compatibility depend on the visitor's browser and device.
- WebAssembly can be substantially slower than WebGPU.
- Refreshing or closing the tab discards generated audio that has not been downloaded.

## Privacy And Analytics

- Text, chapter content, filenames, and audio do not go to Access Free Tools.
- Hugging Face receives ordinary model-file requests after explicit model loading, but those requests do not contain chapter text.
- Text, file, status, and audio surfaces use Microsoft Clarity masking.
- Analytics may record model ready, generation started, generation completed, cancellation, and download. They must not record text, filenames, language, voice, output, or source metadata.
- The tool requires a rights and model-terms confirmation before generation.

## Model And Dependency Pins

- Supertonic source commit: `7e2804f96016a7028cb1ed627353c61c1e9dd281`
- Supertonic 3 model revision: `3cadd1ee6394adea1bd021217a0e650ede09a323`
- `onnxruntime-web`: `1.27.0`
- Model download: approximately 398 MB before one voice-style file
- Model files: duration predictor, text encoder, vector estimator, vocoder, configuration, and Unicode indexer

Primary sources:

- https://github.com/supertone-inc/supertonic
- https://huggingface.co/Supertone/supertonic-3/tree/3cadd1ee6394adea1bd021217a0e650ede09a323
- https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE
- https://onnxruntime.ai/docs/tutorials/web/
- https://www.w3.org/TR/epub-33/

## Internal Command

```powershell
npm run tts:browser-check
```

The check verifies the pinned dependency and model revision, dedicated worker, WebGPU/WASM fallback, WAV creation, Clarity masking, explicit model size, and absence of the rejected server runtime.

## Release Gates

1. Unit, type, build, security, site, schema, image, SEO, and accessibility checks pass.
2. The route-specific worker and ONNX runtime do not load on unrelated pages.
3. Current Chrome and Edge generate and download real WAV audio on desktop.
4. Firefox, Safari, Android, and iOS are tested and documented as pass, fallback, or unsupported. Do not guess.
5. Cancellation releases the worker and in-memory model.
6. No chapter text appears in network requests, logs, analytics, or Clarity.
7. A publicly accessible but `noindex` production beta remains stable for seven days.
8. The Release Judge records the evidence before changing index policy.

If the model download, device memory, browser support, or third-party model hosting is not good enough, keep the pages noindexed or remove the pilot. Paid infrastructure is not the fallback.
