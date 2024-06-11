<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    try {
        require_once("../db/db.php");
    } catch (PDOException $exc) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to make a connection to database!"]);

        exit();
    }

    $inputData = json_decode(file_get_contents("php://input"), true);

    if (!isset($inputData['boardId'])) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid input data!"]);

        exit();
    }

    $boardId = $inputData['boardId'];

    try {
        $db = new DB();
        $conn = $db->getConnection();

        $sql = "SELECT COUNT(*) as count FROM Boards WHERE board_id = ?";
        $stmnt = $conn->prepare($sql);
        $stmnt->execute([$boardId]);

        $result = $stmnt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] > 0) {
            echo json_encode(["success" => false, "message" => "Board ID already exists"]);
        } else {
            echo json_encode(["success" => true, "message" => "Board ID is available"]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        error_log("PDO Error: " . print_r($e->errorInfo, true));
        echo json_encode(["message" => "Failed to connect to database!"]);
    }

?>