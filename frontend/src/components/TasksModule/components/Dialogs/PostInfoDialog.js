import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { format } from 'date-fns';

const PostInfoDialog = ({ open, post, onClose }) => {
  if (!post) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Informacje o poście</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography>
          <strong>Data:</strong> {format(new Date(post.post_date), 'dd-MM-yyyy')}
        </Typography>
        <Typography>
          <strong>Zadanie:</strong> {post.assigned_task?.name || 'Brak'}
        </Typography>
        <Typography>
          <strong>Godziny pracy:</strong> {post.work_hours}
        </Typography>
        {post.comment && (
          <Typography>
            <strong>Komentarz:</strong> {post.comment}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostInfoDialog;
