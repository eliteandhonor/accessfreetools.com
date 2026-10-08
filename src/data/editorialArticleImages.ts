// Server-only image discovery. Keep this separate from browser text indexes so
// exact canonical content hashing never enters the BlogSearch client bundle.
import { dailyEditorialArticles } from './dailyEditorialArticles';
import { getDailyEditorialImage } from './dailyEditorialArtwork';
import { ownerEditorialBlogPosts } from './editorialBlogPosts';

export interface EditorialArticleImageDefinition {
  slug: string;
  pagePath: string;
  imagePath: string;
}

export const editorialArticleImages: EditorialArticleImageDefinition[] = [...ownerEditorialBlogPosts.map((post) => ({
  slug: post.slug,
  pagePath: `/blog/${post.slug}/`,
  imagePath: `/social/${post.slug}.webp`,
})), ...dailyEditorialArticles.flatMap((article) => {
  const image = getDailyEditorialImage(article);
  return image ? [{ slug: article.slug, pagePath: `/blog/${article.slug}/`, imagePath: image.imagePath }] : [];
})];
