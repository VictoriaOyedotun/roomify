import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('roomify_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('roomify_token'));
  const [loading, setLoading] = useState(!!token);

  const login = useCallback(async (email, password) => {
    const res = await api.auth.login(email, password);
    localStorage.setItem('roomify_token', res.token);
    localStorage.setItem('roomify_user', JSON.stringify({ id: res.userId, email: res.email, displayName: res.displayName }));
    setToken(res.token);
    setUser({ id: res.userId, email: res.email, displayName: res.displayName });
    return res;
  }, []);

  const register = useCallback(async (email, password, displayName) => {
    const res = await api.auth.register(email, password, displayName);
    localStorage.setItem('roomify_token', res.token);
    localStorage.setItem('roomify_user', JSON.stringify({ id: res.userId, email: res.email, displayName: res.displayName }));
    setToken(res.token);
    setUser({ id: res.userId, email: res.email, displayName: res.displayName });
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('roomify_token');
    localStorage.removeItem('roomify_user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api.users.getMe()
      .then((me) => {
        setUser({ id: me.id, email: me.email, displayName: me.displayName });
        localStorage.setItem('roomify_user', JSON.stringify({ id: me.id, email: me.email, displayName: me.displayName }));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token, logout]);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('roomify-unauthorized', onUnauthorized);
    return () => window.removeEventListener('roomify-unauthorized', onUnauthorized);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
