const registerForm = document.getElementById('register-form');

registerForm.onsubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const email = document.getElementById('email').value.trim();
    const errorElement = document.getElementById('passwordError');
    const passwordPattern = /^[A-Z]/;

    errorElement.textContent = "";
    errorElement.classList.remove("active");

    if (!username || !password || !confirmPassword || !email) {
        alert("Mag fill up ka muna.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 8) {
        errorElement.classList.add("active");
        errorElement.textContent = "Password must be at least 8 characters.";
        return;
    }

    if (!passwordPattern.test(password)) {
        errorElement.classList.add("active");
        errorElement.textContent = "Use uppercase for the first character.";
        return;
    }

    localStorage.setItem("registeredUsername", username);
    localStorage.setItem("registeredPassword", password);

    alert("Registration successful!");

    const data = { username, password, confirm: confirmPassword, email };

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                document.getElementById('message').textContent = data.error;
                return;
            }

            window.location.href = '/html/login.html';
        });
};
