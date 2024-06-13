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

function getNotes($boardId, $connection) {
    $stmt = $connection->prepare('SELECT title, text AS description, file_name, file, file_type, file_size FROM notes WHERE board_id = ?');
    $stmt->execute([$boardId]);
    $notes = $stmt->fetchAll();
    return $notes;
}

function generateCSV($notes) {
    $csv = "Title,Description,File Name,File Type,File Size\n";
    foreach ($notes as $note) {
        $csv .= "{$note['title']},{$note['description']},{$note['file_name']},{$note['file_type']},{$note['file_size']}\n";
    }
    return $csv;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $boardId = $input['boardId'];
    $boardTitle = $input['boardTitle'];
    $boardJsonPath = $input['boardJsonPath'];

    // Retrieve the board JSON data
    $boardJson = file_get_contents($boardJsonPath);
    $notes = getNotes($boardId, $connection);

    $zip = new ZipArchive();
    $zipFilename = tempnam(sys_get_temp_dir(), 'board_export_') . '.zip';

    if ($zip->open($zipFilename, ZipArchive::CREATE) !== TRUE) {
        exit("Unable to create zip file");
    }

    // Add board JSON file to zip
    $zip->addFromString('board.json', $boardJson);

    // Create CSV of notes and add to zip
    $csvNotes = generateCSV($notes);
    $zip->addFromString('notes.csv', $csvNotes);

    // Add files associated with notes
    foreach ($notes as $note) {
        if (!empty($note['file_name'])) {
            $filePath = $note['file_name'];
            if (file_exists($filePath)) {
                $zip->addFile($filePath, 'files/' . basename($filePath));
            }
        }
    }

    $zip->close();

    header('Content-Type: application/zip');
    header('Content-disposition: attachment; filename=' . basename($zipFilename));
    header('Content-Length: ' . filesize($zipFilename));
    readfile($zipFilename);

    unlink($zipFilename); // Clean up the temporary file
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}


