/**
 * Shipping Routes File
 * Location: backend/routes/shippingRoutes.js
 * Description: Registers protected endpoints for shipping rate calculations.
 */

const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all shipping routes
router.use(authMiddleware);

// POST /api/shipping/calculate
router.post('/calculate', shippingController.calculateShipping);

module.exports = router;
