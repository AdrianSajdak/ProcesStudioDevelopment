import { useState, useEffect } from 'react';
import * as tasksApi from '../api/tasksApi';

const useTasksData = () => {
  const [userRole, setUserRole] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postsByTask, setPostsByTask] = useState({});

  const loadCurrentUser = async () => {
    try {
      const data = await tasksApi.fetchCurrentUser();
      setUserRole(data.role);
      setLoggedInUser(data);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await tasksApi.fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await tasksApi.fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await tasksApi.fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadVacations = async () => {
    try {
      const data = await tasksApi.fetchVacations();
      setVacations(data);
    } catch (error) {
      console.error("Error loading vacations:", error);
    }
  };

  const loadPosts = async () => {
    try {
      const data = await tasksApi.fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const loadPostsByTask = async (taskId) => {
    try {
      const data = await tasksApi.fetchPostsByTask(taskId);
      setPostsByTask((prev) => ({ ...prev, [taskId]: data }));
    } catch (error) {
      console.error(`Error loading posts for task ${taskId}:`, error);
    }
  };

  const refreshAll = async () => {
    await Promise.all([loadTasks(), loadProjects(), loadVacations(), loadPosts()]);
    if (userRole === 'Boss') {
      await loadUsers();
    }
  };

  useEffect(() => {
    loadCurrentUser();
    loadTasks();
    loadProjects();
    loadVacations();
    loadPosts();
  }, []);

  useEffect(() => {
    if (userRole === 'Boss') {
      loadUsers();
    }
  }, [userRole]);

  return {
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
  };
};

export default useTasksData;