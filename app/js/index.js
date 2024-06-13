import { saveBoard, getBoard, deleteBoard } from "./file_manager.js";

let userData;

const createBoardButton = document.querySelector('#create-board-button');
const importBoardButton = document.querySelector('#import-board-button');
const accountButton = document.querySelector('#account-button');

const boardContainer = document.querySelector('.board-container');

const createBoardPopupDataForm = document.querySelector('#create-board-popup-data-form');
const importBoardPopupDataForm = document.querySelector('#import-board-popup-data-form');
const editBoardPopupDataForm = document.querySelector('#edit-board-popup-data-form');
const deleteBoardPopupDataForm = document.querySelector('#delete-board-popup-data-form');
const shareBoardPopupDataForm = document.querySelector('#share-board-popup-data-form');
const shareBoardLinkPopupDataForm = document.querySelector('#share-board-link-popup-data-form');

let renderedBoards = {};
let boardCounter = 1;

/* commented until csvFileInput is added
document.getElementById('ImportInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            JSZip.loadAsync(e.target.result).then(zip => {
                handleZipFile(zip);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

async function handleZipFile(zip) {
    const csvFile = await zip.file("notes.csv").async("string");
    const csvData = csvToJSON(csvFile);

    const files = {};
    zip.folder("files").forEach((relativePath, file) => {
        file.async("blob").then(blob => {
            files[relativePath] = blob;
        });
    });

    // Wait for all files to be processed
    await Promise.all(Object.values(files));

    sendToServer(csvData, files);
}

function sendToServer(csvData, files) {
    const formData = new FormData();
    formData.append("notes", JSON.stringify(csvData));

    for (const [fileName, fileBlob] of Object.entries(files)) {
        formData.append(`files[${fileName}]`, fileBlob);
    }

    fetch('import_notes.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Import successful:', data);
    })
    .catch(error => {
        console.error('Error importing notes:', error);
    });
}*/

export function csvToJSON(csv) {
    const lines = csv.split('\n');
    const result = [];
    for (let i = 1; i < lines.length; i++) { // skip header
        const line = lines[i].split(',');
        if (line.length >= 2) {
            const note = {
                title: line[0].trim(),
                description: line[1].trim()
            };
            result.push(note);
        }
    }
    return result;
}

    
export function saveNotes(notes){
    notes.forEach(note => {
        fetch('php/save_note.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Note saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving note:', error);
        });
    });
}

async function loadSession() {
    try {
        const response = await fetch('php/session.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.active) {
            window.location.href = 'login.html';
        } else {
            userData = data.user;
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
}

function renderBoard(boardJSON) {
    //console.log(boardJSON); // for testing purposes only

    const newBoard = document.createElement('div');
    newBoard.classList.add('board');
    newBoard.id = boardJSON.board_id;

    const boardTitle = document.createElement('div');
    boardTitle.classList.add('board-title');
    boardTitle.id = 'board-title-' + boardCounter;

    const boardTitleSpan = document.createElement('span');
    boardTitleSpan.classList.add('board-title-text');
    boardTitleSpan.textContent = boardJSON.board_title;

    boardTitle.appendChild(boardTitleSpan);

    const boardOwner = document.createElement('div');
    boardOwner.classList.add('board-owner');
    boardOwner.id = 'board-owner-' + boardCounter;

    const boardOwnerSpan = document.createElement('span');
    boardOwnerSpan.classList.add('board-owner-text');
    boardOwnerSpan.textContent = 'Owner: ' + boardJSON.owner_username;

    boardOwner.appendChild(boardOwnerSpan);

    const boardDescription = document.createElement('div');
    boardDescription.classList.add('board-description');
    boardDescription.id = 'board-description-' + boardCounter;

    const boardDescriptionSpan = document.createElement('span');
    boardDescriptionSpan.classList.add('board-description-text');
    boardDescriptionSpan.textContent = boardJSON.description;

    boardDescription.appendChild(boardDescriptionSpan);

    const boardOpenAndEditButtonsDiv = document.createElement('div');
    boardOpenAndEditButtonsDiv.classList.add('board-open-and-edit-buttons-div');
    boardOpenAndEditButtonsDiv.id = 'board-open-and-edit-buttons-div-' + boardCounter;

    const boardOpenButtonDiv = document.createElement('div');
    boardOpenButtonDiv.classList.add('board-button-div');
    boardOpenButtonDiv.classList.add('board-open-button-div');
    boardOpenButtonDiv.id = 'board-open-button-div-' + boardCounter;

    const boardOpenButton = document.createElement('button');
    boardOpenButton.classList.add('board-button');
    boardOpenButton.classList.add('board-open-button');
    boardOpenButton.id = 'board-open-button-' + boardCounter;
    boardOpenButton.textContent = "Open";

    boardOpenButtonDiv.appendChild(boardOpenButton);

    const boardEditButtonDiv = document.createElement('div');
    boardEditButtonDiv.classList.add('board-button-div');
    boardEditButtonDiv.classList.add('board-edit-button-div');
    boardEditButtonDiv.id = 'board-edit-button-div-' + boardCounter;

    const boardEditButton = document.createElement('button');
    boardEditButton.classList.add('board-button');
    boardEditButton.classList.add('board-edit-button');
    boardEditButton.id = 'board-edit-button-' + boardCounter;
    boardEditButton.textContent = "Edit";

    boardEditButtonDiv.appendChild(boardEditButton);

    boardOpenAndEditButtonsDiv.appendChild(boardOpenButtonDiv);
    boardOpenAndEditButtonsDiv.appendChild(boardEditButtonDiv);

    const boardShareAndDeleteButtonsDiv = document.createElement('div');
    boardShareAndDeleteButtonsDiv.classList.add('board-share-and-delete-buttons-div');
    boardShareAndDeleteButtonsDiv.id = 'board-share-and-delete-buttons-div-' + boardCounter;

    const boardShareButtonDiv = document.createElement('div');
    boardShareButtonDiv.classList.add('board-button-div');
    boardShareButtonDiv.classList.add('board-share-button-div');
    boardShareButtonDiv.id = 'board-share-button-div-' + boardCounter;

    const boardShareButton = document.createElement('button');
    boardShareButton.classList.add('board-button');
    boardShareButton.classList.add('board-share-button');
    boardShareButton.id = 'board-share-button-' + boardCounter;
    boardShareButton.textContent = "Share";

    boardShareButtonDiv.appendChild(boardShareButton);

    const boardDeleteButtonDiv = document.createElement('div');
    boardDeleteButtonDiv.classList.add('board-button-div');
    boardDeleteButtonDiv.classList.add('board-delete-button-div');
    boardDeleteButtonDiv.id = 'board-delete-button-div-' + boardCounter;

    const boardDeleteButton = document.createElement('button');
    boardDeleteButton.classList.add('board-button');
    boardDeleteButton.classList.add('board-delete-button');
    boardDeleteButton.id = 'board-delete-button-' + boardCounter;
    boardDeleteButton.textContent = "Delete";

    boardDeleteButtonDiv.appendChild(boardDeleteButton);

    boardShareAndDeleteButtonsDiv.appendChild(boardShareButtonDiv);
    boardShareAndDeleteButtonsDiv.appendChild(boardDeleteButtonDiv);

    boardOpenButton.addEventListener('click', function() {
        window.location.href = 'board.html?board=' + boardJSON.board_id;
    });

    boardEditButton.addEventListener('click', async function() {
        try {
            await showEditBoardPopup(boardJSON, boardTitleSpan, boardDescriptionSpan);
        } catch (error) {
            if (error != 'Edit Board Popup closed') {
                console.error(error);
            }
        }
    });

    boardShareButton.addEventListener('click', async function() {
        try {
            await showShareBoardPopup(boardJSON);
        } catch (error) {
            if (error != 'Share Board Popup closed') {
                console.error(error);
            }
        }
    });

    boardDeleteButton.addEventListener('click', async function() {
        try {
            await showDeleteBoardPopup(boardJSON.board_id, boardJSON.board_title);
        } catch (error) {
            if (error != 'Delete Board Popup closed') {
                console.error(error);
            }
        }
    });

    newBoard.appendChild(boardTitle);
    newBoard.appendChild(boardOwner);
    newBoard.appendChild(boardDescription);

    newBoard.appendChild(boardOpenAndEditButtonsDiv);
    newBoard.appendChild(boardShareAndDeleteButtonsDiv);

    renderedBoards[boardJSON.board_id] = newBoard;
    boardContainer.appendChild(newBoard);

    boardCounter++;
}

function unrenderBoard(boardId) {
    document.getElementById(boardId).remove();

    delete renderedBoards[boardId];
}

async function generateUniqueBoardId() {
    let boardId;

    async function isAvailable(boardId) {
        const response = await fetch('php/check_board_id_availability.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success === true) {
            return boardId;
        } else {
            return false;
        }
    }

    while (!boardId) {
        boardId = crypto.randomUUID();

        const isAvailableResult = await isAvailable(boardId);

        if (isAvailableResult) {
            boardId = isAvailableResult;
        }
    }

    return boardId;
}

function generateSharePassword() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const length = 10;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);

        result += characters[randomIndex];
    }

    return result;
}

async function createNewBoardJSONObject(boardTitle, owner_username, user_id, description) {
    return {
        'board_id': await generateUniqueBoardId(),
        'board_share_password': generateSharePassword(),
        'board_title': boardTitle,
        'owner_username': owner_username,
        'user_id': user_id,
        'description': description,
        'board_tabs': []
    };
}

// returns a promise with: success & message
async function saveBoardOnServer(boardJSON) {
    async function sendBoardDataToDatabase(boardId, userId, boardTitle, boardDesc, boardSharePassword) {
        const response = await fetch('php/save_board_to_database.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ board_id: boardId, user_id: userId, board_title: boardTitle, board_desc:boardDesc,
                 board_share_password: boardSharePassword })
        });

        const result = await response.json();

        if (result.success) {
            return true;
        } else {
            console.error(result.message);

            return false;
        }
    }

    const boardId = boardJSON.board_id;
    const userId = boardJSON.user_id;
    const boardTitle = boardJSON.board_title;
    const boardDesc = boardJSON.description;
    const boardSharePassword = boardJSON.board_share_password;

    if (await sendBoardDataToDatabase(boardId, userId, boardTitle, boardDesc, boardSharePassword)) {
        const result = await saveBoard(boardJSON);

        return result;
    } else {
        console.error('Failed to save board data to the database');

        return { 'success': false, 'message': 'Failed to save board data to the database' };
    }
}

// returns a promise with: boards & boards_count
async function loadBoardsFromServer(userId) {
    async function getBoardsDataFromDatabase(userId) {
        const response = await fetch('php/load_boards_from_database.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId })
        });

        const result = await response.json();

        if (result.success) {
            return {
                boards_count: result.count,
                boards: result.boards.map(board => ({ board_id: board.board_id, board_title: board.board_title, board_desc: board.board_desc,
                     board_share_password: board.board_share_password }))
            };
        } else {
            console.error(result.message);

            return {
                boards_count: 0,
                boards: []
            };
        }
    }

    const boardsData = await getBoardsDataFromDatabase(userId);
    const boardsCount = boardsData.boards_count;
    
    if (boardsCount === 0) {
        return { boards_count: 0, boards: [] };
    }

    const boardPromises = boardsData.boards.map(board => getBoard(board.board_id, board.board_title));
    const boardResults = await Promise.all(boardPromises);
    const boards = [];

    boardResults.forEach(result => {
        if (result.success) {
            //console.log(result.file);

            boards.push(result.file);
        } else {
            console.error(`Failed to fetch board with id '${result.board_id}' and title '${result.board_title}': ${result.message}`);

            boardsCount--;
        }
    });

    return { success: true, boards_count: boardsCount, boards: boards };
}

async function deleteBoardFromServer(boardId, userId) {
    try {
        const response = await fetch('php/delete_board_from_database.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ board_id: boardId, user_id: userId })
        });

        const data = await response.json();

        if (data.success) {
            return true;
        } else {
            if (data.message === 'Unauthorized') {
                try {
                    await showUnauthorizedDeleteErrorPopup();
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                console.error('Error deleting board:', data.message);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }

    return false;
}

async function extractBoardJSONFromFile(file) {
    const formData = new FormData();
    const boardId = await generateUniqueBoardId();
    const boardSharePassword = generateSharePassword();

    formData.append('file', file);
    formData.append('board_id', boardId);
    formData.append('board_share_password', boardSharePassword);

    try {
        const response = await fetch('import_board.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const boardJSON = await response.json();
        return boardJSON;
    } catch (error) {
        throw new Error(`Error extracting board JSON from file: ${error.message}`);
    }

    return await createNewBoardJSONObject('Test', 'user', '2', 'This is a test!');
}

async function showCreateBoardPopup() {
    const boardTitleInput = document.querySelector('#create-board-popup-title-field');
    const boardDescriptionInput = document.querySelector('#create-board-popup-description-field');

    if (!boardTitleInput || !boardDescriptionInput) {
        console.error('Popup title or description field not found');

        return;
    }

    document.body.classList.add('active-create-board-popup');

    boardTitleInput.value = '';
    boardDescriptionInput.value = '';

    return new Promise((resolve, reject) => {
        function hidePopup() {
            document.body.classList.remove('active-create-board-popup');
        }

        async function handlePopupDone(event) {
            event.preventDefault();

            const boardTitle = boardTitleInput.value;
            const boardOwnerUsername = userData.username;
            const boarduserId = userData.user_id;
            const boardDescription = boardDescriptionInput.value;

            if (!boardTitle) {
                console.error('Title cannot be empty');
                return;
            }

            const boardJSON = await createNewBoardJSONObject(boardTitle, boardOwnerUsername, boarduserId, boardDescription);

            //console.log(userData); // for testing purposes only
            //console.log(boardJSON); // for testing purposes only

            renderBoard(boardJSON);
            saveBoardOnServer(boardJSON);

            hidePopup();

            resolve(boardJSON);
            document.getElementById('create-board-popup-cancel-button').removeEventListener('click', handlePopupCancel);
        }

        function handlePopupCancel() {
            hidePopup();

            reject('Create Board Popup closed');
            createBoardPopupDataForm.removeEventListener('submit', handlePopupDone);
        }

        createBoardPopupDataForm.addEventListener('submit', handlePopupDone, { once: true });
        document.getElementById('create-board-popup-cancel-button').addEventListener('click', handlePopupCancel, { once: true });
    });
}

async function showImportBoardPopup() {
    const fileInput = document.querySelector('#file-input');

    if (!fileInput) {
        console.error('File input field not found');

        return;
    }

    document.body.classList.add('active-import-board-popup');

    fileInput.value = '';

    return new Promise((resolve, reject) => {
        function hidePopup() {
            document.body.classList.remove('active-import-board-popup');
        }

        async function handlePopupDone(event) {
            event.preventDefault();

            const file = fileInput.files[0];

            if (!file) {
                console.error('No file selected');

                return;
            }

            try {
                const boardJSON = await extractBoardJSONFromFile(file);

                // console.log(userData); // for testing purposes only
                // console.log(boardJSON); // for testing purposes only

                renderBoard(boardJSON);
                saveBoardOnServer(boardJSON);

                hidePopup();

                resolve(boardJSON);
                document.getElementById('import-board-popup-cancel-button').removeEventListener('click', handlePopupCancel);
            } catch (error) {
                console.error('Error extracting board JSON from file', error);

                reject(error);
            }
        }

        function handlePopupCancel() {
            hidePopup();

            reject('Import Board Popup closed');
            importBoardPopupDataForm.removeEventListener('submit', handlePopupDone);
        }

        importBoardPopupDataForm.addEventListener('submit', handlePopupDone, { once: true });
        document.getElementById('import-board-popup-cancel-button').addEventListener('click', handlePopupCancel, { once: true });
    });
}

async function showEditBoardPopup(boardJSON, boardTitleSpan, boardDescriptionSpan) {
    const boardTitleInput = document.querySelector('#edit-board-popup-title-field');
    const boardDescriptionInput = document.querySelector('#edit-board-popup-description-field');

    if (!boardTitleInput || !boardDescriptionInput) {
        console.error('Popup title or description field not found');

        return;
    }

    document.body.classList.add('active-edit-board-popup');

    boardTitleInput.value = boardTitleSpan.textContent;
    boardDescriptionInput.value = boardDescriptionSpan.textContent;

    return new Promise((resolve, reject) => {
        function hidePopup() {
            document.body.classList.remove('active-edit-board-popup');
        }

        async function updateBoardFile(boardJSON) {
            return await saveBoard(boardJSON);
        }

        async function handlePopupDone(event) {
            event.preventDefault();

            const boardTitle = boardTitleInput.value;
            const boardDescription = boardDescriptionInput.value;

            if (!boardTitle || !boardDescription) {
                console.error('Title and Description cannot be empty');
                return;
            }

            boardJSON.board_title = boardTitle;
            boardJSON.description = boardDescription;

            boardTitleSpan.textContent = boardTitle;
            boardDescriptionSpan.textContent = boardDescription;

            //console.log(userData); // for testing purposes only
            //console.log(boardJSON); // for testing purposes only

            unrenderBoard(boardJSON.board_id);
            renderBoard(boardJSON);
            updateBoardFile(boardJSON);

            hidePopup();

            resolve(boardJSON);
            document.getElementById('edit-board-popup-close-button').removeEventListener('click', handlePopupClose);
        }

        function handlePopupClose() {
            hidePopup();

            reject('Edit Board Popup closed');
            editBoardPopupDataForm.removeEventListener('submit', handlePopupDone);
        }

        editBoardPopupDataForm.addEventListener('submit', handlePopupDone, { once: true });
        document.getElementById('edit-board-popup-close-button').addEventListener('click', handlePopupClose, { once: true });
    });
}

async function showShareBoardPopup(boardJSON) {
    document.body.classList.add('active-share-board-popup');

    return new Promise((resolve, reject) => {
        function hidePopup() {
            document.body.classList.remove('active-share-board-popup');
        }

        async function exportBoardAsFile() {
            async function exportBoard(boardId, boardTitle, boardJsonPath) {
                const response = await fetch('php/export_board.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ boardId, boardTitle, boardJsonPath })
                });

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');

                a.style.display = 'none';
                a.href = url;
                a.download = `${boardTitle}_board_export.zip`;

                document.body.appendChild(a);

                a.click();
                
                window.URL.revokeObjectURL(url);
            }

            const boardId = boardJSON.board_id;
            const boardTitle = boardJSON.board_title;

            //console.log(boardJSON); // for testing purposes only

            getBoard(boardId, boardTitle)
            .then(boardJsonPath => {
                exportBoard(boardId, boardTitle, boardJsonPath);
            });
        }

        async function handlePopupShareLink(event) {
            event.preventDefault();

            hidePopup();

            resolve('Share Board Popup closed');
            document.getElementById('share-board-popup-export-button').removeEventListener('click', handlePopupExport);
            document.getElementById('share-board-popup-cancel-button').removeEventListener('click', handlePopupCancel);

            try {
                await showShareLinkBoardPopup(boardJSON);
            } catch (error) {
                if (error != 'Share Board Link Popup closed') {
                    console.error(error);
                }
            }
        }

        async function handlePopupExport(event) {
            event.preventDefault();

            await exportBoardAsFile();

            hidePopup();

            resolve('Share Board Popup closed');
            shareBoardPopupDataForm.removeEventListener('submit', handlePopupShareLink);
            document.getElementById('share-board-popup-cancel-button').removeEventListener('click', handlePopupCancel);
        }

        function handlePopupCancel() {
            hidePopup();

            reject('Share Board Popup closed');
            shareBoardPopupDataForm.removeEventListener('submit', handlePopupShareLink);
            document.getElementById('share-board-popup-export-button').removeEventListener('click', handlePopupExport);
        }

        shareBoardPopupDataForm.addEventListener('submit', handlePopupShareLink);
        document.getElementById('share-board-popup-export-button').addEventListener('click', handlePopupExport, { once: true });
        document.getElementById('share-board-popup-cancel-button').addEventListener('click', handlePopupCancel, { once: true });
    });
}

async function showShareLinkBoardPopup(boardJSON) {
    document.body.classList.add('active-share-board-link-popup');

    const boardTitle = boardJSON.board_title;
    const boardId = boardJSON.board_id;
    const boardSharePassword = boardJSON.board_share_password;
    const boardShareLink = 'http://localhost/Shared-Board/app/board.html?board=' + boardId + '&share-password=' + boardSharePassword;

    return new Promise((resolve, reject) => {
        function hidePopup() {
            document.body.classList.remove('active-share-board-link-popup');
        }

        function copyText(text) {
            navigator.clipboard.writeText(text).then(function() {
                // alert('Text copied: ' + text);
            }).catch(function(error) {
                alert('Failed to copy text: ' + error);
            });
        }

        async function handlePopupCopyShareLink(event) {
            event.preventDefault();

            //console.log(boardJSON); // for testing purposes only

            copyText(boardShareLink);

            resolve(boardJSON);
        }

        function handlePopupClose() {
            hidePopup();

            reject('Share Board Link Popup closed');
            shareBoardLinkPopupDataForm.removeEventListener('submit', handlePopupCopyShareLink);
        }

        document.querySelector("#share-board-link-popup-board-title").textContent = 'Link for sharing the "' + boardTitle + '" board:';
        document.querySelector("#share-board-link-popup-board-share-link").textContent = boardShareLink;

        shareBoardLinkPopupDataForm.addEventListener('submit', handlePopupCopyShareLink);
        document.getElementById('share-board-link-popup-close-button').addEventListener('click', handlePopupClose, { once: true });
    });
}

async function showDeleteBoardPopup(boardId, boardTitle) {
    document.body.classList.add('active-delete-board-popup');

    return new Promise((resolve, reject) => {
        function hidePopup() {
            document.body.classList.remove('active-delete-board-popup');
        }

        async function handlePopupYes(event) {
            event.preventDefault();

            hidePopup();

            try {
                const deletionSuccess = await deleteBoardFromServer(boardId, userData.user_id);

                if (deletionSuccess) {
                    unrenderBoard(boardId);
                }
            } catch (error) {
                console.error('Error:', error);
            }

            resolve(boardId);
            document.getElementById('delete-board-popup-no-button').removeEventListener('click', handlePopupNo);
        }

        function handlePopupNo() {
            hidePopup();

            reject('Delete Board Popup closed');
            deleteBoardPopupDataForm.removeEventListener('submit', handlePopupYes);
        }

        document.querySelector("#delete-board-popup-board-title").textContent = boardTitle;

        deleteBoardPopupDataForm.addEventListener('submit', handlePopupYes, { once: true });
        document.getElementById('delete-board-popup-no-button').addEventListener('click', handlePopupNo, { once: true });
    });
}

async function showUnauthorizedDeleteErrorPopup() {
    document.body.classList.add('active-failed-delete-board-popup');

    return new Promise((resolve, reject) => {
        function hidePopup() {
            document.body.classList.remove('active-failed-delete-board-popup');
        }

        function handlePopupOk() {
            hidePopup();

            resolve('Failed Delete Board Popup closed');
        }

        document.querySelector("#failed-delete-popup-form-error-text").textContent = 'You can\'t delete this board, because you are not the owner!';

        shareBoardPopupDataForm.addEventListener('submit', handlePopupOk, { once: true });
    });
}

function logout() {
    fetch('php/logout.php', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Logged out successfully');

            window.location.href = 'login.html';
        } else {
            console.error('Logout failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadSession();

    if (userData) {
        const userId = userData.user_id;
        const username = userData.username;

        //console.log(userData); // for testing purposes only

        document.getElementById('username-display').textContent = 'Hello, ' + username;

        try {
            const loadResult = await loadBoardsFromServer(userId);
            const oldBoardCounter = boardCounter;
            const boardsCount = loadResult.boards_count;
            const boards = loadResult.boards;

            if (loadResult) {
                //console.log('Boards loaded successfully:', loadResult); // for testing purposes only

                //console.log(boards)
                boards.forEach(renderBoard);

                if (oldBoardCounter + boardsCount != boardCounter) {
                    console.error('Unknown Error: The loaded number of boards doesn\'t match the number of boards that should have been loaded!');
                }
            } else {
                console.error('Failed to load boards:', loadResult.message);
            }
        } catch (error) {
            console.error('Error loading boards:', error);
        }
    } else {
        console.error('The user data from the session is missing!');
    }

    createBoardButton.addEventListener('click', async () => {
        try {
            await showCreateBoardPopup();
        } catch (error) {
            if (error != 'Create Board Popup closed') {
                console.error(error);
            }
        }
    });

    importBoardButton.addEventListener('click', async () => {
        try {
            await showImportBoardPopup();
        } catch (error) {
            if (error != 'Import Board Popup closed') {
                console.error(error);
            }
        }
    });

    accountButton.addEventListener('click', () => {
        //console.log("Account button clicked"); // for testing purposes only

        // this is only temporary, until we add the dropdown menu
        logout();
    });
});

