import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Container, Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import { palette } from '@/theme';

const { belDarkCyan, belBlue, belWhite } = palette;

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors }, setError } = useForm<RegisterForm>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const error = await res.json();
        setError('email', { type: 'manual', message: error.message });
      }
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: "15rem", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ color: belDarkCyan, fontWeight: 'bold', fontSize: '3rem' }}>
          Registrar
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
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
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            autoComplete="current-password"
            {...register('confirmPassword', { required: 'Please confirm your password' })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{ bgcolor: belWhite }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            autoComplete="name"
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ bgcolor: belWhite }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: belBlue, color: belDarkCyan, fontWeight: 'bold'}}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
