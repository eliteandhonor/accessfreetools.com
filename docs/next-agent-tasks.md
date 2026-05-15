# Access Free Tools Next Agent Tasks

Generated: 2026-05-15

This is the current task board for Codex/agent work. Use it after `npm run aft -- status` and before starting new feature work.

## Evidence Snapshot

- `npm run aft -- status`: DataForSEO live balance 37.07 USD, Hostinger OK, 67 promotion rows, 1 approved, 0 RSS-connected, 0 unverified.
- `npm run aft -- indexing-gaps`: 1 gap remains.
- `npm run aft -- seo-console`: pass, with Wallpaper Calculator as the high-priority discovery action.
- `npm run aft -- link-helper`: pass, 10 suggestions, top suggestion is `/tools/wallpaper-calculator/`.
- `npm run aft -- api-ready`: pass, 20 API-ready tools, next low-risk candidates listed.
- `npm run aft -- ask-audit`: pass, 4 cases, 0 issues, 0 warnings.

## Task 1: Fix The Remaining Indexing Gap

Priority: High

Target:

- `https://accessfreetools.com/tools/wallpaper-calculator/`

Work:

- Add or verify contextual internal links to the Wallpaper Calculator from related home-project pages, the Home & Projects category, relevant blog guides, and any guide where wallpaper/room-planning makes natural sense.
- Make sure anchor text is human and specific, such as "estimate wallpaper rolls" or "plan wallpaper waste percent."
- Re-run `npm run aft -- link-helper` and `npm run aft -- indexing-gaps`.
- After deploy, run the Search Console discovery/inspection flow when OAuth is available.

Definition of done:

- Wallpaper Calculator no longer appears as an internal-link helper high-priority issue.
- The page has at least 3 natural contextual internal links from related pages.
- Search Console task is queued or completed with proof.

## Task 2: Strengthen Wallpaper Calculator Content

Priority: High

Work:

- Re-check the tool page, FAQ, and blog guide for the exact inputs users struggle with: waste percent, roll width, roll length, pattern repeat, windows/doors, wall height, and room perimeter.
- Add clearer examples if the page still feels thin.
- Explain when the estimate is useful and when users should check the wallpaper label or installer guidance.

Definition of done:

- FAQ includes plain-language detail for waste percent and pattern repeat.
- Blog guide uses a realistic room example and links to the live tool.
- `npm run aft -- content-score <file>` or the matching content quality command passes when applicable.

## Task 3: Expand API-Ready Tools From 20 To 25

Priority: Medium

Current recommended candidates from `npm run aft -- api-ready`:

- Circle Calculator
- Confidence Interval Calculator
- Distance Calculator
- Exponent Calculator
- Factor Calculator

Work:

- Add deterministic runners only if formulas are already clear and testable.
- Add schema examples, warnings, steps, tool URL, and guide URL.
- Add unit/API parity tests.
- Re-run `npm run aft -- api-ready`, `npm run aft -- ask-audit`, and `npm run check:live-ask` after deployment.

Definition of done:

- API registry count reaches 25.
- Ask/API/MCP parity stays green.
- No model answer can override deterministic tool results.

## Task 4: Make Ask Answers More User-Friendly

Priority: Medium

Work:

- Improve formatting for time, money, percentages, and units in Ask answers.
- Keep results grounded in the deterministic runner output.
- Add more Ask audit cases for any new API-ready tools.

Definition of done:

- Download-time style answers show human time first, not long decimal minutes.
- Every Ask response shows tool used, answer, steps, assumptions, warnings, and link.
- `npm run aft -- ask-audit` passes with expanded cases.

## Task 5: Promotion Queue Follow-Up

Priority: Medium

Current state:

- 1 approved promotion item.
- 0 RSS-connected and 0 unverified rows.

Work:

- Prepare the approved Quora item only if it is genuinely useful and matches the question or Space topic.
- Use the brand code and platform quality gate before posting.
- Do not mark anything complete without a live public URL or screenshot proof.

Definition of done:

- `npm run aft -- proof-check` stays clean.
- Promotion queue is updated only with proof.

## Task 6: Original Data Asset Readiness

Priority: Low until more real tool-use data exists

Current analytics note:

- 475 all-time visitors, 530 page views, 1 recorded tool use.

Work:

- Do not publish "what people use" reports yet because the data is too small.
- Improve tracking proof so tool-use events are recorded reliably.
- Revisit once there are enough real tool actions to make the report useful.

Definition of done:

- Tool-use tracking is verified on live calculator interactions.
- Any public data report clearly says what the data includes and excludes.

## Task 7: Deploy Proof Habit

Priority: Always

Work:

- Use `npm run hostinger:deploy-node` after API, Ask, MCP, or admin route changes.
- Confirm the latest Hostinger build has `entry=app.js`.
- Run `npm run check:live-ask`.
- Refresh `/admin/agent-tools/` reports and confirm all report cards are readable.

Definition of done:

- `/api/v1/tools`, `/api/openapi.json`, `/mcp`, and `/admin/agent-tools/` return live Node responses after deployment.
- No static fallback is accepted for API/MCP/Admin report routes.
