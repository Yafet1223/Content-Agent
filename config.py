import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from the current directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# Retrieve Gemini API Key (checking GEMINI_API_KEY or GOOGLE_API_KEY or raw key in .env)
GEMINI_API_KEY = (
    os.getenv("GEMINI_API_KEY")
    or os.getenv("GOOGLE_API_KEY")
)

# Robust fallback: if user pasted raw key without variable name
if not GEMINI_API_KEY and env_path.exists():
    try:
        raw_text = env_path.read_text(encoding="utf-8").strip()
        first_line = raw_text.splitlines()[0].strip() if raw_text else ""
        if first_line and "=" not in first_line:
            GEMINI_API_KEY = first_line
    except Exception:
        pass

# Gemini Model Selection (default to gemini-2.5-flash)
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# Content Types supported by the workflow
SUPPORTED_CONTENT_TYPES = [
    "TikTok Script",
    "Instagram Post",
    "X Post",
    "LinkedIn Post",
    "Blog",
    "Ad Copy",
]
