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

function Slicing() {
  return (
    <Box sx={{ maxWidth: 500, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        [SGN] Ścinanie
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Wejścia (żółte) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="VEd [kN]"
          name="VEd"
          type="number"
        />
        <TextField
          label="Liczba ramion strzemion"
          name="n_sw"
          type="number"
        />
        <TextField
          label="Średnica strzemienia [mm]"
          name="phi_sw"
          type="number"
        />
        <TextField
          label="Szerokość przekroju b [mm]"
          name="b"
          type="number"
        />
        <TextField
          label="Efektywna wysokość d [mm]"
          name="d"
          type="number"
        />
        <TextField
          label="fck [MPa]"
          name="fck"
          type="number"
        />

        {/* Checkbox (czerwony) */}
        <FormControlLabel
          control={
            <Checkbox/>
          }
          label="Uwzględnić zbrojenie podłużne Asl?"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Przycisk oblicz */}
      <Box align='center'>
        <Button variant="contained">
          Oblicz
        </Button>
      </Box>
      

      <Divider sx={{ my: 2 }} />

    </Box>
  );
}

export default Slicing;
