'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean | null;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const setAuthenticated = (value: boolean) => {
    setIsAuthenticated(value);
  };

  if (isAuthenticated === null) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
