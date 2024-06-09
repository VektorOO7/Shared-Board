<?php
// connect to the database
require_once("../db/db.php");

try {
    $db = new DB();
    $connection = $db->getConnection();
} catch (PDOException $exc) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to make a connection to database!"]);
}

// function to generate a unique token
function generateToken($length = 16) {
    return bin2hex(random_bytes($length));
}

// get the page ID from the request
$data = json_decode(file_get_contents('php://input'), true);
$pageId = $data['pageId'];
$token = generateToken();
$expiration = date('Y-m-d H:i:s', strtotime('+1 hour')); // set expiration time to 1 hour from now

// insert the token into the database with expiration time
$sql = "INSERT INTO shared_links (page_id, token, expires_at) VALUES (:pageId, :token, :expires_at)";
$stmt = $connection->prepare($sql);
$stmt->execute(['pageId' => $pageId, 'token' => $token, 'expires_at' => $expiration]);

// return the full URL
echo json_encode(['url' => 'http://localhost/Shared-Board/app/shared_page.php?token='.$token]);

