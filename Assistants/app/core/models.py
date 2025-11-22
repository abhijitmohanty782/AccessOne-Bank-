# from pydantic import BaseModel
# from typing import List, Optional
# from enum import Enum

# class QueryType(str, Enum):
#     LOAN = "loan"
#     INSURANCE = "insurance"
#     GENERAL = "general"

# class ChatRequest(BaseModel):
#     query: str
#     history: List[str] = []
#     query_type: Optional[QueryType] = None

# class ChatResponse(BaseModel):
#     answer: str
#     suggested_products: Optional[List[str]] = []
#     query_type: Optional[QueryType] = None


from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

# --- Models from Chatbot ---

class QueryType(str, Enum):
    LOAN = "loan"
    INSURANCE = "insurance"
    GENERAL = "general"

class ChatRequest(BaseModel):
    query: str
    history: List[str] = []
    query_type: Optional[QueryType] = None

class ChatResponse(BaseModel):
    answer: str
    suggested_products: Optional[List[str]] = []
    query_type: Optional[QueryType] = None

# --- Models from Helper ---

# This model defines the data we EXPECT from the user's request
class LinkRequest(BaseModel):
    query: str
    history: List[str] = [] # Ignored by our chain, but good to have

# NEW: A model to represent the full navigation item
class NavItem(BaseModel):
    key_name: str
    url: str
    description: str

# This model defines the data we WILL SEND back as a response
class LinkResponse(BaseModel):
    # The 'item' will be our NavItem object,
    # or it will be `null` (None) if no match was found.
    item: Optional[NavItem] = None