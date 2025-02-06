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

const PhaseAddDialog = ({ open, assignedProjectId, projects, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('KONSULTACJE');
  const [status, setStatus] = useState('OPEN');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!open) {
      // reset formularza przy zamykaniu dialogu
      setName('');
      setPrice('');
      setType('KONSULTACJE');
      setStatus('OPEN');
      setStartDate('');
      setEndDate('');
    }
  }, [open]);

  const handleAdd = () => {
    if (!name) {
      // Jeśli nie podano nazwy – rodzic może wyświetlić komunikat
      return;
    }
    const newPhase = {
      assigned_project_id: assignedProjectId,
      name,
      price,
      type,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
    };
    onAdd(newPhase);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Dodaj Fazę</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
      >
        <TextField
          label="Nazwa fazy"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          autoFocus
          margin="dense"
        />
        <FormControl fullWidth disabled>
          <InputLabel>Projekt</InputLabel>
          <Select value={assignedProjectId} label="Projekt">
            {projects.map((p) => (
              <MenuItem key={p.project_id} value={p.project_id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Cena"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
        />
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Data rozpoczęcia"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Data zakończenia"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
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
          variant="contained"
          onClick={handleAdd}
          sx={{
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.light' },
          }}
        >
          Dodaj
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhaseAddDialog;