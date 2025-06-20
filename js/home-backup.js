const postTextarea = document.getElementById('task-text');
const categorySelect = document.getElementById('category-select');
const photoUpload = document.getElementById('photo-upload');
const imagePreview = document.getElementById('image-preview');
const postButton = document.getElementById('post-button');
const postsContainer = document.getElementById('posts-container');
const ecoTip = document.getElementById('eco-tip');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profilePic = document.getElementById('profile-pic');
const progressBar = document.getElementById('progress-bar');

let posts = JSON.parse(localStorage.getItem('posts')) || [];

function displayPosts() {
    postsContainer.innerHTML = '';
    posts.forEach((post, idx) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        if (post.completed) postDiv.classList.add('completed');

        postDiv.innerHTML = `<p class="task-text">${post.text}</p>
                            <span class="category-label category-${post.category}">${post.category}</span>`;

        if (post.images?.length) {
            const imagesContainer = document.createElement('div');
            imagesContainer.classList.add('post-images');

            post.images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                imagesContainer.appendChild(img);
            });

            postDiv.appendChild(imagesContainer);
        }

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('post-actions');

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = post.completed ? 'Undo' : 'Complete';
        toggleBtn.onclick = () => {
            posts[idx].completed = !posts[idx].completed;
            saveAndRefresh();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
            posts.splice(idx, 1);
            saveAndRefresh();
        };

        actionsDiv.appendChild(toggleBtn);
        actionsDiv.appendChild(deleteBtn);
        postDiv.appendChild(actionsDiv);
        postsContainer.appendChild(postDiv);
    });
}

function saveAndRefresh() {
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
    updateProgressFromPosts();
}

function updateProgressBar(value) {
    const percent = Math.min(Math.max(value, 0), 100);
    progressBar.style.width = percent + '%';
    progressBar.textContent = percent + '%';
}

function updateProgressFromPosts() {
    const profile = JSON.parse(localStorage.getItem('ecoProfile')) || {};
    if (posts.length === 0) {
        profile.progress = 0;
    } 
    else {
        const completedCount = posts.filter(p => p.completed).length;
        profile.progress = Math.round((completedCount / posts.length) * 100);
    }

    localStorage.setItem('ecoProfile', JSON.stringify(profile));
    updateProgressBar(profile.progress || 0);
}

function showEcoTip(category) {
    const tips = {
        general: "MAHIYA MGA DI TUMUTULONG SA GROUP 1 JAN!",
        biodegradable: "tubero ka ba? plumbing naman... Garbage separation is important!",
        specialWaste: "Handa akong maging siomai kapag tinotoyo ka... Please our environment clean!",
        residual: "BE A RESPONSIBLE STUDENT. KALAT MO, TAPON MO!"
    };
    ecoTip.textContent = tips[category] || '';
}

photoUpload.addEventListener('change', () => {
    imagePreview.innerHTML = '';
    const files = Array.from(photoUpload.files);

    if (files.length > 5) {
        alert('You can upload a maximum of 5 photos.');
        photoUpload.value = '';
        return;
    }

    if (files.length < 1) {
        alert('BAWAL MADUGA, TINGIN KUNG NAGLILINIS TALAGA.');
        photoUpload.value = '';
        return;
    }

files.forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = e => {
        const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '80px';
            img.style.borderRadius = '12px';
            img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            imagePreview.appendChild(img);
        };

        reader.readAsDataURL(file);
    });
});

categorySelect.addEventListener('change', e => {
    showEcoTip(e.target.value);
});

postButton.addEventListener('click', () => {
const text = postTextarea.value.trim();
const category = categorySelect.value;
const files = Array.from(photoUpload.files);

if (!text) {
    alert('Please enter the task description.');
    return;
}
if (files.length < 1) {
    alert('BAWAL MADUGA TINGIN KUNG NAGLILINIS TALAGA.');
    return;
}
if (files.length > 5) {
    alert('You can upload a maximum of 5 photos.');
    return;
}

const imagePromises = files.map(file => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    }));

    Promise.all(imagePromises).then(imagesData => {
        const newPost = {
            text,
            category,
            completed: false,
            images: imagesData
        };

        console.log(imagesData);

        posts.unshift(newPost);
        saveAndRefresh();

        // Reset
        postTextarea.value = '';
        categorySelect.value = 'general';
        photoUpload.value = '';
        imagePreview.innerHTML = '';
        ecoTip.textContent = '';
    });
});

// Init
loadProfile();
displayPosts();
showEcoTip(categorySelect.value);