import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => {
    return (
        <Box sx={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                textAlign: 'center',
            }}
        >
            <Typography variant="body2">
                © 2024 Proces Studio. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
