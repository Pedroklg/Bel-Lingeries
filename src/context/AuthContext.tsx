import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { Snackbar, SnackbarContent } from '@mui/material';
import { Session } from 'next-auth';

type AuthContextType = {
  user: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
};

const getSessionFromLocalStorage = (): Session | null => {
  const session = localStorage.getItem('session');
  if (session) {
    return JSON.parse(session);
  }
  return null;
};

const isSessionExpired = (session: Session): boolean => {
  const now = new Date();
  const expirationTime = new Date(session.expires);
  return now > expirationTime;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [toastOpen, setToastOpen] = useState(false);
  const [message, setMessage] = useState('');

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result && !result?.error) {
        console.log('Login successful');
        if (result?.error) {
          throw new Error(result.error);
        }
        localStorage.setItem('session', JSON.stringify(result));
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
      const session = getSessionFromLocalStorage();
      if (session && session.user.accessToken) {
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });
        console.log('User:', response.data);
      } else {
        throw new Error('No valid session found');
      }
    } catch (error: any) {
      console.error('Failed to load user:', error.response?.status, error.response?.data);
      if (error.response?.status === 401) {
        setToastOpen(true);
        setMessage('Unauthorized. Please log in again.');
        await logout();
      }
    }
  };

  const logout = async () => {
    try {
      await signOut();
      localStorage.removeItem('session');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  useEffect(() => {
    const session = getSessionFromLocalStorage();
    if (session && isSessionExpired(session)) {
      logout();
      setToastOpen(true);
      setMessage('Session expired. Please log in again');
    }
    if (status === 'authenticated') {
      loadUser();
    }
  }, [status]);

  return (
    <AuthContext.Provider value={{ user: session, login, logout, loadUser }}>
      {children}

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <SnackbarContent message={message} />
      </Snackbar>
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