import requests
from config import BASE_URL, API_KEY

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
    return send_request('GET', 'posts')

def get_post(slug):
    return send_request('GET', f'posts/{slug}')

def create_post(slug, title, category, content):
    data = {'slug': slug, 'title': title, 'category': category, 'content': content}
    return send_request('POST', 'posts', data)

def update_post(slug, title=None, category=None, content=None):
    data = {key: value for key, value in [('title', title), ('category', category), ('content', content)] if value is not None}
    return send_request('PUT', f'posts/{slug}', data)

def delete_post(slug):
    return send_request('DELETE', f'posts/{slug}')

def list_categories():
    return send_request('GET', 'categories')

def create_category(category):
    return send_request('POST', 'categories', {'category': category})

def update_category(old_category, new_category):
    return send_request('PUT', f'categories/{old_category}', {'newCategory': new_category})

def delete_category(category):
    return send_request('DELETE', f'categories/{category}')