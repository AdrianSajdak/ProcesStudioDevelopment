import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';

const ClientInfoDialog = ({ open, onClose, clientData }) => {
  const address = `${clientData.city || '-'} ${clientData.postcode || '-'}, ${clientData.street || '-'}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>Szczegóły Klienta</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{clientData.name}</Typography>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: 450, margin: '0 auto' }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>NIP:</TableCell>
                <TableCell>{clientData.nip || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Adres:</TableCell>
                <TableCell>{address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Kontakt:</TableCell>
                <TableCell>{clientData.contact_person || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Email:</TableCell>
                <TableCell>{clientData.contact_email || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Opis:</TableCell>
                <TableCell>{clientData.description || '-'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.light' },
          }}
        >
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientInfoDialog;