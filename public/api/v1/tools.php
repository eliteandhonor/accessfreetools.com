<?php
declare(strict_types=1);

require_once __DIR__ . '/aft_api.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    aft_json(['ok' => false, 'message' => 'Use GET to list API tools.'], 405);
}

$query = isset($_GET['q']) ? (string) $_GET['q'] : '';
aft_json(['ok' => true, 'tools' => aft_list_tools($query)]);
