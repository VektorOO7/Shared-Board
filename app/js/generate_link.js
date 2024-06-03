document.getElementById('shareButton').addEventListener('click', function() {
    // Assume the pageId is 1 for this example
    var pageId = 1;

    fetch('php/generate_link.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageId: pageId }),
    })
    .then(response => response.json())//test to see how the errors are checked
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
