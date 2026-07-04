import axiosClient from './axiosClient';

export const getProducts = ({ category, minPrice, maxPrice, isNew, sort, page = 0, size = 8 } = {}) =>
  axiosClient
    .get('/products', { params: { category, minPrice, maxPrice, isNew, sort, page, size } })
    .then(r => r.data);

export const getProductBySlug = (slug) => axiosClient.get(`/products/${slug}`).then(r => r.data);

export const getProductById = (id) => axiosClient.get(`/products/id/${id}`).then(r => r.data);

export const getRelatedProducts = (slug, limit = 4) =>
  axiosClient.get(`/products/${slug}/related`, { params: { limit } }).then(r => r.data);

export const getCategories = () => axiosClient.get('/categories').then(r => r.data);

/* ── Seller / Admin product management ── */

export const createProduct = (payload) => axiosClient.post('/products', payload).then(r => r.data);

export const updateProduct = (id, payload) => axiosClient.put(`/products/${id}`, payload).then(r => r.data);

export const deleteProduct = (id) => axiosClient.delete(`/products/${id}`).then(r => r.data);

export const setProductStock = (id, inStock) =>
  axiosClient.patch(`/products/${id}/stock`, { inStock }).then(r => r.data);

export const getMyProducts = () => axiosClient.get('/products/seller/me').then(r => r.data);

export const getMyProductStats = () => axiosClient.get('/products/seller/me/stats').then(r => r.data);

export const getAllProducts = () => axiosClient.get('/products/admin/all').then(r => r.data);

// Multipart image upload → returns { url }. Requires Cloudinary keys on the backend.
export const uploadProductImage = (file) => {
  const form = new FormData();
  form.append('file', file);
  return axiosClient
    .post('/products/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(r => r.data);
};
