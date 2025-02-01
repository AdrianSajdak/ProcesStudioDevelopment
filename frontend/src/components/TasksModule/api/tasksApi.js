import AxiosInstance from '../../../Axios';

export const fetchCurrentUser = async () => {
  try {
    const res = await AxiosInstance.get('/users/me/');
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

export const fetchTasks = async () => {
  try {
    const res = await AxiosInstance.get('/tasks/');
    return res.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const fetchProjects = async () => {
  try {
    const res = await AxiosInstance.get('/projects/');
    return res.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const res = await AxiosInstance.get('/users/');
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchVacations = async () => {
  try {
    const res = await AxiosInstance.get('/vacations/');
    return res.data;
  } catch (error) {
    console.error("Error fetching vacations:", error);
    throw error;
  }
};

export const fetchPosts = async () => {
  try {
    const res = await AxiosInstance.get('/posts/');
    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const fetchPostsByTask = async (taskId) => {
  try {
    const res = await AxiosInstance.get(`/posts/?assigned_task=${taskId}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching posts for task ${taskId}:`, error);
    throw error;
  }
};

export const updateTask = async (taskId, body) => {
  try {
    return await AxiosInstance.patch(`/tasks/${taskId}/`, body);
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
};

export const updatePost = async (postId, body) => {
  try {
    return await AxiosInstance.patch(`/posts/${postId}/`, body);
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    return await AxiosInstance.delete(`/tasks/${taskId}/`);
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    return await AxiosInstance.delete(`/posts/${postId}/`);
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error;
  }
};

export const createPost = async (body) => {
  try {
    return await AxiosInstance.post('/posts/', body);
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const createTask = async (body) => {
  try {
    return await AxiosInstance.post('/tasks/', body);
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateVacation = async (vacationId, body) => {
  try {
    return await AxiosInstance.patch(`/vacations/${vacationId}/`, body);
  } catch (error) {
    console.error(`Error updating vacation ${vacationId}:`, error);
    throw error;
  }
};

export const createVacation = async (body) => {
  try {
    return await AxiosInstance.post('/vacations/', body);
  } catch (error) {
    console.error("Error creating vacation:", error);
    throw error;
  }
};

export const deleteVacation = async (vacationId) => {
  try {
    return await AxiosInstance.delete(`/vacations/${vacationId}/`);
  } catch (error) {
    console.error(`Error deleting vacation ${vacationId}:`, error);
    throw error;
  }
};
