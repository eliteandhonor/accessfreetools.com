// Server-only artwork admission for Astro rendering/image discovery. Browser
// text discovery imports dailyEditorialArticles without this Node hash boundary.
import artworkApprovals from './dailyEditorialArtApprovals.json';
import { getDailyEditorialArticle, type DailyEditorialArticle } from './dailyEditorialArticles';
import { approvedDailyEditorialArtwork } from '../../scripts/lib/daily-editorial-artwork.mjs';

export function getDailyEditorialImage(articleOrSlug: DailyEditorialArticle | string, approvals: unknown = artworkApprovals) {
  if (typeof articleOrSlug === 'string' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(articleOrSlug)) throw new Error('Invalid daily article image slug');
  const article = typeof articleOrSlug === 'string' ? getDailyEditorialArticle(articleOrSlug) : articleOrSlug;
  const approval = approvedDailyEditorialArtwork(article, approvals);
  if (!approval) return null;
  return { imagePath: approval.imagePath as string, webpPath: approval.webpPath as string,
    alt: approval.alt as string, caption: approval.caption as string, width: 1200, height: 630 };
}
