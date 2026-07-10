import { describe, expect, it } from 'vitest';
import { POST as mcpPost } from '../../src/pages/mcp';

function mcpRequest(body: unknown) {
  return new Request('https://accessfreetools.com/mcp', {
    body: JSON.stringify(body),
    headers: {
      accept: 'application/json, text/event-stream',
      'content-type': 'application/json',
      'mcp-protocol-version': '2025-06-18',
    },
    method: 'POST',
  });
}

describe('MCP endpoint', () => {
  it('initializes as an Access Free Tools MCP server', async () => {
    const response = await mcpPost({
      request: mcpRequest({
        id: 1,
        jsonrpc: '2.0',
        method: 'initialize',
        params: {
          capabilities: {},
          clientInfo: { name: 'vitest', version: '1.0.0' },
          protocolVersion: '2025-06-18',
        },
      }),
    } as never);
    const body = await response.json();
    expect(body.result.serverInfo.name).toBe('access-free-tools');
  });

  it('lists MCP tools', async () => {
    const response = await mcpPost({
      request: mcpRequest({
        id: 2,
        jsonrpc: '2.0',
        method: 'tools/list',
        params: {},
      }),
    } as never);
    const body = await response.json();
    expect(body.result.tools.map((tool: { name: string }) => tool.name)).toContain('run_tool');
  });
});
