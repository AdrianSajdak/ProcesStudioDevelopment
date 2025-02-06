import AxiosInstance from '../../../Axios';

export const fetchClients = async () => {
  try {
    const res = await AxiosInstance.get('/clients/');
    return res.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const createClient = async (data) => {
  try {
    const res = await AxiosInstance.post('/clients/', data);
    return res.data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

export const updateClient = async (clientId, data) => {
  try {
    const res = await AxiosInstance.put(`/clients/${clientId}/`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export const deleteClient = async (clientId) => {
  try {
    const res = await AxiosInstance.delete(`/clients/${clientId}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await AxiosInstance.get('/users/me/');
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};
