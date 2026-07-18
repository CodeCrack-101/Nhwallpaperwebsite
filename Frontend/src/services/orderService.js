/**
 * Order API Service File
 * Location: frontend/src/services/orderService.js
 * Description: Abstraction over HTTP calls relating to fetching the client purchase history.
 */

import axiosInstance from '../api/axiosInstance';

/**
 * Fetch list of orders belonging to the logged-in user
 * @returns {Promise<object>} The orders list response
 */
export const getMyOrders = async () => {
    const response = await axiosInstance.get('/orders/my-orders');
    return response.data;
};

export default {
    getMyOrders
};
