import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const API_BASE_URL = baseURL.replace(/\/$/, '');
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('ds_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (_) {}

  // Let Axios/browser generate the correct multipart boundary for FormData.
  // JSON requests get the normal JSON content type.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

export default api;
