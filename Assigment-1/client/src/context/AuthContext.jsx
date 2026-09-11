import React, { createContext, useState, useEffect } from 'react';
import { fetchUserPermissions } from '../services/api';

export const AuthContext = createContext();

export const USER_PERMISSIONS = {
  UserA: [
    { name: 'Orders', permission: ['VIEW', 'CREATE'] },
    { name: 'Billing', permission: ['VIEW'] },
  ],
  UserB: [
    { name: 'Orders', permission: ['VIEW', 'CREATE'] },
  ],
};

export const AuthProvider = ({ children }) => {
  // Read session from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const currentRole = user ? user.role : null;
  const [modules, setModules] = useState([]);

  // Login handler
  const login = async (username) => {
    const trimmed = (username || '').trim();
    const lower = trimmed.toLowerCase();

    // Strictly validate User A or User B
    const isUserA = lower === 'usera' || lower === 'user a' || lower === 'a';
    const isUserB = lower === 'userb' || lower === 'user b' || lower === 'b';

    if (!isUserA && !isUserB) {
      throw new Error('Invalid username or password');
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/login?username=${trimmed}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid username or password');
      }

      setToken(data.token);
      setUser(data.user);
      setModules(data.modules);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      if (err.message === 'Invalid username or password') {
        throw err;
      }

      // Offline fallback if server is offline
      const role = isUserB ? 'UserB' : 'UserA';
      const fallbackUser = { username: isUserB ? 'User B' : 'User A', role };
      const fallbackModules = USER_PERMISSIONS[role];
      const fallbackToken = 'token_' + Date.now();

      setToken(fallbackToken);
      setUser(fallbackUser);
      setModules(fallbackModules);

      localStorage.setItem('token', fallbackToken);
      localStorage.setItem('user', JSON.stringify(fallbackUser));

      return { success: true, user: fallbackUser };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    setModules([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Sync module permissions whenever currentRole changes
  useEffect(() => {
    if (!currentRole) {
      setModules([]);
      return;
    }

    fetchUserPermissions(currentRole)
      .then((data) => {
        if (data && data.length > 0) {
          setModules(data);
        } else {
          setModules(USER_PERMISSIONS[currentRole] || []);
        }
      })
      .catch(() => {
        setModules(USER_PERMISSIONS[currentRole] || []);
      });
  }, [currentRole]);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        isAuthenticated: !!user && !!token,
        token,
        modules,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};