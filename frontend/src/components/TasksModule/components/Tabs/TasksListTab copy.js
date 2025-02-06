import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem as MUIMenuItem,
  Grid,
  Menu,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { TASK_STATUS, TASK_STATUS_COLORS } from '../Variables';

const TasksListTab = ({
  tasks,
  projects,
  users,
  userRole,
  expandedTaskId,
  onExpandTask,
  postsByTask,
  onTaskEdit,
  onTaskDelete,
  onPostEdit,
  onPostDelete,
  onPostInfo,
  showClosed,
  setShowClosed,
  projectFilter,
  setProjectFilter,
  userFilter,
  setUserFilter,
}) => {
  // Menu dla zadań (tylko dla Boss)
  const [taskMenuAnchor, setTaskMenuAnchor] = useState(null);
  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState(null);
  // Menu dla postów (dla wszystkich)
  const [postMenuAnchor, setPostMenuAnchor] = useState(null);
  const [selectedPostForMenu, setSelectedPostForMenu] = useState(null);

  const handleTaskMenuClick = (e, task) => {
    e.stopPropagation();
    setTaskMenuAnchor(e.currentTarget);
    setSelectedTaskForMenu(task);
  };

  const handleCloseTaskMenu = () => {
    setTaskMenuAnchor(null);
    setSelectedTaskForMenu(null);
  };

  const handlePostMenuClick = (e, post) => {
    e.stopPropagation();
    setPostMenuAnchor(e.currentTarget);
    setSelectedPostForMenu(post);
  };

  const handleClosePostMenu = () => {
    setPostMenuAnchor(null);
    setSelectedPostForMenu(null);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Filtry */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showClosed}
              onChange={(e) => setShowClosed(e.target.checked)}
            />
          }
          label="Pokaż zakończone"
        />
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Projekt</InputLabel>
          <Select
            value={projectFilter}
            label="Projekt"
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <MUIMenuItem value="">Wszystkie projekty</MUIMenuItem>
            {projects.map((proj) => (
              <MUIMenuItem key={proj.project_id} value={proj.project_id}>
                {proj.name}
              </MUIMenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Filtr użytkownika tylko dla Boss */}
        {userRole === 'Boss' && (
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Użytkownik</InputLabel>
            <Select
              value={userFilter}
              label="Użytkownik"
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <MUIMenuItem value="">Wszyscy użytkownicy</MUIMenuItem>
              {users.map((u) => (
                <MUIMenuItem key={u.user_id} value={u.user_id}>
                  {u.username}
                </MUIMenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Grid container spacing={2} sx={{ minHeight: 500 }}>
        {/* Lewa kolumna – lista zadań */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Lista zadań
          </Typography>
          {tasks
            .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
            .map((task) => (
              <Accordion
                key={task.task_id}
                expanded={expandedTaskId === task.task_id}
                onChange={(_, isExpanded) => onExpandTask(task.task_id, isExpanded)}
                sx={{ mb: 1, borderLeft: '5px solid #7A0099' }}
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
                      {task.name}
                    </Typography>
                    {userRole === 'Boss' && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleTaskMenuClick(e, task)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                    Opis: {task.description || '-'}
                  </Typography>
                  <Typography>Status: {TASK_STATUS[task.status]}</Typography>
                  <Typography>Godziny pracy: {task.total_hours}</Typography>
                  <Typography>Projekt: {task.assigned_project?.name || '-'}</Typography>
                  <Typography>
                    Użytkownik: {task.assigned_user?.username || '-'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
        </Grid>

        {/* Prawa kolumna – lista postów dla rozwiniętego zadania */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Lista postów
          </Typography>
          {expandedTaskId ? (
            postsByTask[expandedTaskId] && postsByTask[expandedTaskId].length > 0 ? (
              postsByTask[expandedTaskId]
                .sort((a, b) => new Date(b.post_date) - new Date(a.post_date))
                .map((post) => (
                  <Accordion key={post.post_id} sx={{ mb: 1 }}>
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
                          Data: {new Date(post.post_date).toLocaleDateString()} • Godziny: {post.work_hours}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => handlePostMenuClick(e, post)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {post.comment && (
                        <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                          Komentarz: {post.comment}
                        </Typography>
                      )}
                      {post.assigned_task && (
                        <Typography>Zadanie: {post.assigned_task.name}</Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
            ) : (
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Brak postów dla tego zadania
              </Typography>
            )
          ) : (
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Wybierz zadanie, aby zobaczyć posty
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Menu dla zadań */}
      <Menu
        anchorEl={taskMenuAnchor}
        open={Boolean(taskMenuAnchor)}
        onClose={handleCloseTaskMenu}
      >
        <MenuItem
          onClick={() => {
            onTaskEdit(selectedTaskForMenu);
            handleCloseTaskMenu();
          }}
        >
          Edytuj Zadanie
        </MenuItem>
        <MenuItem
          onClick={() => {
            onTaskDelete(selectedTaskForMenu);
            handleCloseTaskMenu();
          }}
        >
          Usuń Zadanie
        </MenuItem>
      </Menu>

      {/* Menu dla postów */}
      <Menu
        anchorEl={postMenuAnchor}
        open={Boolean(postMenuAnchor)}
        onClose={handleClosePostMenu}
      >
        <MenuItem
          onClick={() => {
            onPostEdit(selectedPostForMenu);
            handleClosePostMenu();
          }}
        >
          Edytuj post
        </MenuItem>
        <MenuItem
          onClick={() => {
            onPostDelete(selectedPostForMenu);
            handleClosePostMenu();
          }}
        >
          Usuń post
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TasksListTab;
