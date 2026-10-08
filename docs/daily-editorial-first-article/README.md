# First daily editorial article: LocalSend

Research and original draft review completed on 2026-10-08. A narrow platform correction was added later that day; full independent review of the revised hash is pending. This package is a checked content draft for the Access Free Tools daily editorial pipeline. It is not a publication record.

## Deliverables

- `localsend-guide.md`: original practical article and proposed metadata. It explains the native app's local transfer workflow, a hypothetical 12-photo example, discovery problems, configurable encryption, automatic acceptance and the iOS foreground requirement. It contains no Brendan personal anecdotes, install-test claims, benchmarks or security certification claims.
- `source-ledger.json`: 16 claim findings, 13 source records, immutable repository commits/blob identifiers and the independent review tied to the exact article hash. Twelve complete source-sentence excerpts and the platform-setting conditional/helper are retained. Missing provider reviews are explicit.
- `localsend-transfer-diagram.svg`: an original 1200 × 630 conceptual illustration. It contains only authored SVG primitives and text. No upstream screenshot, logo, font file or remote image was copied. The caption says it is an original workflow illustration, not a LocalSend screenshot.
- `writing-quality-report.json`: the actual local editorial writing-gate result.

Article SHA256: `1a53a93a7144fef483bfc909ee8fbd418325c498160a7ed9e2be67a4c490b3fd`.

Illustration SHA256: `5e9762546ea85cfe10bac972fa48a63c3540de3b0de9a9070bc2bc7c412ca44a`.

## Source basis

The full LocalSend licence is Apache-2.0. Both researcher and independent reviewer read it; the repository API's licence label was only a cross-check.

- Current main observed: `c1ce322fb3acf08e44f329b8b7208b8b0d91e244`, committed 2026-10-07T23:01:53Z.
- Latest stable release observed: v1.18.2, published 2026-08-21T14:02:01Z.
- Release tag resolved to commit: `af0416be50770a97760f7070684bc667b759a15c`.
- Full licence blob: `129b09014da391f203d75f06b86f27eaf13c5154`.

The GitHub release is not marked immutable. The article's README, licence and app references use the immutable commit. VPN troubleshooting cites current main because that row is absent from the release README. Official website/download links are dated observations and may change.

## Actual checks

`npm run writing:quality -- --mode=editorial docs/daily-editorial-first-article/localsend-guide.md` passed with 0 hard errors and 3 warnings. The warnings flag passive wording in the preparation and untested disclosure; retaining that plain disclosure is appropriate. It is a mechanical writing diagnostic, not a factual or originality guarantee.

Independent reviewer `/root/first_article/localsend_sources` independently retrieved the licence, branch, release and relevant app sources, then reread the final article. The original full-draft review passed against the prior hash. After the source-verified Save to folder platform correction, full independent review of the new hash above is pending.

Additional local checks passed:

- Draft SHA256 matches the evidence ledger and independent-review record.
- All claim/source IDs are unique and every source reference resolves within the ledger.
- All external source URLs use HTTPS.
- All 12 recorded complete sentence excerpts match fetched primary-source content.
- The hypothetical arithmetic is 12 × 4 MB = 48 MB, with no speed prediction.
- `git diff --check -- docs/daily-editorial-first-article` returned exit 0.

The illustration was rendered with the repository's existing Sharp dependency and its PNG preview visually inspected. Text is readable and contained within the canvas. Sharp exited 0; Fontconfig reported unwritable cache directories while rendering. No font/cache permissions were changed.

## Publication status

No paid Jina, Ollama or TypeSafe calls were made. No upstream repository was installed or executed, and no credentials were accessed. The factual review is a documented source check; it is not a TypeSafe decision or security audit.

This subtask changed only this documentation directory. It added no public catalog row or reader route, did not modify existing editorial dates, RSS, sitemap or structured data, and did not schedule or deploy anything. Publishing and any paid-provider checks remain under the parent's independent setup review and activation coordination. The final public route and live page must be verified before reporting a live article.

Site base used for local context: `ce3b5f2e9d35a3211eb170c3209263046f5f70a5` in `eliteandhonor/accessfreetools.com`.
