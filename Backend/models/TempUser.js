const mongoose = require('mongoose');

const TempUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    phone: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: 300 } // 5 mins expiration
});

module.exports = mongoose.model('TempUser', TempUserSchema);