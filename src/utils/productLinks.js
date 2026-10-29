function isValidUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function isRetailerProductUrl(value) {
  if (!isValidUrl(value)) return false;
  const parsed = new URL(value);
  const host = parsed.hostname.toLowerCase();
  return Boolean(parsed.pathname.replaceAll('/', ''))
    && !host.includes('serpapi.com')
    && !host.includes('google.')
    && !host.endsWith('googleusercontent.com');
}

function isGoogleShoppingProductUrl(value) {
  if (!isValidUrl(value)) return false;
  const parsed = new URL(value);
  const host = parsed.hostname.toLowerCase();
  const isGoogleHost = host === 'google.com'
    || host.endsWith('.google.com')
    || host === 'google.co.in'
    || host.endsWith('.google.co.in');
  const isProductPage = parsed.pathname.includes('/shopping/product/')
    || (parsed.pathname.replace(/\/$/, '').endsWith('/search')
      && parsed.searchParams.get('ibp') === 'oshop'
      && Boolean(parsed.searchParams.get('prds')));
  return isGoogleHost && isProductPage;
}

export function getProductDestination(product) {
  if (isRetailerProductUrl(product?.merchantUrl)) {
    return { href: product.merchantUrl, label: 'Buy from Store' };
  }
  if (isGoogleShoppingProductUrl(product?.shoppingUrl)) {
    return { href: product.shoppingUrl, label: 'View on Google Shopping' };
  }
  return { href: '', label: 'Product link unavailable' };
}
