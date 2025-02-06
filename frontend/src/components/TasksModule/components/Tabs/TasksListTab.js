import React from 'react';
import {
  Box,
  Typography,
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
  MenuItem as MUIMenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { parseISO, format } from 'date-fns';
import { pl } from 'date-fns/locale';
  
const TasksListTab = ({
  tasks,
  projects,
  users,
  userRole,
  expandedTaskId,
  onExpandTask,
  postsByTask,
  onTaskEdit,
  onTaskInfo,
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
  const filteredTasks = tasks.filter((task) => {
    let valid = true;
    if (!showClosed && task.status === 'CLOSED') valid = false;
    if (projectFilter && task.assigned_project?.project_id !== Number(projectFilter))
      valid = false;
    if (userRole === 'Boss' && userFilter && task.assigned_user?.user_id !== Number(userFilter))
      valid = false;
    return valid;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = parseISO(dateString);
    return format(date, 'yyyy.MM.dd [HH:mm:ss]', { locale: pl });
  };

  return (
    <Box sx={{ mt: 3 }}>
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
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Lista zadań
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'violet.main', outline: '1px solid' }}>
                  <TableCell>Nazwa</TableCell>
                  <TableCell>Projekt</TableCell>
                  <TableCell>Użytkownik</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data utworzenia</TableCell>
                  <TableCell>Data modyfikacji</TableCell>
                  {userRole === 'Boss' && (
                    <TableCell>Akcje</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow
                    key={task.task_id}
                    onClick={() => onExpandTask(task.task_id, true)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor:
                        expandedTaskId === task.task_id ? 'rgba(0,0,0,0.08)' : 'inherit',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
                      outline: '1px solid',
                    }}
                  >
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.assigned_project?.name || '-'}</TableCell>
                    <TableCell>{task.assigned_user?.username || '-'}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      {task.created_date
                        ? new Date(task.created_date).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>{formatDate(task.last_modification_date)}</TableCell>
                    {userRole === 'Boss' && (
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskEdit(task);
                          }}
                          sx={{ '&:hover': { color: 'violet.main' } }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskDelete(task);
                          }}
                          sx={{ '&:hover': { color: 'violet.main' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        {typeof onTaskInfo === 'function' && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskInfo(task);
                            }}
                            sx={{ '&:hover': { color: 'violet.main' } }}
                          >
                            <InfoIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={3}>
          {expandedTaskId && (
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Zadanie: {tasks.find((t) => t.task_id === expandedTaskId)?.name}
            </Typography>
          )}
          
          {expandedTaskId ? (
            postsByTask[expandedTaskId] && postsByTask[expandedTaskId].length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'violet.main', outline: '1px solid' }}>
                      <TableCell>Data</TableCell>
                      <TableCell>Godziny</TableCell>
                      <TableCell>Akcje</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {postsByTask[expandedTaskId]
                      .sort((a, b) => new Date(b.post_date) - new Date(a.post_date))
                      .map((post) => (
                        <TableRow
                          key={post.post_id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPostInfo(post);
                          }}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
                            outline: '1px solid',
                          }}
                        >
                          <TableCell>
                            {post.post_date
                              ? new Date(post.post_date).toLocaleDateString()
                              : '-'}
                          </TableCell>
                          <TableCell>{post.work_hours}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPostEdit(post);
                              }}
                              sx={{ '&:hover': { color: 'violet.main' } }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPostDelete(post);
                              }}
                              sx={{ '&:hover': { color: 'violet.main' } }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                Brak postów dla tego zadania
              </Typography>
            )
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
              Wybierz zadanie z listy, aby zobaczyć posty
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TasksListTab;