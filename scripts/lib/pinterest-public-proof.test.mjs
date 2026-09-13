import { describe, expect, it } from 'vitest';

import {
  buildPinterestBoardFeedRequest,
  collectPinterestPublicProof,
  mergePinterestProof,
  parsePinterestBoardHtml,
  parsePinterestBoardFeedResponse,
} from './pinterest-public-proof.mjs';

function boardHtml(pins, nextBookmark = '-end-') {
  const resourceKey = JSON.stringify([
    ['board_id', '123'],
    ['page_size', 15],
  ]);
  return `<script id="__PWS_INITIAL_PROPS__" type="application/json">${JSON.stringify({
    initialReduxState: {
      resources: {
        BoardFeedResource: {
          [resourceKey]: {
            data: pins,
            nextBookmark,
          },
        },
      },
    },
  })}</script>`;
}

function pin({
  id,
  slug,
  boardSlug = 'finance-calculators',
  boardTitle = 'Finance Calculators',
  link,
  owner = 'accessfreetools',
}) {
  return {
    type: 'pin',
    id,
    link: link ?? `https://accessfreetools.com/tools/${slug}/`,
    grid_title: `${slug} title`,
    seo_alt_text: `${slug} alt text`,
    board: {
      url: `/accessfreetools/${boardSlug}/`,
      name: boardTitle,
      owner: { username: owner },
    },
  };
}

const apps = [
  {
    slug: 'interest-calculator',
    status: 'rss-ready',
    boardSlug: 'finance-calculators',
    boardTitle: 'Finance Calculators',
  },
  {
    slug: 'salary-calculator',
    status: 'posted',
    boardSlug: 'finance-calculators',
    boardTitle: 'Finance Calculators',
  },
];

function parse(pins) {
  return parsePinterestBoardHtml({
    html: boardHtml(pins),
    boardSlug: 'finance-calculators',
    boardTitle: 'Finance Calculators',
  });
}

describe('Pinterest public proof scanner', () => {
  it('parses an exact public Pin and canonical tool destination', () => {
    const board = parse([pin({ id: '123', slug: 'interest-calculator' })]);
    const report = collectPinterestPublicProof({ boardResults: [board], apps });

    expect(report.hardIssues).toEqual([]);
    expect(report.importable).toMatchObject([
      {
        slug: 'interest-calculator',
        pinUrl: 'https://au.pinterest.com/pin/123/',
        destination: 'https://accessfreetools.com/tools/interest-calculator/',
      },
    ]);
  });

  it('builds the public Edge board pagination request with the current bookmark', () => {
    const request = buildPinterestBoardFeedRequest({
      boardPath: '/accessfreetools/finance-calculators/',
      resourceOptions: { board_id: '123', page_size: 15 },
      bookmark: 'next-page',
      appVersion: 'abc123',
      now: 42,
    });
    const url = new URL(request.url);
    const data = JSON.parse(url.searchParams.get('data'));

    expect(url.pathname).toBe('/resource/BoardFeedResource/get/');
    expect(url.searchParams.get('source_url')).toBe('/accessfreetools/finance-calculators/');
    expect(data.options.bookmarks).toEqual(['next-page']);
    expect(request.headers['x-app-version']).toBe('abc123');
    expect(request.headers['x-pinterest-pws-handler']).toBe('www/[username]/[slug].js');
  });

  it('does not infer completion from ambiguous or invalid initial feed entries', () => {
    const end = { data: [pin({ id: '123', slug: 'interest-calculator' })], nextBookmark: '-end-' };
    for (const resources of [
      {}, { '[]': {} }, { '[]': { data: null, nextBookmark: '-end-' } },
      { '[]': end, '[["other",true]]': end },
    ]) {
      const html = `<script id="__PWS_INITIAL_PROPS__">${JSON.stringify({ initialReduxState: { resources: { BoardFeedResource: resources } } })}</script>`;
      const result = parsePinterestBoardHtml({ html, boardSlug: 'fixture', boardTitle: 'Fixture' });
      expect(result.nextBookmark).toBeNull();
      expect(result.paginationComplete).toBe(false);
    }
  });

  it('parses a paginated public board response with a stable feed offset', () => {
    const page = parsePinterestBoardFeedResponse({
      json: {
        resource_response: {
          status: 'success',
          data: [pin({ id: '555', slug: 'interest-calculator' })],
          bookmark: '-end-',
        },
      },
      boardSlug: 'finance-calculators',
      boardTitle: 'Finance Calculators',
      startIndex: 15,
    });

    expect(page.nextBookmark).toBe('-end-');
    expect(page.pins[0]).toMatchObject({ id: '555', feedIndex: 15 });
  });

  it('uses the requested board when paginated Pins omit repeated board metadata', () => {
    const page = parsePinterestBoardFeedResponse({
      json: {
        resource_response: {
          status: 'success',
          data: [{
            type: 'pin',
            id: '556',
            link: 'https://accessfreetools.com/tools/interest-calculator/',
          }],
          bookmark: '-end-',
        },
      },
      boardSlug: 'finance-calculators',
      boardTitle: 'Finance Calculators',
      startIndex: 16,
    });

    expect(page.pins[0]).toMatchObject({
      boardPath: '/accessfreetools/finance-calculators/',
      boardTitle: 'Finance Calculators',
      ownerUsername: 'accessfreetools',
    });
  });

  it('ignores recommendations and non-tool Access Free Tools links', () => {
    const board = parse([
      pin({ id: '123', slug: 'interest-calculator', link: 'https://example.com/tools/interest-calculator/' }),
      pin({ id: '124', slug: 'interest-calculator', link: 'https://accessfreetools.com/blog/' }),
    ]);
    const report = collectPinterestPublicProof({ boardResults: [board], apps });

    expect(report.discovered).toEqual([]);
    expect(report.skipped.map((item) => item.reason)).toEqual(['external', 'non-tool']);
  });

  it('ignores historical tool Pins outside the current canonical app catalog', () => {
    const board = parse([pin({ id: '123', slug: 'retired-tool' })]);
    const report = collectPinterestPublicProof({ boardResults: [board], apps });

    expect(report.hardIssues).toEqual([]);
    expect(report.skipped).toMatchObject([
      {
        pinId: '123',
        reason: 'non-catalog-tool',
        destination: 'https://accessfreetools.com/tools/retired-tool/',
      },
    ]);
  });

  it('rejects a Pin saved to the wrong board', () => {
    const board = parse([
      pin({ id: '123', slug: 'interest-calculator', boardSlug: 'free-online-calculators' }),
    ]);
    const report = collectPinterestPublicProof({ boardResults: [board], apps });

    expect(report.importable).toEqual([]);
    expect(report.hardIssues[0]).toContain('while scanning');
  });

  it('chooses the newest feed entry when a slug has duplicate Pins', () => {
    const board = parse([
      pin({ id: '200', slug: 'interest-calculator' }),
      pin({ id: '100', slug: 'interest-calculator' }),
    ]);
    const report = collectPinterestPublicProof({ boardResults: [board], apps });

    expect(report.importable[0].pinUrl).toBe('https://au.pinterest.com/pin/200/');
    expect(report.importable[0].duplicatePinUrls).toEqual(['https://au.pinterest.com/pin/100/']);
  });

  it('reports a duplicate Pin id mapped to multiple slugs', () => {
    const board = parse([
      pin({ id: '123', slug: 'interest-calculator' }),
      pin({ id: '123', slug: 'salary-calculator' }),
    ]);
    const report = collectPinterestPublicProof({ boardResults: [board], apps });

    expect(report.hardIssues).toContain('Pin 123 was mapped to both interest-calculator and salary-calculator.');
  });

  it('preserves existing proof and returns stable sorted output without mutation', () => {
    const currentProof = {
      'salary-calculator': {
        publicPinUrl: 'https://au.pinterest.com/pin/999/',
        published: '2026-07-16',
      },
    };
    const snapshot = structuredClone(currentProof);
    const result = mergePinterestProof({
      currentProof,
      candidates: [
        { slug: 'salary-calculator', pinUrl: 'https://au.pinterest.com/pin/888/' },
        { slug: 'interest-calculator', pinUrl: 'https://au.pinterest.com/pin/123/' },
      ],
      published: '2026-07-17',
    });

    expect(currentProof).toEqual(snapshot);
    expect(result.added).toEqual(['interest-calculator']);
    expect(Object.keys(result.proof)).toEqual(['interest-calculator', 'salary-calculator']);
    expect(result.proof['salary-calculator']).toEqual(snapshot['salary-calculator']);
  });
});
