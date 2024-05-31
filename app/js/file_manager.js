

// '/' is the '.data' directory and '/something/' is the '.data/something' folder
// returns a promise with: success & message
async function saveFile(file, path) {
    const formData = new FormData();

    formData.append('uploadedFile', file);
    formData.append('path', path);

    const response = await fetch('php/save_file.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    return result;
}

// '/' is the '.data' directory and '/something/' is the '.data/something' folder
// returns a promise with: success, file & message
async function getFile(path) {
    const response = await fetch('php/get_file.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: path })
    });

    const result = await response.json();

    return result;
}

// This is '.test.html' form handler

let selectedFile = null;

function getFileFromForm(event) {
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
        selectedFile = fileInput.files[0];
    }
}

document.querySelector('input[name="uploadedFile"]').addEventListener('change', getFileFromForm);

function handleFormSubmit(event) {
    event.preventDefault();

    if (selectedFile) {
        saveFile(selectedFile, '/')
        .then(result => {
            if (result.success) {
                document.getElementById('result').innerText = 'File uploaded successfully!';
            } else {
                document.getElementById('result').innerText = `File upload failed: ${result.message}`;
            }
        }).catch(error => {
            console.error('Error:', error);

            document.getElementById('result').innerText = error.message;
        });

        return;
    }

    document.getElementById('result').innerText = 'File upload failed: Unknown Error!'; 
}
