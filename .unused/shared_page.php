<?php

// connect to the database
require_once("../db/db.php");

try {
    $db = new DB();
    $connection = $db->getConnection();
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $exc) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to make a connection to database!"]);
}

// function to get page content (you can modify this to fit your data source)
function getPageContent($connection, $pageId) {
    // For demonstration purposes, we'll just return a simple string.
    // Replace this with actual content retrieval logic, such as querying a database or reading from a file.
    $sql = "SELECT content FROM pages WHERE id = :pageId";
    $stmt = $connection->prepare($sql);
    $stmt->execute(['pageId' => $pageId]);
    $page = $stmt->fetch();
    return "<p>" . htmlspecialchars($page['content']) . "</p>";
}

// get the token from the URL
$token = $_GET['token'];

// look up the token in the database
$sql = "SELECT page_id, expires_at FROM shared_links WHERE token = :token";
$stmt = $connection->prepare($sql);
$stmt->execute(['token' => $token]);
$page = $stmt->fetch();

if ($page) {
    $current_time = date('Y-m-d H:i:s');
    if ($current_time > $page['expires_at']) {
        echo "This link has expired.";
    } else {
        $pageId = $page['page_id'];
        // fetch and display the page content based on the page ID
        // assume getPageContent() is a function that retrieves the content by page ID
        $content = getPageContent($connection, $pageId);
        echo "<h1>Page Content for ID: $pageId</h1>";
        echo $content;
    }
} else {
    echo "Invalid or expired link.";
}
