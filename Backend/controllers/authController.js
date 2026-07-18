/**
 * Authentication Controller File
 * Location: backend/controllers/authController.js
 * Description: Manages email OTP-based account registration, activations,
 *              resend codes, credentials verification (Email or Mobile), and resets.
 */

const User = require('../models/User');
const Address = require('../models/Address');
const Order = require('../models/Order');
const { sendOtpEmail, sendResetOtpEmail } = require('../services/emailService');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Regex patterns
const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian 10-digit mobile number
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Min 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

// Seeding orders helper
const seedSampleOrders = async (userId, addressId) => {
    try {
        const mockOrders = [
            {
                orderNumber: `ORD-${Date.now()}-101`,
                user: userId,
                products: [
                    {
                        name: "Luxury Celestial Nebula Wallpaper",
                        productImage: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=400",
                        quantity: 2,
                        price: 1499
                    },
                    {
                        name: "Metallic Abstract Geometric Wall Decor",
                        productImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400",
                        quantity: 1,
                        price: 2499
                    }
                ],
                totalAmount: 5497,
                paymentStatus: "Paid",
                orderStatus: "Delivered",
                deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                shippingAddress: addressId
            },
            {
                orderNumber: `ORD-${Date.now()}-102`,
                user: userId,
                products: [
                    {
                        name: "Tropical Botanica Living Room Wallpaper",
                        productImage: "https://images.unsplash.com/photo-1533038590840-1cde6e6e40dd?q=80&w=400",
                        quantity: 1,
                        price: 1999
                    }
                ],
                totalAmount: 1999,
                paymentStatus: "Pending",
                orderStatus: "Processing",
                orderDate: new Date(),
                shippingAddress: addressId
            }
        ];

        await Order.insertMany(mockOrders);
        console.log(`[SEEDING] Pre-populated 2 sample orders for user ${userId}`);
    } catch (error) {
        console.error(`[SEEDING ERROR] Failed to seed orders for user ${userId}:`, error.message);
    }
};

/**
 * Endpoint: POST /api/auth/register
 * Description: Registers unverified user, generates 6-digit OTP, dispatches to email,
 *              and saves parameters temporarily.
 */
exports.register = async (req, res) => {
    const { name, email, phone, password, confirmPassword, streetAddress, city, state, pincode } = req.body;

    try {
        // Step 1: Input Valids
        if (!name || name.trim().length < 2) {
            return res.status(400).json({ success: false, message: 'Valid name is required (minimum 2 characters).' });
        }
        if (!email || !EMAIL_REGEX.test(email.toLowerCase().trim())) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
        }
        if (!phone || !PHONE_REGEX.test(phone.trim())) {
            return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
        }
        if (!password || !PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match.' });
        }

        const cleanedEmail = email.toLowerCase().trim();
        const cleanedPhone = phone.trim();

        // Step 2: Check duplicates
        const existingEmail = await User.findOne({ email: cleanedEmail });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Email address is already registered. Please Login.' });
        }

        const existingPhone = await User.findOne({ $or: [{ phone: cleanedPhone }, { mobile: cleanedPhone }] });
        if (existingPhone) {
            return res.status(400).json({ success: false, message: 'Mobile number is already registered. Please Login.' });
        }

        // Step 3: Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 4: Generate 6-digit OTP and set expiry (10 minutes)
        const otpCode = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Step 5: Pre-generate user ID and save Address
        const userId = new mongoose.Types.ObjectId();
        let addressId = null;

        if (streetAddress || city || state || pincode) {
            const address = new Address({
                user: userId,
                streetAddress: (streetAddress || "").trim(),
                city: (city || "").trim(),
                state: (state || "").trim(),
                pincode: (pincode || "").trim()
            });
            await address.save();
            addressId = address._id;
        }

        // Create unverified user
        const user = new User({
            _id: userId,
            name: name.trim(),
            email: cleanedEmail,
            phone: cleanedPhone,
            mobile: cleanedPhone, // Populate both fields for query compatibility
            password: hashedPassword,
            address: addressId,
            isVerified: false,
            otp: otpCode,
            otpExpiry
        });
        await user.save();

        if (addressId) {
            // Seed mock orders
            await seedSampleOrders(userId, addressId);
        }

        // Step 6: Dispatch OTP email
        await sendOtpEmail(cleanedEmail, user.name, otpCode);

        return res.status(201).json({
            success: true,
            message: 'Registration successful! A 6-digit OTP has been sent to your email. Please enter it to verify your account.'
        });

    } catch (error) {
        console.error('[REGISTER ERROR] Fail:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to register account.' });
    }
};

/**
 * Endpoint: POST /api/auth/resend-otp
 * Description: Generates new 6-digit OTP and resets expiry to 10 minutes.
 */
exports.resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email address is required.' });
        }

        const cleanedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanedEmail });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Account profile not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Account is already verified. Please Login.' });
        }

        // Generate new OTP and reset expiry to 10 minutes
        const otpCode = crypto.randomInt(100000, 999999).toString();
        user.otp = otpCode;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send Email
        await sendOtpEmail(cleanedEmail, user.name, otpCode);

        return res.status(200).json({
            success: true,
            message: 'A new 6-digit OTP code has been successfully sent to your registered email.'
        });

    } catch (error) {
        console.error('[RESEND OTP ERROR] Fail:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to resend OTP.' });
    }
};

/**
 * Endpoint: POST /api/auth/verify-registration
 * Description: Verifies registration OTP and activates account.
 */
exports.verifyRegistration = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
        }

        const cleanedEmail = email.toLowerCase().trim();
        const cleanedOtp = otp.trim();

        const user = await User.findOne({ email: cleanedEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Account profile not found.' });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Account is already verified. Please Login.' });
        }

        // Validate OTP exists
        if (!user.otp) {
            return res.status(400).json({ success: false, message: 'No active OTP verification session found.' });
        }

        // Validate OTP and Expiry (10 minutes)
        if (user.otp !== cleanedOtp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check your email and try again.' });
        }

        if (Date.now() > user.otpExpiry.getTime()) {
            return res.status(400).json({ success: false, message: 'OTP has expired. Please click Resend OTP.' });
        }

        // Set activation status and clear OTP parameters
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const populatedUser = await User.findById(user._id).populate('address');
        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: 'Account successfully verified!',
            token,
            user: {
                id: populatedUser._id,
                name: populatedUser.name,
                email: populatedUser.email,
                phone: populatedUser.phone,
                address: populatedUser.address,
                profileImage: populatedUser.profileImage,
                joinedAt: populatedUser.joinedAt
            }
        });

    } catch (error) {
        console.error('[VERIFY REGISTER OTP ERROR] Fail:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to verify activation OTP.' });
    }
};

/**
 * Endpoint: POST /api/auth/login
 * Description: Allows log in using Email OR Phone (Mobile) number.
 *              Rejects login if email verification status is incomplete.
 */
exports.login = async (req, res) => {
    const { loginId, password } = req.body;

    try {
        if (!loginId || !password) {
            return res.status(400).json({ success: false, message: 'Please provide both Login ID (Email/Mobile) and Password.' });
        }

        const cleanedLoginId = loginId.trim();

        // Find user by Email OR Mobile fields
        const user = await User.findOne({
            $or: [
                { email: cleanedLoginId.toLowerCase() },
                { phone: cleanedLoginId },
                { mobile: cleanedLoginId }
            ]
        }).populate('address');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials entered.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials entered.' });
        }

        // Enforce verification check (Require EXACT message match)
        if (!user.isVerified) {
            return res.status(401).json({ 
                success: false, 
                unverified: true,
                email: user.email,
                message: 'Please verify your email before logging in.' 
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                profileImage: user.profileImage,
                joinedAt: user.joinedAt
            }
        });

    } catch (error) {
        console.error('[LOGIN ERROR] Fail:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to authenticate.' });
    }
};

/**
 * Endpoint: POST /api/auth/forgot-password
 * Description: Dispatches reset password OTP code to user's registered email.
 */
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email || !EMAIL_REGEX.test(email.toLowerCase().trim())) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
        }

        const cleanedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanedEmail });

        if (!user) {
            // Generic success return to prevent email verification enumeration
            return res.status(200).json({
                success: true,
                message: 'If the email is registered, a 6-digit OTP code has been dispatched to it.'
            });
        }

        // Generate reset OTP (valid 10 minutes)
        const otpCode = crypto.randomInt(100000, 999999).toString();
        user.otp = otpCode;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Dispatch Email
        await sendResetOtpEmail(cleanedEmail, user.name, otpCode);

        return res.status(200).json({
            success: true,
            message: 'If the email is registered, a 6-digit OTP code has been dispatched to it.'
        });

    } catch (error) {
        console.error('[FORGOT PASSWORD ERROR] Fail:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to send reset OTP.' });
    }
};

/**
 * Endpoint: POST /api/auth/reset-password
 * Description: Verifies reset OTP code and updates user password.
 */
exports.resetPassword = async (req, res) => {
    const { email, otp, password, confirmPassword } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP verification code are required.' });
        }
        if (!password || !PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match.' });
        }

        const cleanedEmail = email.toLowerCase().trim();
        const cleanedOtp = otp.trim();

        const user = await User.findOne({ email: cleanedEmail });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User profile not found.' });
        }

        // Verify OTP exists
        if (!user.otp) {
            return res.status(400).json({ success: false, message: 'No active OTP reset session found.' });
        }

        // Verify OTP and Expiry
        if (user.otp !== cleanedOtp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check your email.' });
        }

        if (Date.now() > user.otpExpiry.getTime()) {
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new code.' });
        }

        // Update password and clear temp fields
        user.password = await bcrypt.hash(password, 10);
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully! You can now log in using your new credentials.'
        });

    } catch (error) {
        console.error('[RESET PASSWORD ERROR] Fail:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to reset password.' });
    }
};

/**
 * Endpoint: GET /api/auth/me
 * Description: Validates session token and returns active profile.
 */
exports.getMe = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                address: req.user.address,
                profileImage: req.user.profileImage,
                joinedAt: req.user.joinedAt
            }
        });
    } catch (error) {
        console.error('[GET ME ERROR] Fail:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to validate session.' });
    }
};