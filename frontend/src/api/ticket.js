import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

export const createTicket = (data, token) => {
  return API.post('/tickets', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyTickets = (token, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return API.get(`/tickets/my?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllTickets = (token, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return API.get(`/tickets?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getTicketDetail = (id, token) =>
  API.get(`/tickets/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const postReply = (id, message, token) =>
  API.post(`/tickets/${id}/replies`, { message }, {
    headers: { Authorization: `Bearer ${token}` }
  });
