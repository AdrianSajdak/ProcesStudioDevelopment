import React from 'react';
import {Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <div>
      {/* Home content */}
      <Box sx={{
        padding: '20px',
        textAlign: 'center'
        }}>
        <Typography variant="h3" gutterBottom>
          Proces Studio App
        </Typography>
        <Typography variant="body1">
          Tutaj coś będzie chyba.
        </Typography>
      </Box>
    </div>
  );
};

export default Home;
