import type { BlogPostDefinition } from './blogPosts';

export const editorialBlogPosts: BlogPostDefinition[] = [
  {
    slug: 'open-source-projects-behind-access-free-tools',
    title: '8 Open-Source Projects Behind Access Free Tools',
    label: 'Owner notes',
    summary:
      'Brendan Chambers explains how Astro, React, TypeScript, Playwright, Vitest, Tesseract.js, Transformers.js, and Ollama each earn a specific job behind the site.',
  },
  {
    slug: 'how-to-check-github-project-before-installing',
    title: 'How I Check a GitHub Project Before Installing It',
    label: 'Owner checklist',
    summary:
      'The repository, license, install-script, dependency, write-location, and sandbox checks Brendan uses before adding an open-source project.',
  },
  {
    slug: 'free-ai-skills-open-source-tools-organic-growth',
    title: "9 Free AI Skills I'm Testing",
    label: 'Owner notes',
    summary:
      'Brendan Chambers explains how free AI skills and open-source agent tools can help Access Free Tools research, write, review, and grow without spam.',
  },
];

export interface EditorialArticleImageDefinition {
  slug: string;
  pagePath: string;
  imagePath: string;
}

export const editorialArticleImages: EditorialArticleImageDefinition[] = editorialBlogPosts.map((post) => ({
  slug: post.slug,
  pagePath: `/blog/${post.slug}/`,
  imagePath: `/social/${post.slug}.webp`,
}));
