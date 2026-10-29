import json
import logging
import re
from typing import Any, Optional

import httpx

from app.config import settings
from app.schemas.search import QueryInterpretationSchema

logger = logging.getLogger("uvicorn.error")
GEMINI_MODEL = "gemini-3.6-flash"


def parse_natural_language_query(query: str) -> QueryInterpretationSchema:
    """Use Gemini for query understanding when configured; otherwise use the local parser."""
    parsed = _parse_query_locally(query)
    if not settings.GEMINI_API_KEY:
        logger.info("Gemini is not configured; using local query interpretation")
        return parsed

    try:
        response = httpx.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent",
            headers={"x-goog-api-key": settings.GEMINI_API_KEY},
            json={
                "contents": [{"parts": [{"text": (
                    "Extract shopping search intent from the user query. Return only a JSON object with "
                    "category, category_label, budget_limit (number or null, INR), purpose, key_specs (array), "
                    "and search_query (concise product keywords). Do not invent product listings. Query: " + query
                )}]}],
                "generationConfig": {"responseMimeType": "application/json", "temperature": 0.1},
            },
            timeout=12.0,
        )
        if response.is_error:
            logger.warning("Gemini request failed with HTTP %s", response.status_code)
            return parsed
        payload = response.json()
        candidates = payload.get("candidates") or []
        parts = candidates[0].get("content", {}).get("parts", []) if candidates else []
        text = next((part.get("text") for part in parts if isinstance(part.get("text"), str)), None)
        if not text:
            logger.warning("Gemini returned no usable text (possibly blocked response)")
            return parsed
        data = json.loads(text)
        if not isinstance(data, dict):
            raise ValueError("Gemini response was not an object")
        category = data.get("category") if isinstance(data.get("category"), str) else parsed.category
        budget = data.get("budget_limit")
        if not isinstance(budget, (int, float)) or budget <= 0:
            budget = parsed.budget_limit
        specs = data.get("key_specs")
        if not isinstance(specs, list) or not all(isinstance(item, str) for item in specs):
            specs = parsed.key_specs
        return QueryInterpretationSchema(
            original_query=query,
            search_query=data.get("search_query") if isinstance(data.get("search_query"), str) and data.get("search_query").strip() else query,
            category=category,
            category_label=data.get("category_label") if isinstance(data.get("category_label"), str) else parsed.category_label,
            budget_limit=float(budget) if budget else None,
            budget_label=f"Up to ₹{int(budget):,}" if budget else parsed.budget_label,
            purpose=data.get("purpose") if isinstance(data.get("purpose"), str) else parsed.purpose,
            key_specs=specs,
            confidence_notes="Requirements interpreted with Gemini and validated against local parsing",
        )
    except (httpx.TimeoutException, httpx.RequestError) as exc:
        logger.warning("Gemini request failed (%s)", type(exc).__name__)
    except (ValueError, TypeError, KeyError, json.JSONDecodeError) as exc:
        logger.warning("Gemini response could not be validated (%s)", type(exc).__name__)
    return parsed


def _parse_query_locally(query: str) -> QueryInterpretationSchema:
    normalized = query.lower().strip()
    category_rules = [
        (r"\b(laptops?|notebooks?|macbooks?|ultrabooks?|pc)\b", "laptop", "Laptops & Ultrabooks"),
        (r"\b(phones?|smartphones?|mobiles?|android|iphones?|pixels?|galaxy)\b", "smartphone", "Smartphones & Mobiles"),
        (r"\b(headphones?|earphones?|audio|earbuds?|anc|sound|tws)\b", "headphones", "Headphones & Audio"),
        (r"\b(monitors?|screens?|displays?|panels?)\b", "monitor", "Monitors & Displays"),
        (r"\b(kurtas?|kurtis?|ethnic|sherwanis?|dhoti|sarees?|lehengas?)\b", "ethnic-wear", "Men's & Ethnic Fashion"),
        (r"\b(shoes?|sneakers?|footwear|running|loafers?|boots)\b", "footwear", "Footwear & Shoes"),
        (r"\b(watches|watch|smartwatch|chronograph|timepiece)\b", "smartwatch", "Watches & Wearables"),
        (r"\b(shirts?|t-shirts?|jeans|clothing|apparel|dresses?)\b", "fashion", "Fashion & Apparel"),
    ]
    category = category_label = None
    for pattern, value, label in category_rules:
        if re.search(pattern, normalized):
            category, category_label = value, label
            break

    budget = None
    patterns = [
        r"(?:under|below|less than|within|up to|budget of|max)\s*(?:rs\.?|inr|₹)?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|thousand|lakh)?\b",
        r"(?:rs\.?|inr|₹)\s*(\d[\d,]*(?:\.\d+)?)\s*(k|thousand|lakh)?\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, normalized)
        if match:
            budget = float(match.group(1).replace(",", ""))
            suffix = (match.group(2) or "").lower()
            if suffix in ("k", "thousand"):
                budget *= 1000
            elif suffix == "lakh":
                budget *= 100000
            elif budget < 1000 and budget > 5:
                budget *= 1000
            if budget <= 0:
                budget = None
            break

    purpose = None
    for pattern, value in [
        (r"coding|programming|developer|software|compile|vscode|python", "Software Development & Programming"),
        (r"gaming|gamer|rtx|fps|games", "Gaming & High Performance"),
        (r"camera|photography|photos|portrait|video|selfie", "Photography & Content Creation"),
        (r"student|college|school|study|office|work", "College, Productivity & Daily Work"),
        (r"travel|commute|flight|noise|silence", "Commuting & Travel (Focus Mode)"),
    ]:
        if re.search(pattern, normalized):
            purpose = value
            break

    specs = []
    ram = re.search(r"(\d{1,2})\s*(?:gb\s*)?ram\b", normalized)
    if ram and int(ram.group(1)) >= 8:
        specs.append(f"{ram.group(1)}GB RAM")
    for pattern, label in [
        (r"battery|endurance|playback", "Long Battery Life"),
        (r"\boled\b", "OLED Display"),
        (r"\b(?:4k|uhd)\b", "4K UHD Resolution"),
        (r"120hz|144hz|165hz|high refresh", "High Refresh Rate"),
        (r"\banc\b|noise cancel", "Active Noise Cancellation"),
    ]:
        if re.search(pattern, normalized):
            specs.append(label)
    return QueryInterpretationSchema(
        original_query=query,
        search_query=query,
        category=category,
        category_label=category_label,
        budget_limit=budget,
        budget_label=f"Up to ₹{int(budget):,}" if budget else None,
        purpose=purpose,
        key_specs=specs,
        confidence_notes="Extracted by local requirement parser",
    )
