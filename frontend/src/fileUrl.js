import AxiosInstance from './Axios';

export const getFileUrl = (filePath) => {
  return filePath ? `${AxiosInstance.defaults.baseURL.replace('/api','')}${filePath}` : null;
};
