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

// Check if the user is the owner of the board
try {
    $stmt = $connection->prepare('SELECT user_id FROM boards WHERE board_id = :board_id');
    $stmt->execute(['board_id' => $board_id]);
    $board = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$board || $board['user_id'] !== $user_id) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit();
    }

    // Delete notes associated with the board
    $stmt = $connection->prepare('DELETE FROM notes WHERE board_id = :board_id');
    $stmt->execute(['board_id' => $board_id]);

    // Delete the board
    $stmt = $connection->prepare('DELETE FROM boards WHERE board_id = :board_id');
    $stmt->execute(['board_id' => $board_id]);

    echo json_encode(['success' => true, 'message' => 'Board and associated notes deleted successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
