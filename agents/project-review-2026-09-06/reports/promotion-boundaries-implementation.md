# PR-01 Four-Channel Action Boundaries

Date: 2026-09-06. Implementation worktree: `accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`, based on review commit `243d71d1d832b398cba86d5c7fcc70deefa25f25`.

- Exact recognized channel labels replace substring matches. Explicit single-channel aliases such as Medium companion and Pinterest RSS remain supported. Mixed and unknown labels fail closed.
- The shared public-action guard runs before credentials, drafts, browser sessions or requests in the historical DEV and Reddit publishers. It also guards the active Bluesky publisher/profile updater and Pinterest publisher before public work. The inactive DEV publish npm shortcut is removed; historical draft files remain.
- `aft promote-next` separates `needs approval` into a non-executable list. It filters inactive/mixed channels, as do current status and proof-check rows. Historical inactive quality reports no longer enter those active summaries. PR-02 still owns complete four-channel quality/freshness assessment.
- Split the three mixed Pinterest/Medium queue rows by channel. Kept dated historical Medium/board proof distinct from fresh verification. Wallpaper Pinterest remains unverified where no dated URL proof was attached. Voltage Drop Medium requires current exact approval and duplicate/quality review; a posted Pinterest row does not authorize publishing it.

Regression proof:

1. Five ambiguous-label tests failed before the matcher fix and passed afterward.
2. Safe child-process publisher tests first reached DEV credential-file reading and Reddit draft lookup. After the guard, both stopped at the inactive-channel policy. Fetch is stubbed to throw, the temp DEV env path is an unreadable directory, and no browser profile or draft directory is created. Reddit may save a local failure report; no external write occurs.
3. CLI regression initially returned approved, needs-approval, inactive and mixed rows together. After the fix it returns only the exact active approved row as a candidate, with the pending row separate.
4. Combined focused tests: 21 passed across policy, command guards and existing CLI tests.

No publishing, profile change, credential read, live post edit or new public-proof claim was performed. Integrated checks, source review and exact remaining legacy entry-point coverage must pass before PR-01 approval.

## Independent Review Corrections, 2026-09-06

Judge J1 reproduced mixed labels whose unknown characters disappeared during normalization. The matcher now accepts strings only and normalizes case and whitespace, without deleting unknown punctuation or Unicode. Policy and CLI regressions for mixed Unicode/punctuation and array input failed before the correction. Approved and release-ready remain executable only on one recognized active channel; needs approval remains separate.

The four-channel review exited 0 but exposed an unrelated destructive generator behavior: it removed every public Pinterest PNG except the avatar. Removed that blanket cleanup, which had deleted an independently authored article asset. A mocked filesystem/browser regression reproduced the attempted deletion without touching real files, then passed after the correction. Restored only our generator-deleted `public/pinterest/browser-ai-vs-local-ai-privacy.png` from HEAD; verified exact Git blob `7ce0556a28f0cd27f9d41a4541eb5e1dd78e7c23`. No pre-existing user change was reverted.

Latest focused result: 34 tests passed across policy, public guards, CLI and asset preservation. Full review/orchestrator, source freeze, install/build/check and independent re-judgement remain pending. The report-generation pass is not publication proof or blanket approval of all channel content.

## Integrated Audit Contract Correction

The first clean-install full check stopped at the maintenance audit test: 1 failed and 1185 passed. The test incorrectly required zero rows awaiting public proof, even though PR-01 now correctly retains the unverified historical Wallpaper Pinterest row. Updated the test to compare captured proof output with a direct CLI invocation and require both explicit proof-count fields, including nonzero values. This verifies lossless reporting without declaring unverified work complete. Focused rerun passed (1 test, exit 0). The full gate still requires a new integrated run.
