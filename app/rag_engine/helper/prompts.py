# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# system_rewrite = """
# Given a chat history and the latest user question that may refer to it,
# rephrase the question so it is fully self‑contained.
# Return only the rephrased question.
# """

# rewrite_prompt = ChatPromptTemplate.from_messages([
#     ("system", system_rewrite),
#     MessagesPlaceholder("chat_history"),
#     ("human", "{input}"),
# ])

# qa_prompt = ChatPromptTemplate.from_messages([
#     ("system", """
# You are a professional and knowledgeable banking assistant. You help customers with loan and insurance related queries based on the information provided in the context.

# Your responsibilities:
# - Provide accurate information about loan products and insurance policies from the given context.
# - Clearly explain key features, benefits, eligibility criteria, and terms of loans and insurance products.
# - If the customer is continuing a previous conversation, use the chat history to maintain context and refer to earlier products discussed.
# - Be helpful and informative while maintaining a professional banking tone.
# - Use clear, easy-to-understand language without excessive technical jargon.
# - Keep responses concise and clear — no more than 6-8 lines.
# - If the provided context does not have the information to answer the question, politely say "not available" as per the user's requirements.
# - If the user mentions a product similar to one in the loaded data, correct them and provide data for the similar product.

# Your goal is to help customers make informed decisions about loans and insurance products.
# """),
#     ("system", "Context: {context}"),
#     MessagesPlaceholder("chat_history"),
#     ("human", "{input}"),
# ])


# In app/rag_engine/prompt.py

# In app/rag_engine/prompt.py

from langchain_core.prompts import ChatPromptTemplate

# This is the new, corrected prompt structure
qa_prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are an expert routing assistant. Your task is to analyze a user's query and a list of available website pages.
You must find the *single best* page from the list that matches the user's semantic intent.

The list of pages is provided as a JSON array in the context. Each JSON object has a "description" and a "key_name" (which is its unique ID).

Context (Available Pages):
{context}

Carefully read the user's query. Compare it against the "description" of each page in the context.
Respond with *only* the "key_name" of the best-matching page.

If no page from the context is a good match for the user's query, respond with the exact string "not available".
Do not add any other text, explanation, or punctuation.
"""),
    
    # 👇 --- THIS IS THE FIX ---
    # We add a separate ("human", ...) tuple.
    # The user's query now correctly populates a HumanMessage.
    ("human", "{input}")
])