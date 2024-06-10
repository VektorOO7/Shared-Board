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

    $inputData = json_decode(file_get_contents("php://input"), true);

    if (!isset($inputData['board_id']) || !isset($inputData['board_share_password']) || !isset($inputData['user_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, "message" => "Invalid input data!", "inputData" => $inputData]);

        exit();
    }

    //error_log("Board Data: " . print_r($inputData, true)); // for debugging purposes

    try {
        $db = new DB();
        $conn = $db->getConnection();

        $stmt = $conn->prepare('SELECT * FROM boards WHERE board_id = :board_id AND board_share_password = :board_share_password');
        $stmt->execute(['board_id' => $input['board_id'], 'board_share_password' => $input['board_share_password']]);
        $board = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$board) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Board not found or invalid share board password']);

            exit();
        }

        $stmt = $conn->prepare('SELECT * FROM shared_boards WHERE board_id = :board_id AND user_id = :user_id');
        $stmt->execute(['board_id' => $input['board_id'], 'user_id' => $input['user_id']]);
        $shared_board = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($shared_board) {
            echo json_encode(['success' => true, 'message' => 'Board already shared']);

            exit();
        }
        
        $stmt = $conn->prepare('INSERT INTO shared_boards (board_id, user_id) VALUES (?, ?)');
        $stmt->execute([$input['board_id'], $input['user_id']]);

        echo json_encode(['success' => true, "message" => "Successfully shared the board in the database!"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, "message" => "Failed to connect to the database: " . $e->getMessage()]);
    }

?>
