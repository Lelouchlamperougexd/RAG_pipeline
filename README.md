# RAG Feedback Pipeline

Simple MVP for collecting RAG system feedback with FastAPI backend and React frontend.

## Project Structure

```
RAG_pipeline/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── models.py            # Pydantic schemas
│   ├── vector_store.py      # FAISS vector search
│   ├── feedback_store.jsonl # Feedback storage
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── components/
│   │   │   └── FeedbackForm.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Server will start at http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run start
```

App will open at http://localhost:3000

## API Endpoints

### Main
- `POST /query` - Send query
- `POST /feedback` - Send feedback

### Data Retrieval
- `GET /feedback` - Get all collected feedback
- `GET /feedback/stats` - Feedback statistics (count, average rating, types)
- `GET /feedback/search?query=text&limit=5` - Search similar feedback
- `GET /feedback/{response_id}` - Get feedback by specific response

## Features

1. **Queries**: User enters a question and gets an answer
2. **Feedback**: Rate answers (1-5 stars) and provide corrections
3. **Vector Search**: FAISS for finding similar documents
4. **Storage**: JSONL file for feedback storage

## Next Steps

1. Connect real LLM for answer generation
2. Add feedback quality assessment
3. Implement anomaly detection
4. Add monitoring and metrics 