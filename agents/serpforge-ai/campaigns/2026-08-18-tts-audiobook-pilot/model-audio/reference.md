# Model And Audio Reference

- Browser runtime: `onnxruntime-web@1.27.0`.
- Official helper source commit: `7e2804f96016a7028cb1ed627353c61c1e9dd281`.
- Model revision: `3cadd1ee6394adea1bd021217a0e650ede09a323`.
- Code license: MIT.
- Weight license: OpenRAIL-M.
- MP3 encoder: `wasm-media-encoders@0.7.0`, MIT.
- Output: browser-generated 128 kbps mono MP3 from 44.1 kHz samples.
- Fixed voices only: F1-F5 and M1-M5.
- Required model download is approximately 398 MB and begins only after explicit user action.
- One browser synthesis run is capped at 10,000 pasted characters.
