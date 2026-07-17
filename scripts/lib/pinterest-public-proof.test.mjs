import { describe, expect, it } from 'vitest';

import {
  collectPinterestPublicProof,
  mergePinterestProof,
  parsePinterestBoardHtml,
} from './pinterest-public-proof.mjs';

function boardHtml(pins, nextBookmark = '-end-') {
  return `<script id="__PWS_INITIAL_PROPS__" type="application/json">${JSON.stringify({
    initialReduxState: {
      resources: {
        BoardFeedResource: {
          request: {
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

  it('ignores recommendations and non-tool Access Free Tools links', () => {
    const board = parse([
      pin({ id: '123', slug: 'interest-calculator', link: 'https://example.com/tools/interest-calculator/' }),
      pin({ id: '124', slug: 'interest-calculator', link: 'https://accessfreetools.com/blog/' }),
    ]);
    const report = collectPinterestPublicProof({ boardResults: [board], apps });

    expect(report.discovered).toEqual([]);
    expect(report.skipped.map((item) => item.reason)).toEqual(['external', 'non-tool']);
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
