import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeProduct } from './normalizeProduct.js';
import { getProductDestination } from './productLinks.js';

test('API response -> normalized product -> retailer product destination', () => {
  const apiProduct = {
    product_id: 'shopping-123',
    name: 'Wireless headphones',
    brand: '',
    category: 'general',
    image_url: 'https://images.example/headphones.jpg',
    price: { amount: 2999, currency: 'INR' },
    rating: 4.5,
    rating_count: 110,
    marketplace: { name: 'Example Store' },
    merchant_url: 'https://store.example/products/headphones-123',
    shopping_url: 'https://www.google.com/shopping/product/123',
    product_url: 'https://store.example/products/headphones-123',
    source: 'serpapi-google-shopping',
  };

  const frontendProduct = normalizeProduct(apiProduct);
  assert.deepEqual(getProductDestination(frontendProduct), {
    href: 'https://store.example/products/headphones-123',
    label: 'Buy from Store',
  });
});

test('uses the product-specific Google Shopping URL when no retailer offer exists', () => {
  const frontendProduct = normalizeProduct({
    product_id: 'shopping-456',
    name: 'Headphones',
    price: { amount: 1000 },
    merchant_url: null,
    shopping_url: 'https://www.google.com/shopping/product/456',
  });

  assert.deepEqual(getProductDestination(frontendProduct), {
    href: 'https://www.google.com/shopping/product/456',
    label: 'View on Google Shopping',
  });
});

test('shows unavailable and rejects provider API URLs when no destination exists', () => {
  const missing = normalizeProduct({ product_id: 'no-links', name: 'Headphones' });
  const providerUrl = normalizeProduct({
    product_id: 'provider-link',
    name: 'Headphones',
    merchant_url: 'https://serpapi.com/search.json?engine=google_product&product_id=1',
  });

  assert.deepEqual(getProductDestination(missing), { href: '', label: 'Product link unavailable' });
  assert.deepEqual(getProductDestination(providerUrl), { href: '', label: 'Product link unavailable' });
});
