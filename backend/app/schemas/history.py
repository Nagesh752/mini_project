from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class SearchHistoryItem(BaseModel):
    id: str
    user_id: str
    query: str
    budget: Optional[float] = None
    recommended_product_ids: List[str] = []
    result_snapshot: List[Dict[str, Any]] = []
    total_found: int = 0
    created_at: str

class SearchHistoryListResponse(BaseModel):
    items: List[SearchHistoryItem]
    total: int
