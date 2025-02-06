import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useProjectsData from './hooks/useProjectsData';
import * as projectsApi from './api/projectsApi';
import ProjectsListTab from './components/Tabs/ProjectsListTab';
import AddProjectTab from './components/Tabs/AddProjectTab';
import ProjectEditDialog from './components/Dialogs/ProjectEditDialog';
import ProjectDeleteDialog from './components/Dialogs/ProjectDeleteDialog';
import PhaseAddDialog from './components/Dialogs/PhaseAddDialog';
import PhaseUpdateDialog from './components/Dialogs/PhaseUpdateDialog';
import PhaseDeleteDialog from './components/Dialogs/PhaseDeleteDialog';

const Projects = () => {
  const theme = useTheme();
  const {
    userRole,
    projects,
    clients,
    phasesByProject,
    refreshProjects,
    fetchPhasesForProject,
  } = useProjectsData();

  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const [showClosed, setShowClosed] = useState(false);
  const [clientFilter, setClientFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [selectedProjectForMenu, setSelectedProjectForMenu] = useState(null);
  const [selectedPhaseForMenu, setSelectedPhaseForMenu] = useState(null);

  const handleProjectClick = (projectId, isExpanded) => {
    if (userRole !== 'Boss') return;
    if (isExpanded) {
      setSelectedProjectId(projectId);
      fetchPhasesForProject(projectId);
    } else {
      setSelectedProjectId(null);
    }
  };

  const handleProjectEditClick = (project) => {
    setSelectedProjectForMenu(project);
    setOpenProjectEditDialog(true);
  };

  const handleProjectDeleteClick = (project) => {
    setSelectedProjectForMenu(project);
    setOpenProjectDeleteDialog(true);
  };

  const handleProjectAddPhaseClick = (project) => {
    setSelectedProjectForMenu(project);
    setOpenPhaseAddDialog(true);
  };

  const handlePhaseEditClick = (phase) => {
    setSelectedPhaseForMenu(phase);
    setOpenPhaseUpdateDialog(true);
  };

  const handlePhaseDeleteClick = (phase) => {
    setSelectedPhaseForMenu(phase);
    setOpenPhaseDeleteDialog(true);
  };

  const [openProjectEditDialog, setOpenProjectEditDialog] = useState(false);
  const [openProjectDeleteDialog, setOpenProjectDeleteDialog] = useState(false);

  const [openPhaseAddDialog, setOpenPhaseAddDialog] = useState(false);
  const [openPhaseUpdateDialog, setOpenPhaseUpdateDialog] = useState(false);
  const [openPhaseDeleteDialog, setOpenPhaseDeleteDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProjectEditSave = (project, updatedData) => {
    projectsApi
      .updateProject(project.project_id, updatedData)
      .then(() => {
        refreshProjects();
        setOpenProjectEditDialog(false);
        showSnackbar('Projekt zaktualizowany pomyślnie!');
      })
      .catch((err) => {
        console.error('Error updating project:', err);
        showSnackbar('Nie udało się zaktualizować projektu.', 'error');
      });
  };

  const handleProjectDeleteConfirm = (project) => {
    projectsApi
      .deleteProject(project.project_id)
      .then(() => {
        refreshProjects();
        setOpenProjectDeleteDialog(false);
        showSnackbar('Projekt usunięty pomyślnie!');
      })
      .catch((err) => {
        console.error('Error deleting project:', err);
        showSnackbar('Nie udało się usunąć projektu.', 'error');
      });
  };

  const handlePhaseAdd = (newPhase) => {
    projectsApi
      .createPhase(newPhase)
      .then(() => {
        showSnackbar('Faza dodana!');
        return fetchPhasesForProject(newPhase.assigned_project_id);
      })
      .catch((err) => {
        console.error('Error creating phase:', err);
        showSnackbar('Nie udało się dodać fazy.', 'error');
      })
      .finally(() => {
        setOpenPhaseAddDialog(false);
      });
  };

  const handlePhaseUpdateSave = (phase, updatedData) => {
    const realProjectId =
      phase.assigned_project?.project_id || phase.assigned_project;
    projectsApi
      .updatePhase(phase.phase_id, updatedData)
      .then(() => projectsApi.getPhasesForProject(realProjectId))
      .then(() => {
        fetchPhasesForProject(realProjectId);
        setOpenPhaseUpdateDialog(false);
        showSnackbar('Faza zaktualizowana pomyślnie!');
      })
      .catch((err) => {
        console.error('Error updating phase:', err);
        showSnackbar('Nie udało się zaktualizować fazy.', 'error');
      });
  };

  const handlePhaseDeleteConfirm = (phase) => {
    projectsApi
      .deletePhase(phase.phase_id)
      .then(() => {
        const realProjectId =
          phase.assigned_project?.project_id || phase.assigned_project;
        fetchPhasesForProject(realProjectId);
        setOpenPhaseDeleteDialog(false);
        showSnackbar('Faza usunięta pomyślnie!');
      })
      .catch((err) => {
        console.error('Error deleting phase:', err);
        showSnackbar('Nie udało się usunąć fazy.', 'error');
      });
  };

  const tabLabels = ['Lista projektów'];
  if (userRole === 'Boss') {
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
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        textColor="inherit"
        sx={{
          mb: 2,
          '& .MuiTabs-flexContainer': {
            justifyContent: 'center',
          },
        }}
        TabIndicatorProps={{
          style: { backgroundColor: theme.palette.violet?.light || '#ab47bc' },
        }}
      >
        {tabLabels.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>

      {userRole !== 'Boss' && tabValue === 0 && (
        <ProjectsListTab
          userRole={userRole}
          projects={projects}
          selectedProjectId={selectedProjectId}
        />
      )}

      {userRole === 'Boss' && tabValue === 0 && (
        <ProjectsListTab
          userRole={userRole}
          projects={projects}
          clients={clients}
          phasesByProject={phasesByProject}
          selectedProjectId={selectedProjectId}
          showClosed={showClosed}
          clientFilter={clientFilter}
          typeFilter={typeFilter}
          onShowClosedChange={setShowClosed}
          onClientFilterChange={setClientFilter}
          onTypeFilterChange={setTypeFilter}
          onProjectClick={handleProjectClick}
          onProjectEdit={handleProjectEditClick}
          onProjectDelete={handleProjectDeleteClick}
          onPhaseEdit={handlePhaseEditClick}
          onPhaseDelete={handlePhaseDeleteClick}
        />
      )}

      {userRole === 'Boss' && tabValue === 1 && (
        <AddProjectTab
          clients={clients}
          onAddProject={refreshProjects}
          showSnackbar={showSnackbar}
        />
      )}

      <ProjectEditDialog
        open={openProjectEditDialog}
        project={selectedProjectForMenu}
        onClose={() => setOpenProjectEditDialog(false)}
        onSave={handleProjectEditSave}
      />
      <ProjectDeleteDialog
        open={openProjectDeleteDialog}
        project={selectedProjectForMenu}
        onClose={() => setOpenProjectDeleteDialog(false)}
        onDelete={handleProjectDeleteConfirm}
      />
      <PhaseAddDialog
        open={openPhaseAddDialog}
        assignedProjectId={selectedProjectForMenu ? selectedProjectForMenu.project_id : ''}
        projects={projects}
        onClose={() => setOpenPhaseAddDialog(false)}
        onAdd={handlePhaseAdd}
      />
      <PhaseUpdateDialog
        open={openPhaseUpdateDialog}
        phase={selectedPhaseForMenu}
        onClose={() => setOpenPhaseUpdateDialog(false)}
        onSave={handlePhaseUpdateSave}
      />
      <PhaseDeleteDialog
        open={openPhaseDeleteDialog}
        phase={selectedPhaseForMenu}
        onClose={() => setOpenPhaseDeleteDialog(false)}
        onDelete={handlePhaseDeleteConfirm}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Projects;
