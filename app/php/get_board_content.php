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

if (isset($_GET['board'])) {
    $boardId = $_GET['board'];
    $stmt = $connection->prepare('SELECT title, content FROM boards WHERE id = :id');
    $stmt->execute(['id' => $boardId]);
    $board = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($board) {
        echo json_encode($board);
    } else {
        echo json_encode(['error' => 'Board not found']);
    }
} else {
    echo json_encode(['error' => 'No board ID provided']);
}

?>
