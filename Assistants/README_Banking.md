# Banking Chatbot

An AI-powered chatbot designed specifically for banking services, focusing on loan and insurance product recommendations and queries.

## Features

- **Loan Products**: Personal Loan, Home Loan, Car Loan, Business Loan
- **Insurance Products**: Life Insurance, Health Insurance, Motor Insurance, Travel Insurance
- **Smart Query Processing**: Automatically categorizes queries as loan, insurance, or general
- **Contextual Responses**: Provides accurate information based on loaded banking product data
- **Professional Banking Tone**: Maintains appropriate banking communication standards

## Banking Products Available

### Loans
1. **Personal Loan**
   - Interest Rate: 10.5% - 18.5% per annum
   - Loan Amount: ₹50,000 - ₹50,00,000
   - Tenure: 12 - 60 months

2. **Home Loan**
   - Interest Rate: 8.5% - 12.5% per annum
   - Loan Amount: ₹5,00,000 - ₹10,00,00,000
   - Tenure: 5 - 30 years

3. **Car Loan**
   - Interest Rate: 9.5% - 15.5% per annum
   - Loan Amount: ₹1,00,000 - ₹50,00,000
   - Tenure: 12 - 84 months

4. **Business Loan**
   - Interest Rate: 12% - 20% per annum
   - Loan Amount: ₹1,00,000 - ₹2,00,00,000
   - Tenure: 12 - 60 months

### Insurance
1. **Life Insurance**
   - Premium: ₹500 - ₹50,000 per month
   - Coverage: ₹1,00,000 - ₹5,00,00,000
   - Policy Term: 10 - 30 years

2. **Health Insurance**
   - Premium: ₹2,000 - ₹25,000 per year
   - Coverage: ₹1,00,000 - ₹50,00,000
   - Policy Term: 1 year (renewable)

3. **Motor Insurance**
   - Premium: ₹1,500 - ₹15,000 per year
   - Coverage Type: Third Party Liability / Comprehensive
   - Policy Term: 1 year (renewable)

4. **Travel Insurance**
   - Premium: ₹500 - ₹5,000 per trip
   - Coverage: ₹1,00,000 - ₹50,00,000
   - Trip Duration: 1 - 365 days

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Environment Variables**
   Create a `.env` file with:
   ```
   GOOGLE_API_KEY=your_google_api_key
   LANGCHAIN_API_KEY=your_langchain_api_key
   DOC_FOLDER=Banking_Products
   CHROMA_DIR=chroma_db
   ENV=development
   ```

3. **Start the Application**
   ```bash
   chmod +x startup.sh
   ./startup.sh
   ```

4. **Access the Chatbot**
   - Backend API: `http://localhost:8080`
   - Frontend Interface: Open `index.html` in your browser
   - API Documentation: `http://localhost:8080/docs`

## API Usage

### Chat Endpoint
```bash
POST /api/chat
Content-Type: application/json

{
  "query": "I need a personal loan for ₹5,00,000",
  "history": []
}
```

### Response Format
```json
{
  "answer": "I can help you with a Personal Loan. Our Personal Loan offers...",
  "suggested_products": ["Personal Loan"],
  "query_type": "loan"
}
```

## Key Features

- **Memory Integration**: The chatbot remembers user preferences and requirements [[memory:3139837]]
- **Data-Driven Responses**: Only provides information from loaded banking product data
- **Professional Banking Tone**: Maintains appropriate communication standards
- **Query Classification**: Automatically identifies loan, insurance, or general queries
- **Product Suggestions**: Recommends relevant banking products based on user queries

## File Structure

```
├── app/
│   ├── api/routes.py          # API endpoints
│   ├── core/
│   │   ├── config.py          # Configuration settings
│   │   └── models.py          # Data models
│   ├── rag_engine/
│   │   ├── chain.py           # RAG processing chain
│   │   ├── loader.py          # Document loader
│   │   ├── prompts.py         # AI prompts
│   │   └── retriever.py       # Vector store retriever
│   └── main.py                # FastAPI application
├── Banking_Products/          # Banking product data files
├── chroma_db/                 # Vector database
├── index.html                 # Frontend interface
└── startup.sh                 # Startup script
```

## Customization

To add new banking products:
1. Create a new `.txt` file in `Banking_Products/` directory
2. Follow the existing format with key-value pairs
3. Restart the application to load new data

## Notes

- The chatbot only responds with information from loaded data
- If a product isn't available in the loaded data, it responds with "not available"
- The system corrects users if they mention products similar to those in the loaded data
