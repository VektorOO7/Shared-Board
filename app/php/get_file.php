<?php

    $response = ['success' => false, 'file' => null, 'message' => 'File download failed!'];

    try {
        $targetDirectory = '../.data/';
        
        if (isset($_POST['path'])) {
            $filePath = $targetDirectory . trim($_POST['path'], '/');
            
            if (file_exists($filePath)) {
                $response['success'] = true;
                $response['file'] = file_get_contents($filePath);
                $response['message'] = 'File exists.';
            } else {
                $response['message'] = 'File does not exist.';
            }
        } else {
            throw new Exception('No path specified.');
        }
    } catch (Exception $e) {
        $response['message'] = $e.getMessage();
    }

    echo json_encode($response);

?>
