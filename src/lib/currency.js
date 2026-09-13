import { useState, useEffect } from 'react';

// Static conversion rates from IDR
const EXCHANGE_RATES = {
  IDR: 1,
  USD: 1 / 15500,
  EUR: 1 / 16800,
  AUD: 1 / 10200,
  GBP: 1 / 19500
};

const CURRENCY_SYMBOLS = {
  IDR: 'IDR',
  USD: '$',
  EUR: '€',
  AUD: 'A$',
  GBP: '£'
};

export function useCurrency() {
  const [currency, setCurrency] = useState('IDR');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('balance_island_currency');
      if (savedCurrency && EXCHANGE_RATES[savedCurrency]) {
        setCurrency(savedCurrency);
      }

      const handleCurrencyChange = (e) => {
        if (EXCHANGE_RATES[e.detail]) {
          setCurrency(e.detail);
        }
      };

      window.addEventListener('currencyChanged', handleCurrencyChange);
      return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
    }
  }, []);

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return '';
    const rate = EXCHANGE_RATES[currency] || 1;
    const symbol = CURRENCY_SYMBOLS[currency] || 'IDR';
    
    // Clean amount (remove non-numeric chars if it's a formatted string)
    const cleanAmount = typeof amount === 'string' ? Number(amount.replace(/[^0-9.-]+/g, "")) : Number(amount);
    
    if (isNaN(cleanAmount) || cleanAmount === 0) return `${symbol} 0`;

    const converted = cleanAmount * rate;
    
    if (currency === 'IDR') {
      // User specifically requested IDR 650,000 (comma separated)
      return `IDR ${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    } else {
      return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  return { currency, formatPrice };
}
