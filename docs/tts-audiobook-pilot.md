# Browser Text-to-Speech MP3 Pilot

## Decision

The tool runs entirely in the visitor's browser through the existing Astro 7 site on Hostinger Node 24. It does not require a VPS, paid API, server queue, DNS change, account, or the owner's computer.

The public beta remains noindex,follow and outside XML sitemaps until its browser and device gates pass. Paid infrastructure is not the fallback.

## User Flow

1. Paste up to 10,000 characters, or open a local TXT or Markdown file up to 64 KB or EPUB up to 8 MB.
2. Choose one MP3 or review, rename, and reorder imported chapters for separate MP3 output.
3. Choose Supertonic 3 or Kokoro 82M, then compare pre-recorded samples before choosing a language, default voice, and speed.
4. In chapter mode, keep the default voice, apply it to every chapter, or assign a different fixed voice to individual chapters.
5. Optionally save voice IDs as local favourites and review the estimated audio duration and 128 kbps MP3 size before loading a model.
6. Confirm permission to convert the text and accept the selected model terms.
7. Generate, listen to, and download one MP3 or separate ordered chapter MP3s with an audio-only ZIP.

Only the selected model worker loads. Changing models terminates the old worker and releases its in-memory runtime before the other model can start.

## Model Choices

| Model | Browser support in this pilot | First download | Backend | Audio source |
| --- | --- | ---: | --- | --- |
| Supertonic 3 | 31 named languages, best effort, 10 fixed voices | About 398 MB plus a voice style | WebGPU with WebAssembly fallback | 44.1 kHz |
| Kokoro 82M HQ | US and UK English, 28 fixed voices | About 326 MB full precision; about 92 MB compatibility fallback | Full-precision WebGPU with q8 WebAssembly fallback | 24 kHz |

Supertonic stays the default because it offers the broadest language coverage. Its F1-F5 and M1-M5 presets now have concise descriptions derived from the official voice guide. Kokoro is the English-focused higher-quality option. It prefers the full-precision ONNX model on WebGPU and automatically retries with the compact q8 model on WebAssembly when WebGPU is unavailable or the high-quality path fails. The grouped selector exposes all 28 English voice files in the pinned release, and only the chosen file is loaded. Bella remains the default Kokoro voice. The current browser text preparation supports American and British English only, so this page does not expose or claim the pinned non-English voice files.

## Browser Architecture

1. The Astro page hydrates the React interface only on the TTS route.
2. Pasted text and locally opened TXT, Markdown, and EPUB content stay in the current browser tab. The browser never sends the original file or filename.
3. Markdown is parsed through a structured mdast tree. EPUB is parsed through bounded ZIP and XML readers with traversal, encryption, zip-bomb, script, remote-resource, and malformed-document checks.
4. A model-specific Web Worker downloads pinned files from Hugging Face only after generation starts.
5. Each fixed voice has one short local MP3 sample. The shared player uses `preload="none"`, never autoplays, and fetches only the chosen sample when the user presses play. It does not start a worker or load a model.
6. Voice favourites and recents store validated voice IDs only. Text, language, filenames, and audio are not written to local storage.
7. A text-only estimator reports a conservative duration and 128 kbps size range without creating a worker, requesting a model, or sending analytics.
8. Supertonic generates 44.1 kHz PCM. Kokoro generates 24 kHz PCM. The same pinned encoder creates 128 kbps mono MP3 output.
9. Chapter mode can assign a different fixed voice to each chapter while keeping one selected model. Kokoro derives the US or UK English dialect from each assigned voice; Supertonic keeps the selected text language. New and imported chapters inherit the current default voice.
10. Chapter mode generates sequentially through the same loaded worker. Completed results survive a later failure or cancellation, and one failed chapter can be retried once.
11. Generated audio uses temporary object URLs in the current tab. The optional ZIP contains separate ordered MP3 files only, never source text or the original document.
12. Kokoro input is split in order, phonemized, checked against the 509-token model limit, generated section by section, and joined with short silence. Long text must not be silently truncated.
13. Loading and generation use a 90-second no-progress watchdog. A stalled Kokoro job gets one automatic q8 WebAssembly retry; a second stall stops the worker and gives the user a clear recovery message.
14. The status area shows elapsed time, actual backend and precision, an indeterminate state when byte progress is unavailable, and a reduced-motion-safe mascot scene.
15. A readiness note reports whether Kokoro full precision can be attempted or whether the q8 compatibility path is expected. It is not a speed guarantee.

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
- mdast-util-from-markdown: 2.0.3
- mdast-util-to-string: 4.0.0
- @rgrove/parse-xml: 4.2.3
- @zip.js/zip.js: 2.8.52

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

- Pasted text, local TXT or Markdown up to 64 KB, or local EPUB up to 8 MB. No PDF, DOCX, URL import, microphone, or server upload.
- 10,000 characters per single result or combined chapter set, with at most 100 chapters.
- Supertonic: 31 named language choices, best effort, and F1-F5/M1-M5 fixed voices.
- Kokoro: US and UK English with 28 fixed voices, full-precision WebGPU, and automatic q8 WebAssembly compatibility fallback.
- Speed from 0.9x to 1.5x.
- One pre-recorded 1.0x sample for each of the 38 fixed voices, loaded only when played and without autoplay or model startup.
- At most 20 favourite and 8 recent validated voice IDs are stored locally; no user text is stored with them.
- Pre-download duration and file-size estimates are ranges, not promises.
- 128 kbps mono MP3 playback and download, with per-chapter fixed voices, separate chapter MP3 files, and an ordered audio-only ZIP.
- No M4B, merged book, account, sharing link, voice upload, or cloning.
- Model download, inference speed, memory use, and compatibility depend on the visitor's browser and device.
- Refreshing or closing the tab discards generated audio that has not been downloaded.
- Names, abbreviations, numbers, mixed-language text, and unusual punctuation can be mispronounced.

## Privacy And Analytics

- Pasted text, local TXT/Markdown/EPUB content, filenames, generated audio, and ZIP files do not go to Access Free Tools. The public voice samples contain only the fixed Access Free Tools comparison sentence.
- Hugging Face receives ordinary pinned model, tokenizer, and voice-file requests after generation begins. Those requests do not contain the pasted text.
- Text, status, and audio surfaces use Microsoft Clarity masking.
- Analytics may record a voice sample play, model ready, local document opened, generation started and completed, cancellation, MP3 or ZIP download, timeout, model-download failure, unsupported browser, and generation failure. They must not record model choice, document format, text, language, voice, filename, file content, or output.
- The tool requires a rights and model-terms confirmation before generation.

## Internal Commands

    npm run tts:browser-check
    npm run tts:voice-check
    npm run typecheck
    npm run typecheck:ts6
    npm test
    npm run build
    npm run check

The browser check verifies both pinned model revisions, model-specific lazy workers, one-model-at-a-time selection, selected-voice loading, all 28 English Kokoro IDs, grouped selection, 38 bounded static samples, no sample autoplay or model startup, bounded local TXT/Markdown/EPUB import, hostile-document controls, local voice preferences, pre-download estimates, sequential chapter generation, separate MP3 and ZIP downloads, portable filenames, readiness wording, text-free diagnostics, Kokoro full-precision and compatibility paths, bounded stall recovery, the mascot loading state, MP3 creation for 24 kHz and 44.1 kHz sources, Clarity masking, and the absence of rejected server infrastructure. The separate voice check confirms that all 28 pinned voice URLs remain reachable.

## Current Browser Evidence

Verified on August 18 and August 20, 2026 against the local Astro production preview:

### Per-chapter voice release candidate

- On August 20, 2026, the privacy-safe production report recorded two TTS page views and eight TTS tool actions. This is encouraging early activity, not enough data to claim broad demand or completion rates.
- A local Kokoro full-precision WebGPU run generated chapter 1 with Bella and chapter 2 with Emma through one loaded model worker. Both results were labelled with the voice actually used and downloaded in one ordered ZIP.
- The request trace loaded the pinned Kokoro model plus only `af_bella.bin` and `bf_emma.bin`. The two test sentences were absent from request URLs.
- Switching from Supertonic to Kokoro remapped existing chapters to Bella. A chapter could then use any of the 28 Kokoro English voices, including a UK voice whose dialect was derived for that chapter only.
- The apply-to-all control changed two assigned chapter voices back to one without changing chapter text or names.
- Desktop at 1440px and mobile at 390px had no horizontal overflow. The chapter selectors, apply-to-all control, voice-labelled result rows, separate MP3 buttons, and ZIP control remained usable at both widths.
- The 100-chapter, 10,000-character soak alternated F1 and M5 while retaining peak generation concurrency one and 100 ordered ZIP entries.

### Fixed voice sample library

- All 38 voice choices have a distinct pre-generated local MP3: 10 Supertonic samples and 28 Kokoro samples.
- The complete sample library is 3,279,067 bytes. Each sample is 73,142 to 132,096 bytes and is requested only when the user presses its audio control.
- A browser trace played representative Supertonic and Kokoro voices without starting a worker, requesting a model file, reading the user's text, requiring consent, or autoplaying audio.
- FFprobe confirmed the checked files are approximately five-second MPEG audio at 128 kbps. The player uses `preload="none"`, so opening the tool does not download the library.

### Expanded 28-voice release candidate

- Installed Google Chrome and Microsoft Edge each generated a paused, blob-backed MP3 through Kokoro full-precision WebGPU with no page errors, console errors, or horizontal overflow at the 390px test width.
- Firefox generated a paused, blob-backed MP3 through Kokoro q8 WebAssembly with no page errors or console errors. The request trace loaded the q8 runtime and only the selected `af_bella` voice file.
- Playwright WebKit generated a paused, blob-backed MP3 through Kokoro q8 WebAssembly with no page errors or console errors. This proves the WebKit engine path on Windows, not physical Safari support.
- The worker now requires a usable WebGPU adapter instead of treating the presence of `navigator.gpu` as sufficient. This prevents Firefox and WebKit from attempting the larger full-precision model when no adapter is available.
- A local 113-character TXT file loaded without truncation or filename display.
- The same loaded Chrome worker then generated 7.248 seconds of full audio in 0.8 seconds. FFprobe confirmed MPEG audio at exactly 128 kbps. The request trace contained the pinned Kokoro model files and only the selected Bella voice file, not the local text or filename.
- The portable filename test converted `My: Voice* Test?.wav` to `My-Voice-Test.mp3` before download.
- Desktop at 1440px and mobile layout at 390px had no horizontal overflow. The current full accessibility check passed every tested TTS page and viewport pair.
- Physical Android, iOS, and Safari generation have not been tested. They remain unsupported for beta compatibility claims until real-device evidence exists; viewport emulation is not counted.

### Production beta start

- The expanded release was deployed on August 18, 2026 from commit `359d0068` on Astro 7 and Node 24.
- A fresh Chrome production run with WebGPU disabled used Kokoro q8 WebAssembly and downloaded a valid 1.92-second MP3 at exactly 128 kbps.
- The production result remained paused, used a blob-backed audio URL, loaded only the selected Bella voice file, and did not place the test text in request URLs or bodies.
- Both public pages returned `noindex,follow` and remain excluded from XML sitemaps.
- The restarted seven-day beta runs through August 24, 2026. The earliest indexability review is August 25, 2026, after a fresh production, browser, privacy, and sitemap check.

### Browser audiobook feature release

- Commit `77c33cb6` added bounded favorite and recent voice IDs, pre-download duration and 128 kbps size estimates, named reorderable chapters, sequential one-worker chapter generation, separate MP3 downloads, an audio-only ZIP, and entirely local Markdown and EPUB import.
- The final test run passed 538 tests across 64 files, both TypeScript lanes, Astro production build, dependency audit with zero findings, the TTS browser and voice checks, the 100-chapter soak, and the full repository check.
- The chapter soak completed 100 chapters and 10,000 combined characters with peak inference concurrency one and 100 ordered ZIP entries.
- A real local Kokoro q8 run generated two MPEG MP3 files in `local-chapter-set.zip`. The archive SHA-256 was `3BCB37E2D3D13185274E7591BC42FCDF72274AA9F9831DF9FD44C257A3A07A22`.
- Request inspection found only pinned runtime, model, tokenizer, and selected Bella voice requests. Source text, chapter names, filenames, imported document bytes, and generated audio were absent.
- Hostinger build `01a014d5-8ce9-7201-ad57-6dffa4da8241` completed on Node 24 with `app.js` and `dist`.
- A live production run reached `2 chapter MP3s ready`, exposed two separate MP3 controls and `Download all as ZIP`, and logged no browser errors.
- Live Ask, API, MCP, and production sitemap checks passed. The sitemap check reported 661 checked URLs, 661 OK, and zero hard failures.
- Both the tool and guide still return `noindex,follow` with their correct canonicals and remain outside XML sitemaps. No Search Console or IndexNow submission was made for this beta release.

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

The expanded release is deployed and live generation is verified. The pages remain `noindex,follow` and outside XML sitemaps for the seven-day beta recorded above.

## Release Gates

1. Unit, TypeScript 7, TypeScript 6, build, security, site, schema, image, SEO, and accessibility checks pass.
2. The route-specific workers, model runtimes, phonemizer, and MP3 encoder do not load on unrelated pages.
3. Current Chrome plays static samples, generates speech, and downloads valid MP3 files with both models.
4. Current Edge plays static samples, generates speech, and downloads valid MP3 files with both models.
5. Firefox, Safari, Android, and iOS are documented as pass, fallback, or unsupported. Do not guess.
6. Long Kokoro text is generated in order without silent truncation.
7. Cancellation and model switching terminate the active worker.
8. No pasted text appears in network requests, logs, analytics, or Clarity.
9. The publicly accessible noindex beta remains stable for seven days.
10. The Release Judge records evidence before changing the index policy.

If download size, memory, browser support, licensing, or third-party model hosting is not good enough, keep the pages noindexed or remove the model. Do not buy infrastructure to work around a failed browser pilot.
