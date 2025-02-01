import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem as MUIMenuItem } from '@mui/material';
import { format } from 'date-fns';

const AddPostDialog = ({ open, date, tasks, onClose, onAdd }) => {
  const [taskId, setTaskId] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [comment, setComment] = useState('');

  const handleAdd = () => {
    onAdd({
      assigned_task_id: taskId,
      work_hours: workHours,
      comment,
      post_date: date.toISOString(),
    });
    setTaskId('');
    setWorkHours('');
    setComment('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Dodaj Post</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Data"
          value={date ? format(date, 'yyyy-MM-dd') : ''}
          InputProps={{ readOnly: true }}
        />
        <FormControl fullWidth>
          <InputLabel>Zadanie</InputLabel>
          <Select value={taskId} label="Zadanie" onChange={(e) => setTaskId(e.target.value)}>
            {tasks.map((t) => (
              <MUIMenuItem key={t.task_id} value={t.task_id}>
                {t.name}
              </MUIMenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Godziny"
          type="number"
          value={workHours}
          onChange={(e) => setWorkHours(e.target.value)}
        />
        <TextField
          label="Komentarz"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={3}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button variant="contained" onClick={handleAdd}>
          Dodaj Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPostDialog;
