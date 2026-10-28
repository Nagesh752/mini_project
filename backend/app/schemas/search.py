from pydantic import BaseModel, Field
from typing import Optional, List
from app.schemas.product import ProductSchema, RankedRecommendation

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    budget: Optional[float] = None
    category: Optional[str] = None

class QueryInterpretationSchema(BaseModel):
    original_query: str
    category: Optional[str] = None
    category_label: Optional[str] = None
    budget_limit: Optional[float] = None
    budget_label: Optional[str] = None
    purpose: Optional[str] = None
    key_specs: List[str] = Field(default_factory=list)
    confidence_notes: str = "Extracted via semantic requirement parser"

class SearchResponse(BaseModel):
    search_id: str
    query: str
    interpretation: QueryInterpretationSchema
    top_recommendations: List[RankedRecommendation] = Field(default_factory=list) # up to 3 per spec
    all_results: List[ProductSchema] = Field(default_factory=list)
    total_found: int
    created_at: str
