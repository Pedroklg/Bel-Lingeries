import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { Session } from 'next-auth';
import { Snackbar, SnackbarContent } from '@mui/material';

type AuthContextType = {
  user: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
};

const getSessionFromLocalStorage = (): Session | null => {
  const session = localStorage.getItem('session');
  if (session) {
    const parsedSession: Session = JSON.parse(session);
    return parsedSession;
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
      localStorage.removeItem('session'); // Clear session from local storage on logout
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
      // Perform logout actions here
      localStorage.removeItem('session'); // Clear the session from local storage
      setToastOpen(true);
      setMessage('Session expired. Please log in again');
    }
    if (session && !isSessionExpired(session)) {
      console.log('Session is not expired');
    }
    if (status === 'authenticated') {
      loadUser();
      // Store session in local storage
      localStorage.setItem('session', JSON.stringify(session));
    }
  }, [status]);

  return (
    <AuthContext.Provider value={{ user: session, login, logout, loadUser }}>
      {children}

      {/* Toast Notification */}
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
