from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.schemas.product import RankedRecommendation, ProductSchema

class CompareRequest(BaseModel):
    product_ids: List[str] = Field(..., min_length=2, max_length=5)
    query: Optional[str] = None

class CompareResponse(BaseModel):
    comparison_id: str
    total_selected: int
    top_recommendations: List[RankedRecommendation]
    other_compared: List[RankedRecommendation]
    compared_products: List[ProductSchema]
    created_at: str

class ComparisonHistoryItem(BaseModel):
    id: str
    user_id: str
    product_ids: List[str]
    products_summary: List[Dict[str, Any]]
    created_at: str
