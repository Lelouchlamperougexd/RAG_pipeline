from pydantic import BaseModel
from typing import Optional

class Query(BaseModel):
    text: str

class Feedback(BaseModel):
    user_id: str
    query: str
    response_id: str
    response_text: str
    feedback_type: str  # "edit", "like"
    corrected_prompt: Optional[str] = None
    stars: Optional[int] = None
    liked: Optional[bool] = None 