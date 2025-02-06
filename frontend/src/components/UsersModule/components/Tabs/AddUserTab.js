import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Grid } from '@mui/material';
import * as usersApi from '../../api/usersApi';
import { USER_ROLES, CONTRACT_TYPES, GENDER_CHOICES } from '../Variables';

const AddUserTab = ({ onUserAdded, showSnackbar }) => {
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Employee',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    pesel: '',
    gender: '',
    profile_picture: null,
    residential_address: '',
    mailing_address: '',
    work_phone: '',
    private_phone: '',
    employment_date: '',
    contract_type: '',
    contract_file: null,
    work_percentage: '',
    position: '',
    salary_rate: '',
    bank_account: '',
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormValues({ ...formValues, [name]: e.target.files[0] });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    // Wymagane pola: username, email, password, role
    if (!formValues.username || !formValues.email || !formValues.password || !formValues.role) {
      showSnackbar('warning', 'Proszę wypełnić wszystkie wymagane pola.');
      return;
    }

    try {
      // Przygotowujemy FormData (umożliwia wysyłanie plików)
      const formData = new FormData();
      Object.keys(formValues).forEach(key => {
        if (formValues[key] !== '' && formValues[key] !== null) {
          formData.append(key, formValues[key]);
        }
      });
      
      await usersApi.createUser(formData);
      showSnackbar('success', 'Użytkownik dodany pomyślnie!');
      // Reset formularza
      setFormValues({
        username: '',
        email: '',
        password: '',
        role: 'Employee',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        pesel: '',
        gender: '',
        profile_picture: null,
        residential_address: '',
        mailing_address: '',
        work_phone: '',
        private_phone: '',
        employment_date: '',
        contract_type: '',
        contract_file: null,
        work_percentage: '',
        position: '',
        salary_rate: '',
        bank_account: '',
      });
      if (onUserAdded) {
        onUserAdded();
      }
    } catch (error) {
      console.error(error);
      showSnackbar('error', 'Błąd przy dodawaniu użytkownika.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleAddUser}
      sx={{
        mt: 3,
        maxWidth: 800,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h7" sx={{ textAlign: 'left'}}>
        Dane użytkownika:
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Username"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Hasło"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Rola"
            name="role"
            value={formValues.role}
            onChange={handleChange}
            required
            fullWidth
          >
            {USER_ROLES.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h7" sx={{ textAlign: 'left'}}>
            Dane personalne:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Imię"
            name="first_name"
            value={formValues.first_name}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nazwisko"
            name="last_name"
            value={formValues.last_name}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Płeć"
            name="gender"
            value={formValues.gender || ''}
            onChange={handleChange}
            fullWidth
          >
            {GENDER_CHOICES.map((g) => (
              <MenuItem key={g.value} value={g.value}>
                {g.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Data urodzenia"
            name="date_of_birth"
            type="date"
            value={formValues.date_of_birth}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="PESEL"
            name="pesel"
            value={formValues.pesel}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h7" sx={{ textAlign: 'left'}}>
            Dane kontaktowe:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Adres zamieszkania"
            name="residential_address"
            value={formValues.residential_address}
            onChange={handleChange}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Adres korespondencyjny"
            name="mailing_address"
            value={formValues.mailing_address}
            onChange={handleChange}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Telefon służbowy"
            name="work_phone"
            value={formValues.work_phone}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Telefon prywatny"
            name="private_phone"
            value={formValues.private_phone}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h7" sx={{ textAlign: 'left'}}>
            Dane pracownika:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Data zatrudnienia"
            name="employment_date"
            type="date"
            value={formValues.employment_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Wymiar etatu (%)"
            name="work_percentage"
            type="number"
            value={formValues.work_percentage}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Stanowisko"
            name="position"
            value={formValues.position}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Rodzaj umowy"
            name="contract_type"
            value={formValues.contract_type || ''}
            onChange={handleChange}
            fullWidth
          >
            {CONTRACT_TYPES.map((ct) => (
              <MenuItem key={ct.value} value={ct.value}>
                {ct.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Wynagrodzenie"
            name="salary_rate"
            type="number"
            value={formValues.salary_rate}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Numer konta bankowego"
            name="bank_account"
            value={formValues.bank_account}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h7" sx={{ textAlign: 'left'}}>
            Pliki:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" component="label" fullWidth>
            {formValues.contract_file ? 'Plik wybrany' : 'Wybierz plik umowy'}
            <input
              type="file"
              name="contract_file"
              hidden
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
            />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" component="label" fullWidth>
            {formValues.profile_picture ? 'Plik wybrany' : 'Wybierz zdjęcie profilowe'}
            <input
              type="file"
              name="profile_picture"
              hidden
              onChange={handleChange}
              accept="image/*"
            />
          </Button>
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
        Dodaj
      </Button>
    </Box>
  );
};

export default AddUserTab;
