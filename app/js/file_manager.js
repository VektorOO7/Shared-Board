


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

    return result;
}