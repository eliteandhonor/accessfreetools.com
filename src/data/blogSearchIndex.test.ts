import { describe, expect, it } from 'vitest';
import { blogPosts } from './blogPosts';
import { editorialBlogPosts, ownerEditorialBlogPosts } from './editorialBlogPosts';
import { dailyEditorialArticles } from './dailyEditorialArticles';
import { getBlogSearchIndex } from './blogSearchIndex';
import { rankDiscoveryItems } from '../lib/toolDiscovery';

const index = getBlogSearchIndex();
const searchable = index.map(post => ({ ...post, name: post.title }));

describe('blog discovery inventory', () => {
  it('keeps every existing canonical guide and all seven reviewed editorials discoverable', () => {
    expect(ownerEditorialBlogPosts).toHaveLength(7);
    expect(editorialBlogPosts).toHaveLength(7 + dailyEditorialArticles.length);
    expect(index).toHaveLength(blogPosts.length + editorialBlogPosts.length);
    expect(new Set(index.map(post => post.slug)).size).toBe(index.length);
    expect(index.filter(post => post.kind === 'guide').map(post => post.slug)).toEqual(blogPosts.map(post => post.slug));
    expect(index.filter(post => post.kind === 'editorial').map(post => post.slug)).toEqual(editorialBlogPosts.map(post => post.slug));
  });

  it('finds a task from separate meaningful query words rather than a full phrase', () => {
    expect(rankDiscoveryItems(searchable, 'percentage discount').map(post => post.slug))
      .toContain('how-to-use-percentage-calculator');
    expect(rankDiscoveryItems(searchable, 'browser local privacy').map(post => post.slug))
      .toContain('browser-ai-vs-local-ai-privacy');
    expect(rankDiscoveryItems(searchable, 'tesseract image quality').map(post => post.slug))
      .toContain('tesseract-js-browser-ocr-image-quality');
    expect(rankDiscoveryItems(searchable, 'unfindable-example-task')).toEqual([]);
  });
});
