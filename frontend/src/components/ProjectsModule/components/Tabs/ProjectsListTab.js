import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import ProjectInfoDialog from '../Dialogs/ProjectInfoDialog';
import PhaseInfoDialog from '../Dialogs/PhaseInfoDialog';

const ProjectsListTab = ({
  userRole,
  projects,
  clients,
  phasesByProject,
  selectedProjectId,
  showClosed,
  clientFilter,
  typeFilter,
  onShowClosedChange,
  onClientFilterChange,
  onTypeFilterChange,
  onProjectClick,
  onProjectEdit,
  onProjectDelete,
  onProjectAddPhase,
  onPhaseEdit,
  onPhaseDelete,
}) => {
  const getFilteredProjects = () => {
    let filtered = [...projects];
    if (!showClosed) {
      filtered = filtered.filter((p) => p.status !== 'CLOSED');
    }
    if (clientFilter) {
      filtered = filtered.filter(
        (p) => p.assigned_client?.client_id === Number(clientFilter)
      );
    }
    if (typeFilter) {
      filtered = filtered.filter((p) => p.type === typeFilter);
    }
    return filtered;
  };

  const getPhasesForProject = (projectId) => {
    return phasesByProject[projectId] || [];
  };

  // Dialogy informacyjne
  const [selectedProjectForInfo, setSelectedProjectForInfo] = useState(null);
  const [openProjectInfoDialog, setOpenProjectInfoDialog] = useState(false);

  const [selectedPhaseForInfo, setSelectedPhaseForInfo] = useState(null);
  const [openPhaseInfoDialog, setOpenPhaseInfoDialog] = useState(false);

  const handleOpenProjectInfo = (project, e) => {
    e.stopPropagation();
    setSelectedProjectForInfo(project);
    setOpenProjectInfoDialog(true);
  };

  const handleCloseProjectInfo = () => {
    setOpenProjectInfoDialog(false);
    setSelectedProjectForInfo(null);
  };

  const handleOpenPhaseInfo = (phase, e) => {
    e.stopPropagation();
    setSelectedPhaseForInfo(phase);
    setOpenPhaseInfoDialog(true);
  };

  const handleClosePhaseInfo = () => {
    setOpenPhaseInfoDialog(false);
    setSelectedPhaseForInfo(null);
  };

  const formatProjectAddress = (project) => {
    return `${project.city || '-'} ${project.postcode || '-'}, ul. ${project.street || '-'}`;
  };

  if (userRole === 'Boss') {
    return (
      <Box sx={{ mt: 3 }}>
        {/* Filtry */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={showClosed}
                onChange={(e) => onShowClosedChange(e.target.checked)}
              />
            }
            label="Pokaż zakończone"
          />
  
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Klient</InputLabel>
            <Select
              value={clientFilter}
              label="Filtr: Klient"
              onChange={(e) => onClientFilterChange(e.target.value)}
            >
              <MenuItem value="">(Wszyscy klienci)</MenuItem>
              {clients.map((c) => (
                <MenuItem key={c.client_id} value={c.client_id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Typ projektu</InputLabel>
            <Select
              value={typeFilter}
              label="Filtr: Typ projektu"
              onChange={(e) => onTypeFilterChange(e.target.value)}
            >
              <MenuItem value="">(Wszystkie typy)</MenuItem>
              {Array.from(new Set(projects.map((p) => p.type))).map((pt) => (
                <MenuItem key={pt} value={pt}>
                  {pt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
  
        <Grid container spacing={2} sx={{ minHeight: 500 }}>
          {/* Tabela projektów */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Lista projektów
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'violet.main', outline: '1px solid' }}>
                    <TableCell>Nazwa</TableCell>
                    <TableCell>Typ</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Adres</TableCell>
                    <TableCell align="center">Akcje</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredProjects().map((project) => (
                    <TableRow
                      key={project.project_id}
                      onClick={() => onProjectClick(project.project_id, true)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor:
                          selectedProjectId === project.project_id ? 'rgba(0,0,0,0.08)' : 'inherit',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
                        outline: '1px solid',
                      }}
                    >
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.type}</TableCell>
                      <TableCell>{project.status}</TableCell>
                      <TableCell>{formatProjectAddress(project)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProjectEdit(project);
                          }}
                          sx={{ color: 'white.main', '&:hover': { color: 'violet.main' } }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProjectDelete(project);
                          }}
                          sx={{ color: 'white.main', '&:hover': { color: 'violet.main' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProjectInfo(project, e)
                          }}
                          sx={{ color: 'white.main', '&:hover': { color: 'violet.main' } }}
                        >
                          <InfoIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProjectAddPhase(project);
                          }}
                          sx={{ color: 'white.main', '&:hover': { color: 'violet.main' } }}
                        >
                          <AddIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            {selectedProjectId && (
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Projekt: {projects.find((p) => p.project_id === selectedProjectId)?.name}
              </Typography>
            )}
            
            {selectedProjectId ? (
              getPhasesForProject(selectedProjectId).length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                  Brak faz dla tego projektu
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'violet.main', outline: '1px solid' }}>
                        <TableCell>Nazwa</TableCell>
                        <TableCell>Typ</TableCell>
                        <TableCell>Cena</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Akcje</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getPhasesForProject(selectedProjectId).map((phase) => (
                        <TableRow
                          key={phase.phase_id}
                          onClick={(e) => handleOpenPhaseInfo(phase, e)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
                            outline: '1px solid',
                          }}
                        >
                          <TableCell>{phase.name}</TableCell>
                          <TableCell>{phase.type}</TableCell>
                          <TableCell>{phase.price || '-'}</TableCell>
                          <TableCell>{phase.status}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPhaseEdit(phase);
                              }}
                              sx={{ color: 'white.main', '&:hover': { color: 'violet.main' } }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPhaseDelete(phase);
                              }}
                              sx={{ color: 'white.main', '&:hover': { color: 'violet.main' } }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                Wybierz projekt z listy, aby zobaczyć jego fazy
              </Typography>
            )}
          </Grid>
        </Grid>
  
        {/* Dialogi informacyjne */}
        <ProjectInfoDialog
          open={openProjectInfoDialog}
          project={selectedProjectForInfo}
          onClose={handleCloseProjectInfo}
        />
        <PhaseInfoDialog
          open={openPhaseInfoDialog}
          phase={selectedPhaseForInfo}
          onClose={handleClosePhaseInfo}
        />
      </Box>
    );
  } else {
    return (
      <Box sx={{ mt: 3 }}>  
        <Grid container spacing={2} sx={{ minHeight: 500, justifyContent: 'center' }}>
          <Grid item xs={12} md={6} sx={{ margin: '0 auto' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'violet.main', outline: '1px solid' }}>
                    <TableCell width="25%" align='center'>Informacje</TableCell>
                    <TableCell width="75%" align='center'>Opis</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredProjects().map((project) => (
                    <TableRow
                      key={project.project_id}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor:
                          selectedProjectId === project.project_id ? 'rgba(0,0,0,0.08)' : 'inherit',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
                        outline: '1px solid',
                      }}
                    >
                      <TableCell align='center'>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography>{project.name}</Typography>
                          <Typography>{project.type}</Typography>
                          <Typography>{formatProjectAddress(project)}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{project.comments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    );
  }
  
};

export default ProjectsListTab;