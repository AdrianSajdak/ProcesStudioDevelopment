import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
} from '@mui/material';

const ClientEditDialog = ({ open, onClose, clientData, onSave, showSnackbar }) => {
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    if (clientData) {
      setEditValues(clientData);
    }
  }, [clientData]);

  const handleEditChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setEditValues({ ...editValues, [name]: files[0] });
    } else {
      setEditValues({ ...editValues, [name]: value });
    }
  };

  const handleSave = () => {
    onSave(editValues);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>Edytuj Klienta</DialogTitle>
      <DialogContent dividers>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nazwa klienta"
                name="name"
                value={editValues.name || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="NIP"
                name="nip"
                value={editValues.nip || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Opis"
                name="description"
                value={editValues.description || ''}
                onChange={handleEditChange}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} >
              <TextField
                label="Miasto"
                name="city"
                value={editValues.city || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Kod pocztowy"
                name="postcode"
                value={editValues.postcode || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Ulica"
                name="street"
                value={editValues.street || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Osoba kontaktowa"
                name="contact_person"
                value={editValues.contact_person || ''}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email kontaktowy"
                name="contact_email"
                value={editValues.contact_email || ''}
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

export default ClientEditDialog;