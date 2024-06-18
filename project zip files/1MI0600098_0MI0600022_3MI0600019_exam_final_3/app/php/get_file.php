<?php
header('Content-Type: application/json; charset=utf-8');

$response = ['success' => false, 'file' => null, 'message' => 'File download failed!'];

try {
    $targetDirectory = '../.data/';
    $fileData = json_decode(file_get_contents('php://input'), true);

    if (isset($fileData['path']) && isset($fileData['fileName'])) {
        $filePath = $targetDirectory . trim($fileData['path'], '/') . '/' . trim($fileData['fileName']);
        
        if (file_exists($filePath)) {
            $fileContent = file_get_contents($filePath);

            // Ensure the file content is UTF-8 encoded
            if (!mb_check_encoding($fileContent, 'UTF-8')) {
                $fileContent = mb_convert_encoding($fileContent, 'UTF-8', 'auto');
            }

            $fileContentBase64 = base64_encode($fileContent);
            
            $response['success'] = true;
            $response['file'] = $fileContentBase64;
            $response['message'] = 'File exists.';
        } else {
            $response['message'] = 'File does not exist.';
        }
    } else {
        throw new Exception('No path or fileName specified.');
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
