# Frontend, Accessibility, Performance, And QA Review

Date: 2026-09-06. Specialist report only; implementation is not authorized.

Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`.
Verified HEAD: `90d6dcab0580a91ca66382f2414d95e8817469e5`.
Scope: shared presentation/navigation, discovery interfaces, representative tools and guides, editorial reading layouts, artwork presentation, and actual browser QA assertions.

## Executive Finding

The existing checks provide useful evidence, but do not establish complete frontend quality. Fresh local browser probes reproduced three keyboard-flow defects and a responsive discovery problem despite the coordinator's passing visual/accessibility gates. No product code was changed. Recommended tasks below are `planned`, not approved or implemented.

Highest-value goal: preserve the reader's place when revealing content, then shorten the route from search/category selection to usable tool results on narrow screens. Preserve existing artwork, link destinations, and gallery deep links.

## Confirmed Findings

### FQ-01 [P2] Show All Skips The Content It Reveals For Keyboard Users

- Evidence class: fresh-build browser/DOM reproduction, high confidence. A still screenshot cannot prove this focus transition.
- Exact ownership: `src/components/ToolsLaunchpad.tsx:600` conditionally removes the focused reveal button; `src/components/BlogSearch.tsx:142` does the same; `src/pages/gallery/[category].astro:249` hides the focused gallery button without moving focus to newly revealed content.
- Scope/trigger: at `/tools/`, `/blog/`, and `/gallery/finance/`, focus the Show all button, press Enter, wait for items to appear, then press Tab.
- Observed result: active element becomes `BODY` in all three cases. Tools expands to 308 cards, but the next Tab goes to the later `Free online calculators` discovery link. Blog expands to 304 cards, but the next Tab goes to a later curated article. Gallery's next Tab goes to `#401k-calculator-guide`, skipping the newly revealed tool-image links entirely.
- Impact: the command visibly succeeds, but sequential keyboard navigation proceeds beyond the new results. The user must reverse through content or relocate their place. This is not a claim that the links become permanently inaccessible.
- Minimal task: Accessibility Auditor + Minimal Change Engineer preserve a logical keyboard continuation point. Focus the first newly revealed link after insertion, or use an equivalent persistent-control pattern whose next Tab enters the new content. Keep existing count announcements and gallery hash behavior.
- Acceptance: Enter and Space activation at 1365, 768, and 390 px; next focus is within the first newly revealed item, not `BODY` or the following section; no repeat announcement storm; no unexpected scrolling past the new item; delayed search-index success and failure preserve a usable focus target; direct hashes to initially hidden gallery items still work.
- Coverage gap: `scripts/check-key-visual-layout.mjs:222` calls `reveal.click()` inside page evaluation and checks hidden counts/expanded state only. It does not exercise keyboard continuation. Tool/blog reveal keyboard behavior is absent from the inspected accessibility script.

### FQ-02 [P2] Selecting A Website Look Loses Focus

- Evidence class: fresh-build browser/DOM reproduction, high confidence.
- Exact ownership: `src/components/ThemePicker.tsx:70` through the close operation at line 78. Unlike the Escape handler at line 57, `chooseTheme` does not restore focus to the trigger.
- Scope/trigger: shared header on public pages. Focus the theme trigger, Enter, Tab to the Fresh swatch, Enter to select it.
- Observed result: the picker closes and focus becomes `BODY`; next Tab lands on the breadcrumb Home link. Escape has a restoration path, but selection does not.
- Impact: the currently focused control disappears and there is no visible focus location after applying the preference. Repeat selection requires navigating back to the trigger.
- Minimal task: Accessibility Auditor + Minimal Change Engineer restore trigger focus after keyboard selection; maintain the current outside-pointer dismissal behavior.
- Acceptance: select both current and different themes with Enter/Space; trigger receives focus, has updated accessible current-look text, and exposes `aria-expanded=false`; Escape still restores focus; preferences still persist; test pointer dismissal independently.
- Coverage gap: `scripts/check-accessibility.mjs:203` opens with a pointer click, explicitly focuses a swatch at line 206, and tests Escape only. It never selects a swatch.

### FQ-03 [P2] The Full Category Rail Pushes Results Far Below Search On Tablet/Mobile

- Evidence class: screenshot-confirmed and fresh-build geometry, high confidence for layout; no conversion-loss claim.
- Exact ownership: `src/styles/global.css:8385` includes `.launchpad-grid` in the <=980 px single-column layout; `src/styles/global.css:7615` retains the full grid category rail, with 46 px minimum buttons at line 7629. `src/components/ToolsLaunchpad.tsx:529` places the rail before results. Header stacking at `src/styles/global.css:8414` and line 8433 adds further height.
- Scope/trigger: open `/tools/` in the default unfiltered state at 768x1024 or 390x844, with ads suppressed.
- Observed result: the rail is 716 px tall. At 768 px, the header is 232 px and the first tool starts at y=1445.6. At 390 px, the header is 212 px and the first tool starts at y=1548.2. Desktop comparison: first tool y=553.8 at 1365x900. Search remains available, but the complete category list sits between it and the results.
- Screenshot proof: `output/playwright/frontend-local-tools-tablet.png`, `frontend-local-tools-mobile.png`, and `frontend-live-tools-tablet.png`. Local captures isolate the layout from the live consent banner.
- Impact: users must scroll through every category before browsing results; even typed/filter results remain structurally below that rail. This is a discovery/ergonomics issue, not document horizontal overflow.
- Minimal task: Accessibility Auditor + frontend implementer use a compact accessible category selector/disclosure at <=980 px, keeping search and the first result close together. Consider placing the theme trigger beside the brand in the same narrow-screen header row. Preserve every category and the existing desktop rail.
- Acceptance: at 768x1024, search and part of the first tool card are visible without scrolling in the default owner-suppressed state; at 390x844, selecting a category or typing a query exposes the first matching card without a full category-list scroll; all categories remain keyboard reachable; 320 px has no page overflow; regression screenshots at 390, 768, 980, 1081, and 1365 px.
- Coverage gap: `scripts/check-key-visual-layout.mjs:12` has desktop/390/320 but no tablet; its tools branch at line 121 checks only launchpad/search existence. `scripts/check-accessibility.mjs:23` also omits tablet. Article visual checks DO include tablet; this is not a claim that all QA lacks tablet coverage.

### FQ-04 [P2] Accessibility Reports Discard Unresolved Axe Review Items

- Evidence class: confirmed reporting gap from source plus fresh axe results, high confidence. Not proof of a contrast violation.
- Exact ownership: `scripts/check-accessibility.mjs:244` consumes `axe.analyze()`, but report construction at line 250 persists blocking violations and a total violation count only. It does not preserve `results.incomplete` or actionable details for other nonblocking violations. Pass is computed at line 267 without an unresolved/manual-review state.
- Scope/trigger: run the checker on gradient/text-over-background UI or other rules axe cannot conclusively decide.
- Observed result: independent axe runs at 768x1024 on `/tools/`, `/blog/`, and `/gallery/finance/` returned zero violations but all returned incomplete `color-contrast`. Tools also returned incomplete `aria-prohibited-attr` and `link-in-text-block`; blog returned incomplete `link-in-text-block`.
- Impact: the durable report loses the nodes that need human review. A zero-blocker pass can be mistaken for completed contrast/accessibility review, especially for ten user-selectable themes.
- Minimal task: Accessibility Auditor + Evidence Collector retain incomplete and nonblocking results with node targets and review guidance. Distinguish automated-pass from manual-review-pending, without blindly converting every incomplete item into a failure. Add FQ-01/FQ-02 keyboard sequences and FQ-03 tablet position assertions to existing tests.
- Acceptance: fixture with an incomplete result survives JSON serialization with target and rule ID; report explicitly exposes unresolved count; every manual resolution has evidence or an explicit untested state; theme matrix includes actual selected themes rather than just opening the picker; existing serious/critical/landmark failures remain blocking.

## Lower-Priority Risks And Measurement Tasks

### FQ-05 [P3] Search Focus Has No Container-Level Visual Change

- Evidence: source and computed-style confirmation, high confidence about styling; insufficient evidence to declare a formal accessibility-standard failure.
- References: `src/styles/global.css:7566` and `src/styles/global.css:7854` remove outlines from tools/blog search inputs. No matching input focus or wrapper focus-within replacement was found.
- Reproduction: Ctrl+K on tools, keyboard focus on blog search. Both match `:focus-visible` while computed outline style is `none`, box shadow `none`, and border `0px none`. The wrapper has its ordinary decorative border; the text caret is the remaining focus cue.
- Evidence captures: `output/playwright/frontend-local-tools-search-focused.png` and `frontend-local-blog-search-focused.png`. These were captured with focus; the style probe is stronger evidence than a static caret frame.
- Minimal task/owner: Accessibility Auditor adds a clear `:focus-within` search-wrapper treatment consistent with the current palette, without changing dimensions.
- Acceptance: focused/unfocused screenshots distinguish the whole input area at desktop/tablet/mobile and across themes; no layout shift; Ctrl+K and native caret behavior unchanged. Do not label this a proven WCAG failure based on this report alone.

### FQ-06 [P3] Asset Budgets Are Not Route-Level Speed Evidence

- Evidence: source-only performance coverage risk, high confidence about the check's scope, unmeasured production impact.
- References: `scripts/check-performance-budget.mjs:11` defines per-extension raw-size budgets; line 71 iterates individual files and line 88 compares each against its own budget. `src/components/BaseLayout.astro:10` imports the shared global stylesheet.
- Fresh measurement: `dist/client/_astro/BaseLayout.CJzXkggG.css` is 174,488 bytes (raw). This is above the configured 130 KiB warning and below 190 KiB failure. Size alone is not a reason to rewrite the stylesheet or a claim of slow production pages.
- Scope/trigger: multiple individually under-budget files can increase aggregate route loading/parse cost while this check passes. It does not measure LCP, INP, CLS, used CSS, or a route's critical request chain. Existing `check-ai-lazy-assets.mjs` separately tests nine AI initial loads, so do not claim that lazy-model coverage is absent.
- Minimal task/owner: Performance Benchmarker collects repeatable cold/warm route-level traces for tools index, representative calculator, gallery, editorial, OCR and TTS initial loads. Set a justified aggregate budget after measuring; split CSS only if measured critical-path cost warrants it.
- Acceptance: record browser/version, viewport, CPU/network conditions, cache state, request totals, transfer versus decoded bytes, long tasks and rendering metrics; preserve zero model loads before user action; require before/after evidence for any later optimization. No production Core Web Vitals conclusion is currently supported.

## Proposed Goals And Ownership

These are recommendations for the coordinator's consolidated task board, not newly spawned agents or app goals.

| Goal | Scope | Owner | Proof Owner | Priority / State | Completion Gate |
| --- | --- | --- | --- | --- | --- |
| Keyboard users retain their place | FQ-01 and FQ-02, three discovery surfaces plus shared theme picker | Accessibility Auditor + Minimal Change Engineer | Evidence Collector | P2 / planned | Real Enter/Space/Tab sequences pass, including delayed fetch; Release Judge reviews evidence |
| Narrow-screen discovery reaches results promptly | FQ-03; optional FQ-05 focus styling | Accessibility Auditor + frontend implementer | Evidence Collector | P2 / planned | Responsive screenshots and result-position assertions meet the acceptance targets without losing categories |
| A QA pass communicates its limits | FQ-04; interaction/tablet assertions above | Accessibility Auditor | Reality Checker | P2 / planned | Incomplete findings persist and manual-review state cannot be presented as full accessibility approval |
| Performance decisions follow measurements | FQ-06 | Performance Benchmarker | Reality Checker | P3 / planned | Route traces and justified budgets exist; optimization only follows evidence |

## Visual Review And Positive Evidence

- Live source: read-only `https://accessfreetools.com/tools/`, fresh captures at 1365x900, 768x1024, 390x844, and 320x568. Live deployment revision was NOT verified against HEAD. No live finding is treated as revision-specific proof.
- Fresh-build source: coordinator-built `dist/client`, served by my own short-lived static HTTP servers on `127.0.0.1` ports 9001, 7405 and 11430. Servers and browsers were closed in `finally`; no server remains running from these probes. This tests static rendering and hydration, not Astro server routes.
- Six routes at desktop 1365x900, tablet 768x1024, mobile 390x844: tools index, blog index, finance gallery, `/blog/free-ai-skills-open-source-tools-organic-growth/`, Absolute Value Calculator, and its matching guide. All 18 loads returned HTTP 200 and had zero document horizontal overflow.
- Additional homepage, gallery hub, calculators category at desktop/mobile: all six loads returned 200 and zero document overflow. Tools breakpoint probes at widths 320, 1081, 1100, and 1200 also showed zero document overflow. This does not prove every nested container or text run is unclipped.
- Manual screenshot inspection included live tools desktop/tablet/320; local tools tablet and 1081; editorial body desktop/mobile; finance gallery artwork desktop; homepage mobile; gallery hub desktop; calculator mobile; matching guide desktop. Other stored captures extend evidence but were not all individually visually graded.
- Gallery thumbnails visible in the measured first viewports loaded successfully; the inspected finance grid shows varied topic-specific art, retained frames, captions, and tool names. No artwork replacement or crop rejection is justified by this sample. Tiny thumbnail details are not a complete full-body image QA pass.
- Editorial body screenshots show readable paragraph spacing, wrapped mobile headings/source links, and a separated desktop related-links rail, without observed body/rail overlap in those captures. The generated calculator guide retains a visible quick-start section and tool CTA. Large headings, tall introductions and the 212 px mobile header reduce first-screen working content, but FQ-03 is the concrete prioritized layout task.
- First Tab focused the skip link; Enter moved focus to `main#main-content`; Ctrl+K focused `#tool-library-search`. These were independently reproduced, not inferred from existing tests.
- Independent focused axe scans: tools/blog/finance-gallery at 768x1024 had zero reported violations, with unresolved checks recorded under FQ-04. No screen-reader certification is claimed.

## Safety And Evidence Limitations

- Live tests used a fresh browser context with analytics opt-out set before navigation, sent DNT, blocked all third-party requests, blocked API paths/non-GET requests, and never clicked ads. The DNT header alone did not suppress the live consent banner. Its overlay remains visible in live screenshots; it is not an ad impression or a diagnosed consent bug.
- Local contexts additionally set `access-free-tools-owner-ads-disabled=true`; all off-origin/API requests were aborted. No owner credentials or private analytics were read. These context-local flags did not change global settings.
- An initial MCP-browser attempt was abandoned because its screenshot tool allowed only the primary checkout, not this audit worktree. Requested audit-path screenshots were rejected. The MCP tool reported an automatically generated console-log path in the primary checkout; I did not read, modify, or clean that path. All successful screenshots were subsequently made through the audit worktree's installed Playwright. No product files were edited in any checkout.
- The first local matrix used an unguarded audit `addInitScript` storage write and recorded three `localStorage ... Access is denied` page errors while visiting the embedded-media editorial page. This is a harness limitation, not a product defect finding. Later probes wrapped that audit setup in try/catch and recorded zero page errors. Embedded third-party media and preferred-source widgets were deliberately blocked, so their live appearance/behavior is untested.

## Inspected Modules And Documents

- Full or focused source reads: `src/components/BaseLayout.astro`, `SiteHeader.astro`, `SiteFooter.astro`, `ThemePicker.tsx`, `ToolsLaunchpad.tsx`, `BlogSearch.tsx`, `EditorialArticleLayout.astro`, `ToolArtFigure.astro`, `AdvertisingControls.astro`; `src/lib/monetization.ts` (public constants and gating only).
- Targeted styles: theme tokens, skip link/header/nav/theme panel, gallery, calculator input/focus selectors, discovery/search/rail, editorial typography/sidecar, responsive breakpoints, reduced-motion selectors in `src/styles/global.css`. Not every one of its calculator rules was exhaustively reviewed.
- Page coverage: full finance-gallery category template; targeted imports/hydration/art references in `src/pages/tools/[slug].astro`, `src/pages/blog/[slug].astro`, `src/pages/index.astro`, and `src/pages/gallery/index.astro`, supplemented by rendered pages listed above. Calculator internals/formula correctness remain another specialist's scope.
- QA source: full `scripts/check-accessibility.mjs`, `check-key-visual-layout.mjs`, `check-article-visual-layout.mjs`, `check-gallery-pages.mjs`, `check-performance-budget.mjs`, `check-ai-lazy-assets.mjs`, `run-playwright-smoke.mjs`; focused `tests/site-smoke.spec.ts`; `playwright.config.ts`; package scripts. Smoke configuration has desktop/Pixel 7 projects, not a tablet project; its generic first-Tab assertion at `tests/site-smoke.spec.ts:98` only requires a nonempty tag name, not a correct focus target.
- Owning instructions/docs: root `AGENTS.md`, campaign `AGENTS.md`, `docs/brand-code.md`, `docs/analytics-dashboard.md`, `docs/smoke-kawaii-image-system.md`, relevant portions of `docs/recommended-agency-agents.md`. Installed code-review, browser-testing and Playwright skill guidance was read. Prior memory was used only for screenshot-to-task handoff structure, never as current product evidence.

## Actual Commands And Probe Record

All shell commands ran in the audit worktree unless they read an explicitly named installed skill/memory file. No full build/check, dependency install, deployment, indexing submission, purchase, commit, or new agent was run by this specialist.

1. `git status --short` initially returned only the campaign directory as untracked; `git rev-parse HEAD` returned the revision above.
2. `Get-Content AGENTS.md`; `Get-Content agents/project-review-2026-09-06/AGENTS.md`; `Get-Content` for the owning docs and modules listed above. Large CSS was read using `Get-Content src/styles/global.css | Select-Object -Skip <offset> -First <count>` around matching selectors.
3. `rg --files src scripts docs | rg "(Layout|Header|Nav|Footer|global|gallery|visual|accessibility|performance|analytics-dashboard|smoke-kawaii|brand-code)"`; focused `rg -n` searches for focus/outline/media selectors, hydration/art references, reveal handlers and QA assertions. A search using literal `vitest.config.*` returned a Windows glob-path error; no conclusion depends on that missing input.
4. `Test-Path dist/index.html` was false while coordinator build ran and true before local browser work. `node --input-type=module -e "import {chromium} from 'playwright'; console.log(await chromium.executablePath());"` confirmed the installed browser path without installing anything.
5. Live capture command was `node --input-type=module -e '<Playwright capture body>'`: launch Chromium, create isolated context, add analytics opt-out, restrict requests, visit `/tools/` for the four viewports, screenshot to `output/playwright/frontend-live-tools-<viewport>.png`, print overflow/search/header geometry, close browser. All four reported zero document overflow. The body was executed inline, not saved as a source file.
6. Fresh local matrix was a PowerShell here-string piped to `node --input-type=module` (exec session 78120, exit 0). It created a `node:http` static server rooted at `path.resolve('dist/client')` with `server.listen(0,'127.0.0.1')`, launched isolated Chromium, restricted requests to that origin, captured six routes at three sizes and extra article-body/gallery-art views, printed HTTP/DOM/image metrics, and closed browser/server. First-harness error caveat is recorded above.
7. Second here-string/Node probe (session 55727, exit 0) used the same ephemeral-server setup with guarded storage initialization; checked 320/1081/1100/1200 widths, then executed actual `page.keyboard.press('Tab')`, `'Enter'`, `'Control+k'`, theme selection and reveal sequences; printed active elements; ran `new AxeBuilder({page}).analyze()` for three tablet routes. Focus outputs and unresolved axe rules are quoted under the findings; page-error array was empty.
8. Third here-string/Node probe (exit 0) used that guarded setup for homepage/gallery-hub/calculator-category desktop/mobile captures on port 11430. Six HTTP 200 responses, zero overflow, empty page-error array.
9. `Get-ChildItem dist/client/_astro -Filter *.css | Select-Object Name,Length` measured the shared CSS at 174,488 bytes and the separate admin stylesheet at 4,686 bytes. No performance claim uses server timing from the unthrottled static harness.
10. Screenshots were inspected with `view_image` at absolute paths under this audit worktree. Evidence files use prefix `output/playwright/frontend-`; no screenshot was used as proof of a keyboard transition. `Get-ChildItem output/playwright -Filter frontend-*.png | Measure-Object` confirmed 37 captures. Final `git diff --stat` was empty, confirming no tracked product-file differences; the assigned report remains an untracked campaign artifact.

Probe bodies were deliberately kept in memory to comply with report-only source writes. The report records the setup, actual keyboard APIs, results and artifact paths; the terminal tool transcript contains the complete executed inline bodies. Repeat these targeted probes against a fresh build when implementing the tasks.

## Coordinator Evidence And Remaining Coverage

Coordinator-reported, not rerun by this specialist: 565 unit tests passed; article visual 7 articles x 4 sizes passed; key visual 15 pairs passed; accessibility 27 pairs passed; AI lazy check 665 non-AI pages plus 9 AI initial loads passed. The full check stopped at `security:audit`. This specialist has not diagnosed that security failure and does not claim an overall green full check.

Remaining: all ten theme contrast states and forced-colors/high-contrast mode; reduced-motion behavior in real interaction; 200/400% zoom and large system fonts; iOS Safari/Firefox/real touch devices; screen readers; long translated labels; slow/failed search-index keyboard recovery; full footer/consent focus behavior; every calculator and validation/result state; JSON/CSV/file tools, OCR/TTS/game working interactions; galleries beyond the sampled category; every editorial source/article hero; field performance/CWV and live advertising layouts. Local static serving did not test redirects or backend behavior. No claims about production analytics, abandonment, SEO impact, image-approval completeness, or cross-browser conformance are supported by this report.
