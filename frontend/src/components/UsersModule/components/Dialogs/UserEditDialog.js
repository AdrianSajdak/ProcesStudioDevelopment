import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
} from '@mui/material';
import { GENDER_CHOICES, CONTRACT_TYPES } from '../Variables';

const UserEditDialog = ({ open, onClose, userData, onSave, showSnackbar }) => {
  const [editValues, setEditValues] = useState({});

  // Przy otwarciu dialogu kopiujemy aktualne dane użytkownika
  useEffect(() => {
    if (userData) {
      setEditValues(userData);
    }
  }, [userData]);

  const handleEditChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setEditValues({ ...editValues, [name]: files[0] });
    } else {
      setEditValues({ ...editValues, [name]: value });
    }
  };

  const handleSave = () => {
    // Tutaj możesz dodać dodatkowe walidacje przed zapisaniem
    onSave(editValues);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ textAlign: 'center' }}>Edytuj Użytkownika</DialogTitle>
      <DialogContent dividers>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Podstawowe pola */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                name="username"
                value={editValues.username || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={editValues.email || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Imię"
                name="first_name"
                value={editValues.first_name || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nazwisko"
                name="last_name"
                value={editValues.last_name || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data urodzenia"
                name="date_of_birth"
                type="date"
                value={editValues.date_of_birth || ''}
                onChange={handleEditChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="PESEL"
                name="pesel"
                value={editValues.pesel || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Płeć"
                name="gender"
                value={editValues.gender || ''}
                onChange={handleEditChange}
                fullWidth
              >
                {GENDER_CHOICES.map((g) => (
                  <MenuItem key={g.value} value={g.value}>
                    {g.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Pola plikowe */}
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                color="violet.dark"
                sx={{
                  color: 'violet.dark',
                  '&:hover': { color: 'violet.light' },
                }}
              >
                {editValues.profile_picture instanceof File
                  ? 'Plik wybrany'
                  : 'Zmień zdjęcie profilowe'}
                <input
                  type="file"
                  name="profile_picture"
                  hidden
                  onChange={handleEditChange}
                  accept="image/*"
                />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                color="violet.dark"
                sx={{
                  color: 'violet.dark',
                  '&:hover': { color: 'violet.light' },
                }}
              >
                {editValues.contract_file instanceof File
                  ? 'Plik wybrany'
                  : 'Zmień plik umowy'}
                <input
                  type="file"
                  name="contract_file"
                  hidden
                  onChange={handleEditChange}
                  accept=".pdf,.doc,.docx"
                />
              </Button>
            </Grid>
            {/* Pozostałe pola */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefon służbowy"
                name="work_phone"
                value={editValues.work_phone || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefon prywatny"
                name="private_phone"
                value={editValues.private_phone || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Adres zamieszkania"
                name="residential_address"
                value={editValues.residential_address || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Adres korespondencyjny"
                name="mailing_address"
                value={editValues.mailing_address || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data zatrudnienia"
                name="employment_date"
                type="date"
                value={editValues.employment_date || ''}
                onChange={handleEditChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Rodzaj umowy"
                name="contract_type"
                value={editValues.contract_type || ''}
                onChange={handleEditChange}
                fullWidth
              >
                {CONTRACT_TYPES.map((ct) => (
                  <MenuItem key={ct.value} value={ct.value}>
                    {ct.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Wymiar etatu (%)"
                name="work_percentage"
                type="number"
                value={editValues.work_percentage || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stanowisko"
                name="position"
                value={editValues.position || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stawka wynagrodzenia"
                name="salary_rate"
                type="number"
                value={editValues.salary_rate || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Numer konta bankowego"
                name="bank_account"
                value={editValues.bank_account || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="violet.dark"
          sx={{
            color: 'violet.dark',
            '&:hover': { color: 'violet.light' },
          }}
        >
          Anuluj
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.light' },
          }}
        >
          Zapisz
        </Button>
        
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;