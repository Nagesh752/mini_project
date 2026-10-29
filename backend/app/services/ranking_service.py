from typing import List, Tuple, Dict, Any, Optional
from app.schemas.product import ProductSchema, RankedRecommendation
from app.schemas.search import QueryInterpretationSchema

def rank_products_for_query(
    products: List[ProductSchema],
    interpretation: QueryInterpretationSchema
) -> Tuple[List[RankedRecommendation], List[RankedRecommendation]]:
    """
    Ranks products based on multi-factor evidence criteria:
    1. Requirement Match (35 pts)
    2. Budget Suitability (25 pts)
    3. Specifications Match (20 pts)
    4. User Rating (10 pts)
    5. Value for Money (10 pts)
    Returns: (top_recommendations, other_compared)
    """
    ranked_list: List[RankedRecommendation] = []

    for product in products:
        tags_lower = [t.lower() for t in product.tags]
        specs_str = " ".join([str(v) for v in product.specifications.values()]).lower()
        name_lower = product.name.lower()
        highlights: List[str] = []

        # 1. Requirement Match (0 - 35)
        req_score = 20
        if interpretation.category and product.category == interpretation.category:
            req_score += 5
            highlights.append(f"Direct category match: {interpretation.category_label or product.category}")

        if interpretation.purpose:
            if "Programming" in interpretation.purpose and "coding" in tags_lower:
                req_score += 5
                highlights.append("Engineered for programming & multi-threaded compiler tasks")
            elif "Photography" in interpretation.purpose and "camera" in tags_lower:
                req_score += 5
                highlights.append("Advanced camera sensor and computational photography")
            elif "Gaming" in interpretation.purpose and "gaming" in tags_lower:
                req_score += 5
                highlights.append("High refresh rate and GPU capability")

        # 2. Budget Suitability (0 - 25)
        budget_score = 18
        budget_suitability = "Budget Friendly"

        if interpretation.budget_limit:
            limit = interpretation.budget_limit
            if product.price.amount <= limit:
                ratio = product.price.amount / limit
                if ratio <= 0.8:
                    budget_score = 25
                    budget_suitability = "Well Under Budget"
                    highlights.append(f"Saves ₹{int(limit - product.price.amount):,} under budget ceiling")
                else:
                    budget_score = 24
                    budget_suitability = "Within Budget"
                    highlights.append("Optimally utilizes features within stated budget")
            else:
                excess = (product.price.amount - limit) / limit
                if excess <= 0.15:
                    budget_score = 14
                    budget_suitability = "Slightly Over Budget"
                    highlights.append("Slightly exceeds target budget, but offers premium specs")
                else:
                    budget_score = 8
                    budget_suitability = "Exceeds Budget"
                    highlights.append("Exceeds target budget; premium flagship tier")
        else:
            budget_score = 22
            budget_suitability = "Budget Friendly"

        # 3. Specifications (0 - 20)
        specs_score = 12
        if "16gb" in specs_str or "16gb" in tags_lower:
            specs_score += 4
            highlights.append("16GB RAM prevents memory bottlenecks")
        if "oled" in specs_str:
            specs_score += 3
            highlights.append("Vivid OLED panel for superior contrast")
        if "165hz" in specs_str or "120hz" in specs_str:
            specs_score += 2
            highlights.append("High refresh rate reduces visual strain")
        if "pivot" in specs_str or "pivot" in tags_lower:
            specs_score += 3
            highlights.append("90° vertical pivot stand ideal for code review")
        specs_score = min(20, specs_score)

        # 4. User Rating (0 - 10)
        rating_score = int(min(10, max(0, round((product.rating / 5.0) * 10))))
        highlights.append(f"Rated {product.rating}★ across {product.rating_count:,} verified customer reviews")

        # 5. Value for Money (0 - 10)
        value_score = 7
        value_for_money = "Good"
        if product.price.discount_percent and product.price.discount_percent >= 20:
            value_score = 10
            value_for_money = "Exceptional"
            highlights.append(f"{product.price.discount_percent}% discount provides stellar price-to-performance")

        total_score = min(100, req_score + budget_score + specs_score + rating_score + value_score)

        if budget_suitability in ["Within Budget", "Well Under Budget"]:
            reason = f"Balanced performance, strong {product.rating}★ reliability, comfortably fits at ₹{int(product.price.amount):,}."
        else:
            reason = f"High-tier specifications and durable build quality, offering elevated longevity."

        rec = RankedRecommendation(
            product=product,
            rank=0,
            score=total_score,
            is_best_match=False,
            reason=reason,
            match_highlights=highlights[:3],
            budget_suitability=budget_suitability,
            value_for_money=value_for_money,
            score_breakdown={
                "requirement_match": req_score,
                "budget_suitability": budget_score,
                "specifications": specs_score,
                "user_rating": rating_score,
                "value_score": value_score,
            }
        )
        ranked_list.append(rec)

    # Sort descending by score
    ranked_list.sort(key=lambda r: r.score, reverse=True)

    # Assign ranks
    for idx, item in enumerate(ranked_list):
        item.rank = idx + 1
        if idx == 0:
            item.is_best_match = True
            item.reason = f"Top balanced choice: Highest overall score ({item.score}/100) combining strict requirement fulfillment, budget compliance, and verified user reliability."

    # Per Section 11 & 12 of spec.md:
    # Up to 3 top recommendations
    if len(ranked_list) >= 4:
        top_recs = ranked_list[:3]
        other_compared = ranked_list[3:]
    else:
        top_recs = ranked_list
        other_compared = []

    return top_recs, other_compared
