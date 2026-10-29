export function normalizeProduct(p) {
  if (!p) return null;
  const id = p.product_id || p.id;
  const priceVal = typeof p.price === 'object' && p.price !== null ? p.price.amount : p.price;
  const originalPriceVal = typeof p.price === 'object' && p.price !== null ? p.price.original_amount : p.originalPrice;

  let marketplace = { name: '', logo_url: '' };
  if (p.marketplace) {
    if (typeof p.marketplace === 'object') {
      marketplace = {
        name: p.marketplace.name || '',
        logo_url: p.marketplace.logo_url || '',
      };
    } else if (typeof p.marketplace === 'string') {
      const lower = p.marketplace.toLowerCase();
      marketplace = {
        name: p.marketplace,
        logo_url: lower.includes('flipkart')
          ? 'https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg'
          : lower.includes('meesho')
          ? 'https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.png'
          : lower.includes('amazon')
          ? 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
          : '',
      };
    }
  }

  return {
    id: id || `prod-${Math.random().toString(36).slice(2, 8)}`,
    name: p.name || 'Unnamed Product',
    brand: p.brand || '',
    category: p.category || 'general',
    price: typeof priceVal === 'number' ? priceVal : 0,
    originalPrice: originalPriceVal,
    rating: Number.isFinite(Number(p.rating)) ? Number(p.rating) : 0,
    reviewCount: p.rating_count || p.reviewCount || 0,
    image: p.image_url || p.image || '',
    fallbackImage: p.fallbackImage,
    description: p.description || '',
    marketplace,
    merchantUrl: p.merchant_url || p.merchantUrl || '',
    shoppingUrl: p.shopping_url || p.shoppingUrl || '',
    productUrl: p.merchant_url || p.merchantUrl || p.product_url || p.productUrl || '',
    specifications: p.specifications || {},
    features: p.features || [],
    pros: p.pros || [],
    cons: p.cons || [],
    inStock: p.in_stock !== undefined ? p.in_stock : p.inStock,
    source: p.source || '',
    tags: p.tags || [],
  };
}
