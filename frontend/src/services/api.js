import axios from 'axios';

// Determine the API base URL:
// 1. If VITE_API_BASE_URL is explicitly set, use it.
// 2. In local development (npm run dev), fallback to local Django server at http://127.0.0.1:8000/api.
// 3. In production build, fallback to the deployed Render backend URL.
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:8000/api';
  }
  return 'https://devlens-ai-1-0wvf.onrender.com/api';
};

const API_BASE_URL = getBaseUrl();

/**
 * Extracts a concise, user-friendly error message from Axios / DRF response errors.
 * Preserves the actual server feedback without exposing sensitive internals.
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';
  if (typeof error === 'string') return error;

  if (error.response) {
    const { status, data } = error.response;

    // Never show raw HTML responses (Django error pages) to the user
    const isHtml = typeof data === 'string' && data.trim().startsWith('<');

    if (!isHtml && data) {
      if (typeof data === 'string') return data;
      if (data.error && typeof data.error === 'string') return data.error;
      if (data.detail && typeof data.detail === 'string') return data.detail;

      // Handle Django REST framework field error dictionaries (e.g., { title: ["..."] })
      if (typeof data === 'object') {
        const messages = [];
        for (const [field, errs] of Object.entries(data)) {
          const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
          if (Array.isArray(errs)) {
            messages.push(`${fieldLabel}: ${errs.join(' ')}`);
          } else if (typeof errs === 'string') {
            messages.push(`${fieldLabel}: ${errs}`);
          }
        }
        if (messages.length > 0) {
          return messages.join('. ');
        }
      }
    }

    if (status === 400) return 'Invalid submission. Please check your inputs and try again.';
    if (status === 404) return 'The requested review was not found (404).';
    if (status === 500) return 'Backend server error (500). The AI analysis service may be unavailable — please try again shortly.';
    return `Server responded with status ${status}.`;
  }

  if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
    return 'The request timed out. The AI analysis is taking too long — please try again.';
  }

  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return `Cannot connect to backend server at ${API_BASE_URL}. Please verify the backend is running and CORS allows requests from this origin.`;
  }

  return error.message || 'An unexpected error occurred.';
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhance error object with standardized user-facing message
    error.userMessage = getErrorMessage(error);

    // Retain technical diagnostics in browser console during development
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
