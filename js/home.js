const postButton = document.getElementById('post-button');
const photoUploadButton = document.getElementById('photo-upload');

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

            displayPost(postData);
        });

    caption.value = '';
    category.value = 'general';
    imagePreview.innerHTML = '';
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

    statusButton.textContent = postData['complete'] === 'T' ? 'Undo' : 'Complete';
    statusButton.onclick = () => {
        postData['complete'] = postData['complete'] === 'T' ? 'F' : 'T'; // Toggle status
        statusButton.textContent = postData['complete'] === 'T' ? 'Undo' : 'Complete';
    }

    deleteButton.onclick = () => {
        postDOM.remove();
    }        
}