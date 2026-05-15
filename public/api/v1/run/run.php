<?php
declare(strict_types=1);

require_once __DIR__ . '/../aft_api.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    aft_json(['ok' => false, 'message' => 'Use POST to run a tool.'], 405);
}

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
$payload = aft_payload();

try {
    $run = aft_run_tool($slug, $payload);
    aft_json(['ok' => true, 'tool' => aft_public_tool($slug), 'inputs' => $payload, 'run' => $run, 'result' => $run['result']]);
} catch (Throwable $error) {
    aft_json(['ok' => false, 'message' => $error->getMessage()], $error instanceof InvalidArgumentException ? 400 : 500);
}
