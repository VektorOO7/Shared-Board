


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

document.addEventListener("DOMContentLoaded", () => {
    createBoardButton.addEventListener('click', function() {
        createBoard('Example Title', 'Example Owner', 'This is an example description about a board!')
    });

    accountButton.addEventListener('click', () => {
        console.log("Account button clicked");
    });
});

