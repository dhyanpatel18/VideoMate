import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE = 'http://localhost:3000/api/v1';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch current user on mount
    axios.post(`${API_BASE}/users/current-user`, {}, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (data) => {
    const res = await axios.post(`${API_BASE}/users/login`, data, { withCredentials: true });
    setUser(res.data.user);
    return res;
  };

  const register = async (data) => {
    const res = await axios.post(`${API_BASE}/users/register`, data, { withCredentials: true });
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    await axios.post(`${API_BASE}/users/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 