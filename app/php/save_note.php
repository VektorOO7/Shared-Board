<?php
header('Content-Type: application/json');

// Database connection
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
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}


// Decode the JSON input
$title = $_POST['title'] ?? null;
$text = $_POST['description'] ?? null;
$board_id = $_POST['board_id'] ?? null;

if (!$title || !$board_id) {
    echo json_encode(['success' => false, 'message' => 'Title and board_id are required']);
    exit();
}

// Validate and handle file upload
if (isset($_FILES['file'])) { 
    $file = $_FILES['file'];
    $fileContent = file_get_contents($file['tmp_name']);
    $fileType = $file['type'];
    $fileSize = $file['size'];
    $fileName = $file['name'];
    try {
        $stmt = $connection->prepare('INSERT INTO notes (title, text, board_id, file_name, file_type, file_size, file) 
        VALUES (:title, :text, :board_id, :file_name, :file_type, :file_size, :file)');
        $stmt->execute([
            'title' => $title,
            'text' => $text,
            'board_id' => $board_id,
            'file_name' => $fileName,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'file' => $fileContent
        ]);
        //debugging
        echo json_encode(['success' => true, 'message' => 'Note saved successfully', 'note' => [
            'id' => $connection->lastInsertId(),
            'title' => $title,
            'text' => $text,
            'board_id' => $board_id,
            'file_name' => $fileName,
            'file_type' => $fileType,
            'file_size' => $fileSize
        ]]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}else{
    try {
        $stmt = $connection->prepare('INSERT INTO notes (title, text, board_id) 
        VALUES (:title, :text, :board_id)');
        $stmt->execute([
            'title' => $title,
            'text' => $text,
            'board_id' => $board_id,
        ]);
        //debugging
        echo json_encode(['success' => true, 'message' => 'Note saved successfully', 'note' => [
            'id' => $connection->lastInsertId(),
            'title' => $title,
            'text' => $text,
            'board_id' => $board_id,
        ]]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }

}




