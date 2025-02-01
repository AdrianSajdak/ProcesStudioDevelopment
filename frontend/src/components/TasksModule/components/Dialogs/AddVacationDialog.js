import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { format } from 'date-fns';

const AddVacationDialog = ({ open, date, loggedInUser, onClose, onAdd }) => {
  const [duration, setDuration] = useState('');
  const [comments, setComments] = useState('');

  const handleAdd = () => {
    const initialStatus = loggedInUser.role === 'Boss' ? 'CONFIRMED' : 'PENDING';
    onAdd({
      assigned_user_id: loggedInUser.user_id,
      vacation_date: format(date, 'yyyy-MM-dd'),
      duration,
      comments,
      status: initialStatus,
    });
    setDuration('');
    setComments('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Dodaj Urlop</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Data urlopu"
          value={date ? format(date, 'yyyy-MM-dd') : ''}
          InputProps={{ readOnly: true }}
        />
        <TextField label="Pracownik" value={loggedInUser?.username || ''} disabled />
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
        <Button variant="contained" onClick={handleAdd}>
          Dodaj Urlop
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVacationDialog;
