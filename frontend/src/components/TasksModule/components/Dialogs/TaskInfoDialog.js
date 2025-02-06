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

import { parseISO, format } from 'date-fns';
import { pl } from 'date-fns/locale';

const TaskInfoDialog = ({ open, task, onClose }) => {
  if (!task) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = parseISO(dateString);
    return format(date, 'yyyy.MM.dd -- HH:mm:ss', { locale: pl });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>Szczegóły Zadania</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{task.name}</Typography>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: 450, margin: '0 auto' }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Projekt:</TableCell>
                <TableCell>{task.assigned_project?.name || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Pracownik:</TableCell>
                <TableCell>{task.assigned_user?.username || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Status:</TableCell>
                <TableCell>{task.status || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Data modyfikacji:</TableCell>
                <TableCell>{formatDate(task.last_modification_date)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Czas pracy:</TableCell>
                <TableCell>{task.total_hours || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Opis:</TableCell>
                <TableCell>{task.description || '-'}</TableCell>
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

export default TaskInfoDialog;
