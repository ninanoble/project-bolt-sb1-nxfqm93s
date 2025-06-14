import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, subscriptionApi } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'none' | 'free' | 'premium';
  newsletterSubscribed: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, subscribeNewsletter: boolean) => Promise<void>;
  logout: () => void;
  updateSubscription: (plan: 'free' | 'premium') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        subscription: response.user.subscription,
        newsletterSubscribed: response.user.newsletterSubscribed
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, subscribeNewsletter: boolean) => {
    try {
      const response = await authApi.signup(email, password, name, subscribeNewsletter);
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        subscription: response.user.subscription,
        newsletterSubscribed: response.user.newsletterSubscribed
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.token);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateSubscription = async (plan: 'free' | 'premium') => {
    try {
      await subscriptionApi.updateSubscription(plan);
      if (user) {
        const updatedUser = { ...user, subscription: plan };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update subscription error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 