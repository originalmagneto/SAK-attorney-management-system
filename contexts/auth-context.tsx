'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check both localStorage and cookies for token
    const token = localStorage.getItem('auth_token') || Cookies.get('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string) => {
    // Store token in both localStorage and cookies
    localStorage.setItem('auth_token', token);
    Cookies.set('auth_token', token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove token from both localStorage and cookies
    localStorage.removeItem('auth_token');
    Cookies.remove('auth_token');
    setIsAuthenticated(false);
    router.replace('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
