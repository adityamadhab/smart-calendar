import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export const eventService = {
  getEvents: async () => {
    try {
      const response = await api.get('/events');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw error;
    }
  },
  createEvent: (event) => api.post('/events', event),
  updateEvent: (id, event) => api.put(`/events/${id}`, event),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getEvent: (id) => api.get(`/events/${id}`)
};

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { token, ...user };
    } catch (error) {
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { token, ...user };
    } catch (error) {
      throw error;
    }
  },
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }
};

export default api; 