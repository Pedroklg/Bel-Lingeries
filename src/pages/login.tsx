import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { Container, Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import Link from 'next/link';
import { palette } from '@/theme';

const { belWhite, belDarkCyan, belBlue } = palette;

interface AuthForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors }, setError } = useForm<AuthForm>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: AuthForm) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      }) as { error?: string };
  
      console.log('Sign in result:', result);
  
      if (result.error) {
        setError('email', { type: 'manual', message: 'Invalid credentials' });
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('email', { type: 'manual', message: 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: "15rem", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ color: belDarkCyan, fontWeight: 'bold', fontSize: '3rem' }}>
          Loggin
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            autoFocus
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ bgcolor: belWhite }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ bgcolor: belWhite }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: belBlue, color: belDarkCyan, fontWeight: 'bold'}}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Link href="/register">
            <Typography component="h1" variant="body1">
              Não possui conta? <span className='font-bold text-belPink text-lg'>Registre-se aqui</span>
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
