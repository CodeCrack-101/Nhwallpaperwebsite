/**
 * Axios Instance Config File
 * Location: frontend/src/api/axiosInstance.js
 * Description: Sets up the base HTTP client configuration. Handles automatic JWT insertion
 *              into headers and intercepting 401 Unauthorized responses to trigger auto-logout.
 */

import axios from 'axios';
import { apiToasts } from '../utils/toast';

// Create base instance pointed at backend API port
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Active requests counter for dispatching events
let activeApiCount = 0;

const notifyStart = () => {
    activeApiCount++;
    if (activeApiCount === 1) {
        window.dispatchEvent(new CustomEvent('api-loading-start'));
    }
};

const notifyEnd = () => {
    activeApiCount = Math.max(0, activeApiCount - 1);
    if (activeApiCount === 0) {
        window.dispatchEvent(new CustomEvent('api-loading-end'));
    }
};

// Request Interceptor: Inject JWT token into headers and notify loading start
axiosInstance.interceptors.request.use(
    (config) => {
        notifyStart();
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        notifyEnd();
        return Promise.reject(error);
    }
);

// Response Interceptor: Intercept 401 errors and notify loading end
axiosInstance.interceptors.response.use(
    (response) => {
        notifyEnd();
        return response;
    },
    (error) => {
        notifyEnd();

        // Handle network connection failures (server unreachable)
        if (!error.response && error.code === 'ERR_NETWORK') {
            apiToasts.networkError();
        } else if (error.response && error.response.status >= 500) {
            apiToasts.serverError();
        }

        // Check for 401 unauthorized status (except for login/register credentials validation calls)
        const requestUrl = error.config?.url || '';
        const isAuthRoute = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register') || requestUrl.includes('/auth/verify-registration') || requestUrl.includes('/auth/forgot-password') || requestUrl.includes('/auth/reset-password');

        if (error.response && error.response.status === 401 && !isAuthRoute) {
            console.warn('[AXIOS INTERCEPTOR] Received 401 Unauthorized on protected route - Triggering Logout.');
            
            // Dispatch a global event so that the AuthProvider can intercept and logout the user
            window.dispatchEvent(new CustomEvent('auth-session-expired', { 
                detail: { message: error.response.data?.message || 'Session expired. Please login again.' } 
            }));
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
