<?php
// Set headers for JSON response and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Define authorized API keys (replace with your actual keys)
$authorized_keys = ['your_authorization_key']; // Replace with your actual authorization keys

/**
 * Check if the request is authorized.
 *
 * @return bool True if authorized, false otherwise.
 */
function isAuthorized() {
    global $authorized_keys;
    $headers = getallheaders();
    return isset($headers['Authorization']) && in_array($headers['Authorization'], $authorized_keys);
}

/**
 * Get the sitemap data from JSON file.
 *
 * @return array The sitemap data.
 */
function getSitemap() {
    return json_decode(file_get_contents('sitemap.json'), true);
}

/**
 * Get a specific post by its slug.
 *
 * @param string $slug The slug of the post.
 * @return array|null The post data and content, or null if not found.
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
 * Get all published posts.
 *
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
 * Get all categories from the sitemap.
 *
 * @return array List of categories.
 */
function getCategories() {
    $sitemap = getSitemap();
    return $sitemap['categories'];
}

/**
 * Send a JSON response with a specific status code.
 *
 * @param int $statusCode The HTTP status code.
 * @param array $response The response data.
 */
function sendResponse($statusCode, $response) {
    http_response_code($statusCode);
    echo json_encode($response);
}

// Check if the request is authorized
if (!isAuthorized()) {
    sendResponse(403, ['error' => 'Unauthorized']);
    exit;
}

// Get the HTTP method and request path
$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim($_SERVER['PATH_INFO'], '/'));

// Handle different HTTP methods and paths
switch ($method) {
    case 'GET':
        if (isset($path[0])) {
            if ($path[0] === 'posts') {
                if (isset($path[1])) {
                    // Get a specific post by slug
                    $post = getPost($path[1]);
                    if ($post) {
                        sendResponse(200, $post);
                    } else {
                        sendResponse(404, ['error' => 'Post not found']);
                    }
                } else {
                    // Get all published posts
                    sendResponse(200, getPosts());
                }
            } elseif ($path[0] === 'categories') {
                // Get all categories
                sendResponse(200, getCategories());
            } else {
                sendResponse(404, ['error' => 'Endpoint not found']);
            }
        } else {
            sendResponse(404, ['error' => 'Endpoint not found']);
        }
        break;

    case 'POST':
    case 'PUT':
    case 'DELETE':
        sendResponse(405, ['error' => 'Method not allowed']);
        break;

    default:
        sendResponse(405, ['error' => 'Method not allowed']);
        break;
}
?>
