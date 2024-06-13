<?php

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

function saveNote($note, $fileData, $fileName, $fileType, $fileSize, $connection) {
    $stmt = $connection->prepare('INSERT INTO notes (board_id, title, text, file_name, file, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $note['board_id'],
        $note['title'],
        $note['description'],
        $fileName,
        $fileData,
        $fileType,
        $fileSize
    ]);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $notes = json_decode($_POST['notes'], true);
    $files = $_FILES['files'];

    foreach ($notes as $note) {
        $fileData = null;
        $fileName = null;
        $fileType = null;
        $fileSize = null;

        if (isset($files['tmp_name'][$note['file_name']])) {
            $fileTmpName = $files['tmp_name'][$note['file_name']];
            $fileData = file_get_contents($fileTmpName);
            $fileName = $files['name'][$note['file_name']];
            $fileType = $files['type'][$note['file_name']];
            $fileSize = $files['size'][$note['file_name']];
        }

        saveNote($note, $fileData, $fileName, $fileType, $fileSize, $connection);
    }

    echo json_encode(['status' => 'success', 'message' => 'Notes imported successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
