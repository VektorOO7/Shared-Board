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

// Validate input
if (!isset($_GET['board_id'])) {
    echo json_encode(['success' => false, 'message' => 'Board ID is required']);
    exit();
}

$board_id = $_GET['board_id'];

try {
    // Retrieve notes
    $stmt = $connection->prepare('SELECT * FROM notes WHERE board_id = :board_id');
    $stmt->execute(['board_id' => $board_id]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Append file data to notes
    foreach ($notes as &$note) {
        $file_id = $note['id'];
        $file_name = $note['file_name'];
        $file_type = $note['file_type'];
        $file_size = $note['file_size'];
        
        // Fetch file content
        $stmt = $connection->prepare('SELECT file FROM notes WHERE id = :file_id');
        $stmt->execute(['file_id' => $file_id]);
        $file_content = $stmt->fetchColumn();

        // Add file details to note
        $note['file'] = [
            'name' => $file_name,
            'type' => $file_type,
            'size' => $file_size,
            'content' => base64_encode($file_content) // Convert binary data to base64 for JSON
        ];
    }

    echo json_encode(['success' => true, 'notes' => $notes]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
