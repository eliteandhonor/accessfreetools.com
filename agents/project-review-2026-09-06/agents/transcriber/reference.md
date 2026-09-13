# Reference

Baseline: 90d6dcab0580a91ca66382f2414d95e8817469e5; refresh before implementation.

- [September 9 browser preflight fix and fresh model downloads](../../reports/transcriber-browser-preflight-2026-09-09.md) supersedes pending Firefox/WebKit and fullcheck counts below: 1,109 tests, zero audit findings, real built WebKit MP3 error/PCM readiness, fresh Chrome/Edge short download success. Firefox has six export overlaps. New Chrome hour MP3 retains 120/120 intervals but fails 26 overlaps across 267 cues; other hour/privacy/beta gates remain open.

- [reports/browser-products.md](../../reports/browser-products.md)
- [September 8 privacy detector mutations](../../reports/transcriber-privacy-mutations-2026-09-08.md)
- [September 8 actual decoder outcome](../../reports/transcriber-alignment-outcome-2026-09-08.md)
- [September 8 current word alignment implementation](../../reports/transcriber-word-alignment-implementation-2026-09-08.md)
- [September 8 independent alignment rejudge](../../reports/transcriber-alignment-source-rejudge-2026-09-08.md)
- [September 8 current Chrome/Edge cache, export and timing integration](../../reports/transcriber-current-browser-integration-2026-09-08.md)
- [September 8 contextual repair and remaining exact cases](../../reports/transcriber-contextual-repair-2026-09-08.md)
- [Independent bounded repair rejudges](../../reports/transcriber-overlap-design-2026-09-08.md)
- [Current boundary follow-up and exact browser outcomes](../../reports/transcriber-boundary-followup-2026-09-08.md)
- [Independent whole-local-contract acceptance and residual finding](../../reports/transcriber-local-acceptance-2026-09-08.md)

At the14:10UTC checkpoint, TR-01/TR-02 local approval includes the bounded
second-context repair. Current fullcheck passes1103tests/audit0 with31unchanged
selected hashes. A new paired source-word-retention test is independently
accepted. Current Chrome MP4 source295..890passes20/20intervals,40cues,zero
timing conflicts. Current hourEdgeMP4 retains120/120 but fails14overlaps/255cues.
At1380, three context variants corroborate13/14words only; strict rejection is
correct. Centered context was not adopted; do not repeat context-position search
or relax word correspondence. The independent next recommendation is a numeric
rejection regression and continued separate compatibility proof. Firefox/WebKit
15minute checks are pending; they cannot substitute for the failed hour gate.
See the follow-up report for exact commands and evidence limits. TR-03 stays blocked.
Contextual repair and exact numeric diagnostics retain earlier failures. Earlier
esbuild probes used a different nested runtime unless explicitly deduped. Keep
all failures and scope limits; no short or cache-mode result approves release.

Use ../../campaign.json for authoritative task acceptance and ../../reports/ for source-line evidence. Screenshots and command outputs are under ignored output/ in this review worktree. Do not infer absence or a zero metric from another worktree's missing report.

Source-of-truth order: exact current code/real execution; dated service observations; validated exports; historical notes. OpenSEO first for new market research; it is unavailable in this session. DataForSEO account was verified healthy at US$10.92 after owner's IP correction; recheck before later use and retain paid-call caps. Do not copy credentials or user content into evidence.
