document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
    loadBlogPosts();
});

// 1. Fetch & Render Projects
async function loadProjects() {
    const container = document.querySelector(".projects-grid");
    if (!container) return;

    try {
        // Fetch project files index or list of files
        // For static setups, you can fetch directly or maintain an index array
        const response = await fetch("./content/projects/index.json");
        const projects = await response.json();

        container.innerHTML = projects.map(project => `
            <article class="project-card">
                <div class="card-image">
                    <img src="${project.thumbnail}" alt="${project.title}">
                    ${project.devlog_slug ? `
                        <div class="card-overlay">
                            <a href="#blog-${project.devlog_slug}" class="devlog-badge">
                                <i class="fa-solid fa-book-open"></i> Read Devlog
                            </a>
                        </div>` : ''
                    }
                </div>
                <div class="card-content">
                    <div class="tech-tags">
                        ${project.tech_stack.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-text">${project.description}</p>
                    <div class="card-links">
                        ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="card-link"><i class="fa-brands fa-github"></i> Source</a>` : ''}
                        ${project.live_url ? `<a href="${project.live_url}" target="_blank" class="card-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ''}
                    </div>
                </div>
            </article>
        `).join('');
    } catch (err) {
        console.log("Using static project markup or loading initial content...", err);
    }
}

// 2. Fetch & Render Blog Posts
async function loadBlogPosts() {
    const container = document.querySelector(".blog-grid");
    if (!container) return;

    try {
        const response = await fetch("./content/blog/index.json");
        const posts = await response.json();

        container.innerHTML = posts.map(post => `
            <article class="blog-card" id="blog-${post.slug}">
                <div class="blog-meta">
                    <span class="meta-item"><i class="fa-regular fa-calendar"></i> ${post.date}</span>
                    <span class="meta-item"><i class="fa-regular fa-clock"></i> ${post.read_time}</span>
                    <span class="meta-tag">${post.category}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="#" class="read-more-btn">Read Article <i class="fa-solid fa-arrow-right"></i></a>
            </article>
        `).join('');
    } catch (err) {
        console.log("Using static blog markup or loading initial content...", err);
    }
}