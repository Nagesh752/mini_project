import datetime
import uuid
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.wishlist import WishlistAddRequest, WishlistListResponse, WishlistItemResponse
from app.auth.jwt_handler import get_current_user
from app.database.mongodb import db_manager
from app.services.product_service import get_product_by_id

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

@router.get("", response_model=WishlistListResponse)
async def get_user_wishlist(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    records = await db_manager.find_many("wishlist", {"user_id": user_id}, sort_field="created_at", sort_desc=True)

    items = []
    for r in records:
        product_data = r.get("product_snapshot")
        if not product_data:
            p = get_product_by_id(r["product_id"])
            product_data = p.model_dump() if p else {"product_id": r["product_id"], "name": "Saved Item"}

        items.append(
            WishlistItemResponse(
                id=str(r["_id"]),
                user_id=r["user_id"],
                product_id=r["product_id"],
                product=product_data,
                created_at=r.get("created_at", "")
            )
        )

    return WishlistListResponse(items=items, total=len(items))

@router.post("", response_model=WishlistItemResponse, status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(req: WishlistAddRequest, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])

    # Prevent duplicate
    existing = await db_manager.find_one("wishlist", {"user_id": user_id, "product_id": req.product_id})
    if existing:
        return WishlistItemResponse(
            id=str(existing["_id"]),
            user_id=existing["user_id"],
            product_id=existing["product_id"],
            product=existing.get("product_snapshot", {}),
            created_at=existing.get("created_at", "")
        )

    # Get product snapshot
    product_snapshot = req.product_snapshot
    if not product_snapshot:
        p = get_product_by_id(req.product_id)
        if p:
            product_snapshot = p.model_dump()
        else:
            product_snapshot = {"product_id": req.product_id}

    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    doc_id = f"wsh_{uuid.uuid4().hex[:12]}"

    new_entry = {
        "_id": doc_id,
        "user_id": user_id,
        "product_id": req.product_id,
        "product_snapshot": product_snapshot,
        "created_at": now_iso
    }

    await db_manager.insert_one("wishlist", new_entry)

    return WishlistItemResponse(
        id=doc_id,
        user_id=user_id,
        product_id=req.product_id,
        product=product_snapshot,
        created_at=now_iso
    )

@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def remove_from_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    deleted = await db_manager.delete_one("wishlist", {"user_id": user_id, "product_id": product_id})
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found in your wishlist")
    return {"message": "Product removed from wishlist successfully", "product_id": product_id}
