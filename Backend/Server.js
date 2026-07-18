/**
 * Main Backend Server Entry File
 * Location: backend/server.js
 * Description: Sets up the Express server, applies security configurations,
 *              mounts authentication, user profile, and order routers,
 *              and manages MongoDB Atlas connection initialization.
 */

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { configureSecurity } = require('./middleware/securityMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize database connection
connectDB();

const app = express();

// Configure body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Helmet, CORS, NoSQL sanitization and Rate Limiting
configureSecurity(app);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Base route for API status verification
app.get('/api/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'MERN eCommerce Backend API is online and fully secured.',
        timestamp: new Date()
    });
});

// Error handling middleware integration
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[SERVER] Production ready server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});