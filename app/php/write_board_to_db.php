<?php
session_start();

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

if (!isset($_SESSION['user'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

$user = $_SESSION['user'];
$user_id = $user['user_id'];  

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        exit();
    }
    //$title = $_POST['title'];
    $owner = $user['username'];
    //$description = $_POST['description'];
    $title = $input['title'];
    $description = $input['description'];
    if (empty($title) || empty($description)) {
        echo json_encode(['success' => false, 'error' => 'Title and description are required']);
        exit();
    }

    try {
        $stmt = $connection->prepare('INSERT INTO boards (title, user_id, content) VALUES (:title, :user_id, :content)');
        $stmt->execute(['title' => $title, 'user_id' => $user_id, 'content' => $description]);
        echo json_encode(['success' => true, 'message' => 'Board saved successfully']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }

} else {
    echo json_encode(['error' => 'Invalid request method']);
}

