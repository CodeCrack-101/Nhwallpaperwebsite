/**
 * Order Model File
 * Location: backend/models/Order.js
 * Description: Mongoose schema representing client orders.
 *              Integrates Shiprocket tracking parameters and Razorpay payment details.
 */

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShippingAddress',
        required: true
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem'
    }],
    
    // Order Totals
    itemTotal: {
        type: Number,
        required: true,
        min: 0
    },
    shippingCharge: {
        type: Number,
        required: true,
        default: 0
    },
    rtoCharge: {
        type: Number,
        required: true,
        default: 0
    },
    codAmount: {
        type: Number,
        required: true,
        default: 0
    },
    prepaidAmount: {
        type: Number,
        required: true,
        default: 0
    },

    // Payment Info
    paymentMethod: {
        type: String,
        enum: ['Online', 'COD'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Partial Paid'],
        default: 'Pending'
    },
    razorpayPaymentId: {
        type: String,
        trim: true
    },
    razorpayOrderId: {
        type: String,
        trim: true
    },
    razorpaySignature: {
        type: String,
        trim: true
    },

    // Shiprocket parameters
    shiprocketOrderId: {
        type: String,
        trim: true
    },
    shipmentId: {
        type: String,
        trim: true
    },
    awbCode: {
        type: String,
        trim: true
    },
    trackingId: {
        type: String,
        trim: true
    },
    courierCompany: {
        type: String,
        trim: true
    },
    trackingUrl: {
        type: String,
        trim: true
    },

    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    
    orderDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
