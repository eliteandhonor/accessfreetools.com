import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { transform } from '@astrojs/compiler-rs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// Compile only the selected page and its layout into memory, never dist or an app server.
export async function renderAdminShell(name: string, path: string) {
  const require = createRequire(import.meta.url);
  const styles = [readFileSync(resolve('src/styles/global.css'), 'utf8')];
  const compiled = await build({
    stdin: { contents: `export { default } from './src/pages/${name}.astro'; export { default as renderer } from '@astrojs/react/server.js';`,
      resolveDir: process.cwd() }, bundle: true, write: false,
    platform: 'node', format: 'esm', jsx: 'automatic', define: { 'import.meta.env': '{}' },
    plugins: [{ name: 'private-shell-fixture', setup(builder) {
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
        styles.push(...result.css);
        return { contents: result.code, loader: 'ts', resolveDir: dirname(args.path) };
      });
    } }],
  });
  const code = compiled.outputFiles[0].text + '\n//# sourceURL=aft-admin-shell-fixture.mjs';
  const component = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  const container = await AstroContainer.create({ resolve: async () => '/fixture-component.js' });
  container.addServerRenderer({ name: '@astrojs/react', renderer: component.renderer });
  container.addClientRenderer({ name: '@astrojs/react', entrypoint: '/fixture-renderer.js' });
  const html = await container.renderToString(component.default, { request: new Request(`https://admin-fixture.invalid${path}`), partial: false });
  return html.replace('</head>', `<style>${styles.join('\n')}</style></head>`);
}
