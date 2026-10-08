import type { BlogPostDefinition } from './blogPosts';
import { blogPosts } from './blogPosts';
import { dailyEditorialArticles, getDailyEditorialImage } from './dailyEditorialArticles';

export const ownerEditorialBlogPosts: BlogPostDefinition[] = [
  {
    slug: 'remove-ai-writing-tells-before-publishing',
    title: 'How to Edit an AI-Assisted Draft Before Publishing',
    label: 'Practical editing guide',
    summary:
      'Check an AI-assisted draft for accurate facts, useful examples, clear sentences, accessible headings, and honest authorship. Includes six practical editing passes.',
  },
  {
    slug: 'browser-text-to-speech-kokoro-vs-supertonic',
    title: 'Kokoro vs Supertonic for Browser Text to Speech',
    label: 'Browser speech guide',
    summary:
      'Compare the current Kokoro and Supertonic browser paths, voice choices, model downloads, MP3 workflow, privacy limits, and Supertonic archive status.',
  },
  {
    slug: 'tesseract-js-browser-ocr-image-quality',
    title: 'How to Improve Tesseract.js OCR Results in a Browser',
    label: 'Browser OCR guide',
    summary:
      'Prepare clearer images for Tesseract.js OCR, choose the matching language, check important characters, and try the verified English sample workflow.',
  },
  {
    slug: 'open-source-projects-behind-access-free-tools',
    title: '8 Open-Source Projects Behind Access Free Tools',
    label: 'Project notes',
    summary:
      'See which projects build Access Free Tools, test its results, and power browser OCR and AI, plus the limits of its optional cloud question router.',
  },
  {
    slug: 'how-to-check-github-project-before-installing',
    title: 'How to Check a GitHub Project Before Installing It',
    label: 'Project notes',
    summary:
      'Seven practical checks for a GitHub project: source, license, maintenance, install scripts, dependencies, permissions, and a restricted test environment.',
  },
  {
    slug: 'browser-ai-vs-local-ai-privacy',
    title: 'Browser AI vs Local AI: What Stays on Your Device?',
    label: 'Project notes',
    summary:
      'Compare browser inference, model downloads, cloud question routing, and analytics using the current Access Free Tools implementation and its limits.',
  },
  {
    slug: 'free-ai-skills-open-source-tools-organic-growth',
    title: '9 AI skills and tools to evaluate for a utility website',
    label: 'Project guide',
    summary:
      'Compare nine AI skills and tools for writing, research, code review, design, and tutorial media, with cost limits and practical Access Free Tools examples.',
  },
];

const existingSlugs = new Set([...ownerEditorialBlogPosts, ...blogPosts].map((post) => post.slug));
if (dailyEditorialArticles.some((article) => existingSlugs.has(article.slug))) {
  throw new Error('A daily editorial slug collides with an existing canonical blog article');
}

export const editorialBlogPosts: BlogPostDefinition[] = [
  ...[...dailyEditorialArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).map((article) => ({
    slug: article.slug, title: article.title, summary: article.summary, label: 'Open-source software guide',
  })),
  ...ownerEditorialBlogPosts,
];

export interface EditorialArticleImageDefinition {
  slug: string;
  pagePath: string;
  imagePath: string;
}

export const editorialArticleImages: EditorialArticleImageDefinition[] = [...ownerEditorialBlogPosts.map((post) => ({
  slug: post.slug,
  pagePath: `/blog/${post.slug}/`,
  imagePath: `/social/${post.slug}.webp`,
})), ...dailyEditorialArticles.map((article) => ({
  slug: article.slug,
  pagePath: `/blog/${article.slug}/`,
  imagePath: getDailyEditorialImage(article.slug).imagePath,
}))];
