# LocalSend held provider pilot

This manual pilot reviews one exact LocalSend draft and its complete primary
evidence with Jina, Ollama and TypeSafe. It produces a held review outcome.
Publication, deployment and the daily schedule require separate coordination.

The implementation starts dormant: `config/daily-editorial-pilot.json` has
`enabled:false`; input-commit and approval references remain unset. The
workflow has only `workflow_dispatch`; its default mode is `offline`. No Actions
variables or provider grant are created by this implementation.

The parent reports that the owner created the private repository
`eliteandhonor/accessfreetools-editorial-state` with a README and saved
`AFT_EDITORIAL_STATE_TOKEN` in AFT. The reported token scope is Metadata read
and Contents read/write for that private repository only, expiring
2026-11-07. The owner has also verified the AFT secret names `JINA_API_KEY`,
`OLLAMA_API_KEY` and `TYPESAFE_API_KEY`. These are name and setup observations;
runtime authentication, private input retrieval and state checkpoints remain
unverified. No credential values were read for this work.

## Offline validation

Run `npm run editorial:pilot:offline`. The trusted runner's `--offline` path runs
focused synthetic provider transports and private-store fixtures. It needs no
credentials or provider calls. Fixture decisions are not actual model reviews.
Offline success checks code paths. It does not approve the real context registry.
Every real context unit needs an independent review tied to the exact inputs.

The sealed v2 inventory in `config/daily-editorial-pilot-inputs.json` contains
58 private files and 1,249,513 bytes. It preserves the exact LocalSend draft hash
`1a53a93a7144fef483bfc909ee8fbd418325c498160a7ed9e2be67a4c490b3fd`.
Independent static context review covers 21 sources, 56 context units and 39
public wording units in 19 groups. Conditional validation using its proposed
review record passes every frozen factual and diagnostic request; the configured
review remains null until parent adoption. Default offline input verification
therefore reports 56 held contexts and zero paid calls.

Complete evidence needs seven factual TypeSafe batches plus one diagnostic
batch. The earlier twelve- and thirteen-attempt proposals are obsolete. Maximum
actual request bodies are 24,641 bytes for TypeSafe and 55,818 for Ollama.
The complete checked catalog and its verified build receipt bind earlier article
summaries; this remains a semantic comparison of twelve intact summaries, with
the full catalog retained for deterministic identity and copy checks.

## External prerequisites before a paid pilot

Parent coordination must review and record all of these before `live-pilot`:

1. Independently review the exact public runner commit, complete claim coverage,
   final request hashes and separate pilot grant. Set
   the same exact review reference in `activationReview` and
   the owner-managed `AFT_EDITORIAL_PILOT_APPROVED` Actions variable. Set
   `AFT_EDITORIAL_PILOT_CODE_SHA` to that exact approved main commit; stale code
   is rejected. Both variables remain uncreated by this implementation.

2. Independently review the complete real context registry. Record `contextReview`
   as an approval object with `decision:'context-units-approved'`, its own `ref`,
   `reviewer`, `reviewedAt`, `articleSha256`, `registrySha256`, `sourceHashes` and
   `unitIds`. The runner binds this review to the exact private input hashes and
   complete unit inventory. Do not derive it from the activation reference or
   synthesize a passing registry approval from fixture results. Missing or
   mismatched context approval holds the pilot.

3. Approve `eliteandhonor/accessfreetools-editorial-state` and its separate
   runtime access, then complete the state-only round trip below.
   Record `stateRepository`, `privateStoreApproval` and immutable `inputCommit`.
   Seeding the revised approved bundle at `inputs/localsend-held-pilot/v2/` is an
   external prerequisite and owner decision still pending. The public bundle
   descriptor contains identifiers and hashes, not secrets or raw source/model
   material; metadata in a public repository has no secrecy guarantee. The final
   descriptor's `bundlePrefix`, inventory and hashes must match that exact seed
   and immutable private commit. Earlier v1 input identities and review results
   cannot approve the revised v2 draft. The complete bundle is bounded to 64
   files, 256 KiB per file and 2 MiB total; inputs remain data and are never executed.

4. Confirm the existing credential names `JINA_API_KEY`, `OLLAMA_API_KEY` and
   `TYPESAFE_API_KEY` in AFT. The owner has verified these names; authentication
   remains untested. `AFT_EDITORIAL_STATE_TOKEN` is the separate private access
   name reported saved by the owner; runtime proof and approval remain pending. This work
   reads no values, creates no keys and changes no account permissions.

5. Approve the actual fixed grant below, coordinate shared GTA/AFT allowances,
   and enable only the reviewed pilot config. No quota is borrowed from GTA or
   silently added to the ordinary daily budget.

## Fixed proposed grant

The final proposal permits at most fourteen attempts, with no retries or repair
calls. Durable reservations precede dispatch and remain charged when a call's
outcome is unknown.

| Provider | Attempts | Conservative reservation |
| --- | ---: | ---: |
| Jina Reader | 2 | 10,000 Reader tokens, 5,000 per read |
| Ollama `gpt-oss:120b` | 4 | 524,288 input plus 6,000 generated tokens; 530,288 combined units |
| TypeSafe `jev-1.13.0` | 8 | 524,288 input units |

These are local context-based reservations, not certified token counts or hard
invoice ceilings. Provider-reported usage and billing remain authoritative.
This proposal is not an approved grant. Provider failures hold the pilot; no
top-up, purchase or account change is automatic.

## Reviewed state-only preflight

This implemented procedure is prepared for parent coordination and has not run.
Review the exact trusted code before execution. Keep `enabled:false`,
`publicationEnabled:false`, and the provider allocation unset. Record the
approved private store and code review references, then set the matching
`AFT_EDITORIAL_PILOT_APPROVED` and exact `AFT_EDITORIAL_PILOT_CODE_SHA` variables.
Those references authorize this selected state-only mode; the disabled config
continues to hold paid work. Dispatch `editorial-pilot.yml` on `main` with
`state-preflight`, which runs `node scripts/daily-editorial-pilot.mjs --state-preflight`.
The job injects only the private state token and has a ten-minute limit.

1. Run only that approved code in the AFT checkout, using the existing private
   token through its runtime secret injection. Supply no provider keys. Use
   concurrency group `aft-daily-editorial` with cancellation disabled. Do not
   place credentials in command arguments, files, persistent Git configuration
   or logs.

2. Use `privateRepositoryMetadata` to verify the exact expected repository,
   `private:true` and `visibility:'private'`. Construct `createGitStateStore`
   with the reviewed `privateStoreApproval`, exact private repository and
   branch `automation/aft-editorial-state`. Its isolated Git transport verifies
   the public checkout and rechecks private visibility on every operation.

3. Call `load()` once and `validateState()` on the result. Retain the canonical
   JSON digest in memory. Stop on an unresolved provider call, unresolved
   publication intent, invalid ledger or access error. If the state branch is
   absent, initialising its empty baseline requires explicit parent approval and
   `statePreflightAllowEmptyBaseline:true` in the reviewed configuration. Its
   default is false, which holds before creating the state branch.

4. After explicit approval for this bounded write, call `checkpoint(state,
   {compact:false})` once on
   the unchanged validated state, with store writes enabled only for this
   diagnostic. This appends one private state commit using the existing
   compare-and-swap guard. Do not begin a day, reserve a call, append a pilot
   grant, load the research bundle or invoke a provider. A lost acknowledgement
   or conflict stops the check; it does not trigger an automatic second write.

5. Dispose the store, create a fresh one and `load()` once. Verify the private
   state digest equals the baseline and that the checkpoint is present on the
   exact state branch. Record only the repository name, branch, immutable
   checkpoint commit, digest and pass/fail status in the safe parent evidence
   `output/daily-editorial-pilot/state-preflight.json`.
   Dispose the second store. Upload no raw state or source evidence.

Successful private metadata, checkpoint and fresh read-back establish this
specific transport round trip. They do not verify provider credentials, approve
the context registry, enable publication or prove a deployment trigger.

## Execution and outcomes

After approval, dispatch `editorial-pilot.yml` on `main` with `live-pilot`.
Before secrets reach the runner, the workflow checks the enabled config, exact
review reference and exact Git HEAD against the approved code variable. The
runner repeats its activation and evidence checks, retrieves the pinned private
bundle, reserves each frozen request in private durable state and records its
outcome. It never executes the upstream repository or private bundle code.

The workflow and ordinary daily workflow share concurrency group
`aft-daily-editorial`, with cancellation disabled. The pilot uses the same AFT
private ledger and actual Brisbane day, so ordinary daily work cannot spend
alongside that day's pilot. Restarting or changing a run ID does not reset
unknown calls or consumed reservations.

The reviewed grant is once-only across Brisbane days. Before any provider
dispatch, the durable checkpoint records its exact day, manifest hash, budget
hash, input commit and allocation reference in permanent `pilotGrants` metadata.
Compaction retains this ledger after response payloads and old day records are
archived. A new day or allocation reference cannot restart the same bundle;
changed immutable inputs also require a separately reviewed unique allocation.
The ledger holds new grants at its bound of 128 rather than deleting prior
identities. A day change during a checkpoint holds the reserved call before it
is sent and keeps the reservation charged.

The public `GITHUB_TOKEN` has read-only contents permission. Private metadata,
input retrieval and state transport use `AFT_EDITORIAL_STATE_TOKEN`; it is not
the public checkout/discovery token. No public push, publishing function or
hosting operation belongs to this pilot. Ordinary daily activation gates remain
unchanged.

Only the explicit safe projection `output/daily-editorial-pilot/latest.json`
may be uploaded as an Actions artifact. Raw sources, prompts, model responses,
thinking, drafts and receipts stay in the approved private store. The outcome
report does not establish owner notification delivery.

Unsupported, contradicted, incomplete, duplicate, malformed, over-budget or
unknown outcomes hold further work. TypeSafe is a decision aid; its controls
and scores do not establish truth or calibrated accuracy. Any Ollama writing
proposal receives a separate hash and cannot replace the reviewed original
automatically. Publishing a chosen final hash needs its own content review,
deterministic gates and publication approval.
