


const createBoardButton = document.querySelector('#create-board-button');
const accountButton = document.querySelector('#account-button');

const boardContainer = document.querySelector('.board-container');

document.addEventListener("DOMContentLoaded", () => {
    createBoardButton.addEventListener('click', function() {
        const newItem = document.createElement('div');
        
        newItem.className = 'board';
        
        boardContainer.appendChild(newItem);
    });

    accountButton.addEventListener('click', () => {
        console.log("Account button clicked");
    });
});

