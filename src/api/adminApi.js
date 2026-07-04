import axiosClient from './axiosClient';

/* ── Users ── */
export const getUsers = (role) =>
  axiosClient.get('/auth/admin/users', { params: { role } }).then(r => r.data);

export const blockUser = (id) => axiosClient.patch(`/auth/admin/users/${id}/block`).then(r => r.data);

export const unblockUser = (id) => axiosClient.patch(`/auth/admin/users/${id}/unblock`).then(r => r.data);

export const updateUserRole = (id, role) =>
  axiosClient.patch(`/auth/admin/users/${id}/role`, { role }).then(r => r.data);

/* ── Sellers ── */
export const getSellers = (status) =>
  axiosClient.get('/auth/admin/sellers', { params: { status } }).then(r => r.data);

export const approveSeller = (id) => axiosClient.post(`/auth/admin/sellers/${id}/approve`).then(r => r.data);

export const rejectSeller = (id) => axiosClient.post(`/auth/admin/sellers/${id}/reject`).then(r => r.data);

export const deactivateSeller = (id) => axiosClient.post(`/auth/admin/sellers/${id}/deactivate`).then(r => r.data);

export const activateSeller = (id) => axiosClient.post(`/auth/admin/sellers/${id}/activate`).then(r => r.data);
