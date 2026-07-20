/**
 * Payment Routes File
 * Location: backend/routes/paymentRoutes.js
 * Description: Registers protected endpoints for Razorpay order generation and verification.
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all payment routes
router.use(authMiddleware);

// Routes mapping
router.post('/create-order', paymentController.createRazorpayOrder);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
