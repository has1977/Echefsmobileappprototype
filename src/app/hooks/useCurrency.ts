import { useState, useEffect } from 'react';
import { db } from '../lib/database';

/**
 * Currency configuration interface
 */
export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag?: string;
}

/**
 * Hook to get the current loyalty currency settings
 * This hook listens for changes in the system settings and returns
 * the currently configured loyalty currency
 */
export function useLoyaltyCurrency(): CurrencyConfig {
  const [currency, setCurrency] = useState<CurrencyConfig>(() => {
    const settings = db.getSettings();
    return {
      code: settings.loyalty.currency,
      symbol: settings.loyalty.currencySymbol,
      name: settings.loyalty.currency,
    };
  });

  useEffect(() => {
    // Set up an interval to check for currency changes
    // This ensures the hook updates when settings change
    const interval = setInterval(() => {
      const settings = db.getSettings();
      const newCurrency = {
        code: settings.loyalty.currency,
        symbol: settings.loyalty.currencySymbol,
        name: settings.loyalty.currency,
      };
      
      if (newCurrency.code !== currency.code || newCurrency.symbol !== currency.symbol) {
        setCurrency(newCurrency);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currency]);

  return currency;
}

/**
 * Hook to get the current amount per point earning rate
 */
export function useEarningRate(): number {
  const [rate, setRate] = useState<number>(() => {
    const settings = db.getSettings();
    return settings.loyalty.amountPerPoint;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const settings = db.getSettings();
      const newRate = settings.loyalty.amountPerPoint;
      
      if (newRate !== rate) {
        setRate(newRate);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [rate]);

  return rate;
}

/**
 * Hook to get the main store currency (different from loyalty currency)
 */
export function useStoreCurrency(): CurrencyConfig {
  const [currency, setCurrency] = useState<CurrencyConfig>(() => {
    const settings = db.getSettings();
    return {
      code: settings.currency.code,
      symbol: settings.currency.symbol,
      name: settings.currency.code,
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const settings = db.getSettings();
      const newCurrency = {
        code: settings.currency.code,
        symbol: settings.currency.symbol,
        name: settings.currency.code,
      };
      
      if (newCurrency.code !== currency.code || newCurrency.symbol !== currency.symbol) {
        setCurrency(newCurrency);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currency]);

  return currency;
}

/**
 * Get all currency information including available currencies
 */
export function getAllCurrencies(): CurrencyConfig[] {
  return [
    { code: 'KGS', name: 'Kyrgyzstan Som', symbol: 'с', flag: '🇰🇬' },
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
    { code: 'KZT', name: 'Kazakhstan Tenge', symbol: '₸', flag: '🇰🇿' },
    { code: 'UZS', name: 'Uzbekistan Som', symbol: 'soʻm', flag: '🇺🇿' },
  ];
}

/**
 * Hook to get and set user's preferred display currency
 * This is for display purposes only - actual transactions use store currency
 */
export function useDisplayCurrency(): {
  displayCurrency: CurrencyConfig;
  setDisplayCurrency: (currency: CurrencyConfig) => void;
  isCustomCurrency: boolean;
} {
  const storeCurrency = useStoreCurrency();
  
  const [displayCurrency, setDisplayCurrencyState] = useState<CurrencyConfig>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('echefs_displayCurrency');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return storeCurrency;
      }
    }
    return storeCurrency;
  });

  // Update display currency if store currency changes and user hasn't set a preference
  useEffect(() => {
    const saved = localStorage.getItem('echefs_displayCurrency');
    if (!saved) {
      setDisplayCurrencyState(storeCurrency);
    }
  }, [storeCurrency]);

  const setDisplayCurrency = (currency: CurrencyConfig) => {
    setDisplayCurrencyState(currency);
    localStorage.setItem('echefs_displayCurrency', JSON.stringify(currency));
  };

  const isCustomCurrency = displayCurrency.code !== storeCurrency.code;

  return {
    displayCurrency,
    setDisplayCurrency,
    isCustomCurrency,
  };
}