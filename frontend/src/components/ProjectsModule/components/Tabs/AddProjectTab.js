import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import * as projectsApi from '../../api/projectsApi';

const PROJECT_TYPES = [
  'MIESZKANIOWY',
  'BLOKOWY',
  'DOM',
  'HALA',
  'PUBLICZNY',
  'INNY',
];
const PROJECT_STATUSES = ['OPEN', 'SUSPENDED', 'CLOSED'];

const AddProjectTab = ({ clients, onAddProject, showSnackbar }) => {
  const [name, setName] = useState('');
  const [assignedClient, setAssignedClient] = useState('');
  const [type, setType] = useState('DOM');
  const [status, setStatus] = useState('OPEN');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [postcode, setPostcode] = useState('');
  const [area, setArea] = useState('');
  const [comments, setComments] = useState('');

  const handleAddProject = async () => {
    if (!name || !assignedClient || !city || !street || !postcode || !area) {
      showSnackbar('warning', 'Uzupełnij wymagane dane.');
      return;
    }
    try {
      await projectsApi.createProject({
        name,
        assigned_client_id: assignedClient,
        type,
        status,
        city,
        street,
        postcode,
        area,
        comments,
      });
      showSnackbar('success', 'Projekt dodany pomyślnie!');

      setName('');
      setAssignedClient('');
      setType('DOM');
      setStatus('OPEN');
      setCity('');
      setStreet('');
      setPostcode('');
      setArea('');
      setComments('');
      if (onAddProject) {
        onAddProject();
      }
    } catch (error) {
      console.error(error);
      showSnackbar('error', 'Błąd przy dodawaniu projektu.');
    }
  };

  return (
    <Box
      type="form"
      sx={{
        mt: 3,
        maxWidth: 600,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      >
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Dodaj Projekt
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Nazwa projektu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Klient</InputLabel>
            <Select
              value={assignedClient}
              label="Klient"
              onChange={(e) => setAssignedClient(e.target.value)}
            >
              {clients.map((c) => (
                <MenuItem key={c.client_id} value={c.client_id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Powierzchnia m2"
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Typ</InputLabel>
            <Select
              value={type}
              label="Typ"
              onChange={(e) => setType(e.target.value)}
            >
              {PROJECT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              {PROJECT_STATUSES.map((st) => (
                <MenuItem key={st} value={st}>
                  {st}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Miasto"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Kod pocztowy"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Ulica"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Komentarze"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            fullWidth
            multiline
            rows={3}
            inputProps={{
              style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
            }}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        onClick={handleAddProject}
        variant="contained"
        sx={{
          backgroundColor: 'violet.main',
          '&:hover': { backgroundColor: 'violet.light' },
          mt: 2,
        }}
      >
        Dodaj Projekt
      </Button>
    </Box>
  );
};

export default AddProjectTab;