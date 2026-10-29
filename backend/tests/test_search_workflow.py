import unittest
from unittest.mock import patch

from fastapi import HTTPException

from app.config import settings
from app.services import ai_service, shopping_service
from app.services.product_service import get_product_by_id


class _ProviderResponse:
    status_code = 200
    is_error = False

    def __init__(self, payload):
        self.payload = payload

    def json(self):
        return self.payload


class _ProviderClient:
    response = _ProviderResponse({"shopping_results": []})
    params = None
    requested_url = None

    def __init__(self, *args, **kwargs):
        pass

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        return None

    async def get(self, url, params):
        type(self).params = params
        type(self).requested_url = url
        return self.response


class SearchWorkflowTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.previous_serpapi_key = settings.SERPAPI_KEY
        self.previous_gemini_key = settings.GEMINI_API_KEY
        settings.SERPAPI_KEY = "unit-test-key"

    def tearDown(self):
        settings.SERPAPI_KEY = self.previous_serpapi_key
        settings.GEMINI_API_KEY = self.previous_gemini_key

    async def test_normalizes_shopping_result_and_omits_google_product_link(self):
        _ProviderClient.response = _ProviderResponse({
            "shopping_results": [{
                "title": "Wireless headphones",
                "source": "Example Seller",
                "extracted_price": 2999,
                "thumbnail": "https://images.example/headphones.jpg",
                "product_id": "sku-123",
                "product_link": "https://www.google.com/shopping/product/example",
                "serpapi_product_api": "https://serpapi.com/search.json?engine=google_product&product_id=sku-123",
                "immersive_product_page_token": "example-token",
                "serpapi_immersive_product_api": "https://serpapi.com/search.json?engine=google_immersive_product&page_token=example-token",
                "rating": 4.4,
                "reviews": "1,200",
            }]
        })

        with patch.object(shopping_service.httpx, "AsyncClient", _ProviderClient):
            products = await shopping_service.search_shopping_products("wireless headphones")

        self.assertEqual(len(products), 1)
        self.assertEqual(products[0].price.amount, 2999)
        self.assertEqual(products[0].rating_count, 1200)
        self.assertEqual(products[0].merchant_url, None)
        self.assertEqual(products[0].shopping_url, "https://www.google.com/shopping/product/example")
        self.assertEqual(products[0].source, "serpapi-google-shopping")
        self.assertEqual(products[0].serpapi_product_id, "sku-123")
        self.assertEqual(products[0].serpapi_page_token, "example-token")
        self.assertEqual(get_product_by_id(products[0].product_id).name, "Wireless headphones")
        self.assertEqual(_ProviderClient.requested_url, "https://serpapi.com/search.json")
        self.assertEqual(_ProviderClient.params["engine"], "google_shopping")
        self.assertEqual(_ProviderClient.params["gl"], "in")
        self.assertEqual(_ProviderClient.params["google_domain"], "google.co.in")
        public_data = products[0].model_dump()
        self.assertNotIn("serpapi_product_id", public_data)
        self.assertNotIn("serpapi_immersive_product_api", public_data)

    async def test_offer_lookup_preserves_actual_retailer_url(self):
        product = shopping_service._normalize_item({
            "title": "Wireless headphones",
            "source": "Example Seller",
            "extracted_price": 2999,
            "product_id": "sku-456",
            "product_link": "https://www.google.com/shopping/product/example-456",
            "immersive_product_page_token": "valid-page-token",
        }, "wireless headphones", 0)
        _ProviderClient.response = _ProviderResponse({
            "product_results": {"stores": [
                {"name": "Example Seller", "link": "https://store.example/products/headphones-456"},
                {"name": "Another Seller", "link": "https://another.example/item/456"},
                {"name": "Bad API Link", "link": "https://serpapi.com/search.json?engine=google_product"},
                {"name": "Google", "link": "https://www.google.com/"},
            ]}
        })

        with patch.object(shopping_service.httpx, "AsyncClient", _ProviderClient):
            await shopping_service.enrich_products_with_merchant_urls([product])

        self.assertEqual(product.merchant_url, "https://store.example/products/headphones-456")
        self.assertEqual(product.product_url, "https://store.example/products/headphones-456")
        self.assertEqual(product.shopping_url, "https://www.google.com/shopping/product/example-456")
        self.assertEqual(_ProviderClient.params["engine"], "google_immersive_product")
        self.assertEqual(_ProviderClient.params["page_token"], "valid-page-token")
        self.assertEqual(_ProviderClient.params["more_stores"], "true")

    def test_missing_urls_remain_missing(self):
        product = shopping_service._normalize_item({
            "title": "Headphones",
            "source": "Example Seller",
            "extracted_price": 1200,
        }, "headphones", 0)
        self.assertIsNone(product.merchant_url)
        self.assertIsNone(product.shopping_url)
        self.assertEqual(product.product_url, "")

    def test_valid_retailer_url_is_preserved_and_shopping_search_fallback_is_supported(self):
        retailer = shopping_service._normalize_item({
            "title": "Headphones",
            "source": "Example Store",
            "extracted_price": 1200,
            "link": "https://store.example/products/headphones-123",
            "product_link": "https://www.google.co.in/search?ibp=oshop&prds=product-token",
        }, "headphones", 0)
        self.assertEqual(retailer.merchant_url, "https://store.example/products/headphones-123")
        self.assertEqual(retailer.shopping_url, "https://www.google.co.in/search?ibp=oshop&prds=product-token")

        homepage_only = shopping_service._normalize_item({
            "title": "Another Headphone",
            "source": "Example Store",
            "extracted_price": 1300,
            "product_link": "https://www.google.co.in/",
        }, "headphones", 1)
        self.assertIsNone(homepage_only.shopping_url)

    def test_search_response_keeps_public_destination_fields(self):
        product = shopping_service._normalize_item({
            "title": "Headphones",
            "source": "Example Seller",
            "extracted_price": 1200,
            "product_id": "sku-789",
            "product_link": "https://www.google.com/shopping/product/example-789",
        }, "headphones", 0)
        response = product.model_dump(mode="json")
        self.assertEqual(response["shopping_url"], "https://www.google.com/shopping/product/example-789")
        self.assertIsNone(response["merchant_url"])
        self.assertNotIn("serpapi_product_api", response)

    async def test_missing_shopping_key_returns_configuration_error(self):
        settings.SERPAPI_KEY = ""
        with self.assertRaises(HTTPException) as raised:
            await shopping_service.search_shopping_products("headphones")
        self.assertEqual(raised.exception.status_code, 503)

    def test_local_parser_extracts_plural_category_and_budget(self):
        query = "wireless headphones under " + chr(0x20B9) + "3000 with long battery"
        parsed = ai_service._parse_query_locally(query)
        self.assertEqual(parsed.category, "headphones")
        self.assertEqual(parsed.budget_limit, 3000)
        self.assertIn("Long Battery Life", parsed.key_specs)

    def test_gemini_json_is_validated_and_uses_search_terms(self):
        settings.GEMINI_API_KEY = "unit-test-key"
        response = _ProviderResponse({
            "candidates": [{
                "content": {"parts": [{"text": (
                    '{"category":"headphones","budget_limit":3000,'
                    '"search_query":"wireless headphones","key_specs":["ANC"]}'
                )}]}
            }]
        })
        with patch.object(ai_service.httpx, "post", return_value=response) as request:
            parsed = ai_service.parse_natural_language_query("wireless headphones")

        self.assertEqual(parsed.search_query, "wireless headphones")
        self.assertEqual(parsed.budget_limit, 3000)
        self.assertEqual(parsed.category, "headphones")
        self.assertEqual(request.call_args.kwargs["headers"]["x-goog-api-key"], "unit-test-key")


if __name__ == "__main__":
    unittest.main()
