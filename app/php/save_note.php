<?php
header('Content-Type: application/json');

// Database connection
try {
    require_once("../db/db.php");
} catch (PDOException $exc) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to make a connection to database!"]);
}

try {
    $db = new DB();
    $connection = $db->getConnection();
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Decode the JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit();
}

// Validate the input
$title = $input['title'] ?? null;
$text = $input['text'] ?? null;
$board_id = $input['board_id'] ?? null;

if (!$title || !$text || !$board_id) {
    echo json_encode(['success' => false, 'message' => 'Title, text, and board_id are required']);
    exit();
}

try {
    $stmt = $connection->prepare('INSERT INTO notes (title, text, board_id) VALUES (:title, :text, :board_id)');
    $stmt->execute(['title' => $title, 'text' => $text, 'board_id' => $board_id]);

    echo json_encode(['success' => true, 'message' => 'Note saved successfully', 'note' => ['id' => $connection->lastInsertId(), 'title' => $title, 'text' => $text, 'board_id' => $board_id]]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

