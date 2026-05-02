import { blogPosts } from './blogPosts';

export interface BlogSearchItem {
  slug: string;
  title: string;
  label: string;
  summary: string;
  searchText: string;
}

export function getBlogSearchIndex(): BlogSearchItem[] {
  return blogPosts.map((post) => ({
    ...post,
    searchText: [post.title, post.label, post.summary].join(' '),
  }));
}
