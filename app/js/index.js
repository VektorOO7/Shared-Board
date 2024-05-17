


document.addEventListener("DOMContentLoaded", () => {
    const createBoardButton = document.querySelector('#create-board-button');
    const accountButton = document.querySelector('#account-button');

    createBoardButton.addEventListener('click', () => {
        console.log("Create board button clicked");
    });

    accountButton.addEventListener('click', () => {
        console.log("Account button clicked");
    });
});
