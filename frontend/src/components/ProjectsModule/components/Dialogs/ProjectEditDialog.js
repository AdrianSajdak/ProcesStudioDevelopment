import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

const PROJECT_TYPES = [
  'MIESZKANIOWY',
  'BLOKOWY',
  'DOM',
  'HALA',
  'PUBLICZNY',
  'INNY',
];
const PROJECT_STATUSES = ['OPEN', 'SUSPENDED', 'CLOSED'];

const ProjectEditDialog = ({ open, project, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('DOM');
  const [status, setStatus] = useState('OPEN');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [postcode, setPostcode] = useState('');
  const [area, setArea] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setType(project.type || 'DOM');
      setStatus(project.status || 'OPEN');
      setCity(project.city || '');
      setStreet(project.street || '');
      setPostcode(project.postcode || '');
      setArea(project.area || '');
      setComments(project.comments || '');
    }
  }, [project]);

  const handleSave = () => {
    const updatedProject = {
      name,
      type,
      status,
      city,
      street,
      postcode,
      area,
      comments,
    };
    onSave(project, updatedProject);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Edytuj Projekt</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '1rem' }}
      >
        <TextField
          label="Nazwa projektu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          autoFocus
          margin="dense"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Typ</InputLabel>
              <Select
                value={type}
                label="Typ"
                onChange={(e) => setType(e.target.value)}
              >
                {PROJECT_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                {PROJECT_STATUSES.map((st) => (
                  <MenuItem key={st} value={st}>
                    {st}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Miasto"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Kod pocztowy"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Ulica"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <TextField
          label="Powierzchnia m2"
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          fullWidth
        />
        <TextField
          label="Komentarze"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          multiline
          rows={3}
          fullWidth
          inputProps={{
            style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
          }}
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
          onClick={handleSave}
          variant="contained"
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

export default ProjectEditDialog;