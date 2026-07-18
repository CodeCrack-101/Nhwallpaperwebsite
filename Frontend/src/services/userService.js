/**
 * User API Service File
 * Location: frontend/src/services/userService.js
 * Description: Abstraction over HTTP calls relating to fetching and saving user profile details.
 */

import axiosInstance from '../api/axiosInstance';

/**
 * Fetch active profile details
 * @returns {Promise<object>} Profile details
 */
export const getProfile = async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
};

/**
 * Update user details and shipping address
 * @param {object} profileData - Profile fields (name, email, streetAddress, city, state, pincode)
 * @returns {Promise<object>} Updated profile details
 */
export const updateProfile = async (profileData) => {
    const response = await axiosInstance.put('/users/profile', profileData);
    return response.data;
};

export default {
    getProfile,
    updateProfile
};
