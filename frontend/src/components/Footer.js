import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
    const theme = useTheme();

    return (
        <Box sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                padding: '5px',
                textAlign: 'center',
                width: '100%',
            }}
        >
            <Typography variant="body2">
                © 2024 Proces Studio. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
