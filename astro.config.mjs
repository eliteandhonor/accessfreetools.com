import { defineConfig, envField, memoryCache } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://accessfreetools.com',
  output: 'server',
  cache: {
    provider: memoryCache(),
  },
  routeRules: {
    '/api/openapi.json': { maxAge: 300, swr: 600, tags: ['api-metadata'] },
    '/api/v1/tools': { maxAge: 300, swr: 600, tags: ['api-metadata'] },
    '/api/v1/tools/[slug]': { maxAge: 300, swr: 600, tags: ['api-metadata'] },
    '/feed.xml': { maxAge: 300, swr: 3600, tags: ['discovery'] },
    '/llms.txt': { maxAge: 300, swr: 3600, tags: ['discovery'] },
    '/sitemap.xml': { maxAge: 300, swr: 3600, tags: ['sitemap'] },
    '/sitemap-[name].xml': { maxAge: 300, swr: 3600, tags: ['sitemap'] },
  },
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
  },
  adapter: node({
    mode: 'standalone',
    bodySizeLimit: 131072,
  }),
  security: {
    allowedDomains: [{ hostname: 'accessfreetools.com' }, { hostname: 'www.accessfreetools.com' }],
  },
  env: {
    validateSecrets: false,
    schema: {
      AFT_ASK_ENABLED: envField.boolean({ context: 'server', access: 'public', default: true }),
      AFT_API_BETA_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      OLLAMA_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      OLLAMA: envField.string({ context: 'server', access: 'secret', optional: true }),
      OLLAMA_MODEL: envField.string({ context: 'server', access: 'public', optional: true }),
      SMTP_HOST: envField.string({ context: 'server', access: 'public', default: 'smtp.hostinger.com' }),
      SMTP_PORT: envField.number({ context: 'server', access: 'public', default: 465 }),
      SMTP_SECURE: envField.boolean({ context: 'server', access: 'public', default: true }),
      SMTP_USER: envField.string({ context: 'server', access: 'public', default: 'contact@accessfreetools.com' }),
      SMTP_PASS: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'public', default: 'contact@accessfreetools.com' }),
    },
  },
  integrations: [react()],
});
