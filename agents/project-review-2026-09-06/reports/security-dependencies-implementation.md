# SEC-01 Dependency Patch

Date: 2026-09-06. Baseline: `90d6dcab0580a91ca66382f2414d95e8817469e5`. Worktree: `accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`.

- Added exact overrides for `fast-uri@4.1.3` and `qs@6.16.0`. The generated lockfile changes only those two package records. Astro and Node requirements are unchanged.
- Official patch evidence: [fast-uri advisory](https://github.com/advisories/GHSA-5jgf-p345-68v8), [qs advisory](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx).
- Regression test checks the overrides and every installed lockfile location, not just a top-level version. RED: two new cases failed on the prior versions. GREEN: all three cases pass.
- `npm install --ignore-scripts`: two packages changed, zero vulnerabilities. `npm audit --audit-level=moderate`: zero vulnerabilities. JSON evidence: `output/project-review-followup/SEC-01/audit.json`.
- Still required: clean `npm ci`, integrated typechecks, API/MCP tests, full check, independent release judgement and deployment proof. This note is not a claim that production is patched.

No broad dependency upgrade, audit waiver, paid research or public action occurred.

## September 6 Independent Local Acceptance

The pending local items above are now superseded by
[SEC-01's independent task judgment](security-dependencies-task-acceptance.md):
LOCAL APPROVE after a fresh lifecycle-enabled Node 24 npm ci, both compiler
lanes, 74 independent focused tests, zero audit findings and the final full
check with 2,405 tests. That report binds package, lock and all 2,506 final source
hashes. The separate root parse5 declaration was already resolved in the lock;
it is disclosed as unrelated metadata, not a third dependency upgrade. The
lock guard checks records; installed versions have separate runtime proof.

Preserved failures and compiler-wrapper/API distinctions are documented. This
does not approve deployment or claim that the production dependencies changed.
