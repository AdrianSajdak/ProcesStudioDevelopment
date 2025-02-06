import AxiosInstance from '../../../Axios';

export const fetchUserRole = async () => {
  try {
    const res = await AxiosInstance.get('/users/me/');
    return res.data;
  } catch (error) {
    console.error("Error fetching current user role:", error);
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

export const createProject = async (body) => {
  try {
    const res = await AxiosInstance.post('/projects/', body);
    return res.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (projectId, body) => {
  try {
    const res = await AxiosInstance.patch(`/projects/${projectId}/`, body);
    return res.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const res = await AxiosInstance.delete(`/projects/${projectId}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const fetchClients = async () => {
  try {
    const res = await AxiosInstance.get('/clients/');
    return res.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const getPhasesForProject = async (projectId) => {
  try {
    const res = await AxiosInstance.get(`/phases/?assigned_project=${projectId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching phases for project:", error);
    throw error;
  }
};

export const createPhase = async (body) => {
  try {
    const res = await AxiosInstance.post('/phases/', body);
    return res.data;
  } catch (error) {
    console.error("Error creating phase:", error);
    throw error;
  }
};

export const updatePhase = async (phaseId, body) => {
  try {
    const res = await AxiosInstance.patch(`/phases/${phaseId}/`, body);
    return res.data;
  } catch (error) {
    console.error("Error updating phase:", error);
    throw error;
  }
};

export const deletePhase = async (phaseId) => {
  try {
    const res = await AxiosInstance.delete(`/phases/${phaseId}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting phase:", error);
    throw error;
  }
};