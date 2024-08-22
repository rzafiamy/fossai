#!/bin/bash

# Base URL of the API
BASE_URL="http://localhost:8080/vapi.php"  # Adjust this if your API is hosted elsewhere
API_KEY="your_authorization_key" # Replace with your actual API key

# Function to send a GET request
function test_get {
    local endpoint=$1
    echo "GET $BASE_URL/$endpoint"
    curl -s -H "Authorization: $API_KEY" "$BASE_URL/$endpoint" | jq .  # Requires jq for pretty-printing JSON responses
    echo
}

# Function to send a POST request
function test_post {
    local endpoint=$1
    local data=$2
    echo "POST $BASE_URL/$endpoint"
    curl -s -X POST -H "Authorization: $API_KEY" -H "Content-Type: application/json" -d "$data" "$BASE_URL/$endpoint" | jq .
    echo
}

# Function to send a PUT request
function test_put {
    local endpoint=$1
    local data=$2
    echo "PUT $BASE_URL/$endpoint"
    curl -s -X PUT -H "Authorization: $API_KEY" -H "Content-Type: application/json" -d "$data" "$BASE_URL/$endpoint" | jq .
    echo
}

# Function to send a DELETE request
function test_delete {
    local endpoint=$1
    echo "DELETE $BASE_URL/$endpoint"
    curl -s -X DELETE -H "Authorization: $API_KEY" "$BASE_URL/$endpoint" | jq .
    echo
}

# Test GET requests
test_get "posts"
test_get "posts/about-us"  # Replace 'some-slug' with an actual slug
test_get "categories"

# Test POST requests
test_post "posts" '{"slug": "new-post", "title": "New Post", "category": "General", "content": "This is the content of the new post."}'
test_post "categories" '{"category": "New Category"}'

# Test PUT requests
test_put "posts/about-us" '{"title": "Updated Title", "content": "Updated content.", "category": "Updated Category"}'  # Replace 'some-slug' with an actual slug
test_put "categories/lifestyle" '{"newCategory": "Updated Category"}'  # Replace 'Old-Category' with an actual category

# Test DELETE requests
test_delete "posts/about-us"  # Replace 'some-slug' with an actual slug
test_delete "categories/newCategory"  # Replace 'Category-To-Delete' with an actual category

# Optional: Check unauthorized access
echo "Testing Unauthorized Access:"
curl -s "$BASE_URL/posts" | jq .

# End of script
echo "Testing complete."