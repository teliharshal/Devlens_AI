import axios from 'axios';

// Read API base URL from Vite environment variables with development fallback
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://devlens-ai-1-0wvf.onrender.com/api';
/**
 * Extracts a concise, user-friendly error message from Axios / DRF response errors.
 * Preserves the actual server feedback without exposing sensitive internals.
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';
  if (typeof error === 'string') return error;

  if (error.response) {
    const data = error.response.data;
    if (data) {
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

    if (error.response.status === 404) {
      return 'The requested review was not found (404).';
    }
    if (error.response.status >= 500) {
      return 'Backend server error (500). Please check Django server logs.';
    }
    return `Server responded with status ${error.response.status}.`;
  }

  if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
    return 'The request timed out. The backend or AI model took too long to respond.';
  }

  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return 'Cannot connect to backend server. Please verify Django is running at http://127.0.0.1:8000 and CORS allows frontend requests.';
  }

  return error.message || 'An unexpected error occurred.';
};

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ''),
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
