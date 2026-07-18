/**
 * User Routes File
 * Location: backend/routes/userRoutes.js
 * Description: Registers protected profile routes for retrieving and updating user details.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Route: Get Profile Details (Protected)
router.get('/profile', authMiddleware, userController.getProfile);

// Route: Update Profile Details (Protected)
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
