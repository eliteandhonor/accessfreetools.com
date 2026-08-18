# Reference

## Current Facts

- The tool accepts at most 10,000 characters and generates one MP3 result.
- The current workers already support progress, cancellation, model switching, timeout recovery, and MP3 encoding.
- Refreshing the page discards generated audio.
- One-model-at-a-time memory behavior is already verified.

## Shared Chapter Contract

Each chapter needs a stable local ID, editable name, text, order, character count, generation state, optional local MP3 result, and sanitized unique download name. Imported formats must emit this same contract.

## Proof To Collect

- Pure model tests for split/reorder/delete/rename and character totals.
- Queue tests for success, cancel, one failure, retry, worker termination, and no concurrent inference.
- ZIP tests for order, names, duplicate names, valid MP3 bytes, cancellation, and cleanup.
- Browser soak at the existing aggregate limit before any proposal to raise it.
