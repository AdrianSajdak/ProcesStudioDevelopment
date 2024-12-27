import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import AxiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
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
      component="form"
      onSubmit={handleLogin}
      sx={{
        width: '300px', 
        margin: 'auto', 
        marginTop: '100px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2
      }}
    >
      <Typography variant="h5" textAlign="center">Zaloguj się</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField 
        label="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField 
        label="Password" 
        type="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button variant="contained" type="submit">Zaloguj</Button>
    </Box>
  );
}

export default Login;
