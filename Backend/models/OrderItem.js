/**
 * OrderItem Model File
 * Location: backend/models/OrderItem.js
 * Description: Mongoose schema representing individual line items inside a client purchase order.
 */

const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product: {
        type: String, // String Custom ID ref E.g. 'soho-1'
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
