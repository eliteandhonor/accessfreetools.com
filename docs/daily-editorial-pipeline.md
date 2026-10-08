# Daily researched open-source articles

Prepared 2026-10-08 from verified main
`ce3b5f2e9d35a3211eb170c3209263046f5f70a5` in
`eliteandhonor/accessfreetools.com`. This implementation is dormant. It has no
active cron, public article, paid-provider call or deployment.

## Intended result

Once activated after independent review, one cloud job targets one useful
article per Brisbane calendar day. It finds a GitHub project for a practical
reader problem and either publishes one checked original guide or records a
hold. Outages, uncertain evidence, budget limits and duplicates can leave a
day without an article. It never fills that gap with an empty or duplicate post.

The existing owner articles retain their own source and approval records. This
lane uses the Access Free Tools organization byline, describes AI assistance,
and says the project was not installed or run for the article. It does not
invent Brendan's experience or manufacture an owner approval entry.

## Architecture and files

`scripts/daily-editorial.mjs` runs the cloud job. The maintained modules are:

- `daily-editorial-pipeline.mjs`: selection, research, writing, review, hold and
  exactly one content commit.
- `daily-editorial-providers.mjs`: bounded GitHub/Jina/Ollama/TypeSafe adapters,
  sanitized errors, no automatic paid retries, complete evidence context.
- `daily-editorial-checks.mjs`: source hashes, actual licence templates, exact
  claim quotes, clarity, originality and deterministic/semantic duplicates.
- `daily-editorial-state.mjs`: durable reservations, compare-and-swap Git state,
  safe restart receipts and immutable archives in an approved private store.
- `daily-editorial-publication.mjs`: public projection, review receipt, original
  illustration and an atomic Git content commit.
- `daily-editorial-assets.mjs`: original labelled conceptual PNG/WebP media.
- `daily-editorial-live.mjs`: public verification and conservative rollback.

The public projection is `src/data/dailyEditorialArticles.json`, initially `[]`.
Its typed reader and `DailyEditorialArticle.astro` render escaped text. Small
existing catalog/date/route integrations supply blog discovery, search, RSS,
canonical metadata, BlogPosting and image sitemap entries together. Source
quotes, copied source documents and model responses are excluded from the
public article data. No tool, gallery or approved tool-art record is changed.

`config/daily-editorial.json` and `.github/workflows/daily-editorial.yml` govern
activation. The workflow defaults to offline fixtures. Its live job requires
the main branch, activation variable, matching reviewed config, all required
credentials and explicit shared budget allocation. There is no active schedule.

## Flow and evidence

1. Rotate real tasks such as finding a file, keeping local notes or restoring
   a backup. Read-only GitHub search finds candidates; stars are not rankings.
2. Reject forks, archived/disabled/private projects and previously covered
   repositories. Fetch actual repository metadata and an immutable commit.
3. Read the actual README and complete LICENSE at that commit. Read release
   metadata and dates; a checked 404 is disclosed as no published GitHub
   release. Read repository documentation, falling back to its README.
4. Check the SPDX decision against the actual complete licence. The initial
   narrow recognized templates are MIT, Apache-2.0, BSD-2-Clause,
   BSD-3-Clause and ISC. Unknown variants, add-on restrictions or missing
   licence/source evidence hold. Other genuine open-source licences may be
   supported later after explicit template review; they are not labelled
   source-available merely because this initial checker holds them.
5. Jina Reader assists source research. The pinned direct GitHub evidence
   remains authoritative. No Jina Search calls are implemented: its documented
   token-budget header is ignored and no hard search debit ceiling was found.
6. Ollama writes original plain JSON, with no schema-enforcement claim. Local
   validation binds its output to the verified sources and project. Paragraphs
   contain source IDs and exact audit quotes. The model cannot write files,
   choose destinations, execute repositories or change the verified sources.
7. Deterministic checks reject missing quotes/hashes/dates, markup, invented
   tests/certification/rankings, prohibited wording, exact duplicates, repeated
   paragraphs and substantial copied source prose. Ollama independently
   reviews the exact article against the exact evidence.
8. TypeSafe `jev-1.13.0` Choice assesses every title, summary, problem, heading
   and paragraph using the entire bounded checked source document. Qualifiers
   and contradictions elsewhere in that document stay present. Context missing,
   ambiguous or too large for the bounded call is unassessed and holds. Score
   assesses clarity; Noul checks duplicate meaning among at most twelve
   lexically nearest intact historical summaries. Deterministic identity and
   shingle checks cover the entire site catalog. This semantic shortlist is a
   stated coverage limit, not exhaustive plagiarism detection.
9. Provisional holds require supported probability at least 0.95, confidence
   at least 0.8, normalized clarity at least 0.8 and duplicate probability no
   greater than 0.1. These are uncalibrated decision aids. The earlier three
   claim TypeSafe pilot is too small to establish accuracy. Provider scores
   cannot override missing evidence or prove truth.
10. A clean isolated checkout stages the public record, review receipt and
    original image pair in one commit. It runs the full repository check on
    that exact commit before a normal atomic fast-forward update of main.
    Main movement rejects the push. Hosting and live checks remain distinct
    from committing content.

## Durable state and recovery

The dedicated orphan branch `automation/aft-editorial-state` contains
`state.json` and append-only Git history in an explicitly approved private
repository. `stateRepository` and `privateStoreApproval` remain null until parent
coordination supplies that destination and existing authorized runtime access.
The public AFT repository is rejected as a state destination. Actual repository
metadata must show private visibility and authorized write access before store
construction, load, checkpoint and push. Private Git objects are created in a
separate temporary bare repository, never the public code checkout.
Every worst-case reservation and request hash is pushed with a compare-and-swap
lease before dispatching a paid call. A failed durable checkpoint means no paid
dispatch. Completed matching receipts are reused on safe restarts. Failed
calls retain reservations. A timeout, malformed/oversized response or other
unknown sent-call outcome halts all automatic work until reconciled; a new
day does not reset that uncertainty.

Source and provider results must not contain credentials or raw HTTP headers.
Errors and logs contain codes and numeric usage rather than provider bodies.
Historic terminal payloads compact only against a proven immutable prior
state commit; archive references preserve the complete evidence in Git
history. Recent 365 day records retain reservations and budgets; permanent
repository/slug/day publication deduplication survives compaction. Unresolved
paid calls and publication intents are never pruned. A lost publication push
acknowledgement is resolved by reading Git; ambiguity stops before another
paid call or publication attempt.

Full evidence, provider results, audit quotes and unapproved drafts remain in
that private store, including immutable archive history. They are never uploaded
as public Actions artifacts. The public article commit contains only the approved
article projection and an intentionally sanitized review receipt. Extra Ollama
review fields hold publication; operational artifacts use an explicit allowlist.
Do not feed reader documents or credential-bearing URLs into this pipeline.

No existing private state destination or Actions runtime access has been proven.
The existing AFT `GITHUB_TOKEN` is repository-scoped and cannot authorize a
separate private state repository. Parent coordination must choose an existing
authorized private versioned store, or arrange an owner-approved private state
repository and existing credential/access route. This PR creates no repository,
credential, permission grant or storage branch. It does not reuse provider API
keys as storage credentials. Missing access or privacy verification holds before
paid dispatch and never creates a replacement empty ledger.

## Credentials and proposed shared daily budget

The owner and Edge operator confirmed these AFT credential names on 2026-10-08.
Their authentication remains untested; values were not opened:

- `JINA_API_KEY`
- `OLLAMA_API_KEY`
- `TYPESAFE_API_KEY`

Their presence in GTA establishes nothing about AFT. No secret values are read,
copied, logged or transferred during setup. The owner enters existing keys in
the AFT repository through the parent credential workflow if needed. No new
keys, OAuth changes, purchases, account changes or top-ups are made here.

Proposed AFT grants alongside the parent's current GTA allowances; combined
unit grants remain pending and are not active:

| Provider | AFT proposal/day | Current GTA allowance/day | Combined proposal/day |
| --- | --- | --- | --- |
| Jina Reader | 100,000 reserved tokens; 10 calls | 40,000 units; 8 reads | 140,000 units; 18 calls |
| Ollama Cloud | 120,000 local input/output units; 4 calls | 12 calls; unit grant unconfirmed | 16 calls; units pending |
| TypeSafe | 100,000 local input units; 8 calls | 2 calls; unit grant unconfirmed | 10 calls; units pending |

Jina reserves the full 10,000 Reader token budget per attempt. Ollama reserves
UTF-8 request bytes, an overhead margin and the bounded output maximum.
TypeSafe reserves serialized request bytes. Byte estimates are conservative
local accounting, not a provider-certified tokenizer or invoice ceiling.
Returned usage above reservation holds all further work. Current TypeSafe
published input pricing makes 200,000 input tokens $0.0084; outputs are free.
Ollama model pricing and the owner's Jina plan must be confirmed at activation.
Provider billing remains authoritative.

The local job does not monitor GTA's independent spend. Activation requires a
reviewed nonoverlapping static allocation in `sharedBudgetAllocation` and matching
caps in both pipelines. The sum must fit the agreed shared cap. Manual calls or
other applications are outside that allocation. Increase a cap only through
coordinated review. Funding/access/quota failures create a hold and a safe job
report for owner notification; the pipeline never buys credit automatically.

## Activation coordination

Complete these against the final immutable PR head before activation. Private
storage and runtime access are required before any paid pilot as well:

1. Independent code/evidence review and the full repository quality check.
2. Name-only confirmation of AFT's three provider credentials (completed),
   followed by an approved authentication pilot.
3. Reconcile the shared GTA/AFT provider grants and record the review reference.
4. Confirm Hostinger's existing automatic deployment from this repository's
   main branch, retaining Astro, Node 24, `dist` and `app.js`. Record fresh proof
   in `hostingAutoDeployVerified`. This job does not change hosting settings or
   call the Hostinger deployment API.
5. A small explicitly approved paid-provider pilot, including contradictory and
   insufficient source claims and the first LocalSend draft. Do not report
   fixture success as a paid provider result or accuracy calibration.
6. Set the reviewed activation reference in config and the matching nonsecret
   `AFT_EDITORIAL_ACTIVATED` Actions variable. Enable both config gates, then
   add `15 22 * * *` to the workflow's schedule and allow the live job for that
   event. This targets 08:15 Brisbane on the next local calendar day. GitHub
   delays or provider outages can prevent that day's publication.
7. Verify the first deployed article, build commit, canonical/H1/schema/image,
   RSS and sitemap before giving the owner a live link. The existing AdSense
   request is untouched; do not resubmit it.
8. Confirm the owner's GitHub Actions failure-notification route or the parent
   delivery route for safe funding and hold reports. An Actions artifact alone
   does not establish that Brendan receives a funding notification.

The first reviewable article is saved in
`docs/daily-editorial-first-article/localsend-guide.md`, with its actual sources,
independent factual review, exact draft hash and original illustration. It is
not in the public catalog and has not passed paid provider review.

## Verification and rollback

`npm run editorial:daily:offline` runs mocked providers, durability, evidence,
source licence, duplicate, publication and media fixtures without credentials.
`npm run check:daily-editorial` checks public content receipts without provider
calls. The full check uses `AFT_SECRET_SCAN_MODE=tracked-only` in cloud setup to
avoid opening local credential files while retaining tracked-file inline-key
checks; the existing owner-local exact-secret scan remains unchanged by default.
Both workflow install steps set `ONNXRUNTIME_NODE_INSTALL=skip`, the locked
ONNX package's [documented installation control](https://github.com/microsoft/onnxruntime/blob/v1.27.0/js/node/README.md#cuda-ep-installation).
This avoids downloading optional CUDA libraries for this browser-focused site;
the bundled CPU library, browser runtime, other install scripts and full checks
remain in use. The dependency manifest and lockfile are unchanged.

Live verification is read-only and must prove the actual expected build and
article rather than treating a successful push as a live release. If deployment
has not caught up, report pending/failed verification and keep the exact content
commit for review. The next run checks any previously unverified publication
before reserving another paid call. Conservative rollback reverts the entire article commit in
one new commit only when main still equals that content commit. It never force
resets main, rewrites history or removes unrelated later changes. If main moved,
hold for reconciliation instead of rolling back someone else's work.

Public claims such as indexing, rankings, safety, installation success or
AdSense approval are never inferred from a passing build or provider score.

## Primary provider contracts

- [Jina Reader and budget headers](https://github.com/jina-ai/reader)
- [Ollama Cloud](https://docs.ollama.com/cloud)
- [Ollama Cloud structured-output limitation](https://docs.ollama.com/capabilities/structured-outputs)
- [Ollama model pricing](https://ollama.com/pricing)
- [TypeSafe API](https://docs.typesafe.ai/api/)
- [TypeSafe models and pricing](https://docs.typesafe.ai/models)
