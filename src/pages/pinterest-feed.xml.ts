export const prerender = true;
import type { APIRoute } from 'astro';
import { getPinterestFeedItems } from '../data/pinterestFeed';
import { renderPinterestRssFeed } from '../data/pinterestFeedXml';

export const GET: APIRoute = () => {
  const body = renderPinterestRssFeed({
    title: 'Access Free Tools Pinterest RSS-Ready Pins',
    linkPath: '/tools/',
    selfPath: '/pinterest-feed.xml',
    description:
      'Future Pinterest-ready Access Free Tools calculators, browser utilities, and practical guides with dedicated Pin images. Already-posted manual pins stay out of this feed to avoid duplicates.',
    items: getPinterestFeedItems(),
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
