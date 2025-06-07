function toggleForms() {
    // const login = document.getElementById("loginForm");
    // const register = document.getElementById("registerForm");
    //     login.classList.toggle("hidden");
    //     register.classList.toggle("hidden");
}

document.getElementById('login-button').addEventListener('click', function (e) {
    e.preventDefault();

    /* Inconsistent naming format haha */
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === '' || password === '') {
        alert("Please fill the form.");
        return;
    }

    if (username != storedUsername && password != storedPassword) {
        alert('Invalid Password or Username.');
    } else {
        window.location.href = 'index.html';
    }
});