// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Reservation APIs
export const reservationAPI = {
  create: async (data) => {
    const response = await api.post('/reservations', data);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/reservations', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/reservations/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },
};

// Takeaway APIs
export const takeawayAPI = {
  create: async (data) => {
    const response = await api.post('/takeaway', data);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/takeaway', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/takeaway/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/takeaway/${id}`, data);
    return response.data;
  },
};

// Quick Bill APIs
export const quickBillAPI = {
  create: async (data) => {
    const response = await api.post('/quickbill', data);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/quickbill', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/quickbill/${id}`);
    return response.data;
  },
};

// Payment APIs
export const paymentAPI = {
  create: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },
  getByTransactionId: async (transactionId) => {
    const response = await api.get(`/payments/transaction/${transactionId}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },
};

// Menu APIs
export const menuAPI = {
  getAll: async () => {
    const response = await api.get('/menu');
    return response.data;
  },
};

export default api;