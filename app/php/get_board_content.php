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
if (isset($_GET['board'])) {
    $boardId = $_GET['board'];
    $stmt = $connection->prepare('SELECT title, content, user_id FROM boards WHERE id = :id');
    $stmt->execute(['id' => $boardId]);
    $board = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($board) {
        
        if ($board['user_id'] == $user_id) {
           
            echo json_encode([
                'title' => $board['title'],
                'content' => $board['content']
            ]);
        } else {
            echo json_encode(['error' => 'User not authorized to view this board']);
        }
    } else {
        echo json_encode(['error' => 'Board not found']);
    }
} else {
    echo json_encode(['error' => 'No board ID provided']);
}

?>
