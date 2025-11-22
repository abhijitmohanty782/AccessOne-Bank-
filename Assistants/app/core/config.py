# from pydantic_settings import BaseSettings
# from pydantic import Field
# from dotenv import load_dotenv

# load_dotenv(override=True)

# class Settings(BaseSettings):
#     google_api_key: str = Field(..., alias="GOOGLE_API_KEY")
#     langchain_api_key: str = Field(..., alias="LANGCHAIN_API_KEY")
#     doc_folder: str = Field("Banking_Products", alias="DOC_FOLDER")
#     chroma_dir: str = Field("chroma_db", alias="CHROMA_DIR")
#     env: str = Field("development", alias="ENV")

#     chunk_size: int = Field(500, alias="CHUNK_SIZE")
#     chunk_overlap: int = Field(50, alias="CHUNK_OVERLAP")
#     k: int = Field(5, alias="K")
    
#     class Config:
#         extra = "ignore"  # Ignore unexpected fields, just in case

# # Singleton pattern to avoid reloading
# def get_settings() -> Settings:
#     return Settings()

from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv
import json 
from pathlib import Path

load_dotenv(override=True)

class Settings(BaseSettings):
    google_api_key: str = Field(..., alias="GOOGLE_API_KEY")
    langchain_api_key: str = Field(..., alias="LANGCHAIN_API_KEY")
    doc_folder: str = Field("Banking_Products", alias="DOC_FOLDER")
    chroma_dir: str = Field("chroma_db", alias="CHROMA_DIR")
    env: str = Field("development", alias="ENV")

    chunk_size: int = Field(500, alias="CHUNK_SIZE")
    chunk_overlap: int = Field(50, alias="CHUNK_OVERLAP")
    k: int = Field(5, alias="K")
    
    class Config:
        extra = "ignore"  # Ignore unexpected fields, just in case

# Singleton pattern to avoid reloading
def get_settings() -> Settings:
    return Settings()

# --- Logic from Helper ---

def load_navigation_links():
    """Loads navigation links and topics from the JSON file."""
    
    # [FIXED PATH]
    # This path goes up 3 levels to find the project root:
    # app/core/config.py -> app/core -> app -> Unified_Bank_Backend (root)
    links_path = Path(__file__).parent.parent.parent / "navigation_links.json"
    
    if not links_path.exists():
        print(f"[WARN] navigation_links.json not found at {links_path}. Navigation will be disabled.")
        return {}, []
    
    try:
        with open(links_path, 'r') as f:
            data = json.load(f)
        
        # 1. Create the simple URL map for routes.py
        # e.g., {"personal loan": "http://..."}
        url_map = {topic: details["url"] for topic, details in data.items()}
        
        # 2. Create a list of all topics (keywords) for the intent_classifier.py
        # e.g., ["personal loan", "home loan", "apply for card"]
        topics = list(data.keys())
        
        print(f"[INFO] Loaded {len(topics)} navigation topics from JSON.")
        return url_map, topics
        
    except Exception as e:
        print(f"[ERROR] Failed to load navigation_links.json: {e}")
        return {}, []

# Load the links ONCE when the application starts
NAVIGATION_LINKS, NAVIGATION_TOPICS = load_navigation_links()