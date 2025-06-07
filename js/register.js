const registerButton = document.getElementById('register-button');

registerButton.onclick = () => {
    const username = document.getElementById('usermame');
    const password = document.getElementById('password');
    const confirm = document.getElementById('confirm-password');
    const email = document.getElementById('email');

    const data = {
        username: username,
        password: password,
        confirm: confirm,
        email: email
    }

    fetch('/registers')
        .then()
}