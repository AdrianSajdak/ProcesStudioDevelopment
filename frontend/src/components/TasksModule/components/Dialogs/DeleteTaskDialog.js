import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Checkbox } from '@mui/material';

const DeleteTaskDialog = ({ open, task, onClose, onConfirm }) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Czy na pewno usunąć zadanie?</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
          }
          label="Potwierdzam usunięcie zadania"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Anuluj</Button>
        <Button variant="contained" color="error" disabled={!confirmed} onClick={handleConfirm}>
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskDialog;