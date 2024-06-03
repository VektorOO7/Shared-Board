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
    const temp_board_count = boardCounter;//fixes the boardCount bug
    const newBoard = document.createElement('div');
    newBoard.classList.add('board');

    const boardTitle = document.createElement('div');
    boardTitle.classList.add('board-title');
    boardTitle.id = 'board-title-' + temp_board_count;
    boardTitle.textContent = boardData.title;

    const boardOwner = document.createElement('div');
    boardOwner.classList.add('board-owner');
    boardOwner.id = 'board-owner-' + temp_board_count;
    boardOwner.textContent = 'Owner: ' + boardData.owner;

    const boardDescription = document.createElement('div');
    boardDescription.classList.add('board-description');
    boardDescription.id = 'board-description-' + temp_board_count;
    boardDescription.textContent = boardData.description;

    const boardOpen = document.createElement('button');
    boardOpen.classList.add('board-open-button');
    boardOpen.id = 'board-open-button-' + temp_board_count;
    boardOpen.textContent = "Open";

    boardOpen.addEventListener('click', function() {
        window.location.href = 'board.html?board=' + temp_board_count;
    });

    newBoard.appendChild(boardTitle);
    newBoard.appendChild(boardOwner);
    newBoard.appendChild(boardDescription);
    newBoard.appendChild(boardOpen);

    boardContainer.appendChild(newBoard);

    boardCounter++;
}

function createNewBoardJSONObject(title, owner, description) {
    return {
        'title': title,
        'owner': owner,
        'description': description,
        'board tabs': []
    };
}

function showPopup() {
    document.body.classList.add('active-popup');

    return new Promise((resolve, reject) => {
        function handlePopupClose() {
            hidePopup();

            reject('Popup closed');
            popupBoardDataForm.removeEventListener('submit', handlePopupDone);
        }

        function handlePopupDone(event) {
            event.preventDefault();

            const boardTitle = document.querySelector('#popup-title-field').value;
            const boardOwner = userData.username;
            const boardDescription = document.querySelector('#popup-description-field').value;

            const boardData = createNewBoardJSONObject(boardTitle, boardOwner, boardDescription);

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

    createBoardButton.addEventListener('click', async function() {
        await showPopup();
    });

    accountButton.addEventListener('click', () => {
        console.log("Account button clicked");

        // this is only temporary, until we add the dropdown menu
        logout();
    });
});

