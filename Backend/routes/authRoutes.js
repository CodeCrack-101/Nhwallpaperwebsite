const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 🌟 Yeh dono routes yahan hone chahiye:
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;