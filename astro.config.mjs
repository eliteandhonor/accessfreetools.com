import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://accessfreetools.com',
  output: 'static',
  integrations: [react()],
});
