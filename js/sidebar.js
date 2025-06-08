loadProfile();

function loadProfile() {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profilePic = document.getElementById('profile-pic');

    // Load user profile image
    fetch('/load-user-data')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const userData = data['user_data'];

            profilePic.src = `${userData['profile_image']}`;

            profileName.textContent = userData['username'];
            profileEmail.textContent = userData['email'];
            // updateProgressBar(profile.progress || 0);
        });
}