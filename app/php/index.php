<?php
    
    session_start();
    
    header('Content-Type: application/json');
    
    if (isset($_SESSION["user"])) {
        $user = $_SESSION["user"];
        echo json_encode(["active" => true, "user" => $user]);
    } else {
        echo json_encode(["active" => false]);
    }
    
?>