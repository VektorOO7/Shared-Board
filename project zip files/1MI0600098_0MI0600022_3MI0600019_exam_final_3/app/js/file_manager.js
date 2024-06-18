


// '/' is the '.data' directory and '/something/' is the '.data/something' folder
// returns a promise with: success & message
async function saveFile(file, path) {
    const formData = new FormData();
    formData.append('path', path);
    formData.append('uploadedFile', file);

    const response = await fetch('php/save_file.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    return result;
}

export async function saveBoard(boardJSON) {
    const boardTitle = boardJSON.board_title;
    const boardId = boardJSON.board_id;

    const fileName = `${boardTitle}.json`;
    const path = `/${boardId}/`;

    const jsonString = JSON.stringify(boardJSON);
    const blob = new Blob([jsonString], {
        type: 'application/json' 
    });

    const file = new File([blob], fileName, { type: 'application/json' });

    const result = await saveFile(file, path);

    return result;
}

// '/' is the '.data' directory and '/something/' is the '.data/something' folder
// returns a promise with: success, file & message
async function getFile(path, fileName) {
    const response = await fetch('php/get_file.php', {
        method: 'POST',
        headers: {
            charset: 'UTF-8',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: path, fileName: fileName })
    });

    const result = await response.json();

    return result;
}

export async function getBoard(boardId, boardTitle) {
    const path = `/${boardId}/`;

    const result = await getFile(path, boardTitle + '.json');
    
    //console.log("Hello"+result); // debug

    if (result.success) {
        const decodedFileContent = decodeBase64ToUtf8(result.file);
        return {
            success: true,
            file: JSON.parse(decodedFileContent)
        };
    }

    return result;
}

function decodeBase64ToUtf8(base64) {
    let binaryString;
    try {
        binaryString = atob(base64);
    } catch (error) {
        console.error('Failed to decode base64:', error);
        return null;
    }

    const utf8Bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        utf8Bytes[i] = binaryString.charCodeAt(i);
    }

    const utf8Decoder = new TextDecoder('utf-8');
    return utf8Decoder.decode(utf8Bytes);
}


async function deleteFile() {
    // body...

    // supposed to use delete_file.php
}

export async function deleteBoard(boardId) {
    // body...
}