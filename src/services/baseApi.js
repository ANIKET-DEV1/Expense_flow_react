import axios from 'axios';

const base_url =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  (typeof process !== 'undefined' && process.env?.BACKEND_URL) ||
  'https://expense-flow-ag9326107-5763s-projects.vercel.app';

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
      const publicRoutes = ['/', '/login', '/register', '/reset-password', '/forgot-password', '/verify-email'];
      if (!publicRoutes.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;