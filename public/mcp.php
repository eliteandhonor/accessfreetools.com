<?php
declare(strict_types=1);

require_once __DIR__ . '/api/v1/aft_api.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    aft_json([
        'ok' => true,
        'name' => 'Access Free Tools MCP',
        'endpoint' => AFT_SITE_ORIGIN . '/mcp',
        'tools' => ['search_tools', 'get_tool_schema', 'run_tool', 'fetch_tool_guide'],
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    aft_json(['jsonrpc' => '2.0', 'error' => ['code' => -32600, 'message' => 'Use POST for MCP JSON-RPC requests.'], 'id' => null], 405);
}

$request = aft_payload();
$id = $request['id'] ?? null;
$method = (string) ($request['method'] ?? '');
$params = is_array($request['params'] ?? null) ? $request['params'] : [];

function mcp_result($id, array $result): void
{
    aft_json(['jsonrpc' => '2.0', 'id' => $id, 'result' => $result]);
}

function mcp_text_result($id, $payload): void
{
    mcp_result($id, ['content' => [['type' => 'text', 'text' => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)]]]);
}

try {
    if ($method === 'initialize') {
        mcp_result($id, [
            'protocolVersion' => '2024-11-05',
            'capabilities' => ['tools' => new stdClass()],
            'serverInfo' => ['name' => 'access-free-tools', 'version' => '0.1.0'],
        ]);
    }

    if ($method === 'tools/list') {
        $tools = [
            ['name' => 'search_tools', 'description' => 'Search Access Free Tools API-ready tools.', 'inputSchema' => aft_schema('object', ['query' => ['type' => 'string']])],
            ['name' => 'get_tool_schema', 'description' => 'Get one tool schema by slug.', 'inputSchema' => aft_schema('object', ['slug' => ['type' => 'string']], ['slug'])],
            ['name' => 'run_tool', 'description' => 'Run one deterministic Access Free Tools utility.', 'inputSchema' => aft_schema('object', ['slug' => ['type' => 'string'], 'input' => ['type' => 'object']], ['slug', 'input'])],
            ['name' => 'fetch_tool_guide', 'description' => 'Return the guide URL for a tool.', 'inputSchema' => aft_schema('object', ['slug' => ['type' => 'string']], ['slug'])],
        ];
        mcp_result($id, ['tools' => $tools]);
    }

    if ($method === 'tools/call') {
        $name = (string) ($params['name'] ?? '');
        $args = is_array($params['arguments'] ?? null) ? $params['arguments'] : [];

        if ($name === 'search_tools') {
            mcp_text_result($id, aft_list_tools((string) ($args['query'] ?? '')));
        }

        if ($name === 'get_tool_schema') {
            $tool = aft_public_tool((string) ($args['slug'] ?? ''));
            if (!$tool) throw new InvalidArgumentException('Tool was not found.');
            mcp_text_result($id, $tool);
        }

        if ($name === 'run_tool') {
            $slug = (string) ($args['slug'] ?? '');
            $input = is_array($args['input'] ?? null) ? $args['input'] : [];
            mcp_text_result($id, ['tool' => aft_public_tool($slug), 'run' => aft_run_tool($slug, $input)]);
        }

        if ($name === 'fetch_tool_guide') {
            $slug = (string) ($args['slug'] ?? '');
            $tool = aft_public_tool($slug);
            if (!$tool) throw new InvalidArgumentException('Tool was not found.');
            mcp_text_result($id, ['slug' => $slug, 'guide_url' => $tool['guide_url'], 'tool_url' => $tool['tool_url']]);
        }
    }

    aft_json(['jsonrpc' => '2.0', 'id' => $id, 'error' => ['code' => -32601, 'message' => 'Unknown MCP method or tool.']], 400);
} catch (Throwable $error) {
    aft_json(['jsonrpc' => '2.0', 'id' => $id, 'error' => ['code' => -32000, 'message' => $error->getMessage()]], 400);
}
