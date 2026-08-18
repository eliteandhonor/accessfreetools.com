# Reference

## Current Facts

- Public output is 128 kbps mono MP3.
- Speed currently ranges from 0.9x to 1.5x.
- Supertonic and Kokoro have different sample rates, but the MP3 target bitrate is the size driver.
- Model loading currently starts only after user action and consent.

## Estimation Direction

- Keep the estimator pure and independent from React and workers.
- Estimate spoken duration from bounded text units, selected speed, and a documented conservative baseline.
- Convert the duration range to bytes with `seconds * 128000 / 8`, then present friendly rounded values.
- Prefer a range over false precision.

## Proof To Collect

- Unit fixtures for scripts, punctuation, speeds, boundary lengths, and zero input.
- Browser trace proving that editing text and viewing estimates makes no model/runtime request.
- Visual proof at desktop, tablet, and 390px.
