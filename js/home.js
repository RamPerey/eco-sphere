const postButton = document.getElementById('post-button');
postButton.onclick = () => {
    createPost();
}

function createPost() {
    const caption = document.getElementById('task-text').value;
    const category = document.getElementById('category-select').value;
    console.log(caption);
    console.log(category);
}

function displayPost(postData) {
    
}