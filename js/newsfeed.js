fetch('/load-feed')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        renderFeed(data['result']);
        filterFeedHandler();
    });
        
function renderFeed(posts) {
    const feedContainer = document.getElementById('feed-posts');
    posts.forEach(post => {
        console.log(JSON.parse(post['images']));
        const el = document.createElement('div');
        el.classList.add('post');
    
        el.innerHTML = `
            <div class="post-header">
            <img class="profile-pic">
            <div class="poster-name">${post['username']}</div>
            </div>
            <div class="task-text">${post['caption']}</div>
            <span class="category-label">${post['category']}</span>
            <div class="post-images"></div>
            `;
        feedContainer.appendChild(el);

        const postImages = el.querySelector('.post-images');
        const images = JSON.parse(post['images']);
        for (let i = 0; i < images.length; i++) {
            const imageElement = document.createElement('img');
            imageElement.classList.add('image');
            imageElement.src = images[i];

            postImages.appendChild(imageElement);
        }

        const profileImage = el.querySelector('.profile-pic');
        
        profileImage.src = post['profile_image'];
    });
}

function filterFeedHandler() {
    const feedPosts = document.getElementById('feed-posts');
    const posts = feedPosts.querySelectorAll('.post');
    console.log(posts);

    const categorySelect = document.getElementById('category-select');
    categorySelect.onchange = () => {
        console.log(categorySelect.value);
        posts.forEach(post => {
            const category = post.querySelector('.category-label').innerText;
            post.style.display = (category === categorySelect.value || categorySelect.value === 'all') ? '' : 'none';
        });
    }
}