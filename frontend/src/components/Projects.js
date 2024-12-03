import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
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
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [authToken, setAuthToken] = useState('');

  // Pobieranie listy projektów z backendu
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios
      .get('/api/projects/')
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => console.error('Błąd podczas pobierania projektów:', error));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const handleAddProject = () => {
    axios
      .post('/api/projects/', newProject)
      .then((response) => {
        setProjects([...projects, response.data]);
        setNewProject({
          name: '',
          start_date: '',
          end_date: '',
          comments: '',
          status: '',
        });
        setTabValue(0); // Przełącz na listę projektów po dodaniu
      })
      .catch((error) => console.error('Błąd podczas dodawania projektu:', error));
  };

//   const handleSelectProject = (event) => {
//     const projectId = event.target.value;
//     const project = projects.find((p) => p.id === projectId);
//     setSelectedProject(project);
//   };

//   const handleUpdateProject = () => {
//     axios
//       .put(`/api/projects/${selectedProject.id}/`, selectedProject, {
//         headers: { Authorization: `Token ${authToken}` },
//       })
//       .then((response) => {
//         const updatedProjects = projects.map((project) =>
//           project.id === response.data.id ? response.data : project
//         );
//         setProjects(updatedProjects);
//         setSelectedProject(null);
//         setTabValue(0); // Przełącz na listę projektów po aktualizacji
//       })
//       .catch((error) => console.error('Błąd podczas aktualizacji projektu:', error));
//   };

//   const handleDeleteProject = () => {
//     axios
//       .delete(`/api/projects/${selectedProject.id}/`, {
//         headers: { Authorization: `Token ${authToken}` },
//       })
//       .then(() => {
//         const remainingProjects = projects.filter(
//           (project) => project.id !== selectedProject.id
//         );
//         setProjects(remainingProjects);
//         setSelectedProject(null);
//         setTabValue(0); // Przełącz na listę projektów po usunięciu
//       })
//       .catch((error) => console.error('Błąd podczas usuwania projektu:', error));
//   };

//   const handleLogin = (event) => {
//     event.preventDefault();
//     // Uwierzytelnianie użytkownika i pobranie tokenu
//     axios
//       .post('/api/auth/login/', {
//         username: event.target.username.value,
//         password: event.target.password.value,
//       })
//       .then((response) => {
//         setAuthToken(response.data.token);
//         setIsAuthenticated(true);
//       })
//       .catch((error) => {
//         console.error('Błąd podczas logowania:', error);
//         alert('Nieprawidłowe dane logowania');
//       });
//   };

//   const handleLogout = () => {
//     setAuthToken('');
//     setIsAuthenticated(false);
//     setSelectedProject(null);
//   };

  return (
    <Box>
      <Typography variant="h4">Projekty</Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="tabs"
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Lista projektów" />
        <Tab label="Nowy projekt" />
        <Tab label="Edytuj projekt" />
      </Tabs>

      {/* Lista projektów */}
      {tabValue === 0 && (
        <Box>
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
                  <Box sx={{ pl: 4 }}>
                    <Typography variant="body1">
                      <strong>Data rozpoczęcia:</strong> {project.start_date}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Data zakończenia:</strong> {project.end_date}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Komentarze:</strong> {project.comments}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Status:</strong> {project.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Utworzono:</strong> {project.created}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Zmodyfikowano:</strong> {project.modified}
                    </Typography>
                  </Box>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {/* Nowy projekt */}
      {tabValue === 1 && (
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
    </Box>
  );
};

export default Projects;
