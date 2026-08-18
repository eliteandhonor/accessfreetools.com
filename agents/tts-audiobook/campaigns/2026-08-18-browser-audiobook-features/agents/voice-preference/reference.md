# Reference

## Current Facts

- `src/lib/browserTtsModels.ts` defines 10 Supertonic and 28 Kokoro voices.
- The current selector groups voices by model and voice group.
- Static MP3 samples use `preload="none"` and must remain on-demand.
- One model worker at a time is a standing product rule.

## Proposed Local Record

- Key: `aft:tts:voice-preferences:v1`.
- Value: schema version, ordered favorite voice IDs, ordered recent voice IDs.
- Bounds: 20 favorites and 8 recents.
- Validation source: the current model registry, never raw stored data.

## Proof To Collect

- Unit tests for bounds, dedupe, invalid IDs, migration, malformed JSON, quota errors, and unavailable storage.
- Keyboard, touch, screen-reader, and 390px layout proof.
- Request trace proving favorites and recents do not trigger model or voice-file downloads.
