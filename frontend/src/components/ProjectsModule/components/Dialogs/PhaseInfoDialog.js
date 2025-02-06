// src/components/Dialogs/PhaseInfoDialog.js
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

const PhaseInfoDialog = ({ open, phase, onClose }) => {
  if (!phase) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>Szczegóły Fazy</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{phase.name}</Typography>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: 450, margin: '0 auto' }}>
          <Table size="small">
            <TableBody>
            <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Projekt:</TableCell>
                <TableCell>{phase.assigned_project?.name || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Cena:</TableCell>
                <TableCell>{phase.price || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Typ:</TableCell>
                <TableCell>{phase.type || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Status:</TableCell>
                <TableCell>{phase.status || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Czas trwania:</TableCell>
                <TableCell>{phase.start_date || '-'} - {phase.end_date || '-'}</TableCell>
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

export default PhaseInfoDialog;
