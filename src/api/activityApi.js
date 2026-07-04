import axiosClient from './axiosClient';
import { getAuth } from './authStorage';

// Tracked customer actions — must match the backend ActivityAction constants.
export const ACTIVITY = {
  PRODUCT_VIEW: 'PRODUCT_VIEW',
  WISHLIST_ADD: 'WISHLIST_ADD',
  CART_ADD: 'CART_ADD',
  CHECKOUT: 'CHECKOUT',
};

/**
 * Best-effort activity logging for the signed-in customer. Fire-and-forget: it never throws
 * and never blocks the user flow, and it no-ops for guests (nothing to attribute the event to).
 */
export const track = (action, detail) => {
  if (!getAuth()?.accessToken) return;
  axiosClient.post('/auth/activity', { action, detail: detail ? String(detail).slice(0, 255) : null })
    .catch(() => { /* activity tracking must never disrupt the customer */ });
};

export const getMyActivity = () => axiosClient.get('/auth/activity/me').then(r => r.data);
