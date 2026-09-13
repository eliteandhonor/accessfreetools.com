# BR-01 Sparse JSON Allocation

Date: 2026-09-06. Baseline: `90d6dcab0580a91ca66382f2414d95e8817469e5`. Worktree: `accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`.

The existing 5 MB input limit did not bound the dense table. A 500-row, 500-key sparse fixture used less than 10 KB of input but created 250,000 cells. Larger sparse inputs could allocate billions of cells.

Changes in `src/lib/jsonToCsv.ts`:

- Limit input to 50,000 rows, 256 columns, 250,000 cells including the header, and 32 nested object/array levels.
- Count the complete output's escaped UTF-8 bytes, separators, CRLF and optional BOM while flattening sparse input. Reject above 16 MB before dense output allocation.
- Bound nested arrays before JSON cell serialization. Keep first-seen headers, arrays-as-cells, formula protection, delimiter selection and BOM behavior.
- Reject with recoverable input errors; no data truncation or partial success.

Unit regression RED: six added cases failed. GREEN: all 21 cases pass, including the exact allowed cell boundary. Tests cover row/column/cell/depth limits and repeated-prefix header expansion.

Browser regression `tests/json-csv-resource-limits.spec.ts` exercises a 50,000-key sparse input, rejection, successful subsequent conversion, CSV download, and synthetic-sentinel request inspection at the existing desktop/mobile projects. Execution awaits the integrated build. No real customer input is used.

Still required: browser execution, integrated checks and independent judge. This is implementation progress, not final task approval.
