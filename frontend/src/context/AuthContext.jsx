import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const SESSION_MAX_AGE = 30 * 60 * 1000; // 30 minutes

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      const isExpired = parsedUser.loggedAt && Date.now() - parsedUser.loggedAt > SESSION_MAX_AGE;
      if (!isExpired) {
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      } else {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const API = import.meta.env.VITE_API_URL;

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
      const enriched = { ...data, loggedAt: Date.now() };
      setUser(enriched);
      localStorage.setItem('userInfo', JSON.stringify(enriched));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      // ✅ FIXED LINE ONLY
      const { data } = await axios.post(`${API}/api/auth/register`, userData);

      const enriched = { ...data, loggedAt: Date.now() };
      setUser(enriched);
      localStorage.setItem('userInfo', JSON.stringify(enriched));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (data) => {
    const enriched = { ...data, loggedAt: Date.now() };
    setUser(enriched);
    localStorage.setItem('userInfo', JSON.stringify(enriched));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};