/**
 * API Service for communicating with FastAPI Backend.
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ''
).replace(/\/+$/, '');

export const getStoredToken = () => localStorage.getItem('loan_auth_token');
export const setStoredToken = (token) => localStorage.setItem('loan_auth_token', token);
export const removeStoredToken = () => {
  localStorage.removeItem('loan_auth_token');
  localStorage.removeItem('loan_user_data');
};
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('loan_user_data') || 'null');
  } catch {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem('loan_user_data', JSON.stringify(user));

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred.';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      errorDetail = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/api/auth/me'),

  // Prediction & Application
  predictLoan: (data) => request('/api/predict', { method: 'POST', body: JSON.stringify(data) }),
  getApplications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/applications${query ? `?${query}` : ''}`);
  },
  getApplicationById: (id) => request(`/api/application/${id}`),
  deleteApplication: (id) => request(`/api/application/${id}`, { method: 'DELETE' }),

  // Upload document
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE_URL}/api/upload-document`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'File upload failed');
    }
    return response.json();
  },

  // Dashboard & Analytics
  getDashboard: () => request('/api/dashboard'),
  getModelPerformance: () => request('/api/model-performance'),
  getHealth: () => request('/api/health')
};
