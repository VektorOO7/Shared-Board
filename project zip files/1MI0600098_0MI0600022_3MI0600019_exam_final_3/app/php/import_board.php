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

function createBoard($title, $description, $boardId, $boardSharePassword, $userId, $connection) {
    // Check if user_id exists in users table
    $stmt = $connection->prepare('SELECT user_id FROM users WHERE user_id = ?');
    $stmt->execute([$userId]);
    if ($stmt->rowCount() == 0) {
        throw new Exception("User ID does not exist in users table");
    }

    $stmt = $connection->prepare('INSERT INTO boards (board_id, board_title, board_desc, board_share_password, user_id) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$boardId, $title, $description, $boardSharePassword, $userId]);
    return $boardId;
}

function saveNote($boardId, $title, $description, $fileName, $fileData, $fileType, $fileSize, $connection) {
    $stmt = $connection->prepare('INSERT INTO notes (board_id, title, text, file_name, file, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$boardId, $title, $description, $fileName, $fileData, $fileType, $fileSize]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csvFile = $_FILES['csv']['tmp_name'];
    $boardId = $_POST['board_id'];
    $boardSharePassword = $_POST['board_share_password'];
    $userId = $_POST['user_id'];

    try {
        if (($handle = fopen($csvFile, 'r')) !== FALSE) {
            $boardDetails = fgetcsv($handle, 1000, ",");
            $boardTitle = $boardDetails[0];
            $boardDescription = $boardDetails[1];

            $boardId = createBoard($boardTitle, $boardDescription, $boardId, $boardSharePassword, $userId, $connection);
            
            error_log("Board created with ID: $boardId");

            if (($headers = fgetcsv($handle, 1000, ",")) !== FALSE) {
                while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                    if (count($headers) != count($data)) {
                        throw new Exception("CSV format error: header count and data count do not match");
                    }

                    $note = array_combine($headers, $data);

                    $title = $note['Title'];
                    $description = $note['Description'];
                    $fileName = $note['File Name'];
                    $fileType = $note['File Type'];
                    $fileSize = $note['File Size'];
                    $fileBase64 = $note['File Base64'];

                    $fileData = !empty($fileBase64) ? base64_decode($fileBase64) : null;

                    saveNote($boardId, $title, $description, $fileName, $fileData, $fileType, $fileSize, $connection);
                }
            }
            fclose($handle);
            echo json_encode(['board_title' => $boardTitle, 'board_description' => $boardDescription]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Unable to read CSV file']);
        }
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
