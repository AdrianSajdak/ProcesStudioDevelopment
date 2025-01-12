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
  MenuItem as MUIMenuItem,
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
  Checkbox,
  FormControlLabel
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
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [tabValue, setTabValue] = useState(0);

  // -------------------- POSTY (kalendarz) --------------------
  const [allPosts, setAllPosts] = useState([]);

  // -------------------- TASKI --------------------
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // -------------------- POSTY DLA ZAKŁADKI 0 --------------------
  const [postsByTask, setPostsByTask] = useState({});

  // -------------------- PROJEKTY I UŻYTKOWNICY --------------------
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  // -------------------- FILTROWANIE TASKÓW --------------------
  const [showClosed, setShowClosed] = useState(false);
  const [projectFilter, setProjectFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  // -------------------- DODAWANIE/EDYCJA POSTÓW --------------------
  const [openAddPostDialog, setOpenAddPostDialog] = useState(false);
  const [newPostAssignedTask, setNewPostAssignedTask] = useState('');
  const [newPostWorkHours, setNewPostWorkHours] = useState('');
  const [newPostComment, setNewPostComment] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  // -------------------- MENU W POŚCIE --------------------
  const [menuAnchorPost, setMenuAnchorPost] = useState(null);
  const [selectedPostForMenu, setSelectedPostForMenu] = useState(null);

  // -------------------- EDYCJA POSTÓW --------------------
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [editPostWorkHours, setEditPostWorkHours] = useState('');
  const [editPostComment, setEditPostComment] = useState('');

  // -------------------- USUWANIE POSTÓW --------------------
  const [openDeletePostDialog, setOpenDeletePostDialog] = useState(false);
  const [deletePostChecked, setDeletePostChecked] = useState(false); // checkbox: potwierdzenie
  // Gdy usuwamy post, będziemy korzystać z selectedPostForMenu

  // -------------------- INFORMACJE O POŚCIE (DIALOG) --------------------
  const [openPostInfoDialog, setOpenPostInfoDialog] = useState(false);
  const [infoDialogData, setInfoDialogData] = useState(null);

  // -------------------- DODAWANIE I EDYCJA TASKA --------------------
  const [newTaskAssignedProject, setNewTaskAssignedProject] = useState('');
  const [newTaskAssignedUser, setNewTaskAssignedUser] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('OPEN');

  const [menuAnchorTask, setMenuAnchorTask] = useState(null);
  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState(null);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [editTaskProject, setEditTaskProject] = useState('');
  const [editTaskUser, setEditTaskUser] = useState('');
  const [editTaskName, setEditTaskName] = useState('');
  const [editTaskDesc, setEditTaskDesc] = useState('');
  const [editTaskStatus, setEditTaskStatus] = useState('OPEN');

  // -------------------- URLOPY --------------------
  const [vacations, setVacations] = useState([]);
  const [openAddVacationDialog, setOpenAddVacationDialog] = useState(false);
  const [newVacationDate, setNewVacationDate] = useState('');
  const [newVacationDuration, setNewVacationDuration] = useState('');
  const [newVacationComments, setNewVacationComments] = useState('');
  const [newVacationAssignedUser, setNewVacationAssignedUser] = useState('');

  const [menuAnchorVacation, setMenuAnchorVacation] = useState(null);
  const [selectedVacationForMenu, setSelectedVacationForMenu] = useState(null);
  const [openVacationDialog, setOpenVacationDialog] = useState(false);
  const [editVacationDate, setEditVacationDate] = useState('');
  const [editVacationDuration, setEditVacationDuration] = useState('');
  const [editVacationComments, setEditVacationComments] = useState('');

  const [openVacationInfoDialog, setOpenVacationInfoDialog] = useState(false);
  const [infoVacationDialogData, setInfoVacationDialogData] = useState(null);

  // -------------------- REFS --------------------
  const calendarRef = useRef(null);

  // ---------------------------------------------
  // ŁADOWANIE DANYCH
  // ---------------------------------------------
  useEffect(() => {
    fetchCurrentUser();
    fetchTasks();
    fetchProjects();
    fetchVacations();
    fetchAllPosts();
  }, []);

  useEffect(() => {
    if (userRole === 'Boss') {
      fetchUsers();
    }
  }, [userRole]);

  const fetchCurrentUser = () => {
    AxiosInstance.get('/users/me/')
      .then((res) => {
        setUserRole(res.data.role);
        setLoggedInUser(res.data);
      })
      .catch((err) => console.error('Error fetching user role:', err));
  };

  const fetchTasks = () => {
    AxiosInstance.get('/tasks/')
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.error('Error fetching tasks:', err));
  };

  const fetchProjects = () => {
    AxiosInstance.get('/projects/')
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => console.error('Error fetching projects:', err));
  };

  const fetchUsers = () => {
    AxiosInstance.get('/users/')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.error('Error fetching users:', err));
  };

  const fetchVacations = () => {
    AxiosInstance.get('/vacations/')
      .then((res) => {
        setVacations(res.data);
      })
      .catch((err) => console.error('Error fetching vacations:', err));
  };

  const fetchAllPosts = () => {
    AxiosInstance.get('/posts/')
      .then((res) => {
        setAllPosts(res.data);
      })
      .catch((err) => {
        console.error('Error fetching all posts for calendar:', err);
      });
  };

  // ---------------------------------------------
  // OBSŁUGA ZAKŁADEK
  // ---------------------------------------------
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

    // ---------------------------------------------
  // FILTROWANIE TASKÓW (FRONTEND)
  // ---------------------------------------------
  // Zwracamy listę tasks uwzględniając checkbox "showClosed", projectFilter, userFilter
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // 1) Czy pokazywać CLOSED
    if (!showClosed) {
      filtered = filtered.filter((t) => t.status !== 'CLOSED');
    }

    // 2) Filtrowanie po projekcie, jeżeli projectFilter != ''
    if (projectFilter) {
      filtered = filtered.filter(
        (t) => t.assigned_project?.project_id === Number(projectFilter)
      );
    }

    // 3) Filtrowanie po użytkowniku (tylko Boss)
    if (userRole === 'Boss' && userFilter) {
      filtered = filtered.filter(
        (t) => t.assigned_user?.user_id === Number(userFilter)
      );
    }

    return filtered;
  };

  // =============================================
  // 1) LISTA ZADAŃ (Zakładka 0)
  // =============================================

  const handleExpandTask = (taskId, isExpanded) => {
    if (isExpanded) {
      setExpandedTaskId(taskId);

      AxiosInstance.get(`/posts/?assigned_task=${taskId}`)
        .then((res) => {
          setPostsByTask((prev) => ({
            ...prev,
            [taskId]: res.data,
          }));
        })
        .catch((err) => console.error('Error fetching posts:', err));
    } else {
      setExpandedTaskId(null);
    }
  };

  const getPostsForTask = (taskId) => {
    return postsByTask[taskId] || [];
  };

  // ---------------------------------------------
  // MENU W ZADANIU
  // ---------------------------------------------
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
      .then(() => fetchTasks()) // odśwież listę zadań
      .then(() => {
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
      });
  };

  // =============================================
  // 2) MENU W POŚCIE
  // =============================================
  const handlePostMenuClick = (event, post) => {
    setMenuAnchorPost(event.currentTarget);
    setSelectedPostForMenu(post);
  };

  const handlePostMenuClose = () => {
    setMenuAnchorPost(null);
  };

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
      .then(() => AxiosInstance.get(`/posts/?assigned_task=${realTaskId}`))
      .then((res) => {
        setPostsByTask((prev) => ({
          ...prev,
          [realTaskId]: res.data,
        }));
        setOpenPostDialog(false);
        setSelectedPostForMenu(null);
        alert('Post zaktualizowany pomyślnie!');

        fetchTasks();

        if (calendarRef.current && calendarRef.current.refreshEvents) {
          calendarRef.current.refreshEvents();
        }
      })
      .catch((err) => {
        console.error('Error updating post:', err?.response?.data || err);
        alert(
          'Nie udało się zaktualizować posta: ' +
            (err?.response?.data?.detail || '')
        );
      });
  };

  // -> Usuwanie Posta
  const handleDeletePostClick = () => {
    if (!selectedPostForMenu)
      return;

    setOpenDeletePostDialog(true);
    handlePostMenuClose();
    setDeletePostChecked(false);
  };

  const handleCloseDeletePostDialog = () => {
    setOpenDeletePostDialog(false);
    setDeletePostChecked(false);
    setSelectedPostForMenu(null);
  };

  const handleConfirmDeletePost = () => {
    if (!selectedPostForMenu) return;
    const realTaskId =
      selectedPostForMenu.assigned_task?.task_id ||
      selectedPostForMenu.assigned_task;

    AxiosInstance.delete(`/posts/${selectedPostForMenu.post_id}/`)
      .then(() => {
        alert('Post usunięty pomyślnie!');
        return AxiosInstance.get(`/posts/?assigned_task=${realTaskId}`);
      })
      .then((res) => {

        setPostsByTask((prev) => ({
          ...prev,
          [realTaskId]: res.data,
        }));

        fetchTasks();

        if (calendarRef.current && calendarRef.current.refreshEvents) {
          calendarRef.current.refreshEvents();
        }
      })
      .catch((err) => {
        console.error('Error deleting post:', err?.response?.data || err);
        alert(
          'Nie udało się usunąć posta: ' +
            (err?.response?.data?.detail || '')
        );
      })
      .finally(() => {
        handleCloseDeletePostDialog();
      });
  };

  // =============================================
  // 3) DODAWANIE POSTA (Zakładka 1)
  // =============================================
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

        // Po utworzeniu posta:
        return AxiosInstance.get('/posts/');
      })
      .then((res) => {
        setAllPosts(res.data);
        fetchTasks();

        if (calendarRef.current && calendarRef.current.refreshEvents) {
          calendarRef.current.refreshEvents();
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

  // =============================================
  // 4) DODAWANIE TASKA (Zakładka 2 - Boss)
  // =============================================
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

  // =============================================
  // INFORMACJE O POŚCIE (DIALOG)
  // =============================================
  const handlePostInfoDialogOpen = (post) => {
    setInfoDialogData(post);
    setOpenPostInfoDialog(true);
  };

  const handleClosePostInfoDialog = () => {
    setOpenPostInfoDialog(false);
    setInfoDialogData(null);
  };

  const getUserName = (post) => {
    const assignedTask = post.assigned_task;
    if (assignedTask && assignedTask.assigned_user) {
      return assignedTask.assigned_user.username || 'unknown user';
    }
    return '(brak użytkownika)';
  };

  // =============================================
  // DODAWANIE URLOPU (VACATION)
  // =============================================
  const handleAddVacation = () => {
    if (!selectedDate) {
      alert('Wybierz datę w kalendarzu!');
      return;
    }
    if (!newVacationAssignedUser) {
      alert('Brak użytkownika!'); 
      return;
    }
    if (!newVacationDuration) {
      alert('Podaj czas trwania (h)!');
      return;
    }

    const body = {
      assigned_user_id: newVacationAssignedUser,
      vacation_date: format(selectedDate, 'yyyy-MM-dd'),
      duration: newVacationDuration,
      comments: newVacationComments,
    };

    AxiosInstance.post('/vacations/', body)
      .then(() => {
        alert('Urlop dodany!');
        setOpenAddVacationDialog(false);
        setNewVacationDate('');
        setNewVacationDuration('');
        setNewVacationComments('');
        setNewVacationAssignedUser('');

        return AxiosInstance.get('/vacations/');
      })
      .then((res) => {
        setVacations(res.data);
        if (calendarRef.current && calendarRef.current.refreshEvents) {
          calendarRef.current.refreshEvents();
        }
      })
      .catch((err) => {
        console.error('Error creating vacation:', err?.response?.data || err);
        alert('Nie udało się dodać urlopu.');
      });
  };

  const handleCloseAddVacationDialog = () => {
    setOpenAddVacationDialog(false);
    setNewVacationDate('');
    setNewVacationDuration('');
    setNewVacationComments('');
    setNewVacationAssignedUser('');
  };

  // ---------------------------------------------
  // Funkcja otwierająca dialog "Dodaj Urlop" w menu kalendarza
  // Dla role 'Employee' – automatycznie ustawiamy newVacationAssignedUser na zalogowanego usera
  // ---------------------------------------------
  const handleAddVacationFromMenu = () => {
    handleCloseDayMenu();
    if (userRole === 'Employee' && loggedInUser) {
      setNewVacationAssignedUser(loggedInUser.user_id); 
    }
    setOpenAddVacationDialog(true);
  };

  // =============================================
  // EDYCJA URLOPU
  // =============================================
  const handleVacationMenuClick = (e, vacation) => {
    if (!vacation) return;
    setMenuAnchorVacation(e.currentTarget);
    setSelectedVacationForMenu(vacation);

    setEditVacationDate(vacation.vacation_date);
    setEditVacationDuration(vacation.duration);
    setEditVacationComments(vacation.comments);
  };

  const handleVacationMenuClose = () => {
    setMenuAnchorVacation(null);
  };

  const handleEditVacation = () => {
    if (!selectedVacationForMenu) return;

    const body = {
      vacation_date: editVacationDate,
      duration: editVacationDuration,
      comments: editVacationComments,
    };
    AxiosInstance.patch(
      `/vacations/${selectedVacationForMenu.vacation_id}/`,
      body
    )
      .then(() => {
        alert('Urlop zaktualizowany!');
        setOpenVacationDialog(false);
        setSelectedVacationForMenu(null);
        setMenuAnchorVacation(null);

        return AxiosInstance.get('/vacations/');
      })
      .then((res) => {
        setVacations(res.data);

        if (calendarRef.current && calendarRef.current.refreshEvents) {
          calendarRef.current.refreshEvents();
        }
      })
      .catch((err) => {
        console.error('Error updating vacation:', err?.response?.data || err);
        alert('Nie udało się zaktualizować urlopu.');
      });
  };

  // =============================================
  // INFORMACJE O URLOPIE (DIALOG)
  // =============================================
  const handleVacationInfoDialogOpen = (vacation) => {
    setInfoVacationDialogData(vacation);
    setOpenVacationInfoDialog(true);
  };

  const handleCloseVacationInfoDialog = () => {
    setOpenVacationInfoDialog(false);
    setInfoVacationDialogData(null);
  };

  // =============================================
  // KALENDARZ - obsługa kliknięć w "pusty dzień" i "event"
  // =============================================
  const [menuAnchorDay, setMenuAnchorDay] = useState(null);

  const handleEmptyDayClick = (day, anchorEl) => {
    setSelectedDate(day);
    setMenuAnchorDay({
      anchor: anchorEl,
    });
  };

  const handleCloseDayMenu = () => {
    setMenuAnchorDay(null);
  };

  const handleAddPostFromMenu = () => {
    handleCloseDayMenu();
    setOpenAddPostDialog(true);
  };

  const handleEventClick = (event) => {
    if (event.type === 'post') {
      handlePostInfoDialogOpen(event.data);
    } else if (event.type === 'vacation') {
      handleVacationInfoDialogOpen(event.data);
    }
  };

  // ---------------------------------------------
  // Dane do kalendarza
  // ---------------------------------------------
  const postsToEvents = () => {
    return allPosts.map((p) => ({
      id: p.post_id,
      type: 'post',
      date: p.post_date,
      data: p,
    }));
  };

  const vacationsToEvents = () => {
    return vacations.map((v) => ({
      id: v.vacation_id,
      type: 'vacation',
      date: v.vacation_date,
      data: v,
    }));
  };

  const allEvents = [...postsToEvents(), ...vacationsToEvents()];

  // Zakładki: (0) Lista zadań, (1) Dodaj Post
  // Gdy userRole = 'Boss', to (2) Dodaj Zadanie
  const tabLabels = ['Lista zadań', 'Dodaj Post'];
  if (userRole === 'Boss') {
    tabLabels.push('Dodaj Zadanie');
  }

  // ---------------------------------------------
  // STYLE DLA STATUSU: Kolor w zależności od statusu
  // ---------------------------------------------
  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return '#7A0099';
      case 'SUSPENDED':
        return '#f2f0f0';
      case 'CLOSED':
        return '#0A1931';
      default:
        return '#fff';
    }
  };

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
        sx={{ marginBottom: 2 }}
        TabIndicatorProps={{ style: { backgroundColor: theme.palette.violet.light } }}
      >
        {tabLabels.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>

      {/* =================== ZAKŁADKA 0: LISTA ZADAŃ =================== */}
      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          {/* Filtry: checkbox i selecty */}
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

            {/* Filtrowanie po Projekcie */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Projekt</InputLabel>
              <Select
                value={projectFilter}
                label="Filtr: Projekt"
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <MUIMenuItem value="">(Wszystkie projekty)</MUIMenuItem>
                {projects.map((proj) => (
                  <MUIMenuItem key={proj.project_id} value={proj.project_id}>
                    {proj.name}
                  </MUIMenuItem>
                ))}
              </Select>
            </FormControl>

            {userRole === 'Boss' && (
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Użytkownik</InputLabel>
                <Select
                  value={userFilter}
                  label="Filtr: Użytkownik"
                  onChange={(e) => setUserFilter(e.target.value)}
                >
                  <MUIMenuItem value="">(Wszyscy użytkownicy)</MUIMenuItem>
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
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Lista zadań
              </Typography>

              {getFilteredTasks()
                .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
                .map((task) => (
                  <Accordion
                    key={task.task_id}
                    expanded={expandedTaskId === task.task_id}
                    onChange={(_, isExpanded) => handleExpandTask(task.task_id, isExpanded)}
                    sx={{ 
                      mb: 1,
                      borderLeft: `5px solid ${getStatusColor(task.status)}`,
                    }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskMenuClick(e, task);
                            }}
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

            {/* Prawa: Posty do wybranego zadania */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Lista postów
              </Typography>
              {expandedTaskId ? (
                <>
                  {getPostsForTask(expandedTaskId).length === 0 ? (
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, textAlign: 'center' }}
                    >
                      Brak postów dla tego zadania
                    </Typography>
                  ) : (
                    getPostsForTask(expandedTaskId)
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
                                Data:{' '}
                                {new Date(post.post_date).toISOString().slice(0,10).split('-').reverse().join('-')}
                                {'  •  '}Godziny pracy: {post.work_hours}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePostMenuClick(e, post);
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            {post.comment && (
                              <Typography
                                sx={{
                                  whiteSpace: 'pre-wrap',
                                  overflowWrap: 'anywhere',
                                }}
                              >
                                Komentarz: {post.comment}
                              </Typography>
                            )}
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

      {/* =================== ZAKŁADKA 1: DODAJ POST =================== */}
      {tabValue === 1 && (
        <Box sx={{ mt: 3, minHeight: 500 }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Calendar
              ref={calendarRef}
              events={allEvents}
              onEventClick={handleEventClick}
              onEmptyDayClick={handleEmptyDayClick}
            />
          </Box>
        </Box>
      )}

      {/* =================== ZAKŁADKA 2: DODAJ TASK (tylko Boss) =================== */}
      {userRole === 'Boss' && tabValue === 2 && (
        <Box sx={{ mt: 3, maxWidth: 600, margin: '0 auto' }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
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

      {/* =================== Menu Zadania =================== */}
      <Menu
        anchorEl={menuAnchorTask}
        open={Boolean(menuAnchorTask)}
        onClose={handleTaskMenuClose}
      >
        <MUIMenuItem onClick={handleTaskEditClick}>Edytuj zadanie</MUIMenuItem>
      </Menu>

      {/* =================== Dialog Edycji Zadania =================== */}
      <Dialog
        open={openTaskDialog}
        onClose={() => setOpenTaskDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Edytuj Zadanie</DialogTitle>
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

      {/* =================== Menu Postów =================== */}
      <Menu
        anchorEl={menuAnchorPost}
        open={Boolean(menuAnchorPost)}
        onClose={handlePostMenuClose}
      >
        <MUIMenuItem onClick={handlePostEditClick}>Edytuj post</MUIMenuItem>
        <MUIMenuItem onClick={handleDeletePostClick}>Usuń post</MUIMenuItem>
      </Menu>

      {/* =================== Dialog Edycji Posta =================== */}
      <Dialog
        open={openPostDialog}
        onClose={() => setOpenPostDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Edytuj Post</DialogTitle>
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

      {/* =================== DIALOG USUWANIA POSTA =================== */}
      <Dialog
        open={openDeletePostDialog}
        onClose={handleCloseDeletePostDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          Czy na pewno chcesz usunąć post?
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={deletePostChecked}
                onChange={(e) => setDeletePostChecked(e.target.checked)}
              />
            }
            label="Tak, jestem pewien"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletePostDialog}>Anuluj</Button>
          <Button
            variant="contained"
            color="error"
            disabled={!deletePostChecked}
            onClick={handleConfirmDeletePost}
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================== Dialog Informacyjny o Poście =================== */}
      <Dialog
        open={openPostInfoDialog}
        onClose={handleClosePostInfoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Informacje o Poście</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                <strong>Czas pracy (godziny):</strong>{' '}
                {infoDialogData.work_hours}
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

      {/* =================== Dialog Dodawania Posta =================== */}
      <Dialog
        open={openAddPostDialog}
        onClose={handleCloseAddPostDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Dodaj Post</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
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
              {tasks
                .filter(task => task.status === 'OPEN')
                .map((t) => (
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

      {/* =================== DIALOG Dodawania Urlopu =================== */}
      <Dialog
        open={openAddVacationDialog}
        onClose={handleCloseAddVacationDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Dodaj Urlop</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField
            label="Data Urlopu"
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
            InputProps={{ readOnly: true }}
            disabled
            autoFocus
            margin="dense"
          />
          {userRole === 'Employee' ? (
            <TextField
              label="Pracownik"
              value={loggedInUser?.username || ''}
              disabled
            />
          ) : (
            <FormControl fullWidth>
              <InputLabel>Pracownik</InputLabel>
              <Select
                value={newVacationAssignedUser}
                label="Pracownik"
                onChange={(e) => setNewVacationAssignedUser(e.target.value)}
              >
                {users.map((u) => (
                  <MUIMenuItem key={u.user_id} value={u.user_id}>
                    {u.username}
                  </MUIMenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            label="Czas trwania (h)"
            type="number"
            value={newVacationDuration}
            onChange={(e) => setNewVacationDuration(e.target.value)}
          />
          <TextField
            label="Komentarz"
            multiline
            rows={3}
            value={newVacationComments}
            onChange={(e) => setNewVacationComments(e.target.value)}
            inputProps={{
              style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddVacationDialog}>Anuluj</Button>
          <Button
            variant="contained"
            onClick={handleAddVacation}
            sx={{
              backgroundColor: 'violet.main',
              '&:hover': { backgroundColor: 'violet.light' },
            }}
          >
            Dodaj Urlop
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================== Menu "Pustego Dnia" w Kalendarzu =================== */}
      <Menu
        anchorEl={menuAnchorDay?.anchor}
        open={Boolean(menuAnchorDay)}
        onClose={handleCloseDayMenu}
      >
        <MUIMenuItem onClick={handleAddPostFromMenu}>Dodaj Post</MUIMenuItem>
        {/* Employee też może dodać urlop */}
        <MUIMenuItem onClick={handleAddVacationFromMenu}>
          Dodaj Urlop
        </MUIMenuItem>
      </Menu>

      {/* =================== Menu Urlopu =================== */}
      <Menu
        anchorEl={menuAnchorVacation}
        open={Boolean(menuAnchorVacation)}
        onClose={handleVacationMenuClose}
      >
        {userRole === 'Boss' && (
          <MUIMenuItem
            onClick={() => {
              setOpenVacationDialog(true);
              handleVacationMenuClose();
            }}
          >
            Edytuj urlop
          </MUIMenuItem>
        )}
        <MUIMenuItem
          onClick={() => {
            handleVacationInfoDialogOpen(selectedVacationForMenu);
            handleVacationMenuClose();
          }}
        >
          Pokaż informacje
        </MUIMenuItem>
      </Menu>

      {/* =================== Dialog Edycji Urlopu (Boss) =================== */}
      <Dialog
        open={openVacationDialog}
        onClose={() => setOpenVacationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Edytuj Urlop</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Data Urlopu"
            type="date"
            value={editVacationDate}
            onChange={(e) => setEditVacationDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            autoFocus
            margin="dense"
          />
          <TextField
            label="Czas trwania (h)"
            type="number"
            value={editVacationDuration}
            onChange={(e) => setEditVacationDuration(e.target.value)}
          />
          <TextField
            label="Komentarz"
            multiline
            rows={3}
            value={editVacationComments}
            onChange={(e) => setEditVacationComments(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVacationDialog(false)}>Anuluj</Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'violet.main',
              '&:hover': { backgroundColor: 'violet.light' },
            }}
            onClick={handleEditVacation}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================== Dialog Informacyjny o Urlopie =================== */}
      <Dialog
        open={openVacationInfoDialog}
        onClose={handleCloseVacationInfoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Informacje o Urlopie</DialogTitle>
        <DialogContent>
          {infoVacationDialogData && (
            <>
              <Typography>
                <strong>Pracownik:</strong>{' '}
                {infoVacationDialogData.assigned_user?.username ||
                  '(Niezdefiniowany)'}
              </Typography>
              <Typography>
                <strong>Data Urlopu:</strong>{' '}
                {format(new Date(infoVacationDialogData.vacation_date), 'dd-MM-yyyy')}
              </Typography>
              <Typography>
                <strong>Czas trwania:</strong>{' '}
                {infoVacationDialogData.duration}h
              </Typography>
              {infoVacationDialogData.comments && (
                <Typography>
                  <strong>Komentarze:</strong> {infoVacationDialogData.comments}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVacationInfoDialog}>Zamknij</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Tasks;