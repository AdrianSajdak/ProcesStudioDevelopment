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

const TASK_STATUSES = ['OPEN', 'SUSPENDED', 'CLOSED'];

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
      <DialogTitle>Edycja zadania</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Nazwa zadania"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
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
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
            {TASK_STATUSES.map((st) => (
              <MenuItem key={st} value={st}>
                {st}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button variant="contained" onClick={handleSave}>
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEditDialog;