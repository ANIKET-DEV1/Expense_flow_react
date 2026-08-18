import axios from 'axios';

const base_url=process.env.BACKEND_URL

const apiClient = axios.create({
  baseURL: base_url,
  withCredentials: true, 
  timeout: 10000,       
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const publicRoutes = ['/', '/login', '/register', '/reset-password','/forget-password/','/verify-email'];
      if (!publicRoutes.includes(window.location.pathname)) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);


export default apiClient;