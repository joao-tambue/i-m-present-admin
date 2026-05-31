'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Coordinator {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface AuthContextType {
  coordinator: Coordinator | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [coordinator, setCoordinator] = useState<Coordinator | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email && password) {
        setCoordinator({
          id: '1',
          name: 'João Coordenador',
          email: email,
          department: 'Administração',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCoordinator(null);
  };

  return (
    <AuthContext.Provider
      value={{
        coordinator,
        isLoading,
        login,
        logout,
        isAuthenticated: coordinator !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
