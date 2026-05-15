<?php
declare(strict_types=1);

require_once __DIR__ . '/aft_api.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    aft_json(['ok' => false, 'message' => 'Use POST to ask a tool question.'], 405);
}

$payload = aft_payload();
$message = trim((string) ($payload['message'] ?? ''));

if (strlen($message) < 3) {
    aft_json(['ok' => false, 'message' => 'Ask a clearer tool question with at least a few words.'], 400);
}

$route = aft_try_route($message);

if (!$route) {
    aft_json([
        'ok' => false,
        'message' => 'I could not match that to a live tool yet. Try one of the examples, like "What is 18% of 240?" or "How long will a 5GB file take to download at 80 Mbps?"',
    ], 422);
}

try {
    $run = aft_run_tool($route['tool_slug'], $route['inputs']);
    $tool = aft_public_tool($route['tool_slug']);
    aft_json([
        'ok' => true,
        'answer' => 'I used the ' . $tool['name'] . '. ' . $run['answer'],
        'route' => $route,
        'tool' => $tool,
        'run' => $run,
        'result' => $run['result'],
    ]);
} catch (Throwable $error) {
    aft_json(['ok' => false, 'message' => $error->getMessage()], $error instanceof InvalidArgumentException ? 400 : 500);
}
