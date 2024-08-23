**Fossai CLI Tool User Manual**

---

**1. Introduction**

The `fossai-cli` is a command-line tool for managing blog content through a RESTful API. This manual provides instructions on how to use the CLI tool for creating, reading, updating, and deleting blog posts and categories.

**2. Installation**

1. Ensure Python 3.x is installed on your system.
2. Install required Python packages:

   ```bash
   pip install requests prettytable
   ```

3. Download the `fossai-cli.py` script to your local machine.
4. Make the script executable:

   ```bash
   chmod +x fossai-cli.py
   ```

**3. Configuration**

- **Base URL**: The base URL of your API. Update the `BASE_URL` in `fossai-cli.py` if your server runs on a different address.
- **API Key**: Replace `your_authorization_key` in `fossai-cli.py` with your actual API key.

**4. Command Usage**

The `fossai-cli.py` tool supports several commands for managing blog posts and categories.

**4.1. Post Management**

- **List All Posts**

  ```bash
  ./fossai-cli.py post list
  ```

  Lists all blog posts with their slug, title, category, and publication status.

- **Get a Specific Post**

  ```bash
  ./fossai-cli.py post get <slug>
  ```

  Retrieves a specific post by its slug.

- **Create a New Post**

  ```bash
  ./fossai-cli.py post create <slug> <title> <category> <content>
  ```

  Creates a new blog post with the specified slug, title, category, and content.

- **Update an Existing Post**

  ```bash
  ./fossai-cli.py post update <slug> [--title <new_title>] [--category <new_category>] [--content <new_content>]
  ```

  Updates an existing post with the specified slug. You can provide new values for title, category, and content.

- **Delete a Post**

  ```bash
  ./fossai-cli.py post delete <slug>
  ```

  Deletes the post with the specified slug.

**4.2. Category Management**

- **List All Categories**

  ```bash
  ./fossai-cli.py category list
  ```

  Lists all blog categories.

- **Create a New Category**

  ```bash
  ./fossai-cli.py category create <category>
  ```

  Creates a new category.

- **Update an Existing Category**

  ```bash
  ./fossai-cli.py category update <old_category> <new_category>
  ```

  Updates an existing category with a new name.

- **Delete a Category**

  ```bash
  ./fossai-cli.py category delete <category>
  ```

  Deletes the specified category.

**5. Examples**

- **List All Posts**

  ```bash
  ./fossai-cli.py post list
  ```

- **Get a Specific Post**

  ```bash
  ./fossai-cli.py post get my-slug
  ```

- **Create a New Post**

  ```bash
  ./fossai-cli.py post create my-slug "My New Post" "Tech" "This is the content of my new post."
  ```

- **Update a Post**

  ```bash
  ./fossai-cli.py post update my-slug --title "Updated Title"
  ```

- **Delete a Post**

  ```bash
  ./fossai-cli.py post delete my-slug
  ```

- **List All Categories**

  ```bash
  ./fossai-cli.py category list
  ```

- **Create a New Category**

  ```bash
  ./fossai-cli.py category create "NewCategory"
  ```

- **Update a Category**

  ```bash
  ./fossai-cli.py category update OldCategory NewCategory
  ```

- **Delete a Category**

  ```bash
  ./fossai-cli.py category delete OldCategory
  ```

**6. Troubleshooting**

- **Permission Issues**: Ensure you have the necessary permissions to execute the script and make HTTP requests.
- **API Errors**: Check the API server status and ensure the base URL and API key are correctly configured.

**7. Contact**

For further assistance, please contact the support team or refer to the API documentation.