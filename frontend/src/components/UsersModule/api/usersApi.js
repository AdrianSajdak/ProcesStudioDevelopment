import AxiosInstance from '../../../Axios';

export const fetchUsers = async () => {
  try {
    const res = await AxiosInstance.get('/users/');
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (data) => {
  try {
    const res = await AxiosInstance.post('/register/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (userId, data) => {
  try {
    const res = await AxiosInstance.patch(`/users/${userId}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await AxiosInstance.delete(`/users/${userId}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const res = await AxiosInstance.get('/users/me/');
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};