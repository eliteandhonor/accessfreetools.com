import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { transform } from '@astrojs/compiler-rs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { DailyEditorialArticle } from '../../src/data/dailyEditorialArticles';

// Build the real component, layout, CSS and discovery handlers in memory. The
// default fixture replaces only the catalog import; an optional advertising
// simulation is confined to this bundle. No public content or dist is written.
export async function renderDailyEditorialFixture(article: DailyEditorialArticle, options: { advertisingMode?: 'adsense' | 'infolinks' } = {}) {
  const require = createRequire(import.meta.url);
  const styles = new Map<string, string>();
  const compiledStyles = new Map<string, string>();
  const compiled = await build({
    stdin: { contents: `
      export { default } from './src/components/DailyEditorialArticle.astro';
      export { default as baseLayout } from './src/components/BaseLayout.astro';
      export { default as renderer } from '@astrojs/react/server.js';
      export { getBlogDates } from './src/data/siteDates';
      export { getBlogSearchIndex } from './src/data/blogSearchIndex';
      export { blogSitemapEntries } from './src/data/discovery';
      export { editorialArticleImages } from './src/data/editorialBlogPosts';
      export { GET as feed } from './src/pages/feed.xml';
    `, resolveDir: process.cwd() },
    bundle: true, write: false, platform: 'node', format: 'esm', jsx: 'automatic',
    define: { 'import.meta.env': JSON.stringify(options.advertisingMode ? {
      PUBLIC_ADSENSE_ENABLED: options.advertisingMode === 'adsense' ? 'true' : 'false',
      PUBLIC_ADSENSE_CMP_READY: 'true',
      PUBLIC_ADSENSE_CLIENT_ID: 'ca-pub-1234567890123456',
      PUBLIC_ADSENSE_CONTENT_SLOT_ID: '1234567890',
      PUBLIC_INFOLINKS_ENABLED: options.advertisingMode === 'infolinks' ? 'true' : 'false',
    } : {}) },
    plugins: [{ name: 'daily-article-fixture', setup(builder) {
      builder.onLoad({ filter: /dailyEditorialArticles\.json$/ }, () => ({ contents: JSON.stringify([article]), loader: 'json' }));
      // Simulate approved advertising in memory to test the article boundary.
      // Production approval flags, allowlists and environment stay untouched.
      if (options.advertisingMode) builder.onLoad({ filter: /\/monetization\.ts$/ }, (args) => ({
        contents: readFileSync(args.path, 'utf8')
          .replace('export const ADSENSE_ACCOUNT_APPROVED = false;', 'export const ADSENSE_ACCOUNT_APPROVED = true;')
          .replace('export const INFOLINKS_ACCOUNT_APPROVED = false;', 'export const INFOLINKS_ACCOUNT_APPROVED = true;')
          .replace('export const ADSENSE_TOOL_PATHS = [', `export const ADSENSE_TOOL_PATHS = [${JSON.stringify(`/blog/${article.slug}/`)},`),
        loader: 'ts',
      }));
      builder.onResolve({ filter: /\.css(?:$|\?)/ }, (args) => ({
        path: isAbsolute(args.path) ? args.path : args.path.startsWith('.') ? resolve(args.resolveDir, args.path) : require.resolve(args.path),
        namespace: 'fixture-css',
      }));
      builder.onLoad({ filter: /.*/, namespace: 'fixture-css' }, (args) => {
        styles.set(args.path, compiledStyles.get(args.path) ?? readFileSync(args.path, 'utf8'));
        return { contents: '', loader: 'js' };
      });
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
        result.css.forEach((css, index) => compiledStyles.set(`${args.path}?astro&type=style&index=${index}&lang.css`, css));
        return { contents: result.code, loader: 'ts', resolveDir: dirname(args.path) };
      });
    } }],
  });
  const code = compiled.outputFiles[0].text + '\n//# sourceURL=aft-daily-editorial-fixture.mjs';
  const component = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  const container = await AstroContainer.create({ resolve: async () => '/fixture-component.js' });
  container.addServerRenderer({ name: '@astrojs/react', renderer: component.renderer });
  container.addClientRenderer({ name: '@astrojs/react', entrypoint: '/fixture-renderer.js' });
  const markup = await container.renderToString(component.default, {
    request: new Request(`https://accessfreetools.com/blog/${article.slug}/`), partial: false, props: { article },
  });
  const defaultLayoutHtml = options.advertisingMode ? await container.renderToString(component.baseLayout, {
    request: new Request(`https://accessfreetools.com/blog/${article.slug}/`), partial: false,
    props: { title: 'Ordinary layout fixture', description: 'Offline advertising control fixture.', path: `/blog/${article.slug}/` },
  }) : undefined;
  const css = [...styles.values()].join('\n');
  const html = markup.replace('</head>', `<style data-fixture-real-css>${css}</style></head>`);
  return { html, defaultLayoutHtml, dates: component.getBlogDates(article.slug), search: component.getBlogSearchIndex(),
    sitemap: component.blogSitemapEntries, images: component.editorialArticleImages,
    feed: await component.feed().text() };
}
