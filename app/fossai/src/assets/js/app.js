document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.getElementById('content');
    const menuContainer = document.querySelector('.navbar-nav');
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Search blog...');
    searchInput.classList.add('form-control', 'mb-4');
    const container = document.querySelector('.container');
    container.insertBefore(searchInput, contentDiv);

    let allPosts = []; // This will be populated with data from sitemap.json
    let categories = []; // This will be populated with categories from sitemap.json

    /**
     * Fetches a Markdown file and renders its content as HTML in the content div.
     * @param {string} slug - The slug of the Markdown file to fetch.
     */
    const fetchAndRenderPost = (slug) => {
        const post = allPosts.find(post => post.slug === slug);
        if (post && post.published) {
            fetch(`posts/${post.filename}`)
                .then(response => response.text())
                .then(markdown => {
                    const html = marked.parse(markdown);
                    contentDiv.innerHTML = html;
                    displayRelatedPosts(post.slug); // Display related posts after rendering the current post
                })
                .catch(error => console.error('Error fetching the markdown file:', error));
        } else {
            contentDiv.innerHTML = '<p>This post is not published or does not exist.</p>';
        }
    };

    /**
     * Loads and displays posts by category.
     * @param {string} category - The category to filter posts by.
     */
    const loadPostsByCategory = (category) => {
        const filteredPosts = category === 'all'
            ? allPosts.filter(post => post.published)
            : allPosts.filter(post => post.category === category && post.published);

        if (filteredPosts.length > 0) {
            renderPostList(filteredPosts);
        } else {
            contentDiv.innerHTML = '<p>No posts available in this category.</p>';
        }
    };

    /**
     * Renders a list of posts in the content div.
     * @param {Array} posts - Array of post objects to render.
     */
    const renderPostList = (posts) => {
        contentDiv.innerHTML = '<h2>Posts</h2><ul class="list-group"></ul>';
        const listGroup = contentDiv.querySelector('.list-group');
        posts.forEach(post => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = `<a href="#${post.slug}">${post.title}</a>`;
            listGroup.appendChild(listItem);
        });
    };

    /**
     * Filters and displays posts based on the search query.
     * @param {string} query - The search query.
     */
    const searchPosts = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        const filteredPosts = allPosts.filter(post => post.title.toLowerCase().includes(lowerCaseQuery));
        renderPostList(filteredPosts);
    };

    /**
     * Displays related posts based on the current post's category.
     * @param {string} slug - The slug of the current post.
     */
    const displayRelatedPosts = (slug) => {
        const post = allPosts.find(post => post.slug === slug);
        if (post) {
            const relatedPosts = allPosts.filter(p => p.category === post.category && p.slug !== slug);
            if (relatedPosts.length > 0) {
                const relatedPostsDiv = document.createElement('div');
                relatedPostsDiv.innerHTML = '<h3>Related Posts</h3><ul class="list-group"></ul>';
                const listGroup = relatedPostsDiv.querySelector('.list-group');
                relatedPosts.forEach(post => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.innerHTML = `<a href="#${post.slug}">${post.title}</a>`;
                    listGroup.appendChild(listItem);
                });
                contentDiv.appendChild(relatedPostsDiv);
            }
        }
    };

    /**
     * Fetches the sitemap JSON file, initializes the blog posts and categories, and updates the navigation menu.
     */
    const initializePosts = () => {
        fetch('sitemap.json')
            .then(response => response.json())
            .then(data => {
                allPosts = data.posts;
                categories = data.categories;
                updateNavigationMenu(); // Update navigation menu based on categories

                loadInitialHash();
            })
            .catch(error => console.error('Error fetching the sitemap file:', error));
    };

    /**
     * Updates the navigation menu based on categories from sitemap.json.
     */
    const updateNavigationMenu = () => {
        menuContainer.innerHTML = ''; // Clear existing menu items
        categories.forEach(category => {
            const listItem = document.createElement('li');
            listItem.classList.add('nav-item');
            listItem.innerHTML = `<a class="nav-link" href="#${category}">${capitalizeFirstLetter(category)}</a>`;
            menuContainer.appendChild(listItem);
        });
    };

    /**
     * Capitalizes the first letter of a string.
     * @param {string} str - The string to capitalize.
     * @returns {string} - The capitalized string.
     */
    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    
    /**
     * Load initial hash
     * @returns {string} - The hash of the URL.
     */
    const loadInitialHash = () => {
        let initialSlug =  window.location.hash.substring(1); // Remove the '#' character
        if(initialSlug){
            if(categories.includes(initialSlug)){
                loadPostsByCategory(initialSlug);
            }else{
                fetchAndRenderPost(initialSlug);
            }
        }
    }

    // Add event listener to the search input
    searchInput.addEventListener('input', () => {
        searchPosts(searchInput.value);
    });

    // Initialize posts and navigation menu by fetching the sitemap JSON
    initializePosts();

    // Handle changes in the URL hash
    window.addEventListener('hashchange', () => {
        console.log("Hash Listener");
        const slug = window.location.hash.substring(1); // Remove the '#' character
        if(categories.includes(slug)){
            loadPostsByCategory(slug);
        }else{
            fetchAndRenderPost(slug);
        }
    });
    
});
