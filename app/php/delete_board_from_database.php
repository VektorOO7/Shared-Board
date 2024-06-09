<?php
header('Content-Type: application/json');
session_start();

try {
    require_once("../db/db.php");
} catch (PDOException $exc) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to make a connection to database!"]);
    exit();
}

try {
    $db = new DB();
    $connection = $db->getConnection();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['board_id']) || !isset($input['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Board ID and User ID are required']);
    exit();
}

$board_id = $input['board_id'];
$user_id = $input['user_id'];

function deleteDirectory($dir) {
    if (!file_exists($dir)) {
        return true;
    }

    if (!is_dir($dir)) {
        return unlink($dir);
    }

    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }

        $path = $dir . DIRECTORY_SEPARATOR . $item;
        if (is_dir($path)) {
            deleteDirectory($path);
        } else {
            unlink($path);
        }
    }

    return rmdir($dir);
}

try {
    $stmt = $connection->prepare('SELECT user_id, board_title FROM boards WHERE board_id = :board_id');
    $stmt->execute(['board_id' => $board_id]);
    $board = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$board || $board['user_id'] !== $user_id) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit();
    }

    $stmt = $connection->prepare('DELETE FROM notes WHERE board_id = :board_id');
    $stmt->execute(['board_id' => $board_id]);

    $stmt = $connection->prepare('DELETE FROM boards WHERE board_id = :board_id');
    $stmt->execute(['board_id' => $board_id]);

    $dir_path = realpath(dirname(__FILE__) . "/../.data/{$board_id}");
    if (is_dir($dir_path)) {
        if (deleteDirectory($dir_path)) {
            echo json_encode(['success' => true, 'message' => 'Board and associated notes and files deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete the directory']);
        }
    } else {
        echo json_encode(['success' => true, 'message' => 'Board and associated notes deleted, but no directory found']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
