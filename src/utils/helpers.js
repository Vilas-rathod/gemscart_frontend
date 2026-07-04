export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const calculateDiscount = (original, current) =>
  Math.round(((original - current) / original) * 100);

export const truncate = (str, n) =>
  str.length > n ? str.substring(0, n - 1) + '…' : str;

// Estimated delivery window (default 5–7 days out), returned as a readable range.
export const getEstimatedDelivery = (minDays = 5, maxDays = 7) => {
  const fmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const start = new Date();
  start.setDate(start.getDate() + minDays);
  const end = new Date();
  end.setDate(end.getDate() + maxDays);
  return { start, end, label: `${fmt.format(start)} – ${fmt.format(end)}` };
};
