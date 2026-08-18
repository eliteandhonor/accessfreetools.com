# Model And Audio Worklog

- 2026-08-18: Verified Supertonic 1.3.1 Python API, 31 language labels, 10 preset voices, and 44.1 kHz output from the package and primary repository.
- 2026-08-18: Pinned the package-reviewed model revision and added fail-closed revision checks.
- 2026-08-18: Recorded the upstream archive notice as a hard purchase and launch risk.
- 2026-08-18: Generated a real 9.822-second, 44.1 kHz mono WAV sample from 132 synthetic characters. Model load took 57.023 seconds, inference took 21.415 seconds, real-time factor was 2.18, and peak process memory was 575.7 MB.
- 2026-08-18: Repeated the proof on the deployed Access Free Tools page. The pinned model loaded with WebGPU and produced a 7.3-second, 44.1 kHz mono WAV in 5.6 seconds from 105 synthetic characters. The audio was ready in a browser object URL and the page exposed its WAV download control.
- 2026-08-18: Classified the 500,000-character limit as a safety ceiling rather than a throughput promise. Audiobook-scale capacity remains a private-canary gate.
- 2026-08-18: Owner rejected the paid-host model. The Python benchmark and earlier archive-risk statement are historical only and do not control the browser implementation.
- 2026-08-18: Pinned the official browser helper at `7e2804f96016a7028cb1ed627353c61c1e9dd281`, model files at `3cadd1ee6394adea1bd021217a0e650ede09a323`, and `onnxruntime-web` at `1.27.0`; output is local 44.1 kHz WAV through WebGPU with WASM fallback.
- 2026-08-18: A real Chrome/WebGPU run generated a 6.5-second, 44.1 kHz mono PCM WAV in 3.1 seconds. The 572,754-byte file was decoded and inspected successfully; WASM timing remains a beta compatibility task.
- 2026-08-18: Owner simplified the product to pasted text and MP3 download. Added pinned `wasm-media-encoders@0.7.0`; prior WAV proof remains inference history but does not approve the corrected MP3 release.
- 2026-08-18: Final local Chrome/WebGPU proof generated and downloaded a 79,412-byte MP3 from pasted text. `ffprobe` confirmed MP3, 44.1 kHz mono, 128 kbps, and 4.96325 seconds; SHA-256 is `BEFB73817ED2442A94FAA0985A38D2485B71DE6D17B9A7E684719187AFB2EE51`.
