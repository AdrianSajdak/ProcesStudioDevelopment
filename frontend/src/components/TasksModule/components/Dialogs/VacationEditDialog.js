import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const VacationEditDialog = ({ open, vacation, onClose, onSave }) => {
  const [vacationDate, setVacationDate] = useState('');
  const [duration, setDuration] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    if (vacation) {
      setVacationDate(vacation.vacation_date);
      setDuration(vacation.duration);
      setComments(vacation.comments || '');
    }
  }, [vacation]);

  const handleSave = () => {
    onSave({ vacation_date: vacationDate, duration, comments });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edycja urlopu</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Data urlopu"
          type="date"
          value={vacationDate}
          onChange={(e) => setVacationDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Czas trwania (h)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <TextField
          label="Komentarz"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          multiline
          rows={3}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button variant="contained" onClick={handleSave}>
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VacationEditDialog;
