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

import Calendar from './Calendar'; // Upewnij się, że ścieżka do pliku Calendar.js jest poprawna
import { format } from 'date-fns';

const TASK_STATUSES = ['OPEN', 'SUSPENDED', 'CLOSED'];
const VACATION_STATUSES = ['PENDING', 'CONFIRMED'];

function Tasks() {
  const theme = useTheme();

  const [userRole, setUserRole] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [tabValue, setTabValue] = useState(0);

  // -------------------- POSTY do kalendarza --------------------
  const [allPosts, setAllPosts] = useState([]);

  // -------------------- TASKI --------------------
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [postsByTask, setPostsByTask] = useState({});

  // -------------------- PROJEKTY I UŻYTKOWNICY --------------------
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  // -------------------- FILTROWANIE (Lista Zadań) --------------------
  const [showClosed, setShowClosed] = useState(false); 
  const [projectFilter, setProjectFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  // -------------------- FILTROWANIE (KALENDARZ) --------------------
  // a) checkbox, który chowa/pokazuje urlopy w kalendarzu
  const [hideVacations, setHideVacations] = useState(false);

  // b) Dla Bossa – filtr po użytkowniku (filtrowanie postów i urlopów wybranego usera)
  const [calendarUserFilter, setCalendarUserFilter] = useState('');

  // (opcjonalnie) Dla Bossa/Employee – można też dodać select do filtrowania Tasków w kalendarzu
  const [calendarTaskFilter, setCalendarTaskFilter] = useState('');

  // -------------------- DODAWANIE I EDYCJA POSTÓW --------------------
  const [openAddPostDialog, setOpenAddPostDialog] = useState(false);
  const [newPostAssignedTask, setNewPostAssignedTask] = useState('');
  const [newPostWorkHours, setNewPostWorkHours] = useState('');
  const [newPostComment, setNewPostComment] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  // Menu i edycja postów
  const [menuAnchorPost, setMenuAnchorPost] = useState(null);
  const [selectedPostForMenu, setSelectedPostForMenu] = useState(null);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [editPostWorkHours, setEditPostWorkHours] = useState('');
  const [editPostComment, setEditPostComment] = useState('');

  // Usuwanie Postów
  const [openDeletePostDialog, setOpenDeletePostDialog] = useState(false);
  const [deletePostChecked, setDeletePostChecked] = useState(false);

  // Dialog informacyjny o Poście
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

  // Dialog informacyjny o urlopie (z możliwością zatwierdzenia lub odrzucenia)
  const [openVacationInfoDialog, setOpenVacationInfoDialog] = useState(false);
  const [infoVacationDialogData, setInfoVacationDialogData] = useState(null);

  // Ref do kalendarza
  const calendarRef = useRef(null);

  // ========================= ŁADOWANIE DANYCH =========================
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

  const fetchCurrentUser = async () => {
    try {
      const res = await AxiosInstance.get('/users/me/');
      setUserRole(res.data.role);
      setLoggedInUser(res.data);
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await AxiosInstance.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await AxiosInstance.get('/projects/');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await AxiosInstance.get('/users/');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchVacations = async () => {
    try {
      const res = await AxiosInstance.get('/vacations/');
      setVacations(res.data);
    } catch (err) {
      console.error('Error fetching vacations:', err);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const res = await AxiosInstance.get('/posts/');
      setAllPosts(res.data);
    } catch (err) {
      console.error('Error fetching all posts:', err);
    }
  };

  // ========================= OBSŁUGA ZAKŁADEK =========================
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // ========================= FILTROWANIE (LISTA ZADAŃ) =========================
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    if (!showClosed) {
      filtered = filtered.filter((t) => t.status !== 'CLOSED');
    }
    if (projectFilter) {
      filtered = filtered.filter(
        (t) => t.assigned_project?.project_id === Number(projectFilter)
      );
    }
    if (userRole === 'Boss' && userFilter) {
      filtered = filtered.filter(
        (t) => t.assigned_user?.user_id === Number(userFilter)
      );
    }
    return filtered;
  };

  // ========================= LISTA ZADAŃ (ZAKŁADKA 0) =========================
  const handleExpandTask = (taskId, isExpanded) => {
    if (isExpanded) {
      setExpandedTaskId(taskId);
      AxiosInstance.get(`/posts/?assigned_task=${taskId}`)
        .then((res) => {
          setPostsByTask((prev) => ({ ...prev, [taskId]: res.data }));
        })
        .catch((err) => console.error('Error fetching posts:', err));
    } else {
      setExpandedTaskId(null);
    }
  };

  const getPostsForTask = (taskId) => postsByTask[taskId] || [];

  // -------------------- MENU W ZADANIU --------------------
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

  const handleSaveTaskChanges = async () => {
    if (!selectedTaskForMenu) return;
    const body = {
      assigned_project_id: editTaskProject,
      assigned_user_id: editTaskUser,
      name: editTaskName,
      description: editTaskDesc,
      status: editTaskStatus,
    };
    try {
      await AxiosInstance.patch(`/tasks/${selectedTaskForMenu.task_id}/`, body);
      await fetchTasks();
      setOpenTaskDialog(false);
      setSelectedTaskForMenu(null);
      alert('Zadanie zaktualizowane pomyślnie!');
    } catch (err) {
      console.error('Error updating task:', err?.response?.data || err);
      alert(
        'Nie udało się zaktualizować zadania: ' +
          (err?.response?.data?.detail || '')
      );
    }
  };

  // ========================= MENU W POŚCIE =========================
  const handlePostMenuClick = (event, post) => {
    setMenuAnchorPost(event.currentTarget);
    setSelectedPostForMenu(post);
  };

  const handlePostMenuClose = () => {
    setMenuAnchorPost(null);
  };

  const handlePostEditClick = () => {
    if (!selectedPostForMenu) return;
    setEditPostWorkHours(selectedPostForMenu.work_hours || '');
    setEditPostComment(selectedPostForMenu.comment || '');
    setOpenPostDialog(true);
    handlePostMenuClose();
  };

  const handleSavePostChanges = async () => {
    if (!selectedPostForMenu) return;
    const body = {
      work_hours: editPostWorkHours,
      comment: editPostComment,
    };
    const realTaskId =
      selectedPostForMenu.assigned_task?.task_id ||
      selectedPostForMenu.assigned_task;
    try {
      await AxiosInstance.patch(`/posts/${selectedPostForMenu.post_id}/`, body);
      const res = await AxiosInstance.get(`/posts/?assigned_task=${realTaskId}`);
      setPostsByTask((prev) => ({ ...prev, [realTaskId]: res.data }));
      setOpenPostDialog(false);
      setSelectedPostForMenu(null);
      alert('Post zaktualizowany pomyślnie!');
      await fetchTasks();
      if (calendarRef.current && calendarRef.current.refreshEvents) {
        calendarRef.current.refreshEvents();
      }
    } catch (err) {
      console.error('Error updating post:', err?.response?.data || err);
      alert(
        'Nie udało się zaktualizować posta: ' +
          (err?.response?.data?.detail || '')
      );
    }
  };

  const handleDeletePostClick = () => {
    if (!selectedPostForMenu) return;
    setOpenDeletePostDialog(true);
    handlePostMenuClose();
    setDeletePostChecked(false);
  };

  const handleCloseDeletePostDialog = () => {
    setOpenDeletePostDialog(false);
    setDeletePostChecked(false);
    setSelectedPostForMenu(null);
  };

  const handleConfirmDeletePost = async () => {
    if (!selectedPostForMenu) return;
    const realTaskId =
      selectedPostForMenu.assigned_task?.task_id ||
      selectedPostForMenu.assigned_task;
    try {
      await AxiosInstance.delete(`/posts/${selectedPostForMenu.post_id}/`);
      alert('Post usunięty pomyślnie!');
      const res = await AxiosInstance.get(`/posts/?assigned_task=${realTaskId}`);
      setPostsByTask((prev) => ({ ...prev, [realTaskId]: res.data }));
      await fetchTasks();
      if (calendarRef.current && calendarRef.current.refreshEvents) {
        calendarRef.current.refreshEvents();
      }
    } catch (err) {
      console.error('Error deleting post:', err?.response?.data || err);
      alert(
        'Nie udało się usunąć posta: ' +
          (err?.response?.data?.detail || '')
      );
    } finally {
      handleCloseDeletePostDialog();
    }
  };

  // ========================= DODAWANIE POSTA (ZAKŁADKA 1) =========================
  const handleAddPost = async () => {
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
    try {
      await AxiosInstance.post('/posts/', body);
      alert('Post dodany!');
      setNewPostAssignedTask('');
      setNewPostWorkHours('');
      setNewPostComment('');
      setSelectedDate(null);
      setOpenAddPostDialog(false);

      const res = await AxiosInstance.get('/posts/');
      setAllPosts(res.data);

      await fetchTasks();
      if (calendarRef.current && calendarRef.current.refreshEvents) {
        calendarRef.current.refreshEvents();
      }
    } catch (err) {
      console.error('Error creating post:', err?.response?.data || err);
      alert(
        'Nie udało się dodać posta: ' + (err?.response?.data?.detail || '')
      );
    }
  };

  const handleCloseAddPostDialog = () => {
    setOpenAddPostDialog(false);
    setNewPostAssignedTask('');
    setNewPostWorkHours('');
    setNewPostComment('');
    setSelectedDate(null);
  };

  // ========================= DODAWANIE TASKA (ZAKŁADKA 2 - Boss) =========================
  const handleAddTask = async () => {
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
    try {
      await AxiosInstance.post('/tasks/', body);
      alert('Task dodany!');
      setNewTaskAssignedProject('');
      setNewTaskAssignedUser('');
      setNewTaskName('');
      setNewTaskDesc('');
      setNewTaskStatus('OPEN');
      const res = await AxiosInstance.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error('Error creating task:', err?.response?.data || err);
      alert(
        'Nie udało się dodać zadania. ' +
          (err?.response?.data?.detail || 'Sprawdź uprawnienia.')
      );
    }
  };

  // ========================= INFO O POŚCIE (DIALOG) =========================
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

  // ========================= DODAWANIE URLOPU =========================
  const handleAddVacation = async () => {
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
    const initialStatus = userRole === 'Boss' ? 'CONFIRMED' : 'PENDING';
    const body = {
      assigned_user_id: newVacationAssignedUser,
      vacation_date: format(selectedDate, 'yyyy-MM-dd'),
      duration: newVacationDuration,
      comments: newVacationComments,
      status: initialStatus,
    };
    try {
      await AxiosInstance.post('/vacations/', body);
      alert('Urlop dodany!');
      setOpenAddVacationDialog(false);
      setNewVacationDate('');
      setNewVacationDuration('');
      setNewVacationComments('');
      setNewVacationAssignedUser('');
      const res = await AxiosInstance.get('/vacations/');
      setVacations(res.data);
      if (calendarRef.current && calendarRef.current.refreshEvents) {
        calendarRef.current.refreshEvents();
      }
    } catch (err) {
      console.error('Error creating vacation:', err?.response?.data || err);
      alert('Nie udało się dodać urlopu.');
    }
  };

  const handleCloseAddVacationDialog = () => {
    setOpenAddVacationDialog(false);
    setNewVacationDate('');
    setNewVacationDuration('');
    setNewVacationComments('');
    setNewVacationAssignedUser('');
  };

  // ========================= EDYCJA URLOPU (Boss) =========================
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

  const handleEditVacation = async () => {
    if (!selectedVacationForMenu) return;
    const body = {
      vacation_date: editVacationDate,
      duration: editVacationDuration,
      comments: editVacationComments,
    };
    try {
      await AxiosInstance.patch(
        `/vacations/${selectedVacationForMenu.vacation_id}/`,
        body
      );
      alert('Urlop zaktualizowany!');
      setOpenVacationDialog(false);
      setSelectedVacationForMenu(null);
      setMenuAnchorVacation(null);

      const res = await AxiosInstance.get('/vacations/');
      setVacations(res.data);
      if (calendarRef.current && calendarRef.current.refreshEvents) {
        calendarRef.current.refreshEvents();
      }
    } catch (err) {
      console.error('Error updating vacation:', err?.response?.data || err);
      alert('Nie udało się zaktualizować urlopu.');
    }
  };

  const handleVacationInfoDialogOpen = (vacation) => {
    if (!vacation) return;
    setInfoVacationDialogData(vacation);
    setOpenVacationInfoDialog(true);
  };

  const handleCloseVacationInfoDialog = () => {
    setOpenVacationInfoDialog(false);
    setInfoVacationDialogData(null);
  };

  // Zatwierdzenie i Odrzucenie (Boss)
  const confirmPendingVacation = async () => {
    if (!infoVacationDialogData) return;
    try {
      await AxiosInstance.patch(`/vacations/${infoVacationDialogData.vacation_id}/`, {
        status: 'CONFIRMED',
      });
      alert('Urlop zatwierdzony!');
      const res = await AxiosInstance.get('/vacations/');
      setVacations(res.data);
      setOpenVacationInfoDialog(false);
      setInfoVacationDialogData(null);
      if (calendarRef.current && calendarRef.current.refreshEvents) {
        calendarRef.current.refreshEvents();
      }
    } catch (err) {
      console.error('Error approving vacation:', err?.response?.data || err);
      alert('Nie udało się zatwierdzić urlopu.');
    }
  };

  const denyPendingVacation = async () => {
    if (!infoVacationDialogData) return;
    try {
      await AxiosInstance.patch(`/vacations/${infoVacationDialogData.vacation_id}/`, {
        status: 'REJECTED',
      });
      alert('Urlop został odrzucony.');
      const res = await AxiosInstance.get('/vacations/');
      setVacations(res.data);
      setOpenVacationInfoDialog(false);
      setInfoVacationDialogData(null);
      if (calendarRef.current && calendarRef.current.refreshEvents) {
        calendarRef.current.refreshEvents();
      }
    } catch (err) {
      console.error('Error deleting vacation:', err?.response?.data || err);
      alert('Nie udało się odrzucić (usunąć) urlopu.');
    }
  };

  // ========================= KALENDARZ =========================
  const [menuAnchorDay, setMenuAnchorDay] = useState(null);

  const handleEmptyDayClick = (day, anchorEl) => {
    setSelectedDate(day);
    setMenuAnchorDay({ anchor: anchorEl });
  };

  const handleCloseDayMenu = () => {
    setMenuAnchorDay(null);
  };

  const handleAddPostFromMenu = () => {
    handleCloseDayMenu();
    setOpenAddPostDialog(true);
  };

  const handleAddVacationFromMenu = () => {
    handleCloseDayMenu();
    if (userRole === 'Employee' && loggedInUser) {
      setNewVacationAssignedUser(loggedInUser.user_id);
    }
    setOpenAddVacationDialog(true);
  };

  const handleEventClick = (event) => {
    if (event.type === 'post') {
      handlePostInfoDialogOpen(event.data);
    } else if (event.type === 'vacation') {
      handleVacationInfoDialogOpen(event.data);
    }
  };

  // ---- Tworzymy tablicę eventów do kalendarza, z uwzględnieniem FILTRÓW z Kalendarza ----
  const postsToEvents = () => {
    // Ewentualne filtrowanie postów w Kalendarzu
    // - Jeśli np. userRole === 'Boss' i userFilter (calendarUserFilter) jest ustawiony,
    //   to bierzemy tylko posty, które należą do usera X
    // - Albo jeśli calendarTaskFilter jest ustawiony, to bierzemy tylko posty z danego taska
    // Przykład:
    let filteredPosts = [...allPosts];

    // FILTR DLA BOSSA: calendarUserFilter
    if (userRole === 'Boss' && calendarUserFilter) {
      filteredPosts = filteredPosts.filter((p) => {
        // p.assigned_task.assigned_user.user_id === calendarUserFilter
        const assignedUserId = p.assigned_task?.assigned_user?.user_id;
        return assignedUserId === Number(calendarUserFilter);
      });
    }

    // FILTR: calendarTaskFilter (jeżeli potrzebny)
    if (calendarTaskFilter) {
      filteredPosts = filteredPosts.filter(
        (p) => p.assigned_task?.task_id === Number(calendarTaskFilter)
      );
    }

    return filteredPosts.map((p) => ({
      id: p.post_id,
      type: 'post',
      date: p.post_date,
      data: p,
    }));
  };

  const vacationsToEvents = () => {
    let filteredVacations = [...vacations];

    if (hideVacations) {
      return [];
    }

    // FILTR DLA BOSSA: calendarUserFilter
    if (userRole === 'Boss' && calendarUserFilter) {
      filteredVacations = filteredVacations.filter(
        (v) => v.assigned_user?.user_id === Number(calendarUserFilter)
      );
    }

    return filteredVacations.map((v) => ({
      id: v.vacation_id,
      type: 'vacation',
      date: v.vacation_date,
      data: v,
    }));
  };

  // Łączymy posty i urlopy w finalEvents
  const finalEvents = [...postsToEvents(), ...vacationsToEvents()];

  // Zakładki
  const tabLabels = ['Lista zadań', 'Kalendarz'];
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

      {/* ---------------- ZAKŁADKA 0: LISTA ZADAŃ ---------------- */}
      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          {/* Filtry (lista zadań) */}
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
            {/* LEWA: zadania */}
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
                      borderLeft: '5px solid #7A0099',
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

            {/* PRAWA: Posty */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Lista postów
              </Typography>
              {expandedTaskId ? (
                <>
                  {getPostsForTask(expandedTaskId).length === 0 ? (
                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
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
                                {new Date(post.post_date)
                                  .toISOString()
                                  .slice(0, 10)
                                  .split('-')
                                  .reverse()
                                  .join('-')}
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

      {/* ---------------- ZAKŁADKA 1: KALENDARZ ---------------- */}
      {tabValue === 1 && (
        <Box sx={{ mt: 3, minHeight: 500 }}>
          {/* FILTRY DLA KALENDARZA */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hideVacations}
                  onChange={(e) => setHideVacations(e.target.checked)}
                />
              }
              label="Ukryj urlopy"
            />

            {/* Przykład: Select do filtrowania postów po TaskId w Kalendarzu */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Task</InputLabel>
              <Select
                value={calendarTaskFilter}
                label="Filtr: Task"
                onChange={(e) => setCalendarTaskFilter(e.target.value)}
              >
                <MUIMenuItem value="">(Wszystkie Taski)</MUIMenuItem>
                {tasks.map((t) => (
                  <MUIMenuItem key={t.task_id} value={t.task_id}>
                    {t.name}
                  </MUIMenuItem>
                ))}
              </Select>
            </FormControl>

            {userRole === 'Boss' && (
              <>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Użytkownik</InputLabel>
                  <Select
                    value={calendarUserFilter}
                    label="Filtr: Użytkownik"
                    onChange={(e) => setCalendarUserFilter(e.target.value)}
                  >
                    <MUIMenuItem value="">(Wszyscy użytkownicy)</MUIMenuItem>
                    {users.map((u) => (
                      <MUIMenuItem key={u.user_id} value={u.user_id}>
                        {u.username}
                      </MUIMenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Box>

          <Calendar
            ref={calendarRef}
            events={finalEvents} // <-- Przekazujemy przefiltrowaną listę eventów
            onEventClick={handleEventClick}
            onEmptyDayClick={handleEmptyDayClick}
          />
        </Box>
      )}

      {/* ---------------- ZAKŁADKA 2: Dodaj Task (tylko Boss) ---------------- */}
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

      {/* =================== MENU Zadania =================== */}
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
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '1rem' }}>
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
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '1rem' }}>
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
            sx={{ backgroundColor: 'violet.main', '&:hover': { backgroundColor: 'violet.light' } }}
            onClick={handleSavePostChanges}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================== Dialog Usuwania Posta =================== */}
      <Dialog
        open={openDeletePostDialog}
        onClose={handleCloseDeletePostDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          Czy na pewno chcesz usunąć post?
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={deletePostChecked}
                onChange={(e) => setDeletePostChecked(e.target.checked)}
              />
            }
            label="Potwierdzam usunięcie posta"
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

      {/* =================== Dialog Dodawania Posta =================== */}
      <Dialog
        open={openAddPostDialog}
        onClose={handleCloseAddPostDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Dodaj Post</DialogTitle>
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
              {tasks
                .filter((t) => t.status === 'OPEN')
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
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
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
        <MUIMenuItem onClick={handleAddVacationFromMenu}>Dodaj Urlop</MUIMenuItem>
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

      {/* =================== Dialog Edycji Urlopu (tylko Boss) =================== */}
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
            sx={{ backgroundColor: 'violet.main', '&:hover': { backgroundColor: 'violet.light' } }}
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
        {infoVacationDialogData && (
          <>
            {/* Boss + PENDING => zatwierdzanie lub odrzucanie */}
            {userRole === 'Boss' && infoVacationDialogData.status === 'PENDING' ? (
              <>
                <DialogTitle sx={{ textAlign: 'center' }}>
                  Zatwierdzenie Urlopu
                </DialogTitle>
                <DialogContent>
                  <Typography>
                    <strong>Pracownik:</strong>{' '}
                    {infoVacationDialogData.assigned_user?.username || '(Niezdefiniowany)'}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {infoVacationDialogData.status}
                  </Typography>
                  <Typography>
                    <strong>Data Urlopu:</strong>{' '}
                    {format(new Date(infoVacationDialogData.vacation_date), 'dd-MM-yyyy')}
                  </Typography>
                  <Typography>
                    <strong>Czas trwania:</strong> {infoVacationDialogData.duration}h
                  </Typography>
                  {infoVacationDialogData.comments && (
                    <Typography>
                      <strong>Komentarze:</strong> {infoVacationDialogData.comments}
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseVacationInfoDialog}>Anuluj</Button>
                  <Button variant="contained" color="error" onClick={denyPendingVacation}>
                    Odrzuć
                  </Button>
                  <Button variant="contained" color="success" onClick={confirmPendingVacation}>
                    Zatwierdź
                  </Button>
                </DialogActions>
              </>
            ) : (
              // Pozostałe przypadki: Employee ZAWSZE, Boss i CONFIRMED
              <>
                <DialogTitle sx={{ textAlign: 'center' }}>
                  Informacje o Urlopie
                </DialogTitle>
                <DialogContent>
                  <Typography>
                    <strong>Pracownik:</strong>{' '}
                    {infoVacationDialogData.assigned_user?.username || '(Niezdefiniowany)'}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {infoVacationDialogData.status}
                  </Typography>
                  <Typography>
                    <strong>Data Urlopu:</strong>{' '}
                    {format(new Date(infoVacationDialogData.vacation_date), 'dd-MM-yyyy')}
                  </Typography>
                  <Typography>
                    <strong>Czas trwania:</strong> {infoVacationDialogData.duration}h
                  </Typography>
                  {infoVacationDialogData.comments && (
                    <Typography>
                      <strong>Komentarze:</strong> {infoVacationDialogData.comments}
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseVacationInfoDialog}>Zamknij</Button>
                </DialogActions>
              </>
            )}
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Tasks;
