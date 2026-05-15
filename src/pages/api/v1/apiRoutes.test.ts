import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { POST as askPost } from './ask';
import { POST as runPost } from './run/[slug]';
import { GET as toolsGet } from './tools/index';
import { GET as toolGet } from './tools/[slug]';
import { POST as mcpPost } from '../../mcp';

function request(body?: unknown, headers?: HeadersInit) {
  return new Request('https://accessfreetools.com/api/test', {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: body === undefined ? headers : { 'content-type': 'application/json', ...(headers ?? {}) },
    method: body === undefined ? 'GET' : 'POST',
  });
}

describe('Access Free Tools API routes', () => {
  beforeEach(() => {
    process.env.AFT_ASK_FORCE_FALLBACK = 'true';
  });

  afterEach(() => {
    delete process.env.AFT_ASK_FORCE_FALLBACK;
  });

  it('lists API-ready tools', async () => {
    const response = await toolsGet({ request: request() } as never);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.tools.length).toBeGreaterThanOrEqual(20);
  });

  it('returns one tool schema', async () => {
    const response = await toolGet({ params: { slug: 'percentage-calculator' }, request: request() } as never);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.tool.slug).toBe('percentage-calculator');
  });

  it('runs a deterministic tool', async () => {
    const response = await runPost({
      clientAddress: '127.0.0.1',
      params: { slug: 'percentage-calculator' },
      request: request({ inputs: { mode: 'percent-of', percent: 18, value: 240 } }),
    } as never);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.run.answer).toContain('43.2');
  });

  it('runs a newly API-ready tool', async () => {
    const response = await runPost({
      clientAddress: '127.0.0.1',
      params: { slug: 'binary-calculator' },
      request: request({ inputs: { left: '1011', operator: '+', right: '110' } }),
    } as never);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.run.answer).toContain('10001');
  });

  it('rejects invalid tool input', async () => {
    const response = await runPost({
      clientAddress: '127.0.0.1',
      params: { slug: 'subnet-calculator' },
      request: request({ inputs: { ipAddress: '192.168.1.1', prefixLength: 99 } }),
    } as never);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.issues.length).toBeGreaterThan(0);
  });

  it('routes Ask API through a deterministic tool', async () => {
    const response = await askPost({
      clientAddress: '127.0.0.1',
      request: request({ message: 'Convert 600 watts to amps at 120 volts.' }),
    } as never);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.route.tool_slug).toBe('watts-to-amps-calculator');
    expect(body.run.warnings.join(' ')).toMatch(/electrical code/i);
  });

  it('keeps Ask download-time answers aligned with the deterministic runner format', async () => {
    const response = await askPost({
      clientAddress: '127.0.0.2',
      request: request({ message: 'How long will a 5GB file take to download at 80 Mbps?' }),
    } as never);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.route.tool_slug).toBe('download-time-calculator');
    expect(body.run.answer).toContain('9m 16s');
    expect(body.run.answer).not.toMatch(/555\.?5{3,}/);
  });

  it('runs the same deterministic result through MCP run_tool', async () => {
    const response = await mcpPost({
      request: request(
        {
          id: 1,
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            arguments: {
              inputs: { mode: 'percent-of', percent: 18, value: 240 },
              slug: 'percentage-calculator',
            },
            name: 'run_tool',
          },
        },
        { accept: 'application/json, text/event-stream' },
      ),
    } as never);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(JSON.stringify(body)).toContain('43.2');
  });
});
