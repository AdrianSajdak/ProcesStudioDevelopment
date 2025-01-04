import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import AxiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { alignProperty } from '@mui/material/styles/cssUtils';

function Login({ onLogin }) {
  const theme = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.post('/token/', {
        username,
        password
      });
      const { access, refresh } = response.data;

      sessionStorage.setItem('accessToken', access);
      sessionStorage.setItem('refreshToken', refresh);
      
      onLogin(access);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials');
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 3,
          borderRadius: 5,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" textAlign="center">
          Zaloguj się
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        <Button
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.light' },
          }}
        >
          Zaloguj
        </Button>
      </Box>
    </Box>
  );
}

export default Login;