const postButton = document.getElementById('post-button');
const photoUploadButton = document.getElementById('photo-upload');

let completed = 0;
let postCount = 0;
let postImages = [];

loadFeed();
postButton.onclick = createPost;
photoUploadButton.onchange = uploadImage;

function loadFeed() {
    fetch('/load-feed')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            
            const posts = data['result'];
            for (let postData of posts) {
                postData['images'] = JSON.parse(postData['images']);
                console.log(postData);
                displayPost(postData);
            }
        });
}

function uploadImage(e) {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;

        const imagePreview = document.getElementById('image-preview');
        const imageDOM = document.createElement('img');
        imageDOM.src = imageData;
        
        postImages.push(imageData);
        imagePreview.appendChild(imageDOM);
    }

    reader.readAsDataURL(file);
}

function createPost() {
    const caption = document.getElementById('task-text');
    const category = document.getElementById('category-select');
    const imagePreview = document.getElementById('image-preview');
    console.log(postImages);

    const postData = {
        caption: caption.value,
        category: category.value,
        images: postImages,
        completed: 'F'
    }
    
    const data = postData;
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }

    fetch('/create-post', options)
        .then(res => res.json())
        .then(data => {
            if (!data['success']) {
                console.log(data['error']);
                return;
            }

            postData['post_id'] = data['post_id'];
            displayPost(postData);
        });

    caption.value = '';
    category.value = 'general';
    imagePreview.innerHTML = '';
    postImages = [];
}

function displayPost(postData) {
    const postsContainer = document.getElementById('posts-container');

    const postDOM = document.createElement('div');
    postDOM.classList.add('post');
    postDOM.innerHTML = `<p class="task-text">${postData['caption']}</p>
                         <span class="category-label category-${postData['category']}">${postData['category']}</span>
                         <div class="post-images"></div>
                         <div class="post-actions">
                            <button class="status-button">Complete</button>
                            <button class="delete-button">Delete</button>
                         </div>`;

    postsContainer.insertBefore(postDOM, postsContainer.firstChild);

    const imagesContainer = postDOM.querySelector('.post-images');
    const statusButton = postDOM.querySelector('.status-button');
    const deleteButton = postDOM.querySelector('.delete-button');

    postData['images'].forEach(src => {
        const imageDOM = document.createElement('img');
        imageDOM.src = src;
        imagesContainer.appendChild(imageDOM);
    });

    completed = postData['completed'] === 'T' ? completed + 1 : completed;
    console.log(completed);
    statusButton.textContent = postData['completed'] === 'T' ? 'Undo' : 'Complete';
    statusButton.onclick = () => {
        const data = {
            post_id: postData['post_id']
        }
        
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }

        fetch('/toggle-status', options)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (!data['success']) {
                    return;
                }

                statusButton.textContent = data['status'] === 'T' ? 'Undo' : 'Complete';
                completed = data['status'] === 'T' ? completed + 1 : completed - 1;
                updateProgressBar();
            });
    }

    deleteButton.onclick = () => deletePost(postData, postDOM);

    postCount++;
    updateProgressBar();
}

function deletePost(postData, postDOM) {
    const data = {
        post_id: postData['post_id']
    }
    
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }

    fetch('delete-post', options)
        .then(res => res.json())
        .then(data => {
            if (!data['success']) {
                return;
            }

            postDOM.remove();
        });
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressLabel = document.getElementById('progress-label');

    let progress = ((completed / postCount) * 100).toFixed(2);
    console.log(progress);

    progressBar.style.width = progress + '%';
    progressLabel.textContent = progress + '%';
}