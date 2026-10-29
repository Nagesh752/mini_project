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
                "product_link": "https://www.google.com/shopping/product/example",
                "rating": 4.4,
                "reviews": "1,200",
            }]
        })

        with patch.object(shopping_service.httpx, "AsyncClient", _ProviderClient):
            products = await shopping_service.search_shopping_products("wireless headphones")

        self.assertEqual(len(products), 1)
        self.assertEqual(products[0].price.amount, 2999)
        self.assertEqual(products[0].rating_count, 1200)
        self.assertEqual(products[0].product_url, "")
        self.assertEqual(products[0].source, "serpapi-google-shopping")
        self.assertEqual(get_product_by_id(products[0].product_id).name, "Wireless headphones")
        self.assertEqual(_ProviderClient.requested_url, "https://serpapi.com/search.json")
        self.assertEqual(_ProviderClient.params["engine"], "google_shopping")
        self.assertEqual(_ProviderClient.params["gl"], "in")
        self.assertEqual(_ProviderClient.params["google_domain"], "google.co.in")

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
