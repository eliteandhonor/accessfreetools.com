# GPT-6 Project Review Campaign

Objective: complete all reviewed goals and tasks, re-review the changes, and finish unpublished work including the browser transcriber. The owner authorized implementation on 2026-09-06. The approved review remains historical evidence, not approval of an implementation or live release.

Baseline: fresh origin/main at 90d6dcab0580a91ca66382f2414d95e8817469e5 on 2026-09-06. Implementation uses codex/gpt6-review-implementation in the clean review worktree. Preserve the primary dirty promotion checkout. Resume the existing browser-transcriber draft in its own worktree without discarding its work.

Review scopes: application correctness and architecture; APIs and MCP; security, privacy, analytics, and monetization; TTS, OCR, transcriber, and game pilots; SEO, editorial, four-channel promotion, and evidence freshness; visual/accessibility/performance; deployment, dependencies, automations, and release proof.

Only the coordinator writes the consolidated review, goals, tasks, and campaign manifest. Specialist agents may edit their explicitly assigned, disjoint source and test files and append their worklog. Use regression tests before fixes and apply_patch for manual edits. Do not run shared dependency installs, commits, full builds, or public actions from specialist agents. Omit secrets, personal analytics, media, transcripts, and credential values.

Each specialist report must state source revision/worktree, inspected paths, executed commands, confirmed findings with exact file/line references, confidence, consequences, a minimal proposed task, acceptance criteria, and explicit untested areas. Do not infer production failure from a stale local report. Do not turn code size alone into a mandatory rewrite. Distinguish passed checks from adequate coverage.

Active publishing channels are site blog, Medium, Bluesky, and Pinterest only. Quora is retired; Reddit and DEV are blocked; LinkedIn is not used; Flipboard is inactive. Protect Kawaii search performance. Node 24 and Astro 7 remain the deployment requirements. All new media tools remain browser-only with no purchases.

Task states: planned, in_progress, evidence_ready, approved, blocked. Only the Release Judge can mark implementation work approved after checking concrete acceptance evidence. Reviewing and creating a task does not mean its implementation is complete.
