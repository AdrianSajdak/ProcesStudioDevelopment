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

const ProjectInfoDialog = ({ open, project, onClose }) => {
  if (!project) return null;

  const address = `${project.city || '-'} ${project.postcode || '-'}, ${project.street || '-'}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>Szczegóły Projektu</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{project.name}</Typography>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: 450, margin: '0 auto' }}>
          <Table size="small">
            <TableBody>
            <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Klient:</TableCell>
                <TableCell>{project.assigned_client?.name || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Adres:</TableCell>
                <TableCell>{address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Kontakt:</TableCell>
                <TableCell>{project.status || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Email:</TableCell>
                <TableCell>{project.area || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Opis:</TableCell>
                <TableCell>{project.comments || '-'}</TableCell>
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

export default ProjectInfoDialog;
