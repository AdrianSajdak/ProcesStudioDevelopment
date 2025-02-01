import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import * as tasksApi from '../../api/tasksApi';

const TASK_STATUSES = ['OPEN', 'SUSPENDED', 'CLOSED'];

const AddTaskTab = ({ projects, users, onTaskAdded }) => {
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('OPEN');
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    if (!projectId || !userId || !name) {
      alert('Proszę wypełnić wymagane pola: projekt, pracownik, nazwa zadania.');
      return;
    }
    const payload = {
      assigned_project_id: projectId,
      assigned_user_id: userId,
      name,
      description,
      status,
    };

    setLoading(true);
    try {
      await tasksApi.createTask(payload);
      alert('Zadanie dodane pomyślnie!');
      // Zerujemy pola formularza
      setProjectId('');
      setUserId('');
      setName('');
      setDescription('');
      setStatus('OPEN');
      if (onTaskAdded) {
        onTaskAdded(); // np. odświeżenie listy zadań w nadrzędnym komponencie
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Nie udało się dodać zadania.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Dodaj Zadanie
      </Typography>
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
        <Grid item xs={12} md={6}>
          <TextField
            label="Nazwa zadania"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              {TASK_STATUSES.map((st) => (
                <MenuItem key={st} value={st}>
                  {st}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Opis zadania"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="contained" onClick={handleAddTask} disabled={loading}>
          {loading ? 'Dodawanie...' : 'Dodaj Zadanie'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddTaskTab;
