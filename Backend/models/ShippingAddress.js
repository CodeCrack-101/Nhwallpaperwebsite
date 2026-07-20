/**
 * ShippingAddress Model File
 * Location: backend/models/ShippingAddress.js
 * Description: Mongoose schema representing specific delivery address records for orders.
 */

const mongoose = require('mongoose');

const ShippingAddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        default: 'India',
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ShippingAddress', ShippingAddressSchema);
