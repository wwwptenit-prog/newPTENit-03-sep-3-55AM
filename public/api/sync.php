<?php
/**
 * PTENit & Order Boss — Server Data Synchronization & Persistence Engine
 * Supports standard cPanel Apache & PHP 7.4 / 8.0 / 8.1 / 8.2 / 8.3 / 8.4
 * Stores data safely in public_html/server_data/*.json
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = dirname(__DIR__) . '/server_data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
    @chmod($dataDir, 0777);
}

// Helper to sanitize collection and document IDs (only alphanumeric, dashes, underscores)
function sanitizePathSegment($segment) {
    return preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$segment);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$collection = isset($_GET['collection']) ? sanitizePathSegment($_GET['collection']) : '';

// 1. GET: Fetch Collection or Document Data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (empty($collection)) {
        // Status / Health Check
        echo json_encode([
            'status' => 'online',
            'server' => 'cPanel PHP Sync Engine',
            'timestamp' => date('c'),
            'storage_dir' => is_writable($dataDir) ? 'writable' : 'readonly'
        ]);
        exit;
    }

    $docId = isset($_GET['id']) ? sanitizePathSegment($_GET['id']) : '';
    $collectionFile = $dataDir . '/' . $collection . '.json';

    if (!empty($docId)) {
        // Fetch specific document
        $docFile = $dataDir . '/' . $collection . '/' . $docId . '.json';
        if (file_exists($docFile)) {
            echo file_get_contents($docFile);
            exit;
        }
        // Fallback: check inside collection array
        if (file_exists($collectionFile)) {
            $items = json_decode(file_get_contents($collectionFile), true) ?: [];
            foreach ($items as $item) {
                if (isset($item['id']) && $item['id'] === $docId) {
                    echo json_encode($item);
                    exit;
                }
            }
        }
        http_response_code(404);
        echo json_encode(['error' => 'Document not found', 'collection' => $collection, 'id' => $docId]);
        exit;
    }

    // Return entire collection
    if (file_exists($collectionFile)) {
        echo file_get_contents($collectionFile);
    } else {
        echo json_encode([]);
    }
    exit;
}

// 2. POST / PUT: Save / Update Document or Batch Collection
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if (!$payload || !is_array($payload)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON payload received']);
        exit;
    }

    $targetCollection = !empty($collection) ? $collection : sanitizePathSegment(isset($payload['collection']) ? $payload['collection'] : '');
    $docId = sanitizePathSegment(isset($payload['docId']) ? $payload['docId'] : (isset($payload['id']) ? $payload['id'] : ''));
    $data = isset($payload['data']) ? $payload['data'] : $payload;

    if (empty($targetCollection)) {
        http_response_code(400);
        echo json_encode(['error' => 'Collection name is required']);
        exit;
    }

    // Check if this is a bulk collection update (e.g. { collection: "courses", items: [...] })
    if (isset($payload['items']) && is_array($payload['items'])) {
        $collectionFile = $dataDir . '/' . $targetCollection . '.json';
        file_put_contents($collectionFile, json_encode($payload['items'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
        @chmod($collectionFile, 0666);
        echo json_encode([
            'success' => true,
            'collection' => $targetCollection,
            'items_count' => count($payload['items']),
            'timestamp' => date('c')
        ]);
        exit;
    }

    if (empty($docId) && isset($data['id'])) {
        $docId = sanitizePathSegment($data['id']);
    }

    if (empty($docId)) {
        $docId = 'doc_' . time() . '_' . mt_rand(100, 999);
    }

    // 1. Save individual document file in server_data/{collection}/{docId}.json
    $subDir = $dataDir . '/' . $targetCollection;
    if (!is_dir($subDir)) {
        @mkdir($subDir, 0777, true);
        @chmod($subDir, 0777);
    }

    $data['_server_saved_at'] = date('c');
    $data['id'] = $docId;
    $docFile = $subDir . '/' . $docId . '.json';
    file_put_contents($docFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    @chmod($docFile, 0666);

    // 2. Update master collection JSON file: server_data/{collection}.json
    $collectionFile = $dataDir . '/' . $targetCollection . '.json';
    $existingItems = [];
    if (file_exists($collectionFile)) {
        $decoded = json_decode(file_get_contents($collectionFile), true);
        if (is_array($decoded)) {
            $existingItems = $decoded;
        }
    }

    // Merge or insert document
    $found = false;
    foreach ($existingItems as $idx => $item) {
        if (isset($item['id']) && $item['id'] === $docId) {
            $existingItems[$idx] = array_merge($item, $data);
            $found = true;
            break;
        }
    }
    if (!$found) {
        array_unshift($existingItems, $data);
    }

    file_put_contents($collectionFile, json_encode($existingItems, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    @chmod($collectionFile, 0666);

    echo json_encode([
        'success' => true,
        'message' => 'Data successfully saved to server storage',
        'collection' => $targetCollection,
        'docId' => $docId,
        'timestamp' => date('c')
    ]);
    exit;
}

// 3. DELETE: Remove Document from Server
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $docId = isset($_GET['id']) ? sanitizePathSegment($_GET['id']) : '';
    if (empty($collection) || empty($docId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Collection and docId required for delete']);
        exit;
    }

    $docFile = $dataDir . '/' . $collection . '/' . $docId . '.json';
    if (file_exists($docFile)) {
        @unlink($docFile);
    }

    $collectionFile = $dataDir . '/' . $collection . '.json';
    if (file_exists($collectionFile)) {
        $existingItems = json_decode(file_get_contents($collectionFile), true) ?: [];
        $filtered = array_values(array_filter($existingItems, function($i) use ($docId) {
            return !isset($i['id']) || $i['id'] !== $docId;
        }));
        file_put_contents($collectionFile, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    }

    echo json_encode(['success' => true, 'deleted' => $collection . '/' . $docId]);
    exit;
}
