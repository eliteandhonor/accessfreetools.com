# Model And Audio Worklog

- 2026-08-18: Verified Supertonic 1.3.1 Python API, 31 language labels, 10 preset voices, and 44.1 kHz output from the package and primary repository.
- 2026-08-18: Pinned the package-reviewed model revision and added fail-closed revision checks.
- 2026-08-18: Recorded the upstream archive notice as a hard purchase and launch risk.
- 2026-08-18: Generated a real 9.822-second, 44.1 kHz mono WAV sample from 132 synthetic characters. Model load took 57.023 seconds, inference took 21.415 seconds, real-time factor was 2.18, and peak process memory was 575.7 MB.
- 2026-08-18: Classified the 500,000-character limit as a safety ceiling rather than a throughput promise. Audiobook-scale capacity remains a private-canary gate.
- 2026-08-18: Owner rejected the paid-host model. The Python benchmark and earlier archive-risk statement are historical only and do not control the browser implementation.
- 2026-08-18: Pinned the official browser helper at `7e2804f96016a7028cb1ed627353c61c1e9dd281`, model files at `3cadd1ee6394adea1bd021217a0e650ede09a323`, and `onnxruntime-web` at `1.27.0`; output is local 44.1 kHz WAV through WebGPU with WASM fallback.
- 2026-08-18: A real Chrome/WebGPU run generated a 6.5-second, 44.1 kHz mono PCM WAV in 3.1 seconds. The 572,754-byte file was decoded and inspected successfully; WASM timing remains a beta compatibility task.
