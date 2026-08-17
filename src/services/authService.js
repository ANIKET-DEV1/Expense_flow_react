import apiClient from './baseApi';

const authService = {
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data; 
  },

  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  forgetPassword: async (email) => {
    const res = await apiClient.post('/auth/password-reset', { email });
    return res.data;
  },
  resetPassword: async (token, credentials) => {
    const res = await apiClient.post(`/auth/password-reset-verify/${token}`, credentials);
    return res.data;
  }
};

export default authService;