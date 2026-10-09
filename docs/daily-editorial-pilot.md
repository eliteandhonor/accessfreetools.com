# LocalSend held provider pilot

This manual pilot reviews one exact LocalSend draft and its complete primary
evidence with Jina, Ollama and TypeSafe. It produces a held review outcome.
Publication, deployment and the daily schedule require separate coordination.

The implementation remains dormant: `config/daily-editorial-pilot.json` has
`enabled:false`, `publicationEnabled:false`, `contextReview:null` and
`sharedBudgetAllocation:null`. Its existing storage-only review reference does
not approve a provider run. The
workflow has only `workflow_dispatch`; its default mode is `offline`. No Actions
variables or provider grant are created by this implementation.

The parent reports that the owner created the private repository
`eliteandhonor/accessfreetools-editorial-state` with a README and saved
`AFT_EDITORIAL_STATE_TOKEN` in AFT. The reported token scope is Metadata read
and Contents read/write for that private repository only, expiring
2026-11-07. The owner has also verified the AFT secret names `JINA_API_KEY`,
`OLLAMA_API_KEY` and `TYPESAFE_API_KEY`. These are name and setup observations;
provider authentication remains unverified. The separately approved storage-only
round trip succeeded in Actions run `37859299605`, and its temporary proof
variables were retired. This proves that specific private state transport; it
does not approve pilot ledger mutations or provider calls. No credential values
were read for this work. Another storage-auth test is unnecessary unless a
concrete access, visibility or transport failure provides a reason.

## Offline validation

Run `npm run editorial:pilot:offline`. The trusted runner's `--offline` path runs
focused synthetic provider transports and private-store fixtures. It needs no
credentials or provider calls. Fixture decisions are not actual model reviews.
Offline success checks code paths. It does not approve the real context registry.
Every real context unit needs an independent review tied to the exact inputs.

Recovery verification accepts an explicit local descriptor without replacing
the runtime descriptor:

```text
node scripts/daily-editorial-pilot.mjs --verify-inputs=/absolute/package-v3 --descriptor=/absolute/descriptor-v3.json
```

An independently authored context review may be supplied with
`--context-review=/absolute/review-v3.json` to check that exact proposal locally.
These overrides are accepted only in local input verification, never in
`--run`, `--state-preflight` or the synthetic `--offline` mode. The report states
`localVerificationOnly:true` and `runtimeApprovalAdopted:false`. A successful
local check does not change the configured review, code approval, private input
commit, provider grant or publication permission. Private retrieval admits only
the exact v1, v2 or v3 bundle prefix at a pinned commit; mixed prefixes hold.

The v3 inventory in `config/daily-editorial-pilot-inputs.json` declares
54 private files and 1,185,465 bytes. It identifies the exact LocalSend draft hash
`1a53a93a7144fef483bfc909ee8fbd418325c498160a7ed9e2be67a4c490b3fd`.
Recovery on 2026-10-08 did not recover the old private v2 bundle. The v3 package
uses newly identified reconstruction bytes and independently recorded reviews;
its source captures, draft, original illustration, frozen requests and full
review records remain private. The public descriptor contains only file names,
byte counts and hashes. The configured context review remains null: recorded
AI/editorial reviews and synthetic fixture success do not approve runtime
access, ledger initialization, a provider grant or publication.

The v3 proposal specifies seven factual TypeSafe batches plus one diagnostic
batch. The earlier twelve- and thirteen-attempt proposals are obsolete. Its
descriptor records maximum request bodies of 24,996 bytes for TypeSafe and
55,696 bytes for Ollama. Exact-input verification checks the complete
catalog/build-receipt binding and all request bytes against the immutable
private commit; old v2 hashes do not identify this reconstructed package.

`prepareMarkdownProjection` in `scripts/lib/daily-editorial-projection.mjs`
prepares a separate private JSON proposal from those exact inventoried bytes.
It preserves the two opening paragraphs as `problem` and `summary`, the
original headings and visible wording, and literal list markers. A private
receipt retains Markdown spans, original link destinations and complete source
and context provenance. It never stages or publishes an article.

Keep three identities separate: the accepted raw Markdown SHA-256,
`articleHash()` of the complete private JSON, and `publicContentHash()` of the
proposed visible content plus source metadata. Artwork can record the latter
two only for the actual proposal, with its held status explicit. The new JSON
needs its own publication review; historic Markdown judgments do not approve
it. The adapter retains missing fetch timestamps as null and actual source
kinds and URLs rather than inventing evidence to pass the existing daily
validator. Any resulting publication holds remain in its private receipt;
resolving them changes the JSON identity and requires a fresh artwork binding.

`prepareCompactMarkdownProjection` in
`scripts/lib/daily-editorial-compact-projection.mjs` prepares a bounded private
reference artifact when repeated complete source text and evidence make the
expanded JSON exceed the existing 256 KiB file limit. It retains source metadata,
ordered evidence unit IDs, the immutable repository/commit/descriptor pin and
the complete registry identity. All original bytes remain in the pinned private
input inventory, including registry units unused by paragraph evidence.

`resolveCompactMarkdownProjection` requires the compact file's separately
reviewed raw-byte SHA-256 and independently supplied original input bytes and
pin. It rebuilds the full Markdown projection, verifies every inventoried file,
and compares the entire compact contract with that fresh derivation. References
never trigger filesystem or network reads. The resolver returns the complete
expanded article in memory with its original `articleHash()` and
`publicContentHash()`; the compact raw-byte and canonical hashes are separate
identities. Preserve those identities when saving a preparation record.

Both helpers are preparation only. The compact format is not an input to the
daily runner, state serializer, provider requests, artwork gate or publication
stager. Their existing validators, evidence bounds and approvals remain intact.
Compaction preserves missing timestamps, original source kinds and locators,
complete closed contexts, and every resulting publication hold. It supplies no
publication timestamp, human review, artwork approval or provider grant.

## External prerequisites before a paid pilot

Parent coordination must review and record all of these before `live-pilot`:

1. Independently review the exact public runner commit, complete claim coverage,
   final request hashes and separate pilot grant. Set
   the same exact review reference in `activationReview` and
   the owner-managed `AFT_EDITORIAL_PILOT_APPROVED` Actions variable. Set
   `AFT_EDITORIAL_PILOT_CODE_SHA` to that exact approved main commit; stale code
   is rejected. Both variables remain uncreated by this implementation.

2. Review and adopt the independently recorded private context review using the
   metadata-only binding below. The complete eight-field review stays in the
   accepted private bundle. The resolver verifies its immutable input commit,
   inventoried byte count and raw SHA-256 before parsing, then checks its exact
   schema, decision and reference. Context admission also checks independence,
   date, article and canonical registry hashes, source identities and all units.
   Do not derive a review from the activation reference or fixture results.
   Missing, malformed or mismatched review data holds the pilot.

3. Approve the pilot's ledger reservations, receipts, validations and terminal
   checkpoints in `eliteandhonor/accessfreetools-editorial-state`. Retain the
   successfully tested transport and existing validated ledger; do not repeat
   the storage-only proof or initialise a replacement baseline.
   Record `stateRepository`, `privateStoreApproval` and immutable `inputCommit`.
   The revised bundle is identified by `inputs/localsend-held-pilot/v3/` and
   the configured immutable private `inputCommit`. Saving the input bundle
   does not authorize runtime access or ledger writes. The public bundle
   descriptor contains identifiers and hashes, not secrets or raw source/model
   material; metadata in a public repository has no secrecy guarantee. The final
   descriptor's `bundlePrefix`, inventory and hashes must match that exact seed
   and immutable private commit. Earlier v1 input identities and review results
   cannot approve the reconstructed v3 inputs. The complete bundle is bounded to 64
   files, 256 KiB per file and 2 MiB total; inputs remain data and are never executed.

4. Confirm the existing credential names `JINA_API_KEY`, `OLLAMA_API_KEY` and
   `TYPESAFE_API_KEY` in AFT. The owner has verified these names; authentication
   remains untested. `AFT_EDITORIAL_STATE_TOKEN` is the separate private access
   name reported saved by the owner; provider authentication and pilot approval
   remain pending. This work
   reads no values, creates no keys and changes no account permissions.

5. Approve the actual fixed grant below, coordinate shared GTA/AFT allowances,
   and enable only the reviewed pilot config. No quota is borrowed from GTA or
   silently added to the ordinary daily budget.

## Disabled configuration proposal

This preparation does not change the checked-in pilot configuration. A later
reviewed activation change must adopt the following binding in `contextReview`;
it identifies an existing private review, not a new approval:

```json
{
  "decision": "context-units-approved",
  "ref": "reviews/localsend-pilot-v3/context-independent-review.json#case-sha256-83fe0399abb17252651de5cad50235d4752c5e642a4debf673cf2d6de281e753",
  "file": "context-independent-review.json",
  "bytes": 4167,
  "sha256": "5c9a6e05e5081eae766016e36e18f0976cf7ea76029eea069db683e90a786e1d",
  "inputCommit": "c843a6c52434733eb99672088713dd34ae724252"
}
```

The resolver reads only this already inventoried private file at `inputCommit`.
It never interprets `ref` as a URL, filesystem path or remote fetch instruction.
The full review, source hash map and unit inventory are not public configuration.
Local verification overrides cannot approve runtime access.

For the first unpublished run, parent coordination must assign a review
reference covering the exact configuration, private ledger writes and safe
restart behavior. Set that reference in `activationReview` and
`AFT_EDITORIAL_PILOT_APPROVED`; retain an approved `privateStoreApproval` for
the ledger purpose. Only after reviewing the final resulting main commit, set
`AFT_EDITORIAL_PILOT_CODE_SHA` to that exact clean main HEAD. A draft head or
generated pull-request test merge is insufficient. Set `enabled:true` only for
that approved pilot and keep `publicationEnabled:false`. The live runner
requires an existing durable ledger commit before starting the pilot; a missing
branch holds without creating a replacement. Also set
`statePreflightAllowEmptyBaseline:false` to retire baseline-initialisation
permission in the diagnostic mode. Keep the immutable descriptor and private
bundle unchanged.

`sharedBudgetAllocation` must have purpose `unpublished-localsend-pilot`, a
separately assigned `reviewRef`, `aftCaps` exactly
`{"jina":10000,"ollama":530288,"typesafe":524288}` and `aftCallCaps`
exactly `{"jina":2,"ollama":4,"typesafe":8}`. Parent coordination must
explicitly supply all three providers' nonnegative safe-integer `gtaCaps` and
`gtaCallCaps`, and `sharedCaps`/`sharedCallCaps` covering the respective AFT plus
GTA amounts. No GTA reservation or shared cap is inferred here. Flipping
`allocationProposal.approved` alone grants nothing. The private package's
`approvedGrant`, `dispatchAllowed` and budget approval flags remain false;
runtime permission is a separate reviewed grant, not a replacement of those
immutable preparation bytes.

Dispatch remains manual through `editorial-pilot.yml` on main with `live-pilot`.
The daily schedule and publication gates stay disabled. No variable changes,
dispatch or ledger write is part of this code preparation.

## Fixed proposed grant

The final proposal permits at most fourteen attempts, with no retries or repair
calls. Durable reservations precede dispatch and remain charged when a call's
outcome is unknown.

| Provider | Attempts | Conservative reservation |
| --- | ---: | ---: |
| Jina Reader | 2 | 10,000 Reader tokens, 5,000 per read |
| Ollama `gpt-oss:120b` | 4 | 524,288 input plus 6,000 generated tokens; 530,288 combined units |
| TypeSafe `jev-1.13.0` | 8 | 524,288 input units |

These are conservative internal reservation units. The proposal's input/output
token labels describe its accounting assumptions; they are not certified
invoiced token counts or hard invoice ceilings. Provider-reported usage and
billing remain authoritative.
This proposal is not an approved grant. Provider failures hold the pilot; no
top-up, purchase or account change is automatic.

## Reviewed state-only preflight

This procedure already passed under its separate storage-only approval. It is
retained as the bounded diagnostic contract, not a prerequisite to repeat for
this pilot.
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
   exact state branch. The safe parent evidence
   `output/daily-editorial-pilot/state-preflight.json` contains `passed`, `code`,
   `stateSha256`, `stateCommit`, `providerCalls` and `published`. Repository and
   branch are supplied by the reviewed configuration and are not fields in this
   report.
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

A successful fresh fourteen-call path makes 44 logical checkpoints: one
initial day/grant checkpoint, fourteen durable reservations, fourteen response
receipts, fourteen validation results and one terminal checkpoint. This is not
a hard checkpoint limit for a restart: the runner may checkpoint and revalidate
already completed receipts without sending their paid requests again. Every
checkpoint uses the private store's existing compare-and-swap guard. Conflicts
or lost acknowledgement hold rather than overwriting newer state.

Restart only from the same validated ledger and exact bundle, request hashes,
grant and Brisbane day. A completed matching receipt is reused; pending,
unknown, failed, mismatched or missing receipts never authorize paid replay.
Held and completed days remain terminal. A pending or unknown call or unresolved
publication intent blocks new work across all days. Never delete a day, replace
the ledger or reset a reservation to retry a possibly sent request. A restart
after a day change cannot reuse this once-only grant. The normal daily runner
cannot consume the pilot's reserved day.

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
and scores do not establish truth or calibrated accuracy. The private call
ledger retains the parsed Ollama result and usage; later compaction hashes the
complete receipt. The pilot does not emit a separate hash of the proposed
Markdown. A writing proposal cannot replace the reviewed
original automatically. Publishing a chosen final hash needs its own content review,
deterministic gates and publication approval.
