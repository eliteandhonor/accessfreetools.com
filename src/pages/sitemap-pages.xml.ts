export const prerender = true;
import type { APIRoute } from 'astro';
import { hubSitemapEntries, renderUrlSet, staticSitemapEntries } from '../data/discovery';

export const GET: APIRoute = () =>
  new Response(renderUrlSet([...staticSitemapEntries, ...hubSitemapEntries]), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });

