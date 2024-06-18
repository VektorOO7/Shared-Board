document.getElementById('shareButton').addEventListener('click', function() {
    var pageId = 1;

    fetch('php/generate_link.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageId: pageId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.url) {
            document.getElementById('shareLink').textContent = data.url;
        } else {
            document.getElementById('shareLink').textContent = 'Failed to generate URL.';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('shareLink').textContent = 'An error occurred.';
    });
});
