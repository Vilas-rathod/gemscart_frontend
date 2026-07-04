import axiosClient from './axiosClient';

export const createOrder = (payload) => axiosClient.post('/orders', payload).then(r => r.data);

export const getOrders = () => axiosClient.get('/orders').then(r => r.data);

export const getOrder = (id) => axiosClient.get(`/orders/${id}`).then(r => r.data);

/* ── Seller ── */

export const getSellerOrders = () => axiosClient.get('/orders/seller/me').then(r => r.data);

export const getSellerOrderStats = () => axiosClient.get('/orders/seller/me/stats').then(r => r.data);

/* ── Admin ── */

export const getAllOrders = () => axiosClient.get('/orders/admin/all').then(r => r.data);

export const getAdminOrderStats = () => axiosClient.get('/orders/admin/stats').then(r => r.data);

/* ── Fulfillment (seller/admin) ── */

export const updateOrderStatus = (id, status) =>
  axiosClient.patch(`/orders/${id}/status`, { status }).then(r => r.data);
