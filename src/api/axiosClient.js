import axios from 'axios';
import { getAuth, setAuth, clearAuth } from './authStorage';

const BASE_URL = 'http://localhost:8080/api';

const axiosClient = axios.create({ baseURL: BASE_URL });

axiosClient.interceptors.request.use((config) => {
  const auth = getAuth();
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

let refreshPromise = null;

const refreshAccessToken = async () => {
  const auth = getAuth();
  if (!auth?.refreshToken) throw new Error('No refresh token available');

  const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: auth.refreshToken });
  setAuth(response.data);
  return response.data.accessToken;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');

    // Only attempt token refresh / login-redirect for a signed-in user whose
    // token expired. Guests (no refresh token — e.g. guest COD checkout) must
    // never be bounced to /login; let the error surface to the caller instead.
    const hasSession = !!getAuth()?.refreshToken;

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint && hasSession) {
      originalRequest._retry = true;
      try {
        refreshPromise = refreshPromise || refreshAccessToken();
        const accessToken = await refreshPromise;
        refreshPromise = null;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
