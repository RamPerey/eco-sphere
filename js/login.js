const loginForm = document.getElementById('login-form');
loginForm.onsubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        username: username,
        password: password,
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }

    fetch('/login', options)
        .then(res => res.json())
        .then(data => { 
            console.log(data);
                
            if (!data['success']) {
                document.getElementById('message').innerHTML = data['error'];
                return;
            }

            sessionStorage.setItem('username', data['username']);                
            window.location.href = '/';
        });
}