// Sample data from "other users"
const communityPosts = [
  {
    name: "Mack",
    text: "ABSENT NUNG DAY 1!",
    category: "rants"
  },
  {
    name: "Mack",
    text: "TUMAKAS NUNG DAY 2!",
    category: "rants"
  },
  {
    name: "Jymmuel",
    text: "Bahay namen pinagtatapunan ng basura!!",
    category: "rants"
  },
  {
    name: "Anonymous",
    text: "AQ GUMAWA LAHAT NG TASKS!",
    category: "rants"
  }
];

const feedContainer = document.getElementById('feed-posts');

function renderFeed(posts) {
  posts.forEach(post => {
    const el = document.createElement('div');
    el.classList.add('post');
    el.innerHTML = `
      <div class="poster-name">${post.name}</div>
      <div class="task-text">${post.text}</div>
      <span class="category-label">${post.category}</span>
    `;
    feedContainer.appendChild(el);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderFeed(communityPosts);
});
