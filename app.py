from flask import Flask, render_template
import requests
import time

app = Flask(__name__)

# Simple in-memory cache for GitHub API responses
_GITHUB_CACHE = {
    'repos': None,
    'fetched_at': 0
}

GITHUB_USERNAME = 'Sujata37'  # change to your GitHub username if different
GITHUB_API = f'https://api.github.com/users/{GITHUB_USERNAME}/repos'

def fetch_github_repos(force=False):
    """Fetch public repos for the user with a short in-memory cache."""
    now = time.time()
    # cache for 60 seconds to reduce rate usage
    if not force and _GITHUB_CACHE['repos'] and now - _GITHUB_CACHE['fetched_at'] < 60:
        return _GITHUB_CACHE['repos']

    resp = requests.get(GITHUB_API, params={'sort': 'pushed', 'per_page': 50}, timeout=5)
    resp.raise_for_status()
    data = resp.json()

    # map useful fields
    repos = []
    for r in data:
        repos.append({
            'name': r.get('name'),
            'description': r.get('description') or '',
            'html_url': r.get('html_url'),
            'homepage': r.get('homepage') or '',
            'language': r.get('language'),
            'updated_at': r.get('pushed_at')
        })

    _GITHUB_CACHE['repos'] = repos
    _GITHUB_CACHE['fetched_at'] = now
    return repos


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/projects')
def projects():
    try:
        repos = fetch_github_repos()
    except Exception:
        repos = []
    return render_template('projects.html', repos=repos)


if __name__ == '__main__':
    app.run(debug=True)
