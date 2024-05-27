<?php

function loginEmail($userData) {
    try {
        //needs a database
        $db = new DB();
        $connection = $db->getConnection();

        $sql = "SELECT * from users where email = ?";
        $stmt = $connection->prepare($sql);
        $stmt->execute([$userData["username-or-email-field"]]);

        if ($stmt->rowCount() === 1) {
            $user = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            
            $isPasswordValid = password_verify($userData["password"], $user["password"]);
            if ($isPasswordValid) {
                return $user;
            } else {
                return null;
            }
        } else {
            return null;
        }

    } catch (PDOException $exc) {
        var_dump($exc->errorInfo);

        throw new Error($exc->getMessage());
    }
}

function loginUsername($userData) {
    try {
        //needs a database
        $db = new DB();
        $connection = $db->getConnection();

        $sql = "SELECT * from users where username = ?";
        $stmt = $connection->prepare($sql);
        $stmt->execute([$userData["username-or-email-field"]]);

        if ($stmt->rowCount() === 1) {
            $user = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            
            $isPasswordValid = password_verify($userData["password-field"], $user["password-field"]);
            if ($isPasswordValid) {
                return $user;
            } else {
                return null;
            }
        } else {
            return null;
        }

    } catch (PDOException $exc) {
        var_dump($exc->errorInfo);

        throw new Error($exc->getMessage());
    }
}

$userData = json_decode(file_get_contents(""), true);

if($userData && isset($userData["username-or-email-field"]) && isset($userData["password"])){
    try {
        $userEmail = loginEmail($userData);
        $userUsername = loginUsername($userData);

        if (!$userEmail and !$userUsername) {
            http_response_code(400);
            exit(json_encode(["message" => "Входът е неуспешен"]));
        }

        session_start();
        if(!$userEmail){
            $_SESSION["user"] = $userUsername;
        }else{
            $_SESSION["user"] = $userEmail;
        }

        echo json_encode(["message" => "Входът е успешен"]); 

    } catch (Error $exc) {
        http_response_code(500);
        echo json_encode(["message" => "Грешка при вход"]);
    }


} else {
    http_response_code(400);
    echo json_encode(["message" => "Невалидни данни"]);
}