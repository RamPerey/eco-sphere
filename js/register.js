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

                document
            .getElementById("register-button")
            .addEventListener("click", function (event) {
                event.preventDefault();

                const username = document.querySelector(".registerName").value.trim();
                const password = document.querySelector(".registerPass").value.trim();
                const confirmPassword = document
                    .querySelector(".registerConfirm")
                    .value.trim();
                const errorElement = document.getElementById("passwordError");

                errorElement.textContent = "";
                const passwordPattern = /^[A-Z]/;

                if (username === "" || password === "" || confirmPassword === "") {
                    alert("Mag fill up ka muna.");
                    return;
                }

                if (password !== confirmPassword) {
                    alert("passwords do not match.");
                    return;
                }

                if (password.length < 8) {
                    errorElement.classList.toggle("active");
                    errorElement.textContent = "Password must be 8 characters.";
                    return;
                }

                if (!passwordPattern.test(password)) {
                    errorElement.classList.toggle("active");
                    errorElement.textContent = "Use uppercase for the first character.";
                    return;
                }

                localStorage.setItem("registeredUsername", username);
                localStorage.setItem("registeredPassword", password);

                alert("Registration successful!");
                toggleForms();
            });


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