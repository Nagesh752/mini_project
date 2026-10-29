import asyncio
import datetime
import logging
import uuid
from typing import Optional

from fastapi import APIRouter, Depends

from app.auth.jwt_handler import get_optional_user
from app.database.mongodb import db_manager
from app.schemas.search import SearchRequest, SearchResponse
from app.services.ai_service import parse_natural_language_query
from app.services.ranking_service import rank_products_for_query
from app.services.shopping_service import enrich_products_with_merchant_urls, search_shopping_products

logger = logging.getLogger("uvicorn.error")
router = APIRouter(prefix="/search", tags=["Product Search"])


@router.post("", response_model=SearchResponse)
async def search_products_endpoint(
    req: SearchRequest,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    query = req.query.strip()
    if not query:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail="Enter a product search query.")

    # Gemini interpretation is optional; the deterministic parser keeps search available if AI is down.
    interpretation = await asyncio.to_thread(parse_natural_language_query, query)
    if req.budget is not None:
        interpretation.budget_limit = req.budget
        interpretation.budget_label = f"Up to ₹{int(req.budget):,}"
    if req.category:
        interpretation.category = req.category
    if req.purpose:
        interpretation.purpose = req.purpose

    shopping_query = interpretation.search_query or query
    if interpretation.budget_limit:
        budget_text = str(int(interpretation.budget_limit))
        if budget_text not in shopping_query.replace(",", ""):
            shopping_query = f"{shopping_query} under ₹{budget_text}"
    products = await search_shopping_products(shopping_query)
    top_recs, _ = rank_products_for_query(products, interpretation)
    await enrich_products_with_merchant_urls([rec.product for rec in top_recs])
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    search_id = f"sch_{uuid.uuid4().hex[:12]}"

    if current_user:
        history_doc = {
            "_id": search_id,
            "user_id": str(current_user["_id"]),
            "query": query,
            "budget": interpretation.budget_limit,
            "recommended_product_ids": [rec.product.product_id for rec in top_recs],
            "result_snapshot": [rec.product.model_dump() for rec in top_recs],
            "total_found": len(products),
            "created_at": now_iso,
        }
        try:
            await db_manager.insert_one("search_history", history_doc)
        except Exception as exc:
            # Search results remain useful even if optional history persistence is unavailable.
            logger.warning("Could not persist search history (%s)", type(exc).__name__)

    return SearchResponse(
        search_id=search_id,
        query=query,
        interpretation=interpretation,
        top_recommendations=top_recs,
        all_results=products,
        total_found=len(products),
        created_at=now_iso,
    )
