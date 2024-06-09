const backButton = document.querySelector('#back-button');

const newNoteButton = document.querySelector('#create-note-button');

const popupBoardDataForm = document.querySelector('#popup-board-data-form');

const noteContainer = document.querySelector('.board-container');

let noteCounter = 1;

let renderedNotes = [];

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function unrenderNote(note) {
    renderedNotes.splice(renderedNotes.indexOf(note), 1);

    note.remove();
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
            const noteElement = document.getElementById('note-' + noteId);
            if (noteElement) {
                unrenderNote(noteElement);
                //noteElement.remove();
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
    const newNote = document.createElement('div');
    newNote.classList.add('note');
    renderedNotes.push(newNote);

    const noteTitle = document.createElement('div');
    noteTitle.classList.add('note-title');
    noteTitle.id = 'note-title-' + note.id;
    noteTitle.textContent = note.title;

    const noteText = document.createElement('div');
    noteText.classList.add('note-text');
    noteText.id = 'note-text-' + note.id;
    noteText.textContent = note.text;

    if (note.file) {
        const fileDisplay = document.createElement('div');
        fileDisplay.classList.add('file-display');

        if (note.file && note.file.type /*&& note.file.type.startsWith('image/')*/) {
            // If it's an image, create an <img> tag to display it
            const image = document.createElement('img');
            image.src = 'data:' + note.file.type + ';base64,' + note.file.content; 
            fileDisplay.appendChild(image);

             // If it's not an image, create a download link
            
             const downloadLink = document.createElement('a');
             downloadLink.href = 'data:' + note.file.type + ';base64,' + note.file.content; // The file content schould be base64 encoded
             downloadLink.download = note.file.name;
             downloadLink.textContent = 'Download File';
             fileDisplay.appendChild(downloadLink);

        } /*else if(note.file.type.startsWith('image/')){
            
            const downloadLink = document.createElement('a');
            downloadLink.href = 'data:' + note.file.type + ';base64,' + note.file.content;
            downloadLink.download = note.file.name;
            downloadLink.textContent = 'Download File';
            fileDisplay.appendChild(downloadLink);
        }*/

        newNote.appendChild(fileDisplay);
    }

    const deleteNoteButton = document.createElement('button');
    deleteNoteButton.classList.add('delete-note-button');
    deleteNoteButton.id = 'delete-note-button-' + note.id;
    deleteNoteButton.textContent = "Delete";

    deleteNoteButton.addEventListener('click', function() {
        console.log('Delete note with ID:', note.id);
        deleteNote(note.id);
    });

    newNote.appendChild(noteTitle);
    newNote.appendChild(noteText);
    newNote.appendChild(deleteNoteButton);

    const notesContainer = document.getElementById('notes-container');
    notesContainer.appendChild(newNote);
}


document.addEventListener('DOMContentLoaded', function() {
    const boardId = getQueryParam('board');
    console.log(boardId);
    if (boardId) {
        fetch(`php/get_board_content.php?board=${boardId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('board-title-text').textContent = 'Error';
                } else {
                    console.log("hey");
                    const decodedFileContent = atob(data.file);
                    console.log(decodedFileContent);
                    // Parse the JSON string
                    const jsonData = JSON.parse(decodedFileContent);
                    document.getElementById('board-title-text').textContent = jsonData.board_title;
                }
            })
            .catch(error => {
                console.error('Error fetching board content:', error);
            });
    } else {
        document.getElementById('board-title-text').textContent = 'Error';
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
                console.error('Title cannot be empty');
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
                    //console.log('Note saved successfully:', result);
                    renderNote(result.note);
                    hidePopup();
                    location.reload();
                    //resolve(result.note);
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
    const boardId = getQueryParam('board');

    try {
        const result = await getNotes(boardId);
        if (result.success) {
            console.log('Notes fetched successfully:', result.notes);
            result.notes.forEach(note => renderNote(note));
        } else {
            console.error('Failed to fetch notes:', result.message);
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
    }

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