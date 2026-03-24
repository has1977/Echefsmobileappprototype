import { db } from '../lib/database';
import type { CurrencyConfig } from '../hooks/useCurrency';

/**
 * Format a number as currency based on the loyalty program settings
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatLoyaltyCurrency(
  amount: number,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
  }
): string {
  const { showSymbol = true, decimals = 0 } = options || {};
  const settings = db.getSettings();
  const symbol = settings.loyalty.currencySymbol;
  
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (!showSymbol) {
    return formattedAmount;
  }

  // Some currencies like USD, EUR, GBP go before the amount
  // Others like KGS, RUB go after
  const beforeSymbols = ['$', '€', '£'];
  
  if (beforeSymbols.includes(symbol)) {
    return `${symbol}${formattedAmount}`;
  }
  
  return `${formattedAmount} ${symbol}`;
}

/**
 * Format a number as the main store currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatStoreCurrency(
  amount: number,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
  }
): string {
  const { showSymbol = true, decimals = 2 } = options || {};
  const settings = db.getSettings();
  const symbol = settings.currency.symbol;
  const position = settings.currency.position;
  
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (!showSymbol) {
    return formattedAmount;
  }

  if (position === 'before') {
    return `${symbol}${formattedAmount}`;
  }
  
  return `${formattedAmount} ${symbol}`;
}

/**
 * Calculate loyalty points earned from an amount
 * @param amount - The amount spent
 * @returns Number of points earned
 */
export function calculatePointsEarned(amount: number): number {
  const settings = db.getSettings();
  const amountPerPoint = settings.loyalty.amountPerPoint;
  return Math.floor(amount / amountPerPoint);
}

/**
 * Calculate the amount needed to earn a specific number of points
 * @param points - Target points
 * @returns Amount needed
 */
export function calculateAmountForPoints(points: number): number {
  const settings = db.getSettings();
  const amountPerPoint = settings.loyalty.amountPerPoint;
  return points * amountPerPoint;
}

/**
 * Get the current loyalty currency symbol
 * @returns Currency symbol
 */
export function getLoyaltyCurrencySymbol(): string {
  const settings = db.getSettings();
  return settings.loyalty.currencySymbol;
}

/**
 * Get the current loyalty currency code
 * @returns Currency code (e.g., 'KGS', 'USD')
 */
export function getLoyaltyCurrencyCode(): string {
  const settings = db.getSettings();
  return settings.loyalty.currency;
}

/**
 * Get the current earning rate (amount per point)
 * @returns Amount needed to earn 1 point
 */
export function getEarningRate(): number {
  const settings = db.getSettings();
  return settings.loyalty.amountPerPoint;
}

/**
 * Format currency with custom symbol or currency config
 * Supports two usage patterns:
 * 1. formatCurrency(100, '$', 'before', 2) - Manual parameters
 * 2. formatCurrency(100, currencyConfig) - Using CurrencyConfig object
 * @param amount - The amount to format
 * @param symbolOrConfig - Currency symbol string OR CurrencyConfig object
 * @param position - Symbol position ('before' | 'after') - only for manual mode
 * @param decimals - Number of decimal places
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  symbolOrConfig: string | CurrencyConfig,
  position?: 'before' | 'after',
  decimals: number = 2
): string {
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // If using CurrencyConfig object
  if (typeof symbolOrConfig === 'object') {
    const settings = db.getSettings();
    const symbol = symbolOrConfig.symbol;
    const currencyPosition = settings.currency.position;
    
    if (currencyPosition === 'before') {
      return `${symbol}${formattedAmount}`;
    }
    
    return `${formattedAmount} ${symbol}`;
  }

  // If using manual parameters
  const symbol = symbolOrConfig;
  const actualPosition = position || 'after';
  
  if (actualPosition === 'before') {
    return `${symbol}${formattedAmount}`;
  }
  
  return `${formattedAmount} ${symbol}`;
}