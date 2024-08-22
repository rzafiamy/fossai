document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.getElementById('content');
    const menuLinks = document.querySelectorAll('#menu a');

    const fetchAndRenderPost = (filename) => {
        fetch(`posts/${filename}`)
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                contentDiv.innerHTML = html;
            })
            .catch(error => console.error('Error fetching the markdown file:', error));
    };

    const loadPostsByCategory = (category) => {
        // For simplicity, assume all posts are listed in an array.
        const allPosts = [
            { filename: 'example.md', category: 'technology' },
        ];
        
        const filteredPosts = category === 'all'
            ? allPosts
            : allPosts.filter(post => post.category === category);

        if (filteredPosts.length > 0) {
            fetchAndRenderPost(filteredPosts[0].filename);
        } else {
            contentDiv.innerHTML = '<p>No posts available in this category.</p>';
        }
    };

    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const category = link.getAttribute('data-category');
            loadPostsByCategory(category);
        });
    });

    // Load a default post
    loadPostsByCategory('all');
});
