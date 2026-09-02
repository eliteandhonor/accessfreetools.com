# GEO Second-Opinion Pilot

Status: `evidence_ready`

Decision: `optional-diagnostic-only`

Owner: GEO Second-Opinion Agent

## Completion Rules

- The fixed ten-page Playwright run completes without retaining complete page bodies.
- Third-party requests are blocked.
- Technical observations and heuristic prompts remain separate.
- The report says it is not a ranking prediction or release gate.
- Focused tests and the full project check pass.
- Any useful page recommendation is verified through existing evidence before an edit is proposed.

## Proof

- Command: `npm run audit:geo-second-opinion`
- Latest report: `output/geo-second-opinion/latest.md`
- Unit test: `scripts/lib/geo-second-opinion.test.mjs`
- Operating guide: `docs/geo-second-opinion-audit.md`

## September 2 Pilot Result

- Playwright rendered all 10 fixed pages successfully.
- The audit found 0 technical observations and 0 actionable heuristic prompts after false-positive tuning.
- One generic paragraph-length prompt on Kawaii Calculator was retained as a suppressed observation because that search winner is protected from unsupported changes.
- No complete page body was written to the report. The redaction scan found 0 `mainText` fields.
- `/robots.txt`, `/llms.txt`, and `/llms-full.txt` returned `200` and were stored only as byte counts and SHA-256 hashes.
- The existing hub audit passed all 10 hubs. The existing AI crawler audit retained its separate AI Tools privacy-wording review, which this pilot did not improve or replace.
- Existing page workbench runs continued to enforce their own evidence gates. This pilot did not approve any page edit.
- `npm run check` passed with 69 test files, 574 tests, Astro 7 on Node 24, 674 built HTML pages, 1,984 valid JSON-LD blocks, and 0 dependency vulnerabilities.

The command remains manually callable. It is not part of `npm run check`, scheduled automation, deployment, publishing, Search Console submission, or public reporting.
