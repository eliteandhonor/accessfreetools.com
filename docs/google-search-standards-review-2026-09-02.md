# Google Search Standards Review: September 2, 2026

## Decision

Implement Google's official Preferred Sources control on every indexable Access
Free Tools blog article. Keep it off tool pages, hubs, categories, and noindex
beta articles. Also replace the Search-facing SVG-only favicon with PNG because
Google's August 28 documentation no longer lists SVG as a supported Search
favicon format.

The supplied YouTube video describes Preferred Sources as a new ranking signal.
That is too broad for public Access Free Tools copy. Google's documentation says
a selected source is more likely to appear for that user in Top Stories and may
be highlighted for that user in AI Overviews and AI Mode. It does not promise a
sitewide or universal ranking increase.

## Implemented In This Change

- One shared Preferred Sources section after every indexable blog article.
- Google's recommended automatically localized JavaScript button.
- Google's documented domain deeplink as a durable settings fallback.
- `data-nosnippet` on repeated callout copy so it cannot replace article-specific
  search snippets.
- Article-only loading of Google's publisher script.
- No control or script on the blog index, tools, categories, privacy page, or
  noindex beta article.
- A 512x512 PNG favicon and PNG Organization publisher logo.
- Privacy disclosure for the third-party Google button request.
- Static and visual regression checks in the full quality gate.

## Current Standards Compared With The Site

| Google update | Access Free Tools state | Decision |
| --- | --- | --- |
| Preferred Sources, August 20 | Newly implemented on indexable articles | Ship after normal release approval and live verification |
| Supported favicon formats, August 28 | SVG-only before this change | Fixed with stable PNG |
| AI Overviews and AI Mode | No special schema or file is required | Keep normal indexability, snippets, links, and people-first content |
| `llms.txt`, June 15 | Site maintains short and full LLM indexes | Keep for other systems; make no Google visibility claim |
| FAQ rich result removed, June 15 | Visible FAQs remain; QA rejects `FAQPage` JSON-LD | Keep current policy |
| Preferred image metadata, March 2 | Article schema and `og:image` use page-specific hero images | Keep both values aligned and run image QA |
| "Read more" deep links, April 20 | Article content is visible and page load does not erase URL fragments | No structural rewrite needed |
| Third-party SEO guidance, June 5 | Search Console is primary; OpenSEO and DataForSEO are supporting evidence | Keep this evidence hierarchy |
| Social platform properties, July 29 | Active channels are Medium, Bluesky, and Pinterest | No property action; Google's guide currently lists TikTok, Instagram, X, and YouTube |
| Googlebot 2 MB fetch limit, February 3 | Largest built blog HTML is far below 2 MB | No action |
| AMP update, July 1 | One responsive canonical URL per page | Continue without AMP |
| Discover core update, February 5 | Owner-led articles use original tests and practical experience | Keep topic depth and avoid clickbait volume |

## Next Recommendations

### P1: Release And Verify Preferred Sources

After the normal deployment approval, open one live editorial article and one
live calculator guide. Confirm the Google control renders, opens the signed-in
source preference flow for `accessfreetools.com`, and returns to the article.
The source preference tool requires a signed-in Google account, so local build
proof cannot confirm the final account-specific selection.

### P1: Keep AI Search Claims Measurable

If the dedicated Search Generative AI performance report appears in this
property, export and normalize it separately. The initial Google report provides
impressions, pages, countries, devices, and dates. Do not infer clicks, rankings,
or conversions from those impressions.

### P2: Protect Article Image Consistency

Extend image QA later to compare `BlogPosting.image`, `og:image`, and the visible
hero image for every editorial article. Existing layouts already align these
values, so this is a guardrail rather than a content rewrite.

### P2: Continue Topic-By-Topic Editorial Depth

Google's February Discover update favors detailed, original, timely work from
sites with topic-specific expertise and reduces clickbait. Continue Brendan-led
articles that contain actual tests, observed results, source links, limits, and
links to the relevant working tool. Do not increase publishing volume merely to
target AI search.

### Not Recommended

- No special AI schema, `llms.txt` ranking claims, or invented AEO/GEO markup.
- No AMP rollout or separate mobile URLs.
- No restored `FAQPage`, `HowTo`, fake review, or rating schema.
- No claim that Preferred Sources guarantees ranking or AI citation.
- No Search Console social properties for unsupported platforms.

## Official Sources

- https://developers.google.com/search/docs/appearance/preferred-sources
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/updates
- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/fundamentals/third-party-seo
- https://developers.google.com/search/docs/monitor-debug/analyze-social-video-content
- https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- https://developers.google.com/search/blog/2026/02/discover-core-update
- https://developers.google.com/search/docs/crawling-indexing/googlebot
