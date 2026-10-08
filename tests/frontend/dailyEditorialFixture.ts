import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { transform } from '@astrojs/compiler-rs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { DailyEditorialArticle } from '../../src/data/dailyEditorialArticles';

// Build the real component, layout and discovery handlers in memory. The fixture
// replaces only the catalog import; no public content, dist, or server is written.
export async function renderDailyEditorialFixture(article: DailyEditorialArticle) {
  const require = createRequire(import.meta.url);
  const compiled = await build({
    stdin: { contents: `
      export { default } from './src/components/DailyEditorialArticle.astro';
      export { default as renderer } from '@astrojs/react/server.js';
      export { getBlogDates } from './src/data/siteDates';
      export { getBlogSearchIndex } from './src/data/blogSearchIndex';
      export { blogSitemapEntries } from './src/data/discovery';
      export { editorialArticleImages } from './src/data/editorialBlogPosts';
      export { GET as feed } from './src/pages/feed.xml';
    `, resolveDir: process.cwd() },
    bundle: true, write: false, platform: 'node', format: 'esm', jsx: 'automatic',
    define: { 'import.meta.env': '{}' },
    plugins: [{ name: 'daily-article-fixture', setup(builder) {
      builder.onLoad({ filter: /dailyEditorialArticles\.json$/ }, () => ({ contents: JSON.stringify([article]), loader: 'json' }));
      builder.onResolve({ filter: /\.css(?:$|\?)/ }, (args) => ({ path: args.path, namespace: 'fixture-css' }));
      builder.onLoad({ filter: /.*/, namespace: 'fixture-css' }, () => ({ contents: '', loader: 'js' }));
      builder.onResolve({ filter: /^astro:react:opts$/ }, () => ({ path: 'options', namespace: 'fixture-react-options' }));
      builder.onLoad({ filter: /.*/, namespace: 'fixture-react-options' }, () => ({ contents: 'export default {};', loader: 'js' }));
      builder.onResolve({ filter: /^(astro\/|@astrojs\/|react(?:$|\/))/ }, (args) => ({
        path: args.path === '@astrojs/react/server.js' ? require.resolve(args.path) : pathToFileURL(require.resolve(args.path)).href,
        external: args.path !== '@astrojs/react/server.js',
      }));
      builder.onResolve({ filter: /^(react-dom\/|lucide-react$)/ }, (args) => ({ path: pathToFileURL(require.resolve(args.path)).href, external: true }));
      builder.onLoad({ filter: /\.astro$/ }, (args) => {
        const result = transform(readFileSync(args.path, 'utf8'), { filename: args.path,
          internalURL: 'astro/compiler-runtime', resultScopedSlot: true,
          resolvePath: (specifier) => resolve(dirname(args.path), specifier),
        });
        const errors = result.diagnostics.filter((diagnostic) => diagnostic.severity === 'error');
        if (errors.length) throw new Error(JSON.stringify(errors));
        return { contents: result.code, loader: 'ts', resolveDir: dirname(args.path) };
      });
    } }],
  });
  const code = compiled.outputFiles[0].text + '\n//# sourceURL=aft-daily-editorial-fixture.mjs';
  const component = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  const container = await AstroContainer.create({ resolve: async () => '/fixture-component.js' });
  container.addServerRenderer({ name: '@astrojs/react', renderer: component.renderer });
  container.addClientRenderer({ name: '@astrojs/react', entrypoint: '/fixture-renderer.js' });
  const html = await container.renderToString(component.default, {
    request: new Request(`https://accessfreetools.com/blog/${article.slug}/`), partial: false, props: { article },
  });
  return { html, dates: component.getBlogDates(article.slug), search: component.getBlogSearchIndex(),
    sitemap: component.blogSitemapEntries, images: component.editorialArticleImages,
    feed: await component.feed().text() };
}
