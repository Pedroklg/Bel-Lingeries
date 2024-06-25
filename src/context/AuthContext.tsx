import React, { createContext, useContext, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { Session } from 'next-auth';

type AuthContextType = {
  user: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result && !result?.error) {
        console.log('Login successful');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const loadUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      console.log('User loaded:', response.data.user);
    } catch (error: any) {
      console.error('Failed to load user:', error.response?.status, error.response?.data);
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadUser();
    }
  }, [status]);

  return (
    <AuthContext.Provider value={{ user: session, login, logout, loadUser }}>
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