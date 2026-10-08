import { describe, expect, it } from 'vitest';
import { dailyEditorialArticles, isSafeEditorialSourceUrl, parseDailyEditorialArticles } from './dailyEditorialArticles';
import { getDailyEditorialImage } from './dailyEditorialArtwork';
import { formatDisplayDate, toIsoDateTime, toRfc822Date } from './siteDates';
import { renderDailyEditorialFixture } from '../../tests/frontend/dailyEditorialFixture';
import { parse, type DefaultTreeAdapterMap } from 'parse5';
import { syntheticDailyArtworkApproval } from '../../tests/fixtures/dailyEditorialArtwork.mjs';

export function syntheticDailyArticle() {
  return {
    schemaVersion: 1,
    slug: 'synthetic-file-comparison',
    title: 'A synthetic file comparison fixture',
    summary: 'This fixture is used only in offline tests.',
    problem: 'You need to find the changed lines in two small text files.',
    project: { fullName: 'fixture/comparison', url: 'https://github.com/fixture/comparison', commit: 'a'.repeat(40), license: 'MIT', release: null },
    researchedAt: '2026-10-08T09:50:00.000Z', publishedAt: '2026-10-08T10:20:00.000Z',
    artwork: { articleSha256: 'c'.repeat(64) },
    sections: [{ heading: 'Compare the files', paragraphs: [{ text: 'This is a synthetic explanation, never a live software recommendation.', sourceIds: ['readme'] }] }],
    sources: ['readme', 'license'].map((kind) => ({ id: kind, kind, url: `https://github.com/fixture/comparison/blob/${'a'.repeat(40)}/${kind}`, fetchedAt: '2026-10-08T09:40:00.000Z', sha256: 'b'.repeat(64) })),
  };
}

describe('daily editorial public catalog boundary', () => {
  it('keeps offline synthetic fixtures out of the public catalog', () => {
    expect(dailyEditorialArticles.some((article) => article.slug === 'synthetic-file-comparison')).toBe(false);
  });

  it('accepts a safe projection and holds raw source material and evidence', () => {
    expect(parseDailyEditorialArticles([syntheticDailyArticle()])).toHaveLength(1);
    const sourceText = syntheticDailyArticle();
    Object.assign(sourceText.sources[0], { text: 'A complete protected source document' });
    expect(() => parseDailyEditorialArticles([sourceText])).toThrow();
    const evidence = syntheticDailyArticle();
    Object.assign(evidence.sections[0].paragraphs[0], { evidence: [{ quote: 'Protected material', sourceId: 'readme' }] });
    expect(() => parseDailyEditorialArticles([evidence])).toThrow();
  });

  it('rejects invalid dates, research ordering, mismatched repos, missing license, and unresolved citations', () => {
    for (const mutate of [
      (article: ReturnType<typeof syntheticDailyArticle>) => { article.researchedAt = '2026-02-30T09:50:00.000Z'; },
      (article: ReturnType<typeof syntheticDailyArticle>) => { article.researchedAt = '2026-10-09T09:50:00.000Z'; },
      (article: ReturnType<typeof syntheticDailyArticle>) => { article.project.url = 'https://github.com/fixture/wrong'; },
      (article: ReturnType<typeof syntheticDailyArticle>) => { article.sources.pop(); },
      (article: ReturnType<typeof syntheticDailyArticle>) => { article.sections[0].paragraphs[0].sourceIds = ['unknown']; },
    ]) {
      const article = syntheticDailyArticle(); mutate(article);
      expect(() => parseDailyEditorialArticles([article])).toThrow();
    }
    expect(() => parseDailyEditorialArticles([syntheticDailyArticle(), syntheticDailyArticle()])).toThrow();
  });

  it('blocks unsafe schemes, credentials, IP addresses, private host labels and path traversal', () => {
    for (const url of ['javascript:alert(1)', 'http://github.com/fixture/comparison', 'https://user:secret@github.com/', 'https://127.0.0.1/', 'https://[::1]/', 'https://project.local/', 'https://localhost/', 'https://github.com\\@evil.invalid/']) {
      expect(isSafeEditorialSourceUrl(url), url).toBe(false);
    }
    expect(isSafeEditorialSourceUrl('https://docs.python.org/3/')).toBe(true);
    expect(isSafeEditorialSourceUrl('https://github.com/fixture/comparison')).toBe(true);
    expect(() => getDailyEditorialImage('../untrusted')).toThrow();
  });
});

describe('honest publication timestamps', () => {
  it('preserves the exact new publication instant and existing date-only behavior', () => {
    const actual = '2026-10-08T10:20:00.000Z';
    expect(toIsoDateTime(actual)).toBe(actual);
    expect(toRfc822Date(actual)).toBe('Thu, 08 Oct 2026 10:20:00 GMT');
    expect(formatDisplayDate(actual)).toBe('October 8, 2026');
    expect(toIsoDateTime('2026-07-13')).toBe('2026-07-13T12:00:00.000Z');
  });
});

describe('actual article rendering and discovery', () => {
  it.each(['adsense', 'infolinks'] as const)('keeps automatic articles ad-free even when %s is approved for ordinary pages', async (advertisingMode) => {
    const article = parseDailyEditorialArticles([syntheticDailyArticle()])[0];
    const approval = await syntheticDailyArtworkApproval(article);
    const { html, defaultLayoutHtml } = await renderDailyEditorialFixture(article, { advertisingMode, artworkApprovals: [approval] });
    // The positive control proves these checks would detect ad inclusion even
    // though actual publisher approval is currently off in production.
    expect(defaultLayoutHtml).toContain(`\"adMode\":\"${advertisingMode}\"`);
    expect(defaultLayoutHtml).toContain('data-advertising-choice');
    expect(defaultLayoutHtml).toContain('data-ad-privacy-open');
    expect(defaultLayoutHtml).toContain('property="og:image"');
    expect(defaultLayoutHtml).toContain('name="twitter:image"');
    for (const marker of ['data-advertising-choice', 'data-ad-privacy-open', 'aft:ads-ready',
      'adsbygoogle.js', 'infolinks_main.js', 'data-adsense-placement']) expect(html).not.toContain(marker);
    expect(html).toContain('name="google-adsense-account"');
    expect(html).toContain('AI-assisted research, writing, and review');
    expect(html).not.toMatch(/(?:human|owner|manually)[ -]reviewed/i);
  });

  it('escapes research text and JSON-LD while preserving matching dates, citations and artwork', async () => {
    const fixture = syntheticDailyArticle();
    fixture.title = 'Compare files </script><script>alert(1)</script>';
    fixture.sections[0].paragraphs[0].text = '<img src=x onerror="alert(1)"> stays literal source text.';
    const article = parseDailyEditorialArticles([fixture])[0];
    const approval = await syntheticDailyArtworkApproval(article);
    const image = getDailyEditorialImage(article, [approval]);
    expect(image).not.toBeNull();
    const { html, dates, search, sitemap, images, feed, imageSitemap } = await renderDailyEditorialFixture(article, { artworkApprovals: [approval] });
    const elements: DefaultTreeAdapterMap['element'][] = [];
    function collect(node: DefaultTreeAdapterMap['node']) {
      if ('tagName' in node) elements.push(node);
      if ('childNodes' in node) node.childNodes.forEach(collect);
    }
    collect(parse(html));
    expect(elements.filter((element) => element.tagName === 'script').some((element) =>
      element.childNodes.some((node) => 'value' in node && node.value === 'alert(1)'),
    )).toBe(false);
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img src=x');
    const structured = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const posting = structured.find((record) => record['@type'] === 'BlogPosting');
    expect(posting.headline).toBe(fixture.title);
    expect(posting.datePublished).toBe(article.publishedAt);
    expect(posting.dateModified).toBe(article.publishedAt);
    expect(posting.author.name).toBe('Access Free Tools');
    expect(posting.citation).toEqual(article.sources.map((source) => source.url));
    expect(html).toContain(`data-daily-editorial="${article.slug}"`);
    expect(html).not.toContain('data-editorial-slug');
    expect(html).toContain('We did not install or run this software');
    expect(html).toContain(image!.caption);
    expect(html).toContain(`src="${image!.imagePath}"`);
    expect(html).toContain(`alt="${image!.alt}"`);
    expect(html).toContain('width="1200" height="630"');
    expect(html).toContain(`content="${article.publishedAt}"`);
    expect(dates).toEqual({ published: article.publishedAt, modified: article.publishedAt });
    expect(search.some((post: { slug: string }) => post.slug === article.slug)).toBe(true);
    expect(sitemap).toContainEqual({ path: `/blog/${article.slug}/`, lastmod: article.publishedAt });
    expect(images).toContainEqual({ slug: article.slug, pagePath: `/blog/${article.slug}/`, imagePath: image!.imagePath });
    expect(posting.image).toBe(`https://accessfreetools.com${image!.imagePath}`);
    expect(html).toContain(`property="og:image" content="${posting.image}"`);
    expect(html).toContain(`name="twitter:image" content="${posting.image}"`);
    expect(imageSitemap).toContain(`<image:loc>${posting.image}</image:loc>`);
    expect(feed).toContain(`<pubDate>${toRfc822Date(article.publishedAt)}</pubDate>`);
    expect(feed).not.toContain('onerror="alert(1)"');
  });

  it('keeps daily image references hidden when no synthetic approval is supplied', async () => {
    const article = parseDailyEditorialArticles([syntheticDailyArticle()])[0];
    expect(getDailyEditorialImage(article)).toBeNull();
    const { html, images, imageSitemap, search, sitemap, feed } = await renderDailyEditorialFixture(article);
    expect(html).not.toMatch(/<figure\b[^>]*class="[^"]*\beditorial-hero-figure\b/);
    expect(html).not.toContain('property="og:image');
    expect(html).not.toContain('name="twitter:image');
    expect(html).toContain('name="twitter:card" content="summary"');
    expect(html).not.toContain(`/social/daily-${article.slug}`);
    const structured = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    expect(structured.find((record) => record['@type'] === 'BlogPosting')).not.toHaveProperty('image');
    expect(images.some((entry: { slug: string }) => entry.slug === article.slug)).toBe(false);
    expect(imageSitemap).not.toContain(`/blog/${article.slug}/`);
    // Text publication/discovery is separate from permission to surface art.
    expect(search.some((post: { slug: string }) => post.slug === article.slug)).toBe(true);
    expect(sitemap).toContainEqual({ path: `/blog/${article.slug}/`, lastmod: article.publishedAt });
    expect(feed).toContain(`/blog/${article.slug}/`);
    // Existing owner/tool artwork stays visible through its separate manifest.
    expect(images.some((entry: { slug: string }) => entry.slug === 'how-to-check-github-project-before-installing')).toBe(true);
    expect(imageSitemap).toContain('/social/how-to-check-github-project-before-installing.webp');
  });

  it.each(['rejected', 'unapproved QA', 'script provenance', 'changed article', 'changed article identity'] as const)(
    'removes every daily image surface for %s artwork', async (reason) => {
      const article = parseDailyEditorialArticles([syntheticDailyArticle()])[0];
      const approval = await syntheticDailyArtworkApproval(article);
      if (reason === 'rejected') approval.status = 'rejected';
      if (reason === 'unapproved QA') approval.qaStatus = 'pending';
      if (reason === 'script provenance') approval.provenance.generator = 'script-svg';
      if (reason === 'changed article') article.sections[0].paragraphs[0].text += ' Changed after the synthetic approval.';
      if (reason === 'changed article identity') article.artwork.articleSha256 = 'd'.repeat(64);
      const { html, images, imageSitemap } = await renderDailyEditorialFixture(article, { artworkApprovals: [approval] });
      expect(html).not.toMatch(/<figure\b[^>]*class="[^"]*\beditorial-hero-figure\b/);
      expect(html).not.toContain('property="og:image');
      expect(html).not.toContain('name="twitter:image');
      expect(html).not.toContain(`/social/daily-${article.slug}`);
      const structured = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
      expect(structured.find((record) => record['@type'] === 'BlogPosting')).not.toHaveProperty('image');
      expect(images.some((entry: { slug: string }) => entry.slug === article.slug)).toBe(false);
      expect(imageSitemap).not.toContain(`/blog/${article.slug}/`);
      expect(imageSitemap).toContain('/social/how-to-check-github-project-before-installing.webp');
    },
  );
});
