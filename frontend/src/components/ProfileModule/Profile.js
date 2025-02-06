import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';

import AxiosInstance from '../../Axios';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useTheme } from '@mui/material/styles';

function Profile({ onLogout }) {
  const theme = useTheme();

  const [userData, setUserData] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // --- DIALOG ZMIANY HASŁA ---
  const [changePassDialogOpen, setChangePassDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  // do wyświetlenia komunikatów
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const showSnackbar = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    AxiosInstance.get('/users/me/')
      .then(response => {
        setUserData(response.data);
        setFirstName(response.data.first_name || '');
        setLastName(response.data.last_name || '');
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        showSnackbar('error', 'Błąd wczytywania danych użytkownika.');
      });
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    const formData = new FormData();

    if (profilePicFile) {
      formData.append('profile_picture', profilePicFile);
    }
    if (firstName) {
      formData.append('first_name', firstName);
    }
    if (lastName) {
      formData.append('last_name', lastName);
    }

    AxiosInstance.post('/users/upload_profile_picture/', formData)
    .then(response => {
      setUserData(response.data);
      setFirstName(response.data.first_name || '');
      setLastName(response.data.last_name || '');
      showSnackbar('success', 'Pomyślnie zaktualizowano profil!');
    })
    .catch(error => {
      console.error("Error updating profile:", error);
      showSnackbar('error', 'Błąd aktualizacji profilu.');
    });
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  const handleChangePasswordOpen = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordChangeError('');
    setPasswordChangeSuccess('');
    setChangePassDialogOpen(true);
  };

  const handleChangePasswordClose = () => {
    setChangePassDialogOpen(false);
  };

  const handleChangePasswordConfirm = () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('Hasła nie są identyczne.');
      setPasswordChangeSuccess('');
      return;
    }

    AxiosInstance.post('/users/change_password/', {
      old_password: oldPassword,
      new_password: newPassword,
    })
      .then((res) => {
        setPasswordChangeSuccess('Hasło zostało zmienione pomyślnie!');
        setPasswordChangeError('');
        showSnackbar('success', 'Hasło zostało zmienione pomyślnie!');
        handleChangePasswordClose();
      })
      .catch((err) => {
        console.error('Error changing password:', err);
        setPasswordChangeError('Zmiana hasła się nie udała.');
        setPasswordChangeSuccess('');
        showSnackbar('error', 'Zmiana hasła się nie udała.');
      });
  };

  if (!userData) {
    return <Typography>Loading profile...</Typography>;
  }

  const profilePictureUrl = userData.profile_picture 
    ? `${AxiosInstance.defaults.baseURL.replace('/api','')}${userData.profile_picture}` 
    : null;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 5,
        gap: 2,
        p: 3,
        borderRadius: 1,
        boxShadow: 3,
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {profilePictureUrl ? (
          <Avatar
            src={profilePictureUrl}
            sx={{
              width: 150,
              height: 150,
              bgcolor: 'violet.light',
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 150,
              height: 150,
              bgcolor: 'violet.light',
            }}
          />
        )}

        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: '#636262',
            width: 40,
            height: 40,
            borderRadius: '50%',
            '&:hover': { bgcolor: '#8a8888' },
          }}
        >
          <FileUploadIcon />
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/jpeg,image/png"
          />
        </IconButton>
      </Box>

      <TextField
        label="Imię"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        fullWidth
        sx={{ maxWidth: 300 }}
      />
      <TextField
        label="Nazwisko"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        fullWidth
        sx={{ maxWidth: 300 }}
      />

      <TextField
        label="Email"
        value={userData.email}
        fullWidth
        disabled
        sx={{ maxWidth: 300 }}
      />
      <TextField
        label="Rola"
        value={userData.role}
        fullWidth
        disabled
        sx={{ maxWidth: 300 }}
      />

      <Button
        variant="contained"
        onClick={handleSave}
        sx={{
          minWidth: 150,
          backgroundColor: 'violet.main',
          color: '#fff',
          ':hover': {
            backgroundColor: 'violet.light',
          },
        }}
      >
        Zapisz zmiany
      </Button>

      <Button
        variant="contained"
        onClick={handleChangePasswordOpen}
        sx={{
          minWidth: 150,
          backgroundColor: 'violet.main',
          color: '#fff',
          ':hover': {
            backgroundColor: 'violet.light',
          },
        }}
      >
        Zmień hasło
      </Button>

      {/* DIALOG ZMIANY HASŁA */}
      <Dialog open={changePassDialogOpen} onClose={handleChangePasswordClose}>
        <DialogTitle sx={{textAlign: 'center'}}>Zmień hasło</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '1rem' }}>
          {passwordChangeError && (
            <Typography color="error">{passwordChangeError}</Typography>
          )}
          {passwordChangeSuccess && (
            <Typography sx={{ color: '#60f76d' }}>{passwordChangeSuccess}</Typography>
          )}
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
        <DialogActions>
          <Button onClick={handleChangePasswordClose}>Anuluj</Button>
          <Button onClick={handleChangePasswordConfirm}>Zmień</Button>
        </DialogActions>
      </Dialog>

      <Button variant="outlined" color="error" onClick={handleLogoutClick} sx={{ minWidth: 150 }}>
        Wyloguj
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;