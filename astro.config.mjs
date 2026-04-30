import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://accessfreetools.com',
  output: 'server',
  adapter: node({
    mode: 'standalone',
    bodySizeLimit: 131072,
  }),
  integrations: [react()],
});
