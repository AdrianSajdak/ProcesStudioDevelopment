import React from 'react';
import {Typography, Box } from '@mui/material';

const About = () => {
  return (
    <div>
      {/* About Us Section */}
      <Box sx={{
        padding: '20px',
        textAlign: 'center'
        }}>
        <Typography variant="h3" gutterBottom>
          Proces Studio App
        </Typography>
        <Typography variant="body1">
          Aplikacja zbierająca różne narzędzia do obliczeń inżynierskich w jednym miejscu dla Proces Studio.
        </Typography>
      </Box>
    </div>
  );
};

export default About;
