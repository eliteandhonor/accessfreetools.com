# TTS Cold Download And MP3 Follow-Up

September 9, 2026 AEST. R is the local, unpublished
`accessfreetools-gpt6-review` worktree at HEAD
`243d71d1d832b398cba86d5c7fcc70deefa25f25`. No production, model, runtime,
dependency, privacy policy or release settings changed during these probes.

## Verified Result

Actual isolated Chrome 152.0.7977.83 completed one short synthetic Kokoro Bella
generation through WEBGPU/Full precision in 45,123 ms. The downloaded MP3 is
74,496 bytes. Native FFmpeg decoding produced 4.656 seconds of finite audio,
RMS 0.0667249352 and peak 0.5188107491. The player stayed paused; no autoplay.

- Receipt: `output/tts-audiobook-pilot/real-chrome-smoke/2026-09-08T14-56-58.929Z/report.json`.
- Receipt SHA-256: `b4f2c14aaca77f6048eb8bcbc494db88734318d66da61dc5cc6cf8c84e82cad2`.
- MP3 SHA-256: `9e3c109da09361c296cf5a5a32517d4e196515fd36c3b3e0ee79c6445e32d67c`.
- The current full-check source manifest has 2,145 matching files; six selected
  product and 17 served-file hashes also match. That prior normal full check
  passed 2,493 tests in 108 files and zero dependency findings.
- No model request occurred before Generate. The synthetic request sentinel was
  absent. These checks do not establish global or production privacy.
- Unload was clicked and the owned browser/server stopped. This is not native
  allocation, worker-retention, long-run memory or physical-device proof.

The [independent judge](tts-cold-retry-judge-2026-09-09.md) accepted only the two
QA corrections and this single cold-short roundtrip. The receipt retains an
aborted local blob request and an environment-injected AdGuard CSP event; it is
not described as an error-free environment or dependable upstream service.

## What Was Corrected

The local QA server initially allowed only a different ORT runtime. Its CSP now
derives exact runtime-version directory allowances from the installed packages
and npm lockfile, including the actual nested Transformers runtime. It neither
permits all of jsDelivr nor changes the application's dependencies.

The MP3 encoder fetches an embedded WASM data URI. A separate actual-Chrome
encoder-only probe failed without `connect-src data:` and passed when only that
scheme was added. The same change in the QA server then allowed unchanged Kokoro
product code to generate the MP3. No waveform/readback or phonemizer change was
needed. The original failures remain preserved; do not present them as current
production defects. The encoder explanation for the second original failure is
supported by the paired probe and unchanged-product success, not a captured
original worker stack trace.

Encoder evidence: `output/tts-audiobook-pilot/encoder-csp-2026-09-08T14-56-29-683Z/report.json`.
Earlier failed receipts: `real-chrome-smoke/2026-09-08T14-45-13.412Z/report.json`
and `real-chrome-smoke/2026-09-08T14-47-48.142Z/report.json`, under the same TTS
output directory. No protection, assertion or model pin was disabled.

## Open Gate

BR-04 remains blocked. One cold short sentence does not cover both models,
warm reuse, 10,000 characters, chapter MP3/ZIP, cancellation, recovery, model
switching, all named browsers, native memory, physical devices or seven stable
beta days. Keep TTS noindex and require a separate indexability decision.

## Edge Voice And Chapter Follow-Up

The isolated Edge 152.0.4191.66 cold-short run completed in 50,145 ms. The same
page then generated two short chapters with Bella and Adam in 5,119 ms. Both
individual downloads decode as finite, non-silent MP3s. The ZIP contains exactly
those two files in chapter order, verified byte-for-byte by SHA-256 and archive
CRC. There was no new model-weight request during the chapter phase; the only
new voice request was the pinned `am_adam.bin`. This proves in-page warm reuse,
not worker identity, leak freedom, all voices or natural-book correctness.

- Receipt: `output/tts-audiobook-pilot/real-chrome-smoke/2026-09-08T15-04-43.360Z/report.json`.
- Chapter one: 74,496 bytes, 4.656 seconds, RMS 0.0667249352.
- Chapter two: 75,648 bytes, 4.728 seconds, RMS 0.1051896426.
- ZIP: 150,418 bytes, SHA-256
  `86991a790b10da1049c0360eec657b8ab13b56ba13b4d1b81b882e3bd62eb082`.
- No autoplay, observed text sentinel, selected source or served-file drift.
  Owned browser and server stopped. The saved chapter panel is readable; its
  screenshot also retains the site's consent banner, not a banner-free UI proof.

## Chrome Input-Limit Follow-Up

Actual Chrome accepted the full 10,000-character synthetic input, without
truncation, and completed Kokoro generation in 75,179 ms including the cold
model load. The worker reported 37 sections. Native decoding verifies finite,
non-silent audio: 595.176 seconds, RMS 0.0769866376, peak 0.7081702948.

- Receipt: `output/tts-audiobook-pilot/real-chrome-smoke/2026-09-08T15-07-53.829Z/report.json`.
- Download: 9,522,816 bytes, SHA-256
  `dc32b6d332d15d28483bfb2d52e36a7f4b41e0262ca6444a650371ea9df751c6`.
- No autoplay, page error, observed text sentinel, selected source or served
  drift. Owned browser/server stopped. No production change occurred.
- The fixture repeats an owned sentence and ends at exactly 10,000 characters.
  This is a capacity/output-format test, not evidence of natural-book quality,
  word retention, spoken chapter order or accuracy across voices/languages.

The [follow-on judge](tts-warm-chapters-judge-2026-09-09.md) accepts these bounded
receipts with an explicit historical harness qualification. Their harness hashes
differ because options were added between executions. They are preserved, not
relabeled as executions of the newest harness. Later probes also save a complete
harness snapshot beside the receipt. BR-04 and deployment/indexability remain
unapproved.

## Supertonic Short And Chapter Follow-Up

Actual isolated Chrome 152.0.7977.83 completed Supertonic F1 cold-short generation
in 55,207 ms. It then generated two chapters using F1 and M1 in 5,119 ms on the
same page. Both chapter MP3s decode natively, remain non-silent, and match their
ZIP entries exactly in the expected order. No extra model-weight request occurred
during that warm phase; only the pinned M1 voice-style file was newly requested.

- Receipt: `output/tts-audiobook-pilot/real-chrome-smoke/2026-09-08T15-10-33.086Z/report.json`.
- Cold F1 output: 70,635 bytes, 4.414708 seconds, RMS 0.0464068116.
- Chapter F1: 70,635 bytes, 4.414708 seconds, RMS 0.0465434815.
- Chapter M1: 74,396 bytes, 4.649792 seconds, RMS 0.0451831498.
- ZIP: 145,305 bytes; SHA-256
  `471195a81fa991bae09ae30b04454d738a6d1cb1d4ab51adcbc65a2a04160494`.
- No autoplay, page errors, observed request sentinel or selected source/build
  drift. Owned browser and server stopped. The exact harness snapshot is saved
  beside this receipt. This covers English text and two presets, not 31 languages.

An additional direct native FFmpeg inspection confirms the long Kokoro MP3 audio
stream is mono 24 kHz at 128 kb/s, and short Supertonic is mono 44.1 kHz at
128 kb/s. The container's rounded 127 kb/s summary for short Supertonic is not
used in place of the audio-stream rate.

## Supertonic Input-Limit Follow-Up

Actual Edge 152.0.4191.66 accepted the entire 10,000-character synthetic input
and completed Supertonic WebGPU generation in 70,155 ms including fresh model
loading. Native MP3 decoding produced 623.725708 seconds of finite non-silent
audio, RMS 0.0520407068 and peak 0.4330564737. The player remained paused.

- Receipt: `output/tts-audiobook-pilot/real-chrome-smoke/2026-09-08T15-12-12.352Z/report.json`.
- MP3: 9,979,611 bytes, SHA-256
  `3e7fc9cb1e51194830d42900eaaa3c44704da6039d22f718eee011aaec61e37f`.
- No observed text sentinel, page error, selected source or served drift; owned
  browser/server stopped. Its saved harness matches the preceding Supertonic
  Chrome short/chapter run. All 2,145 baseline source files were independently
  rehashed by the coordinator at 15:14:34.351 UTC, with no drift.

All four follow-up probes are complete and independently accepted within the
recorded scope. They test English synthetic text, not multilingual accuracy, repeated
model switching, leak freedom, cancellation/recovery, physical mobile devices
or seven stable beta days. Both models now have a real short/chapter result and
a real maximum-character result across named Chrome/Edge tests; this is not the
complete cross-product browser/model test matrix. No public action was taken.

## Final Checkpoint

The follow-on judge independently verified selected source/served hashes, all
saved audio/archive hashes and exact ZIP entries. It found no required source
correction within these four tests. The first two follow-up runs did not archive
their executed harness bytes, so their recorded historical hashes are not
misrepresented as matching today's script; the latter two include exact
snapshots. No identical model retest is required to repeat those successes.

BR-04 remains blocked with the full acceptance contract unchanged. The task
registry stays at 22 approved, zero evidence-ready, four in progress and three
blocked. All owned test/model processes and the independent reviewer are closed.
The intentional transcriber preview remains available with HTTP 200 and
`noindex,follow`; its 32 selected full-check source hashes still matched at
15:17:24.027 UTC. The separate security-release checkout remains clean. No Git
stage/commit/push, Hostinger write, paid action, discovery submission or public
publication occurred in this follow-up.
