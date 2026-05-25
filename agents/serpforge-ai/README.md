# SERPForge AI Workspace

SERPForge AI is the repo-local SEO persona workspace for Access Free Tools. Use it for strategy notes, page-review intake, briefs, evidence summaries, and SEO execution reports that do not belong in public content.

## Folder Map

- `AGENTS.md`: standing rules for this persona.
- `intake.md`: queue of requested SEO jobs before they become workbench runs.
- `worklog.md`: dated notes, decisions, and proof paths.
- `tasks/`: stable task boards used by the main agent and sub-agents, including live follow-up tasks from Search Console and DataForSEO proof.
- `briefs/`: content briefs, keyword maps, topic cluster notes, and CTR rewrite drafts.
- `evidence/`: local evidence summaries, command outputs worth preserving, and source notes.
- `reports/`: final strategy reports, audits, roadmaps, and sprint recommendations.

## First Commands

Set up or refresh the SERPForge tool inventory:

```powershell
npm run serpforge -- toolbox
```

For broad orientation:

```powershell
npm run serpforge -- audit-import
npm run serpforge -- deep-audit-import
npm run serpforge -- deep-audit-agents
npm run serpforge -- audit-tasks
npm run serpforge -- sitewide-seo-audit
npm run serpforge -- audit-sprint
npm run serpforge -- deep-audit-sprint
npm run serpforge -- orientation
npm run serpforge -- opportunity
npm run aft -- status
npm run aft -- marketing
```

For the latest live recommendations that still need agent work:

```powershell
Get-Content agents/serpforge-ai/tasks/live-recommendation-agent-tasks-2026-05-25.md
Get-Content agents/serpforge-ai/tasks/gsc-performance-agent-tasks-2026-05-26.md
node scripts/seo-agent-workbench.mjs all wallpaper-calculator tool
node scripts/seo-agent-workbench.mjs all interest-rate-calculator tool
npm run search-console:inspect-key-urls
npm run serpforge -- deep-audit-sprint
```

For page-specific SEO work:

```powershell
npm run serpforge -- sources <slug> <tool|blog>
npm run serpforge -- brief <slug> <tool|blog>
npm run serpforge -- ctr <slug> <tool|blog>
npm run serpforge -- page <slug> <tool|blog>
npm run serpforge -- validate <slug> <tool|blog>
npm run aft -- seo-tool-queue
npm run aft -- seo-tool-research <slug> --page tool|blog
npm run aft -- seo-page-score <slug> --page tool|blog
node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>
```

For technical and external lab evidence:

```powershell
npm run serpforge -- technical
npm run serpforge -- technical-header-plan
npm run serpforge -- heading-metadata-plan
npm run serpforge -- content-depth-plan
npm run serpforge -- eeat-author-plan
npm run serpforge -- authority-plan
npm run serpforge -- social-discovery-plan
npm run serpforge -- template-qa
npm run serpforge -- metadata-plan
npm run serpforge -- schema-plan
npm run serpforge -- eeat-plan
npm run serpforge -- hub-plan
npm run serpforge -- crawl-plan
npm run serpforge -- dataforseo-plan
npm run serpforge -- dataforseo-sitewide-audit
npm run serpforge -- sitewide-seo-audit
npm run serpforge -- lighthouse https://accessfreetools.com/tools/percentage-calculator/
npm run serpforge -- lighthouse https://accessfreetools.com/tools/percentage-calculator/ desktop
```

For gallery, image, sitemap, and Search Console work:

```powershell
npm run serpforge -- gallery-seo-plan
npm run serpforge -- image-alt-audit
npm run serpforge -- image-alt-plan
npm run serpforge -- image-sitemap-plan
npm run serpforge -- html-sitemap-plan
npm run serpforge -- gsc-submit-sitemaps
```

For paid DataForSEO sprint evidence:

```powershell
npm run serpforge -- dataforseo-sitewide-audit -- --no-wait
npm run serpforge -- paid-audit-sprint <slug> <tool|blog>
```

For targeted competitor evidence:

```powershell
npm run serpforge -- competitor <slug> <tool|blog> <competitor-url>
```

For technical/indexing proof:

```powershell
npm run aft -- indexing-gaps
npm run aft -- proof-check
npm run aft -- seo-console
```

For hub, semantic, and recognition work:

```powershell
npm run aft -- hub-strength
npm run aft -- semantic-depth
npm run aft -- recognition
```

## Working Rule

Keep this folder for working artifacts. If a finding becomes a standing project rule, move it into the matching repo-level doc instead of letting this workspace become the only source of truth.
