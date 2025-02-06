import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useState } from 'react';

const PhaseDeleteDialog = ({ open, phase, onClose, onDelete }) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = (phase) => {
    if (confirmed) {
      onDelete(phase);
    }
  };

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>Czy na pewno usunąć Fazę?</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
          }
          label="Potwierdzam usunięcie fazy"
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={handleClose}
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
          color="error"
          disabled={!confirmed}
          onClick={() => handleConfirm(phase)}
        >
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhaseDeleteDialog;