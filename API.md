# Fossai Blog API Documentation



## Overview

The Fossai Blog API allows you to manage blog posts and categories. All requests require an `Authorization` header with a valid API key.

## Base URL

```
http://yourserver.com/vapi.php
```

## Authorization

All requests must include the `Authorization` header with a valid API key.

**Example:**

```
Authorization: your_authorization_key
```

## Endpoints

### 1. **Get All Published Posts**

- **Endpoint:** `/posts`
- **Method:** `GET`
- **Description:** Retrieves a list of all published blog posts.
- **Headers:**
  - `Authorization: your_authorization_key`
- **Responses:**

  - **200 OK**
    ```json
    [
      {
        "filename": "about.md",
        "category": "technology",
        "title": "About us",
        "published": true,
        "slug": "about-us",
        "content": "<Markdown content here>"
      },
      {
        "filename": "generative.md",
        "category": "technology",
        "title": "Generative AI",
        "published": true,
        "slug": "generative-ai",
        "content": "<Markdown content here>"
      }
    ]
    ```

  - **403 Forbidden**
    ```json
    {
      "error": "Unauthorized"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Endpoint not found"
    }
    ```

### 2. **Get a Specific Post by Slug**

- **Endpoint:** `/posts/{slug}`
- **Method:** `GET`
- **Description:** Retrieves a specific blog post by its slug.
- **Parameters:**
  - `slug` (path parameter): The slug of the post.
- **Headers:**
  - `Authorization: your_authorization_key`
- **Responses:**

  - **200 OK**
    ```json
    {
      "post": {
        "filename": "generative.md",
        "category": "technology",
        "title": "Generative AI",
        "published": true,
        "slug": "generative-ai"
      },
      "content": "<Markdown content here>"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Post not found"
    }
    ```

  - **403 Forbidden**
    ```json
    {
      "error": "Unauthorized"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Endpoint not found"
    }
    ```

### 3. **Get All Categories**

- **Endpoint:** `/categories`
- **Method:** `GET`
- **Description:** Retrieves a list of all categories.
- **Headers:**
  - `Authorization: your_authorization_key`
- **Responses:**

  - **200 OK**
    ```json
    [
      "all",
      "technology",
      "lifestyle"
    ]
    ```

  - **403 Forbidden**
    ```json
    {
      "error": "Unauthorized"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Endpoint not found"
    }
    ```

### 4. **Create a New Post**

- **Endpoint:** `/posts`
- **Method:** `POST`
- **Description:** Creates a new blog post.
- **Request Body:**
  ```json
  {
    "slug": "unique-slug",
    "title": "Post Title",
    "category": "category-name",
    "content": "Markdown content here"
  }
  ```
- **Headers:**
  - `Authorization: your_authorization_key`
- **Responses:**

  - **201 Created**
    ```json
    {
      "message": "Post created successfully"
    }
    ```

  - **400 Bad Request**
    ```json
    {
      "error": "Invalid input"
    }
    ```

  - **403 Forbidden**
    ```json
    {
      "error": "Unauthorized"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Endpoint not found"
    }
    ```

### 5. **Update an Existing Post**

- **Endpoint:** `/posts/{slug}`
- **Method:** `PUT`
- **Description:** Updates an existing blog post.
- **Parameters:**
  - `slug` (path parameter): The slug of the post to update.
- **Request Body:**
  ```json
  {
    "title": "Updated Post Title",
    "category": "new-category",
    "content": "Updated markdown content"
  }
  ```
- **Headers:**
  - `Authorization: your_authorization_key`
- **Responses:**

  - **200 OK**
    ```json
    {
      "message": "Post updated successfully"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Post not found"
    }
    ```

  - **403 Forbidden**
    ```json
    {
      "error": "Unauthorized"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Endpoint not found"
    }
    ```

### 6. **Delete a Post**

- **Endpoint:** `/posts/{slug}`
- **Method:** `DELETE`
- **Description:** Deletes a blog post.
- **Parameters:**
  - `slug` (path parameter): The slug of the post to delete.
- **Headers:**
  - `Authorization: your_authorization_key`
- **Responses:**

  - **200 OK**
    ```json
    {
      "message": "Post deleted successfully"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Post not found"
    }
    ```

  - **403 Forbidden**
    ```json
    {
      "error": "Unauthorized"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Endpoint not found"
    }
    ```

### 7. **Add a New Category**

- **Endpoint:** `/categories`
- **Method:** `POST`
- **Description:** Adds a new category.
- **Request Body:**
  ```json
  {
    "category": "new-category"
  }
  ```
- **Headers:**
  - `Authorization: your_authorization_key`
- **Responses:**

  - **201 Created**
    ```json
    {
      "message": "Category added successfully"
    }
    ```

  - **400 Bad Request**
    ```json
    {
      "error": "Category already exists"
    }
    ```

  - **403 Forbidden**
    ```json
    {
      "error": "Unauthorized"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Endpoint not found"
    }
    ```

### 8. **Update a Category**

- **Endpoint:** `/categories/{oldCategory}`
- **Method:** `PUT`
- **Description:** Updates an existing category.
- **Parameters:**
  - `oldCategory` (path parameter): The category to update.
- **Request Body:**
  ```json
  {
    "newCategory": "updated-category"
  }
  ```
- **Headers:**
  - `Authorization: your_authorization_key`
- **Responses:**

  - **200 OK**
    ```json
    {
      "message": "Category updated successfully"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Category not found"
    }
    ```

  - **400 Bad Request**
    ```json
    {
      "error": "Invalid input"
    }
    ```

  - **403 Forbidden**
    ```json
    {
      "error": "Unauthorized"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Endpoint not found"
    }
    ```

### 9. **Delete a Category**

- **Endpoint:** `/categories/{category}`
- **Method:** `DELETE`
- **Description:** Deletes a category.
- **Parameters:**
  - `category` (path parameter): The category to delete.
- **Headers:**
  - `Authorization: your_authorization_key`
- **Responses:**

  - **200 OK**
    ```json
    {
      "message": "Category deleted successfully"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Category not found"
    }
    ```

  - **403 Forbidden**
    ```json
    {
      "error": "Unauthorized"
    }
    ```

  - **404 Not Found**
    ```json
    {
      "error": "Endpoint not found"
    }
    ```

### 10. **Method Not Allowed**

- **Description:** Indicates that the HTTP method used is not allowed for the endpoint.
- **Responses:**

  - **405 Method Not Allowed**
    ```json
    {
      "error": "Method not allowed"
    }
    ```

---

### Notes

- **Authorization**: Ensure that the `Authorization` header with a valid API key is included in all requests.
- **Error Handling**: Provides appropriate HTTP status codes and error messages for unauthorized access, invalid inputs, and unsupported methods.