import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

function Slicing() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: '100vh',
        p: 2,
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        [SGN] Ścinanie
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Wejścia */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="VEd [kN]"
          name="VEd"
          type="number"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Liczba ramion strzemion"
          name="n_sw"
          type="number"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Średnica strzemienia [mm]"
          name="phi_sw"
          type="number"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Szerokość przekroju b [mm]"
          name="b"
          type="number"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Efektywna wysokość d [mm]"
          name="d"
          type="number"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="fck [MPa]"
          name="fck"
          type="number"
          variant="outlined"
          fullWidth
        />

        <FormControlLabel
          control={<Checkbox />}
          label="Uwzględnić zbrojenie podłużne Asl?"
          sx={{ color: 'text.primary' }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Przycisk oblicz */}
      <Box align="center">
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.light' },
          }}
        >
          Oblicz
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

export default Slicing;