import axios from 'axios';

const API_URL = process.env.BASE_API_URL || import.meta.env.VITE_BASE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const userService = {
  register: async (username, email, password, role = 'USER') => {
    try {
      const response = await api.post('/user/signup', {
        username,
        email,
        password,
        role
      });
      return response.data; // { token, user, expiresIn, status }
    } catch (error) {
      throw error.response?.data || 'Registration failed';
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/user/signin', { email, password });
      // Expected: { token, user, expiresIn, status }
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Login failed';
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  }
};