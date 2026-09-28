import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Remove any old offline session
    localStorage.removeItem('offlineUser');
    if (token && String(token).startsWith('offline-')) {
      localStorage.removeItem('token');
      setLoading(false);
      return;
    }
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api
        .get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.removeItem('offlineUser');
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.code === 'ERR_NETWORK' || !err?.response
          ? 'Server offline or no internet. Please check backend connection and try again.'
          : 'Invalid email or password');
      const e = new Error(msg);
      e.response = { data: { message: msg } };
      throw e;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone });
      localStorage.setItem('token', data.token);
      localStorage.removeItem('offlineUser');
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.code === 'ERR_NETWORK' || !err?.response
          ? 'Server offline or no internet. Registration requires backend.'
          : 'Registration failed');
      const e = new Error(msg);
      e.response = { data: { message: msg } };
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('offlineUser');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
