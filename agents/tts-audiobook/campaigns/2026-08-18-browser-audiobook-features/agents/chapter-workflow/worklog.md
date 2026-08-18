# Worklog

Append-only. Add dated entries below; do not rewrite earlier entries.

## 2026-08-18

- Agent goal, chapter contract direction, and one-worker boundary created.
- CB-01 through CB-04 remain `planned`.
- No feature implementation or completion claimed.

## 2026-08-18, implementation start

- CB-01 and CB-02 moved to `in_progress` and were delegated with a pure-library/test write scope.

## 2026-08-18, evidence ready

- Fifteen chapter-model and queue tests pass, plus three archive tests for order, safe names, traversal, duplicates, type, and byte limits.
- Playwright confirmed named chapter editing and reordering after Markdown and EPUB import.
- `npm run tts:feature-soak` passed at 100 chapters and 10,000 combined characters with peak queue concurrency one and 100 ordered MP3 ZIP entries.
- CB-01 through CB-04 moved to `evidence_ready`; real short model inference remains part of PX-02 live proof.
