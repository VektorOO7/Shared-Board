import { saveBoard, getBoard, deleteBoard } from "./file_manager.js";

let userData;

const createBoardButton = document.querySelector('#create-board-button');
const accountButton = document.querySelector('#account-button');

const boardContainer = document.querySelector('.board-container');

const createBoardPopupDataForm = document.querySelector('#create-board-popup-data-form');
const editBoardPopupDataForm = document.querySelector('#edit-board-popup-data-form');
const deleteBoardPopupDataForm = document.querySelector('#delete-board-popup-data-form');

let renderedBoards = [];
let boardCounter = 1; // for the database(it strats counting from 1)

async function loadSession() {
    try {
        const response = await fetch('php/index.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (!data.active) {
            // console.log('Session is not active');

            window.location.href = 'login.html';
        } else {
            // console.log('Session is active', data.user);

            userData = data.user;
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
}

function renderBoard(board) {
    const newBoard = document.createElement('div');
    newBoard.classList.add('board');

    renderedBoards.push(newBoard);

    const boardTitle = document.createElement('div');
    boardTitle.classList.add('board-title');
    boardTitle.id = 'board-title-' + boardCounter;

    const boardTitleSpan = document.createElement('span');
    boardTitleSpan.classList.add('board-text');
    boardTitleSpan.classList.add('board-title-text');
    boardTitleSpan.textContent = board.board_title;

    boardTitle.appendChild(boardTitleSpan);

    const boardOwner = document.createElement('div');
    boardOwner.classList.add('board-owner');
    boardOwner.id = 'board-owner-' + boardCounter;

    const boardOwnerSpan = document.createElement('span');
    boardOwnerSpan.classList.add('board-text');
    boardOwnerSpan.classList.add('board-owner-text');
    boardOwnerSpan.textContent = 'Owner: ' + board.owner_username;

    boardOwner.appendChild(boardOwnerSpan);

    const boardDescription = document.createElement('div');
    boardDescription.classList.add('board-description');
    boardDescription.id = 'board-description-' + boardCounter;

    const boardDescriptionSpan = document.createElement('span');
    boardDescriptionSpan.classList.add('board-text');
    boardDescriptionSpan.classList.add('board-description-text');
    boardDescriptionSpan.textContent = board.description;

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
        //window.location.href = 'board.html?board=' + board.board_id;
    });

    boardEditButton.addEventListener('click', async function() {
        try {
            await showEditBoardPopup(board, boardTitleSpan, boardDescriptionSpan, newBoard);
        } catch (error) {
            if (error != 'Edit Board Popup closed') {
                console.error(error);
            }
        }
    });

    boardShareButton.addEventListener('click', function() {
        // will be added later
    });

    boardDeleteButton.addEventListener('click', async function() {
        try {
            await showDeleteBoardPopup(newBoard, board.board_id, board.board_title);
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

    boardContainer.appendChild(newBoard);

    boardCounter++;
}

function unrenderBoard(board) {
    renderedBoards.splice(renderedBoards.indexOf(board), 1);

    board.remove();
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

async function createNewBoardJSONObject(boardTitle, owner_username, user_id, description) {
    return {
        'board_id': await generateUniqueBoardId(),
        'board_title': boardTitle,
        'owner_username': owner_username,
        'user_id': user_id,
        'description': description,
        'board_tabs': []
    };
}

// returns a promise with: success & message
async function saveBoardOnServer(boardJSON) {
    async function sendBoardDataToDatabase(boardId, userId, boardTitle) {
        const response = await fetch('php/save_board_to_database.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ board_id: boardId, user_id: userId, board_title: boardTitle })
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

    if (await sendBoardDataToDatabase(boardId, userId, boardTitle)) {
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
                boards: result.boards.map(board => ({ board_id: board.board_id, board_title: board.board_title }))
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
            boards.push(result.file);
        } else {
            console.error(`Failed to fetch board with id '${result.board_id}' and title '${result.board_title}': ${result.message}`);

            boardsCount--;
        }
    });

    return { success: true, boards_count: boardsCount, boards: boards };
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function deleteBoardFromServer(boardId, userId) {
    // supposed to use delete_board_from_database.php

    console.log('Deleted board with id: "' + boardId + '" for user "' + userId + '"');
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

            if (!boardTitle || !boardDescription) {
                console.error('Title and Description cannot be empty');
                return;
            }

            const boardJSON = await createNewBoardJSONObject(boardTitle, boardOwnerUsername, boarduserId, boardDescription);

            //console.log(userData); // for testing purposes only
            //console.log(boardJSON); // for testing purposes only

            renderBoard(boardJSON);
            saveBoardOnServer(boardJSON);

            hidePopup();

            resolve(boardJSON);
            document.getElementById('create-board-popup-close-button').removeEventListener('click', handlePopupClose);
        }

        function handlePopupClose() {
            hidePopup();

            reject('Create Board Popup closed');
            createBoardPopupDataForm.removeEventListener('submit', handlePopupDone);
        }

        createBoardPopupDataForm.addEventListener('submit', handlePopupDone, { once: true });
        document.getElementById('create-board-popup-close-button').addEventListener('click', handlePopupClose, { once: true });
    });
}

async function updateBoardFile(boardJSON) {
    return await saveBoard(boardJSON);
}

async function showEditBoardPopup(boardJSON, boardTitleSpan, boardDescriptionSpan, oldBoard) {
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

            unrenderBoard(oldBoard);
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

async function showDeleteBoardPopup(boardJSON, boardId, boardTitle) {
    document.body.classList.add('active-delete-board-popup');

    return new Promise((resolve, reject) => {
        function hidePopup() {
            document.body.classList.remove('active-delete-board-popup');
        }

        async function handlePopupYes(event) {
            event.preventDefault();

            //console.log(boardJSON); // for testing purposes only

            unrenderBoard(boardJSON);
            deleteBoardFromServer(boardId, userData.user_id);

            hidePopup();

            resolve(boardJSON);
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

    accountButton.addEventListener('click', () => {
        //console.log("Account button clicked"); // for testing purposes only

        // this is only temporary, until we add the dropdown menu
        logout();
    });
});

