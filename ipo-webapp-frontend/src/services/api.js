import axios from 'axios';

// Define the base URL for the API. Replace with your actual backend URL.
// For local development, it might be http://localhost:5000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in headers if it exists
apiClient.interceptors.request.use(
  (config) => {
    // Get token from local storage (or wherever you store it)
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for handling global errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error('Unauthorized access - redirecting to login');
      // localStorage.removeItem('authToken');
      // window.location.href = '/login'; // Or use React Router history
    }
    return Promise.reject(error);
  }
);

export default apiClient;

