import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AxiosInstance from '../Axios';
import { useTheme } from '@mui/material/styles';


function Clients() {
  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0);

  const [clientsList, setClientsList] = useState([]);

  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [street, setStreet] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    AxiosInstance.get('/clients/')
      .then((res) => {
        setClientsList(res.data);
      })
      .catch((err) => {
        console.error('Error fetching clients:', err);
      });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    AxiosInstance.post('/clients/', {
      name,
      nip,
      description,
      city,
      postcode,
      street,
      contact_person: contactPerson,
      contact_email: contactEmail,
    })
      .then((res) => {
        setSuccessMsg('Klient dodany pomyślnie!');

        setName('');
        setNip('');
        setDescription('');
        setCity('');
        setPostcode('');
        setStreet('');
        setContactPerson('');
        setContactEmail('');

        AxiosInstance.get('/clients/').then((r) => setClientsList(r.data));
      })
      .catch((err) => {
        setErrorMsg('Błąd przy dodawaniu klienta.');
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
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Panel Klientów
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        textColor="inherit"
        sx={{ marginBottom: 2}}
        TabIndicatorProps={{ style: { backgroundColor: theme.palette.violet.light } }}
      >
        <Tab label="Lista Klientów" />
        <Tab label="Dodaj Klienta" />
      </Tabs>

      {/* LISTA */}
      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          {clientsList.map((client) => (
            <Accordion key={client.client_id || client.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{client.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>NIP: {client.nip || '-'}</Typography>
                <Typography>Opis: {client.description || '-'}</Typography>
                <Typography>Miasto: {client.city || '-'}</Typography>
                <Typography>Kod: {client.postcode || '-'}</Typography>
                <Typography>Ulica: {client.street || '-'}</Typography>
                <Typography>Kontakt: {client.contact_person || '-'}</Typography>
                <Typography>Email: {client.contact_email || '-'}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* DODAJ */}
      {tabValue === 1 && (
        <Box
          component="form"
          onSubmit={handleAddClient}
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
            Dodaj Klienta
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Nazwa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="NIP"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Opis"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Miasto"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Kod pocztowy"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Ulica"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Osoba kontaktowa"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email kontaktowy"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                fullWidth
              />
            </Grid>
            
          </Grid>

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: 'violet.main',
              '&:hover': { backgroundColor: 'violet.light' },
            }}
          >
            Dodaj Klienta
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Clients;
