function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('ecoProfile')) || {
        name: "Your Name",
        email: "email@here.com",
        picDataUrl: "default-profile.png",
        progress: 0
    };

    profileName.textContent = profile.name;
    profileEmail.textContent = profile.email;
    updateProgressBar(profile.progress || 0);

    // Load user profile image
    fetch('/load-user-data')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const userData = data['user_data'];

            profilePic.src = `${userData['profile_image']}`;
        });
}