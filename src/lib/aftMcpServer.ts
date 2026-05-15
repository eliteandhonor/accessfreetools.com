import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod/v4';
import { getApiTool, runApiTool, searchApiTools, serializeApiTool } from './apiToolRegistry';

function jsonText(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function createAccessFreeToolsMcpServer() {
  const server = new McpServer({
    name: 'access-free-tools',
    version: '0.1.0-alpha',
  });

  server.registerTool(
    'search_tools',
    {
      description: 'Search callable Access Free Tools calculators and utilities by keyword.',
      inputSchema: {
        query: z.string().default(''),
      },
    },
    async ({ query }) => ({
      content: [
        {
          text: jsonText({
            ok: true,
            tools: searchApiTools(query).map((tool) => ({
              category: tool.category,
              description: tool.description,
              name: tool.name,
              risk: tool.risk,
              slug: tool.slug,
              tool_url: tool.tool_url,
            })),
          }),
          type: 'text',
        },
      ],
    }),
  );

  server.registerTool(
    'get_tool_schema',
    {
      description: 'Get the input schema, examples, and links for one Access Free Tools utility.',
      inputSchema: {
        slug: z.string(),
      },
    },
    async ({ slug }) => {
      const tool = getApiTool(slug);

      if (!tool) {
        return {
          content: [{ text: `Unknown tool: ${slug}`, type: 'text' }],
          isError: true,
        };
      }

      return {
        content: [{ text: jsonText({ ok: true, tool: serializeApiTool(tool) }), type: 'text' }],
      };
    },
  );

  server.registerTool(
    'run_tool',
    {
      description:
        'Run one deterministic Access Free Tools utility. Use this instead of asking the model to calculate exact utility results manually.',
      inputSchema: {
        inputs: z.record(z.string(), z.unknown()).default({}),
        slug: z.string(),
      },
    },
    async ({ inputs, slug }) => {
      const tool = getApiTool(slug);

      if (!tool) {
        return {
          content: [{ text: `Unknown tool: ${slug}`, type: 'text' }],
          isError: true,
        };
      }

      try {
        const run = runApiTool(slug, inputs);
        return {
          content: [{ text: jsonText({ ok: true, run, tool: serializeApiTool(tool) }), type: 'text' }],
        };
      } catch (error) {
        return {
          content: [{ text: error instanceof Error ? error.message : 'Tool could not run.', type: 'text' }],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'fetch_tool_guide',
    {
      description: 'Return guide and source links for one Access Free Tools utility.',
      inputSchema: {
        slug: z.string(),
      },
    },
    async ({ slug }) => {
      const tool = getApiTool(slug);

      if (!tool) {
        return {
          content: [{ text: `Unknown tool: ${slug}`, type: 'text' }],
          isError: true,
        };
      }

      const publicTool = serializeApiTool(tool);
      return {
        content: [
          {
            text: jsonText({
              ok: true,
              guide_url: publicTool.guide_url,
              summary: publicTool.summary,
              tool_url: publicTool.tool_url,
            }),
            type: 'text',
          },
        ],
      };
    },
  );

  return server;
}
