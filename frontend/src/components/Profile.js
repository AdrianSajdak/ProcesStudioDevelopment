import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button, TextField } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { pink } from '@mui/material/colors';
import AxiosInstance from '../Axios';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';

function Profile({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    AxiosInstance.get('/user/')
      .then(response => {
        setUserData(response.data);
        setFirstName(response.data.first_name || '');
        setLastName(response.data.last_name || '');
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    if (profilePicFile) {
      formData.append('profile_picture', profilePicFile);
    }
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);

    AxiosInstance.post('/user/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setUserData(response.data);
        alert('Profile updated successfully!');
      })
      .catch(error => {
        console.error("Error updating profile:", error);
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('Error updating profile.');
        }
      });
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  if (!userData) {
    return <Typography>Loading profile...</Typography>;
  }

  const profilePictureUrl = userData.profile_picture 
    ? `${AxiosInstance.defaults.baseURL.replace('/api','')}${userData.profile_picture}` 
    : null;

  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 5,
        gap: 2
    }}>
    <Box sx={{ position: 'relative' }}>
        {profilePictureUrl ? (
            <Avatar
            src={profilePictureUrl}
            sx={{ width: 150, height: 150, bgcolor: pink[500] }}
            />
        ) : (
            <Avatar sx={{ width: 150, height: 150, bgcolor: pink[500] }}>
            <AccountCircle sx={{ fontSize: 80 }} />
            </Avatar>
        )}

        <IconButton
            component="label"
            sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'white',
                width: 40,
                height: 40,
                borderRadius: '50%',
                '&:hover': { bgcolor: 'grey.200' }
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

        <Button variant="contained" color="primary" onClick={handleSave}>
            Zapisz zmiany
        </Button>

        <Button variant="outlined" color="error" onClick={handleLogoutClick}>
            Wyloguj
        </Button>
    </Box>
    );
}

export default Profile;
