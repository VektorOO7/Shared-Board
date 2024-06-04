<?php

    // enable error reporting for debugging
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    try {
        require_once("../db/db.php");
    } catch (PDOException $exc) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to make a connection to database!"]);
    }

    function loginEmail($userData) {
        try {
            $db = new DB();
            $connection = $db->getConnection();

            $sql = "SELECT * FROM users WHERE email = ?";
            $stmt = $connection->prepare($sql);
            $stmt->execute([$userData["u_or_e"]]);

            return $stmt;
        } catch (PDOException $exc) {
            error_log(print_r($exc->errorInfo, true));
            echo $exc->errorInfo;
            
            throw $exc;
        }
    }

    function loginUsername($userData) {
        try {
            $db = new DB();
            $connection = $db->getConnection();

            $sql = "SELECT * from users where username = ?";
            $stmt = $connection->prepare($sql);
            $stmt->execute([$userData["u_or_e"]]);

            return $stmt;
        } catch (PDOException $exc) {
            error_log(print_r($exc->errorInfo, true));
            
            throw $exc;
        }
    }

    $userData = json_decode(file_get_contents("php://input"), true);

    if ($userData && isset($userData["u_or_e"]) && isset($userData["password"])) {
        try {
            $stmtEmail = loginEmail($userData);
            $stmtUsername = loginUsername($userData);

            if ($stmtEmail->rowCount() === 1) {
                $stmt = $stmtEmail;
            } else if ($stmtUsername->rowCount() === 1) {
                $stmt = $stmtUsername;
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Login failed!"]);

                exit();
            }

            $user = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            $isPasswordValid = password_verify($userData["password"], $user["hashed_password"]);

            if (!$isPasswordValid) {
                http_response_code(400);
                echo json_encode(["message" => "Login failed, wrong password!"]);

                exit();
            }

            session_start();

            $_SESSION["user"] = $user;
            $cookie_name = "user";
            $cookie_value = json_encode($user);
            $cookie_options = [
                'expires' => time() + 3600,
                'path' => '/',
                'domain' => '',
                'secure' => true,
                'httponly' => true,
                'samesite' => 'Lax'
            ];

            setcookie($cookie_name, $cookie_value, $cookie_options);

            echo json_encode(["message" => "Login successfull!"]); 

        } catch (PDOException $exc) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to connect to database!"]);
        } catch (Error $exc) {
            http_response_code(500);
            echo json_encode(["message" => "Unknown login error!"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid data!"]);
    }

?>