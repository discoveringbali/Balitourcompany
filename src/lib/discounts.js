// src/lib/discounts.js

// Default mock discounts
const DEFAULT_DISCOUNTS = [
  { code: 'WELCOME10', type: 'percent', value: 10, active: true },
  { code: 'BALI50K', type: 'fixed', value: 50000, active: true }
];

export const getDiscountCodes = () => {
  if (typeof window === 'undefined') return DEFAULT_DISCOUNTS;
  
  const saved = localStorage.getItem('balance_island_discounts');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return DEFAULT_DISCOUNTS;
    }
  }
  
  // Initialize if not present
  localStorage.setItem('balance_island_discounts', JSON.stringify(DEFAULT_DISCOUNTS));
  return DEFAULT_DISCOUNTS;
};

export const saveDiscountCodes = (codes) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('balance_island_discounts', JSON.stringify(codes));
    window.dispatchEvent(new Event('balance_island_discounts_changed'));
  }
};

export const validateDiscountCode = (code) => {
  const codes = getDiscountCodes();
  const found = codes.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
  return found || null;
};

export const calculateDiscount = (baseTotal, discount, pax = 1) => {
  if (!discount) return 0;
  
  if (discount.type === 'percent') {
    return (baseTotal * discount.value) / 100;
  } else if (discount.type === 'fixed') {
    let finalDiscount = discount.value;
    if (discount.scope === 'per_person') {
      finalDiscount = discount.value * pax;
    }
    return finalDiscount > baseTotal ? baseTotal : finalDiscount;
  }
  
  return 0;
};
