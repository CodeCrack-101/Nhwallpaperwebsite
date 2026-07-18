/**
 * OTP Model File
 * Location: backend/models/OTP.js
 * Description: Mongoose schema for securely storing OTP codes and temporary signup metadata.
 *              Includes an automatic TTL index that deletes records after 5 minutes.
 */

const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    // Temporarily holds registration details while user completes verification
    tempData: {
        name: String,
        email: String,
        streetAddress: String,
        city: String,
        state: String,
        pincode: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Automatic index cleanup by MongoDB after 5 minutes (300 seconds)
    }
});

module.exports = mongoose.model('OTP', OTPSchema);
