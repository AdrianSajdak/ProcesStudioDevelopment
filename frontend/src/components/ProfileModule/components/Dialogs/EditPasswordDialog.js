import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material';

const EditPasswordDialog = ({ open, onClose, onConfirm  }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    onClose();
  };

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return;
    }
    try {
      await onConfirm(oldPassword, newPassword, confirmNewPassword);

      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{textAlign: 'center'}}>Zmień hasło</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '1rem' }}>
        <TextField
          label="Aktualne hasło"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          autoFocus
          margin="dense"
        />
        <TextField
          label="Nowe hasło"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Potwierdź nowe hasło"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="violet.dark"
          sx={{
            minWidth: 100,
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
            minWidth: 100,
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.light' },
          }}
        >
          Zmień
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPasswordDialog;