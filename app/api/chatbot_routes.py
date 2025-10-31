# from fastapi import APIRouter, Depends, HTTPException
# from ..core.models import ChatRequest, ChatResponse
# from ..rag_engine.chain import ask

# router = APIRouter()

# @router.post("/chat", response_model=ChatResponse)
# async def chat(req: ChatRequest) -> ChatResponse:
#     try:
#         answer = ask(req.query, req.history)
#         return ChatResponse(answer=answer)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))



from fastapi import APIRouter, Depends, HTTPException
from fastapi.concurrency import run_in_threadpool # 👈 ADD THIS IMPORT
from ..core.models import ChatRequest, ChatResponse
from ..rag_engine.chatbot.chain import ask
import traceback

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    try:
        # 👇 WRAP THE 'ask' FUNCTION CALL IN 'run_in_threadpool'
        answer = await run_in_threadpool(ask, req.query, req.history)
        
        # Extract suggested products from the answer (simple keyword matching)
        suggested_products = []
        banking_products = [
            "Personal Loan", "Home Loan", "Car Loan", "Business Loan",
            "Life Insurance", "Health Insurance", "Motor Insurance", "Travel Insurance"
        ]
        
        for product in banking_products:
            if product.lower() in answer.lower():
                suggested_products.append(product)
        
        # Determine query type based on keywords
        query_type = "general"
        if any(keyword in answer.lower() for keyword in ["loan", "borrow", "credit", "interest rate"]):
            query_type = "loan"
        elif any(keyword in answer.lower() for keyword in ["insurance", "premium", "coverage", "policy"]):
            query_type = "insurance"
        
        return ChatResponse(
            answer=answer,
            suggested_products=suggested_products,
            query_type=query_type
        )
    except Exception as e:
        # Consider adding logging here for better debugging in the future
        # import logging
        # logging.exception("An error occurred in the chat endpoint.")
        
        # 👇 ADD THESE 3 LINES TO FORCE-PRINT THE ERROR
        print("\n" + "="*50)
        print("--- UNHANDLED EXCEPTION IN /chat ENDPOINT ---")
        traceback.print_exc() # This prints the full error traceback
        # print("="*5T + "\n")
        
        raise HTTPException(status_code=500, detail=str(e))