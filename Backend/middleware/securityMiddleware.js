/**
 * Security Middleware Configuration File
 * Location: backend/middleware/securityMiddleware.js
 * Description: Sets up standard security protections: CORS, Helmet headers,
 *              NoSQL Query injection sanitization, and route Rate-limiting.
 *              Includes Express 5 compatibility workarounds for req.query write properties.
 */

const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

/**
 * Configure standard security middleware onto an Express App instance
 * @param {object} app - The Express application instance
 */
const configureSecurity = (app) => {
    // 1. Helmet: Secure HTTP Headers
    app.use(helmet({
        contentSecurityPolicy: false, // Turn off CSP constraints in dev if assets are loaded externally
        crossOriginEmbedderPolicy: false
    }));

    // 2. CORS (Cross-Origin Resource Sharing)
    app.use(cors({
        origin: process.env.CLIENT_URL || '*', // Specify exact client domain in production
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));

    // Express 5 req.query write workaround:
    // Express 5 defines req.query as a read-only getter. express-mongo-sanitize attempts to
    // overwrite req.query, which throws a TypeError. This middleware redefines req.query to
    // be writable and configurable to ensure complete compatibility.
    app.use((req, res, next) => {
        if (req.query) {
            const originalQuery = req.query;
            Object.defineProperty(req, 'query', {
                value: { ...originalQuery },
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
        next();
    });

    // 3. Prevent NoSQL Injection: Sanitize body, query, and params of MongoDB operators
    app.use(mongoSanitize());

    // 4. Rate Limiting: General requests limit
    const generalLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5000, // Increased for development testing to avoid agent/user blockages
        message: {
            success: false,
            message: 'Too many requests from this IP. Please try again after 15 minutes.'
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    app.use('/api/', generalLimiter);
};

// 5. OTP-specific Rate Limiter: Extra protection for sending OTPs (prevent SMS spam billing)
const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes window
    max: 5, // Limit each IP to 5 OTP requests per window
    message: {
        success: false,
        message: 'Too many OTP requests. Please wait 5 minutes before requesting again.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    configureSecurity,
    otpLimiter
};
