/**
 * Order Routes File
 * Location: backend/routes/orderRoutes.js
 * Description: Registers protected endpoints for order placement, detail views,
 *              user history, and order cancellation.
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Routes mapping
router.post('/place', orderController.placeOrder);
router.post('/:id/cancel', orderController.cancelOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;
