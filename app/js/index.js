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

function createBoard(boardData) {
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

async function createNewBoardJSONObject(title, owner, description) {
    return {
        'board_id': await generateUniqueBoardId(),
        'title': title,
        'owner': owner,
        'description': description,
        'board_tabs': []
    };
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
            const boardOwner = userData.username;
            const boardDescription = boardDescriptionInput.value;

            if (!boardTitle || !boardDescription) {
                console.error('Title and Description cannot be empty');
                return;
            }

            const boardData = await createNewBoardJSONObject(boardTitle, boardOwner, boardDescription);

            console.log(boardData);

            createBoard(boardData);
            hidePopup();

            resolve(boardData);
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
        document.getElementById('username-display').textContent = 'Hello, ' + userData.username;
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
        console.log("Account button clicked");

        // this is only temporary, until we add the dropdown menu
        logout();
    });
});

