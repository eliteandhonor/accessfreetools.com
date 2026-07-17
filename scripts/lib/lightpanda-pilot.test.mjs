import { describe, expect, it, vi } from 'vitest';

import {
  CleanupStack,
  FIXED_CONTENT_ROUTES,
  FIXED_CORE_ROUTES,
  FIXED_TOOL_ROUTES,
  LIGHTPANDA_IMAGE,
  PILOT_USER_AGENT,
  buildLightpandaDockerArgs,
  compareSnapshots,
  hasSensitiveReportData,
  isAllowedPilotRequest,
  normalizeSnapshot,
  redactReport,
  selectPilotRoutes,
} from './lightpanda-pilot.mjs';

function sitemapFixture() {
  return [
    ...FIXED_CORE_ROUTES,
    ...FIXED_TOOL_ROUTES,
    ...FIXED_CONTENT_ROUTES,
    ...Array.from({ length: 40 }, (_, index) => `/tools/fixture-tool-${String(index).padStart(2, '0')}/`),
    ...Array.from({ length: 30 }, (_, index) => `/blog/fixture-guide-${String(index).padStart(2, '0')}/`),
    ...Array.from({ length: 20 }, (_, index) => `/categories/fixture-${String(index).padStart(2, '0')}/`),
  ];
}

describe('Lightpanda pilot route sampling', () => {
  it('selects the same 50 unique routes with the required category counts', () => {
    const first = selectPilotRoutes(sitemapFixture());
    const second = selectPilotRoutes([...sitemapFixture()].reverse());

    expect(first).toEqual(second);
    expect(first.routes).toHaveLength(50);
    expect(new Set(first.routes).size).toBe(50);
    expect(first.core).toHaveLength(10);
    expect(first.tools).toHaveLength(20);
    expect(first.content).toHaveLength(15);
    expect(first.remaining).toHaveLength(5);
    expect(first.routes).toEqual(expect.arrayContaining([...FIXED_CORE_ROUTES, ...FIXED_TOOL_ROUTES, ...FIXED_CONTENT_ROUTES]));
  });

  it('fails closed when a required route is not in the built sitemap', () => {
    const routes = sitemapFixture().filter((route) => route !== '/ask/');
    expect(() => selectPilotRoutes(routes)).toThrow('/ask/');
  });
});

describe('Lightpanda request boundary', () => {
  const origin = 'http://host.docker.internal:4321';

  it('allows only the selected local preview origin and inert document URLs', () => {
    expect(isAllowedPilotRequest(`${origin}/tools/percentage-calculator/`, origin)).toBe(true);
    expect(isAllowedPilotRequest('data:text/plain,ok', origin)).toBe(true);
    expect(isAllowedPilotRequest('about:blank', origin)).toBe(true);
    expect(isAllowedPilotRequest('https://www.clarity.ms/tag/example', origin)).toBe(false);
    expect(isAllowedPilotRequest('https://accessfreetools.com/', origin)).toBe(false);
    expect(isAllowedPilotRequest('http://user:pass@host.docker.internal:4321/', origin)).toBe(false);
    expect(isAllowedPilotRequest('http://host.docker.internal:9999/', origin)).toBe(false);
  });
});

describe('Lightpanda parity scoring', () => {
  it('normalizes volatile text while preserving metadata and SEO differences', () => {
    const chromium = normalizeSnapshot({
      canonical: 'https://accessfreetools.com/tools/example/',
      description: 'A useful   example.',
      finalUrl: 'http://127.0.0.1:4321/tools/example/?ignored=yes',
      h1: [' Example Tool '],
      internalLinks: [
        'http://127.0.0.1:4321/tools/',
        'http://127.0.0.1:4321/blog/#guides',
        'https://github.com/lightpanda-io/browser',
      ],
      jsonLdCount: 2,
      jsonLdInvalid: 0,
      jsonLdTypes: ['WebApplication', 'BreadcrumbList'],
      language: 'EN',
      mainText: 'One two three four',
      robots: 'index, follow',
      status: 200,
      title: 'Example Tool',
    });
    const lightpanda = normalizeSnapshot({
      ...chromium,
      canonical: 'https://www.accessfreetools.com/tools/example/',
      finalUrl: 'http://host.docker.internal:4321/tools/example/',
      internalLinks: ['/blog/', '/tools/'],
      mainText: 'One two three four',
    });

    const comparison = compareSnapshots(chromium, lightpanda);
    expect(comparison.criticalMetadataMatch).toBe(true);
    expect(comparison.internalLinkJaccard).toBe(1);
    expect(comparison.mainWordCountDifferenceRatio).toBe(0);
  });

  it('flags metadata, links, and content outside the acceptance thresholds', () => {
    const chromium = normalizeSnapshot({
      canonical: '/one/',
      description: 'One',
      finalUrl: '/one/',
      h1: ['One'],
      internalLinks: ['/a/', '/b/'],
      jsonLdCount: 1,
      jsonLdInvalid: 0,
      jsonLdTypes: ['WebPage'],
      language: 'en',
      mainText: 'one two three four five six seven eight nine ten',
      robots: 'index,follow',
      status: 200,
      title: 'One',
    });
    const lightpanda = normalizeSnapshot({
      ...chromium,
      description: 'Different',
      internalLinks: ['/a/'],
      mainText: 'one two three',
    });
    const comparison = compareSnapshots(chromium, lightpanda);

    expect(comparison.criticalMetadataMatch).toBe(false);
    expect(comparison.exactMismatches).toContain('description');
    expect(comparison.internalLinksPass).toBe(false);
    expect(comparison.mainContentPass).toBe(false);
  });
});

describe('Lightpanda Docker isolation', () => {
  it('pins the image and applies the required container hardening', () => {
    const args = buildLightpandaDockerArgs({
      cdpPort: 9333,
      containerName: 'aft-lightpanda-test',
      previewPort: 4321,
    });
    const joined = args.join(' ');

    expect(args).toContain(LIGHTPANDA_IMAGE);
    expect(joined).toContain('--publish 127.0.0.1:9333:9222');
    expect(joined).toContain('--cap-drop ALL');
    expect(joined).toContain('--security-opt no-new-privileges:true');
    expect(joined).toContain('--memory 512m');
    expect(joined).toContain('--cpus 2');
    expect(joined).toContain('--pids-limit 256');
    expect(joined).toContain('--ulimit core=0:0');
    expect(joined).toContain('LIGHTPANDA_DISABLE_TELEMETRY=true');
    expect(joined).toContain('--storage-engine none');
    expect(joined).toContain(`--user-agent ${PILOT_USER_AGENT}`);
    expect(joined).not.toMatch(/--volume|-v\s|--cookie(?:\s|=)|--cookie-jar/);
  });
});

describe('Lightpanda report safety and cleanup', () => {
  it('redacts credentials, tokens, cookies, and query secrets', () => {
    const redacted = redactReport({
      authorization: 'Bearer this-should-not-remain',
      nested: {
        cookie: 'sid=123',
        error: 'request failed at https://example.test/?token=abc123&next=1',
      },
      route: '/tools/example/',
    });

    expect(redacted.authorization).toBe('[redacted]');
    expect(redacted.nested.cookie).toBe('[redacted]');
    expect(redacted.nested.error).toContain('token=[redacted]');
    expect(redacted.route).toBe('/tools/example/');
    expect(hasSensitiveReportData(redacted)).toBe(false);
    expect(redactReport('/blog/free-ai-skills-open-source-tools-organic-growth/')).toBe(
      '/blog/free-ai-skills-open-source-tools-organic-growth/',
    );
  });

  it('runs all cleanup callbacks in reverse order after a simulated failure', async () => {
    const calls = [];
    const cleanup = new CleanupStack();
    cleanup.add(async () => calls.push('preview'));
    cleanup.add(async () => {
      calls.push('container');
      throw new Error('simulated stop failure');
    });
    cleanup.add(async () => calls.push('browser'));

    const errors = await cleanup.dispose();
    expect(calls).toEqual(['browser', 'container', 'preview']);
    expect(errors).toEqual(['simulated stop failure']);
  });

  it('can be spied on without mutating process state', async () => {
    const callback = vi.fn();
    const cleanup = new CleanupStack();
    cleanup.add(callback);
    await cleanup.dispose();
    expect(callback).toHaveBeenCalledOnce();
  });
});
