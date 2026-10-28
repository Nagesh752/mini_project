from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class ProductPrice(BaseModel):
    amount: float
    currency: str = "INR"
    original_amount: Optional[float] = None
    discount_percent: Optional[int] = None

class MarketplaceInfo(BaseModel):
    name: str = "Amazon India"
    logo_url: Optional[str] = None

class ProductSchema(BaseModel):
    product_id: str
    name: str
    brand: str
    category: str
    image_url: str
    price: ProductPrice
    rating: float = Field(default=0.0, ge=0.0, le=5.0)
    rating_count: int = 0
    description: str = ""
    marketplace: MarketplaceInfo = Field(default_factory=MarketplaceInfo)
    product_url: str
    specifications: Dict[str, Any] = Field(default_factory=dict)
    features: List[str] = Field(default_factory=list)
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)
    source: str = "verified-catalog"
    retrieved_at: str
    tags: List[str] = Field(default_factory=list)

class RankedRecommendation(BaseModel):
    product: ProductSchema
    rank: int
    score: int
    is_best_match: bool = False
    reason: str
    match_highlights: List[str] = Field(default_factory=list)
    budget_suitability: str
    value_for_money: str
    score_breakdown: Dict[str, int] = Field(default_factory=dict)
