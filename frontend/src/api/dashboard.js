import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getDashboardStats = (token) =>
  axios.get(`${API_BASE_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const autoCloseTickets = (token) =>
  axios.post(`${API_BASE_URL}/dashboard/auto-close`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
