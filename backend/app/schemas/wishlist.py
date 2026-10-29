from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class WishlistAddRequest(BaseModel):
    product_id: str
    product_snapshot: Optional[Dict[str, Any]] = None

class WishlistItemResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    product: Dict[str, Any]
    created_at: str

class WishlistListResponse(BaseModel):
    items: List[WishlistItemResponse]
    total: int
