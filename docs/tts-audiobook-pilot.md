# Browser Text-to-Speech MP3 Pilot

## Decision

The tool runs entirely in the visitor's browser through the existing Astro 7 site on Hostinger Node 24. It does not require a VPS, paid API, server queue, DNS change, account, or the owner's computer.

The public beta remains noindex,follow and outside XML sitemaps until its browser and device gates pass. Paid infrastructure is not the fallback.

## User Flow

1. Paste up to 10,000 characters of text or open a plain TXT file up to 64 KB.
2. Choose Supertonic 3 or Kokoro 82M.
3. Choose a language supported by that browser model, a grouped fixed voice, and speed.
4. Confirm permission to convert the text and accept the selected model terms.
5. Preview the first sentence if useful, then generate, name, preview, and download a 128 kbps mono MP3.

Only the selected model worker loads. Changing models terminates the old worker and releases its in-memory runtime before the other model can start.

## Model Choices

| Model | Browser support in this pilot | First download | Backend | Audio source |
| --- | --- | ---: | --- | --- |
| Supertonic 3 | 31 named languages, best effort, 10 fixed voices | About 398 MB plus a voice style | WebGPU with WebAssembly fallback | 44.1 kHz |
| Kokoro 82M HQ | US and UK English, 28 fixed voices | About 326 MB full precision; about 92 MB compatibility fallback | Full-precision WebGPU with q8 WebAssembly fallback | 24 kHz |

Supertonic stays the default because it offers the broadest language coverage. Its F1-F5 and M1-M5 presets now have concise descriptions derived from the official voice guide. Kokoro is the English-focused higher-quality option. It prefers the full-precision ONNX model on WebGPU and automatically retries with the compact q8 model on WebAssembly when WebGPU is unavailable or the high-quality path fails. The grouped selector exposes all 28 English voice files in the pinned release, and only the chosen file is loaded. Bella remains the default Kokoro voice. The current browser text preparation supports American and British English only, so this page does not expose or claim the pinned non-English voice files.

## Browser Architecture

1. The Astro page hydrates the React interface only on the TTS route.
2. Pasted text and locally opened TXT content stay in the current browser tab. The browser never sends the original file or filename.
3. A model-specific Web Worker downloads pinned files from Hugging Face only after generation starts.
4. Supertonic generates 44.1 kHz PCM. Kokoro generates 24 kHz PCM.
5. The same pinned wasm-media-encoders runtime encodes either source rate as a 128 kbps mono MP3.
6. The MP3 uses a temporary object URL in the current tab. Access Free Tools does not upload or retain it.
7. Kokoro input is split in order, phonemized, checked against the 509-token model limit, generated section by section, and joined with short silence. Long text must not be silently truncated.
8. Loading and generation use a 90-second no-progress watchdog. A stalled Kokoro job gets one automatic q8 WebAssembly retry; a second stall stops the worker and gives the user a clear recovery message.
9. The status area shows elapsed time, actual backend and precision, an indeterminate state when byte progress is unavailable, and a reduced-motion-safe mascot scene.
10. A voice preview uses the first complete sentence or at most 220 characters, reuses the selected worker, creates a separate temporary MP3, and never autoplays.
11. A readiness note reports whether Kokoro full precision can be attempted or whether the q8 compatibility path is expected. It is not a speed guarantee.

## Model And Dependency Pins

- Supertonic browser source commit: 7e2804f96016a7028cb1ed627353c61c1e9dd281
- Supertonic 3 model revision: 3cadd1ee6394adea1bd021217a0e650ede09a323
- Kokoro official browser source commit: dfb907a02bba8152ca444717ca5d78747ccb4bec
- Kokoro ONNX model revision: 1939ad2a8e416c0acfeecc08a694d14ef25f2231
- Kokoro preferred dtype: fp32, resolved as model.onnx on WebGPU
- Kokoro fallback dtype: q8, resolved as model_quantized.onnx on WebAssembly
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

Comparative context:

- https://openvoxai.com/blog/best-free-local-tts-models-2026

## Other Models Reviewed

- The supplied OpenVox comparison was used as a discovery list, then each candidate was checked against its primary project source before making an implementation decision.
- PocketTTS remains a watch-list candidate. Its official project currently describes browser ports as community projects rather than an official browser runtime.
- Qwen3-TTS and Chatterbox are not adopted because their practical browser footprint and runtime requirements do not fit this no-server pilot.
- OmniVoice is not adopted because its current weights are non-commercial and its runtime is too heavy for this browser-only product.
- Voice-cloning models are out of scope. The tool provides fixed voices only.

## Honest Limits

- Pasted text or a local plain TXT file up to 64 KB. No EPUB, PDF, DOCX, URL import, microphone, or server upload.
- 10,000 characters per generation.
- Supertonic: 31 named language choices, best effort, and F1-F5/M1-M5 fixed voices.
- Kokoro: US and UK English with 28 fixed voices, full-precision WebGPU, and automatic q8 WebAssembly compatibility fallback.
- Speed from 0.9x to 1.5x.
- A first-sentence preview capped at 220 characters, without autoplay.
- 128 kbps mono MP3 preview and download.
- No M4B, merged book, ZIP, account, sharing link, voice upload, or cloning.
- Model download, inference speed, memory use, and compatibility depend on the visitor's browser and device.
- Refreshing or closing the tab discards generated audio that has not been downloaded.
- Names, abbreviations, numbers, mixed-language text, and unusual punctuation can be mispronounced.

## Privacy And Analytics

- Pasted text, local TXT content, filenames, previews, and generated audio do not go to Access Free Tools.
- Hugging Face receives ordinary pinned model, tokenizer, and voice-file requests after generation begins. Those requests do not contain the pasted text.
- Text, status, and audio surfaces use Microsoft Clarity masking.
- Analytics may record model ready, TXT opened, preview or generation started and completed, cancellation, download, timeout, model-download failure, unsupported browser, and generation failure. They must not record model choice, text, language, voice, filename, file content, or output.
- The tool requires a rights and model-terms confirmation before generation.

## Internal Commands

    npm run tts:browser-check
    npm run tts:voice-check
    npm run typecheck
    npm run typecheck:ts6
    npm test
    npm run build
    npm run check

The browser check verifies both pinned model revisions, model-specific lazy workers, one-model-at-a-time selection, selected-voice loading, all 28 English Kokoro IDs, grouped selection, local TXT limits, bounded preview, no autoplay, portable filenames, readiness wording, text-free diagnostics, Kokoro full-precision and compatibility paths, bounded stall recovery, the mascot loading state, MP3 creation for 24 kHz and 44.1 kHz sources, Clarity masking, and the absence of rejected server infrastructure. The separate voice check confirms that all 28 pinned voice URLs remain reachable.

## Current Browser Evidence

Verified on August 18, 2026 against the local Astro production preview:

### Expanded 28-voice release candidate

- Installed Google Chrome and Microsoft Edge each generated a paused, blob-backed MP3 through Kokoro full-precision WebGPU with no page errors, console errors, or horizontal overflow at the 390px test width.
- Firefox generated a paused, blob-backed MP3 through Kokoro q8 WebAssembly with no page errors or console errors. The request trace loaded the q8 runtime and only the selected `af_bella` voice file.
- Playwright WebKit generated a paused, blob-backed MP3 through Kokoro q8 WebAssembly with no page errors or console errors. This proves the WebKit engine path on Windows, not physical Safari support.
- The worker now requires a usable WebGPU adapter instead of treating the presence of `navigator.gpu` as sufficient. This prevents Firefox and WebKit from attempting the larger full-precision model when no adapter is available.
- A local 113-character TXT file loaded without truncation or filename display. Its first sentence generated as a separate MP3 preview that remained paused until user action.
- The same loaded Chrome worker then generated 7.248 seconds of full audio in 0.8 seconds. FFprobe confirmed MPEG audio at exactly 128 kbps. The request trace contained the pinned Kokoro model files and only the selected Bella voice file, not the local text or filename.
- The portable filename test converted `My: Voice* Test?.wav` to `My-Voice-Test.mp3` before download.
- Desktop at 1440px and mobile layout at 390px had no horizontal overflow. The current full accessibility check passed every tested TTS page and viewport pair.
- Physical Android, iOS, and Safari generation have not been tested. They remain unsupported for beta compatibility claims until real-device evidence exists; viewport emulation is not counted.

### Earlier two-model runtime evidence

- Microsoft Edge loaded the full-precision Kokoro model on WebGPU, used the Bella voice, and generated an audible 8.808-second MP3 at 24 kHz, mono, exactly 128 kbps. The first uncached run completed in 70.4 seconds.
- A controlled Edge test blocked the full-precision model. The worker automatically loaded q8 Kokoro on WebAssembly and generated an audible 7.368-second MP3 at 24 kHz, mono, exactly 128 kbps in 37.6 seconds.
- A controlled Edge no-progress test confirmed one automatic compatibility retry, then a clear timeout error, worker unload, hidden Stop button, and restored Generate button. Production timeout remains 90 seconds.
- Google Chrome loaded full-precision Kokoro on WebGPU and generated a 6.3-second MP3 in 67.1 seconds on its first uncached run.
- Supertonic generated and downloaded a 10.423-second MP3 at 44.1 kHz, mono, approximately 128 kbps.
- The checked MP3 files contained audible, non-silent output according to FFmpeg volume analysis.
- Switching from Kokoro to Supertonic terminated the first worker before loading the second model.
- The loading and generated-audio controls had no horizontal overflow at 1440px desktop or 390px mobile viewport widths.
- The loading scene rendered five visible sound bars and the approved full-body mascot. Axe reported zero violations before and during loading at desktop and mobile widths.
- Reduced-motion mode disabled both the mascot and sound-wave animations while retaining progress, elapsed time, and status text.
- The inspected generation requests contained model and runtime files only. The pasted test sentence did not appear in a request URL or body.
- Browser generation produced no page errors. Transformers.js emitted one non-fatal architecture-mapping warning while loading Kokoro.

The seven-day beta restarts only after the expanded release is deployed and live generation is verified. The pages therefore remain `noindex,follow` and outside XML sitemaps.

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
