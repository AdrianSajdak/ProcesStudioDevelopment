// Register.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import AxiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Worker');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const roles = [
    { value: 'Boss', label: 'Boss' },
    { value: 'Worker', label: 'Worker' },
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
      setRole('Worker');
      setError('');
    } catch (err) {
      setError('Wystąpił błąd podczas rejestracji.');
      setSuccess('');
    }
  }

  return (
    <Box 
      component="form"
      onSubmit={handleRegister}
      sx={{
        width: '300px', 
        margin: 'auto', 
        marginTop: '100px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2
      }}
    >
      <Typography variant="h5" textAlign="center">Rejestracja</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <TextField 
        label="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField 
        label="Email" 
        type="email"
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField 
        label="Password" 
        type="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <TextField
        select
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        {roles.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" type="submit">Zarejestruj</Button>
    </Box>
  );
}

export default Register;
