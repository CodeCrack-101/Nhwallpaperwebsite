/**
 * Diagnostics Script for Cart
 * Location: backend/scratch/testCart.js
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Import User model (let's check the schema path)
const User = require('../models/User');

const runDiagnostics = async () => {
    try {
        console.log('[DIAGNOSTICS] Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('[DIAGNOSTICS] Connected to database.');

        // Get the first user
        const user = await User.findOne({});
        if (!user) {
            console.error('[DIAGNOSTICS] No users found in database. Please register a user first.');
            process.exit(1);
        }

        console.log(`[DIAGNOSTICS] Found test user: ${user.email} (ID: ${user._id})`);

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('[DIAGNOSTICS] Generated JWT Token.');

        // Test GET /api/cart
        console.log('[DIAGNOSTICS] Sending GET /api/cart request...');
        const getRes = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('[DIAGNOSTICS] GET Cart Response:', getRes.data);

        // Test POST /api/cart (Add Soho Classic Ergonomic Chair)
        console.log('[DIAGNOSTICS] Sending POST /api/cart request...');
        const postRes = await axios.post('http://localhost:5000/api/cart', {
            productId: 'soho-1',
            name: 'Soho Classic Ergonomic Chair',
            price: 999,
            productImage: '/assets/SOHO/soho60.png',
            category: 'SOHO',
            quantity: 1
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('[DIAGNOSTICS] POST Cart Response:', postRes.data);

        process.exit(0);
    } catch (error) {
        console.error('[DIAGNOSTICS ERROR]', error.response?.data || error.message);
        process.exit(1);
    }
};

runDiagnostics();
