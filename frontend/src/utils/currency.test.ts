import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  SUPPORTED_CURRENCIES, 
  formatCurrencyAmount, 
  getDefaultCurrencyForCountry 
} from './currency.ts';

describe('Currency Utility Tests', () => {
  describe('SUPPORTED_CURRENCIES Configuration', () => {
    it('should define all 5 core enterprise payroll currencies with correct exchange rates', () => {
      assert.equal(SUPPORTED_CURRENCIES.USD.rateFromUSD, 1.0);
      assert.equal(SUPPORTED_CURRENCIES.EUR.rateFromUSD, 0.92);
      assert.equal(SUPPORTED_CURRENCIES.GBP.rateFromUSD, 0.79);
      assert.equal(SUPPORTED_CURRENCIES.INR.rateFromUSD, 83.5);
      assert.equal(SUPPORTED_CURRENCIES.SGD.rateFromUSD, 1.35);

      assert.equal(SUPPORTED_CURRENCIES.USD.symbol, '$');
      assert.equal(SUPPORTED_CURRENCIES.EUR.symbol, '€');
      assert.equal(SUPPORTED_CURRENCIES.GBP.symbol, '£');
      assert.equal(SUPPORTED_CURRENCIES.INR.symbol, '₹');
      assert.equal(SUPPORTED_CURRENCIES.SGD.symbol, 'S$');
    });
  });

  describe('formatCurrencyAmount', () => {
    it('should format USD amounts correctly', () => {
      const result = formatCurrencyAmount(120000, 'USD');
      assert.equal(result.includes('120,000'), true);
      assert.equal(result.includes('$'), true);
    });

    it('should convert USD to EUR and format properly (1 USD = 0.92 EUR)', () => {
      // 100,000 USD * 0.92 = 92,000 EUR
      const result = formatCurrencyAmount(100000, 'EUR');
      assert.equal(result.includes('92,000'), true);
      assert.equal(result.includes('€'), true);
    });

    it('should convert USD to GBP and format properly (1 USD = 0.79 GBP)', () => {
      // 100,000 USD * 0.79 = 79,000 GBP
      const result = formatCurrencyAmount(100000, 'GBP');
      assert.equal(result.includes('79,000'), true);
      assert.equal(result.includes('£'), true);
    });

    it('should convert USD to INR and format properly (1 USD = 83.5 INR)', () => {
      // 100,000 USD * 83.5 = 8,350,000 INR
      const result = formatCurrencyAmount(100000, 'INR');
      assert.equal(result.includes('8,350,000'), true);
      assert.equal(result.includes('₹'), true);
    });

    it('should convert USD to SGD and format properly (1 USD = 1.35 SGD)', () => {
      // 100,000 USD * 1.35 = 135,000 SGD
      const result = formatCurrencyAmount(100000, 'SGD');
      assert.equal(result.includes('135,000'), true);
    });

    it('should safely handle zero, null, undefined, and NaN inputs', () => {
      assert.equal(formatCurrencyAmount(0, 'USD'), '$0');
      assert.equal(formatCurrencyAmount(null, 'USD'), '$0');
      assert.equal(formatCurrencyAmount(undefined, 'USD'), '$0');
      assert.equal(formatCurrencyAmount(NaN, 'USD'), '$0');
    });
  });

  describe('getDefaultCurrencyForCountry', () => {
    it('should return GBP for UK regions', () => {
      assert.equal(getDefaultCurrencyForCountry('United Kingdom'), 'GBP');
      assert.equal(getDefaultCurrencyForCountry('UK'), 'GBP');
      assert.equal(getDefaultCurrencyForCountry('Great Britain'), 'GBP');
    });

    it('should return EUR for European countries', () => {
      assert.equal(getDefaultCurrencyForCountry('Germany'), 'EUR');
      assert.equal(getDefaultCurrencyForCountry('France'), 'EUR');
      assert.equal(getDefaultCurrencyForCountry('Europe'), 'EUR');
    });

    it('should return INR for India', () => {
      assert.equal(getDefaultCurrencyForCountry('India'), 'INR');
    });

    it('should return SGD for Singapore', () => {
      assert.equal(getDefaultCurrencyForCountry('Singapore'), 'SGD');
    });

    it('should default to USD for USA and other unlisted countries', () => {
      assert.equal(getDefaultCurrencyForCountry('United States'), 'USD');
      assert.equal(getDefaultCurrencyForCountry('Canada'), 'USD');
      assert.equal(getDefaultCurrencyForCountry('Australia'), 'USD');
    });
  });
});
