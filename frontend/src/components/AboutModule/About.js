import React from 'react';
import {Typography, Box } from '@mui/material';

const About = () => {
  return (
    <div>
      <Box sx={{
        padding: '20px',
        textAlign: 'center'
        }}>
        <Typography variant="h3" gutterBottom>
          Proces Studio
        </Typography>
        <Typography variant="h5">
          Aplikacja utworzona na potrzeby Proces Studio do rozwiązywania następujących problemów:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem'
          }}
        >
          <Box sx={{ textAlign: 'center', bgcolor: 'violet.main', p: 2, borderRadius: 3 }}>
            <Typography variant="body1">
              Zarządzanie strukturami organizacyjnymi firmy
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', bgcolor: 'violet.main', p: 2, borderRadius: 3 }}>
            <Typography variant="body1">
              Implementacja systemu obliczeń matematycznych
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default About;
