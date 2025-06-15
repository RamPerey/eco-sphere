const postButton = document.getElementById('post-button');
const photoUploadButton = document.getElementById('photo-upload');

let completed = 0;
let postCount = 0;
let postImages = [];

loadTask();
postButton.onclick = createPost;
photoUploadButton.onchange = uploadImage;

function loadTask() {
    fetch('/load-task')
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
    console.log(postImages.length);
   
    if (postImages.length === 5) {
        alert('You can upload a maximum of 5 photos.');
        return;
    }

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

const ecoTip = document.getElementById('eco-tip');
function showEcoTip(category) {
    const tips = {
        general: "MAHIYA MGA DI TUMUTULONG SA GROUP 1 JAN!",
        biodegradable: "tubero ka ba? plumbing naman... Garbage separation is important!",
        specialWaste: "Handa akong maging siomai kapag tinotoyo ka... Please our environment clean!",
        residual: "BE A RESPONSIBLE STUDENT. KALAT MO, TAPON MO!",
        rants: "AYAW MO NA AYAW KO NA DEN... Maglinis ng paligid para di mawala ang ating earth"
    };
    ecoTip.textContent = tips[category] || '';
}

const category = document.getElementById('category-select');
category.onchange = () => {
    showEcoTip(category.value);
} 



function createPost() {
    const caption = document.getElementById('task-text');
    const category = document.getElementById('category-select');
    const imagePreview = document.getElementById('image-preview');
    // const files = Array.from(photoUploadButton.files); 

    const text = caption.value.trim();
    if (!text) {
        alert('Please enter the task description.');
        return;
    }

    if (postImages.length < 1) {
        alert('BAWAL MADUGA TINGIN KUNG NAGLILINIS TALAGA.');
        return;
    }

    showEcoTip(category.value);

    const postData = {
        caption: text,
        category: category.value,
        images: postImages,
        completed: 'F'
    };

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    };

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
    photoUploadButton.value = '';
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
                
                postData['completed'] = data['status'];

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

    fetch('/delete-post', options)
        .then(res => res.json())
        .then(data => {
            if (!data['success']) {
                return;
            }

            completed = postData['completed'] === 'T' ? completed - 1 >= 0 ? completed - 1: completed : completed ;
            postCount = postCount - 1 >= 0 ? postCount - 1 : postCount;
            console.log(completed);
            console.log(postCount);
            updateProgressBar();
            postDOM.remove();
        });
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressLabel = document.getElementById('progress-label');
    
    let progress = 0;
    if (completed === 0 && postCount === 0) {
        progress = 0;
    }
    else {
        progress = ((completed / postCount) * 100).toFixed(2);
    }

    progress = progress == 0 ? Math.trunc(progress) : progress;
    console.log(progress);

    progressBar.style.width = progress + '%';
    progressLabel.textContent = progress + '%';
}
