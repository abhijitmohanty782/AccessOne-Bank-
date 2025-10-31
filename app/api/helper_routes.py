# # from fastapi import APIRouter, Depends, HTTPException
# # from ..core.models import ChatRequest, ChatResponse
# # from ..rag_engine.chain import ask

# # router = APIRouter()

# # @router.post("/chat", response_model=ChatResponse)
# # async def chat(req: ChatRequest) -> ChatResponse:
# #     try:
# #         answer = ask(req.query, req.history)
# #         return ChatResponse(answer=answer)
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))



# from fastapi import APIRouter, Depends, HTTPException
# from fastapi.concurrency import run_in_threadpool # 👈 ADD THIS IMPORT
# from ..core.models import ChatRequest, ChatResponse
# from ..rag_engine.chain import ask
# # from ..core.config import get_settings
# # from typing import Optional
# import traceback


# router = APIRouter()

# @router.post("/chat", response_model=ChatResponse)
# async def chat(req: ChatRequest) -> ChatResponse:
#     try:
#         # 👇 WRAP THE 'ask' FUNCTION CALL IN 'run_in_threadpool'
#         answer = await run_in_threadpool(ask, req.query, req.history)
        
#         # Extract suggested products from the answer (simple keyword matching)
#         suggested_products = []
#         banking_products = [
#             "Personal Loan", "Home Loan", "Car Loan", "Business Loan",
#             "Life Insurance", "Health Insurance", "Motor Insurance", "Travel Insurance"
#         ]
        
#         for product in banking_products:
#             if product.lower() in answer.lower():
#                 suggested_products.append(product)
        
#         # Determine query type based on keywords
#         query_type = "general"
#         if any(keyword in answer.lower() for keyword in ["loan", "borrow", "credit", "interest rate"]):
#             query_type = "loan"
#         elif any(keyword in answer.lower() for keyword in ["insurance", "premium", "coverage", "policy"]):
#             query_type = "insurance"
        
#         return ChatResponse(
#             answer=answer,
#             suggested_products=suggested_products,
#             query_type=query_type
#         )
#     except Exception as e:
#         # Consider adding logging here for better debugging in the future
#         # import logging
#         # logging.exception("An error occurred in the chat endpoint.")
        
#         # 👇 ADD THESE 3 LINES TO FORCE-PRINT THE ERROR
#         print("\n" + "="*50)
#         print("--- UNHANDLED EXCEPTION IN /chat ENDPOINT ---")
#         traceback.print_exc() # This prints the full error traceback
#         # print("="*5T + "\n")
        
#         raise HTTPException(status_code=500, detail=str(e))


# from fastapi import APIRouter, HTTPException
# from fastapi.concurrency import run_in_threadpool
# # 👇 --- CHANGE HERE ---
# # Import the new models we defined
# from ..core.models import LinkRequest, LinkResponse
# from ..rag_engine.chain import ask
# import traceback


# router = APIRouter()

# # 👇 --- CHANGE HERE ---
# # The endpoint now promises to return our new `LinkResponse` model
# @router.post("/chat", response_model=LinkResponse)
# # 👇 --- CHANGE HERE ---
# # The function now accepts a `LinkRequest` and type-hints the new `LinkResponse`
# async def chat(req: LinkRequest) -> LinkResponse:
#     try:
#         # 👇 --- CHANGE HERE ---
#         # Call 'ask'. The result is not an 'answer', it's a 'key_name'
#         key_name = await run_in_threadpool(ask, req.query, req.history)
        
#         # All the old logic for 'suggested_products' and 'query_type'
#         # is no longer needed and has been removed.
        
#         # 👇 --- CHANGE HERE ---
#         # Return the correct response object with the key_name
#         return LinkResponse(key_name=key_name)
    
#     except Exception as e:
#         print("\n" + "="*50)
#         print("--- UNHANDLED EXCEPTION IN /chat ENDPOINT ---")
#         traceback.print_exc() 
#         # Fixed a small typo here (was 5T)
#         print("="*50 + "\n")
        
#         raise HTTPException(status_code=500, detail=str(e))


# from fastapi import APIRouter, HTTPException
# from fastapi.concurrency import run_in_threadpool
# # 👇 --- Import the correct models ---
# from ..core.models import LinkRequest, LinkResponse, NavItem # Import our new models
# from ..rag_engine.chain import ask
# import traceback
# import json
# from pathlib import Path

# # 👇 --- Load the JSON data once when the server starts ---
# # This assumes 'navigation_links.json' is in your project root, one level above 'app'
# LINKS_JSON_PATH = Path(__file__).parent.parent.parent / "navigation_links.json"
# LINKS_DATA = {}
# try:
#     with open(LINKS_JSON_PATH, 'r', encoding='utf-8') as f:
#         LINKS_DATA = json.load(f)
#     print(f"[INFO] routes.py: Successfully loaded {len(LINKS_DATA)} links from {LINKS_JSON_PATH}.")
# except Exception as e:
#     print(f"[ERROR] routes.py: FAILED to load {LINKS_JSON_PATH}. Lookup will not work. {e}")
#     # The app can still run, but lookups will fail.

# router = APIRouter()

# # The endpoint now promises to return our new `LinkResponse` model
# @router.post("/chat", response_model=LinkResponse)
# async def chat(req: LinkRequest) -> LinkResponse:
#     try:
#         # 1. Get the key_name (ID) from the RAG chain
#         key_name = await run_in_threadpool(ask, req.query, req.history)
        
#         # 2. Check if a valid match was found
#         if key_name == "not available" or key_name not in LINKS_DATA:
#             # No match, return an empty response (item will be null)
#             return LinkResponse(item=None)
        
#         # 3. A match was found! Look up the details from our loaded JSON.
#         item_data = LINKS_DATA[key_name]
        
#         # 4. Build the NavItem object
#         nav_item = NavItem(
#             key_name=key_name,
#             url=item_data.get("url", ""), # Use .get for safety
#             description=item_data.get("description", "")
#         )
#         # print(f"{nav_item}")
#         # 5. Return the full object in the response
#         return LinkResponse(item=nav_item)
    
#     except Exception as e:
#         print("\n" + "="*50)
#         print("--- UNHANDLED EXCEPTION IN /chat ENDPOINT ---")
#         traceback.print_exc() 
#         print("="*50 + "\n")
        
#         raise HTTPException(status_code=500, detail=str(e))


from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from ..core.models import LinkRequest, LinkResponse, NavItem 
from ..rag_engine.helper.chain import ask
import traceback
import json
from pathlib import Path

# ... (LINKS_JSON_PATH and LINKS_DATA loading stays the same) ...
LINKS_JSON_PATH = Path(__file__).parent.parent.parent / "navigation_links.json"
LINKS_DATA = {}
try:
    with open(LINKS_JSON_PATH, 'r', encoding='utf-8') as f:
        LINKS_DATA = json.load(f)
    print(f"[INFO] routes.py: Successfully loaded {len(LINKS_DATA)} links from {LINKS_JSON_PATH}.")
except Exception as e:
    print(f"[ERROR] routes.py: FAILED to load {LINKS_JSON_PATH}. Lookup will not work. {e}")

router = APIRouter()

@router.post("/chat", response_model=LinkResponse)
async def chat(req: LinkRequest) -> LinkResponse:
    try:
        # 1. Get the key_name (ID) from the RAG chain
        key_name = await run_in_threadpool(ask, req.query, req.history)
        
        # --- 👇 ADD THIS DEBUG BLOCK ---
        print("\n" + "="*30 + " DEBUGGING /chat " + "="*30)
        print(f"RAG chain returned key_name: '{key_name}' (Length: {len(key_name)})")
        
        # This print statement is the one you asked for.
        # It will show us all the keys Python loaded from your JSON file.
        print("\n--- Keys available in LINKS_DATA ---")
        print(list(LINKS_DATA.keys()))
        print("--- End of Keys ---")
        
        is_key_in_data = key_name in LINKS_DATA
        print(f"\nIs '{key_name}' in LINKS_DATA? -> {is_key_in_data}")
        print("="*80 + "\n")
        # --- END OF DEBUG BLOCK ---

        
        # 2. Check if a valid match was found
        if key_name == "not available" or not is_key_in_data:
            # No match, return an empty response (item will be null)
            return LinkResponse(item=None)
        
        # 3. A match was found! Look up the details from our loaded JSON.
        item_data = LINKS_DATA[key_name]
        
        # 4. Build the NavItem object
        nav_item = NavItem(
            key_name=key_name,
            url=item_data.get("url", ""), 
            description=item_data.get("description", "")
        )
        
        # 5. Return the full object in the response
        return LinkResponse(item=nav_item)
    
    except Exception as e:
        print("\n" + "="*50)
        print("--- UNHANDLED EXCEPTION IN /chat ENDPOINT ---")
        traceback.print_exc() 
        print("="*50 + "\n")
        
        raise HTTPException(status_code=500, detail=str(e))