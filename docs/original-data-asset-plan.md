# Original Data Asset Plan

Last updated: 2026-07-13

Access Free Tools can eventually publish useful "what people are using" reports from anonymous first-party analytics. The point is not bragging. The point is to create helpful, original information competitors cannot copy: which free tools people actually use, what mistakes guides should explain better, and which categories need clearer pathways.

## Privacy First

Only use anonymous aggregate data.

Never publish:

- Raw event logs.
- IP addresses.
- Visitor hashes.
- Exact timestamps tied to one visitor.
- Contact form details.
- Search queries that could identify a person.

Owner traffic should be excluded with `AFT_ANALYTICS_EXCLUDE_IPS` or the browser opt-out before a public report is drafted. If owner exclusion is not confirmed, the report must stay internal.

## Monthly Report Shape

Working title: "Access Free Tools Usage Notes"

Sections:

1. What people used most this month.
2. Which tool categories got repeat use.
3. Which guides need clearer examples because the matching tools get used.
4. Which hubs need stronger internal links.
5. One practical lesson for visitors, such as "waste percent matters more than people expect."
6. What we will improve next.

Keep the tone plain and useful. Avoid fake growth claims, private numbers without context, or "we are popular" language.

## Readiness Rule

Do not publish a usage notes article until the data passes these minimums for the selected window:

- Owner exclusion is configured or clearly documented.
- At least 25 unique anonymous visitors.
- At least 100 page views.
- At least 25 tool actions.
- No obvious bot-only spike dominates the report.

The local readiness command is:

```powershell
npm run aft -- usage-notes
```

It writes a private draft and evidence under `output/original-data-assets/`. The output is not automatically public content.

Current status: `not-ready`. Local event files contain QA activity and are not production business evidence. This workspace does not currently have the ignored private analytics token needed by `npm run analytics:production`, so production visitor, page-view, and action thresholds cannot be assessed yet. Report this as `not enough data`; do not substitute local counts.

## How Agents Should Use It

- Use `npm run analytics:production` for production decisions. Treat `npm run aft -- usage-summary` as local QA diagnostics only.
- Use `npm run aft -- usage-notes` before proposing a public data asset.
- Use the report to improve internal links, guides, and promotion priorities.
- Do not turn anonymous usage into a public claim unless the readiness rule passes.
- Do not compare Access Free Tools to competitors using weak or private analytics.

## Good Public Angles

- "The free tools people actually came back to this month."
- "The calculator mistakes our guide pages should explain better."
- "Why wallpaper waste percent keeps showing up in real use."
- "Which browser AI helpers people try first, and what we improved because of it."

## Bad Public Angles

- "We are the biggest tool site."
- "These tools are guaranteed to rank."
- "Thousands of people use this" unless the data clearly proves it.
- Anything that exposes private behavior or makes the analytics sound more exact than it is.
