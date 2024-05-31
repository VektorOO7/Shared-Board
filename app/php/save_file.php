<?php

    ini_set('file_uploads', 'On');
    ini_set('upload_max_filesize', '2M');
    ini_set('post_max_size', '8M');

    $response = ['success' => false, 'message' => 'File upload failed!'];

    try {
        $targetDirectory = '../.data/';

        if (isset($_POST['path'])) {
            $targetDirectory .= trim($_POST['path'], '/') . '/';
        }

        if (!file_exists($targetDirectory)) {
            if (!mkdir($targetDirectory, 0777, true)) {
                throw new Exception('Failed to create target directory.');
            }
        }

        $targetFile = $targetDirectory . basename($_FILES['uploadedFile']['name']);

        if (!move_uploaded_file($_FILES['uploadedFile']['tmp_name'], $targetFile)) {
            throw new Exception('Failed to move uploaded file.');
        }

        $response['success'] = true;
        $response['message'] = 'File uploaded successfully!';
    } catch (Exception $e) {
        $response['message'] = $e->getMessage();
    }

    echo json_encode($response);

?>
