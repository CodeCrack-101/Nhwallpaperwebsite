/**
 * Order Routes File
 * Location: backend/routes/orderRoutes.js
 * Description: Registers protected routes for retrieving a user's purchase history.
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Route: Get current user's order history (Protected)
router.get('/my-orders', authMiddleware, orderController.getMyOrders);

module.exports = router;
