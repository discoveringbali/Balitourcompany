"use client";
import React from 'react';
import { useCurrency } from '@/lib/currency';

export default function PriceDisplay({ amount, className = "" }) {
  const { formatPrice } = useCurrency();
  return <span className={className}>{formatPrice(amount)}</span>;
}
