/**
 * JWT Utility File
 * Location: backend/utils/jwt.js
 * Description: Helper functions to sign and verify JSON Web Tokens (JWT).
 */

const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {string} userId - The user's ID
 * @returns {string} The signed token
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Session valid for 7 days
    });
};

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {object} The decoded token payload
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken
};
