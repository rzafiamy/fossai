document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.getElementById('content');
    const menuContainer = document.querySelector('.navbar-nav');
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Search blog...');
    searchInput.classList.add('form-control', 'mb-4');
    const container = document.querySelector('.container');
    container.insertBefore(searchInput, contentDiv);

    const postsPerPage = 10;  // Set the number of posts to display per page
    let currentPage = 1;     // Track the current page
    
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
        const totalPages = Math.ceil(posts.length / postsPerPage);
    
        // Clear the content div
        contentDiv.innerHTML = `<h2>Posts (${posts.length})</h2><ul class="list-group"></ul>`;
        const listGroup = contentDiv.querySelector('.list-group');
    
        // Calculate the start and end indices for the posts to display on the current page
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
    
        const postsToDisplay = posts.slice(start, end);
    
        // Render each post
        postsToDisplay.forEach(post => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = `<a class="post-item-title" href="#${post.slug}">${post.title}</a>`;
    
            // Display a truncated version of the post content
            fetch(`posts/${post.filename}`)
                .then(response => response.text())
                .then(markdown => {
                    const html = marked.parse(markdown).replace(/<(.?)h.>/g, '<$1span class="sum">');
    
                    // Find 100 characters from an opening paragraph tag and truncate the content
                    const index = html.indexOf('<p>');
                    const truncatedContent = html.substring(index + 3, index + 300);
                    listItem.innerHTML += `<p>${truncatedContent}...</p>`;
                })
                .catch(error => console.error('Error fetching the markdown file:', error));
    
            listGroup.appendChild(listItem);
        });
    
        // Render pagination controls
        renderPaginationControls(totalPages);
    };
    
    const renderPaginationControls = (totalPages) => {
        // Clear existing pagination if any
        let paginationDiv = contentDiv.querySelector('.pagination');
        if (paginationDiv) {
            paginationDiv.remove();
        }
    
        // Create new pagination controls
        paginationDiv = document.createElement('div');
        paginationDiv.classList.add('pagination');
    
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.classList.add('btn', 'btn-primary', 'mr-2');
        prevButton.innerHTML = '<i class="f7-icons">chevron_left</i>';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPostList(allPosts);  // Assuming `allPosts` is available globally or passed to this function
            }
        });
    
        // Next button
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<i class="f7-icons">chevron_right</i>';
        nextButton.classList.add('btn', 'btn-primary');
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPostList(allPosts);  // Assuming `allPosts` is available globally or passed to this function
            }
        });
    
        // Page info display
        const pageInfo = document.createElement('span');
        pageInfo.classList.add('text-muted', 'mx-2');
        pageInfo.innerText = `${currentPage}`;
    
        paginationDiv.appendChild(prevButton);
        paginationDiv.appendChild(pageInfo);
        paginationDiv.appendChild(nextButton);
        
        contentDiv.appendChild(paginationDiv);
    };
    
    /**
     * Filters and displays posts based on the search query.
     * @param {string} query - The search query.
     */
    const searchPosts = async (query) => {
        const lowerCaseQuery = query.toLowerCase().trim();
    
        const filteredPosts = [];
    
        for (const post of allPosts) {
            const postTitle = post.title.toLowerCase();
    
            try {
                const response = await fetch(`posts/${post.filename}`);
                let markdown = await response.text();
                
                // Normalize markdown for better search accuracy
                markdown = markdown.replace(/\s+/g, ' ').toLowerCase().trim();
                
                // Break markdown into chunks if it's large (optional, depending on content size)
                const chunks = markdown.match(/.{1,1000}/g) || [];
    
                // Perform the search
                const matchesQuery = postTitle.includes(lowerCaseQuery) ||
                                     chunks.some(chunk => chunk.includes(lowerCaseQuery));
    
                if (matchesQuery) {
                    filteredPosts.push(post);
                }
            } catch (error) {
                console.error('Error fetching the markdown file:', error);
            }
        }
    
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
                relatedPostsDiv.classList.add('related-posts');
                relatedPostsDiv.innerHTML = '<h3>'+
                    '<i class="f7-icons">arrow_right</i> '+ 
                    'Related Posts</h3><ul class="list-group"></ul>';
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
        }else{
            // got to #all url
            window.location.hash = 'all';
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

        const slug = window.location.hash.substring(1); // Remove the '#' character
        if(categories.includes(slug)){
            loadPostsByCategory(slug);
        }else{
            fetchAndRenderPost(slug);
        }
    });
    
});
