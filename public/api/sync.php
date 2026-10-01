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

// 0. Handle Email Verification Code Dispatch (cPanel PHP mail)
if ($action === 'send_verification_email') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true) ?: [];
    $to = isset($payload['email']) ? trim($payload['email']) : '';
    $code = isset($payload['code']) ? trim($payload['code']) : '';
    $name = isset($payload['name']) ? trim($payload['name']) : 'সম্মানিত ইউজার';

    if (!empty($to) && !empty($code) && filter_var($to, FILTER_VALIDATE_EMAIL)) {
        $subject = "=?UTF-8?B?" . base64_encode("[PTENit] আপনার একাউন্ট ভেরিফিকেশন কোড: " . $code) . "?=";
        $serverHost = isset($_SERVER['SERVER_NAME']) && !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'ptenit.com';
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: PTENit Security <noreply@" . $serverHost . ">\r\n";
        $headers .= "Reply-To: support@" . $serverHost . "\r\n";

        $body = '<div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff;">'
              . '<div style="text-align: center; margin-bottom: 20px;"><h2 style="color: #006A4E; margin: 0;">PTEN<span style="color: #047857;">it</span></h2><p style="color: #64748b; font-size: 13px;">অ্যাকাউন্ট ভেরিফিকেশন</p></div>'
              . '<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px; text-align: center;">'
              . '<p style="color: #166534; font-size: 14px; margin: 0 0 10px 0;">আসসালামু আলাইকুম <strong>' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</strong>,</p>'
              . '<p style="color: #334155; font-size: 13px; margin: 0;">আপনার অ্যাকাউন্ট ভেরিফাই করতে নিচের ৬-সংখ্যার কোডটি ব্যবহার করুন:</p>'
              . '<div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #006A4E; background: #ffffff; border: 2px dashed #006A4E; padding: 10px 24px; border-radius: 8px; display: inline-block; margin: 16px 0;">' . htmlspecialchars($code, ENT_QUOTES, 'UTF-8') . '</div>'
              . '<p style="color: #64748b; font-size: 12px; margin: 0;">কোডটি আগামী ১০ মিনিটের জন্য কার্যকর থাকবে।</p>'
              . '</div>'
              . '</div>';

        @mail($to, $subject, $body, $headers);
        echo json_encode(['success' => true, 'message' => 'Email sent successfully', 'recipient' => $to]);
        exit;
    }
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email or code']);
    exit;
}

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
        $content = file_get_contents($collectionFile);
        if (!empty($content)) {
            echo $content;
            exit;
        }
    }
    echo json_encode([]);
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

    $data['_server_saved_at'] = date('c');
    $data['id'] = $docId;

    // Update master collection JSON file: server_data/{collection}.json
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
