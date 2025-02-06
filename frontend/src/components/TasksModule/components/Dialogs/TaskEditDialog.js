import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import { TASK_STATUS } from '../Variables';

const TaskEditDialog = ({ open, task, projects, users, onClose, onSave }) => {
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('OPEN');

  useEffect(() => {
    if (task) {
      setProjectId(task.assigned_project?.project_id || '');
      setUserId(task.assigned_user?.user_id || '');
      setName(task.name || '');
      setDescription(task.description || '');
      setStatus(task.status || 'OPEN');
    }
  }, [task]);

  const handleSave = () => {
    onSave({
      assigned_project_id: projectId,
      assigned_user_id: userId,
      name,
      description,
      status,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Edycja zadania</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Nazwa zadania"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              autoFocus
              margin='dense'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              autoFocus
              margin='dense'
            >
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                {Object.entries(TASK_STATUS).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Projekt</InputLabel>
              <Select
                value={projectId}
                label="Projekt"
                onChange={(e) => setProjectId(e.target.value)}
              >
                {projects.map((p) => (
                  <MenuItem key={p.project_id} value={p.project_id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Pracownik</InputLabel>
              <Select
                value={userId}
                label="Pracownik"
                onChange={(e) => setUserId(e.target.value)}
              >
                {users.map((u) => (
                  <MenuItem key={u.user_id} value={u.user_id}>
                    {u.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TextField
          label="Opis zadania"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
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
          sx={{
            backgroundColor: 'violet.main',
            '&:hover': { backgroundColor: 'violet.light' },
          }}
          onClick={handleSave}
        >
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEditDialog;