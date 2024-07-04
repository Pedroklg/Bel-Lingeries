import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CssBaseline />
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default MyApp;