import datetime
import uuid
from typing import List, Optional
from fastapi import APIRouter, status
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.database.mongodb import db_manager

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(data: FeedbackCreate):
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    fb_id = f"fb_{uuid.uuid4().hex[:12]}"

    doc = {
        "_id": fb_id,
        "category": data.category,
        "rating": data.rating,
        "message": data.message.strip(),
        "email": str(data.email) if data.email else None,
        "search_query": data.search_query,
        "product_id": data.product_id,
        "feedback_choice": data.feedback_choice,
        "created_at": now_iso
    }

    await db_manager.insert_one("feedback", doc)

    return FeedbackResponse(
        id=fb_id,
        category=doc["category"],
        rating=doc["rating"],
        message=doc["message"],
        email=doc["email"],
        search_query=doc["search_query"],
        product_id=doc["product_id"],
        created_at=now_iso
    )

@router.get("", response_model=List[FeedbackResponse])
async def list_feedback():
    records = await db_manager.find_many("feedback", {}, sort_field="created_at", sort_desc=True, limit=20)
    items = []
    for r in records:
        items.append(
            FeedbackResponse(
                id=str(r["_id"]),
                category=r.get("category", "General"),
                rating=r.get("rating", 5),
                message=r.get("message", ""),
                email=r.get("email"),
                search_query=r.get("search_query"),
                product_id=r.get("product_id"),
                created_at=r.get("created_at", "")
            )
        )
    return items
