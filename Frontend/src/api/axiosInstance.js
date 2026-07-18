/**
 * Axios Instance Config File
 * Location: frontend/src/api/axiosInstance.js
 * Description: Sets up the base HTTP client configuration. Handles automatic JWT insertion
 *              into headers and intercepting 401 Unauthorized responses to trigger auto-logout.
 */

import axios from 'axios';

// Create base instance pointed at backend API port
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Inject JWT token into headers for every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Intercept 401 errors to trigger auto-logout
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Check for 401 unauthorized status
        if (error.response && error.response.status === 401) {
            console.warn('[AXIOS INTERCEPTOR] Received 401 Unauthorized - Triggering Logout.');
            
            // Dispatch a global event so that the AuthProvider can intercept and logout the user
            window.dispatchEvent(new CustomEvent('auth-session-expired', { 
                detail: { message: error.response.data?.message || 'Session expired. Please login again.' } 
            }));
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
