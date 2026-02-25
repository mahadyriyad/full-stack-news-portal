import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
};

export const newsAPI = {
  getAllNews: (page = 1, limit = 10, category = '') => {
    let url = `/news?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    return api.get(url);
  },
  getTopNews: () => api.get('/news/top'),
  getSingleNews: (slug) => api.get(`/news/${slug}`),
  createNews: (data) => api.post('/news', data),
  updateNews: (id, data) => api.put(`/news/${id}`, data),
  deleteNews: (id) => api.delete(`/news/${id}`),
  getUserNews: (page = 1, limit = 10) => api.get(`/news/user/news?page=${page}&limit=${limit}`),
  getNewsByCategory: (category, page = 1, limit = 10) =>
    api.get(`/news/category/${category}?page=${page}&limit=${limit}`),
};

export const contactAPI = {
  submitContact: (data) => api.post('/contact', data),
  getAllContacts: () => api.get('/contact'),
};

export default api;
