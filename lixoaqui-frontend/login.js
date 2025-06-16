document.addEventListener('DOMContentLoaded', () =>{
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) =>{
        event.preventDefault();
        console.log('Login "bem-sucedido"! Redirecionando...');
        window.location.href = 'index.html';
    });
});