<?php

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Ensure that DB class is properly included
require_once("../db/db.php");

function loginEmail($userData) {
    try {
        $db = new DB();
        $connection = $db->getConnection();

        $sql = "SELECT * from users where email = ?";
        $stmt = $connection->prepare($sql);
        $stmt->execute([$userData["u_or_e"]]);
        return $stmt;
    } catch (PDOException $exc) {
        error_log(print_r($exc->errorInfo, true)); // Log the error
        throw new Error($exc->getMessage());
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
        error_log(print_r($exc->errorInfo, true)); // Log the error
        throw new Error($exc->getMessage());
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
            echo json_encode(["message" => "Входът е неуспешен"]);
            exit();
        }
        $user = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
        $isPasswordValid = password_verify($userData["password"], $user["hashed_password"]);
        if (!$isPasswordValid) {
            http_response_code(400);
            echo json_encode(["message" => "Входът е неуспешен, грешна парола"]);
            exit();
        }
        session_start();
        $_SESSION["user"] = $user;
        echo json_encode(["message" => "Входът е успешен"]); 

    } catch (Error $exc) {
        http_response_code(500);
        echo json_encode(["message" => "Грешка при вход"]);
    }

} else {
    http_response_code(400);
    echo json_encode(["message" => "Невалидни данни"]);
}
