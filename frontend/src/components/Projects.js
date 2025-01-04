import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  InputLabel,
  FormControl,
  MenuItem as MUIMenuItem
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';
import AxiosInstance from '../Axios';

// Statusy faz
const PHASE_STATUSES = ['OPEN', 'SUSPENDED', 'CLOSED'];
const PHASE_TYPES = ['KONSULTACJE', 'PLANOWANIE', 'POPRAWKI', 'PODSUMOWANIE'];

// Statusy projektów
const PROJECT_STATUSES = ['OPEN', 'SUSPENDED', 'CLOSED'];
const PROJECT_TYPES = [
  'MIESZKANIOWY',
  'BLOKOWY',
  'DOM',
  'HALA',
  'PUBLICZNY',
  'INNY',
];

function Projects() {
  const theme = useTheme();

  const [userRole, setUserRole] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // ====== Projekty ======
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Fazy (analogicznie do postsByTask -> phasesByProject)
  const [phasesByProject, setPhasesByProject] = useState({});

  // ====== Klienci ======
  const [clients, setClients] = useState([]);

  // ====== Dodaj Fazę ======
  const [newPhaseAssignedProject, setNewPhaseAssignedProject] = useState('');
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newPhasePrice, setNewPhasePrice] = useState('');
  const [newPhaseType, setNewPhaseType] = useState('KONSULTACJE');
  const [newPhaseStatus, setNewPhaseStatus] = useState('OPEN');
  // Nowe pola
  const [newPhaseStartDate, setNewPhaseStartDate] = useState('');
  const [newPhaseEndDate, setNewPhaseEndDate] = useState('');

  // ====== Dodaj Projekt ======
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState('DOM');
  const [newProjectStatus, setNewProjectStatus] = useState('OPEN');
  const [newProjectCity, setNewProjectCity] = useState('');
  const [newProjectStreet, setNewProjectStreet] = useState('');
  const [newProjectComments, setNewProjectComments] = useState('');
  const [newProjectPostcode, setNewProjectPostcode] = useState('');
  const [newProjectArea, setNewProjectArea] = useState('');
  const [newProjectAssignedClient, setNewProjectAssignedClient] = useState('');

  // ====== Edycja Projektu ======
  const [menuAnchorProject, setMenuAnchorProject] = useState(null);
  const [selectedProjectForMenu, setSelectedProjectForMenu] = useState(null);

  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectType, setEditProjectType] = useState('DOM');
  const [editProjectStatus, setEditProjectStatus] = useState('OPEN');
  const [editProjectCity, setEditProjectCity] = useState('');
  const [editProjectStreet, setEditProjectStreet] = useState('');
  const [editProjectComments, setEditProjectComments] = useState('');
  // Nowe pola
  const [editProjectPostcode, setEditProjectPostcode] = useState('');
  const [editProjectArea, setEditProjectArea] = useState('');

  // ====== Edycja Faz ======
  const [menuAnchorPhase, setMenuAnchorPhase] = useState(null);
  const [selectedPhaseForMenu, setSelectedPhaseForMenu] = useState(null);

  const [openPhaseDialog, setOpenPhaseDialog] = useState(false);
  const [editPhaseName, setEditPhaseName] = useState('');
  const [editPhasePrice, setEditPhasePrice] = useState('');
  const [editPhaseType, setEditPhaseType] = useState('KONSULTACJE');
  const [editPhaseStatus, setEditPhaseStatus] = useState('OPEN');
  // Nowe pola
  const [editPhaseStartDate, setEditPhaseStartDate] = useState('');
  const [editPhaseEndDate, setEditPhaseEndDate] = useState('');

  // ----------------- Load Data -----------------
  useEffect(() => {
    AxiosInstance.get('/users/me/')
      .then((res) => {
        setUserRole(res.data.role);
      })
      .catch((err) => console.error('Error fetching user role:', err));

    // Pobierz projekty
    AxiosInstance.get('/projects/')
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => console.error('Error fetching projects:', err));

    AxiosInstance.get('/clients/')
      .then((res) => {
        setClients(res.data);
      })
      .catch((err) => console.error('Error fetching clients:', err));
  }, []);

  // Obsługa zakładek
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // ========== LISTA PROJEKTÓW (zakładka 0) ==========
  const handleExpandProject = (projectId, expanded) => {
    // Jeśli user nie jest Boss, w ogóle nie rozkłada akordeonu
    if (userRole !== 'Boss') {
      return;
    }
    if (expanded) {
      setSelectedProjectId(projectId);
      AxiosInstance.get(`/phases/?assigned_project=${projectId}`)
        .then((res) => {
          setPhasesByProject((prev) => ({
            ...prev,
            [projectId]: res.data,
          }));
        })
        .catch((err) => console.error('Error fetching phases:', err));
    } else {
      setSelectedProjectId(null);
    }
  };

  const getPhasesForProject = (projectId) => {
    return phasesByProject[projectId] || [];
  };

  // ========== Menu w Projekcie (MoreVert) ==========
  const handleProjectMenuClick = (event, project) => {
    event.stopPropagation(); // aby nie otwierać akordeonu
    setMenuAnchorProject(event.currentTarget);
    setSelectedProjectForMenu(project);
  };

  const handleProjectMenuClose = () => {
    setMenuAnchorProject(null);
    // nie resetujemy selectedProjectForMenu, bo może być jeszcze potrzebne
  };

  const handleProjectEditClick = () => {
    if (!selectedProjectForMenu) return;
    const p = selectedProjectForMenu;

    setEditProjectName(p.name || '');
    setEditProjectType(p.type || 'DOM');
    setEditProjectStatus(p.status || 'OPEN');
    setEditProjectCity(p.city || '');
    setEditProjectStreet(p.street || '');
    setEditProjectComments(p.comments || '');
    setEditProjectPostcode(p.postcode || '');
    setEditProjectArea(p.area || '');

    setOpenProjectDialog(true);
    handleProjectMenuClose();
  };

  const handleSaveProjectChanges = () => {
    if (!selectedProjectForMenu) return;

    const body = {
      name: editProjectName,
      type: editProjectType,
      status: editProjectStatus,
      city: editProjectCity,
      street: editProjectStreet,
      comments: editProjectComments,
      postcode: editProjectPostcode,
      area: editProjectArea
    };

    AxiosInstance.patch(`/projects/${selectedProjectForMenu.project_id}/`, body)
      .then(() => {
        return AxiosInstance.get('/projects/');
      })
      .then((res) => {
        setProjects(res.data);
        setOpenProjectDialog(false);
        setSelectedProjectForMenu(null);
        alert('Projekt zaktualizowany pomyślnie!');
      })
      .catch((err) => {
        console.error('Error updating project:', err?.response?.data || err);
        alert(
          'Nie udało się zaktualizować projektu: ' +
            (err?.response?.data?.detail || '')
        );
        setSelectedProjectForMenu(null);
      });
  };

  // ========== Menu w Fazie (MoreVert) ==========
  const handlePhaseMenuClick = (event, phase) => {
    event.stopPropagation();
    setMenuAnchorPhase(event.currentTarget);
    setSelectedPhaseForMenu(phase);
  };

  const handlePhaseMenuClose = () => {
    setMenuAnchorPhase(null);
  };

  // Edycja fazy
  const handlePhaseEditClick = () => {
    if (!selectedPhaseForMenu) return;
    const ph = selectedPhaseForMenu;

    setEditPhaseName(ph.name || '');
    setEditPhasePrice(ph.price || '');
    setEditPhaseType(ph.type || 'KONSULTACJE');
    setEditPhaseStatus(ph.status || 'OPEN');
    // Nowe pola
    setEditPhaseStartDate(ph.start_date || '');
    setEditPhaseEndDate(ph.end_date || '');

    setOpenPhaseDialog(true);
    handlePhaseMenuClose();
  };

  const handleSavePhaseChanges = () => {
    if (!selectedPhaseForMenu) return;

    const body = {
      name: editPhaseName,
      price: editPhasePrice,
      type: editPhaseType,
      status: editPhaseStatus,
      start_date: editPhaseStartDate || null,
      end_date: editPhaseEndDate || null
    };

    const realProjectId =
      selectedPhaseForMenu.assigned_project?.project_id ||
      selectedPhaseForMenu.assigned_project;

    AxiosInstance.patch(`/phases/${selectedPhaseForMenu.phase_id}/`, body)
      .then(() => {
        return AxiosInstance.get(`/phases/?assigned_project=${realProjectId}`);
      })
      .then((res) => {
        setPhasesByProject((prev) => ({
          ...prev,
          [realProjectId]: res.data,
        }));
        setOpenPhaseDialog(false);
        setSelectedPhaseForMenu(null);
        alert('Faza zaktualizowana pomyślnie!');
      })
      .catch((err) => {
        console.error('Error updating phase:', err?.response?.data || err);
        alert(
          'Nie udało się zaktualizować fazy: ' +
            (err?.response?.data?.detail || '')
        );
        setSelectedPhaseForMenu(null);
      });
  };

  // ========== DODAJ FAZĘ (zakładka 1) ========== (tylko Boss)
  const handleAddPhase = () => {
    if (!newPhaseAssignedProject) {
      alert('Wybierz projekt');
      return;
    }
    if (!newPhaseName) {
      alert('Podaj nazwę fazy');
      return;
    }

    const body = {
      assigned_project_id: newPhaseAssignedProject,
      name: newPhaseName,
      price: newPhasePrice,
      type: newPhaseType,
      status: newPhaseStatus,
      start_date: newPhaseStartDate || null,
      end_date: newPhaseEndDate || null
    };

    AxiosInstance.post('/phases/', body)
      .then(() => {
        alert('Faza dodana!');
        // reset
        setNewPhaseAssignedProject('');
        setNewPhaseName('');
        setNewPhasePrice('');
        setNewPhaseType('KONSULTACJE');
        setNewPhaseStatus('OPEN');
        setNewPhaseStartDate('');
        setNewPhaseEndDate('');
      })
      .catch((err) => {
        console.error('Error creating phase:', err?.response?.data || err);
        alert(
          'Nie udało się dodać fazy: ' +
            (err?.response?.data?.detail || '')
        );
      });
  };

  // ========== DODAJ PROJEKT (zakładka 2) ========== (tylko Boss)
  const handleAddProject = () => {
    if (!newProjectName) {
      alert('Podaj nazwę projektu');
      return;
    }

    const body = {
      name: newProjectName,
      type: newProjectType,
      status: newProjectStatus,
      city: newProjectCity,
      street: newProjectStreet,
      comments: newProjectComments,
      postcode: newProjectPostcode,
      area: newProjectArea,
      assigned_client_id: newProjectAssignedClient,
    };

    AxiosInstance.post('/projects/', body)
      .then(() => {
        alert('Projekt dodany!');
        setNewProjectName('');
        setNewProjectType('DOM');
        setNewProjectStatus('OPEN');
        setNewProjectCity('');
        setNewProjectStreet('');
        setNewProjectComments('');
        setNewProjectPostcode('');
        setNewProjectArea('');
        setNewProjectAssignedClient('');
        return AxiosInstance.get('/projects/');
      })
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => {
        console.error('Error creating project:', err?.response?.data || err);
        alert(
          'Nie udało się dodać projektu. ' +
            (err?.response?.data?.detail || 'Sprawdź uprawnienia.')
        );
      });
  };

  // Dynamika etykiet zakładek
  // 0: Lista projektów
  // 1: Dodaj Fazę (tylko Boss)
  // 2: Dodaj Projekt (tylko Boss)
  const tabLabels = ['Lista projektów'];
  if (userRole === 'Boss') {
    tabLabels.push('Dodaj Fazę');
    tabLabels.push('Dodaj Projekt');
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
        Panel Projektów
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        textColor="inherit"
        sx={{ marginBottom: 2 }}
        TabIndicatorProps={{ style: { backgroundColor: theme.palette.violet.light } }}
      >
        {tabLabels.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>

      {/* ZAKŁADKA 0: LISTA PROJEKTÓW */}
      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          {/* Jeśli user to Boss -> 2 kolumny: Projekty (lewa), Fazy (prawa) */}
          {userRole === 'Boss' ? (
            <Grid container spacing={2} sx={{ minHeight: 500 }}>
              {/* Lewa połowa: Projekty */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                  Lista projektów
                </Typography>
                {projects.map((project) => (
                  <Accordion
                    key={project.project_id}
                    onChange={(_, expanded) =>
                      handleExpandProject(project.project_id, expanded)
                    }
                    sx={{ mb: 1 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        sx={{
                          display: 'flex',
                          width: '100%',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {project.name} ({project.type})
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProjectMenuClick(e, project);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>Status: {project.status}</Typography>
                      <Typography>Adres: {project.city || '-'} {project.postcode || '-'}, ul. {project.street || '-'}</Typography>
                      <Typography>Powierzchnia: {project.area || '-'}</Typography>
                      <Typography>Komentarze: {project.comments || '-'}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>

              {/* Prawa połowa: Fazy dla wybranego projektu */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                  Fazy projektu
                </Typography>
                {selectedProjectId ? (
                  <>
                    {getPhasesForProject(selectedProjectId).length === 0 ? (
                      <Typography
                        variant="body1"
                        sx={{ textAlign: 'center', mt: 2 }}
                      >
                        Brak faz dla tego projektu
                      </Typography>
                    ) : (
                      getPhasesForProject(selectedProjectId).map((phase) => (
                        <Accordion key={phase.phase_id} sx={{ mb: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box
                              sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography>
                                {phase.name} ({phase.type})
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  handlePhaseMenuClick(ev, phase);
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>Cena: {phase.price || '-'}</Typography>
                            <Typography>Status: {phase.status}</Typography>
                            <Typography>
                              Data rozpoczęcia: {phase.start_date || '-'}
                            </Typography>
                            <Typography>
                              Data zakończenia: {phase.end_date || '-'}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))
                    )}
                  </>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ textAlign: 'center', mt: 2 }}
                  >
                    Wybierz projekt z listy po lewej, aby zobaczyć fazy
                  </Typography>
                )}
              </Grid>
            </Grid>
          ) : (
            // Jeśli user nie jest Boss -> pełna szerokość, bez faz
            <Box sx={{ minHeight: 500 }}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Lista projektów
              </Typography>
              {projects.map((project) => (
                <Box
                  key={project.project_id}
                  sx={{
                    border: '1px solid #ccc',
                    p: 2,
                    mb: 2,
                    borderRadius: '4px',
                  }}
                >
                  <Typography variant="subtitle1">
                    {project.name} ({project.type})
                  </Typography>
                  <Typography>Status: {project.status}</Typography>
                  <Typography>Adres: {project.city || '-'} {project.postcode || '-'}, ul. {project.street || '-'}</Typography>
                  <Typography>Powierzchnia: {project.area || '-'}</Typography>
                  <Typography>Komentarze: {project.comments || '-'}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* ZAKŁADKA 1: DODAJ FAZĘ (tylko Boss) */}
      {userRole === 'Boss' && tabValue === 1 && (
        <Box sx={{ mt: 3, maxWidth: 600, margin: '0 auto' }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Dodaj Fazę
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Projekt</InputLabel>
                <Select
                  value={newPhaseAssignedProject}
                  label="Projekt"
                  onChange={(e) => setNewPhaseAssignedProject(e.target.value)}
                >
                  {projects.map((p) => (
                    <MUIMenuItem key={p.project_id} value={p.project_id}>
                      {p.name}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                label="Nazwa fazy"
                value={newPhaseName}
                onChange={(e) => setNewPhaseName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                label="Cena"
                type="number"
                value={newPhasePrice}
                onChange={(e) => setNewPhasePrice(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Typ</InputLabel>
                <Select
                  value={newPhaseType}
                  label="Typ"
                  onChange={(e) => setNewPhaseType(e.target.value)}
                >
                  {PHASE_TYPES.map((t) => (
                    <MUIMenuItem key={t} value={t}>
                      {t}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newPhaseStatus}
                  label="Status"
                  onChange={(e) => setNewPhaseStatus(e.target.value)}
                >
                  {PHASE_STATUSES.map((st) => (
                    <MUIMenuItem key={st} value={st}>
                      {st}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Data rozpoczęcia (YYYY-MM-DD)"
                value={newPhaseStartDate}
                onChange={(e) => setNewPhaseStartDate(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Data zakończenia (YYYY-MM-DD)"
                value={newPhaseEndDate}
                onChange={(e) => setNewPhaseEndDate(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'violet.main',
                '&:hover': { backgroundColor: 'violet.light' },
              }}
              onClick={handleAddPhase}
            >
              Dodaj Fazę
            </Button>
          </Box>
        </Box>
      )}

      {/* ZAKŁADKA 2: DODAJ PROJEKT (tylko Boss) */}
      {userRole === 'Boss' && tabValue === 2 && (
        <Box sx={{ mt: 3, maxWidth: 600, margin: '0 auto' }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Dodaj Projekt
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nazwa projektu"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Klient</InputLabel>
                <Select
                  value={newProjectAssignedClient}
                  label="Klient"
                  onChange={(e) => setNewProjectAssignedClient(e.target.value)}
                >
                  {clients.map((c) => (
                    <MenuItem key={c.client_id} value={c.client_id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Typ</InputLabel>
                <Select
                  value={newProjectType}
                  label="Typ"
                  onChange={(e) => setNewProjectType(e.target.value)}
                >
                  {PROJECT_TYPES.map((t) => (
                    <MUIMenuItem key={t} value={t}>
                      {t}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newProjectStatus}
                  label="Status"
                  onChange={(e) => setNewProjectStatus(e.target.value)}
                >
                  {PROJECT_STATUSES.map((st) => (
                    <MUIMenuItem key={st} value={st}>
                      {st}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Miasto"
                value={newProjectCity}
                onChange={(e) => setNewProjectCity(e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Kod pocztowy"
                value={newProjectPostcode}
                onChange={(e) => setNewProjectPostcode(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Ulica"
                value={newProjectStreet}
                onChange={(e) => setNewProjectStreet(e.target.value)}
                fullWidth
              />
            </Grid>

            
            <Grid item xs={12} md={12}>
              <TextField
                label="Powierzchnia m2"
                type="number"
                value={newProjectArea}
                onChange={(e) => setNewProjectArea(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Komentarze"
                value={newProjectComments}
                onChange={(e) => setNewProjectComments(e.target.value)}
                fullWidth
                multiline
                rows={3}
                inputProps={{
                  style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'violet.main',
                '&:hover': { backgroundColor: 'violet.light' },
              }}
              onClick={handleAddProject}
            >
              Dodaj Projekt
            </Button>
          </Box>
        </Box>
      )}

      {/* Menu Projektu */}
      <Menu
        anchorEl={menuAnchorProject}
        open={Boolean(menuAnchorProject)}
        onClose={handleProjectMenuClose}
      >
        <MenuItem onClick={handleProjectEditClick}>Edytuj projekt</MenuItem>
      </Menu>

      {/* Dialog Edycji Projektu */}
      <Dialog
        open={openProjectDialog}
        onClose={() => setOpenProjectDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{textAlign: 'center'}}>Edytuj Projekt</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '1rem' }}>
          <TextField
            label="Nazwa projektu"
            value={editProjectName}
            onChange={(e) => setEditProjectName(e.target.value)}
            fullWidth
            autoFocus
            margin="dense"
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Typ</InputLabel>
                <Select
                  value={editProjectType}
                  label="Typ"
                  onChange={(e) => setEditProjectType(e.target.value)}
                >
                  {PROJECT_TYPES.map((t) => (
                    <MUIMenuItem key={t} value={t}>
                      {t}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editProjectStatus}
                  label="Status"
                  onChange={(e) => setEditProjectStatus(e.target.value)}
                >
                  {PROJECT_STATUSES.map((st) => (
                    <MUIMenuItem key={st} value={st}>
                      {st}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Miasto"
                value={editProjectCity}
                onChange={(e) => setEditProjectCity(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Kod pocztowy"
                value={editProjectPostcode}
                onChange={(e) => setEditProjectPostcode(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Ulica"
                value={editProjectStreet}
                onChange={(e) => setEditProjectStreet(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
          
          <TextField
            label="Powierzchnia m2"
            type="number"
            value={editProjectArea}
            onChange={(e) => setEditProjectArea(e.target.value)}
            fullWidth
          />
          <TextField
            label="Komentarze"
            value={editProjectComments}
            onChange={(e) => setEditProjectComments(e.target.value)}
            multiline
            rows={3}
            fullWidth
            inputProps={{
              style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProjectDialog(false)}>Anuluj</Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'violet.main',
              '&:hover': { backgroundColor: 'violet.light' },
            }}
            onClick={handleSaveProjectChanges}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu Faz */}
      <Menu
        anchorEl={menuAnchorPhase}
        open={Boolean(menuAnchorPhase)}
        onClose={handlePhaseMenuClose}
      >
        <MenuItem onClick={handlePhaseEditClick}>Edytuj fazę</MenuItem>
      </Menu>

      {/* Dialog Edycji Faz */}
      <Dialog
        open={openPhaseDialog}
        onClose={() => setOpenPhaseDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{textAlign: 'center'}}>Edytuj Fazę</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '1rem' }}
        >
          <TextField
            label="Nazwa fazy"
            value={editPhaseName}
            onChange={(e) => setEditPhaseName(e.target.value)}
            autoFocus
            margin="dense"
          />
          <TextField
            label="Cena"
            type="number"
            value={editPhasePrice}
            onChange={(e) => setEditPhasePrice(e.target.value)}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Typ</InputLabel>
                <Select
                  value={editPhaseType}
                  label="Typ"
                  onChange={(e) => setEditPhaseType(e.target.value)}
                >
                  {PHASE_TYPES.map((t) => (
                    <MUIMenuItem key={t} value={t}>
                      {t}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editPhaseStatus}
                  label="Status"
                  onChange={(e) => setEditPhaseStatus(e.target.value)}
                >
                  {PHASE_STATUSES.map((st) => (
                    <MUIMenuItem key={st} value={st}>
                      {st}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Data rozpoczęcia (YYYY-MM-DD)"
                value={editPhaseStartDate}
                onChange={(e) => setEditPhaseStartDate(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Data zakończenia (YYYY-MM-DD)"
                value={editPhaseEndDate}
                onChange={(e) => setEditPhaseEndDate(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPhaseDialog(false)}>Anuluj</Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'violet.main',
              '&:hover': { backgroundColor: 'violet.light' },
            }}
            onClick={handleSavePhaseChanges}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Projects;
