import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

const PHASE_TYPES = ['KONSULTACJE', 'PLANOWANIE', 'POPRAWKI', 'PODSUMOWANIE'];
const PHASE_STATUSES = ['OPEN', 'SUSPENDED', 'CLOSED'];

const PhaseUpdateDialog = ({ open, phase, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('KONSULTACJE');
  const [status, setStatus] = useState('OPEN');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (phase) {
      setName(phase.name || '');
      setPrice(phase.price || '');
      setType(phase.type || 'KONSULTACJE');
      setStatus(phase.status || 'OPEN');
      setStartDate(phase.start_date || '');
      setEndDate(phase.end_date || '');
    }
  }, [phase]);

  const handleSave = () => {
    const updatedPhase = {
      name,
      price,
      type,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
    };
    onSave(phase, updatedPhase);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Edytuj Fazę</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '1rem' }}
      >
        <TextField
          label="Nazwa fazy"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          margin="dense"
          fullWidth
        />
        <TextField
          label="Cena"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Typ</InputLabel>
              <Select
                value={type}
                label="Typ"
                onChange={(e) => setType(e.target.value)}
              >
                {PHASE_TYPES.map((t) => (
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
                {PHASE_STATUSES.map((st) => (
                  <MenuItem key={st} value={st}>
                    {st}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Data rozpoczęcia (YYYY-MM-DD)"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Data zakończenia (YYYY-MM-DD)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
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

export default PhaseUpdateDialog;