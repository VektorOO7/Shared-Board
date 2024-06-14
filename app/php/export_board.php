<?php

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

function getNotes($boardId, $connection) {
    $stmt = $connection->prepare('SELECT title, text AS description, file_name, file, file_type, file_size FROM notes WHERE board_id = ?');
    $stmt->execute([$boardId]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $notes;
}

function generateCSV($boardTitle, $boardDescription, $notes) {
    // First line: board title and description
    $csv = "Board Title,Board Description\n";
    $csv .= "{$boardTitle},{$boardDescription}\n";
    // Second line: headers for notes
    $csv .= "Title,Description,File Name,File Type,File Size,File Base64\n";
    // Subsequent lines: notes data
    foreach ($notes as $note) {
        $fileBase64 = !empty($note['file']) ? base64_encode($note['file']) : '';
        $csv .= "{$note['title']},{$note['description']},{$note['file_name']},{$note['file_type']},{$note['file_size']},{$fileBase64}\n";
    }
    return $csv;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $boardId = $input['boardId'];
    $boardTitle = $input['boardTitle'];
    $boardDescription = $input['boardDesc'];

    $notes = getNotes($boardId, $connection);
    $csvData = generateCSV($boardTitle, $boardDescription, $notes);

    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . $boardTitle . '_notes.csv"');
    echo $csvData;
    exit();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

