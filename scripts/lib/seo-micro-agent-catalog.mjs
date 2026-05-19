const rawCatalog = `
Page targeting agents
Search Intent Classifier Agent|classify the page's target query intent only
Primary Keyword Mapper Agent|assign one primary keyword to one page only
Secondary Keyword Collector Agent|collect supporting keywords only
Query Variation Agent|collect natural keyword variations only
Entity Extractor Agent|list important people, places, products, brands, concepts, and terms only
Topic Cluster Mapper Agent|assign the page to one topic cluster only
Page Type Classifier Agent|decide the page type only
SERP Intent Checker Agent|compare the page type against current ranking page types only
Cannibalization Checker Agent|find other pages targeting the same keyword only
Search Demand Validator Agent|confirm whether the keyword has enough demand only
Audience Need Agent|define the user problem the page must solve only
Competitor Angle Agent|identify the main angle used by ranking competitors only
Content Gap Agent|find missing subtopics only
SERP Feature Opportunity Agent|identify snippet, image, video, review, product, FAQ, local pack, or rich-result opportunities only
Page Priority Agent|decide whether the page deserves SEO work now only

Content planning agents
Content Brief Agent|create the SEO brief only
Outline Agent|create the page outline only
Heading Plan Agent|plan H2 and H3 headings only
Section Order Agent|arrange sections in the best order only
Search Intent Coverage Agent|check whether the outline satisfies the search intent only
Subtopic Coverage Agent|check whether all necessary subtopics are included only
Question Coverage Agent|map user questions to sections only
Content Depth Agent|decide whether the page is too shallow only
Content Scope Agent|decide whether the page is too broad only
Unique Value Agent|identify what the page adds that competitors do not only
First-Hand Experience Agent|add or check first-hand experience signals only
Expert Input Agent|identify where expert input is needed only
Source Requirement Agent|identify claims that need sources only
Page Purpose Agent|define the page's single business and SEO purpose only
Content Consolidation Agent|decide whether this page should be merged with another page only

Content writing agents
H1 Writer Agent|write or improve the H1 only
Intro Writer Agent|write the opening section only
Definition Block Agent|write a clear definition block only
Direct Answer Agent|write a concise direct answer only
Section Writer Agent|write one assigned section only
FAQ Answer Agent|write one FAQ answer only
Comparison Copy Agent|write comparison copy only
Pros and Cons Agent|create pros and cons only
Step-by-Step Agent|format process steps only
Example Agent|add practical examples only
Use Case Agent|add use cases only
Benefit Explanation Agent|explain benefits only
Feature Explanation Agent|explain features only
Objection Handling Agent|answer likely objections only
CTA Copy Agent|write the call to action only
Conclusion Agent|write the conclusion only
Summary Box Agent|create a short summary box only
Table Builder Agent|turn suitable content into a table only
Bullet List Agent|turn dense copy into bullet lists only
Glossary Agent|define important terms only

Content quality agents
Readability Agent|improve reading ease only
Sentence Length Agent|shorten long sentences only
Paragraph Length Agent|break up long paragraphs only
Scannability Agent|make the page easier to skim only
Plain English Agent|simplify complex language only
Tone Agent|match the brand tone only
Grammar Agent|fix grammar only
Spelling Agent|fix spelling only
Duplicate Content Agent|detect duplicate content only
Thin Content Agent|detect pages with too little useful content only
Keyword Stuffing Agent|detect overuse of keywords only
Semantic Relevance Agent|check whether the content stays on topic only
Helpful Content Agent|check whether the content is useful to humans only
Originality Agent|check whether the page adds original value only
Factual Accuracy Agent|verify factual claims only
Source Quality Agent|check whether cited sources are trustworthy only
Freshness Agent|check whether facts, dates, stats, and examples are current only
Outdated Content Agent|flag obsolete sections only
Content Expansion Agent|suggest missing content only
Content Pruning Agent|suggest unnecessary content to remove only
YMYL Risk Agent|flag legal, medical, financial, or safety-risk claims only
Compliance Agent|check regulated wording only
Bias Agent|check for misleading or unfair claims only
AI Content Quality Agent|check AI-written content for generic, low-value writing only

Title, meta, and SERP appearance agents
Title Tag Writer Agent|write the title tag only
Title Tag Length Agent|check title length only
Title Uniqueness Agent|check title duplication only
Title-H1 Alignment Agent|check title and H1 alignment only
Meta Description Writer Agent|write the meta description only
Meta Description Length Agent|check meta description length only
Meta Description Uniqueness Agent|check duplicate meta descriptions only
Snippet Preview Agent|preview how the page may appear in search only
Snippet Relevance Agent|check whether the page has good snippet-worthy text only
Featured Snippet Formatting Agent|format one answer for featured-snippet suitability only
URL Slug Agent|optimize the URL slug only
Breadcrumb Text Agent|optimize breadcrumb labels only
Date Display Agent|check visible published or updated dates only
Author Display Agent|check visible author information only
Meta Robots Agent|check index, noindex, follow, nofollow, noarchive, nosnippet, and max-snippet rules only
Canonical Tag Agent|check the canonical tag only
Open Graph Title Agent|write the social sharing title only
Open Graph Description Agent|write the social sharing description only
Open Graph Image Agent|select the social sharing image only
Twitter/X Card Agent|check Twitter/X card metadata only

Heading and HTML structure agents
Heading Hierarchy Agent|check H1-H6 order only
Single H1 Agent|check whether the page has one clear H1 only
Semantic HTML Agent|check semantic tags only
HTML Language Agent|check the page language attribute only
Viewport Meta Agent|check mobile viewport setup only
Rendered Content Agent|check whether important content appears in rendered HTML only
Hidden Content Agent|check whether important SEO content is hidden or inaccessible only
DOM Order Agent|check whether main content appears logically in the DOM only
JavaScript Rendering Agent|check whether JavaScript prevents content from being seen only
Accordion Content Agent|check expandable content visibility only
Pagination Markup Agent|check paginated page signals only
HTML Validation Agent|find broken HTML that affects SEO only
Accessibility Landmark Agent|check page landmarks only
Main Content Detection Agent|check whether the main content is clear only

Indexability and crawlability agents
Indexability Agent|check whether the page can be indexed only
Crawlability Agent|check whether search engines can crawl the page only
Status Code Agent|check the page's HTTP status code only
Redirect Agent|check redirect chains for the page only
Soft 404 Agent|check whether the page looks like a soft 404 only
Robots.txt Conflict Agent|check whether robots.txt blocks the page only
Noindex Conflict Agent|check whether noindex is used accidentally only
Canonical Conflict Agent|check whether canonical tags conflict with indexability only
Parameter URL Agent|check duplicate parameter URLs only
Trailing Slash Agent|check URL version consistency only
HTTP Header Agent|check SEO-relevant HTTP headers only
Mobile Indexing Agent|check whether mobile-rendered content matches desktop content only

Internal linking agents
Internal Link Opportunity Agent|find places to add internal links only
Anchor Text Agent|optimize internal anchor text only
Contextual Link Agent|add relevant in-body links only
Broken Internal Link Agent|find broken internal links only
Orphan Page Agent|find pages with no internal links only
Breadcrumb Link Agent|check breadcrumb links only
Related Content Agent|suggest related articles or pages only
Related Product Agent|suggest related products only
Navigation Inclusion Agent|decide whether the page should be in navigation only
Footer Link Agent|check footer link relevance only
Link Depth Agent|check how many clicks the page is from the homepage only
Crawlable Link Agent|check whether links use crawlable HTML links only
Outbound Link Agent|check outbound link quality only
Affiliate Link Attribute Agent|check sponsored, ugc, or nofollow attributes only
Citation Link Agent|check source links only
Broken External Link Agent|find broken outbound links only

Structured data agents
Schema Eligibility Agent|decide which schema type fits the page only
JSON-LD Generator Agent|generate JSON-LD only
Schema Validator Agent|validate structured data only
Schema Error Fixer Agent|fix schema errors only
Schema Warning Fixer Agent|fix schema warnings only
Schema-to-Content Match Agent|ensure schema matches visible content only
Breadcrumb Schema Agent|create BreadcrumbList schema only
Article Schema Agent|create Article schema only
BlogPosting Schema Agent|create BlogPosting schema only
NewsArticle Schema Agent|create NewsArticle schema only
Product Schema Agent|create Product schema only
Product Variant Schema Agent|create product variant schema only
Merchant Listing Schema Agent|create merchant listing schema only
Review Snippet Schema Agent|create review snippet schema only
Aggregate Rating Schema Agent|create aggregate rating schema only
LocalBusiness Schema Agent|create LocalBusiness schema only
Organization Schema Agent|create Organization schema only
Person Schema Agent|create Person or author schema only
Event Schema Agent|create Event schema only
Recipe Schema Agent|create Recipe schema only
Course Schema Agent|create Course schema only
JobPosting Schema Agent|create JobPosting schema only
Software App Schema Agent|create SoftwareApplication schema only
Dataset Schema Agent|create Dataset schema only
Video Schema Agent|create VideoObject markup only
Image Metadata Schema Agent|create image metadata only
FAQ Schema Agent|create FAQ schema only when appropriate
Q&A Schema Agent|create QAPage schema only
Discussion Forum Schema Agent|create discussion forum schema only
Profile Page Schema Agent|create profile page schema only
Fact Check Schema Agent|create ClaimReview schema only
Book Action Schema Agent|create book action schema only
Movie Carousel Schema Agent|create movie carousel schema only
Vacation Rental Schema Agent|create vacation rental schema only
Paywalled Content Schema Agent|mark paywalled content only
Shipping Policy Schema Agent|mark shipping policy only
Return Policy Schema Agent|mark return policy only
Loyalty Program Schema Agent|mark loyalty program details only

Image SEO agents
Image Relevance Agent|check whether images support the page topic only
Image Filename Agent|optimize image filenames only
Alt Text Agent|write image alt text only
Decorative Image Agent|identify images that should have empty alt text only
Image Caption Agent|write image captions only
Image Compression Agent|reduce image file size only
Image Format Agent|choose WebP, AVIF, PNG, JPG, or SVG only
Image Dimension Agent|set width and height attributes only
Responsive Image Agent|create srcset and sizes attributes only
Lazy Loading Image Agent|set image lazy loading only
Hero Image Agent|optimize the main image only
Image Indexability Agent|check whether images can be crawled only
Image Structured Data Agent|connect images to schema only
Image Sitemap Agent|decide whether images need sitemap inclusion only
Open Graph Image Agent|select the sharing image only
Image Accessibility Agent|check image accessibility only

Video and audio SEO agents
Video Placement Agent|check whether the video is placed prominently only
Video Title Agent|write the video title only
Video Description Agent|write the video description only
Video Transcript Agent|create the transcript only
Video Caption Agent|create captions only
Video Thumbnail Agent|optimize the thumbnail only
Video Schema Agent|create VideoObject markup only
Video Embed Performance Agent|optimize video embed loading only
Video Indexability Agent|check whether the video can be indexed only
Audio Transcript Agent|create transcript text for audio only
Podcast Episode Metadata Agent|optimize podcast episode metadata only

Core Web Vitals and page experience agents
LCP Detection Agent|identify the LCP element only
LCP Optimization Agent|improve LCP only
INP Detection Agent|identify poor interactions only
INP Optimization Agent|improve interaction responsiveness only
CLS Detection Agent|identify layout shifts only
CLS Optimization Agent|reduce layout shift only
Render-Blocking Resource Agent|identify render-blocking CSS or JS only
Critical CSS Agent|optimize critical CSS only
Font Loading Agent|optimize font loading only
Third-Party Script Agent|audit third-party scripts only
Lazy Loading Agent|configure lazy loading only
Above-the-Fold Agent|optimize visible first-screen content only
Mobile Layout Agent|check mobile layout only
Tap Target Agent|check mobile tap targets only
Intrusive Interstitial Agent|check popups and interstitials only
Ad Layout Agent|check whether ads disrupt content only
Cookie Banner Agent|check whether cookie banners block content only
Main Content Visibility Agent|check whether main content is immediately visible only
Page Speed Budget Agent|enforce page weight limits only

Accessibility agents that support on-page SEO
Alt Accessibility Agent|check alt text accessibility only
Heading Accessibility Agent|check accessible heading structure only
Keyboard Navigation Agent|check keyboard usability only
Color Contrast Agent|check contrast only
ARIA Agent|check ARIA labels only
Form Label Agent|check form labels only
Table Accessibility Agent|check table headers and captions only
Link Text Accessibility Agent|check descriptive link text only
Screen Reader Flow Agent|check reading order only
Accessible Media Agent|check captions, transcripts, and audio descriptions only

E-E-A-T and trust agents
Author Bio Agent|check or create author bio only
Reviewer Bio Agent|check expert reviewer information only
Author Credential Agent|verify displayed credentials only
Date Updated Agent|check last-updated information only
Contact Info Agent|check visible contact information only
Business Identity Agent|check business identity signals only
About Link Agent|check link to about page only
Policy Link Agent|check links to privacy, returns, editorial, or terms pages only
Trust Badge Agent|check trust badges only
Testimonial Agent|check testimonials only
Review Authenticity Agent|check review credibility only
Case Study Agent|add or check case-study proof only
Source Attribution Agent|check source attribution only
Editorial Standard Agent|check editorial standards only
YMYL Disclaimer Agent|check required disclaimers only

Ecommerce on-page agents
Product Title Agent|optimize product titles only
Product Description Agent|optimize product descriptions only
Product Specs Agent|optimize specification tables only
Product Image Agent|optimize product images only
Product Alt Text Agent|write product image alt text only
Product Review Agent|optimize review display only
Product Rating Agent|check rating display only
Price Display Agent|check price visibility only
Availability Agent|check stock availability display only
SKU Agent|check SKU display only
GTIN/MPN Agent|check product identifier display only
Variant Agent|check product variant handling only
Shipping Info Agent|check shipping information only
Returns Info Agent|check returns information only
Product FAQ Agent|create product FAQs only
Comparison Table Agent|create product comparison tables only
Related Product Agent|suggest related products only
Category Copy Agent|optimize category page copy only
Filter Text Agent|optimize filter or facet text only
Out-of-Stock Page Agent|decide how to handle out-of-stock pages only
Product Schema Agent|handle product structured data only
Merchant Policy Schema Agent|handle merchant policy structured data only

Service business on-page agents
Service Page Title Agent|optimize service page titles only
Service Description Agent|optimize service descriptions only
Service Area Agent|optimize service area copy only
Service FAQ Agent|create service FAQs only
Pricing Explanation Agent|explain pricing only
Booking CTA Agent|optimize booking CTAs only
Trust Signal Agent|add service trust signals only
Before-and-After Agent|optimize before-and-after content only
Process Explanation Agent|explain the service process only
Guarantee Agent|explain guarantees only
Emergency Service Agent|optimize emergency service information only
Industry Credential Agent|check licenses, certifications, or accreditations only

Local on-page SEO agents
NAP Agent|check name, address, and phone number on the page only
Location Page Agent|optimize one location page only
Local Keyword Agent|add local keyword relevance only
Opening Hours Agent|check opening hours only
Directions Agent|add directions or parking information only
Local Landmark Agent|add nearby landmark context only
Local Review Agent|add local review proof only
Local Service Area Agent|define service area only
Location Schema Agent|create LocalBusiness schema only
Map Embed Agent|check map embed only
Local CTA Agent|optimize local call, booking, or quote CTA only
Multi-Location Duplicate Agent|check duplicate location-page copy only

International and multilingual on-page agents
Hreflang Agent|check hreflang tags only
Language Attribute Agent|check HTML language attributes only
Localized Title Agent|localize title tags only
Localized Meta Description Agent|localize meta descriptions only
Translation Quality Agent|check translation quality only
Regional Keyword Agent|adapt keywords to local language only
Currency Agent|check currency localization only
Units Agent|check measurement unit localization only
Date Format Agent|check local date formats only
Regional Legal Copy Agent|check region-specific required copy only
Localized Image Agent|check whether images suit the target region only
Canonical-Hreflang Agent|check canonical and hreflang consistency only
RTL Layout Agent|check right-to-left language layout only

News, blog, and publisher agents
Headline SEO Agent|optimize article headlines only
Article Intro Agent|optimize article intros only
Byline Agent|check byline visibility only
Date Published Agent|check published date only
Date Modified Agent|check modified date only
Author Page Link Agent|check link to author page only
Article Schema Agent|create article structured data only
News Image Agent|optimize article images only
Source Attribution Agent|check source attribution only
Fact Check Agent|verify factual claims only
Paywall Markup Agent|mark paywalled content only
Related Article Agent|add related articles only
Evergreen Update Agent|refresh evergreen article sections only

AI-search readiness agents
Answer Clarity Agent|make answers clear and direct only
Entity Clarity Agent|make important entities clear only
Source Clarity Agent|make sources and evidence clear only
Unique Insight Agent|add expert or original insight only
Non-Commodity Content Agent|remove generic commodity content only
Question Answering Agent|answer one user question clearly only
Comparison Clarity Agent|clarify comparisons only
Summary Formatting Agent|create a human-friendly summary only
Process Clarity Agent|make processes easy to follow only
Definition Clarity Agent|make definitions clear only
Citation Context Agent|explain why a cited source supports the claim only

On-page QA and monitoring agents
Pre-Publish SEO QA Agent|run the final on-page checklist only
Live Page QA Agent|compare published page against approved version only
Search Console Inspection Agent|inspect one URL in Search Console only
Rich Results Test Agent|test rich result eligibility only
PageSpeed Insights Agent|test speed and Core Web Vitals only
Mobile Rendering QA Agent|check mobile rendering only
Desktop Rendering QA Agent|check desktop rendering only
SERP CTR Monitor Agent|monitor click-through rate only
Title Rewrite Monitor Agent|check whether Google rewrites the title only
Meta Snippet Monitor Agent|check displayed snippets only
Ranking Drop Page Agent|diagnose one page's ranking drop only
Content Decay Agent|detect traffic decay for one page only
Internal Link Change Agent|monitor internal link changes only
Schema Change Agent|monitor structured data changes only
Indexing Status Agent|monitor indexing status only
A/B Test SEO Safety Agent|check whether an on-page test risks SEO only
Change Log Agent|record on-page SEO changes only
`;

const alwaysActiveGroups = new Set([
  'page-targeting-agents',
  'content-planning-agents',
  'content-writing-agents',
  'content-quality-agents',
  'title-meta-and-serp-appearance-agents',
  'heading-and-html-structure-agents',
  'indexability-and-crawlability-agents',
  'internal-linking-agents',
  'structured-data-agents',
  'image-seo-agents',
  'core-web-vitals-and-page-experience-agents',
  'accessibility-agents-that-support-on-page-seo',
  'e-e-a-t-and-trust-agents',
  'ai-search-readiness-agents',
  'on-page-qa-and-monitoring-agents',
]);

const blogGroups = new Set(['news-blog-and-publisher-agents']);
const conditionalGroups = new Map([
  ['video-and-audio-seo-agents', 'Activate only when the page has video, audio, embeds, captions, or transcripts.'],
  ['ecommerce-on-page-agents', 'Activate only for real product/category/merchant pages, not free calculator tools.'],
  ['service-business-on-page-agents', 'Activate only for service pages with booking, service-area, pricing, or credential claims.'],
  ['local-on-page-seo-agents', 'Activate only for location, map, opening-hours, service-area, or NAP pages.'],
  ['international-and-multilingual-on-page-agents', 'Activate only for localized or translated pages.'],
]);

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseCatalog(text) {
  const groups = [];
  let current = null;

  for (const rawLine of text.trim().split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    if (!line.includes('|')) {
      current = {
        id: slugify(line),
        title: line,
        agents: [],
      };
      groups.push(current);
      continue;
    }

    const [name, job] = line.split('|');
    current?.agents.push({
      id: `${current.id}:${slugify(name)}`,
      name,
      job,
      evaluator: `${name.replace(/\s+Agent$/, '')} Evaluator`,
    });
  }

  return groups;
}

export const SEO_MICRO_AGENT_GROUPS = parseCatalog(rawCatalog);

export function countSeoMicroAgents(groups = SEO_MICRO_AGENT_GROUPS) {
  return groups.reduce((total, group) => total + group.agents.length, 0);
}

export function selectSeoMicroAgentGroups(page, options = {}) {
  const pageKind = String(page || 'tool').toLowerCase();
  const enabledGroups = new Set(alwaysActiveGroups);

  if (pageKind === 'blog') enabledGroups.add('news-blog-and-publisher-agents');
  if (options.hasVideo) enabledGroups.add('video-and-audio-seo-agents');
  if (options.isEcommerce) enabledGroups.add('ecommerce-on-page-agents');
  if (options.isServiceBusiness) enabledGroups.add('service-business-on-page-agents');
  if (options.isLocal) enabledGroups.add('local-on-page-seo-agents');
  if (options.isInternational) enabledGroups.add('international-and-multilingual-on-page-agents');

  return SEO_MICRO_AGENT_GROUPS.map((group) => {
    const active = enabledGroups.has(group.id);
    return {
      ...group,
      status: active ? 'active' : 'parked',
      reason: active ? activeReason(group.id, pageKind) : conditionalGroups.get(group.id) || 'Parked for this page type.',
    };
  });
}

export function flattenSeoMicroAgents(groups) {
  return groups.flatMap((group) =>
    group.agents.map((agent) => ({
      ...agent,
      groupId: group.id,
      groupTitle: group.title,
      groupStatus: group.status,
      groupReason: group.reason,
    })),
  );
}

function activeReason(groupId, pageKind) {
  if (groupId === 'news-blog-and-publisher-agents') return 'Active because the page is a blog guide.';
  if (pageKind === 'tool' && groupId === 'structured-data-agents') return 'Active because tool pages need schema eligibility and visible-content checks.';
  return 'Active for every controlled tool/blog SEO review.';
}

