import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const { data } = await api.get('/users/profile');
          setUser(data);
        } catch (error) {
          localStorage.removeItem('userToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('userToken', data.token);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/users', userData);
    localStorage.setItem('userToken', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
