const registerForm = document.getElementById('register-form');

registerForm.onsubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm-password').value;
    const email = document.getElementById('email').value    ;

    const data = {
        username: username,
        password: password,
        confirm: confirm,
        email: email
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }

    fetch('/register', options)
        .then(res => res.json())
        .then(data => {
            if (!data['success']) {
                document.getElementById('message').innerHTML = data['error'];
                return;
            }

            window.location.href = '/html/login.html';
        });
}