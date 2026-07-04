import axiosClient from './axiosClient';

// Seller onboarding + self-service (auth-service).
export const applyAsSeller = (payload) => axiosClient.post('/auth/seller/apply', payload).then(r => r.data);

export const getMySeller = () => axiosClient.get('/auth/seller/me').then(r => r.data);
