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

## 2026-08-18, Release Judge approval

- A real local Kokoro q8 run generated two ordered MP3 files through one worker and downloaded `local-chapter-set.zip`.
- The ZIP contained `01-Intro.mp3` and `02-Finish.mp3`, both with MPEG frame headers; SHA-256 was `3BCB37E2D3D13185274E7591BC42FCDF72274AA9F9831DF9FD44C257A3A07A22`.
- Production then generated two chapter MP3s and exposed two MP3 controls plus `Download all as ZIP` with no browser errors.
- CB-01 through CB-04 were approved by `release-proof-judge`.
