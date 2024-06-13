<?php
    
    error_reporting(0);
    ini_set('display_errors', 0);

    function get_content($connection, $boardId, $boardTitle, $userId) {
        $result = [];

        try {
            $stmt = $connection->prepare('SELECT * FROM notes WHERE board_id = :board_id');
            $stmt->execute(['board_id' => $boardId]);
            $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($notes as &$note) {
                $file_id = $note['id'];
                $file_name = $note['file_name'];
                $file_type = $note['file_type'];
                $file_size = $note['file_size'];
                
                $stmt = $connection->prepare('SELECT file FROM notes WHERE id = :file_id');
                $stmt->execute(['file_id' => $file_id]);
                $file_content = $stmt->fetchColumn();

                $note['file'] = [
                    'name' => $file_name,
                    'type' => $file_type,
                    'size' => $file_size,
                    'content' => base64_encode($file_content)
                ];
            }

            $result['success'] = true;
            $result['message'] = 'Notes fetched successfully';
            $result['board_title'] = $boardTitle;
            $result['notes'] = $notes;
        } catch (PDOException $e) {
            $result['success'] = false;
            $result['message'] = 'Database error: ' . $e->getMessage();
            $result['board_title'] = 'Error';
        }

        return $result;
    }

    header('Content-Type: application/json');

    session_start();

    try {
        require_once("../db/db.php");
    } catch (PDOException $exc) {
        http_response_code(500);
        echo json_encode(['success' => false, 'board_title' => 'Error', "message" => "Failed to make a connection to database!"]);
    }

    try {
        $db = new DB();
        $connection = $db->getConnection();
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'board_title' => 'Error', 'message' => 'Database connection failed: ' . $e->getMessage()]);

        exit();
    }

    if (!isset($_SESSION['user'])) {
        echo json_encode(['success' => false, 'board_title' => 'Error', 'message' => 'User not logged in']);

        exit();
    }

    $user = $_SESSION['user'];

    if (isset($_GET['board_id'])) { 
        $boardId = $_GET['board_id'];
        $user_id = $user['user_id'];

        try {
            $stmt = $connection->prepare('SELECT board_title, user_id FROM boards WHERE board_id = :id');
            $stmt->execute(['id' => $boardId]);
            $board = $stmt->fetch(PDO::FETCH_ASSOC);

            $stmt = $connection->prepare('SELECT user_id FROM shared_boards WHERE board_id = :board_id');
            $stmt->execute(['board_id' => $boardId]);
            $userIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if ($board) {
                if ($board['user_id'] == $user_id || in_array($user_id, $userIds)) {
                    echo json_encode(get_content($connection, $boardId, $board['board_title'], $user_id));
                } else {
                    echo json_encode(['success' => false, 'board_title' => 'Error', 'message' => 'User not authorized to view this board']);
                }
            } else {
                echo json_encode(['success' => false, 'board_title' => 'Error', 'message' => 'Board not found']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'board_title' => 'Error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'board_title' => 'Error', 'message' => 'No board ID provided']);
    }

?>