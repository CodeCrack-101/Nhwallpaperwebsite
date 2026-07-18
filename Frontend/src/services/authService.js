/**
 * Auth API Service File
 * Location: frontend/src/services/authService.js
 * Description: Abstraction over HTTP calls relating to Email OTP authentication,
 *              credentials verification (Email or Mobile), resend codes, and password resets.
 */

import axiosInstance from '../api/axiosInstance';

/**
 * Log in using email or mobile and password
 * @param {string} loginId - Email or Mobile number
 * @param {string} password
 * @returns {Promise<object>} The server response containing token and user profile
 */
export const loginUser = async (loginId, password) => {
    const response = await axiosInstance.post('/auth/login', { loginId, password });
    return response.data;
};

/**
 * Register a new user
 * @param {object} regData - Account and optional address fields
 * @returns {Promise<object>} The server response message
 */
export const registerUser = async (regData) => {
    const response = await axiosInstance.post('/auth/register', regData);
    return response.data;
};

/**
 * Resend activation OTP to registered email
 * @param {string} email
 * @returns {Promise<object>} The server response message
 */
export const resendOtp = async (email) => {
    const response = await axiosInstance.post('/auth/resend-otp', { email });
    return response.data;
};

/**
 * Verify account registration via email OTP code
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<object>} The server response containing session keys
 */
export const verifyRegistration = async (email, otp) => {
    const response = await axiosInstance.post('/auth/verify-registration', { email, otp });
    return response.data;
};

/**
 * Trigger forgot password OTP email dispatch
 * @param {string} email
 * @returns {Promise<object>} The server response message
 */
export const forgotPassword = async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
};

/**
 * Reset password using validation OTP
 * @param {string} email
 * @param {string} otp
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {Promise<object>} The server response message
 */
export const resetPassword = async (email, otp, password, confirmPassword) => {
    const response = await axiosInstance.post('/auth/reset-password', { email, otp, password, confirmPassword });
    return response.data;
};

/**
 * Fetch current authenticated user session
 * @returns {Promise<object>} The user session details
 */
export const getMe = async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
};

export default {
    loginUser,
    registerUser,
    resendOtp,
    verifyRegistration,
    forgotPassword,
    resetPassword,
    getMe
};
