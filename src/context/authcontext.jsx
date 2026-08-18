import { createContext, useContext, useState, useEffect } from 'react';
import  authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await authService.getMe();
        if (data?.authenticated !== false && (data?.user || data?.username || data?.id || data?.authenticated)) {
          setUser(data.user || data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    await authService.login(credentials);
    try {
      const data = await authService.getMe();
      setUser(data.user || data);
    } catch {
      setUser({ username: credentials.username });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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