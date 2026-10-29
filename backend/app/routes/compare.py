import datetime
import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.compare import CompareRequest, CompareResponse, ComparisonHistoryItem
from app.services.product_service import get_product_by_id, get_all_products
from app.services.ranking_service import rank_products_for_query
from app.services.ai_service import parse_natural_language_query
from app.auth.jwt_handler import get_optional_user, get_current_user
from app.database.mongodb import db_manager

router = APIRouter(prefix="/compare", tags=["Product Comparison"])

@router.post("", response_model=CompareResponse)
async def compare_products_endpoint(
    req: CompareRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    if len(req.product_ids) < 2:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least 2 products are required for comparison.")
    if len(req.product_ids) > 5:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A maximum of 5 products can be compared at a time.")

    # Retrieve products
    selected_products = []
    for pid in req.product_ids:
        p = get_product_by_id(pid)
        if p:
            selected_products.append(p)

    if len(selected_products) < 2:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not resolve at least 2 valid products for comparison.")

    # Parse query or use neutral interpretation
    interpretation = parse_natural_language_query(req.query or selected_products[0].name)

    # Rank selected products adhering to Section 11 & 12
    top_recs, other_recs = rank_products_for_query(selected_products, interpretation)

    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    comp_id = f"cmp_{uuid.uuid4().hex[:12]}"

    # Save to comparison_history if user authenticated
    if current_user:
        history_entry = {
            "_id": comp_id,
            "user_id": str(current_user["_id"]),
            "product_ids": req.product_ids,
            "products_summary": [{"product_id": p.product_id, "name": p.name, "price": p.price.amount} for p in selected_products],
            "created_at": now_iso
        }
        await db_manager.insert_one("comparison_history", history_entry)

    return CompareResponse(
        comparison_id=comp_id,
        total_selected=len(selected_products),
        top_recommendations=top_recs,
        other_compared=other_recs,
        compared_products=selected_products,
        created_at=now_iso
    )

@router.get("/history", response_model=List[ComparisonHistoryItem])
async def list_comparison_history(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    records = await db_manager.find_many("comparison_history", {"user_id": user_id}, sort_field="created_at", sort_desc=True)

    items = []
    for r in records:
        items.append(
            ComparisonHistoryItem(
                id=str(r["_id"]),
                user_id=r["user_id"],
                product_ids=r.get("product_ids", []),
                products_summary=r.get("products_summary", []),
                created_at=r.get("created_at", "")
            )
        )
    return items
