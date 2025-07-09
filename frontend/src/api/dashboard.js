import axios from 'axios';

export const getDashboardStats = (token) =>
  axios.get(`${process.env.REACT_APP_API_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
