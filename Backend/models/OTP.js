/**
 * OTP Model File
 * Location: backend/models/OTP.js
 * Description: Mongoose schema for securely storing OTP codes and temporary signup metadata.
 *              Includes an automatic TTL index that deletes records after 10 minutes (600 seconds).
 */

const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: true
    },
    // Temporarily holds registration details while user completes verification
    tempData: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        streetAddress: String,
        city: String,
        state: String,
        pincode: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Automatic index cleanup by MongoDB after 10 minutes (600 seconds)
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OTP', OTPSchema);
