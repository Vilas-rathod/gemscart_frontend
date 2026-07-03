export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const calculateDiscount = (original, current) =>
  Math.round(((original - current) / original) * 100);

export const truncate = (str, n) =>
  str.length > n ? str.substring(0, n - 1) + '…' : str;
