import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { format } from 'date-fns';

const VacationInfoDialog = ({ open, vacation, userRole, onClose, onApprove, onDeny }) => {
  if (!vacation) return null;
  const isPending = vacation.status === 'PENDING';
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {userRole === 'Boss' && isPending ? (
        <>
          <DialogTitle>Zatwierdzenie urlopu</DialogTitle>
          <DialogContent>
            <Typography>
              <strong>Pracownik:</strong> {vacation.assigned_user?.username || 'N/A'}
            </Typography>
            <Typography>
              <strong>Status:</strong> {vacation.status}
            </Typography>
            <Typography>
              <strong>Data:</strong> {format(new Date(vacation.vacation_date), 'dd-MM-yyyy')}
            </Typography>
            <Typography>
              <strong>Czas trwania:</strong> {vacation.duration}h
            </Typography>
            {vacation.comments && (
              <Typography>
                <strong>Komentarz:</strong> {vacation.comments}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Anuluj</Button>
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
          <DialogTitle>Informacje o urlopie</DialogTitle>
          <DialogContent>
            <Typography>
              <strong>Pracownik:</strong> {vacation.assigned_user?.username || 'N/A'}
            </Typography>
            <Typography>
              <strong>Status:</strong> {vacation.status}
            </Typography>
            <Typography>
              <strong>Data:</strong> {format(new Date(vacation.vacation_date), 'dd-MM-yyyy')}
            </Typography>
            <Typography>
              <strong>Czas trwania:</strong> {vacation.duration}h
            </Typography>
            {vacation.comments && (
              <Typography>
                <strong>Komentarz:</strong> {vacation.comments}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Zamknij</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default VacationInfoDialog;
