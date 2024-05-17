<?php
//we don't have a database yet
//require_once("../db/db.php");

function isUserDataValid($userData) {
    if (!$userData || !isset($userData["username"]) || 
    !isset($userData["email"]) || !isset($userData["password"])) {
        return ["isValid" => false, "message" => "Некоректни data!"];
    }

    $regex = "/^[a-z0-9_]+@[a-z]+\.[a-z]+$/";

    if (!preg_match($regex, $userData["email"])) {
        return ["isValid" => false, "message" => "Невалиден email!"];
    }

    return ["isValid" => true, "message" => "Данните са валидни!"];
}

$userData = json_decode(file_get_contents("php://input"), true);

$valid = isUserDataValid($userData);
if($valid["isValid"]){
    $userData["password"] = password_hash($userData["password"], PASSWORD_DEFAULT);
    try{
        //modify after proper db is made
        $db = new DB();
        $conn = $db->getConnection();
        $sql = "INSERT INTO users (username, email, password, rows_id) VALUES (?,?,?,?)";
        $stmnt = $conn->prepare($sql);
        $stmnt->execute([$userData["username"], $userData["email"], 
                        $userData["password"], getUsersRoleId($conn)]);
        echo json_encode(["message"=> "Success"]);
    }catch(PDOException $e){
            http_response_code(500);
            if($e->errorInfo[1] == 1062){
                echo json_encode(["message"=> "invalid email"]);
            }
            var_dump($e->errorInfo[1]);
            echo json_encode(["message"=> "Грешка при registratiion"]);
    }
}else{
    http_response_code(400);
    echo json_encode(["message" => $valid["message"]]);
}
