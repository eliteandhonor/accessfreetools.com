# Recommended Agency Agents

Reviewed source: `msitarzewski/agency-agents` on GitHub:
`https://github.com/msitarzewski/agency-agents`

The reviewed repo is a broad third-party prompt library. Do not install it
wholesale into Access Free Tools. Use the selected agents below as specialist
lenses, then bind their work to this repo's existing docs, proof gates, and CLI
commands.

Local rules always win over outside agent prompts:

- `AGENTS.md`
- `docs/brand-code.md`
- `docs/agent-cli.md`
- platform-specific promotion agent docs
- proof reports in `output/`

Do not copy raw third-party prompt files into this repo unless the user asks for
a prompt-library migration and license review.

## Default Upgrade Loop

Use this loop when upgrading or running any current Access Free Tools agent:

1. Load the local owner docs for the workstream.
2. Pick one primary specialist lens from this file and, only when needed, one
   proof lens.
3. Run the lightest local proof command that can answer the question.
4. Produce exact next actions with URL, slug, evidence source, priority, and
   proof check.
5. Stop before public posting, paid research, DNS/hosting writes, account
   changes, or legal-risk changes unless the user explicitly approves the exact
   action.

Default proof lens:

- Evidence Collector for screenshots, visible pages, image/gallery proof, and
  public promotion proof.
- Reality Checker for final done/fixed/posted/production-ready claims.

## Agent Support Tools

Use these read-only CLI tools before manual digging:

- `npm run aft -- route "<task>"`: choose the current lane, specialist lens,
  proof lens, local docs, proof commands, and approval gates. The editable lane
  rules live in `docs/agent-routing-rules.json`.
- `npm run aft -- evidence-pack <lane>`: collect the docs and latest evidence
  source status for `seo-review`, `seo`, `api`, `promotion`, `deploy`, `analytics`,
  `automation`, `ui`, or `code`.
- `npm run aft -- claim-check "<claim>"`: verify whether a live, fixed, done,
  posted, or production-ready claim includes public URL, screenshot, or
  generated-report proof. Cited local proof paths must exist; use
  `--verify-urls` when a public URL should be fetched before repeating the
  claim.
- `npm run aft -- tool-brief <slug>`: summarize one tool's guide, renderer,
  API readiness, sitemap, image/art status, internal-link proof, usage signal,
  Search Console state, deep-review status, related tools, and next proof
  commands.
- `npm run aft -- seo-tool-queue`: build the controlled tool/blog SEO review
  queue with one approval unit per page.
- `npm run aft -- seo-tool-research <slug> --page tool|blog`: build the local
  research pack for the exact page under review.
- `npm run aft -- seo-page-score <slug> --page tool|blog`: score the current
  page for SEO fit, specificity, FAQs, internal links, tone, trust, and proof.
- `npm run aft -- seo-approval-status <slug>`: verify whether both the tool page
  and guide are approved before the next slug starts.
- `node scripts/seo-agent-workbench.mjs sources <slug> <tool|blog>`: record the
  web/source research checkpoints every SEO specialist must start from.
- `node scripts/seo-agent-workbench.mjs micro-plan <slug> <tool|blog>`: expand
  the page into one-question SEO micro-agents and park irrelevant conditional
  groups such as local, ecommerce, international, or video when they do not
  apply.
- `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>`: run the
  separate SEO agent council, source evidence, evaluator agents, contextual link
  audit, and final judge for the current page.
- `npm run aft -- agent-doctor`: audit the local agent docs and helper command
  surface after agent-system edits.

## Current Agent Upgrade Router

Use this router before starting work:

| Current agent lane | Primary specialist lens | Proof lens | First local command |
| --- | --- | --- | --- |
| Marketing Orchestrator | Product Trend Researcher + SEO Specialist | Reality Checker | `npm run aft -- marketing` |
| SEO Agent | SEO Specialist | Evidence Collector | `npm run aft -- seo-console` |
| Tool/blog SEO review | Web SEO Source Research Agent + SEO Tool Research Agent + Smart 14 Voice Editor | Final SEO Judge + Human Approval Gatekeeper | `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` |
| AI search and recognition | AI Citation Strategist | Reality Checker | `npm run aft -- recognition` |
| Ask/API/MCP | API And MCP Tester + Agentic Search Optimizer | Reality Checker | `npm run aft -- ask-audit` |
| Platform promotion | Technical Writer + Legal Compliance Checker | Evidence Collector | platform quality command |
| Medium articles | Technical Writer | Evidence Collector | `npm run promotion:medium:quality` |
| Reddit and Quora | Legal Compliance Checker + Technical Writer | Evidence Collector | matching quality command |
| Bluesky and DEV | Technical Writer | Evidence Collector | matching quality command |
| Tool/page UI | Accessibility Auditor | Evidence Collector | `npm run build` then targeted QA |
| Images/gallery | Performance Benchmarker | Evidence Collector | `npm run images:qa` |
| Analytics/data assets | Analytics Reporter | Reality Checker | `npm run analytics:production` |
| Automations | Automation Governance Architect | Reality Checker | `npm run automation:env-check` |
| Hostinger/deploy | Automation Governance Architect | Reality Checker | `npm run aft -- hostinger` |
| Code review | Code Reviewer | Reality Checker | task-specific tests |
| Narrow fixes | Minimal Change Engineer | Evidence Collector | task-specific tests |

## Recommended Agents To Adapt

### AI Search And Agentic Discovery Pair

Use when improving AI-search visibility, public recognition, Ask/API/MCP, or
agent ability to discover and run tools.

- AI Citation Strategist
  - Local owner docs: `docs/search-engine-land-seo-task-board.md`,
    `docs/seo-agent-operating-system.md`, `docs/google-search-central-notes.md`
  - Local proof commands: `npm run aft -- recognition`,
    `npm run aft -- ai-crawler`, `npm run aft -- semantic-depth`
  - Access Free Tools adaptation: measure citation or recognition evidence as a
    point-in-time snapshot. Never promise AI engines will cite the site.

- Agentic Search Optimizer
  - Local owner docs: `docs/ask-api-mcp-alpha.md`, `docs/agent-cli.md`
  - Local proof commands: `npm run aft -- ask-audit`,
    `npm run aft -- api-ready`, `npm run aft -- mcp-smoke`
  - Access Free Tools adaptation: focus on deterministic tool discovery,
    tool-runner schemas, REST/MCP parity, and rendered tool-page usability.
    Treat speculative browser-agent standards as research notes unless current
    primary documentation proves support.

### Controlled Tool/Blog SEO Review Team

Use when improving one tool page, matching guide, FAQ, metadata, related links,
or page-specific SEO language.

- SEO Tool Research Agent
  - Local owner docs: `docs/seo-tool-review-workflow.md`,
    `docs/search-engine-land-seo-task-board.md`, `docs/brand-code.md`
  - Local proof commands: `npm run aft -- seo-tool-queue`,
    `npm run aft -- seo-tool-research <slug> --page tool|blog`,
    `npm run aft -- tool-brief <slug>`
  - Access Free Tools adaptation: gather local evidence first and keep the
    current page separate from every other page.

- Competitor Gap Analyst
  - Local owner docs: `docs/seo-tool-review-workflow.md`,
    `docs/dataforseo-knowledgebase-notes.md`
  - Local proof commands: `npm run aft -- seo-competitor-gap <slug> --page tool|blog --url <competitor-url>`
  - Access Free Tools adaptation: use competitor pages only for topic gaps.
    Never copy their wording, page order, examples, or brand voice. Paid
    DataForSEO calls need explicit approval for that run.

- Smart 14 Voice Editor
  - Local owner docs: `docs/brand-code.md`,
    `docs/article-writing-agent-standard.md`
  - Local proof commands: `npm run aft -- seo-page-score <slug> --page tool|blog`,
    `npm run aft -- content-score <guide-file>` for guides
  - Access Free Tools adaptation: make copy specific to the exact tool, with
    simple language, real examples, honest limits, and no generic filler.

- FAQ And Schema Specialist
  - Local owner docs: `docs/seo-tool-review-workflow.md`,
    `docs/google-search-central-notes.md`
  - Local proof commands: `npm run aft -- seo-page-score <slug> --page tool|blog`,
    `npm run aft -- page-seo <slug>`
  - Access Free Tools adaptation: visible FAQ text and structured data must
    match. FAQs should answer real user questions, not chase rich-result hacks.

- Browser Proof Reviewer
  - Local owner docs: `docs/seo-tool-review-workflow.md`, `docs/agent-cli.md`
  - Local proof commands: internal browser proof first, Playwright fallback if
    the internal browser is unavailable
  - Access Free Tools adaptation: record the exact URL and proof path before
    asking the user for page approval.

- Human Approval Gatekeeper
  - Local owner docs: `docs/seo-tool-review-queue.md`
  - Local proof commands: `npm run aft -- seo-approval-status <slug>`
  - Access Free Tools adaptation: the next page stays blocked until the current
    page approval is recorded. Tool-page approval and guide approval are
    separate.

- Final SEO Judge
  - Local owner docs: `docs/seo-agent-workbench.md`,
    `docs/seo-tool-review-workflow.md`, `docs/seo-tool-review-queue.md`
  - Local proof commands: `node scripts/seo-agent-workbench.mjs judge <slug> <tool|blog>`,
    `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>`
  - Access Free Tools adaptation: every specialist agent has a matching
    evaluator. The final judge can say `ready-for-human-approval`, but only the
    user can approve and unlock deployment or the next page.

### Evidence And Release QA Pair

Use after frontend, artwork, gallery, sitemap, tool-page, guide, API, or deploy
changes where a claim needs proof.

- Evidence Collector
  - Local owner docs: `docs/smoke-kawaii-image-system.md`,
    `docs/agent-cli.md`, `docs/deployment-checklist.md`
  - Local proof commands: `npm run check:site`, `npm run images:qa`,
    `npm run images:sitemap-check`, `npm run gallery:qa`,
    `npm run aft -- proof-check`
  - Access Free Tools adaptation: collect screenshots or generated report paths
    for visible claims. If proof is missing, say `not enough data`.

- Reality Checker
  - Local owner docs: `docs/deployment-checklist.md`,
    `docs/hostinger-api-agent-guide.md`, `docs/agent-cli.md`
  - Local proof commands: `npm run check`, `npm run aft -- proof-check`,
    `npm run check:live-ask` after API/Ask/MCP deploys
  - Access Free Tools adaptation: block "done", "fixed", "posted", or
    "production ready" claims unless the relevant local proof exists.

### Accessibility Auditor

Use when changing layouts, tool UIs, forms, calculators, navigation, modals, or
admin pages.

- Local owner docs: `docs/full-site-improvement-plan.md`,
  `docs/analytics-dashboard.md` for admin analytics pages
- Local proof commands: `npm run build`, `npm run check:site`,
  targeted Playwright/axe checks when UI changed
- Access Free Tools adaptation: check keyboard paths, focus states, labels,
  errors, contrast, zoom resilience, reduced motion, and mobile target size.

### API And MCP Tester

Use when changing Ask, REST API, MCP, OpenAPI, tool schemas, deterministic
runners, or API-ready registry work.

- Local owner docs: `docs/ask-api-mcp-alpha.md`, `docs/agent-cli.md`
- Local proof commands: `npm run aft -- ask-audit`,
  `npm run aft -- api-ready`, `npm run aft -- mcp-smoke`,
  `npm run check:live-ask`
- Access Free Tools adaptation: exact calculator answers must come from
  deterministic Access Free Tools code, not model-only math.

### Performance Benchmarker

Use after asset, layout, global CSS, image, build, sitemap, or route changes that
could affect page speed or Core Web Vitals.

- Local owner docs: `docs/deployment-checklist.md`,
  `docs/smoke-kawaii-image-system.md` for image-heavy changes
- Local proof commands: `npm run build`, `npm run check:performance`,
  `npm run check:ai-assets`
- Access Free Tools adaptation: keep performance findings tied to measured
  output and local budget checks, not generic optimization advice.

### Minimal Change Engineer

Use as the default engineering posture in this long-running, often-dirty
worktree.

- Local owner docs: `AGENTS.md`
- Local proof commands: task-specific checks plus `git diff --stat`
- Access Free Tools adaptation: touch only files required for the user request.
  Capture unrelated improvement ideas as follow-ups instead of mixing them into
  the patch.

### Code Reviewer

Use when the user asks for review, PR feedback, risk assessment, or final
pre-GitHub scrutiny.

- Local owner docs: `AGENTS.md`, `docs/deployment-checklist.md`
- Local proof commands: `npm run check` before GitHub updates when feasible
- Access Free Tools adaptation: lead with bugs, regressions, security risks, and
  missing tests. Keep style preferences secondary.

### Automation Governance Architect

Use before creating or changing automations, scheduled jobs, deployment
automation, indexing submission automation, social workflows, or Hostinger/DNS
automation.

- Local owner docs: `docs/automation-operating-plan.md`,
  `docs/hostinger-api-agent-guide.md`, `docs/marketing-orchestrator.md`
- Local proof commands: `npm run automation:env-check`,
  `npm run aft -- hostinger`, `npm run aft -- proof-check`
- Access Free Tools adaptation: automation can report and prepare, but it must
  not publish, spend credits, submit live changes, or mark work complete without
  explicit approval and proof.

### Analytics Reporter

Use when changing analytics, interpreting owner dashboards, using anonymous
tool-use data, or proposing public data assets.

- Local owner docs: `docs/analytics-dashboard.md`,
  `docs/original-data-asset-plan.md`, `docs/agent-cli.md`
- Local proof commands: `npm run analytics:production`,
  `npm run aft -- usage-notes`; use `npm run aft -- usage-summary` only for local QA diagnostics
- Access Free Tools adaptation: separate owner traffic from public-user signals
  when possible, and do not publish usage stories from tiny samples.

### Legal Compliance Checker

Use before privacy, terms, affiliate, advertising, medical/financial disclaimer,
tracking, or user-data changes.

- Local owner docs: `docs/legal-monetization-readiness.md`,
  `docs/analytics-dashboard.md`, `docs/hostinger-api-agent-guide.md`
- Local proof commands: task-specific local checks plus `npm run check:secrets`
- Access Free Tools adaptation: flag legal risk and required owner review. Do not
  present legal conclusions as legal advice.

### Product Trend Researcher And Feedback Synthesizer

Use when deciding what tools to build or improve next.

- Local owner docs: `docs/next-agent-tasks.md`,
  `docs/original-data-asset-plan.md`, `docs/calculator-net-roadmap.md`
- Local proof commands: `npm run analytics:production`,
  `npm run aft -- marketing`, targeted DataForSEO checks when SEO research is
  needed
- Access Free Tools adaptation: prioritize real utility, Search Console signals,
  actual anonymous usage, competitor gaps, and deterministic tools. Do not create
  thin keyword pages just because a phrase exists.

### Technical Writer

Use when changing developer docs, API docs, README content, how-to docs, or
longer explanatory guides.

- Local owner docs: `docs/brand-code.md`,
  `docs/article-writing-agent-standard.md`, `docs/ask-api-mcp-alpha.md`
- Local proof commands: `npm run aft -- content-score <file>`,
  platform-specific quality gates for public promotion copy
- Access Free Tools adaptation: public copy must stay plain, useful, honest, and
  free of agent-facing language.

## Agents To Skip Unless Explicitly Requested

Skip these by default because they do not fit current Access Free Tools work or
conflict with standing guardrails:

- paid media agents: this repo must not run ads or spend money without explicit
  approval
- sales/outreach agents: promotion must be useful, disclosed, and platform-safe
- China-market-only platform agents: no current approved channel
- mobile, game, spatial computing, firmware, blockchain, Salesforce, and
  vertical-industry agents: outside current product scope
- broad autonomous orchestrators that would bypass local evidence gates

If the user explicitly asks for one of these areas, apply the relevant local
docs first and ask for approval before account, payment, legal, or live-platform
actions.
