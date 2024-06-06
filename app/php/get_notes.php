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

// Validate input
if (!isset($_GET['board_id'])) {
    echo json_encode(['success' => false, 'message' => 'Board ID is required']);
    exit();
}

$board_id = $_GET['board_id'];

try {
    $stmt = $connection->prepare('SELECT * FROM notes WHERE board_id = :board_id');
    $stmt->execute(['board_id' => $board_id]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'notes' => $notes]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

