from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.history import SearchHistoryListResponse, SearchHistoryItem
from app.auth.jwt_handler import get_current_user
from app.database.mongodb import db_manager

router = APIRouter(prefix="/search-history", tags=["Search History"])

@router.get("", response_model=SearchHistoryListResponse)
async def get_user_search_history(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    records = await db_manager.find_many(
        "search_history",
        {"user_id": user_id},
        sort_field="created_at",
        sort_desc=True,
        limit=20
    )

    items = []
    for r in records:
        items.append(
            SearchHistoryItem(
                id=str(r["_id"]),
                user_id=r["user_id"],
                query=r.get("query", ""),
                budget=r.get("budget"),
                recommended_product_ids=r.get("recommended_product_ids", []),
                result_snapshot=r.get("result_snapshot", []),
                total_found=r.get("total_found", 0),
                created_at=r.get("created_at", "")
            )
        )

    return SearchHistoryListResponse(items=items, total=len(items))

@router.get("/{search_id}", response_model=SearchHistoryItem)
async def get_single_search_history(search_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    record = await db_manager.find_one("search_history", {"_id": search_id, "user_id": user_id})
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved search not found or unauthorized")

    return SearchHistoryItem(
        id=str(record["_id"]),
        user_id=record["user_id"],
        query=record.get("query", ""),
        budget=record.get("budget"),
        recommended_product_ids=record.get("recommended_product_ids", []),
        result_snapshot=record.get("result_snapshot", []),
        total_found=record.get("total_found", 0),
        created_at=record.get("created_at", "")
    )
