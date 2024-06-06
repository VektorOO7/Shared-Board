const backButton = document.querySelector('#back-button');

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
                    //console.log(data.fpath);
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

document.addEventListener("DOMContentLoaded", async () => {
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

});