


const loginForm = document.getElementById('login-form');

function login(loginData) {
    //console.log(loginData); // for testing purposes only

    fetch('php/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    })
    .then((res) => {
        if(res.status == 200){
            window.location.href = 'index.html';
        }
        
        return res.json();
    })
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputs = Array.from(loginForm.getElementsByTagName('input'));
    const loginData = {};
    
    inputs.forEach(input => {
        loginData[input.name] = input.value;
    });

    login(loginData);
});