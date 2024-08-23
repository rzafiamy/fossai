#!/usr/bin/env python3

import argparse
import requests
import json
from prettytable import PrettyTable

# Define API base URL
BASE_URL = "https://makix.fr/vapi.php"  # Adjust if necessary
API_KEY = "your_authorization_key"  # Replace with your actual API key

def send_request(method, endpoint, data=None):
    headers = {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
    }
    url = f"{BASE_URL}/{endpoint}"
    response = requests.request(method, url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.json().get('error', 'Unknown error')}")
        return None

def list_posts():
    posts = send_request('GET', 'posts')
    if posts:
        table = PrettyTable()
        table.field_names = ["Slug", "Title", "Category", "Published"]
        for post in posts:
            table.add_row([post['slug'], post['title'], post['category'], post['published']])
        print(table)

def get_post(slug):
    post = send_request('GET', f'posts/{slug}')
    if post:
        print(json.dumps(post, indent=4))

def create_post(slug, title, category, content):
    data = {
        'slug': slug,
        'title': title,
        'category': category,
        'content': content
    }
    response = send_request('POST', 'posts', data)
    if response:
        print(response.get('message'))

def update_post(slug, title=None, category=None, content=None):
    data = {}
    if title:
        data['title'] = title
    if category:
        data['category'] = category
    if content:
        data['content'] = content
    response = send_request('PUT', f'posts/{slug}', data)
    if response:
        print(response.get('message'))

def delete_post(slug):
    response = send_request('DELETE', f'posts/{slug}')
    if response:
        print(response.get('message'))

def list_categories():
    categories = send_request('GET', 'categories')
    if categories:
        table = PrettyTable()
        table.field_names = ["Category"]
        for category in categories:
            table.add_row([category])
        print(table)

def create_category(category):
    data = {'category': category}
    response = send_request('POST', 'categories', data)
    if response:
        print(response.get('message'))

def update_category(old_category, new_category):
    data = {'newCategory': new_category}
    response = send_request('PUT', f'categories/{old_category}', data)
    if response:
        print(response.get('message'))

def delete_category(category):
    response = send_request('DELETE', f'categories/{category}')
    if response:
        print(response.get('message'))

def main():
    parser = argparse.ArgumentParser(description="Fossai CLI Tool for managing blog content")
    subparsers = parser.add_subparsers(dest="command")

    # Post commands
    post_parser = subparsers.add_parser('post', help="Manage blog posts")
    post_subparsers = post_parser.add_subparsers(dest="action")

    post_list = post_subparsers.add_parser('list', help="List all posts")
    post_get = post_subparsers.add_parser('get', help="Get a specific post")
    post_get.add_argument('slug', help="Slug of the post to get")
    post_create = post_subparsers.add_parser('create', help="Create a new post")
    post_create.add_argument('slug', help="Slug of the post")
    post_create.add_argument('title', help="Title of the post")
    post_create.add_argument('category', help="Category of the post")
    post_create.add_argument('content', help="Content of the post")
    post_update = post_subparsers.add_parser('update', help="Update an existing post")
    post_update.add_argument('slug', help="Slug of the post to update")
    post_update.add_argument('--title', help="New title of the post")
    post_update.add_argument('--category', help="New category of the post")
    post_update.add_argument('--content', help="New content of the post")
    post_delete = post_subparsers.add_parser('delete', help="Delete a post")
    post_delete.add_argument('slug', help="Slug of the post to delete")

    # Category commands
    category_parser = subparsers.add_parser('category', help="Manage blog categories")
    category_subparsers = category_parser.add_subparsers(dest="action")

    category_list = category_subparsers.add_parser('list', help="List all categories")
    category_create = category_subparsers.add_parser('create', help="Create a new category")
    category_create.add_argument('category', help="Name of the category to create")
    category_update = category_subparsers.add_parser('update', help="Update an existing category")
    category_update.add_argument('old_category', help="Old category name")
    category_update.add_argument('new_category', help="New category name")
    category_delete = category_subparsers.add_parser('delete', help="Delete a category")
    category_delete.add_argument('category', help="Category name to delete")

    args = parser.parse_args()

    if args.command == 'post':
        if args.action == 'list':
            list_posts()
        elif args.action == 'get':
            get_post(args.slug)
        elif args.action == 'create':
            create_post(args.slug, args.title, args.category, args.content)
        elif args.action == 'update':
            update_post(args.slug, args.title, args.category, args.content)
        elif args.action == 'delete':
            delete_post(args.slug)
    
    elif args.command == 'category':
        if args.action == 'list':
            list_categories()
        elif args.action == 'create':
            create_category(args.category)
        elif args.action == 'update':
            update_category(args.old_category, args.new_category)
        elif args.action == 'delete':
            delete_category(args.category)

if __name__ == "__main__":
    main()
