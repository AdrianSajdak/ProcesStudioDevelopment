import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const PostEditDialog = ({ open, post, onClose, onSave }) => {
  const [workHours, setWorkHours] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (post) {
      setWorkHours(post.work_hours || '');
      setComment(post.comment || '');
    }
  }, [post]);

  const handleSave = () => {
    onSave({ work_hours: workHours, comment });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Edycja Posta</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Godziny"
          type="number"
          value={workHours}
          onChange={(e) => setWorkHours(e.target.value)}
          autoFocus
          margin='dense'
        />
        <TextField
          label="Komentarz"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={3}
        />
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
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.light' },
          }}
        >
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostEditDialog;
