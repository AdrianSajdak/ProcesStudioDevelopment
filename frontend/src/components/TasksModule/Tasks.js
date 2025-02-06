import React, { useState, useRef } from 'react';
import { Box, Tabs, Tab, Menu, MenuItem, Alert, Snackbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useTasksData from './hooks/useTasksData';
import TasksListTab from './components/Tabs/TasksListTab';
import CalendarTab from './components/Tabs/CalendarTab';
import AddTaskTab from './components/Tabs/AddTaskTab';
import TaskEditDialog from './components/Dialogs/TaskEditDialog';
import PostEditDialog from './components/Dialogs/PostEditDialog';
import DeletePostDialog from './components/Dialogs/DeletePostDialog';
import DeleteTaskDialog from './components/Dialogs/DeleteTaskDialog';
import PostInfoDialog from './components/Dialogs/PostInfoDialog';
import AddPostDialog from './components/Dialogs/AddPostDialog';
import AddVacationDialog from './components/Dialogs/AddVacationDialog';
import VacationEditDialog from './components/Dialogs/VacationEditDialog';
import VacationInfoDialog from './components/Dialogs/VacationInfoDialog';
import TaskInfoDialog from './components/Dialogs/TaskInfoDialog';
import * as tasksApi from './api/tasksApi';

function Tasks() {
  const theme = useTheme();
  const {
    userRole,
    loggedInUser,
    tasks,
    projects,
    users,
    vacations,
    posts,
    postsByTask,
    loadPostsByTask,
    refreshAll,
  } = useTasksData();

  const [tabValue, setTabValue] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  const showSnackbar = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Stany dla zakładki "Lista zadań"
  const [showClosed, setShowClosed] = useState(false);
  const [projectFilter, setProjectFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // Stany dla zakładki "Kalendarz"
  const [hideVacations, setHideVacations] = useState(false);
  const [calendarUserFilter, setCalendarUserFilter] = useState('');
  const [calendarTaskFilter, setCalendarTaskFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  // Stany dla dialogów (związane z edycją/usuwaniem)
  const [openTaskEditDialog, setOpenTaskEditDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [openTaskInfoDialog, setOpenTaskInfoDialog] = useState(false);
  const [taskInfo, setTaskInfo] = useState(null);

  const [openPostEditDialog, setOpenPostEditDialog] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [openDeletePostDialog, setOpenDeletePostDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [openPostInfoDialog, setOpenPostInfoDialog] = useState(false);
  const [postInfo, setPostInfo] = useState(null);

  const [openAddPostDialog, setOpenAddPostDialog] = useState(false);
  const [openAddVacationDialog, setOpenAddVacationDialog] = useState(false);
  const [openVacationEditDialog, setOpenVacationEditDialog] = useState(false);
  const [vacationToEdit, setVacationToEdit] = useState(null);
  const [openVacationInfoDialog, setOpenVacationInfoDialog] = useState(false);
  const [vacationInfo, setVacationInfo] = useState(null);

  // Stan menu "dzień" (kliknięcie w pusty dzień w kalendarzu)
  const [dayMenuAnchor, setDayMenuAnchor] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Rozwijanie akordeonów – ładowanie postów dla danego zadania
  const handleExpandTask = async (taskId, isExpanded) => {
    if (isExpanded) {
      setExpandedTaskId(taskId);
      await loadPostsByTask(taskId);
    } else {
      setExpandedTaskId(null);
    }
  };

  // Callbacki dla menu zadań (tylko dla Boss)
  const handleTaskEdit = (task) => {
    setTaskToEdit(task);
    setOpenTaskEditDialog(true);
  };

  const handleTaskInfo = (task) => {
    setTaskInfo(task);
    setOpenTaskInfoDialog(true);
  };

  const handleTaskDelete = (task) => {
    setTaskToDelete(task);
    setOpenDeleteTaskDialog(true);
  };

  // Callbacki dla menu postów (dla wszystkich użytkowników)
  const handlePostEdit = (post) => {
    setPostToEdit(post);
    setOpenPostEditDialog(true);
  };

  const handlePostDelete = (post) => {
    setPostToDelete(post);
    setOpenDeletePostDialog(true);
  };

  const handlePostInfo = (post) => {
    setPostInfo(post);
    setOpenPostInfoDialog(true);
  };

  // Callback dla menu w kalendarzu (kliknięcie w pusty dzień)
  const handleEmptyDayClick = (day, anchorEl) => {
    setSelectedDate(day);
    setDayMenuAnchor(anchorEl);
  };

  // Filtrowanie zadań – tylko Boss widzi filtr po użytkowniku
  const filteredTasks = tasks.filter((task) => {
    let valid = true;
    if (!showClosed && task.status === 'CLOSED') valid = false;
    if (projectFilter && task.assigned_project?.project_id !== Number(projectFilter))
      valid = false;
    if (userRole === 'Boss' && userFilter && task.assigned_user?.user_id !== Number(userFilter))
      valid = false;
    return valid;
  });

  // Budowanie eventów do kalendarza
  const getCalendarEvents = () => {
    let filteredPosts = [...posts];
    if (userRole === 'Boss' && calendarUserFilter) {
      filteredPosts = filteredPosts.filter(
        (p) => p.assigned_task?.assigned_user?.user_id === Number(calendarUserFilter)
      );
    }
    if (calendarTaskFilter) {
      filteredPosts = filteredPosts.filter(
        (p) => p.assigned_task?.task_id === Number(calendarTaskFilter)
      );
    }
    const postEvents = filteredPosts.map((p) => ({
      id: p.post_id,
      type: 'post',
      date: p.post_date,
      data: p,
    }));
    let filteredVacations = hideVacations ? [] : [...vacations];
    if (userRole === 'Boss' && calendarUserFilter) {
      filteredVacations = filteredVacations.filter(
        (v) => v.assigned_user?.user_id === Number(calendarUserFilter)
      );
    }
    const vacationEvents = filteredVacations.map((v) => ({
      id: v.vacation_id,
      type: 'vacation',
      date: v.vacation_date,
      data: v,
    }));
    return [...postEvents, ...vacationEvents];
  };

  // Definicja etykiet zakładek – tylko Boss widzi zakładkę "Dodaj Zadanie"
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
        sx={{ 
          mb: 2,
          '& .MuiTabs-flexContainer': {
            justifyContent: 'center'
          }
        }}
        TabIndicatorProps={{ style: { backgroundColor: theme.palette.violet.light } }}
      >
        {tabLabels.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>

      {/* Zakładka "Lista zadań" */}
      {tabValue === 0 && (
        <TasksListTab
          tasks={filteredTasks}
          projects={projects}
          users={users}
          userRole={userRole}
          expandedTaskId={expandedTaskId}
          onExpandTask={handleExpandTask}
          postsByTask={postsByTask}
          onTaskEdit={handleTaskEdit}
          onTaskDelete={handleTaskDelete}
          onTaskInfo={handleTaskInfo}
          onPostEdit={handlePostEdit}
          onPostDelete={handlePostDelete}
          onPostInfo={handlePostInfo}
          showClosed={showClosed}
          setShowClosed={setShowClosed}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          userFilter={userFilter}
          setUserFilter={setUserFilter}
        />
      )}

      {/* Zakładka "Kalendarz" */}
      {tabValue === 1 && (
        <CalendarTab
          events={getCalendarEvents()}
          tasks={tasks}
          users={users}
          userRole={userRole}
          hideVacations={hideVacations}
          setHideVacations={setHideVacations}
          calendarUserFilter={calendarUserFilter}
          setCalendarUserFilter={setCalendarUserFilter}
          calendarTaskFilter={calendarTaskFilter}
          setCalendarTaskFilter={setCalendarTaskFilter}
          onEventClick={(event) => {
            if (event.type === 'post') {
              handlePostInfo(event.data);
            } else if (event.type === 'vacation') {
              setVacationInfo(event.data);
              setOpenVacationInfoDialog(true);
            }
          }}
          onEmptyDayClick={handleEmptyDayClick}
          calendarRef={calendarRef}
          showSnackbar={showSnackbar}
        />
      )}

      {/* Zakładka "Dodaj Zadanie" – tylko dla Boss */}
      {tabValue === 2 && userRole === 'Boss' && (
        <AddTaskTab
          projects={projects}
          users={users}
          onTaskAdded={() => {
            refreshAll();
            showSnackbar('success', 'Zadanie dodane pomyślnie!');
          }}
          showSnackbar={showSnackbar}
        />
      )}

      {/* Dialogy dla zadań */}
      <TaskEditDialog
        open={openTaskEditDialog}
        task={taskToEdit}
        projects={projects}
        users={users}
        onClose={() => setOpenTaskEditDialog(false)}
        onSave={async (updatedTask) => {
          try {
            await tasksApi.updateTask(taskToEdit.task_id, updatedTask);
            showSnackbar('success', 'Zadanie zaktualizowane pomyślnie!');
          } catch (error) {
            console.error('Error updating task:', error);
            showSnackbar('error', 'Nie udało się zaktualizować zadania.');
          }
          setOpenTaskEditDialog(false);
          await refreshAll();
        }}
      />

      <TaskInfoDialog
        open={openTaskInfoDialog}
        task={taskInfo}
        onClose={() => setOpenTaskInfoDialog(false)}
      />

      <DeleteTaskDialog
        open={openDeleteTaskDialog}
        task={taskToDelete}
        onClose={() => setOpenDeleteTaskDialog(false)}
        onConfirm={async () => {
          try {
            await tasksApi.deleteTask(taskToDelete.task_id);
            showSnackbar('success', 'Zadanie usunięte pomyślnie!');
          } catch (error) {
            console.error('Error deleting task:', error);
            showSnackbar('error', 'Nie udało się usunąć zadania.');
          }
          setOpenDeleteTaskDialog(false);
          await refreshAll();
        }}
      />

      {/* Dialogy dla postów */}
      <PostEditDialog
        open={openPostEditDialog}
        post={postToEdit}
        onClose={() => setOpenPostEditDialog(false)}
        onSave={async (updatedPost) => {
          try {
            await tasksApi.updatePost(postToEdit.post_id, updatedPost);
            showSnackbar('success', 'Post zaktualizowany pomyślnie!');
          } catch (error) {
            console.error('Error updating post:', error);
            showSnackbar('error', 'Nie udało się zaktualizować posta.');
          }
          setOpenPostEditDialog(false);
          await refreshAll();
        }}
      />

      <DeletePostDialog
        open={openDeletePostDialog}
        post={postToDelete}
        onClose={() => setOpenDeletePostDialog(false)}
        onConfirm={async () => {
          try {
            await tasksApi.deletePost(postToDelete.post_id);
            showSnackbar('success', 'Post usunięty pomyślnie!');
          } catch (error) {
            console.error('Error deleting post:', error);
            showSnackbar('error', 'Nie udało się usunąć posta.');
          }
          setOpenDeletePostDialog(false);
          await refreshAll();
        }}
      />

      <PostInfoDialog
        open={openPostInfoDialog}
        post={postInfo}
        onClose={() => setOpenPostInfoDialog(false)}
      />

      <AddPostDialog
        open={openAddPostDialog}
        date={selectedDate}
        tasks={tasks.filter((t) => t.status === 'OPEN')}
        onClose={() => setOpenAddPostDialog(false)}
        onAdd={async (newPost) => {
          try {
            await tasksApi.createPost(newPost);
            showSnackbar('success', 'Post dodany pomyślnie!');
          } catch (error) {
            console.error('Error creating post:', error);
            showSnackbar('error', 'Nie udało się dodać posta.');
          }
          setOpenAddPostDialog(false);
          await refreshAll();
        }}
      />

      <AddVacationDialog
        open={openAddVacationDialog}
        date={selectedDate}
        loggedInUser={loggedInUser}
        onClose={() => setOpenAddVacationDialog(false)}
        onAdd={async (newVacation) => {
          try {
            await tasksApi.createVacation(newVacation);
            showSnackbar('success', 'Urlop dodany pomyślnie!');
          } catch (error) {
            console.error('Error creating vacation:', error);
            showSnackbar('error', 'Nie udało się dodać urlopu.');
          }
          setOpenAddVacationDialog(false);
          await refreshAll();
        }}
      />

      <VacationEditDialog
        open={openVacationEditDialog}
        vacation={vacationToEdit}
        onClose={() => setOpenVacationEditDialog(false)}
        onSave={async (updatedVacation) => {
          try {
            await tasksApi.updateVacation(vacationToEdit.vacation_id, updatedVacation);
            showSnackbar('success', 'Urlop zaktualizowany pomyślnie!');
          } catch (error) {
            console.error('Error updating vacation:', error);
            showSnackbar('error', 'Nie udało się zaktualizować urlopu.');
          }
          setOpenVacationEditDialog(false);
          await refreshAll();
        }}
      />

      <VacationInfoDialog
        open={openVacationInfoDialog}
        vacation={vacationInfo}
        userRole={userRole}
        onClose={() => setOpenVacationInfoDialog(false)}
        onApprove={async () => {
          try {
            await tasksApi.updateVacation(vacationInfo.vacation_id, { status: 'CONFIRMED' });
            showSnackbar('success', 'Urlop zatwierdzony pomyślnie!');
          } catch (error) {
            console.error('Error approving vacation:', error);
            showSnackbar('error', 'Nie udało się zatwierdzić urlopu.');
          }
          setOpenVacationInfoDialog(false);
          await refreshAll();
        }}
        onDeny={async () => {
          try {
            await tasksApi.updateVacation(vacationInfo.vacation_id, { status: 'REJECTED' });
            showSnackbar('success', 'Urlop odrzucony pomyślnie!');
          } catch (error) {
            console.error('Error denying vacation:', error);
            showSnackbar('error', 'Nie udało się odrzucić urlopu.');
          }
          setOpenVacationInfoDialog(false);
          await refreshAll();
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Menu
        anchorEl={dayMenuAnchor}
        open={Boolean(dayMenuAnchor)}
        onClose={() => setDayMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setOpenAddPostDialog(true);
            setDayMenuAnchor(null);
          }}
        >
          Dodaj Post
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenAddVacationDialog(true);
            setDayMenuAnchor(null);
          }}
        >
          Dodaj Urlop
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Tasks;
