import re
from typing import Optional, List
from app.schemas.search import QueryInterpretationSchema
from app.config import settings

def parse_natural_language_query(query: str) -> QueryInterpretationSchema:
    normalized = query.lower().strip()

    # 1. Detect Category
    category: Optional[str] = None
    category_label: Optional[str] = None

    if re.search(r"(laptop|notebook|macbook|ultrabook|pc)", normalized):
        category = "laptop"
        category_label = "Laptops & Ultrabooks"
    elif re.search(r"(phone|smartphone|mobile|android|iphone|pixel|galaxy)", normalized):
        category = "smartphone"
        category_label = "Smartphones & Mobiles"
    elif re.search(r"(headphone|earphone|audio|earbuds|anc|sound|tws)", normalized):
        category = "headphones"
        category_label = "Headphones & Audio"
    elif re.search(r"(monitor|screen|display|panel)", normalized):
        category = "monitor"
        category_label = "Monitors & Displays"
    elif re.search(r"(kurta|kurti|ethnic|sherwani|dhoti|pajama|saree|lehenga|nehru jacket)", normalized):
        category = "ethnic-wear"
        category_label = "Men's & Ethnic Fashion"
    elif re.search(r"(shoe|sneaker|footwear|running|loafer|boots|slides|crocs)", normalized):
        category = "footwear"
        category_label = "Footwear & Shoes"
    elif re.search(r"(watch|smartwatch|chronograph|timepiece|fitness band)", normalized):
        category = "smartwatch"
        category_label = "Watches & Wearables"
    elif re.search(r"(shirt|t-shirt|jeans|clothing|apparel|dress)", normalized):
        category = "fashion"
        category_label = "Fashion & Apparel"

    # 2. Detect Budget Constraint (e.g., "under 60,000", "under ₹60000", "below 15k")
    budget_limit: Optional[float] = None
    budget_label: Optional[str] = None

    budget_patterns = [
        r"(?:under|below|less than|within|up to|budget of|max)\s*(?:rs\.?|inr|₹)?\s*(\d{1,3}(?:,\d{3})+|\d+)(?:\s*(k|thousand|lakh))?",
        r"(?:rs\.?|inr|₹)\s*(\d{1,3}(?:,\d{3})+|\d+)\s*(?:budget|or less|max)?",
        r"(\d+)\s*k\s*(?:budget|laptop|phone|monitor|headphones)?",
    ]

    for pat in budget_patterns:
        m = re.search(pat, normalized)
        if m:
            raw_val = m.group(1).replace(",", "")
            num = float(raw_val)
            suffix = m.group(2).lower() if m.lastindex and m.lastindex >= 2 and m.group(2) else None

            if suffix == "k" or (not suffix and 5 < num < 1000):
                num = num * 1000
            elif suffix == "lakh":
                num = num * 100000

            if num > 1000:
                budget_limit = num
                budget_label = f"Up to ₹{int(num):,}"
                break

    # 3. Detect Purpose / Use Case
    purpose: Optional[str] = None
    if re.search(r"(coding|programming|developer|software|compile|vscode|python)", normalized):
        purpose = "Software Development & Programming"
    elif re.search(r"(gaming|gamer|rtx|fps|games)", normalized):
        purpose = "Gaming & High Performance"
    elif re.search(r"(camera|photography|photos|portrait|video|selfie)", normalized):
        purpose = "Photography & Content Creation"
    elif re.search(r"(student|college|school|study|office|work)", normalized):
        purpose = "College, Productivity & Daily Work"
    elif re.search(r"(travel|commute|flight|noise|silence)", normalized):
        purpose = "Commuting & Travel (Focus Mode)"

    # 4. Detect Key Specs
    key_specs: List[str] = []
    ram_m = re.search(r"(\d{1,2})\s*(?:gb)?\s*ram", normalized) or re.search(r"(\d{1,2})gb", normalized)
    if ram_m and int(ram_m.group(1)) >= 8:
        key_specs.append(f"{ram_m.group(1)}GB RAM")

    if re.search(r"(battery|long battery|endurance|battery life)", normalized):
        key_specs.append("Long Battery Life")
    if "oled" in normalized:
        key_specs.append("OLED Display")
    if "4k" in normalized or "uhd" in normalized:
        key_specs.append("4K UHD Resolution")
    if re.search(r"(120hz|144hz|165hz|high refresh)", normalized):
        key_specs.append("High Refresh Rate")
    if re.search(r"(pivot|vertical)", normalized):
        key_specs.append("90° Vertical Pivot Stand")
    if re.search(r"(anc|noise cancel)", normalized):
        key_specs.append("Active Noise Cancellation")

    return QueryInterpretationSchema(
        original_query=query,
        category=category,
        category_label=category_label,
        budget_limit=budget_limit,
        budget_label=budget_label,
        purpose=purpose,
        key_specs=key_specs,
        confidence_notes="Extracted via semantic requirement parser"
    )
