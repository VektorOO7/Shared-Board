<?php
    
    header('Content-Type: application/json; charset=utf-8');

    try {
        require_once("../db/db.php");
    } catch (PDOException $exc) {
        http_response_code(500);
        echo json_encode(['success' => false, "message" => "Failed to make a connection to database!"]);
        
        exit();
    }

    $inputData = json_decode(file_get_contents("php://input"), true);

    if (!isset($inputData['user_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, "message" => "Invalid input data!"]);

        exit();
    }

    $userId = $inputData['user_id'];

    //error_log("User ID: " . print_r($userId, true)); // for debugging purposes only

    try {
        $db = new DB();
        $conn = $db->getConnection();

        $sql = 'SELECT board_id, board_title, board_desc, board_share_password
                FROM boards
                WHERE user_id = ?

                UNION

                SELECT b.board_id, b.board_title, b.board_desc, b.board_share_password
                FROM boards b JOIN shared_boards sb
                ON b.board_id = sb.board_id
                WHERE sb.user_id = ?;';
        $stmnt = $conn->prepare($sql);
        $stmnt->execute([$userId, $userId]);

        $boardsData = $stmnt->fetchAll(PDO::FETCH_ASSOC);
        $boardCount = count($boardsData);

        echo json_encode(['success' => true, 'boards' => $boardsData, 'count' => $boardCount]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log("PDO Error: " . print_r($e->errorInfo, true));
        echo json_encode(['success' => false, "message" => "Failed to load bords from database!"]);
    }

?>