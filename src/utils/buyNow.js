// "Order Now" (buy-now) handoff: a single product bought directly, bypassing
// the cart. Stored in sessionStorage so it survives the redirect to /checkout
// and a refresh, but is scoped to the tab/session.

const KEY = 'luxe_buynow';

export const setBuyNow = (item) => {
  try { sessionStorage.setItem(KEY, JSON.stringify({ ...item, quantity: item.quantity || 1 })); }
  catch { /* ignore storage errors */ }
};

export const getBuyNow = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY)) || null; }
  catch { return null; }
};

export const clearBuyNow = () => {
  try { sessionStorage.removeItem(KEY); }
  catch { /* ignore */ }
};
