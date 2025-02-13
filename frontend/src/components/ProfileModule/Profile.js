import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';

import { getFileUrl } from '../../fileUrl';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import EditPasswordDialog from './components/Dialogs/EditPasswordDialog';
import * as profileApi from './api/profileApi';
import useProfileData from './hooks/useProfileData';

import { useTheme } from '@mui/material/styles';

function Profile({ onLogout }) {
  const theme = useTheme();

  const { userData, refreshProfile } = useProfileData();
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [changePassDialogOpen, setChangePassDialogOpen] = useState(false);
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (profilePicFile) {
      formData.append('profile_picture', profilePicFile);
    }

    try {
      await profileApi.updateProfilePicture(formData);
      showSnackbar('success', 'Zmiany zostały zapisane.');
      setProfilePicFile(null);
      refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('error', 'Zapisywanie zmian się nie udało.');
    }
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  const handleChangePasswordOpen = () => {
    setChangePassDialogOpen(true);
  };

  const handleChangePasswordClose = () => {
    setChangePassDialogOpen(false);
  };

  const handleChangePasswordConfirm = async (oldPassword, newPassword, confirmNewPassword) => {
    if (newPassword !== confirmNewPassword) {
      showSnackbar('error', 'Nowe hasła nie są takie same.');
      return;
    }
    try {
      await profileApi.changePassword(oldPassword, newPassword);
      showSnackbar('success', 'Hasło zostało zmienione.');
      setChangePassDialogOpen(false);
    } catch (error) {
      console.error('Error changing password:', error);
      showSnackbar('error', 'Nie udało się zmienić hasła. Czy podałeś poprawne aktualne hasło?');
      throw error;
    }
  };

  if (!userData) {
    return <Typography>Loading profile...</Typography>;
  }

  const profilePictureUrl = getFileUrl(userData.profile_picture);

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
            bgcolor: profilePicFile ? 'green' : '#636262',
            width: 40,
            height: 40,
            borderRadius: '50%',
            '&:hover': { bgcolor: profilePicFile ? 'darkgreen' : '#8a8888' },
          }}
        >
          <FileUploadIcon />
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/jpg"
          />
        </IconButton>
      </Box>
      
      <Grid container spacing={2} sx={{ mt: 2, width: 350 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Imię"
            value={userData.first_name}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nazwisko"
            value={userData.last_name}
            fullWidth
            disabled
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ width: 350 }}>
        <Grid item xs={12} md={12}>
          <TextField
            label="Email"
            value={userData.email}
            fullWidth
            disabled
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={2} sx={{ width: 350 }}>
        <Grid item xs={12} md={8}>
          <TextField
            label="Stanowisko"
            value={userData.position}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Rola"
            value={userData.role}
            fullWidth
            disabled
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1, width: 350 }}>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            onClick={handleSave}
            fullWidth
            sx={{
              backgroundColor: 'violet.main',
              color: '#fff',
              ':hover': {
                backgroundColor: 'violet.light',
              },
            }}
          >
            Zapisz zmiany
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleChangePasswordOpen}
            sx={{
              backgroundColor: 'violet.main',
              color: '#fff',
              ':hover': {
                backgroundColor: 'violet.light',
              },
            }}
          >
            Zmień hasło
          </Button>  
        </Grid>
      </Grid>

      <Button
        variant="outlined"
        color="error"
        onClick={handleLogoutClick}
        sx={{ minWidth: 200 }}
      >
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

      <EditPasswordDialog
        open={changePassDialogOpen}
        onClose={handleChangePasswordClose}
        onConfirm={handleChangePasswordConfirm}
      />
    </Box>
  );
}

export default Profile;