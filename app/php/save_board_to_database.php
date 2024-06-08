<?php
    
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    try {
        require_once("../db/db.php");
    } catch (PDOException $exc) {
        http_response_code(500);
        echo json_encode(['success' => false, "message" => "Failed to make a connection to database!"]);

        exit();
    }

    $boardData = json_decode(file_get_contents("php://input"), true);

    if (!isset($boardData['board_id']) || !isset($boardData['user_id']) || !isset($boardData['board_title'])) {
        http_response_code(400);
        echo json_encode(['success' => false, "message" => "Invalid input data!"]);

        exit();
    }

    // for debugging purposes
    error_log("Board Data: " . print_r($boardData, true));

    try {
        $db = new DB();
        $conn = $db->getConnection();

        $sql = "INSERT INTO boards (board_id, user_id, board_title) VALUES (?,?,?)";
        $stmnt = $conn->prepare($sql);
        $stmnt->execute([$boardData["board_id"], $boardData["user_id"], $boardData["board_title"]]);

        echo json_encode(['success' => true, "message" => "Successfully added the board to the database!"]);
    } catch (PDOException $e) {
        http_response_code(500);

        error_log("PDO Error: " . print_r($e->errorInfo, true));
        echo json_encode(['success' => false, "message" => "Failed to connect to database!"]);
    }

?>
