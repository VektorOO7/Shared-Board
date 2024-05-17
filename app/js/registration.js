const regForm = document.getElementById('reg-form');
const containerDiv = document.querySelector('.container');

if (regForm && containerDiv) {
    regForm.addEventListener('submit', (event) => {
       event.preventDefault();
       const formData = new FormData(regForm);
       const data = Object.fromEntries(formData.entries()); 
 
       fetch('../php/registration.php', {
           method: 'POST',
           body: JSON.stringify(data),
           headers: {
               'Content-Type': 'application/json'
           }
       })
       .then(response => response.json()) 
       .then(responseData => {
           
       })
    });
 }