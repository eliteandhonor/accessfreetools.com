<?php
declare(strict_types=1);

require_once __DIR__ . '/../aft_api.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    aft_json(['ok' => false, 'message' => 'Use GET to read a tool schema.'], 405);
}

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
$tool = aft_public_tool($slug);

if (!$tool) {
    aft_json(['ok' => false, 'message' => 'Tool was not found.'], 404);
}

aft_json(['ok' => true, 'tool' => $tool]);
