
const backButton = document.querySelector('#back-button');
const newNoteButton = document.querySelector('#create-board-button');
const popupBoardDataForm = document.querySelector('#popup-board-data-form');

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', function() {
    const boardId = getQueryParam('board');
    //console.log(boardId);
    if (boardId) { 
        fetch(`php/get_board_content.php?board=${boardId}`)
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    document.getElementById('boardTitle').textContent = 'Error';
                    document.getElementById('boardDescription').textContent = data.message;
                } else {
                    console.log("hey");
                    const decodedFileContent = atob(data.file);
                    console.log(decodedFileContent);
                    // Parse the JSON string
                    const jsonData = JSON.parse(decodedFileContent);
                    document.getElementById('boardTitle').textContent = jsonData.board_title;
                    document.getElementById('boardDescription').textContent = jsonData.description;
                }
            })
            .catch(error => {
                console.error('Error fetching board content:', error);
            });
    } else {
        document.getElementById('boardTitle').textContent = 'Error';
        document.getElementById('boardDescription').textContent = 'No board ID provided in the URL.';
    }
});

async function showPopup() {
    const noteTitleInput = document.querySelector('#popup-title-field');
    const noteTextInput = document.querySelector('#popup-description-field');

    if (!noteTitleInput || !noteTextInput) {
        console.error('Popup title or description field not found');
        return;
    }

    document.body.classList.add('active-popup');

    // Clear input fields
    noteTitleInput.value = '';
    noteTextInput.value = '';

    return new Promise((resolve, reject) => {
        function handlePopupClose() {
            hidePopup();

            reject('Popup closed');
            popupBoardDataForm.removeEventListener('submit', handlePopupDone);
        }

        async function handlePopupDone(event) {
            event.preventDefault();

            const noteTitle = noteTitleInput.value;
            //const boardOwnerUsername = userData.username;
            //const boarduserId = userData.user_id;
            const noteText = noteTextInput.value;

            if (!noteTitle || !noteText) {
                console.error('Title and Description cannot be empty');
                return;
            }
            //checking 
            const $currentBoardId = getQueryParam('board');
            console.log($currentBoardId);
            try {
                const response = await fetch('php/save_note.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: noteTitle,
                        text: noteText,
                        board_id: $currentBoardId//figure out how to get this
                    })
                });

                const result = await response.json();
                if (result.success) {
                    console.log('Note saved successfully:', result);
                    hidePopup();
                    resolve(result.note);
                } else {
                    console.error('Error saving note:', result.message);
                    reject(result.message);
                }
            } catch (error) {
                console.error('Error saving note:', error);
                reject(error);
            }
            document.getElementById('popup-close-button').removeEventListener('click', handlePopupClose);
        }

        popupBoardDataForm.addEventListener('submit', handlePopupDone, { once: true });
        document.getElementById('popup-close-button').addEventListener('click', handlePopupClose, { once: true });
    });
}

function hidePopup() {
    document.body.classList.remove('active-popup');
}

document.addEventListener("DOMContentLoaded", async () => {
    newNoteButton.addEventListener('click', async () => {
        try {
            await showPopup();
        } catch (error) {
            if (error != 'Popup closed') {
                console.error(error);
            }
        }
    });
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

});