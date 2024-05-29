<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// we don't have a database yet
require_once("../db/db.php");

function isUserDataValid($userData) {
    if (!$userData || !isset($userData["username"]) || 
        !isset($userData["email"]) || !isset($userData["password"]) || 
        !isset($userData["c_password"])) {
        return ["isValid" => false, "message" => "Некоректни data!"];
    }

    if($userData["password"] != $userData["c_password"]){
        return ["isValid" => false, "message" => "Паролите не съвпадат!"];
    }

    $regex = "/^[a-z0-9_]+@[a-z]+\.[a-z]+$/";

    if (!preg_match($regex, $userData["email"])) {
        return ["isValid" => false, "message" => "Невалиден email!"];
    }

    return ["isValid" => true, "message" => "Данните са валидни!"];
}

$userData = json_decode(file_get_contents("php://input"), true);

// Debugging: Output form data
error_log("User Data: " . print_r($userData, true));

$valid = isUserDataValid($userData);

if ($valid["isValid"]) {
    $userData["password"] = password_hash($userData["password"], PASSWORD_DEFAULT);
    try {
        // Modify after proper db is made
        $db = new DB();
        $conn = $db->getConnection();
        $sql = "INSERT INTO users (username, email, hashed_password) VALUES (?,?,?)";
        $stmnt = $conn->prepare($sql);
        $stmnt->execute([$userData["username"], $userData["email"], 
                        $userData["password"]]);
        echo json_encode(["message" => "Success"]);
    } catch (PDOException $e) {
        http_response_code(500);
        if ($e->errorInfo[1] == 1062) {
            echo json_encode(["message" => "Invalid email"]);
        }
        error_log("PDO Error: " . print_r($e->errorInfo, true));
        echo json_encode(["message" => "Грешка при registratiion"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => $valid["message"]]);
}

