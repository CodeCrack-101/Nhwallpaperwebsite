/**
 * Auth Routes File
 * Location: backend/routes/authRoutes.js
 * Description: Registers endpoints for email OTP-based account registration, activations,
 *              resend codes, credentials verification (Email or Mobile), and resets.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route: User registration
router.post('/register', authController.register);

// Route: Email OTP activation
router.post('/verify-registration', authController.verifyRegistration);

// Route: Resend activation OTP
router.post('/resend-otp', authController.resendOtp);

// Route: User Login
router.post('/login', authController.login);

// Route: Password reset triggers
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Route: Fetch current session
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;