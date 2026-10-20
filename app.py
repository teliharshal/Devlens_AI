"""
WSGI alias for deployment environments (like default Render) that invoke 'gunicorn app:app' from the project root.
"""
import os
import sys

# Ensure backend directory is in Python path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from config.wsgi import application as app
