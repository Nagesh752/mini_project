from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class FeedbackCreate(BaseModel):
    category: str
    rating: int = Field(..., ge=1, le=5)
    message: str = Field(..., min_length=5, max_length=1000)
    email: Optional[EmailStr] = None
    search_query: Optional[str] = None
    product_id: Optional[str] = None
    feedback_choice: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    category: str
    rating: int
    message: str
    email: Optional[str] = None
    search_query: Optional[str] = None
    product_id: Optional[str] = None
    created_at: str
