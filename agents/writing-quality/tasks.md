# Writing Quality Tasks

| ID | Status | Task | Evidence |
| --- | --- | --- | --- |
| WQ-001 | complete | Add layered editorial and technical rules | `scripts/lib/writing-quality-rules.mjs` |
| WQ-002 | complete | Add standalone CLI and ignored JSON/Markdown reports | `node scripts/writing-quality.mjs --help` |
| WQ-003 | complete | Cover required hard errors and warnings with focused tests | `npx vitest run --configLoader runner scripts/lib/writing-quality-rules.test.mjs` |
| WQ-004 | complete | Record pinned source attribution and standards boundary | `agents/writing-quality/source-notes.md` |
| WQ-005 | complete | Integrate with package scripts and existing editorial or Medium checks | `npm run writing:quality` and shared hard-rule imports |
| WQ-006 | complete | Create the attributed global `clear-technical-writing` skill | `C:\Users\chamb\.codex\skills\clear-technical-writing\SKILL.md` |

## Completion Rule

WQ-001 through WQ-006 are complete when the focused test file passes, the CLI
writes both latest reports, warning-only input exits zero, hard-error input
exits nonzero, package integrations pass, the attributed global skill exists,
and Git shows only the approved files.
