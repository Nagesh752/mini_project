import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../services/api';

const USER_STORAGE_KEY = 'ai_shop_mock_user_session';
const TOKEN_STORAGE_KEY = 'ai_shop_auth_token';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync auth state', e);
    }
  }, [user, token]);

  const login = async (email, password = 'DemoPassword123!', name) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const res = await loginApi(email, password);
    if (res.success && res.user) {
      const displayName = name || res.user.name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const loggedUser = {
        id: res.user.id || `usr_${Date.now()}`,
        name: displayName,
        email: email.toLowerCase().trim(),
        joinedDate: res.user.joinedDate || 'Joined recently',
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=2563eb&textColor=ffffff`,
      };
      setUser(loggedUser);
      setToken(res.token || 'demo-token');
      return { success: true };
    }

    return { success: false, error: res.error || 'Login failed' };
  };

  const signup = async (name, email, password = 'DemoPassword123!') => {
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Please provide your full name (at least 2 characters).' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const res = await registerApi(name.trim(), email.toLowerCase().trim(), password);
    if (res.success && res.user) {
      const newUser = {
        id: res.user.id || `usr_${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=2563eb&textColor=ffffff`,
      };
      setUser(newUser);
      setToken(res.token || 'demo-token');
      return { success: true };
    }

    return { success: false, error: res.error || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
