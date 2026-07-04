import { createContext, useContext, useState, useCallback } from 'react';
import * as authApi from '../api/authApi';
import { getAuth, setAuth, clearAuth } from '../api/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuthState] = useState(() => getAuth());

  const login = useCallback(async ({ email, password }) => {
    const data = await authApi.login({ email, password });
    setAuth(data);
    setAuthState(data);
    return data;
  }, []);

  const register = useCallback(async ({ name, email, password, phone }) => {
    const data = await authApi.register({ name, email, password, phone });
    setAuth(data);
    setAuthState(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    // Revoke the server session + record the sign-out (best-effort), then wipe the browser
    // session so the token can't be replayed from this device. Kept synchronous so existing
    // callers don't need to await it.
    const current = getAuth();
    if (current?.refreshToken) {
      authApi.logout(current.refreshToken).catch(() => { /* sign-out proceeds regardless */ });
    }
    clearAuth();
    setAuthState(null);
  }, []);

  // Merge updated fields (name/phone/role) into the stored user after a profile edit.
  const updateUser = useCallback((patch) => {
    setAuthState(prev => {
      if (!prev?.user) return prev;
      const next = { ...prev, user: { ...prev.user, ...patch } };
      setAuth(next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user: auth?.user || null, isAuthenticated: !!auth?.user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
