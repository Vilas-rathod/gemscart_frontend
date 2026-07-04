import axiosClient from './axiosClient';

export const register = ({ name, email, password, phone }) =>
  axiosClient.post('/auth/register', { name, email, password, phone }).then(r => r.data);

export const login = ({ email, password }) =>
  axiosClient.post('/auth/login', { email, password }).then(r => r.data);

// Revokes the refresh token server-side and records the sign-out. Best-effort: the caller
// clears the browser session regardless of whether this round-trip succeeds.
export const logout = (refreshToken) =>
  axiosClient.post('/auth/logout', { refreshToken }).then(r => r.data);
