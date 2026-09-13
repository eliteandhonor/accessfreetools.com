# Clean Install And Routing Follow-Up

September 6, 2026. Review branch `codex/gpt6-review-implementation`, HEAD
`243d71d1d832b398cba86d5c7fcc70deefa25f25` plus preserved implementation changes.
No commit, push, deployment, public post, indexing request, purchase or change
to the original dirty promotion checkout occurred.

## Clean Dependency Proof

A fresh temporary directory with no node_modules received byte-identical
package files. Real Node 24.20.0 / npm 11.2.0 `npm ci` ran with lifecycle scripts
enabled. The installed fast-uri and qs versions are 4.1.3 and 6.16.0; npm audit
reports zero findings. Native esbuild transformation, sharp PNG output and
ONNX Runtime tensor construction passed. This is not a model-inference test.

The fresh installation uses TypeScript 7.0.2 CLI and TypeScript 6.0.3 API.
The existing review checkout's installed compiler was 6.0.2, so dependency
installation was not inferred from that directory. No shared install was run.
An initial proof-runner command used a nonexistent `tsc.js` path; its failed
report is retained. The corrected runner resolves the binary from package.json
and its separate clean run passes. No library or test assertion was weakened.

Next, an actual detached Git worktree under the system temporary directory
received a hash-checked copy of the review source, no ignored credentials,
and another clean lifecycle-enabled install. Its first full check passed
2,210 tests. After the independently discovered Ask fix and new test were copied
in, the final source inventory contains **2,506 byte-matched files**.

Final full check, 09:57:59-10:02:13 UTC:

- **2,405 tests in 103 files pass**, including 195 new independent Ask cases.
- TypeScript 7 CLI and TypeScript 6 API checks pass against the fresh install.
- Build, links/site, editorial and visual checks, structured data, performance,
  lazy AI assets, images/sitemaps/gallery, secret scan and dependency audit pass.
- Automated accessibility passes 27 checks; **55 manual findings remain open**.
- No source drift. The separate release receipt correctly remains unverified
  because the copied working changes are not a clean committed release.

The preceding four-worker attempt passed every assertion but failed a 10-second
browser-close afterAll hook. Its failure is retained. The final run used two
workers without changing tests or deadlines. This does not establish the cause
of the cleanup delay or waive future failures.

Proof under `output/project-review-followup/SEC-01/`:

- `clean-2026-09-06T09-41-18.715Z/`: clean install, versions, native smoke, audit.
- `integration-2026-09-06T09-43-14.865Z/`: isolated install and initial full check.
- `recheck-2026-09-06T09-54-01.641Z/`: retained cleanup-hook failure and final manifest.
- `final-2026-09-06T09-57-59.746Z/`: passing final log and source-bound report.

Temporary installs/worktree remain available for proof inspection. The runners
and test processes exited; no ongoing service is required.

## Independent Correctness And Runtime Decisions

The [Ask task judge](ask-routing-task-acceptance.md) originally rejected COR-02:
`(2) + (3) * (4)` could receive a partial model-route answer of 5. The parent
changed only the terminal calculation classifier to recognize closing grouping
delimiters before existing operators. Unsupported complete expressions now
decline before provider fallback; no general expression engine was added.

The judge retained all eight original failing assertions, added square-bracket,
brace and nested-parenthesis cases, and made the output-only observation hook
create its directory. Independent recheck: **648/648 pass**, no real network,
unchanged source hashes. It explicitly approves local COR-01 and COR-02.

The [JSON/TTS task judge](json-tts-task-acceptance.md) explicitly approves local
BR-01 and BR-02 after 106 focused tests and two source-matched browser cases.
The 50,000-key JSON fixture rejects before dense allocation, recovers, and
downloads correct CSV; measured rejection outcomes are about 28 ms in these
two cases, not a sitewide INP claim. TTS approval covers actual mounted UI/import
logic with simulated worker events, not real model inference or BR-04.

SEC-01's separate judge decision is recorded in
[its acceptance report](security-dependencies-task-acceptance.md). Task-level
decisions do not approve the complete campaign or a production release.

## Remaining Gates And Chrome

The [transcriber download comparison](transcriber-download-isolation.md) obtains
partial downloads both with and without Chrome request interception, and with
native Node fetch. The 90-second probes identify no cause or browser-support
guarantee. No product deadline was changed. Both routes remain noindex; real
full-hour, privacy, compatibility, memory and beta acceptance are still open.

The owner was asked to approve replacing stored admin credentials with explicit
entry on each admin page. No answer has been recorded, and no auth, quota, DNS
or proxy mitigation was silently applied. SEC-03 remains in progress.

Read-only Chrome Hostinger dashboard and deployment logs show current main
`90d6dcab`, Completed, September 2, Astro, Node 24.x. The existing build log uses
Astro server mode and the Node adapter. This is the old deployed revision, not
proof of the new local changes or Git metadata availability inside a future
build. Chrome was returned to the dashboard. No Redeploy, environment, cache,
renewal or billing control was activated.

Next work: record only independent local approvals, finish remaining task
judgments, then select a narrow release and prove its clean source and deployed
identity. Do not bundle the entire dirty review branch, the promotion checkout,
or the unpublished transcriber into a blanket release.
