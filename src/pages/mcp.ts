import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import type { APIRoute } from 'astro';
import { createAccessFreeToolsMcpServer } from '../lib/aftMcpServer';

export const prerender = false;

function mcpMethodNotAllowed() {
  return new Response(
    JSON.stringify({
      error: {
        code: -32000,
        message: 'Method not allowed.',
      },
      id: null,
      jsonrpc: '2.0',
    }),
    {
      status: 405,
      headers: {
        'cache-control': 'no-store',
        'content-type': 'application/json',
      },
    },
  );
}

function noStoreResponse(response: Response) {
  const headers = new Headers(response.headers);
  headers.set('cache-control', 'no-store');

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export const POST: APIRoute = async ({ request }) => {
  const server = createAccessFreeToolsMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    enableJsonResponse: true,
    sessionIdGenerator: undefined,
  });

  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request);
    await transport.close();
    await server.close();
    return noStoreResponse(response);
  } catch {
    await transport.close();
    await server.close();
    return new Response(
      JSON.stringify({
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
        jsonrpc: '2.0',
      }),
      {
        status: 500,
        headers: {
          'cache-control': 'no-store',
          'content-type': 'application/json',
        },
      },
    );
  }
};

export const GET: APIRoute = () => mcpMethodNotAllowed();
export const DELETE: APIRoute = () => mcpMethodNotAllowed();
