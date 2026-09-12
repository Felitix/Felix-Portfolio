document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  loadBlogPosts();
});

// Helper function to fetch multiple individual JSON files listed in index.json
async function fetchFolderContents(indexPath, folderPath) {
  try {
    const indexResponse = await fetch(indexPath);
    if (!indexResponse.ok) return [];

    const fileNames = await indexResponse.json();

    // Fetch each JSON file concurrently
    const fetchPromises = fileNames.map(async (fileName) => {
      const res = await fetch(`${folderPath}/${fileName}`);
      if (!res.ok) return null;
      const data = await res.json();
      data._slug = fileName.replace('.json', '');
      return data;
    });

    const results = await Promise.all(fetchPromises);
    return results.filter((item) => item !== null);
  } catch (err) {
    console.warn(`Could not load folder contents from ${indexPath}:`, err);
    return [];
  }
}

// 1. Fetch & Render Projects
async function loadProjects() {
  const container = document.querySelector('.projects-grid');
  if (!container) return;

  let projects = await fetchFolderContents(
    './content/projects/index.json',
    './content/projects',
  );

  if (projects.length === 0) return; // Keeps static HTML fallback intact if index missing

  // Filter out hidden drafts
  projects = projects.filter((item) => item.published !== false);

  // Sort by custom order field, defaulting to priority 99
  projects.sort((a, b) => (a.order || 99) - (b.order || 99));

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
}

// 2. Fetch & Render Blog Posts
async function loadBlogPosts() {
  const container = document.querySelector('.blog-grid');
  if (!container) return;

  let posts = await fetchFolderContents(
    './content/blog/index.json',
    './content/blog',
  );

  if (posts.length === 0) return;

  // Filter out hidden drafts
  posts = posts.filter((item) => item.published !== false);

  // Sort by custom order field
  posts.sort((a, b) => (a.order || 99) - (b.order || 99));

  container.innerHTML = posts
    .map(
      (post) => `
        <article class="blog-card" id="blog-${post._slug}">
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
}
