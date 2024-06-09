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

$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit();
}

$note_id = $input['note_id'] ?? null;

if (!$note_id) {
    echo json_encode(['success' => false, 'message' => 'Note ID is required']);
    exit();
}

try {
    $stmt = $connection->prepare('DELETE FROM notes WHERE id = :id');
    $stmt->execute(['id' => $note_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Note deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Note not found']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

