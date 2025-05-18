import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, login as loginService, logout as logoutService, saveUser } from '../services/localStorageService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (username: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setError(null);
      const loggedInUser = loginService(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        return loggedInUser;
      } else {
        setError('Invalid email or password');
        return null;
      }
    } catch (err) {
      setError('An error occurred during login');
      return null;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<User | null> => {
    try {
      setError(null);
      // In a real app, you'd validate the input and check if user already exists
      const newUser = saveUser({ username, email, password });
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (err) {
      setError('An error occurred during signup');
      return null;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};