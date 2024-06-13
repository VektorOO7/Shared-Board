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

function generateCSV($notes) {
    $csv = "Title,Description,File Name,File Type,File Size\n";
    foreach ($notes as $note) {
        $csv .= "{$note['title']},{$note['description']},{$note['file_name']},{$note['file_type']},{$note['file_size']}\n";
    }
    return $csv;
}

function get_board_path($boardId, $boardTitle) {
    return "../.data/" . $boardId . "/" . $boardTitle . ".json";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("Received POST request");

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        error_log("Failed to decode JSON input");
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
        exit();
    }

    $boardId = $input['boardId'];
    $boardTitle = $input['boardTitle'];
    $boardJsonPath = get_board_path($boardId, $boardTitle);

    // Retrieve the board JSON data
    if (file_exists($boardJsonPath)) {
        $boardJson = file_get_contents($boardJsonPath);
        error_log("Board JSON file found: $boardJsonPath");
    } else {
        error_log("Board JSON file not found: $boardJsonPath");
        echo json_encode(['status' => 'error', 'message' => 'Board JSON file not found']);
        exit();
    }

    $notes = getNotes($boardId, $connection);
    error_log("Retrieved " . count($notes) . " notes for board ID: $boardId");

    $zip = new ZipArchive();
    $zipFilename = tempnam(sys_get_temp_dir(), 'board_export_') . '.zip';

    if ($zip->open($zipFilename, ZipArchive::CREATE) !== TRUE) {
        error_log("Unable to create zip file");
        echo json_encode(['status' => 'error', 'message' => 'Unable to create zip file']);
        exit();
    }

    $zip->addFromString('board.json', $boardJson);
    error_log("Added board.json to zip");

    $csvNotes = generateCSV($notes);
    $zip->addFromString('notes.csv', $csvNotes);
    error_log("Added notes.csv to zip");

    foreach ($notes as $note) {
        if (!empty($note['file'])) {
            $zip->addFromString('files/' . $note['file_name'], $note['file']);
            error_log("Added file to zip: " . $note['file_name']);
        }
    }

    $zip->close();
    error_log("Zip file created successfully: $zipFilename");

    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename=' . basename($zipFilename));
    header('Content-Length: ' . filesize($zipFilename));
    readfile($zipFilename);

    unlink($zipFilename);
    error_log("Temporary zip file deleted: $zipFilename");
} else {
    error_log("Invalid request method");
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
