# SERPForge Deep Audit Evidence

Source PDF: `agents/serpforge-ai/evidence/SEO_Audit_Report_accessfreetools-2026-05-25.pdf`
Extracted text: `agents/serpforge-ai/evidence/SEO_Audit_Report_accessfreetools-2026-05-25.txt`

## Status Ledger

- Findings: 20
- Confirmed: 5
- Already fixed: 2
- Needs proof: 12
- Rejected stale: 1

## Findings

| priority | status | owner | id | task | proof |
| --- | --- | --- | --- | --- | --- |
| P0 | confirmed | Technical Headers Agent | hsts-missing | Add or configure production HSTS after checking Hostinger/CDN ownership, then verify the live header. | technical-header-plan plus live HEAD response. |
| P0 | confirmed | Technical Headers Agent | cache-max-age-zero | Plan CDN/static cache rules for built assets and HTML without breaking tool freshness. | technical-header-plan and production header sample. |
| P0 | confirmed | Technical Headers Agent | trailing-slash-no-redirect | Add or configure trailing-slash 301 behavior only after checking Astro, Hostinger, and sitemap canonicals. | technical-header-plan and redirect probe for /tools. |
| P0 | already-fixed | Crawl And Indexation Agent | sitemap-index-submitted | Keep submitting and verifying the canonical sitemap set through the existing GSC flow. | gsc-submit-sitemaps and check:production-sitemap. |
| P0 | needs-proof | Crawl And Indexation Agent | gsc-url-examples | Use Search Console exports and URL Inspection before assigning exact URL fixes. | npm run search-console:inspect-key-urls and npm run aft -- seo-console. |
| P1 | needs-proof | Metadata And Heading Agent | short-titles | Use sitewide page rows to list exact short titles, then rewrite only page-specific snippets in smart 14-year-old voice. | heading-metadata-plan and sitewide-seo-audit. |
| P1 | needs-proof | Metadata And Heading Agent | meta-description-length | Generate a URL-by-URL metadata repair queue from built HTML, not generic category advice. | heading-metadata-plan and all-pages-human-tone-report. |
| P1 | needs-proof | Metadata And Heading Agent | blog-listing-h2-overload | Verify heading counts in built HTML and plan a listing card heading hierarchy that is better for scanning. | heading-metadata-plan. |
| P1 | needs-proof | Metadata And Heading Agent | tool-h3-depth | Add H3s only when they help examples, mistakes, formulas, or result interpretation. | page SEO workbench for each edited tool/blog page. |
| P1 | needs-proof | Content Depth Agent | content-depth-hubs-about-password | Use GSC/DataForSEO evidence to prioritize expansion, then write practical examples and honest limits. | content-depth-plan, semantic-depth, hub-strength. |
| P1 | needs-proof | E-E-A-T Trust Agent | ymyl-trust-blocks | Plan reusable trust blocks and schema without overclaiming medical, legal, tax, or safety advice. | eeat-author-plan and structured-data check. |
| P1 | needs-proof | Image And Listing UX Agent | listing-images | Plan specific images for homepage, tools, blog, category, and gallery listings without exposing queued or failed-QA art. | image-alt-audit, gallery:qa, images:sitemap-check. |
| P1 | already-fixed | Image And Listing UX Agent | image-dimensions | Keep this under QA and only reopen if a built-page check finds missing dimensions. | images:qa and images:sitemap-check. |
| P1 | needs-proof | Image And Listing UX Agent | alt-text-specificity | Audit approved tool art and rewrite alt/caption metadata around tool purpose, inputs, outputs, formulas, examples, and guide context. | image-alt-audit and image-alt-plan. |
| P2 | needs-proof | Internal Link And Anchor Agent | anchor-repetition | Use the link helper before editing anchors so useful reader paths stay above raw SEO anchor variation. | npm run aft -- link-helper. |
| P2 | rejected-stale | Authority And Outreach Agent | homepage-external-links | Reject as a generic/stale recommendation unless a specific reader-useful citation or partner proof exists. | authority-plan. |
| P1 | needs-proof | Social Discovery Agent | zero-social-presence | Verify current public profile URLs and queue only quality-gated drafts; do not post without approval. | social-discovery-plan and npm run aft -- proof-check. |
| P1 | needs-proof | Authority And Outreach Agent | directory-outreach | Prepare targets and drafts only; no submissions, messages, ads, or backlink claims without approval and public proof. | authority-plan. |
| P0 | confirmed | DataForSEO Market Agent | dataforseo-market-layer | Use Labs, live SERP, and OnPage only; tier depth and stop_crawl_on_match; never use Backlinks API. | dataforseo-plan, all-pages-dataforseo, all-pages-serp-audit, dataforseo-sitewide-audit. |
| P0 | confirmed | Audit Sprint Judge | no-fake-done-claims | Block done until build, local SEO, DataForSEO, GSC/Search Console, and human-tone gates pass. | deep-audit-sprint and all-pages-human-tone-report. |

## Extracted Text Preview

```text
--- PAGE 1 ---
COMPREHENSIVE SEO AUDIT
accessfree
tools.com
A detailed technical, on-page, and off-page SEO
analysis of accessfreetools.com with actionable
recommendations for improving search visibility and
organic traffic.
Prepared by: Z.ai
Date: May 25, 2026
Version: 1.0
CONFIDENTIAL
--- PAGE 2 ---
Table of Contents
1. Executive Summary 3
2. Technical SEO Analysis 4
2.1 HTTPS and SSL Configuration . . . . . . . . . . . . . . . . . . . . . . . 4
2.2 Robots.txt and Crawl Directives . . . . . . . . . . . . . . . . . . . . . . 4
2.3 Canonical Tags and URL Canonicalization . . . . . . . . . . . . . . . . 5
2.4 Structured Data and Schema.org . . . . . . . . . . . . . . . . . . . . . 5
2.5 Page Speed and Core Web Vitals . . . . . . . . . . . . . . . . . . . . . 6
2.6 Error Handling and Redirects . . . . . . . . . . . . . . . . . . . . . . . 7
3. On-Page SEO Analysis 7
3.1 Title Tags . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
3.2 Meta Descriptions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
3.3 Heading Structure . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
3.4 Content Quality and Depth . . . . . . . . . . . . . . . . . . . . . . . . . 9
3.5 Image Optimization . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
3.6 Internal Linking . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
3.7 URL Structure . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
4. Sitemap Analysis 11
5. Off-Page SEO and Domain Authority 12
5.1 Domain Information . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
--- PAGE 3 ---
5.2 Backlink Profile . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
5.3 Social Signals and Brand Presence . . . . . . . . . . . . . . . . . . . . 12
5.4 Competitive Landscape . . . . . . . . . . . . . . . . . . . . . . . . . . 13
6. E-E-A-T Assessment 13
7. Priority Recommendations 14
7.1 High Priority (First 30 Days) . . . . . . . . . . . . . . . . . . . . . . . 14
7.2 Medium Priority (60-90 Days) . . . . . . . . . . . . . . . . . . . . . . 15
7.3 Low Priority (Ongoing Optimization) . . . . . . . . . . . . . . . . . . . 16
8. Strategic SEO Roadmap 16
8.1 Phase 1: Foundation (Months 1-2) . . . . . . . . . . . . . . . . . . . . 16
8.2 Phase 2: Growth (Months 3-6) . . . . . . . . . . . . . . . . . . . . . . 17
8.3 Phase 3: Authority (Months 6-12) . . . . . . . . . . . . . . . . . . . . 17
--- PAGE 4 ---
1. Executive Summary
This comprehensive SEO audit evaluates accessfreetools.com, a free online
calculator and utility website built with the Astro framework. The site offers 303+
free tools, 299+ matching guides, and 12 content categories spanning finance, health,
math, conversions, and browser AI tools. The audit was conducted on May 25, 2026,
analyzing technical SEO infrastructure, on-page optimization, content quality,
sitemap coverage, and off-page authority signals.
The website demonstrates a strong technical SEO foundation, with excellent
structured data implementation, clean URL architecture, proper canonical tags,
comprehensive Open Graph and Twitter Card metadata, and a lightweight
Astro-powered build that minimizes JavaScript overhead. However, the site faces
significant challenges in off-page SEO, with virtually no backlink profile, zero social
media presence, and a young domain age competing against established 20-year-old
competitors in a highly saturated niche. The strategic priority should be off-page
authority building, which accounts for 70% of the recommended effort, followed by
content expansion at 20% and technical refinement at 10%.
Category Score Status Key Finding
Astro SSG, proper schema, clean URLs,
Technical SEO 8.5/10 Strong
HTTPS
Titles, headings, internal links
On-Page SEO 7.2/10 Good
well-optimized
Content Quality 6.5/10 Fair Good tool pages; some thin content areas
1,301 URLs across 8 sitemaps, all
Sitemap Coverage 8.0/10 Good
successful
Zero backlinks, no social presence, new
Off-Page Authority 1.5/10 Critical
domain
Lightweight build but no caching, no
Page Performance 6.0/10 Mixed
preload hints
E-E-A-T Signals 5.0/10 Weak No author bylines, no expert credentials
Table 1: Overall SEO Scorecard Summary
Overall SEO Health Score: 6.1/10 - The site has a solid technical foundation but
critically lacks off-page authority. Without building backlinks and social signals, the
site will struggle to rank for competitive keywords in the calculator/tools niche.
--- PAGE 5 ---
2. Technical SEO Analysis
2.1 HTTPS and SSL Configuration
The website correctly serves all traffic over HTTPS with a valid SSL certificate. HTTP
requests are properly redirected to HTTPS using 301 (Permanent) redirects, which is
the correct redirect type for SEO as it passes full link equity to the destination URL.
The site also includes a Content-Security-Policy header with the
upgrade-insecure-requests directive, ensuring that any mixed content references are
automatically upgraded to HTTPS.
However, the site is missing the Strict-Transport-Security (HSTS) header, which
instructs browsers to always use HTTPS for future requests to the domain. Without
HSTS, users who manually type "http://" or follow an insecure link are vulnerable to
SSL stripping attacks on their first request. Adding HSTS is a relatively simple server
configuration change that significantly improves security and is recommended by
Google as a best practice for all HTTPS websites.
Check Result Status
HTTPS accessible Yes - valid SSL certificate Pass
HTTP to HTTPS redirect 301 Permanent redirect Pass
WWW to non-WWW redirect 301 Permanent redirect Pass
Content-Security-Policy upgrade-insecure-requests present Pass
HSTS header Not present Fail
X-Content-Type-Options nosniff present Pass
X-Frame-Options SAMEORIGIN present Pass
Referrer-Policy strict-origin-when-cross-origin Pass
Table 2: HTTPS and Security Headers Assessment
2.2 Robots.txt and Crawl Directives
The robots.txt file is accessible and functional, using a permissive crawl policy that
allows all user-agents to access the entire site. The sitemap index is properly
referenced with the full URL. However, the robots.txt is notably minimal - it lacks
Disallow directives for administrative paths, API endpoints, or other sensitive areas
that should not be crawled. While the site appears to handle these at the application
level, adding explicit Disallow rules provides defense-in-depth and prevents crawlers
from wasting crawl budget on non-content URLs.
--- PAGE 6 ---
The current robots.txt content is: User-agent: * | Allow: / | Sitemap:
https://accessfreetools.com/sitemap.xml. It is recommended to add Disallow directives
for paths such as /admin/, /api/, and any internal utility pages that do not provide SEO
value. This ensures that search engine crawlers focus their limited crawl budget on
the pages that matter most for search visibility.
2.3 Canonical Tags and URL Canonicalization
Canonical tags are properly implemented across all pages analyzed, consistently
pointing to the preferred HTTPS non-WWW version with trailing slashes. The
canonical URL matches the actual page URL on the canonical version of each page,
which is the correct self-referencing canonical implementation recommended by
Google. On non-trailing-slash URLs, the canonical tag correctly points to the
trailing-slash version, preventing duplicate content indexing.
However, there is a trailing slash inconsistency issue: both the trailing-slash and
non-trailing-slash versions of URLs return HTTP 200 status codes with identical
content. While the canonical tag resolves the duplicate content signal, Google has
stated that 301 redirects are the preferred method for URL consolidation. Without
redirects, the site relies solely on canonical tags, which are treated as hints rather
than directives. Implementing 301 redirects from non-trailing-slash to trailing-slash
URLs would strengthen the consolidation signal and ensure all link equity is properly
attributed to the canonical URL.
2.4 Structured Data and Schema.org
The website features comprehensive and well-implemented structured data
using JSON-LD format, which is Google's recommended method for adding structured
data. The implementation uses the proper @graph pattern with @id cross-references,
ensuring that schema entities are properly linked and deduplicated. This is one of the
strongest technical SEO aspects of the site.
The homepage includes Organization and WebSite schemas with a SearchAction that
enables the Google sitelinks search box, a valuable rich result feature. Tool pages
feature WebApplication, FAQPage, and BreadcrumbList schemas, making them
eligible for rich results including FAQ expandable snippets in search results. Blog
posts include Article and BreadcrumbList schemas, while category pages use
CollectionPage and BreadcrumbList schemas. The About and Contact pages also have
their respective schema types (AboutPage and ContactPage), demonstrating thorough
attention to structured data coverage across all page types.
Rich Result
Page Type Schema Types
Eligible
Homepage Organization + WebSite (SearchAction) Yes
--- PAGE 7 ---
WebApplication + FAQPage +
Tool Pages Yes
BreadcrumbList
Blog Posts Article + BreadcrumbList Yes
Category Pages CollectionPage + BreadcrumbList Partial
About Page AboutPage No
Contact Page ContactPage No
Table 3: Structured Data Implementation by Page Type
2.5 Page Speed and Core Web Vitals
The Astro framework provides an excellent foundation for page performance,
generating minimal JavaScript and leveraging static site generation for fast initial
page loads. The homepage loads approximately 40.7 KB of raw HTML with only one
external CSS file and two lazily-hydrated Astro island components. There are no
external font requests, as the site uses system fonts, eliminating font-loading
performance penalties entirely. The homepage contains zero traditional image tags,
using inline SVGs instead, which eliminates image download overhead.
Despite these strengths, several performance optimization opportunities exist. The
CSS file is render-blocking without a preload hint, and no resource preloading,
preconnecting, or prefetching is implemented. Most critically, the cache-control
header is set to "public, max-age=0", meaning repeat visits receive no browser cache
benefit, and the CDN marks all pages as DYNAMIC, indicating they are not being
edge-cached. This is particularly wasteful for a static site where content rarely
changes. Images on tool pages are not lazy-loaded, and no images have explicit width
and height attributes, which could cause Cumulative Layout Shift (CLS) during page
loading.
Metric Value Assessment
Raw HTML size ~40.7 KB Excellent
External CSS files 1 file Excellent
External JS files 0 (Astro islands lazy-loaded) Excellent
External fonts 0 (system fonts) Excellent
Image lazy loading Not implemented Poor
Resource preload hints None Poor
Cache headers max-age=0, CDN DYNAMIC Poor
Critical CSS inlined No Fair
--- PAGE 8 ---
Image dimensions set No Poor
Table 4: Page Performance Indicators
2.6 Error Handling and Redirects
The 404 error page returns the correct HTTP 404 status code, which is essential for
preventing search engines from indexing non-existent pages. The page displays a
clean, branded message with the status code and requested path. However, the 404
page is minimal in terms of user experience - it lacks navigation links to help users
find what they were looking for, a search box to locate content, or suggestions for
popular tools. The 404 page also appears to be missing the viewport meta tag, which
could cause mobile display issues.
Redirect handling is generally correct, with proper 301 redirects from HTTP to
HTTPS and from WWW to non-WWW. The primary concern is the trailing slash
duplication mentioned
```
