import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AxiosInstance from '../../Axios';
import { useTheme } from '@mui/material/styles';
import be from 'date-fns/locale/be';

function Users() {
  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0);

  // Zakładka "Lista Pracowników"
  const [usersList, setUsersList] = useState([]);

  // Zakładka "Dodaj Pracownika" – formularz
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Employee');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const roles = [
    { value: 'Boss', label: 'Boss' },
    { value: 'Employee', label: 'Employee' },
  ];

  // Na start pobieramy listę użytkowników
  useEffect(() => {
    AxiosInstance.get('/users/')
      .then((res) => {
        setUsersList(res.data);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
      });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    AxiosInstance.post('/register/', {
      username,
      password,
      email,
      role,
    })
      .then((res) => {
        setSuccessMsg('Użytkownik dodany pomyślnie!');
        setUsername('');
        setPassword('');
        setEmail('');
        setRole('Employee');

        AxiosInstance.get('/users/').then((r) => setUsersList(r.data));
      })
      .catch((err) => {
        setErrorMsg('Błąd przy dodawaniu użytkownika.');
        console.error(err);
      });
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        textColor="inherit"
        sx={{ marginBottom: 2 }}
        TabIndicatorProps={{ style: { backgroundColor: theme.palette.violet.light } }}
      >
        <Tab label="Lista Pracowników" />
        <Tab label="Dodaj Pracownika" />
      </Tabs>

      {/* Zakładka LISTA */}
      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          {usersList
            .sort((a, b) => b.user_id - a.user_id)
            .reverse()
            .map((user) => (
              <Accordion
                key={user.user_id || user.id}
                sx={{ mb: 1 }} 
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    {user.username} ({user.role})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Imię: {user.first_name || '-'}</Typography>
                  <Typography>Nazwisko: {user.last_name || '-'}</Typography>
                  <Typography>Email: {user.email}</Typography>
                  <Typography>Rola: {user.role}</Typography>
                  {/* Dodaj inne pola, jeśli masz w modelu */}
                </AccordionDetails>
              </Accordion>
          ))}
        </Box>
      )}

      {/* Zakładka DODAJ */}
      {tabValue === 1 && (
        <Box
          component="form"
          onSubmit={handleAddUser}
          sx={{
            mt: 3,
            maxWidth: 600,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {successMsg && (
            <Typography sx={{ color: '#60f76d', textAlign: 'center'}}>{successMsg}</Typography>
          )}
          {errorMsg && <Typography sx={{ color: 'error', textAlign: 'center'}}>{errorMsg}</Typography>}

          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Dodaj Pracownika
          </Typography>
          
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
            label="Hasło"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            select
            label="Rola"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            {roles.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: 'violet.main',
              '&:hover': { backgroundColor: 'violet.light' },
            }}
          >
            Dodaj
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Users;
