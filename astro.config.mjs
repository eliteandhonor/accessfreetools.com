import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://accessfreetools.com',
  output: 'server',
  redirects: {
    '/calculators': {
      status: 301,
      destination: '/categories/calculators/',
    },
    '/deep-research': {
      status: 301,
      destination: '/categories/ai-tools/',
    },
    '/advanced-age-calculator': {
      status: 301,
      destination: '/tools/age-calculator/',
    },
    '/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025': {
      status: 301,
      destination: '/tools/ad-revenue-calculator/',
    },
    '/blog/how-to-use-pregnancy-conception-calculator': {
      status: 301,
      destination: '/blog/how-to-use-conception-calculator/',
    },
  },
  adapter: node({
    mode: 'standalone',
    bodySizeLimit: 131072,
  }),
  integrations: [react()],
});
