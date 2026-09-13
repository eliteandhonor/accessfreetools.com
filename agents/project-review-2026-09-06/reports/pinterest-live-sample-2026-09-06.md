# Pinterest Live Destination Sample

Observed September 6, 2026, approximately 08:00-08:05 UTC in the owner's existing Chrome tab. This is read-only public Pin verification from the authenticated account, not a full account audit or a publishing action. The profile was restored afterward.

The Access Free Tools profile visibly reports 109 monthly views and displays existing created Pins. Monthly views are not website referrals, clicks, or unique readers.

| Pin | Verified public URL | Actual Visit site destination |
| --- | --- | --- |
| JSON to CSV Converter | https://au.pinterest.com/pin/1148277236271593156/ | https://accessfreetools.com/tools/json-to-csv-converter/?utm_source=Pinterest&utm_medium=organic |
| Browser AI vs Local AI | https://au.pinterest.com/pin/1148277236271526861/ | https://accessfreetools.com/blog/browser-ai-vs-local-ai-privacy/?utm_source=Pinterest&utm_medium=organic |
| Text Case Converter | https://au.pinterest.com/pin/1148277236269797354/ | https://accessfreetools.com/tools/text-case-converter/?utm_source=Pinterest&utm_medium=organic |

The live DOM contained matching title and Visit site anchors for all three. Each branded image was visible in the screenshot inspected in the browser tool. Browser AI also visibly displayed Pinterest's AI modified disclosure. No advertisement, Save, reaction, publishing control, or account setting was clicked. No original-page destination visit or conversion was counted as part of this sample.

## Limits And Remaining Evidence

- The Node public-board scanner fetched six boards and saw 313 Pins, but its response omitted every destination. That is incomplete scanner evidence, not proof of broken Pins or lost account access. The rerun at 2026-09-06T08:07:12.669Z reproduced this in `output/promotion/pinterest-public-proof-scan.json`.
- These three direct observations do not certify all scanned Pins, prove board membership from a save selector, or repair the scanner's full-coverage result. They must not turn the channel's incomplete scan into an all-Pins pass.
- The Browser AI image DOM exposed the generic alt `Story pin image`; Text Case exposed Pinterest-generated wording beginning `This may contain`. JSON-to-CSV also exposed `Story pin image` in the accessibility tree. Custom descriptive alt text is not verified. No editor settings were inspected or changed.
- This confirms existing public work only. It does not authorize duplicate publication, a fresh promotion wave, or a posted-status change for unrelated queue rows.

Next action: preserve these exact destination observations, keep the scanner failure mode explicit, and review the existing Pins' saved alt descriptions in a separately authorized accessibility edit. Use an official supported data source or direct browser verification for future exact Pin proof; do not invent missing destinations from Pin titles.
