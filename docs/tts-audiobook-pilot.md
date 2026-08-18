# Browser Text-to-Speech MP3 Pilot

## Decision

The tool runs entirely in the visitor's browser through the existing Astro 7 site on Hostinger Node 24. It does not require a VPS, paid API, server queue, DNS change, account, or the owner's computer.

The public beta remains noindex,follow and outside XML sitemaps until its browser and device gates pass. Paid infrastructure is not the fallback.

## User Flow

1. Paste up to 10,000 characters of text.
2. Choose Supertonic 3 or Kokoro 82M.
3. Choose a language supported by that browser model, a fixed voice, and speed.
4. Confirm permission to convert the text and accept the selected model terms.
5. Generate, preview, and download a 128 kbps mono MP3.

Only the selected model worker loads. Changing models terminates the old worker and releases its in-memory runtime before the other model can start.

## Model Choices

| Model | Browser support in this pilot | First download | Backend | Audio source |
| --- | --- | ---: | --- | --- |
| Supertonic 3 | 31 named languages, best effort, 10 fixed voices | About 398 MB plus a voice style | WebGPU with WebAssembly fallback | 44.1 kHz |
| Kokoro 82M q8 | US and UK English, 10 curated fixed voices | About 90 MB including the 88.1 MB model plus tokenizer and one voice | WebAssembly | 24 kHz |

Supertonic stays the default because it offers the broadest language coverage and can use WebGPU. Kokoro is an experimental smaller-download option for English. The current official Kokoro browser implementation exposes American and British English voices only, so this page does not claim its broader Python language list.

## Browser Architecture

1. The Astro page hydrates the React interface only on the TTS route.
2. Pasted text stays in the current browser tab.
3. A model-specific Web Worker downloads pinned files from Hugging Face only after generation starts.
4. Supertonic generates 44.1 kHz PCM. Kokoro generates 24 kHz PCM.
5. The same pinned wasm-media-encoders runtime encodes either source rate as a 128 kbps mono MP3.
6. The MP3 uses a temporary object URL in the current tab. Access Free Tools does not upload or retain it.
7. Kokoro input is split in order, phonemized, checked against the 509-token model limit, generated section by section, and joined with short silence. Long text must not be silently truncated.

## Model And Dependency Pins

- Supertonic browser source commit: 7e2804f96016a7028cb1ed627353c61c1e9dd281
- Supertonic 3 model revision: 3cadd1ee6394adea1bd021217a0e650ede09a323
- Kokoro official browser source commit: dfb907a02bba8152ca444717ca5d78747ccb4bec
- Kokoro ONNX model revision: 1939ad2a8e416c0acfeecc08a694d14ef25f2231
- Kokoro dtype: q8, resolved as model_quantized.onnx
- @huggingface/transformers: current project dependency
- onnxruntime-web: 1.27.0
- phonemizer: 1.2.1
- wasm-media-encoders: 0.7.0

Supertonic's browser implementation is MIT-licensed and its model weights use OpenRAIL-M. Kokoro's model and official browser implementation use Apache-2.0. The Kokoro text preparation is adapted from the pinned official browser source. Phonemizer.js is Apache-2.0 and wraps eSpeak NG, whose source uses GPL-3.0-or-later. The visible tool, guide, and terms page link to the relevant model and engine sources. This record is an engineering attribution note, not legal advice.

Primary sources:

- https://github.com/supertone-inc/supertonic
- https://huggingface.co/Supertone/supertonic-3/tree/3cadd1ee6394adea1bd021217a0e650ede09a323
- https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE
- https://github.com/hexgrad/kokoro/tree/dfb907a02bba8152ca444717ca5d78747ccb4bec/kokoro.js
- https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/tree/1939ad2a8e416c0acfeecc08a694d14ef25f2231
- https://huggingface.co/hexgrad/Kokoro-82M/blob/main/LICENSE
- https://github.com/xenova/phonemizer.js
- https://github.com/espeak-ng/espeak-ng
- https://github.com/arseneyr/wasm-media-encoders

## Other Models Reviewed

- PocketTTS remains a watch-list candidate. Its official project currently describes browser ports as community projects rather than an official browser runtime.
- Qwen3-TTS and Chatterbox are not adopted because their practical browser footprint and runtime requirements do not fit this no-server pilot.
- OmniVoice is not adopted because its current weights are non-commercial and its runtime is too heavy for this browser-only product.
- Voice-cloning models are out of scope. The tool provides fixed voices only.

## Honest Limits

- Pasted text only. No TXT, EPUB, PDF, DOCX, URL import, or file upload.
- 10,000 characters per generation.
- Supertonic: 31 named language choices, best effort, and F1-F5/M1-M5 fixed voices.
- Kokoro: US and UK English with 10 curated fixed voices.
- Speed from 0.9x to 1.5x.
- 128 kbps mono MP3 preview and download.
- No M4B, merged book, ZIP, account, sharing link, voice upload, or cloning.
- Model download, inference speed, memory use, and compatibility depend on the visitor's browser and device.
- Refreshing or closing the tab discards generated audio that has not been downloaded.
- Names, abbreviations, numbers, mixed-language text, and unusual punctuation can be mispronounced.

## Privacy And Analytics

- Pasted text and generated audio do not go to Access Free Tools.
- Hugging Face receives ordinary pinned model, tokenizer, and voice-file requests after generation begins. Those requests do not contain the pasted text.
- Text, status, and audio surfaces use Microsoft Clarity masking.
- Analytics may record model ready, generation started, generation completed, cancellation, and download. They must not record model choice, text, language, voice, file content, or output.
- The tool requires a rights and model-terms confirmation before generation.

## Internal Commands

    npm run tts:browser-check
    npm run typecheck
    npm run typecheck:ts6
    npm test
    npm run build
    npm run check

The browser check verifies both pinned model revisions, model-specific lazy workers, one-model-at-a-time selection, MP3 creation for 24 kHz and 44.1 kHz sources, Clarity masking, paste-only input, and the absence of rejected server infrastructure.

## Current Browser Evidence

Verified on August 18, 2026 in desktop Playwright Chromium against the local Astro production preview:

- Kokoro generated and downloaded a 10.368-second MP3 at 24 kHz, mono, 128 kbps.
- Supertonic generated and downloaded a 10.423-second MP3 at 44.1 kHz, mono, approximately 128 kbps.
- Both files contained audible, non-silent output according to FFmpeg volume analysis.
- Switching from Kokoro to Supertonic terminated the first worker before loading the second model.
- The generated-audio controls and model cards had no horizontal overflow at 1440px desktop or 390px mobile viewport widths.
- The inspected generation requests contained model and runtime files only. The pasted test sentence did not appear in a request URL or body.
- Browser generation produced no page errors. Transformers.js emitted one non-fatal architecture-mapping warning while loading Kokoro.

This is desktop Chromium evidence, not proof for Edge, Firefox, Safari, Android, or iOS. Mobile layout was inspected at a simulated viewport, but generation was not run on a physical mobile device. The pages therefore remain `noindex,follow` and outside XML sitemaps.

## Release Gates

1. Unit, TypeScript 7, TypeScript 6, build, security, site, schema, image, SEO, and accessibility checks pass.
2. The route-specific workers, model runtimes, phonemizer, and MP3 encoder do not load on unrelated pages.
3. Current Chrome generates, previews, and downloads valid MP3 files with both models.
4. Current Edge generates, previews, and downloads valid MP3 files with both models.
5. Firefox, Safari, Android, and iOS are documented as pass, fallback, or unsupported. Do not guess.
6. Long Kokoro text is generated in order without silent truncation.
7. Cancellation and model switching terminate the active worker.
8. No pasted text appears in network requests, logs, analytics, or Clarity.
9. The publicly accessible noindex beta remains stable for seven days.
10. The Release Judge records evidence before changing the index policy.

If download size, memory, browser support, licensing, or third-party model hosting is not good enough, keep the pages noindexed or remove the model. Do not buy infrastructure to work around a failed browser pilot.
