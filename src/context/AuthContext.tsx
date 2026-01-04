import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id?: string;
  name?: string;
  email?: string;
  slug?: string;
  role?: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
      } catch (e) {
        console.error('User parse error', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token, tenant } = res.data;

    // Determine role based on email or response
    const userWithRole: User = {
      ...tenant,
      role: email.includes('admin') || tenant.role === 'admin' ? 'admin' : 'customer'
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithRole));
    setUser(userWithRole);
    return userWithRole;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
