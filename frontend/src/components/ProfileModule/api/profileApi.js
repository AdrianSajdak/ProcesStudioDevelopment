import AxiosInstance from '../../../Axios';

export const fetchProfile = async () => {
  try {
    const res = await AxiosInstance.get('/users/me/');
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const updateProfilePicture = async (data) => {
  try {
    const res = await AxiosInstance.post('/users/upload_profile_picture/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const res = await AxiosInstance.post('/users/change_password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return res.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};