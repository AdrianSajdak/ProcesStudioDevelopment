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

const PostInfoDialog = ({ open, post, onClose }) => {
  if (!post) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd', { locale: pl });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>Szczegóły Posta</DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper} sx={{ maxWidth: 450, margin: '0 auto' }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Zadanie:</TableCell>
                <TableCell>{post.assigned_task?.name || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Data:</TableCell>
                <TableCell>{formatDate(post.post_date)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Czas pracy:</TableCell>
                <TableCell>{post.work_hours || '-'}</TableCell>
              </TableRow>
              {post.comment && (
                <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Opis:</TableCell>
                <TableCell>{post.comment || '-'}</TableCell>
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
    </Dialog>
  );
};

export default PostInfoDialog;
