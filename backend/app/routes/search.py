import datetime
import uuid
from typing import Optional
from fastapi import APIRouter, Depends
from app.schemas.search import SearchRequest, SearchResponse
from app.services.ai_service import parse_natural_language_query
from app.services.product_service import get_all_products, generate_dynamic_products
from app.services.ranking_service import rank_products_for_query
from app.auth.jwt_handler import get_optional_user
from app.database.mongodb import db_manager

router = APIRouter(prefix="/search", tags=["Product Search"])

@router.post("", response_model=SearchResponse)
async def search_products_endpoint(
    req: SearchRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    search_id = f"sch_{uuid.uuid4().hex[:12]}"

    # 1. Interpret requirements
    interpretation = parse_natural_language_query(req.query)

    # Allow explicit budget override if supplied
    if req.budget:
        interpretation.budget_limit = req.budget
        interpretation.budget_label = f"Up to ₹{int(req.budget):,}"

    # 2. Retrieve genuine catalog candidates
    all_products = get_all_products()

    # Filter candidate products
    filtered = []
    query_lower = req.query.lower()
    search_words = [w for w in query_lower.split() if len(w) > 2 and w not in ["the", "and", "with", "for", "under", "need", "want"]]

    for p in all_products:
        # Category filtering if detected
        if interpretation.category and p.category != interpretation.category:
            continue

        # Match relevance
        matched = False
        if interpretation.category and p.category == interpretation.category:
            matched = True
        for w in search_words:
            if w in p.name.lower() or w in p.brand.lower() or any(w in t.lower() for t in p.tags):
                matched = True
                break

        if matched or not search_words:
            filtered.append(p)

    if not filtered:
        # If category specified, try finding category items
        if interpretation.category:
            filtered = [p for p in all_products if p.category == interpretation.category]

        # If still empty, generate multi-marketplace products across Amazon, Flipkart, and Meesho
        if not filtered:
            filtered = generate_dynamic_products(req.query, interpretation.budget_limit)

    # 3. Rank candidates according to Section 11 of spec.md
    top_recs, other_recs = rank_products_for_query(filtered, interpretation)

    # 4. If user is authenticated, persist to MongoDB search_history collection (Section 10 of spec.md)
    if current_user:
        history_doc = {
            "_id": search_id,
            "user_id": str(current_user["_id"]),
            "query": req.query.strip(),
            "budget": interpretation.budget_limit,
            "recommended_product_ids": [r.product.product_id for r in top_recs],
            "result_snapshot": [r.product.model_dump() for r in top_recs],
            "total_found": len(filtered),
            "created_at": now_iso
        }
        await db_manager.insert_one("search_history", history_doc)

    return SearchResponse(
        search_id=search_id,
        query=req.query,
        interpretation=interpretation,
        top_recommendations=top_recs,
        all_results=filtered,
        total_found=len(filtered),
        created_at=now_iso
    )
