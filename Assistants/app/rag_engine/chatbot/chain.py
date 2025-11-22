# --- Keep all your existing imports ---
from langchain_google_genai import ChatGoogleGenerativeAI

# from langchain.chains import create_history_aware_retriever
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain.chains import create_retrieval_chain

# from langchain.chains.history_aware_retriever import create_history_aware_retriever
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain.chains.retrieval import create_retrieval_chain

# NEW - The Fix
from langchain_classic.chains.history_aware_retriever import create_history_aware_retriever
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains.retrieval import create_retrieval_chain

from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
import sys
import logging
# from collections import Counter
from typing import List

# 👇 ADD Pydantic for structured output
# from langchain_core.pydantic_v1 import BaseModel, Field

from .retriever import build_retriever
from .prompts import rewrite_prompt, qa_prompt
from ...core.config import get_settings

# --- This function remains the same ---
def build_rag_chain():
    cfg = get_settings()
    # llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash") # Or your preferred model
    llm = ChatGoogleGenerativeAI(
        model="models/gemini-2.5-flash",  
        google_api_key=cfg.google_api_key
    )
    # NEW - Pass the key
    retriever = build_retriever() # This should now be a standard retriever, not self-querying

    history_aware = create_history_aware_retriever(
        llm=llm,
        retriever=retriever,
        prompt=rewrite_prompt,
    )

    qa_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware, qa_chain)
    return rag_chain, retriever

try:
    rag_chain, retriever = build_rag_chain()
except Exception as e:
    logging.basicConfig(level=logging.INFO)
    logging.exception("Failed to build RAG chain at startup.")
    sys.exit("Could not initialize the RAG chain. Exiting.")

# 👇 NEW: Pydantic model to define the structure for spec extraction
# class BankingSpecs(BaseModel):
#     """Relevant specifications for a banking product mentioned in the user query."""
#     specs: List[str] = Field(
#         description="A list of key features or specifications mentioned by the user. For example, 'personal loan', 'home loan', 'life insurance', 'health insurance', 'low interest rate', 'high coverage amount'."
#     )
#     query_type: str = Field(
#         description="The type of query: 'loan', 'insurance', or 'general'"
#     )

# # 👇 NEW: Function to extract key features from a query
# def extract_specs(query: str) -> tuple[List[str], str]:
#     print(f"[DEBUG] Extracting specs from query: '{query}'")
#     llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
#     structured_llm = llm.with_structured_output(BankingSpecs)
    
#     try:
#         result = structured_llm.invoke(f"Extract the key banking product specifications and query type from this user query: '{query}'")
#         print(f"[DEBUG] Extracted specs: {result.specs}")
#         print(f"[DEBUG] Query type: {result.query_type}")
#         return result.specs, result.query_type
#     except Exception as e:
#         print(f"[WARN] Failed to extract specs: {e}")
#         return [], "general"

# 👇 MODIFIED: The main 'ask' function with the new robust logic
# def ask(query: str, history: list[str]) -> str:
#     print(f"[DEBUG] Query: {query}")
#     print(f"[DEBUG] History: {history}")

#     # Step 1: Extract key specifications from the user's query
#     specs, query_type = extract_specs(query)

#     # If no specs are extracted, fall back to a simple RAG invocation
#     if not specs:
#         print("[DEBUG] No specs extracted, performing simple RAG.")
#         result = rag_chain.invoke({"input": query, "chat_history": history})
#         return result.get("answer", "not available")

#     # Step 2 & 3: Retrieve documents for each spec and rank them
#     all_retrieved_docs = []
#     for spec in specs:
#         # Perform a retrieval for each individual spec
#         docs = retriever.invoke(spec)
#         all_retrieved_docs.extend(docs)
#         print(f"[DEBUG] Retrieved {len(docs)} docs for spec: '{spec}'")

#     if not all_retrieved_docs:
#         # If still no documents are found, give a "not available" response
#         return "not available"

#     # Use a Counter to find the most relevant documents (those retrieved most often)
#     # We use the page_content as a unique identifier for each document
#     doc_counts = Counter(doc.page_content for doc in all_retrieved_docs)
    
#     # Create a de-duplicated, ranked list of documents
#     unique_docs = {doc.page_content: doc for doc in all_retrieved_docs}.values()
#     ranked_docs = sorted(unique_docs, key=lambda doc: doc_counts[doc.page_content], reverse=True)

#     print(f"[DEBUG] Ranked Docs (Top 3 IDs): {[doc.metadata.get('source_file') for doc in ranked_docs[:3]]}")

#     # Step 4: Manually invoke the final QA chain with the ranked context
#     # We bypass the full rag_chain to inject our custom-retrieved context
#     qa_chain = create_stuff_documents_chain(ChatGoogleGenerativeAI(model="gemini-2.5-flash"), qa_prompt)
    
#     final_result = qa_chain.invoke({
#         "input": query,
#         "chat_history": history,
#         "context": ranked_docs # Injecting our highly relevant, ranked docs
#     })

#     return final_result.get("answer", "not available")

def ask(query: str, history: list[str]) -> str:
    print(f"[DEBUG] Query: {query}")
    print(f"[DEBUG] History: {history}")

    # The SelfQueryRetriever will automatically parse "query"
    # and filter on metadata *inside* this 'invoke' call.
    result = rag_chain.invoke({"input": query, "chat_history": history})
    
    print("[DEBUG] Final RAG Output:", result)
    # Use "not available" as a fallback, per your prompt's requirements
    return result.get("answer", "not available")