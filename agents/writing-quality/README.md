# Writing Quality Workspace

This workspace documents the repository-local clarity checker in
`scripts/writing-quality.mjs`. The checker adds a final mechanical review after
the project's factual, brand, reader-first, and Stop Slop gates.

## Run It

Editorial copy:

```powershell
node scripts/writing-quality.mjs --mode=editorial path\to\article.md
```

Technical copy:

```powershell
node scripts/writing-quality.mjs --mode=technical path\to\procedure.md
```

The target can be one file or a directory. Directory scans include Markdown,
MDX, text, HTML, and Astro files. Generated output, dependencies, build output,
and Git state are skipped.

## Reports

Each run replaces these ignored reports:

- `output/writing-quality/latest.json`
- `output/writing-quality/latest.md`

The JSON report contains bounded excerpts, locations, rule layers, severity,
mode thresholds, and source attribution.

## Exit Behavior

- Exit `0`: no hard writing errors. The report can still contain warnings.
- Exit `1`: a hard writing error exists or the audit could not run.

Hard writing errors cover em dashes, agent-facing public text, defined hype,
and defined false-certainty claims. Long sentences, passive wording,
semicolons, nominalizations, and long paragraphs remain warnings.

## Current Boundary

This first version is intentionally standalone. It does not edit
`package.json`, existing editorial checks, existing Medium checks, or global
Codex skills.
