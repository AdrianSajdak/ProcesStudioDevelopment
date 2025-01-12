import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../Axios';

function Home() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AxiosInstance.get('/users/me/')
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setUserData(null);
      });
  }, []);

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  const userRole = userData.role;

  return (
    <Box
    sx={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
    }}
    >

      <Box
        sx={{
          position: 'sticky',
          top: 0,
          width: '100%',
          zIndex: 10,
          textAlign: 'center',
          padding: '1rem 0',
        }}
      >
        <Typography variant="h4">
          Witaj, {userData.first_name && userData.last_name ? `${userData.first_name} ${userData.last_name}` : userData.username}!
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate('/calculator')}
          sx={{
            width: '10rem',
            height: '10rem',
            borderRadius: '15%',
            backgroundColor: 'violet.main',
            color: '#fff',':hover': {
              backgroundColor: 'violet.light',
            },
          }}
        >
          Kalkulator
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate('/tasks')}
          sx={{
            width: '10rem',
            height: '10rem',
            borderRadius: '15%',
            backgroundColor: 'violet.main',
            color: '#fff',':hover': {
              backgroundColor: 'violet.light',
            },
          }}
        >
          Zadania
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate('/projects')}
          sx={{
            width: '10rem',
            height: '10rem',
            borderRadius: '15%',
            backgroundColor: 'violet.main',
            color: '#fff',':hover': {
              backgroundColor: 'violet.light',
            },
          }}
        >
          Projekty
        </Button>

        {userRole === 'Boss' && (
          <>
            <Button
              variant="contained"
              onClick={() => navigate('/clients')}
              sx={{
                width: '10rem',
                height: '10rem',
                borderRadius: '15%',
                backgroundColor: 'violet.main',
                color: '#fff',':hover': {
                  backgroundColor: 'violet.light',
                },
              }}
            >
              Klienci
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/users')}
              sx={{
                width: '10rem',
                height: '10rem',
                borderRadius: '15%',
                backgroundColor: 'violet.main',
                color: '#fff',':hover': {
                  backgroundColor: 'violet.light',
                },
              }}
            >
              Pracownicy
            </Button>
        </>
      )}
    </Box>
  </Box>
);
}

export default Home;