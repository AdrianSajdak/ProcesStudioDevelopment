import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import * as clientsApi from '../../api/clientsApi';

const AddClientTab = ({ onClientAdded, showSnackbar }) => {
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [street, setStreet] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!name || !nip || !city || !postcode || !street || !contactPerson || !contactEmail) {
      showSnackbar('warning', 'Uzupełnij wymagane dane.');
      return;
    }
    try {
      await clientsApi.createClient({
        name,
        nip,
        description,
        city,
        postcode,
        street,
        contact_person: contactPerson,
        contact_email: contactEmail,
      });
      showSnackbar('success', 'Klient dodany pomyślnie!');
      setName('');
      setNip('');
      setDescription('');
      setCity('');
      setPostcode('');
      setStreet('');
      setContactPerson('');
      setContactEmail('');
      if (onClientAdded) {
        onClientAdded();
      }
    } catch (error) {
      console.error(error);
      showSnackbar('error', 'Błąd przy dodawaniu klienta.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleAddClient}
      sx={{
        mt: 3,
        maxWidth: 600,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h6" sx={{ textAlign: 'center' }}>
        Dodaj Klienta
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Nazwa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="NIP"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
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
          <TextField label="Miasto" value={city} onChange={(e) => setCity(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="Kod pocztowy" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="Ulica" value={street} onChange={(e) => setStreet(e.target.value)} />
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
          mt: 2,
        }}
      >
        Dodaj Klienta
      </Button>
    </Box>
  );
};

export default AddClientTab;