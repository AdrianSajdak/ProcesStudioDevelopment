import React, { useState, useEffect } from 'react';
import * as tasksApi from '../../api/tasksApi';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import { format } from 'date-fns';
import { VACATION_TYPES, VACATION_STATUS } from '../Variables';

const VacationInfoDialog = ({ open, vacation, userRole, onClose, onApprove, onDeny }) => {
  const [dateRange, setDateRange] = useState({ startDate: '-', endDate: '-' });

  const getVacationTypeLabel = (type) => {
    const vacationType = VACATION_TYPES.find(vt => vt.value === type);
    return vacationType ? vacationType.label : '-';
  };

  useEffect(() => {
    const fetchVacations = async () => {
      if (vacation?.vacation_group_id) {
        try {
          const data = await tasksApi.fetchVacationsByGroupId(vacation.vacation_group_id);
          if (data.length > 0) {
            const dates = data.map(v => new Date(v.vacation_date));
            const startDate = format(new Date(Math.min(...dates)), 'dd.MM.yyyy');
            const endDate = format(new Date(Math.max(...dates)), 'dd.MM.yyyy');
            setDateRange({ startDate, endDate });
          }
        } catch (error) {
          console.error('Error fetching vacations:', error);
        }
      }
    };
  
    fetchVacations();
  }, [vacation]);
  if (!vacation) return null;
  
  const isPending = vacation.status === 'PENDING';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      {userRole === 'Boss' && isPending ? (
        <>
          <DialogTitle sx={{ textAlign: 'center' }}>Zatwierdzenie urlopu</DialogTitle>
          <DialogContent dividers>
            <TableContainer component={Paper} sx={{ maxWidth: 450, margin: '0 auto' }}>
              <Table size="small">
                <TableBody>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Pracownik:</TableCell>
                    <TableCell>{vacation.assigned_user?.username || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Data rozpoczęcia:</TableCell>
                    <TableCell>{dateRange.startDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Data zakończenia:</TableCell>
                    <TableCell>{dateRange.endDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Typ:</TableCell>
                    <TableCell>{getVacationTypeLabel(vacation.type)}</TableCell>
                  </TableRow>
                  {vacation.comments && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Opis:</TableCell>
                      <TableCell>{vacation.comments || '-'}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
              onClick={onClose}
              variant="outlined"
              color="violet.dark"
              sx={{
                color: 'violet.dark',
                '&:hover': { color: 'violet.light' },
              }}
            >
              Anuluj
            </Button>
            <Button variant="contained" color="error" onClick={onDeny}>
              Odrzuć
            </Button>
            <Button variant="contained" color="success" onClick={onApprove}>
              Zatwierdź
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle sx={{ textAlign: 'center' }}>Informacje o urlopie</DialogTitle>
          <DialogContent dividers>
            <TableContainer component={Paper} sx={{ maxWidth: 450, margin: '0 auto' }}>
              <Table size="small">
                <TableBody>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Pracownik:</TableCell>
                    <TableCell>{vacation.assigned_user?.username || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Data rozpoczęcia:</TableCell>
                    <TableCell>{dateRange.startDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Data zakończenia:</TableCell>
                    <TableCell>{dateRange.endDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Typ:</TableCell>
                    <TableCell>{getVacationTypeLabel(vacation.type)}</TableCell>
                  </TableRow>
                  {vacation.comments && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Opis:</TableCell>
                      <TableCell>{vacation.comments || '-'}</TableCell>
                    </TableRow>
                  )}
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
        </>
      )}
    </Dialog>
  );
};

export default VacationInfoDialog;
