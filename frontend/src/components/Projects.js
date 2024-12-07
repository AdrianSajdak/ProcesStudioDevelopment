import React, { useState, useEffect } from 'react';
import AxiosInstance from '../Axios';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  Alert,
  Select,
  MenuItem
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const Projects = () => {
  const [tabValue, setTabValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    start_date: '',
    end_date: '',
    comments: '',
    status: '',
  });
  const [editProject, setEditProject] = useState({
    id: '',
    name: '',
    start_date: '',
    end_date: '',
    comments: '',
    status: '',
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [capabilities, setCapabilities] = useState(null); 
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    fetchUserAndCapabilities();
  }, []);

  useEffect(() => {
    if (capabilities && capabilities.can_view_projects) {
      fetchProjects();
    }
  }, [capabilities]);

  const fetchUserAndCapabilities = async () => {
    try {
      const response = await AxiosInstance.get('/user/');
      setCapabilities(response.data.capabilities);
    } catch (error) {
      console.error("Nie udało się pobrać informacji o użytkowniku:", error);
      setErrorMessage("Nie udało się pobrać informacji o użytkowniku. Upewnij się, że jesteś zalogowany.");
    }
  };

  const fetchProjects = async () => {
    setErrorMessage(null);
    try {
      const response = await AxiosInstance.get('/projects/');
      setProjects(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania projektów:', error);
      setErrorMessage('Nie udało się pobrać listy projektów. Spróbuj ponownie później.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setErrorMessage(null);
  };

  const handleExpandClick = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleInputChange = (event) => {
    setNewProject({
      ...newProject,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddProject = async () => {
    setErrorMessage(null);
    try {
      const response = await AxiosInstance.post('/projects/', newProject);
      setProjects((prevProjects) => [...prevProjects, response.data]);
      setNewProject({
        name: '',
        start_date: '',
        end_date: '',
        comments: '',
        status: '',
      });
      setTabValue(0);
    } catch (error) {
      console.error('Błąd podczas dodawania projektu:', error.response ? error.response.data : error);
      setErrorMessage('Nie udało się dodać projektu. Sprawdź dane i spróbuj ponownie.');
    }
  };

  const handleSelectProjectToEdit = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProjectId(projectId);
      setEditProject({
        id: project.id,
        name: project.name || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        comments: project.comments || '',
        status: project.status || '',
      });
    }
  };

  const handleEditInputChange = (event) => {
    setEditProject({
      ...editProject,
      [event.target.name]: event.target.value
    });
  };

  const handleEditProject = async () => {
    try {
      const response = await AxiosInstance.put(`/projects/${editProject.id}/`, editProject);
      setProjects((prev) => prev.map(p => p.id === editProject.id ? response.data : p));
      setErrorMessage(null);
      setTabValue(0);
      setEditProject({
        id: '',
        name: '',
        start_date: '',
        end_date: '',
        comments: '',
        status: ''
      });
      setSelectedProjectId(null);
    } catch (error) {
      console.error("Błąd podczas edycji projektu:", error.response ? error.response.data : error);
      setErrorMessage('Nie udało się edytować projektu. Sprawdź dane i spróbuj ponownie.');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await AxiosInstance.delete(`/projects/${editProject.id}/`);
      setProjects((prev) => prev.filter(p => p.id !== editProject.id));
      setErrorMessage(null);
      setTabValue(0);
      setEditProject({
        id: '',
        name: '',
        start_date: '',
        end_date: '',
        comments: '',
        status: ''
      });
      setSelectedProjectId(null);
    } catch (error) {
      console.error("Błąd podczas usuwania projektu:", error.response ? error.response.data : error);
      setErrorMessage('Nie udało się usunąć projektu. Spróbuj ponownie później.');
    }
  };

  // Renderowanie zakładek w zależności od uprawnień
  // Jeśli user ma can_view_projects = true (a Worker i Boss mają), to zawsze wyświetlamy "Lista projektów"
  // Jeśli can_create_projects = true (tylko Boss), to wyświetlamy dodatkowe zakładki
  if (!capabilities) {
    return <Typography>Wczytywanie danych użytkownika...</Typography>;
  }

  const canCreate = capabilities?.can_create_projects;
  const canEdit = capabilities?.can_edit_projects;
  const canDelete = capabilities?.can_delete_projects;

  let tabs = null;
  if (capabilities) {
    if (capabilities.can_view_projects && !capabilities.can_create_projects) {
      // Worker
      tabs = (
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs" sx={{ marginBottom: 2 }}>
          <Tab label="Lista projektów" />
        </Tabs>
      );
    } else if (capabilities.can_view_projects && capabilities.can_create_projects) {
      // Boss
      // Zakładki: Lista projektów, Nowy projekt, Edytuj/Usuń projekt
      tabs = (
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs" sx={{ marginBottom: 2 }}>
          <Tab label="Lista projektów" />
          <Tab label="Nowy projekt" />
          <Tab label="Edytuj/Usuń projekt" />
        </Tabs>
      );
    } else {
      // Inna rola bez podglądu - raczej nie wystąpi
      tabs = <Typography>Brak uprawnień do podglądu projektów.</Typography>;
    }
  }

  return (
    <Box>
      <Typography variant="h4">Projekty</Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {capabilities ? (
        <>
          {tabs}

          {/* Lista projektów */}
          {tabValue === 0 && capabilities.can_view_projects && (
            <Box>
              {projects.length === 0 ? (
                <Typography variant="body1">Brak projektów do wyświetlenia.</Typography>
              ) : (
                <List>
                  {projects.map((project) => (
                    <React.Fragment key={project.id}>
                      <ListItem button onClick={() => handleExpandClick(project.id)}>
                        <ListItemText primary={project.name} />
                        {expandedProject === project.id ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse
                        in={expandedProject === project.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ pl: 4, pb: 2 }}>
                          <Typography variant="body1">
                            <strong>Data rozpoczęcia:</strong> {project.start_date || '-'}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Data zakończenia:</strong> {project.end_date || '-'}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Komentarze:</strong> {project.comments || '-'}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Status:</strong> {project.status || '-'}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2">
                            <strong>Utworzono:</strong> {project.created || '-'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Zmodyfikowano:</strong> {project.modified || '-'}
                          </Typography>
                        </Box>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          )}

          {/* Nowy projekt (tylko jeśli can_create_projects = true, czyli Boss) */}
          {tabValue === 1 && canCreate && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                label="Nazwa"
                name="name"
                value={newProject.name}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Data rozpoczęcia"
                name="start_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newProject.start_date}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Data zakończenia"
                name="end_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newProject.end_date}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Komentarze"
                name="comments"
                value={newProject.comments}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Status"
                name="status"
                value={newProject.status}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleAddProject}>
                Dodaj projekt
              </Button>
            </Box>
          )}

          {/* Edytuj/Usuń projekt (tylko jeśli can_edit_projects i can_delete_projects = true, czyli Boss) */}
          {tabValue === 2 && (canEdit || canDelete) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Wybierz projekt do edycji lub usunięcia:</Typography>
              <Select
                value={selectedProjectId || ''}
                onChange={(e) => handleSelectProjectToEdit(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value=""><em>Wybierz projekt</em></MenuItem>
                {projects.map((proj) => (
                  <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
                ))}
              </Select>

              {selectedProjectId && (
                <Box component="form" sx={{ mt: 2 }}>
                  <TextField
                    label="Nazwa"
                    name="name"
                    value={editProject.name}
                    onChange={handleEditInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Data rozpoczęcia"
                    name="start_date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={editProject.start_date}
                    onChange={handleEditInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Data zakończenia"
                    name="end_date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={editProject.end_date}
                    onChange={handleEditInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Komentarze"
                    name="comments"
                    value={editProject.comments}
                    onChange={handleEditInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Status"
                    name="status"
                    value={editProject.status}
                    onChange={handleEditInputChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {canEdit && (
                      <Button variant="contained" onClick={handleEditProject}>
                        Zapisz zmiany
                      </Button>
                    )}
                    {canDelete && (
                      <Button variant="outlined" color="error" onClick={handleDeleteProject}>
                        Usuń projekt
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body1">
          Trwa wczytywanie danych użytkownika...
        </Typography>
      )}
    </Box>
  );
};

export default Projects;
