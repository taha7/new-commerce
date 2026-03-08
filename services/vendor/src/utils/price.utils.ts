/**
 * Price Utilities
 * 
 * Prices are stored as integers in the database (in cents/pence).
 * Example: 100 = £1.00, 1999 = £19.99
 */

/**
 * Format price from cents to currency string
 * @param priceInCents - Price in cents (e.g., 1999)
 * @param currency - Currency code (default: 'GBP')
 * @param locale - Locale for formatting (default: 'en-GB')
 * @returns Formatted price string (e.g., '£19.99')
 */
export function formatPrice(
  priceInCents: number,
  currency: string = 'GBP',
  locale: string = 'en-GB',
): string {
  const priceInUnits = priceInCents / 100;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(priceInUnits);
}

/**
 * Convert price from pounds to cents
 * @param priceInPounds - Price in pounds (e.g., 19.99)
 * @returns Price in cents (e.g., 1999)
 */
export function poundsToCents(priceInPounds: number): number {
  return Math.round(priceInPounds * 100);
}

/**
 * Convert price from cents to pounds
 * @param priceInCents - Price in cents (e.g., 1999)
 * @returns Price in pounds (e.g., 19.99)
 */
export function centsToPounds(priceInCents: number): number {
  return priceInCents / 100;
}

/**
 * Format price range
 * @param minPrice - Minimum price in cents
 * @param maxPrice - Maximum price in cents
 * @param currency - Currency code (default: 'GBP')
 * @param locale - Locale for formatting (default: 'en-GB')
 * @returns Formatted price range (e.g., '£10.00 - £50.00')
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  currency: string = 'GBP',
  locale: string = 'en-GB',
): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency, locale);
  }
  
  return `${formatPrice(minPrice, currency, locale)} - ${formatPrice(maxPrice, currency, locale)}`;
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price in cents
 * @param salePrice - Sale price in cents
 * @returns Discount percentage (e.g., 25 for 25% off)
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Format discount
 * @param originalPrice - Original price in cents
 * @param salePrice - Sale price in cents
 * @returns Formatted discount string (e.g., '25% off')
 */
export function formatDiscount(originalPrice: number, salePrice: number): string {
  const discount = calculateDiscount(originalPrice, salePrice);
  return discount > 0 ? `${discount}% off` : '';
}
