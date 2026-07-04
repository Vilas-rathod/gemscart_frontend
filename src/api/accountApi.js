import axiosClient from './axiosClient';

export const getAccount = () => axiosClient.get('/auth/account/me').then(r => r.data);

export const updateAccount = (payload) => axiosClient.patch('/auth/account/me', payload).then(r => r.data);

export const changePassword = (payload) =>
  axiosClient.post('/auth/account/change-password', payload).then(r => r.data);
