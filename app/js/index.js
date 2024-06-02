


let userData;

const createBoardButton = document.querySelector('#create-board-button');
const accountButton = document.querySelector('#account-button');

const boardContainer = document.querySelector('.board-container');

let boardCounter = 0;

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
    boardOwner.textContent = boardData.owner;

    const boardDescription = document.createElement('div');
    boardDescription.classList.add('board-description');
    boardDescription.id = 'board-description-' + boardCounter;
    boardDescription.textContent = boardData.description;

    const boardOpen = document.createElement('button');
    boardOpen.classList.add('board-open-button');
    boardOpen.id = 'board-open-button-' + boardCounter;
    boardOpen.textContent = "Open";

    newBoard.appendChild(boardTitle);
    newBoard.appendChild(boardOwner);
    newBoard.appendChild(boardDescription);
    newBoard.appendChild(boardOpen);

    boardContainer.appendChild(newBoard);

    boardCounter++;
}

function showPopup() {
    let boardData = {
        'title': 'New Board',
        'owner': userData.username,
        'description': 'Description'
    };

    document.body.classList.add('active-popup');

    return new Promise((resolve) => {
        document.getElementById('popup-done-button').addEventListener('click', function() {
            createBoard(boardData);

            hidePopup();

            resolve(boardData);
        }, { once: true });
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

