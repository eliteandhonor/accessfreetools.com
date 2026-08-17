# Worklog

Append dated actions, commands, report paths, and blockers. Do not rewrite prior entries.

- 2026-07-29: Campaign initialized from supplied Google, Bing, and CrawlScout evidence.
- 2026-07-29: Imported the July 29 Google ZIP directly. Preserved 48 chart clicks, 29,838 chart impressions, 597 page rows, the 2026-05-01 to 2026-07-26 chart period, and source SHA-256 hashes in `output/search-console/performance-latest.json`.
- 2026-07-29: Imported the July 29 Bing overview as 85 valid rows, 67 clicks, 3,367 impressions, and zero validation issues in `output/bing-webmaster/latest.json`.
- 2026-07-29: Imported the supplied CrawlScout sample as 118 rows, including 111 zero-click rows with impressions.
- 2026-07-29: Merged 487 historical URL-inspection reports into 403 newest-per-URL records, then added fresh July 29 inspections. `npm run aft -- indexing-gaps` dropped from 131 stale apparent gaps to 124 current gaps.
- 2026-07-29: Focused importer and writing tests passed: 4 files and 26 tests.
- 2026-07-29: Added npm 11 option forwarding coverage for exact `--zip`, `--file`, and `--no-overview` interfaces. The final merged inspection run reports 403 URLs and 125 current gaps; the earlier 124 count remains a dated intermediate snapshot.
- 2026-07-29: Release and Proof Judge approved EV-01 through EV-03 after 430 combined tests, exact July 29 imports, source hashing, and newest-per-URL proof passed.
- 2026-08-17: Added separate exact URL Inspection and aggregate evidence labels to `aft indexing-gaps`. Each source now reports its path, generated date, age, and `fresh`, `stale`, or `undated`; focused CLI tests passed and EV-04 is evidence-ready pending the full release gate.
