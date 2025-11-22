

# In retriever.py

from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI # 👈 ADD ChatGoogleGenerativeAI
from langchain_core.vectorstores import VectorStoreRetriever
from langchain_classic.chains.query_constructor.base import AttributeInfo # 👈 ADD THIS IMPORT
from langchain_classic.retrievers.self_query.base import SelfQueryRetriever # 👈 ADD THIS IMPORT
from pathlib import Path
import os

from ...core.config import get_settings
from .loader import load_and_split

def build_retriever() -> VectorStoreRetriever:
    cfg = get_settings()
    # embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    # NEW - Pass the key
    embedding = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004", 
        google_api_key=cfg.google_api_key
    )
    persist_path = Path(cfg.chroma_dir)
    
    # This logic for loading/building the vector store remains the same
    if persist_path.exists() and os.listdir(persist_path):
        print("[INFO] Loading existing Chroma vector store.")
        vs = Chroma(
            persist_directory=str(persist_path),
            embedding_function=embedding,
            collection_name="my_collection"
        )
    else:
        print("[INFO] Building new Chroma vector store.")
        splits = load_and_split()
        if not splits:
            raise ValueError("No documents were loaded to build the vector store.")
        
        vs = Chroma.from_documents(
            documents=splits,
            embedding=embedding,
            collection_name="my_collection",
            persist_directory=str(persist_path),
        )
    
    # 👇 DEFINE YOUR METADATA FIELDS FOR THE RETRIEVER
    metadata_field_info = [
        AttributeInfo(name="product_name", description="The name of the banking product", type="string"),
        AttributeInfo(name="category", description="The category of the product: 'loan' or 'insurance'", type="string"),
        AttributeInfo(name="interest_rate", description="The interest rate for loans", type="string"),
        AttributeInfo(name="premium", description="The premium amount for insurance", type="string"),
        AttributeInfo(name="loan_amount", description="The loan amount range", type="string"),
        AttributeInfo(name="coverage_amount", description="The coverage amount for insurance", type="string"),
        AttributeInfo(name="tenure", description="The tenure or policy term", type="string"),
        AttributeInfo(name="entry_age", description="The minimum and maximum entry age", type="string"),
        AttributeInfo(name="processing_fee", description="The processing fee for loans", type="string"),
        AttributeInfo(name="eligibility_criteria", description="The eligibility criteria for the product", type="string"),
    ]
    
    document_content_description = "A document describing a product with its features and specifications"
    # llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
    # NEW - Pass the key
    llm = ChatGoogleGenerativeAI(
        model="models/gemini-2.5-flash", 
        google_api_key=cfg.google_api_key
    )

    # 👇 CREATE AND RETURN THE SELF-QUERYING RETRIEVER
    retriever = SelfQueryRetriever.from_llm(
        llm,
        vs,
        document_content_description,
        metadata_field_info,
        verbose=True # Set to True for debugging to see the generated queries
    )
    
    # return vs.as_retriever(search_type="mmr", search_kwargs={"k": 5}) # k=5 is a good starting point
    return retriever