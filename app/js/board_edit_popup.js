


function showPopup() {
    document.body.classList.add('active');
}

function hidePopup() {
    document.body.classList.remove('active');
}

    // Add event listener to the trigger button to show the popup
    document.getElementById('trigger-button').addEventListener('click', showPopup);

    // Add event listener to the close button to hide the popup
    document.getElementById('close-popup').addEventListener('click', hidePopup);