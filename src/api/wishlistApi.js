import axiosClient from './axiosClient';

export const getWishlist = () => axiosClient.get('/wishlist').then(r => r.data);

export const addItem = (productId) => axiosClient.post(`/wishlist/${productId}`).then(r => r.data);

export const removeItem = (productId) => axiosClient.delete(`/wishlist/${productId}`).then(r => r.data);
