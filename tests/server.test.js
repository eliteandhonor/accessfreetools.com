'use strict';

const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('serves the homepage (200)', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('AccessFreeTools');
  });
});

describe('GET /api/tools', () => {
  it('returns a JSON array of tools', async () => {
    const res = await request(app).get('/api/tools');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('each tool has id, name, and path', async () => {
    const { body: tools } = await request(app).get('/api/tools');
    tools.forEach((tool) => {
      expect(tool).toHaveProperty('id');
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('path');
    });
  });
});

describe('Static tool pages', () => {
  const pages = [
    '/tools/base64.html',
    '/tools/url.html',
    '/tools/json.html',
    '/tools/password.html',
    '/tools/word-count.html',
    '/tools/case.html',
  ];

  pages.forEach((page) => {
    it(`serves ${page} (200)`, async () => {
      const res = await request(app).get(page);
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
    });
  });
});

describe('Unknown routes', () => {
  it('falls through to index.html (SPA fallback)', async () => {
    const res = await request(app).get('/this-does-not-exist');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});
