import React, { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import AxiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';
import { primaryPurpleColor } from '../theme/colors';
import { useTheme } from '@mui/material/styles';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const theme = useTheme();

  const roles = [
    { value: 'Boss', label: 'Boss' },
    { value: 'Employee', label: 'Employee' },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.post('/register/', {
        username,
        password,
        email,
        role
      });
      setSuccess('Zarejestrowano pomyślnie! Możesz się teraz zalogować.');
      setUsername('');
      setPassword('');
      setEmail('');
      setRole('Employee');
      setError('');
      navigate('/login');
    } catch (err) {
      setError('Wystąpił błąd podczas rejestracji.');
      setSuccess('');
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
        onSubmit={handleRegister}
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
          Rejestracja
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          fullWidth
        >
          {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.dark' },
          }}
        >
          Zarejestruj
        </Button>
      </Box>
    </Box>
  );
}

export default Register;
