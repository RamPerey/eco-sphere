const profilePicInput = document.getElementById('profile-pic-input');
const profilePicPreview = document.getElementById('profile-pic-preview');
const fileNameDisplay = document.getElementById('file-name');

profilePicInput.addEventListener('change', () => {
  const file = profilePicInput.files[0];
  if (file) {
    fileNameDisplay.textContent = file.name;

    const reader = new FileReader();
    reader.onload = function(e) {
      profilePicPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    fileNameDisplay.textContent = 'No file selected';
  }
});

const form = document.getElementById('profile-form');
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name-input').value.trim();
  const email = document.getElementById('email-input').value.trim();
  const picFile = profilePicInput.files[0];

  const profileData = {
    name,
    email,
  };

  if (picFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileData.picDataUrl = e.target.result;
      localStorage.setItem('ecoProfile', JSON.stringify(profileData));
      document.getElementById('save-message').textContent = "Profile saved! Redirecting...";
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    };
    reader.readAsDataURL(picFile);
  } else {
    profileData.picDataUrl = profilePicPreview.src;
    localStorage.setItem('ecoProfile', JSON.stringify(profileData));
    document.getElementById('save-message').textContent = "Profile saved! Redirecting...";
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const saved = JSON.parse(localStorage.getItem('ecoProfile'));
  if (saved) {
    document.getElementById('name-input').value = saved.name || '';
    document.getElementById('email-input').value = saved.email || '';
    if (saved.picDataUrl) {
      profilePicPreview.src = saved.picDataUrl;
      fileNameDisplay.textContent = 'Current profile picture';
    }
  }
});
