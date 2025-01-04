import React, { useEffect, useState, useRef } from 'react';
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
  MenuItem as MUIMenuItem,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';
import AxiosInstance from '../Axios';

import Calendar from './Calendar';
import { format } from 'date-fns';

const TASK_STATUSES = ['OPEN', 'SUSPENDED', 'CLOSED'];

function Tasks() {
  const theme = useTheme();

  const [userRole, setUserRole] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // ====== Taski ======
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Posty
  const [postsByTask, setPostsByTask] = useState({});

  // Listy do selectów
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  // ====== Dodaj Post ======
  const [openAddPostDialog, setOpenAddPostDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newPostAssignedTask, setNewPostAssignedTask] = useState('');
  const [newPostWorkHours, setNewPostWorkHours] = useState('');
  const [newPostComment, setNewPostComment] = useState('');

  // ====== Dodaj Task ======
  const [newTaskAssignedProject, setNewTaskAssignedProject] = useState('');
  const [newTaskAssignedUser, setNewTaskAssignedUser] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('OPEN');

  // ====== Edycja Taska ======
  const [menuAnchorTask, setMenuAnchorTask] = useState(null);
  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState(null);

  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [editTaskProject, setEditTaskProject] = useState('');
  const [editTaskUser, setEditTaskUser] = useState('');
  const [editTaskName, setEditTaskName] = useState('');
  const [editTaskDesc, setEditTaskDesc] = useState('');
  const [editTaskStatus, setEditTaskStatus] = useState('OPEN');

  // ====== Edycja Posta ======
  const [menuAnchorPost, setMenuAnchorPost] = useState(null);
  const [selectedPostForMenu, setSelectedPostForMenu] = useState(null);

  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [editPostWorkHours, setEditPostWorkHours] = useState('');
  const [editPostComment, setEditPostComment] = useState('');

  // ====== Informacje o Poście (Dialog) w kalendarzu ======
  const [openPostInfoDialog, setOpenPostInfoDialog] = useState(false);
  const [infoDialogData, setInfoDialogData] = useState(null);

  const calendarRef = useRef(null);

  // ----------------- Load Data -----------------
  useEffect(() => {
    AxiosInstance.get('/users/me/')
      .then((res) => {
        setUserRole(res.data.role);
      })
      .catch((err) => console.error('Error fetching user role:', err));

    // Pobierz zadania
    AxiosInstance.get('/tasks/')
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.error('Error fetching tasks:', err));

    // Pobierz projekty
    AxiosInstance.get('/projects/')
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => console.error('Error fetching projects:', err));

    // Pobierz Pracowników
    AxiosInstance.get('/users/')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  // Obsługa zakładek
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // ========== LISTA ZADAŃ (zakładka 0) ==========
  // (UWAGA) Po kliknięciu w akordeon pobieramy TYLKO posty dla danego taska
  const handleExpandTask = (taskId, expanded) => {
    if (expanded) {
      setSelectedTaskId(taskId);
      AxiosInstance.get(`/posts/?assigned_task=${taskId}`)
        .then((res) => {
          setPostsByTask((prev) => ({
            ...prev,
            [taskId]: res.data,
          }));
        })
        .catch((err) => console.error('Error fetching posts:', err));
    } else {
      setSelectedTaskId(null);
    }
  };

  const getPostsForTask = (taskId) => {
    return postsByTask[taskId] || [];
  };

  // ========== Menu w Zadaniu (MoreVert) ==========
  const handleTaskMenuClick = (event, task) => {
    setMenuAnchorTask(event.currentTarget);
    setSelectedTaskForMenu(task);
  };

  const handleTaskMenuClose = () => {
    setMenuAnchorTask(null);
  };

  const handleTaskEditClick = () => {
    if (!selectedTaskForMenu) return;
    const t = selectedTaskForMenu;

    setEditTaskProject(t.assigned_project?.project_id || '');
    setEditTaskUser(t.assigned_user?.user_id || '');
    setEditTaskName(t.name || '');
    setEditTaskDesc(t.description || '');
    setEditTaskStatus(t.status || 'OPEN');

    setOpenTaskDialog(true);
    handleTaskMenuClose();
  };

  const handleSaveTaskChanges = () => {
    if (!selectedTaskForMenu) return;

    const body = {
      assigned_project_id: editTaskProject,
      assigned_user_id: editTaskUser,
      name: editTaskName,
      description: editTaskDesc,
      status: editTaskStatus,
    };

    AxiosInstance.patch(`/tasks/${selectedTaskForMenu.task_id}/`, body)
      .then(() => {
        return AxiosInstance.get('/tasks/');
      })
      .then((res) => {
        setTasks(res.data);
        setOpenTaskDialog(false);
        setSelectedTaskForMenu(null);
        alert('Zadanie zaktualizowane pomyślnie!');
      })
      .catch((err) => {
        console.error('Error updating task:', err?.response?.data || err);
        alert(
          'Nie udało się zaktualizować zadania: ' +
            (err?.response?.data?.detail || '')
        );
        setSelectedTaskForMenu(null);
      });
  };

  // ========== Menu w Poście (MoreVert) ==========
  const handlePostMenuClick = (event, post) => {
    setMenuAnchorPost(event.currentTarget);
    setSelectedPostForMenu(post);
  };

  const handlePostMenuClose = () => {
    setMenuAnchorPost(null);
  };

  // Kliknięcie w "Edytuj post"
  const handlePostEditClick = () => {
    if (!selectedPostForMenu) return;
    const p = selectedPostForMenu;
    setEditPostWorkHours(p.work_hours || '');
    setEditPostComment(p.comment || '');
    setOpenPostDialog(true);
    handlePostMenuClose();
  };

  const handleSavePostChanges = () => {
    if (!selectedPostForMenu) return;

    const body = {
      work_hours: editPostWorkHours,
      comment: editPostComment,
    };
    const realTaskId =
      selectedPostForMenu.assigned_task?.task_id ||
      selectedPostForMenu.assigned_task;

    AxiosInstance.patch(`/posts/${selectedPostForMenu.post_id}/`, body)
      .then(() => {
        return AxiosInstance.get(`/posts/?assigned_task=${realTaskId}`);
      })
      .then((res) => {
        setPostsByTask((prev) => ({
          ...prev,
          [realTaskId]: res.data,
        }));
        setOpenPostDialog(false);
        setSelectedPostForMenu(null);
        alert('Post zaktualizowany pomyślnie!');

        if (calendarRef.current && calendarRef.current.refreshPosts) {
          calendarRef.current.refreshPosts();
        }
      })
      .catch((err) => {
        console.error('Error updating post:', err?.response?.data || err);
        alert(
          'Nie udało się zaktualizować posta: ' +
            (err?.response?.data?.detail || '')
        );
        setSelectedPostForMenu(null);
      });
  };

  // ========== DODAJ POST (zakładka 1) ==========
  const handleSelectDayFromCalendar = (day) => {
    setSelectedDate(day);
    setOpenAddPostDialog(true);
  };

  const handlePostInfoDialogOpen = (post) => {
    setInfoDialogData(post);
    setOpenPostInfoDialog(true);
  };

  const handleClosePostInfoDialog = () => {
    setOpenPostInfoDialog(false);
    setInfoDialogData(null);
  };

  const getUserName = (post) => {
    // post.assigned_task jest powiązane z "Task"
    // Task ma assigned_user
    // Ale zależy, czy w serializerze w postie mamy 'assigned_task.assigned_user.username'
    const assignedTask = post.assigned_task;
    if (assignedTask && assignedTask.assigned_user) {
      return assignedTask.assigned_user.username || 'unknown user';
    }
    return '(brak użytkownika)';
  };

  const handleAddPost = () => {
    if (!selectedDate) {
      alert('Wybierz datę w kalendarzu!');
      return;
    }
    if (!newPostAssignedTask) {
      alert('Wybierz zadanie!');
      return;
    }
    if (!newPostWorkHours) {
      alert('Podaj liczbę godzin!');
      return;
    }

    const body = {
      assigned_task_id: newPostAssignedTask,
      work_hours: newPostWorkHours,
      comment: newPostComment,
      post_date: selectedDate?.toISOString(),
    };

    AxiosInstance.post('/posts/', body)
      .then(() => {
        alert('Post dodany!');

        setNewPostAssignedTask('');
        setNewPostWorkHours('');
        setNewPostComment('');
        setSelectedDate(null);
        setOpenAddPostDialog(false);

        if (calendarRef.current && calendarRef.current.refreshPosts) {
          calendarRef.current.refreshPosts();
        }
      })
      .catch((err) => {
        console.error('Error creating post:', err?.response?.data || err);
        alert(
          'Nie udało się dodać posta: ' +
            (err?.response?.data?.detail || '')
        );
      });
  };

  const handleCloseAddPostDialog = () => {
    setOpenAddPostDialog(false);

    setNewPostAssignedTask('');
    setNewPostWorkHours('');
    setNewPostComment('');
    setSelectedDate(null);
  };

  // ========== DODAJ TASK (zakładka 2) ==========
  const handleAddTask = () => {
    if (!newTaskAssignedProject) {
      alert('Wybierz projekt');
      return;
    }
    if (!newTaskAssignedUser) {
      alert('Wybierz Pracownika');
      return;
    }
    if (!newTaskName) {
      alert('Podaj nazwę zadania');
      return;
    }

    const body = {
      assigned_project_id: newTaskAssignedProject,
      assigned_user_id: newTaskAssignedUser,
      name: newTaskName,
      description: newTaskDesc,
      status: newTaskStatus,
    };

    AxiosInstance.post('/tasks/', body)
      .then(() => {
        alert('Task dodany!');
        // reset
        setNewTaskAssignedProject('');
        setNewTaskAssignedUser('');
        setNewTaskName('');
        setNewTaskDesc('');
        setNewTaskStatus('OPEN');
        // Odswież listę zadań
        return AxiosInstance.get('/tasks/');
      })
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.error('Error creating task:', err?.response?.data || err);
        alert(
          'Nie udało się dodać zadania. ' +
            (err?.response?.data?.detail || 'Sprawdź uprawnienia.')
        );
      });
  };

  // Dynamika etykiet zakładek
  const tabLabels = ['Lista zadań', 'Dodaj Post'];
  if (userRole === 'Boss') {
    tabLabels.push('Dodaj Zadanie');
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
        Panel Zadań
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        textColor="inherit"
        sx={{ marginBottom: 2}}
        TabIndicatorProps={{ style: { backgroundColor: theme.palette.violet.light } }}
      >
        {tabLabels.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>

      {/* ZAKŁADKA 0: LISTA ZADAŃ */}
      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2} sx={{ minHeight: 500 }}>
            {/* Lewa połowa: Zadania */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Lista zadań
              </Typography>
              {tasks.map((task) => (
                <Accordion
                  key={task.task_id}
                  onChange={(_, expanded) =>
                    handleExpandTask(task.task_id, expanded)
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
                    <Typography
                      sx={{
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      Opis: {task.description || '-'}
                    </Typography>
                    <Typography>Status: {task.status}</Typography>
                    <Typography>Godziny pracy: {task.total_hours}</Typography>
                    <Typography>
                      Projekt: {task.assigned_project?.name || '-'}
                    </Typography>
                    <Typography>
                      Pracownik: {task.assigned_user?.username || '-'}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>

            {/* Prawa połowa: Posty do wybranego zadania */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Lista postów
              </Typography>
              {selectedTaskId ? (
                <>
                  {getPostsForTask(selectedTaskId).length === 0 ? (
                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                      Brak postów dla tego zadania
                    </Typography>
                  ) : (
                    getPostsForTask(selectedTaskId).map((post) => (
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
                              Data:{' '}
                              {new Date(post.post_date).toLocaleDateString()}
                              {'  •  '}Godziny pracy: {post.work_hours}
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
                          <Typography
                            sx={{
                              whiteSpace: 'pre-wrap',
                              overflowWrap: 'anywhere',
                            }}
                          >
                            {post.comment && (
                              <Typography>
                                Komentarz: {post.comment}
                              </Typography>
                            )}
                          </Typography>
                          {post.assigned_task && (
                            <Typography>
                              Zadanie: {post.assigned_task.name}
                            </Typography>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))
                  )}
                </>
              ) : (
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                  Wybierz zadanie, aby zobaczyć posty
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      )}

      {/* ZAKŁADKA 1: DODAJ POST */}
      {tabValue === 1 && (
        <Box sx={{ mt: 3, minHeight: 500 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Kalendarz - Kliknij w dzień, aby dodać post
          </Typography>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Calendar
              ref={calendarRef}
              onSelectDay={handleSelectDayFromCalendar}
              onPostClick={handlePostInfoDialogOpen}
            />
          </Box>
        </Box>
      )}

      {/* ZAKŁADKA 2: DODAJ TASK (tylko Boss) */}
      {userRole === 'Boss' && tabValue === 2 && (
        <Box sx={{ mt: 3, maxWidth: 600, margin: '0 auto' }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center'}}>
            Dodaj Zadanie
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Projekt</InputLabel>
                <Select
                  value={newTaskAssignedProject}
                  label="Projekt"
                  onChange={(e) => setNewTaskAssignedProject(e.target.value)}
                >
                  {projects.map((p) => (
                    <MUIMenuItem key={p.project_id} value={p.project_id}>
                      {p.name}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pracownik</InputLabel>
                <Select
                  value={newTaskAssignedUser}
                  label="Pracownik"
                  onChange={(e) => setNewTaskAssignedUser(e.target.value)}
                >
                  {users.map((u) => (
                    <MUIMenuItem key={u.user_id} value={u.user_id}>
                      {u.username}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Nazwa zadania"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newTaskStatus}
                  label="Status"
                  onChange={(e) => setNewTaskStatus(e.target.value)}
                >
                  {TASK_STATUSES.map((st) => (
                    <MUIMenuItem key={st} value={st}>
                      {st}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Opis zadania"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
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
              onClick={handleAddTask}
            >
              Dodaj Zadanie
            </Button>
          </Box>
        </Box>
      )}

      {/* Menu Zadania */}
      <Menu
        anchorEl={menuAnchorTask}
        open={Boolean(menuAnchorTask)}
        onClose={handleTaskMenuClose}
      >
        <MenuItem onClick={handleTaskEditClick}>Edytuj zadanie</MenuItem>
      </Menu>

      {/* Dialog Edycji Zadania */}
      <Dialog
        open={openTaskDialog}
        onClose={() => setOpenTaskDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{textAlign: 'center'}}>Edytuj Zadanie</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '1rem' }}
        >
          <TextField
            label="Nazwa zadania"
            value={editTaskName}
            onChange={(e) => setEditTaskName(e.target.value)}
            autoFocus
            margin="dense"         
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Projekt</InputLabel>
                <Select
                  value={editTaskProject}
                  label="Projekt"
                  onChange={(e) => setEditTaskProject(e.target.value)}
                >
                  {projects.map((p) => (
                    <MUIMenuItem key={p.project_id} value={p.project_id}>
                      {p.name}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pracownik</InputLabel>
                <Select
                  value={editTaskUser}
                  label="Pracownik"
                  onChange={(e) => setEditTaskUser(e.target.value)}
                >
                  {users.map((u) => (
                    <MUIMenuItem key={u.user_id} value={u.user_id}>
                      {u.username}
                    </MUIMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <TextField
            label="Opis zadania"
            value={editTaskDesc}
            onChange={(e) => setEditTaskDesc(e.target.value)}
            multiline
            rows={3}
            fullWidth
            inputProps={{
              style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={editTaskStatus}
              label="Status"
              onChange={(e) => setEditTaskStatus(e.target.value)}
            >
              {TASK_STATUSES.map((st) => (
                <MUIMenuItem key={st} value={st}>
                  {st}
                </MUIMenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)}>Anuluj</Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'violet.main',
              '&:hover': { backgroundColor: 'violet.light' },
            }}
            onClick={handleSaveTaskChanges}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu Postów */}
      <Menu
        anchorEl={menuAnchorPost}
        open={Boolean(menuAnchorPost)}
        onClose={handlePostMenuClose}
      >
        <MenuItem onClick={handlePostEditClick}>Edytuj post</MenuItem>
      </Menu>

      {/* Dialog Edycji Posta */}
      <Dialog
        open={openPostDialog}
        onClose={() => setOpenPostDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{textAlign: 'center'}}>Edytuj Post</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '1rem' }}
        >
          <TextField
            label="Godziny"
            type="number"
            value={editPostWorkHours}
            onChange={(e) => setEditPostWorkHours(e.target.value)}
            autoFocus
            margin="dense"
          />
          <TextField
            label="Komentarz"
            multiline
            rows={3}
            value={editPostComment}
            onChange={(e) => setEditPostComment(e.target.value)}
            inputProps={{
              style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPostDialog(false)}>Anuluj</Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'violet.main',
              '&:hover': { backgroundColor: 'violet.light' },
            }}
            onClick={handleSavePostChanges}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>

    {/* Nowy dialog z informacjami o poście po kliknięciu w bloczek */}
      <Dialog
        open={openPostInfoDialog}
        onClose={handleClosePostInfoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{textAlign: 'center'}}>Informacje o Poście</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1}}>
          {infoDialogData && (
            <>
              <Typography>
                <strong>Data utworzenia:</strong>{' '}
                {new Date(infoDialogData.post_date).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Nazwa zadania:</strong>{' '}
                {infoDialogData.assigned_task?.name || '(brak)'}
              </Typography>
              <Typography>
                <strong>Autor posta:</strong> {getUserName(infoDialogData)}
              </Typography>
              <Typography>
                <strong>Czas pracy (godziny):</strong> {infoDialogData.work_hours}
              </Typography>
              {infoDialogData.comment && (
                <Typography
                  sx={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                  }}
                >
                  <strong>Komentarz:</strong> {infoDialogData.comment}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePostInfoDialog}>Zamknij</Button>
        </DialogActions>
      </Dialog>

    <Dialog
        open={openAddPostDialog}
        onClose={handleCloseAddPostDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{textAlign: 'center'}}>Dodaj Post</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Data"
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
            InputProps={{ readOnly: true }}
            autoFocus
            margin="dense"
          />

          <FormControl fullWidth disabled={!selectedDate}>
            <InputLabel>Zadanie</InputLabel>
            <Select
              value={newPostAssignedTask}
              label="Zadanie"
              onChange={(e) => setNewPostAssignedTask(e.target.value)}
            >
              {tasks.map((t) => (
                <MUIMenuItem key={t.task_id} value={t.task_id}>
                  {t.name}
                </MUIMenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Godziny"
            type="number"
            value={newPostWorkHours}
            onChange={(e) => setNewPostWorkHours(e.target.value)}
            disabled={!selectedDate}
          />

          <TextField
            label="Komentarz"
            multiline
            rows={3}
            value={newPostComment}
            onChange={(e) => setNewPostComment(e.target.value)}
            disabled={!selectedDate}
            inputProps={{
              style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddPostDialog}>Anuluj</Button>
          <Button
            variant="contained"
            disabled={!selectedDate}
            onClick={handleAddPost}
            sx={{
              backgroundColor: 'violet.main',
              '&:hover': { backgroundColor: 'violet.light' },
            }}
          >
            Dodaj Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Tasks;
