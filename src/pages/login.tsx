import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { Container, Typography, TextField, Button, CircularProgress, Box } from '@mui/material';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors }, setError } = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    }) as { error?: string };

    if (result.error) {
      setError('email', { type: 'manual', message: 'Invalid credentials' });
      setError('password', { type: 'manual', message: 'Invalid credentials' });
    } else {
      router.push('/'); // Redirect to home page after successful login
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign in
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          {/* Google Sign-In Button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => signIn('google')}
            sx={{ mt: 1, mb: 2 }}
            disabled={loading}
          >
            Sign in with Google
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
