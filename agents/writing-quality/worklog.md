# Writing Quality Worklog

This file is append-only. Record commands, outcomes, and follow-up boundaries.

## 2026-07-29 - Repository-Local Engine Started

- Confirmed the `codex/july29-seo-recovery` worktree was clean.
- Confirmed all requested writing-quality paths were new.
- Read the local brand, article, Stop Slop, test, and agent-workspace
  conventions.
- Added the original layered rules engine, direct CLI, focused tests, and this
  isolated agent workspace.
- Preserved `package.json`, existing editorial and Medium scripts, and global
  skills.
- Focused Vitest result: 11 tests passed in
  `scripts/lib/writing-quality-rules.test.mjs`.
- Syntax checks passed for the rules library and CLI.
- Editorial file input exited `0` with zero hard errors and one warning.
- Technical file input exited `0` with zero hard errors and one warning.
- The hard-pattern fixture exited `1` with four hard errors, confirming that
  warnings alone do not fail the command.
- Editorial directory input reviewed all six agent documents and exited `0`.
- Reports were written to ignored
  `output/writing-quality/latest.json` and `latest.md`.
- Vitest used a temporary local `node_modules` junction because this worktree
  had no installed dependency folder. The junction was removed after
  verification and did not change tracked project files.

## 2026-07-29 - Release Gate Approved

- Added npm 11 argument-forwarding coverage and shared hard rules for editorial
  and Medium checks.
- Refined the reader-first rule so factual process disclosure remains valid
  while directive language still fails.
- Release and Proof Judge approved WRT-01 after writing tests, the existing
  three-article gate, and the combined 430-test release suite passed.
- Added `npm run writing:quality -- --mode editorial|technical <path>`.
- Reused the hard writing-rule implementation in editorial and Medium quality
  checks instead of maintaining duplicate phrase lists.
- Created the attributed global skill at
  `C:\Users\chamb\.codex\skills\clear-technical-writing\SKILL.md`.
- Updated WQ-005 and WQ-006 from stale deferred labels to complete.

## 2026-10-05 - Seven Editorial Drafts Reviewed, Publisher Approval Pending

- Revised seven existing editorials against dated primary-source findings and
  scoped project-code or local-test evidence. Removed unsupported personal
  scenes and historical benchmark claims instead of inventing replacement tests.
- Used Access Free Tools organization authorship, supported Brendan ownership,
  and a scoped AI-assisted research/editing disclosure. Kept the verified
  AdSense rejection fact and its stated Low value content reason.
- Replaced pronoun-based authenticity scoring with neutral opening and
  ownership/process-disclosure structure checks. Scores explicitly do not
  verify facts, originality, authorship, sources, or publication approval.
- Focused helper/source-gate regression suites: 43 tests passed. Pending owner
  approval still blocks an otherwise complete synthetic draft. The strict
  source-review validator and immutable legacy hashes were not changed.
- Ran `npm run writing:quality -- --mode=editorial` for each of the seven final
  article files. All passed with zero hard errors; diagnostic warnings remain.
- All seven exact-hash source records have publisher approval pending. No
  approval, personal review, listening judgment, deployment, or AdSense result
  is asserted by these checks. Exact clean-commit release checks follow this
  local source checkpoint, with their results stored in ignored output.
