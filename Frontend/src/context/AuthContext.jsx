/**
 * Auth Context Provider File
 * Location: frontend/src/context/AuthContext.jsx
 * Description: Manages the global authentication state, handles session persistence (auto-login),
 *              and exposes login, logout, and profile update actions.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load active session on mount if token is saved in localStorage
    useEffect(() => {
        const fetchSession = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            
            try {
                const response = await axiosInstance.get('/auth/me');
                if (response.data && response.data.success) {
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                } else {
                    // Fail-safe clear if data comes back malformed
                    logout();
                }
            } catch (error) {
                console.error('[AUTH CONTEXT] Failed to restore session on mount:', error.message);
                // Auth interceptor will trigger event, but we double-check here
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [token]);

    // Handle global auto-logout events dispatched from Axios instance on 401 responses
    useEffect(() => {
        const handleSessionExpired = (e) => {
            const expiredMsg = e.detail?.message || 'Session expired. Please login again.';
            logout();
            alert(expiredMsg);
        };

        window.addEventListener('auth-session-expired', handleSessionExpired);
        return () => {
            window.removeEventListener('auth-session-expired', handleSessionExpired);
        };
    }, []);

    /**
     * Set credentials on successful OTP verification
     */
    const login = (jwtToken, userData) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
        setIsAuthenticated(true);
    };

    /**
     * Clear credentials and destroy session
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    /**
     * Update user details in global state when profile changes are saved
     */
    const updateProfile = (updatedUserData) => {
        setUser(updatedUserData);
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Export hook helper for consumption
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be consumed within an AuthProvider');
    }
    return context;
};
