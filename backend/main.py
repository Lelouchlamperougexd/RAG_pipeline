from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from models import Feedback, Query
from vector_store import search_similar, add_document
import uuid
import json

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def root():
    return {"message": "RAG Feedback API", "endpoints": ["/query", "/feedback", "/feedback/stats"]}

@app.post("/query")
def get_response(query: Query):
    # Placeholder for generation (LLM will be connected here)
    answer = f"Answer to: {query.text}"
    return {"response": answer, "response_id": str(uuid.uuid4())}

@app.post("/feedback")
def receive_feedback(feedback: Feedback):
    with open("feedback_store.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps(feedback.dict()) + "\n")
    if feedback.corrected_prompt:
        add_document(feedback.corrected_prompt)
    return {"status": "ok"}

@app.get("/feedback")
def get_all_feedback():
    """Get all collected feedback"""
    feedbacks = []
    try:
        with open("feedback_store.jsonl", "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    feedbacks.append(json.loads(line))
    except FileNotFoundError:
        pass
    return {"feedbacks": feedbacks}

@app.get("/feedback/stats")
def get_feedback_stats():
    """Get feedback statistics"""
    feedbacks = []
    try:
        with open("feedback_store.jsonl", "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    feedbacks.append(json.loads(line))
    except FileNotFoundError:
        pass
    
    if not feedbacks:
        return {"total": 0, "avg_rating": 0, "feedback_types": {}}
    
    total = len(feedbacks)
    ratings = [f.get("stars", 0) for f in feedbacks if f.get("stars")]
    avg_rating = sum(ratings) / len(ratings) if ratings else 0
    
    feedback_types = {}
    for f in feedbacks:
        f_type = f.get("feedback_type", "unknown")
        feedback_types[f_type] = feedback_types.get(f_type, 0) + 1
    
    return {
        "total": total,
        "avg_rating": round(avg_rating, 2),
        "feedback_types": feedback_types,
        "with_corrections": len([f for f in feedbacks if f.get("corrected_prompt")])
    }

@app.get("/feedback/search")
def search_feedback(query: str, limit: int = 5):
    """Search similar feedback using vector search"""
    try:
        similar_docs = search_similar(query, limit)
        return {"similar_feedbacks": similar_docs}
    except Exception as e:
        return {"error": str(e)}

@app.get("/feedback/{response_id}")
def get_feedback_by_response(response_id: str):
    """Get feedback by specific response_id"""
    try:
        with open("feedback_store.jsonl", "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    feedback = json.loads(line)
                    if feedback.get("response_id") == response_id:
                        return feedback
    except FileNotFoundError:
        pass
    return {"error": "Feedback not found"} 