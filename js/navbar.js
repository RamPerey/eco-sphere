const logoutButton = document.getElementById('logout-button');
logoutButton.onclick = logout;
function logout(e) {
    e.stopPropagation();
    fetch('/logout')
        .then(res => res.json())
        .then(data => {
            if (data['success']) {
                sessionStorage.removeItem('username');
                window.location.href = '/';
            }
        });
}