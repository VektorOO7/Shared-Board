<?php

    ini_set('file_uploads', 'On');
    ini_set('upload_max_filesize', '2M');
    ini_set('post_max_size', '8M');

    $response = ['success' => false, 'message' => 'File upload failed!'];

    try {
        $targetDirectory = '../.data/';
        $path = isset($_POST['path']) ? trim($_POST['path'], '/') : '';
        $file = $_FILES['uploadedFile'];

        if ($path && $file && isset($file['name']) && isset($file['tmp_name'])) {
            $directoryPath = $targetDirectory . $path;
            $filePath = $directoryPath . '/' . $file['name'];

            if (!file_exists($directoryPath)) {
                if (!mkdir($directoryPath, 0777, true)) {
                    throw new Exception('Failed to create target directory.');
                }
            }

            if (!move_uploaded_file($file['tmp_name'], $filePath)) {
                throw new Exception('Failed to move uploaded file.');
            }

            $response['success'] = true;
            $response['message'] = 'File uploaded successfully!';
        } else {
            throw new Exception('No path or file data specified.');
        }
    } catch (Exception $e) {
        $response['message'] = $e->getMessage();
    }

    echo json_encode($response);

?>