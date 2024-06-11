<?php
    
    $response = ['success' => false, 'file' => null, 'message' => 'File download failed!'];

    try {
        $targetDirectory = '../.data/';
        $fileData = json_decode(file_get_contents('php://input'), true);

        if (isset($fileData['path']) && isset($fileData['fileName'])) {
            $filePath = $targetDirectory . trim($fileData['path'], '/') . '/' . trim($fileData['fileName']);
            
            if (file_exists($filePath)) {
                $fileContent = base64_encode(file_get_contents($filePath));
                
                $response['success'] = true;
                $response['file'] = $fileContent;
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
    
    echo json_encode($response);
    
?>
