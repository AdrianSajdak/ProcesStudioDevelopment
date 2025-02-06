import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import AxiosInstance from '../../Axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import logo_ps from '../images/logo_ps.png';

function Login({ onLogin }) {
  const theme = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'error',
    message: '',
  });
  const navigate = useNavigate();

  const showSnackbar = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

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
      showSnackbar('error', 'Błędne dane logowania.');
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

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img
            src={logo_ps}
            alt="logo_ps"
            style={{ width: '120px' }}
          />
        </Box>

        <Typography variant="h4" textAlign="center">
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;