import axios from 'axios';


const baseURL = 'http://localhost:8000/api';

const AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

AxiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

    if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
    ) {
        originalRequest._retry = true;
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(`${baseURL}/token/refresh/`, {
              refresh: refreshToken,
            });
  
            const newAccessToken = refreshResponse.data.access;
            sessionStorage.setItem('accessToken', newAccessToken);
  
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            return AxiosInstance(originalRequest);
        } catch (err) {
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }
    } else {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
    }
  
    return Promise.reject(error);
}
);

export default AxiosInstance;