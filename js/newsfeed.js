fetch('/load-feed')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        renderFeed(data['result']);
    });

        
function renderFeed(posts) {
    const feedContainer = document.getElementById('feed-posts');
    posts.forEach(post => {
        const el = document.createElement('div');
        el.classList.add('post');
        el.innerHTML = `
            <div class="poster-name">${post['username']}</div>
            <div class="task-text">${post['caption']}</div>
            <span class="category-label">${post['category']}</span>
            <div class="post-images">${post['images']}</div>
            `;
        feedContainer.appendChild(el);
    });
}



