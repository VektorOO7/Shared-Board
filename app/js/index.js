


const createBoardButton = document.querySelector('#create-board-button');
const accountButton = document.querySelector('#account-button');

const boardContainer = document.querySelector('.board-container');

let boardCounter = 0;

function createBoard(title, owner, description) {
    const newBoard = document.createElement('div');
    newBoard.classList.add('board');

    const boardTitle = document.createElement('div');
    boardTitle.classList.add('board-title');
    boardTitle.id = 'board-title-' + boardCounter;
    boardTitle.textContent = title;

    const boardOwner = document.createElement('div');
    boardOwner.classList.add('board-owner');
    boardOwner.id = 'board-owner-' + boardCounter;
    boardOwner.textContent = owner;

    const boardDescription = document.createElement('div');
    boardDescription.classList.add('board-description');
    boardDescription.id = 'board-description-' + boardCounter;
    boardDescription.textContent = description;

    newBoard.appendChild(boardTitle);
    newBoard.appendChild(boardOwner);
    newBoard.appendChild(boardDescription);

    boardContainer.appendChild(newBoard);

    boardCounter++;
}

function checkSessionAndLoadData() {
    fetch('php/index.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.active) {
            console.log('Session is not active');
            // Redirect to login page or show an error message
            //window.location.href = 'login.html';
            //return false;
        } else {
            console.log('Session is active', data.user);
            // Call the function to load other content or execute further logic
            //loadAdditionalContent();
            //return true;
        }
    })
    .catch(error => {
        console.error('Error checking session:', error);
    });
}

function logout(){
    fetch('php/logout.php', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Logged out successfully');
            // Redirect to login page
            //window.location.href = 'login.html';
        } else {
            console.error('Logout failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    createBoardButton.addEventListener('click', function() {
        createBoard('Example Title', 'Example Owner', 'This is an example description about a board!')
    });

    accountButton.addEventListener('click', () => {
        console.log("Account button clicked");
        //if(checkSessionAndLoadData()){
            //console.log("Session is active");
            logout();
        //}
        //console.log("Session is NOT active");
    });

    checkSessionAndLoadData();
});

