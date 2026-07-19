/**
 * Wishlist Routes File
 * Location: backend/routes/wishlistRoutes.js
 * Description: Registers endpoints for user-specific wishlist actions.
 *              All routes are protected by authMiddleware.
 */

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with JWT check
router.use(authMiddleware);

// Routes mapping
router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;
