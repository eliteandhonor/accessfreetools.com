import type { APIRoute } from 'astro';
import { listApiTools } from '../../lib/apiToolRegistry';
import { setMetadataCache } from '../../lib/apiHttp';

export const prerender = false;

export const GET: APIRoute = ({ cache }) => {
  setMetadataCache(cache);

  const tools = listApiTools();
  const toolSlugEnum = tools.map((tool) => tool.slug);
  const toolSchemas = Object.fromEntries(
    tools.map((tool) => [
      tool.slug,
      {
        description: tool.description,
        value: tool.input_schema,
      },
    ]),
  );

  return new Response(
    JSON.stringify(
      {
        openapi: '3.1.0',
        info: {
          title: 'Access Free Tools API',
          version: '0.1.0-alpha',
          description:
            'Deterministic calculator and utility tools for Access Free Tools. Alpha endpoints may change while the API/MCP layer is tested.',
        },
        servers: [{ url: 'https://accessfreetools.com' }],
        paths: {
          '/api/v1/tools': {
            get: {
              summary: 'List callable Access Free Tools utilities',
              responses: {
                '200': { description: 'Tool list' },
              },
            },
          },
          '/api/v1/tools/{slug}': {
            get: {
              summary: 'Get one tool schema',
              parameters: [{ in: 'path', name: 'slug', required: true, schema: { enum: toolSlugEnum, type: 'string' } }],
              responses: {
                '200': { description: 'Tool schema' },
                '404': { description: 'Tool not found' },
              },
            },
          },
          '/api/v1/run/{slug}': {
            post: {
              summary: 'Run one deterministic tool',
              parameters: [{ in: 'path', name: 'slug', required: true, schema: { enum: toolSlugEnum, type: 'string' } }],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      additionalProperties: true,
                      properties: {
                        inputs: {
                          additionalProperties: true,
                          type: 'object',
                        },
                      },
                      type: 'object',
                    },
                  },
                },
              },
              responses: {
                '200': { description: 'Tool result with answer, steps, warnings, and links' },
                '400': { description: 'Invalid input' },
                '404': { description: 'Tool not found' },
              },
            },
          },
          '/api/v1/ask': {
            post: {
              summary: 'Ask a plain-language utility question',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      properties: {
                        message: { type: 'string' },
                      },
                      required: ['message'],
                      type: 'object',
                    },
                  },
                },
              },
              responses: {
                '200': { description: 'Routed answer from a deterministic tool' },
                '400': { description: 'Question could not be routed or input was invalid' },
              },
            },
          },
          '/mcp': {
            post: {
              summary: 'Stateless Streamable HTTP MCP endpoint',
              responses: {
                '200': { description: 'MCP JSON-RPC response' },
              },
            },
          },
        },
        components: {
          schemas: {
            toolInputs: toolSchemas,
          },
        },
      },
      null,
      2,
    ),
    {
      headers: {
        'cache-control': 'public, max-age=300, stale-while-revalidate=600',
        'content-type': 'application/json',
      },
    },
  );
};
