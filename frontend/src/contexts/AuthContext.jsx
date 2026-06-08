import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
    } catch (err) {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [token, user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      console.error("Login Error:", err.response?.data?.message || err.message);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { username, email, password });
      if (res.data.token && res.data.token !== 'no_session_yet') {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, needsVerification: false };
      } else {
        // Registration successful but email confirmation required
        return { success: true, needsVerification: true };
      }
    } catch (err) {
      console.error("Register Error:", err.response?.data?.message || err.message);
      return { success: false, error: err.response?.data?.message || "Failed to register" };
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
