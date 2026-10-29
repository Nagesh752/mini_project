/**
 * Formats a numeric price into standard Indian Rupee format (e.g. ₹60,000 or ₹1,29,999)
 * @param {number} amount
 * @returns {string}
 */
export function formatINR(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates percentage discount between original price and current price
 * @param {number} [originalPrice]
 * @param {number} [currentPrice]
 * @returns {number}
 */
export function calculateDiscount(originalPrice, currentPrice) {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}
