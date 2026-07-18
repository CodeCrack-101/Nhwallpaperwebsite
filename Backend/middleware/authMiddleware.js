/**
 * Authentication Middleware File
 * Location: backend/middleware/authMiddleware.js
 * Description: Intercepts requests to protected routes. Validates the JWT in the
 *              Authorization header, retrieves the user, and attaches it to req.user.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        let token;

        // Extract token from Authorization header
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
        } else if (authHeader) {
            token = authHeader; // Fallback to raw token if no "Bearer" prefix
        }

        // Return error if token is not present
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. Authorization token is missing.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user associated with the token, populating their address
        const user = await User.findById(decoded.id).populate('address');
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authorization failed. User no longer exists.' 
            });
        }

        // Attach user object to the request
        req.user = user;
        next();
    } catch (error) {
        console.error('[AUTH MIDDLEWARE ERROR] Invalid token verification:', error.message);
        
        // Differentiate token expiration from general invalid token signature
        const message = error.name === 'TokenExpiredError' 
            ? 'Token expired. Please login again.' 
            : 'Token is not valid.';

        return res.status(401).json({ 
            success: false, 
            message 
        });
    }
};
