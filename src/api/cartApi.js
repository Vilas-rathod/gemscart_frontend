import axiosClient from './axiosClient';

export const getCart = () => axiosClient.get('/cart').then(r => r.data);

export const addItem = ({ productId, size, quantity }) =>
  axiosClient.post('/cart/items', { productId, size, quantity }).then(r => r.data);

export const updateItem = (itemId, quantity) =>
  axiosClient.put(`/cart/items/${itemId}`, { quantity }).then(r => r.data);

export const removeItem = (itemId) => axiosClient.delete(`/cart/items/${itemId}`).then(r => r.data);

export const clearCart = () => axiosClient.delete('/cart').then(r => r.data);
