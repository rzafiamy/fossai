import argparse
from prettytable import PrettyTable
from api import list_posts, get_post, create_post, update_post, delete_post, list_categories, create_category, update_category, delete_category

def print_table(data, fields):
    table = PrettyTable()
    table.field_names = fields
    for row in data:
        table.add_row(row)
    print(table)

def main():
    parser = argparse.ArgumentParser(description="Fossai CLI Tool for managing blog content")
    subparsers = parser.add_subparsers(dest="command")

    # Post commands
    post_parser = subparsers.add_parser('post', help="Manage blog posts")
    post_subparsers = post_parser.add_subparsers(dest="action")
    post_subparsers.add_parser('list', help="List all posts")
    post_get = post_subparsers.add_parser('get', help="Get a specific post")
    post_get.add_argument('slug', help="Slug of the post to get")
    post_create = post_subparsers.add_parser('create', help="Create a new post")
    post_create.add_argument('slug')
    post_create.add_argument('title')
    post_create.add_argument('category')
    post_create.add_argument('content')
    post_update = post_subparsers.add_parser('update', help="Update an existing post")
    post_update.add_argument('slug')
    post_update.add_argument('--title')
    post_update.add_argument('--category')
    post_update.add_argument('--content')
    post_delete = post_subparsers.add_parser('delete', help="Delete a post")
    post_delete.add_argument('slug')

    # Category commands
    category_parser = subparsers.add_parser('category', help="Manage blog categories")
    category_subparsers = category_parser.add_subparsers(dest="action")
    category_subparsers.add_parser('list', help="List all categories")
    category_create = category_subparsers.add_parser('create', help="Create a new category")
    category_create.add_argument('category')
    category_update = category_subparsers.add_parser('update', help="Update an existing category")
    category_update.add_argument('old_category')
    category_update.add_argument('new_category')
    category_delete = category_subparsers.add_parser('delete', help="Delete a category")
    category_delete.add_argument('category')

    args = parser.parse_args()

    if args.command == 'post':
        if args.action == 'list':
            data = list_posts()
            print_table([(p['slug'], p['title'], p['category']) for p in data], ["Slug", "Title", "Category"])
        elif args.action == 'get':
            print(get_post(args.slug))
        elif args.action == 'create':
            print(create_post(args.slug, args.title, args.category, args.content))
        elif args.action == 'update':
            print(update_post(args.slug, args.title, args.category, args.content))
        elif args.action == 'delete':
            print(delete_post(args.slug))
    elif args.command == 'category':
        if args.action == 'list':
            data = list_categories()
            print_table([(c,) for c in data], ["Category"])
        elif args.action == 'create':
            print(create_category(args.category))
        elif args.action == 'update':
            print(update_category(args.old_category, args.new_category))
        elif args.action == 'delete':
            print(delete_category(args.category))

if __name__ == "__main__":
    main()
