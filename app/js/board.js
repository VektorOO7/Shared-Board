
const backButton = document.querySelector('#back-button');

const newNoteButton = document.querySelector('#create-board-button');

const popupBoardDataForm = document.querySelector('#popup-board-data-form');

const noteContainer = document.querySelector('.board-container');

let noteCounter = 1;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function getNotes(boardId) {
    try {
        const response = await fetch(`php/get_notes.php?board_id=${boardId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Empty response or non-OK status');
        }

        const result = await response.json();

        if (result.success) {
            //console.log('Notes fetched successfully:', result.notes);
            return {
                success: true,
                notes: result.notes
            };
        } else {
            console.error('Error fetching notes:', result.message);
            return {
                success: false,
                message: result.message
            };
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

async function deleteNote(noteId) {
    try {
        const response = await fetch('php/delete_note.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ note_id: noteId })
        });

        const result = await response.json();

        if (result.success) {
            console.log('Note deleted successfully:', result.message);
            const noteElement = document.getElementById(`note-${noteId}`);
            if (noteElement) {
                noteElement.remove();
            }
            location.reload();
        } else {
            console.error('Error deleting note:', result.message);
        }
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

function renderNote(note) {
    // Create the note container
    const newNote = document.createElement('div');
    newNote.classList.add('note');

    // Create the note title element
    const noteTitle = document.createElement('div');
    noteTitle.classList.add('note-title');
    noteTitle.id = 'note-title-' + note.id; // Use note.id for unique ID
    noteTitle.textContent = note.title; // Use note.title

    // Create the note text element
    const noteText = document.createElement('div');
    noteText.classList.add('note-text');
    noteText.id = 'note-text-' + note.id;
    noteText.textContent = note.text;
/*
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('name', 'file');
    fileInput.setAttribute('id', 'file-' + note.id);
*/
    // Create the delete button
    const deleteNoteButton = document.createElement('button');
    deleteNoteButton.classList.add('delete-note-button');
    deleteNoteButton.id = 'delete-note-button-' + note.id; // Use note.id for unique ID
    deleteNoteButton.textContent = "Delete";

    // Add event listener for the delete button
    deleteNoteButton.addEventListener('click', function() {
        // Code to delete the note (e.g., send a request to the server to delete the note)
        console.log('Delete note with ID:', note.id);
        deleteNote(note.id);
    });

    // Append the note title, text, and delete button to the note container
    newNote.appendChild(noteTitle);
    newNote.appendChild(noteText);
    //newNote.appendChild(fileInput);
    newNote.appendChild(deleteNoteButton);

    // Append the new note to the notes container
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.appendChild(newNote);
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
                    //console.log(decodedFileContent);
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
    const noteFileInput = document.querySelector('#file');

    if (!noteTitleInput) {
        console.error('Popup title not found');
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
            const noteText = noteTextInput.value;
            const noteFile = noteFileInput.files[0];

            if (!noteTitle) {
                console.error('Title and Description cannot be empty');
                return;
            }

            const formData = new FormData();
            formData.append('title', noteTitle);
            formData.append('description', noteText);
            formData.append('board_id', getQueryParam('board'));
            formData.append('file', noteFile);

            try {
                const response = await fetch('php/save_note.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.success) {
                    console.log('Note saved successfully:', result);
                    renderNote(result.note);
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
    const boardId = getQueryParam('board'); // You should dynamically set this

    // Call getNotes to fetch and load the notes when the page loads
    try {
        const result = await getNotes(boardId);
        if (result.success) {
            console.log('Notes fetched successfully:', result.notes);
            // Render the notes on the page
            result.notes.forEach(note => renderNote(note));
        } else {
            console.error('Failed to fetch notes:', result.message);
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
    //new notes button
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