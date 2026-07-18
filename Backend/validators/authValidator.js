/**
 * Input Validator Middleware File
 * Location: backend/validators/authValidator.js
 * Description: Client data validators using clean Javascript logic and Regex patterns
 *              to enforce data integrity for phone numbers, email structure, and PIN codes.
 */

// Regex definitions
const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian 10-digit mobile numbers starting with 6-9
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PINCODE_REGEX = /^\d{6}$/; // standard 6-digit Indian Pin codes

/**
 * Validates signup registration request payload
 */
const validateRegisterInput = (req, res, next) => {
    const { name, email, phone, streetAddress, city, state, pincode } = req.body;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Please enter a valid name (minimum 2 characters).' });
    }

    if (!phone || !PHONE_REGEX.test(phone.toString().trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' });
    }

    if (!email || !EMAIL_REGEX.test(email.toLowerCase().trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!streetAddress || streetAddress.trim().length < 5) {
        return res.status(400).json({ success: false, message: 'Please enter a detailed address (minimum 5 characters).' });
    }

    if (!city || city.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'City is required.' });
    }

    if (!state || state.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'State is required.' });
    }

    if (!pincode || !PINCODE_REGEX.test(pincode.toString().trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit pin code.' });
    }

    next();
};

/**
 * Validates login send-otp request payload
 */
const validateLoginInput = (req, res, next) => {
    const { phone } = req.body;

    if (!phone || !PHONE_REGEX.test(phone.toString().trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }

    next();
};

/**
 * Validates verify-otp request payload
 */
const validateVerifyInput = (req, res, next) => {
    const { phone, otp } = req.body;

    if (!phone || !PHONE_REGEX.test(phone.toString().trim())) {
        return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number.' });
    }

    if (!otp || otp.toString().trim().length !== 6) {
        return res.status(400).json({ success: false, message: 'Please provide a valid 6-digit OTP code.' });
    }

    next();
};

module.exports = {
    validateRegisterInput,
    validateLoginInput,
    validateVerifyInput
};
