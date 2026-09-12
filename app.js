document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  loadBlogPosts();
});

// 1. Fetch, Filter, Sort & Render Projects
async function loadProjects() {
  const container = document.querySelector('.projects-grid');
  if (!container) return;

  try {
    const response = await fetch('./content/projects.json');
    if (!response.ok) return;

    const data = await response.json();
    let projects = data.items || [];

    // Filter out items set to published: false
    projects = projects.filter((item) => item.published !== false);

    // Sort by order parameter (lower numbers display first)
    projects.sort((a, b) => (a.order || 99) - (b.order || 99));

    if (projects.length === 0) return;

    container.innerHTML = projects
      .map((project) => {
        const tags = Array.isArray(project.tech_stack)
          ? project.tech_stack
          : (project.tech_stack || '').split(',').map((t) => t.trim());

        return `
                <article class="project-card">
                    <div class="card-image">
                        <img src="${project.thumbnail || './project1.jpg'}" alt="${project.title}">
                        ${
                          project.devlog_slug
                            ? `
                            <div class="card-overlay">
                                <a href="#blog-${project.devlog_slug}" class="devlog-badge">
                                    <i class="fa-solid fa-book-open"></i> Read Devlog
                                </a>
                            </div>`
                            : ''
                        }
                    </div>
                    <div class="card-content">
                        <div class="tech-tags">
                            ${tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <h3 class="card-title">${project.title}</h3>
                        <p class="card-text">${project.description || ''}</p>
                        <div class="card-links">
                            ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="card-link"><i class="fa-brands fa-github"></i> Source</a>` : ''}
                            ${project.live_url ? `<a href="${project.live_url}" target="_blank" class="card-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ''}
                        </div>
                    </div>
                </article>
            `;
      })
      .join('');
  } catch (err) {
    console.log('Using default fallback project HTML:', err);
  }
}

// 2. Fetch, Filter, Sort & Render Blog Posts
async function loadBlogPosts() {
  const container = document.querySelector('.blog-grid');
  if (!container) return;

  try {
    const response = await fetch('./content/blog.json');
    if (!response.ok) return;

    const data = await response.json();
    let posts = data.items || [];

    // Filter out items set to published: false
    posts = posts.filter((item) => item.published !== false);

    // Sort by order parameter
    posts.sort((a, b) => (a.order || 99) - (b.order || 99));

    if (posts.length === 0) return;

    container.innerHTML = posts
      .map(
        (post) => `
            <article class="blog-card">
                <div class="blog-meta">
                    <span class="meta-item"><i class="fa-regular fa-calendar"></i> ${post.date || ''}</span>
                    <span class="meta-item"><i class="fa-regular fa-clock"></i> ${post.read_time || ''}</span>
                    <span class="meta-tag">${post.category || 'General'}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt || ''}</p>
                <a href="#" class="read-more-btn">Read Article <i class="fa-solid fa-arrow-right"></i></a>
            </article>
        `,
      )
      .join('');
  } catch (err) {
    console.log('Using default fallback blog HTML:', err);
  }
}
