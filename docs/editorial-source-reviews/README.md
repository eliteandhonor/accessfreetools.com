# Article Evidence Records

The local writing score checks structure and wording. It does not verify source claims, originality, lived experience, or permission to publish. Three links are three links, not three checked primary sources.

For each new or changed site editorial, add `<slug>.json` here after reviewing the actual draft. Do not create records from an article's reference list alone. Medium and other long-form promotion drafts need the same claim and owner review in their existing campaign evidence before publication; the site checker does not approve those channels.

Each record uses schema version 1 and contains:

- `slug`, `articleSha256`: exact slug and SHA-256 of `src/pages/blog/<slug>.astro`. Recheck evidence when the draft changes.
- `reviewedAt`, `reviewer`: ISO timestamp and the person or agent who opened and checked the primary sources.
- `claims`: each has `claim`, `sourceUrl` (HTTPS and linked in the article), `primarySource: true`, `checkedAt`, and `finding`. Record what the source actually supports and any limits. Use a concise paraphrase, not copied article passages. Cover every consequential external claim; counting entries cannot prove coverage.
- `brendanFacts`: each has `fact`, `checkedAt`, and `evidenceRef`. Link to the actual owner statement or first-party project proof. Do not invent an anecdote or infer personal experience from a dependency list.
- `ownerApproval`: `status: "approved"`, `by: "Brendan Chambers"`, `approvedAt`, and `evidenceRef` identifying the owner's approval of this reviewed draft. A date, a scheduled row, or a general idea is not that approval. Never manufacture this entry to pass a check.

Keep credentials, private reader information, copied private conversations, and unnecessary personal data out of these files. Use references to authorized evidence, not its private contents.

`npm run check:editorial-quality` validates record completeness and source hash, not the truth of a record. `recorded` is not `approved` or `verified`; the release reviewer must open evidence and confirm source coverage, Brendan's facts, wording, and authorization. Preserve authorship, AI-assistance, and legal disclosures.

## Existing Articles

`legacy-source-hashes.json` freezes the seven unchanged articles present on September 6. They remain `legacy-unreviewed`, not retroactively approved. No public article or date changes are required by this internal reporting change. New articles and edits that differ from those hashes fail the source-record gate until a valid record exists. Do not add new hashes or refresh old ones to bypass that gate.
