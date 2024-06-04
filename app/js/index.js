import { saveBoard, getBoard } from "./file_manager.js";

let userData;

const createBoardButton = document.querySelector('#create-board-button');
const accountButton = document.querySelector('#account-button');

const boardContainer = document.querySelector('.board-container');

const popupBoardDataForm = document.querySelector('#popup-board-data-form');

let boardCounter = 1; //for the database(it strats counting from 1)

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

function renderBoard(boardData) {
    const newBoard = document.createElement('div');
    newBoard.classList.add('board');

    const boardTitle = document.createElement('div');
    boardTitle.classList.add('board-title');
    boardTitle.id = 'board-title-' + boardCounter;
    boardTitle.textContent = boardData.title;

    const boardOwner = document.createElement('div');
    boardOwner.classList.add('board-owner');
    boardOwner.id = 'board-owner-' + boardCounter;
    boardOwner.textContent = 'Owner: ' + boardData.owner;

    const boardDescription = document.createElement('div');
    boardDescription.classList.add('board-description');
    boardDescription.id = 'board-description-' + boardCounter;
    boardDescription.textContent = boardData.description;

    const boardOpen = document.createElement('button');
    boardOpen.classList.add('board-open-button');
    boardOpen.id = 'board-open-button-' + boardCounter;
    boardOpen.textContent = "Open";

    boardOpen.addEventListener('click', function() {
        window.location.href = 'board.html?board=' + boardCounter;
    });

    newBoard.appendChild(boardTitle);
    newBoard.appendChild(boardOwner);
    newBoard.appendChild(boardDescription);
    newBoard.appendChild(boardOpen);

    boardContainer.appendChild(newBoard);

    boardCounter++;
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

async function showPopup() {
    const boardTitleInput = document.querySelector('#popup-title-field');
    const boardDescriptionInput = document.querySelector('#popup-description-field');

    if (!boardTitleInput || !boardDescriptionInput) {
        console.error('Popup title or description field not found');
        return;
    }

    document.body.classList.add('active-popup');

    // Clear input fields
    boardTitleInput.value = '';
    boardDescriptionInput.value = '';

    return new Promise((resolve, reject) => {
        function handlePopupClose() {
            hidePopup();

            reject('Popup closed');
            popupBoardDataForm.removeEventListener('submit', handlePopupDone);
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

            const board = await createNewBoardJSONObject(boardTitle, boardOwnerUsername, boarduserId, boardDescription);

            //console.log(board); // for testing purposes only

            renderBoard(board);
            hidePopup();

            saveBoardOnServer(board)

            resolve(board);
            document.getElementById('popup-close-button').removeEventListener('click', handlePopupClose);
        }

        popupBoardDataForm.addEventListener('submit', handlePopupDone, { once: true });
        document.getElementById('popup-close-button').addEventListener('click', handlePopupClose, { once: true });
    });
}

function hidePopup() {
    document.body.classList.remove('active-popup');
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
            await showPopup();
        } catch (error) {
            if (error != 'Popup closed') {
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

