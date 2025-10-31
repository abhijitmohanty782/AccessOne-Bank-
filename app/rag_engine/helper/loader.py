# # from langchain_community.document_loaders import Docx2txtLoader, TextLoader
# # from langchain_core.documents import Document
# # from langchain_text_splitters import RecursiveCharacterTextSplitter
# # from typing import List
# # import os
# # from pathlib import Path 

# # from ..core.config import get_settings

# # ENCODINGS_TO_TRY = ["utf-8", "iso-8859-1", "utf-16", "cp1252"]

# # def _load_txt(path: str) -> List[Document]:
# #     last_error = None
# #     for enc in ENCODINGS_TO_TRY:
# #         try:
# #             return TextLoader(path, encoding=enc).load()
# #         except Exception as e:
# #             last_error = e
# #     raise ValueError(f"Encoding error {path}: {last_error}")

# # def load_and_split() -> List[Document]:
# #     cfg = get_settings()
# #     docs: List[Document] = []

# #     print(f"[DEBUG] Loading documents from: {cfg.doc_folder}")
# #     for name in os.listdir(cfg.doc_folder):
# #         print(f"[DEBUG] Found file: {name}")
# #         path = Path(cfg.doc_folder) / name
# #         ext = path.suffix.lower()
# #         try:
# #             if ext == ".txt":
# #                 loaded = _load_txt(str(path))
# #             elif ext == ".docx":
# #                 loaded = Docx2txtLoader(str(path)).load()
# #             else:
# #                 print(f"[WARN] Skipping unsupported file: {name}")
# #                 continue

# #             # ✅ Add source filename as metadata
# #             for doc in loaded:
# #                 doc.metadata["source_file"] = name

# #             print(f"[DEBUG] Loaded {len(loaded)} documents from {name}")
# #             docs.extend(loaded)
# #         except Exception as e:
# #             print(f"[WARN] Failed to load {name}: {e}")

# #     splitter = RecursiveCharacterTextSplitter(
# #         chunk_size=cfg.chunk_size,
# #         chunk_overlap=cfg.chunk_overlap,
# #         length_function=len,
# #     )
# #     all_chunks = splitter.split_documents(docs)
# #     print(f"[DEBUG] Total chunks after splitting: {len(all_chunks)}")

# #     # ✅ Optional: Print metadata for a few chunks
# #     for i, chunk in enumerate(all_chunks[:3]):
# #         print(f"[DEBUG] Chunk {i} — source: {chunk.metadata.get('source_file')}")

# #     return all_chunks


# # In loader.py

# from langchain_community.document_loaders import TextLoader
# from langchain_core.documents import Document
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from typing import List, Dict, Any
# import os
# from pathlib import Path
# import re

# from ..core.config import get_settings

# ENCODINGS_TO_TRY = ["utf-8", "iso-8859-1", "utf-16", "cp1252"]

# # 👇 THIS IS THE FUNCTION THAT WAS MISSING.
# # It needs to be defined before it is called by `load_and_split`.
# def _load_txt(path: str) -> List[Document]:
#     last_error = None
#     for enc in ENCODINGS_TO_TRY:
#         try:
#             return TextLoader(path, encoding=enc).load()
#         except Exception as e:
#             last_error = e
#     # This line is for debugging, you might want to handle it differently
#     print(f"Encoding error for {path}: {last_error}")
#     return [] # Return empty list on failure


# def parse_product_document(content: str) -> Dict[str, Any]:
#     metadata = {}
#     # Regex to find key-value pairs, handling various formats
#     for line in content.split('\n'):
#         if ':' in line:
#             key, val = line.split(':', 1)
#             key = key.strip().lower().replace(' ', '_').replace('-', '_')
#             val = val.strip()
            
#             # Handle special cases for banking products
#             if key in ['interest_rate', 'premium', 'coverage_amount', 'loan_amount']:
#                 # Extract numeric range (e.g., "10.5% - 18.5% per annum")
#                 range_match = re.search(r'(\d+\.?\d*)\s*-\s*(\d+\.?\d*)', val)
#                 if range_match:
#                     metadata[f"{key}_min"] = float(range_match.group(1))
#                     metadata[f"{key}_max"] = float(range_match.group(2))
#                     metadata[key] = val  # Keep original string too
#                 else:
#                     # Single number
#                     numeric_val = re.search(r'(\d+\.?\d*)', val)
#                     if numeric_val:
#                         metadata[key] = float(numeric_val.group(1))
#                     else:
#                         metadata[key] = val
#             elif key in ['tenure', 'policy_term', 'entry_age']:
#                 # Handle ranges for tenure, age, etc.
#                 range_match = re.search(r'(\d+)\s*-\s*(\d+)', val)
#                 if range_match:
#                     metadata[f"{key}_min"] = int(range_match.group(1))
#                     metadata[f"{key}_max"] = int(range_match.group(2))
#                     metadata[key] = val
#                 else:
#                     numeric_val = re.search(r'(\d+)', val)
#                     if numeric_val:
#                         metadata[key] = int(numeric_val.group(1))
#                     else:
#                         metadata[key] = val
#             else:
#                 # Try to convert other numbers to float/int
#                 try:
#                     numeric_val = re.match(r'^[0-9.]+', val)
#                     if numeric_val:
#                         val_str = numeric_val.group(0)
#                         if '.' in val_str:
#                             metadata[key] = float(val_str)
#                         else:
#                             metadata[key] = int(val_str)
#                     else:
#                         metadata[key] = val
#                 except (ValueError, TypeError):
#                     metadata[key] = val
#     return metadata


# def load_and_split() -> List[Document]:
#     cfg = get_settings()
#     docs: List[Document] = []

#     print(f"[DEBUG] Loading documents from: {cfg.doc_folder}")
#     for name in os.listdir(cfg.doc_folder):
#         path = Path(cfg.doc_folder) / name
#         ext = path.suffix.lower()

#         try:
#             if ext == ".txt":
#                 loaded_docs = _load_txt(str(path))
#                 if not loaded_docs:
#                     print(f"[WARN] Skipping {name} due to loading error.")
#                     continue

#                 page_content = loaded_docs[0].page_content
#                 metadata = parse_product_document(page_content)
#                 metadata["source_file"] = name
                
#                 doc = Document(page_content=page_content, metadata=metadata)
#                 docs.append(doc)

#             elif ext == ".docx":
#                 # Add docx handling if needed, similar to above
#                 print(f"[INFO] Skipping docx file for now: {name}")
#                 continue
            
#             else:
#                 print(f"[WARN] Skipping unsupported file: {name}")
#                 continue
#         except Exception as e:
#             print(f"[WARN] Failed to process {name}: {e}")

#     splitter = RecursiveCharacterTextSplitter(
#         chunk_size=cfg.chunk_size,
#         chunk_overlap=cfg.chunk_overlap,
#     )
    
#     all_chunks = splitter.split_documents(docs)
#     print(f"[DEBUG] Total documents loaded: {len(docs)}")
#     print(f"[DEBUG] Total chunks after splitting: {len(all_chunks)}")

#     if all_chunks:
#       for i, chunk in enumerate(all_chunks[:3]):
#           print(f"[DEBUG] Chunk {i} metadata: {chunk.metadata}")
        
#     return all_chunks


# In app/rag_engine/loader.py

import json
import logging
import sys
from typing import List
from pathlib import Path
from langchain_core.documents import Document

def load_links_from_json() -> List[Document]:
    """Loads the links.json file and converts it into a list of Documents."""
    
    # This path assumes links.json is in the project root,
    # one level *above* the 'app' directory.
    json_file_path = Path(__file__).parent.parent.parent.parent / "navigation_links.json"
    
    docs = []
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for key, value in data.items():
            if "description" in value and "url" in value:
                # The `page_content` is what gets searched (embedded)
                doc = Document(
                    page_content=value["description"],
                    metadata={
                        "key_name": key, # "accounts", "apply for a new card", etc.
                        "url": value["url"]
                    }
                )
                docs.append(doc)
            
        print(f"[INFO] Loaded {len(docs)} documents from {json_file_path}")
        if not docs:
            raise ValueError("No valid documents were created from navigation_links.json.")
        return docs
    
    except FileNotFoundError:
        logging.error(f"FATAL: {json_file_path} not found. Please create it in the project root.")
        sys.exit(f"Could not find {json_file_path}. Exiting.")
    except Exception as e:
        logging.error(f"Failed to load or parse {json_file_path}: {e}")
        sys.exit("Could not initialize documents. Exiting.")