export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'SGD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromUSD: number; // 1 USD = X Currency
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateFromUSD: 1.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateFromUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateFromUSD: 0.79 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateFromUSD: 83.5 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateFromUSD: 1.35 },
};

/**
 * Converts a base USD amount to the target currency and formats it.
 */
export function formatCurrencyAmount(
  amountInUSD: number | undefined | null,
  targetCurrency: CurrencyCode = 'USD'
): string {
  if (amountInUSD === undefined || amountInUSD === null || isNaN(amountInUSD)) {
    return '$0';
  }
  const config = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.USD;
  const converted = amountInUSD * config.rateFromUSD;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: config.code,
    maximumFractionDigits: 0,
  }).format(converted);
}

/**
 * Suggests default currency for a country.
 */
export function getDefaultCurrencyForCountry(country: string): CurrencyCode {
  const norm = country.toLowerCase();
  if (norm.includes('united kingdom') || norm.includes('uk') || norm.includes('britain')) return 'GBP';
  if (norm.includes('germany') || norm.includes('france') || norm.includes('europe')) return 'EUR';
  if (norm.includes('india')) return 'INR';
  if (norm.includes('singapore')) return 'SGD';
  return 'USD';
}
