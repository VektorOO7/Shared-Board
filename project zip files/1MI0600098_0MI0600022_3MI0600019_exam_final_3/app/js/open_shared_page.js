document.addEventListener('DOMContentLoaded', function() {
    // Get the token from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        fetch('shared_page.php?token=' + token)
        .then(response => response.text())
        .then(data => {
            document.getElementById('pageContent').innerHTML = data;
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('pageContent').innerHTML = 'An error occurred while loading the page.';
        });
    } else {
        document.getElementById('pageContent').innerHTML = 'Invalid or missing token.';
    }
});
