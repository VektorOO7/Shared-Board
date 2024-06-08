<?php

header('Content-Type: application/json');
session_start();

function readJsonFile($boardId, $board_title){
    $filePath = "../.data/".$boardId."/".$board_title.".json";
    if (!file_exists($filePath)) {
        return [
            'success' => false,
            'message' => 'File not found',
            'fpath' => $filePath
        ];
    }
    $fileContent = file_get_contents($filePath);

    // Encode the file content in base64!!!
    $encodedContent = base64_encode($fileContent);

    return [
        'success' => true,
        'file' => $encodedContent

    ];
}

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
if (isset($_GET['board'])) {
    $boardId = $_GET['board'];
    $stmt = $connection->prepare('SELECT board_title, user_id FROM boards WHERE board_id = :id');
    $stmt->execute(['id' => $boardId]);
    $board = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($board) {
        
        if ($board['user_id'] == $user_id) {
            $board_title = $board['board_title'];
            $result = readJsonFile($boardId, $board_title);
            echo json_encode($result);
        } else {
            echo json_encode(['success' => false, 'error' => 'User not authorized to view this board']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Board not found']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No board ID provided']);
}

