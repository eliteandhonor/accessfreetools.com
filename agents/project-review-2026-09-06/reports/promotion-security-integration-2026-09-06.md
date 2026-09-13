# Promotion Evidence And Security Follow-Up

Source: `codex/gpt6-review-implementation` in `accessfreetools-gpt6-review`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25`, with the existing local implementation changes. This is coordinator-tested local evidence, not independent approval or production release.

## Changes

- Four-channel health now evaluates dated executions for all expected site-blog, Medium, Bluesky and Pinterest commands. Missing, stale and failed observations are separate. A fresh wrapper cannot certify an older Pinterest scan.
- Pinterest scan admission checks destination completeness, consistent counts, complete board pagination, read-only mode and execution dates. An exit-zero scan that omitted destinations remains missing evidence. It does not establish a broken live account or broken Pins.
- Read-only review commands inspect existing Medium/Pinterest assets instead of regenerating public images. Explicit asset-generation workflows remain separate. Existing public article copy and artwork were not rewritten by this change.
- New or changed editorial source records require matching source hashes, dated claim-to-primary-source findings, linked sources, Brendan facts with evidence references, and a dated owner-approval reference. The check validates record completeness, not truth or authorization. Publication approval always remains separate.
- Seven unchanged editorial articles retain the explicit `legacy-unreviewed` state. No historical review was invented. An empty built editorial set now fails instead of passing through `every([])`.
- SEC-03's separate [admin/proxy threat model](admin-proxy-threat-model.md) records executed synthetic boundary probes and bounded mitigation options. No authentication, DNS, proxy or hosting change was made.

## Regression And Integration Proof

All paths below are under ignored `output/project-review-followup/integration/` unless noted.

| Evidence | Result |
| --- | --- |
| `pinterest-semantic-red.log` | New actual-marketing-CLI regression failed on the old false pass; 1 failed, 16 passed |
| `pinterest-semantic-green.log` | 252 tests passed across five files |
| `editorial-empty-red.log` | Empty built-blog regression failed before the correction; 1 failed, 20 passed |
| `editorial-readonly-green.log` | 25 tests passed across three files |
| `check-promotion-security-semantic.log` | Initial full check failed with seven 5-second test timeouts and four 10-second browser teardown-hook timeouts; retained, not waived |
| `check-promotion-security-semantic-four-workers.log` | Full `npm run check` passed with `VITEST_MAX_WORKERS=4`; 2,111 tests in 99 files, both TypeScript checks, build and remaining gates passed; audit found zero vulnerabilities |
| `source-snapshot-promotion-security-semantic.json` | 119 source/test/config hashes; comparison after full check and four-channel review found no drift and the same HEAD |
| `four-channel-review-semantic.log` | Exit 1 intentionally: site blog, Medium and Bluesky passed command checks; Pinterest missing one semantic proof check, not a failed public account |
| `marketing-orchestrator-semantic.log` | Exit 1 intentionally: preserves Pinterest's incomplete destination proof as the sole current channel blocker |

The successful full run used a process-local Vitest worker cap supported by the installed runner. No source, assertions, test timeouts, hook timeouts, retry policy or test selection changed between the failed and successful full runs. This is evidence consistent with concurrent resource contention, not proof of a particular external process causing the failure. The passing suite took 90.32 seconds.

Built checks covered 674 HTML pages, 1,984 JSON-LD blocks, seven editorial articles at four viewports, 15 key page/viewport pairs, 27 automated accessibility cases, 608 artwork entries, 609 image-sitemap entries, 12 gallery categories, and AI lazy-loading checks. Accessibility still has 55 unresolved manual-review findings; automated success is not conformance. Existing soft asset/CSS performance warnings remain visible.

## Live Pinterest Countercheck

The read-only Node scan at 2026-09-06T08:07:12.669Z fetched six boards and counted 313 public Pins, but provided zero app destinations and 313 missing-destination skips. Its process exited zero. The wrapper and orchestrator correctly did not accept that as complete destination proof.

The owner's logged-in Chrome tab independently confirmed three existing Pins with matching Visit site destinations and visible artwork: JSON-to-CSV, Browser AI Privacy, and Text Case. [Exact URLs and limitations](pinterest-live-sample-2026-09-06.md) are separate from scanner coverage. Custom alt text remains unverified. The profile was restored; nothing was saved, posted or edited.

## Remaining Gates

PR-01 and PR-02 remain in progress pending independent Release Judge adjudication and any resulting corrections. Earlier specialist sessions stopped with usage-limit errors; coordinator review is not a substitute approval. SEC-03 additionally needs an owner-approved bounded mitigation and its acceptance tests. No implementation task or overall goal is marked complete.

The source freeze did not drift through review. The original promotion checkout has the same dirty-file inventory as before this work. No commit, push, deployment, paid research, indexing request, public promotion, account change, ad click or memory update was performed. The separate transcriber still needs its full compatibility/privacy/beta acceptance; this report does not finish that tool.
