const profilePicInput = document.getElementById('profile-pic-input');
const profilePicPreview = document.getElementById('profile-pic-preview');
const fileNameDisplay = document.getElementById('file-name');

let imageData = null;

profilePicInput.addEventListener('change', () => {
  const file = profilePicInput.files[0];

  if (file) {
    fileNameDisplay.textContent = file.name;
    

    const reader = new FileReader();
    reader.onload = function(e) {
      profilePicPreview.src = e.target.result;
      imageData = e.target.result;
    };

    reader.readAsDataURL(file);
  } 
  else {
    fileNameDisplay.textContent = 'No file selected';
  }
});

const form = document.getElementById('profile-form');
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('name-input').value.trim();
  const email = document.getElementById('email-input').value.trim();

  const data = {
      username: username,
      email: email,
      profile_image: (imageData === null ? localStorage.getItem('profile_image') : imageData)
    }

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    fetch('/update-user-data', options)
      .then(res => res.json())
      .then(data => {
        if (!data['success']) {
          return;
        }
        
        document.getElementById('save-message').textContent = "Profile saved! Redirecting...";
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      });
  
});

window.addEventListener('DOMContentLoaded', () => {
  fetch('/load-user-data')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const userData = data['user_data'];

      document.getElementById('name-input').value = userData['username'] || '';
      document.getElementById('email-input').value = userData['email'] || '';
      
      profilePicPreview.src = `${userData['profile_image']}`;
      fileNameDisplay.textContent = 'Current profile picture';

      localStorage.setItem('profile_image', userData['profile_image']);
    });
});
