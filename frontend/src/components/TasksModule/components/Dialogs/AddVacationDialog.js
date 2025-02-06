import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Button, Grid, Checkbox, FormControlLabel, MenuItem, Select,
  InputLabel, FormControl
} from '@mui/material';
import { format } from 'date-fns';
import { VACATION_TYPES } from '../Variables';

const AddVacationDialog = ({ open, date, loggedInUser, onClose, onAdd }) => {
  const [comments, setComments] = useState('');
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [vacationType, setVacationType] = useState('UNPAID');

  const handleAdd = () => {
    const startDateFormatted = format(date, 'yyyy-MM-dd');
    const payload = {
      assigned_user_id: loggedInUser.user_id,
      start_date: startDateFormatted,
      comments,
      status: loggedInUser.role === 'Boss' ? 'CONFIRMED' : 'PENDING',
      type: vacationType
    };

    if (isMultiDay && endDate) {
      payload.end_date = endDate;
    }
    onAdd(payload);
    setComments('');
    setIsMultiDay(false);
    setEndDate('');
    setVacationType('UNPAID');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Dodaj Urlop</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Pracownik"
          value={loggedInUser?.username || ''}
          disabled
          fullWidth
          autoFocus
          margin="dense"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isMultiDay}
                  onChange={(e) => setIsMultiDay(e.target.checked)}
                />
              }
              label="Wielodniowy urlop"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Typ urlopu</InputLabel>
              <Select
                value={vacationType}
                label="Typ urlopu"
                onChange={(e) => setVacationType(e.target.value)}
              >
                {VACATION_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Data rozpoczęcia"
              value={date ? format(date, 'yyyy-MM-dd') : ''}
              InputProps={{ readOnly: true }}
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
              disabled={!isMultiDay}
            />
          </Grid>
        </Grid>
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
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.light' },
          }}
        >
          Dodaj Urlop
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVacationDialog;