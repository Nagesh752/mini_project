import datetime
import hashlib
import logging
import re
from typing import Any
from urllib.parse import parse_qs, urlparse

import httpx
from fastapi import HTTPException

from app.config import settings
from app.schemas.product import MarketplaceInfo, ProductPrice, ProductSchema
from app.services.product_service import cache_search_products

logger = logging.getLogger("uvicorn.error")
SERPAPI_URL = "https://serpapi.com/search.json"


def _is_http_url(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def _is_direct_listing_url(value: Any) -> bool:
    if not _is_http_url(value):
        return False
    parsed = urlparse(value)
    host = (parsed.hostname or "").lower()
    has_product_path = bool(parsed.path.strip("/"))
    return (
        has_product_path
        and "serpapi.com" not in host
        and "google." not in host
        and not host.endswith("googleusercontent.com")
    )


def _is_google_shopping_url(value: Any) -> bool:
    if not _is_http_url(value):
        return False
    parsed = urlparse(value)
    host = (parsed.hostname or "").lower()
    query = parse_qs(parsed.query)
    is_google_host = host == "google.com" or host.endswith(".google.com") or host == "google.co.in" or host.endswith(".google.co.in")
    # Google regional domains may link to a product via either /shopping/product
    # or a product-specific /search URL with its product token in `prds`.
    is_product_page = "/shopping/product/" in parsed.path or (
        parsed.path.rstrip("/").endswith("/search") and bool(query.get("prds"))
    )
    return is_google_host and is_product_page


def _normalize_item(item: dict[str, Any], query: str, index: int) -> ProductSchema | None:
    title = item.get("title") or item.get("name")
    if not isinstance(title, str) or not title.strip():
        return None

    raw_price = item.get("extracted_price")
    if not isinstance(raw_price, (int, float)):
        raw_price = item.get("price")
        if isinstance(raw_price, str):
            match = re.search(r"([\d,]+(?:\.\d+)?)", raw_price)
            if not match:
                return None
            raw_price = float(match.group(1).replace(",", ""))
    try:
        amount = float(raw_price)
    except (TypeError, ValueError):
        return None
    if amount <= 0:
        return None

    seller = item.get("source") or item.get("merchant") or item.get("seller") or ""
    if not isinstance(seller, str):
        seller = ""
    # Google Shopping India data is requested below, so extracted amounts are INR.
    image = item.get("thumbnail") or item.get("image") or ""
    link = item.get("link") or ""
    direct_link = link if _is_direct_listing_url(link) else ""
    shopping_link = item.get("product_link") or ""
    shopping_link = shopping_link if _is_google_shopping_url(shopping_link) else ""
    stable_key = direct_link or f"{title.strip().lower()}|{seller.strip().lower()}"
    canonical = stable_key.lower()
    product_id = "shopping-" + hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:16]
    rating = item.get("rating")
    rating_count = item.get("reviews") or item.get("rating_count") or 0
    try:
        rating = float(rating) if rating is not None else 0.0
        if not 0 <= rating <= 5:
            rating = 0.0
    except (TypeError, ValueError):
        rating = 0.0
    try:
        rating_count = int(str(rating_count).replace(",", ""))
    except (TypeError, ValueError):
        rating_count = 0

    return ProductSchema(
        product_id=product_id,
        name=title.strip(),
        brand="",
        category="general",
        image_url=image if _is_http_url(image) else "",
        price=ProductPrice(amount=amount, currency="INR"),
        rating=rating,
        rating_count=max(0, rating_count),
        description="",
        marketplace=MarketplaceInfo(name=seller or "Google Shopping"),
        product_url=direct_link,
        merchant_url=direct_link or None,
        shopping_url=shopping_link or None,
        serpapi_product_id=str(item["product_id"]) if item.get("product_id") else None,
        serpapi_page_token=item.get("immersive_product_page_token") or None,
        serpapi_product_api=item.get("serpapi_product_api") or None,
        serpapi_immersive_product_api=item.get("serpapi_immersive_product_api") or None,
        specifications={},
        source="serpapi-google-shopping",
        retrieved_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        tags=[query],
    )


async def search_shopping_products(query: str) -> list[ProductSchema]:
    if not settings.SERPAPI_KEY:
        logger.error("SerpApi is not configured")
        raise HTTPException(status_code=503, detail="Product search is not configured. Add SERPAPI_KEY to backend/.env and restart the backend.")

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.get(
                SERPAPI_URL,
                params={
                    "api_key": settings.SERPAPI_KEY,
                    "engine": "google_shopping",
                    "q": query,
                    "google_domain": "google.co.in",
                    "gl": "in",
                    "hl": "en",
                },
            )
    except httpx.TimeoutException:
        logger.warning("SerpApi Google Shopping request timed out")
        raise HTTPException(status_code=504, detail="Product search timed out. Please try again.") from None
    except httpx.RequestError as exc:
        logger.error("SerpApi Google Shopping request failed (%s)", type(exc).__name__)
        raise HTTPException(status_code=502, detail="Product search provider is temporarily unavailable.") from None

    if response.is_error:
        logger.error("SerpApi Google Shopping returned HTTP %s", response.status_code)
        status_code = 429 if response.status_code == 429 else 502
        raise HTTPException(status_code=status_code, detail="Product search provider rejected the request. Check its API configuration or quota.")
    try:
        payload = response.json()
    except ValueError:
        logger.error("SerpApi returned a non-JSON response (HTTP %s)", response.status_code)
        raise HTTPException(status_code=502, detail="Product search provider returned an invalid response.") from None
    if not isinstance(payload, dict):
        logger.error("SerpApi response had unexpected top-level type %s", type(payload).__name__)
        raise HTTPException(status_code=502, detail="Product search provider returned an invalid response.")
    if payload.get("error"):
        logger.error("SerpApi reported an error in its JSON response")
        raise HTTPException(status_code=502, detail="Product search provider returned an error. Check its API configuration or quota.")

    raw_items = payload.get("shopping_results")
    if raw_items is None:
        raw_items = payload.get("products")
    if not isinstance(raw_items, list):
        logger.error("SerpApi response did not contain a shopping_results array")
        raise HTTPException(status_code=502, detail="Product search provider returned an incomplete response.")

    products = []
    for index, item in enumerate(raw_items):
        if isinstance(item, dict):
            normalized = _normalize_item(item, query, index)
            if normalized:
                products.append(normalized)
    if not products:
        logger.info("SerpApi returned no valid shopping products for query")
    cache_search_products(products)
    return products


def _api_lookup_from_url(value: Any) -> dict[str, str] | None:
    """Extract only supported lookup parameters from a SerpApi product API link."""
    if not _is_http_url(value):
        return None
    parsed = urlparse(value)
    if parsed.hostname != "serpapi.com" or not parsed.path.startswith("/search"):
        return None
    query = parse_qs(parsed.query)
    engine = query.get("engine", [""])[0]
    if engine not in {"google_product", "google_immersive_product"}:
        return None
    lookup = {"engine": engine}
    for key in ("product_id", "page_token"):
        if query.get(key):
            lookup[key] = query[key][0]
    if (lookup.get("engine") == "google_product" and not (lookup.get("product_id") or lookup.get("page_token"))) or (
        lookup.get("engine") == "google_immersive_product" and not lookup.get("page_token")
    ):
        return None
    return lookup


def _lookup_params(product: ProductSchema) -> dict[str, str] | None:
    if product.serpapi_page_token:
        return {
            "engine": "google_immersive_product",
            "page_token": product.serpapi_page_token,
            "more_stores": "true",
        }
    for api_url in (product.serpapi_immersive_product_api, product.serpapi_product_api):
        lookup = _api_lookup_from_url(api_url)
        if lookup:
            if lookup["engine"] == "google_immersive_product":
                lookup["more_stores"] = "true"
            elif lookup["engine"] == "google_product":
                lookup["offer_view"] = "true"
            return lookup
    if product.serpapi_product_id:
        return {
            "engine": "google_product",
            "product_id": product.serpapi_product_id,
            "offer_view": "true",
        }
    return None


async def enrich_products_with_merchant_urls(products: list[ProductSchema]) -> None:
    """Resolve actual store offer URLs for the top recommendations (at most 3 lookups)."""
    candidates = [product for product in products if not product.merchant_url and _lookup_params(product)]
    candidates = candidates[:3]
    if not candidates:
        return
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            for product in candidates:
                params = _lookup_params(product)
                params.update({"api_key": settings.SERPAPI_KEY, "gl": "in", "hl": "en"})
                try:
                    response = await client.get(SERPAPI_URL, params=params)
                except httpx.RequestError as exc:
                    logger.warning("SerpApi offer lookup failed (%s)", type(exc).__name__)
                    continue
                if response.is_error:
                    logger.warning("SerpApi offer lookup returned HTTP %s", response.status_code)
                    continue
                try:
                    payload = response.json()
                except ValueError:
                    logger.warning("SerpApi offer lookup returned invalid JSON")
                    continue
                if not isinstance(payload, dict) or payload.get("error"):
                    logger.warning("SerpApi offer lookup had no usable product data")
                    continue
                product_results = payload.get("product_results")
                stores = product_results.get("stores", []) if isinstance(product_results, dict) else []
                if not isinstance(stores, list):
                    continue
                offers = [
                    store for store in stores
                    if isinstance(store, dict) and _is_direct_listing_url(store.get("link"))
                ]
                if not offers:
                    continue
                seller = (product.marketplace.name or "").strip().casefold()
                selected = next(
                    (offer for offer in offers if str(offer.get("name", "")).strip().casefold() == seller),
                    offers[0],
                )
                product.merchant_url = selected["link"]
                product.product_url = selected["link"]
                cache_search_products([product])
    except httpx.TimeoutException:
        logger.warning("SerpApi offer lookup timed out")
