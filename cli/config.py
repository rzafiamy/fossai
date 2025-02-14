# config.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_URL = os.getenv("BASE_URL", "http://localhost/vapi.php")
API_KEY = os.getenv("API_KEY", "")