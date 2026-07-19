/**
 * Cart Routes File
 * Location: backend/routes/cartRoutes.js
 * Description: Registers endpoints for user-specific shopping cart actions.
 *              All routes are protected by authMiddleware.
 */

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with JWT check
router.use(authMiddleware);

// Routes mapping
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:productId', cartController.updateQuantity);
router.delete('/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;
