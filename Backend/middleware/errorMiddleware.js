/**
 * Error Handling Middleware File
 * Location: backend/middleware/errorMiddleware.js
 * Description: Universal catch-all handler for async and server-side errors, returning
 *              a structured JSON response instead of HTML templates or stack traces.
 */

/**
 * Handle page not found (404)
 */
const notFound = (req, res, next) => {
    const error = new Error(`Resource Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * Custom error handler for server exceptions
 */
const errorHandler = (err, req, res, next) => {
    // If response status code is 200, default it to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error(`[SERVER ERROR] ${req.method} ${req.url} - Error:`, err.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = {
    notFound,
    errorHandler
};
