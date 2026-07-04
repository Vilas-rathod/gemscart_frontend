import axiosClient from './axiosClient';

export const getMe = () => axiosClient.get('/users/me').then(r => r.data);

export const updateMe = ({ name, phone }) =>
  axiosClient.put('/users/me', { name, phone }).then(r => r.data);

export const getAddresses = () => axiosClient.get('/users/me/addresses').then(r => r.data);

export const addAddress = (address) => axiosClient.post('/users/me/addresses', address).then(r => r.data);

export const updateAddress = (id, address) => axiosClient.put(`/users/me/addresses/${id}`, address).then(r => r.data);

export const deleteAddress = (id) => axiosClient.delete(`/users/me/addresses/${id}`).then(r => r.data);
