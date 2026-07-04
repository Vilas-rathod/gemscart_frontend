const STORAGE_KEY = 'luxe_auth';

export const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
};

export const setAuth = (auth) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
};

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
};
