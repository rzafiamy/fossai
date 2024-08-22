<?php

// Set headers for JSON response and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Fetch authorized API keys from environment variables
$authorized_keys = ['your_authorization_key'];

/**
 * Checks if the request is authorized based on the API key.
 * @return bool True if authorized, false otherwise.
 */
function isAuthorized() {
    global $authorized_keys;
    $headers = getallheaders();
    return isset($headers['Authorization']) && in_array($headers['Authorization'], $authorized_keys);
}

/**
 * Retrieves the sitemap from the JSON file.
 * @return array Sitemap data as an associative array.
 */
function getSitemap() {
    return json_decode(file_get_contents('sitemap.json'), true);
}

/**
 * Saves the sitemap to the JSON file.
 * @param array $sitemap The sitemap data to save.
 */
function saveSitemap($sitemap) {
    file_put_contents('sitemap.json', json_encode($sitemap, JSON_PRETTY_PRINT));
}

/**
 * Retrieves a specific post by its slug.
 * @param string $slug The slug of the post.
 * @return array|null Post data including content if found, otherwise null.
 */
function getPost($slug) {
    $sitemap = getSitemap();
    foreach ($sitemap['posts'] as $post) {
        if ($post['slug'] === $slug) {
            $filename = 'posts/' . $post['filename'];
            if (file_exists($filename)) {
                return ['post' => $post, 'content' => file_get_contents($filename)];
            }
        }
    }
    return null;
}

/**
 * Retrieves all published posts.
 * @return array List of published posts with their content.
 */
function getPosts() {
    $sitemap = getSitemap();
    $posts = [];
    foreach ($sitemap['posts'] as $post) {
        if ($post['published']) {
            $filename = 'posts/' . $post['filename'];
            $post['content'] = file_exists($filename) ? file_get_contents($filename) : '';
            $posts[] = $post;
        }
    }
    return $posts;
}

/**
 * Retrieves all categories from the sitemap.
 * @return array List of categories.
 */
function getCategories() {
    $sitemap = getSitemap();
    return $sitemap['categories'];
}

/**
 * Adds a new category to the sitemap if it doesn't already exist.
 * @param string $category The category to add.
 * @return bool True if the category was added, false if it already exists.
 */
function addCategory($category) {
    $sitemap = getSitemap();
    if (!in_array($category, $sitemap['categories'])) {
        $sitemap['categories'][] = $category;
        saveSitemap($sitemap);
        return true;
    }
    return false;
}

/**
 * Updates an existing category in the sitemap.
 * @param string $oldCategory The current category name.
 * @param string $newCategory The new category name.
 * @return bool True if the category was updated, false if it was not found.
 */
function updateCategory($oldCategory, $newCategory) {
    $sitemap = getSitemap();
    $index = array_search($oldCategory, $sitemap['categories']);
    if ($index !== false) {
        $sitemap['categories'][$index] = $newCategory;
        saveSitemap($sitemap);
        return true;
    }
    return false;
}

/**
 * Deletes a post by its slug.
 * @param string $slug The slug of the post to delete.
 * @return bool True if the post was deleted, false if not found.
 */
function deletePost($slug) {
    $sitemap = getSitemap();
    $postFound = false;
    foreach ($sitemap['posts'] as $index => $post) {
        if ($post['slug'] === $slug) {
            $filename = 'posts/' . $post['filename'];
            if (file_exists($filename)) {
                unlink($filename);
            }
            array_splice($sitemap['posts'], $index, 1);
            $postFound = true;
            break;
        }
    }
    if ($postFound) {
        saveSitemap($sitemap);
        return true;
    }
    return false;
}

/**
 * Deletes a category by its name.
 * @param string $category The name of the category to delete.
 * @return bool True if the category was deleted, false if not found.
 */
function deleteCategory($category) {
    $sitemap = getSitemap();
    $index = array_search($category, $sitemap['categories']);
    if ($index !== false) {
        array_splice($sitemap['categories'], $index, 1);
        saveSitemap($sitemap);
        return true;
    }
    return false;
}

/**
 * Sends a JSON response with the specified status code.
 * @param int $statusCode The HTTP status code.
 * @param array $response The response data to send.
 */
function sendResponse($statusCode, $response) {
    http_response_code($statusCode);
    echo json_encode($response);
}

// Main script execution

// Check authorization before processing any request
if (!isAuthorized()) {
    sendResponse(403, ['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim($_SERVER['PATH_INFO'], '/'));

// Handle different HTTP methods and paths
switch ($method) {
    case 'GET':
        // Handle GET requests
        if (isset($path[0])) {
            if ($path[0] === 'posts') {
                if (isset($path[1])) {
                    // Retrieve a specific post by slug
                    $post = getPost($path[1]);
                    if ($post) {
                        sendResponse(200, $post);
                    } else {
                        sendResponse(404, ['error' => 'Post not found']);
                    }
                } else {
                    // Retrieve all posts
                    sendResponse(200, getPosts());
                }
            } elseif ($path[0] === 'categories') {
                // Retrieve all categories
                sendResponse(200, getCategories());
            } else {
                sendResponse(404, ['error' => 'Endpoint not found']);
            }
        } else {
            sendResponse(404, ['error' => 'Endpoint not found']);
        }
        break;

    case 'POST':
        // Handle POST requests
        if (isset($path[0])) {
            if ($path[0] === 'posts') {
                $input = json_decode(file_get_contents('php://input'), true);
                if (isset($input['slug'], $input['content'], $input['title'], $input['category'])) {
                    // Create a new post
                    $filename = 'posts/' . $input['slug'] . '.md';
                    $post = [
                        'filename' => basename($filename),
                        'category' => $input['category'],
                        'title' => $input['title'],
                        'published' => true,
                        'slug' => $input['slug']
                    ];
                    file_put_contents($filename, $input['content']);
                    $sitemap = getSitemap();
                    $sitemap['posts'][] = $post;
                    saveSitemap($sitemap);
                    sendResponse(201, ['message' => 'Post created successfully']);
                } else {
                    sendResponse(400, ['error' => 'Invalid input']);
                }
            } elseif ($path[0] === 'categories') {
                $input = json_decode(file_get_contents('php://input'), true);
                if (isset($input['category'])) {
                    // Add a new category
                    if (addCategory($input['category'])) {
                        sendResponse(201, ['message' => 'Category added successfully']);
                    } else {
                        sendResponse(400, ['error' => 'Category already exists']);
                    }
                } else {
                    sendResponse(400, ['error' => 'Invalid input']);
                }
            } else {
                sendResponse(404, ['error' => 'Endpoint not found']);
            }
        } else {
            sendResponse(404, ['error' => 'Endpoint not found']);
        }
        break;

    case 'PUT':
        // Handle PUT requests
        if (isset($path[0])) {
            if ($path[0] === 'posts' && isset($path[1])) {
                $slug = $path[1];
                $input = json_decode(file_get_contents('php://input'), true);
                $sitemap = getSitemap();
                $postFound = false;
                foreach ($sitemap['posts'] as &$post) {
                    if ($post['slug'] === $slug) {
                        $filename = 'posts/' . $post['filename'];
                        if (isset($input['content'])) {
                            file_put_contents($filename, $input['content']);
                        }
                        if (isset($input['title'])) {
                            $post['title'] = $input['title'];
                        }
                        if (isset($input['category'])) {
                            $post['category'] = $input['category'];
                        }
                        $postFound = true;
                        break;
                    }
                }
                if ($postFound) {
                    saveSitemap($sitemap);
                    sendResponse(200, ['message' => 'Post updated successfully']);
                } else {
                    sendResponse(404, ['error' => 'Post not found']);
                }
            } elseif ($path[0] === 'categories' && isset($path[1])) {
                $oldCategory = $path[1];
                $input = json_decode(file_get_contents('php://input'), true);
                if (isset($input['newCategory'])) {
                    // Update an existing category
                    if (updateCategory($oldCategory, $input['newCategory'])) {
                        sendResponse(200, ['message' => 'Category updated successfully']);
                    } else {
                        sendResponse(404, ['error' => 'Category not found']);
                    }
                } else {
                    sendResponse(400, ['error' => 'Invalid input']);
                }
            } else {
                sendResponse(404, ['error' => 'Endpoint not found']);
            }
        } else {
            sendResponse(404, ['error' => 'Endpoint not found']);
        }
        break;

    case 'DELETE':
        // Handle DELETE requests
        if (isset($path[0])) {
            if ($path[0] === 'posts' && isset($path[1])) {
                $slug = $path[1];
                // Delete a post
                if (deletePost($slug)) {
                    sendResponse(200, ['message' => 'Post deleted successfully']);
                } else {
                    sendResponse(404, ['error' => 'Post not found']);
                }
            } elseif ($path[0] === 'categories' && isset($path[1])) {
                $category = $path[1];
                // Delete a category
                if (deleteCategory($category)) {
                    sendResponse(200, ['message' => 'Category deleted successfully']);
                } else {
                    sendResponse(404, ['error' => 'Category not found']);
                }
            } else {
                sendResponse(404, ['error' => 'Endpoint not found']);
            }
        } else {
            sendResponse(404, ['error' => 'Endpoint not found']);
        }
        break;

    default:
        // Method not allowed
        sendResponse(405, ['error' => 'Method not allowed']);
        break;
}
?>
