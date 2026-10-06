import { blogPosts } from './blogPosts';
import { editorialBlogPosts } from './editorialBlogPosts';

export interface BlogSearchItem {
  slug: string;
  title: string;
  label: string;
  summary: string;
  searchText: string;
  kind?: 'guide' | 'editorial';
}

export function getBlogSearchIndex(): BlogSearchItem[] {
  return [
    ...editorialBlogPosts.map((post) => ({ ...post, kind: 'editorial' as const })),
    ...blogPosts.map((post) => ({ ...post, kind: 'guide' as const })),
  ].map((post) => ({
    ...post,
    searchText: [post.title, post.label, post.summary, post.slug.replace(/-/g, ' ')].join(' '),
  }));
}
