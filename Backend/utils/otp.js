/**
 * OTP Utility File
 * Location: backend/utils/otp.js
 * Description: Helper functions to generate random OTPs and securely hash/verify them using bcryptjs.
 */

const bcrypt = require('bcryptjs');

/**
 * Generate a 6-digit numeric OTP code
 * @returns {string} The 6-digit OTP code
 */
const generateOtpCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Securely hash the OTP code
 * @param {string} otp - The plain text OTP code
 * @returns {Promise<string>} The hashed OTP code
 */
const hashOtp = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(otp, salt);
};

/**
 * Verify a plain text OTP against the hashed OTP in the DB
 * @param {string} plainOtp - The input OTP
 * @param {string} hashedOtp - The stored hashed OTP
 * @returns {Promise<boolean>} Match result
 */
const verifyOtpCode = async (plainOtp, hashedOtp) => {
    return await bcrypt.compare(plainOtp, hashedOtp);
};

module.exports = {
    generateOtpCode,
    hashOtp,
    verifyOtpCode
};
