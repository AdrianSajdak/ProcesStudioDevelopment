// tasks.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  Select,
  MenuItem,
  TextField,
  Button
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import AxiosInstance from '../Axios';

function Tasks() {
  // ------------------------------
  // STANY OGÓLNE
  // ------------------------------
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // ------------------------------
  // UPRAWNIENIA
  // ------------------------------
  const [capabilities, setCapabilities] = useState(null);

  // ------------------------------
  // STANY DLA NOWEGO TASKA
  // ------------------------------
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    status: 'Open',
    work_hours: '',
    comments: '',
    start_date: '',
    end_date: '',
    assigned_user: ''
  });
  const [users, setUsers] = useState([]);

  // ------------------------------
  // STANY DLA EDYCJI TASKA
  // ------------------------------
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editTask, setEditTask] = useState({
    id: '',
    name: '',
    description: '',
    status: 'Open',
    work_hours: '',
    comments: '',
    start_date: '',
    end_date: '',
    assigned_user: ''
  });

  // ------------------------------
  // USE EFFECTS
  // ------------------------------
  useEffect(() => {
    fetchUserAndCapabilities();
  }, []);

  useEffect(() => {
    if (capabilities) {
      fetchTasks();
      if (capabilities.can_create_tasks || capabilities.can_view_users) {
        fetchUsers();
      }
    }
  }, [capabilities]);


  // ------------------------------
  // FUNKCJE - POBIERANIE
  // ------------------------------
  const fetchUserAndCapabilities = async () => {
    try {
      const response = await AxiosInstance.get('/user/');
      setCapabilities(response.data.capabilities);
    } catch (error) {
      console.error('Nie udało się pobrać informacji o użytkowniku:', error);
      setErrorMessage('Nie udało się pobrać informacji o użytkowniku. Upewnij się, że jesteś zalogowany.');
    }
  };

  const fetchTasks = async () => {
    setErrorMessage(null);
    try {
      const response = await AxiosInstance.get('/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania tasków:', error);
      setErrorMessage('Nie udało się pobrać listy tasków. Spróbuj ponownie później.');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await AxiosInstance.get('/users/');
      setUsers(res.data);
    } catch (error) {
      console.error('Błąd podczas pobierania listy użytkowników:', error);
    }
  };

  // ------------------------------
  // FUNKCJE - TABS
  // ------------------------------
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setErrorMessage(null);
  };

  // ------------------------------
  // LISTA TASKÓW
  // ------------------------------
  const handleExpandClick = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  // ------------------------------
  // DODAWANIE TASKA
  // ------------------------------
  const handleNewTaskInputChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTask = async () => {
    setErrorMessage(null);
    try {
      await AxiosInstance.post('/tasks/', newTask);
      fetchTasks();
      setNewTask({
        name: '',
        description: '',
        status: 'Open',
        work_hours: '',
        comments: '',
        start_date: '',
        end_date: '',
        assigned_user: ''
      });

      setTabValue(0);
    } catch (error) {
      console.error('Błąd podczas dodawania taska:', error);
      setErrorMessage('Nie udało się dodać taska. Sprawdź dane i spróbuj ponownie.');
    }
  };

  // ------------------------------
  // EDYCJA TASKA
  // ------------------------------
  const handleSelectTaskToEdit = (taskId) => {
    if (!taskId) {
      setSelectedTaskId(null);
      return;
    }
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTaskId(taskId);
      setEditTask({
        id: task.id,
        name: task.name || '',
        description: task.description || '',
        status: task.status || 'Open',
        work_hours: task.work_hours || '',
        comments: task.comments || '',
        start_date: task.start_date || '',
        end_date: task.end_date || '',
        assigned_user: task.assigned_user || ''
      });
    }
  };

  const handleEditTaskInputChange = (e) => {
    setEditTask({
      ...editTask,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateTask = async () => {
    setErrorMessage(null);
    try {
      await AxiosInstance.put(`/tasks/${editTask.id}/`, editTask);
      fetchTasks();

      setSelectedTaskId(null);
      setEditTask({
        id: '',
        name: '',
        description: '',
        status: 'Open',
        work_hours: '',
        comments: '',
        start_date: '',
        end_date: '',
        assigned_user: ''
      });
      setTabValue(0);
    } catch (error) {
      console.error('Błąd podczas edycji taska:', error);
      setErrorMessage('Nie udało się edytować taska. Sprawdź dane i spróbuj ponownie.');
    }
  };

  // ------------------------------------------
  // LOGIKA WYŚWIETLANIA W OPARCIU O UPRAWNIENIA
  // ------------------------------------------
  if (!capabilities) {
    return <Typography>Wczytywanie danych użytkownika...</Typography>;
  }

  const canViewAllTasks = capabilities.can_view_all_tasks;
  const canCreateTasks = capabilities.can_create_tasks;
  const canEditAllFields = capabilities.can_edit_all_task_fields;
  const canEditCommentsHours = capabilities.can_edit_task_comments_hours;

  if (canViewAllTasks === undefined) {
    return <Typography>Trwa sprawdzanie uprawnień...</Typography>;
  }

  // Tab 0: "Lista zadań"
  // Tab 1: "Nowy task" => jeśli can_create_tasks
  // Tab 2: "Edytuj taski" => jeśli canEditAllFields lub canEditCommentsHours
  let tabsToRender = [<Tab key="list" label="Lista zadań" />];
  if (canCreateTasks) {
    tabsToRender.push(<Tab key="new" label="Nowe zadanie" />);
  }
  if (canEditAllFields || canEditCommentsHours) {
    tabsToRender.push(<Tab key="edit" label="Edytuj zadania" />);
  }

  // Indeksy
  let listTabIndex = 0;
  let newTabIndex = canCreateTasks ? 1 : -1;
  let editTabIndex = -1;

  if (canCreateTasks && (canEditAllFields || canEditCommentsHours)) {
    editTabIndex = 2;
  } else if (!canCreateTasks && (canEditAllFields || canEditCommentsHours)) {
    editTabIndex = 1;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">Zadania</Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* TABS */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        {tabsToRender}
      </Tabs>

      {/* ZAKŁADKA 0: LISTA ZADAŃ */}
      {tabValue === listTabIndex && (
        <Box>
          {tasks.length === 0 ? (
            <Typography>Brak zadań do wyświetlenia.</Typography>
          ) : (
            <List>
              {tasks.map((task) => (
                <React.Fragment key={task.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleExpandClick(task.id)}>
                      <ListItemText
                        primary={task.name}
                        secondary={`Status: ${task.status} | Assigned: ${task.assigned_user_username || '-'}`}
                      />
                      {expandedTask === task.id ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={expandedTask === task.id} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4, pb: 2 }}>
                      <Typography variant="body2">
                        <strong>Description:</strong> {task.description || '-'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Comments:</strong> {task.comments || '-'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Work hours:</strong> {task.work_hours || 0}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Start date:</strong> {task.start_date}
                      </Typography>
                      <Typography variant="body2">
                        <strong>End date:</strong> {task.end_date}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption">
                        <strong>Created:</strong> {task.created_date || '-'} |{' '}
                        <strong>Modified:</strong> {task.modified_date || '-'}
                      </Typography>
                    </Box>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      )}

      {/* NOWY TASK */}
      {newTabIndex !== -1 && tabValue === newTabIndex && canCreateTasks && (
        <Box sx={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={newTask.name}
            onChange={handleNewTaskInputChange}
          />
          <TextField
            label="Description"
            name="description"
            value={newTask.description}
            onChange={handleNewTaskInputChange}
            multiline
          />
          <TextField
            label="Comments"
            name="comments"
            value={newTask.comments}
            onChange={handleNewTaskInputChange}
            multiline
          />
          <TextField
            label="Work hours"
            name="work_hours"
            type="number"
            value={newTask.work_hours}
            onChange={handleNewTaskInputChange}
          />
          <TextField
            label="Start date"
            name="start_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newTask.start_date}
            onChange={handleNewTaskInputChange}
          />
          <TextField
            label="End date"
            name="end_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newTask.end_date}
            onChange={handleNewTaskInputChange}
          />
          <Select
            label="Assigned user"
            name="assigned_user"
            value={newTask.assigned_user}
            onChange={handleNewTaskInputChange}
            displayEmpty
          >
            <MenuItem value="">
              <em>Wybierz...</em>
            </MenuItem>
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.username}
              </MenuItem>
            ))}
          </Select>

          <Button variant="contained" onClick={handleAddTask}>
            DODAJ TASK
          </Button>
        </Box>
      )}

      {/* EDYTUJ TASKI */}
      {editTabIndex !== -1 && tabValue === editTabIndex && (canEditAllFields || canEditCommentsHours) && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Wybierz zadanie:
          </Typography>

          <Select
            value={selectedTaskId || ''}
            onChange={(e) => handleSelectTaskToEdit(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">
              <em>Wybierz zadanie</em>
            </MenuItem>
            {tasks.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>

          {selectedTaskId && (
            <Box sx={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Jeśli user ma can_edit_all_task_fields => pokazujemy wszystkie pola
                  Jeśli ma TYLKO can_edit_task_comments_hours => 2 pola. */}
              {canEditAllFields ? (
                <>
                  <TextField
                    label="Nazwa"
                    name="name"
                    value={editTask.name}
                    onChange={handleEditTaskInputChange}
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={editTask.description}
                    onChange={handleEditTaskInputChange}
                    multiline
                  />
                  <TextField
                    label="Status"
                    name="status"
                    value={editTask.status}
                    onChange={handleEditTaskInputChange}
                    select
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </TextField>
                  <TextField
                    label="Work hours"
                    name="work_hours"
                    type="number"
                    value={editTask.work_hours}
                    onChange={handleEditTaskInputChange}
                  />
                  <TextField
                    label="Comments"
                    name="comments"
                    value={editTask.comments}
                    onChange={handleEditTaskInputChange}
                    multiline
                  />
                  <TextField
                    label="Start date"
                    name="start_date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={editTask.start_date}
                    onChange={handleEditTaskInputChange}
                  />
                  <TextField
                    label="End date"
                    name="end_date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={editTask.end_date}
                    onChange={handleEditTaskInputChange}
                  />
                  <Select
                    label="Assigned user"
                    name="assigned_user"
                    value={editTask.assigned_user}
                    onChange={handleEditTaskInputChange}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Wybierz...</em>
                    </MenuItem>
                    {users.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.username}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              ) : (
                <>
                  <TextField
                    label="Comments"
                    name="comments"
                    value={editTask.comments}
                    onChange={handleEditTaskInputChange}
                    multiline
                  />
                  <TextField
                    label="Work hours"
                    name="work_hours"
                    type="number"
                    value={editTask.work_hours}
                    onChange={handleEditTaskInputChange}
                  />
                </>
              )}

              <Button variant="contained" onClick={handleUpdateTask}>
                Zapisz zmiany
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default Tasks;