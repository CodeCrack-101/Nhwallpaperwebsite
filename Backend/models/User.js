/**
 * User Model File
 * Location: backend/models/User.js
 * Description: Mongoose schema representing registered customers.
 *              Supports email/password credentials, email OTP activation status,
 *              and password reset OTP codes. Includes both 'phone' and 'mobile' fields.
 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        unique: true,
        trim: true,
        sparse: true // Allows multiple documents to have no 'mobile' field without unique conflicts
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address' // Reference to the separate Address model
    },
    isVerified: {
        type: Boolean,
        default: false // Account active only after email OTP verification
    },
    otp: String,
    otpExpiry: Date,
    profileImage: {
        type: String,
        default: ""
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);