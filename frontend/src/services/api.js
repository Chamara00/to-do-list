import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
);

export const taskAPI = {
  // Get recent tasks
  getTasks: async (limit = 5) => {
    try {
      const response = await api.get(`/api/tasks?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/api/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark task as completed
  markTaskCompleted: async (taskId) => {
    try {
      const response = await api.put(`/api/tasks/${taskId}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
