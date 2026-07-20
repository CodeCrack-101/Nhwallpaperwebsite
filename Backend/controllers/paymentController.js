/**
 * Payment Controller File
 * Location: backend/controllers/paymentController.js
 * Description: Manages Razorpay order generation and cryptographic signature checks.
 *              Calculates the online payable portion (Grand Total for Online, or Shipping + RTO for COD)
 *              dynamically using Shiprocket serviceability checks.
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const shiprocketService = require('../services/shiprocketService');

// Initialize Razorpay client with credentials from env
const getRazorpayClient = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        console.warn('[PAYMENT CONTROLLER] Warning: Razorpay keys are not configured in .env. Simulator mode fallback.');
        return null;
    }

    return new Razorpay({ key_id, key_secret });
};

/**
 * Endpoint: POST /api/payment/create-order
 * Description: Creates a Razorpay Order ID. Automatically runs Shiprocket rates check
 *              to verify amount to collect online.
 */
exports.createRazorpayOrder = async (req, res) => {
    const { paymentMethod, pincode } = req.body;

    try {
        if (!paymentMethod || !['Online', 'COD'].includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: 'Valid paymentMethod (Online or COD) is required.' });
        }

        if (!pincode) {
            return res.status(400).json({ success: false, message: 'Delivery pincode is required.' });
        }

        // Fetch active cart
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Your shopping cart is empty.' });
        }

        // Calculate package weight and dimensions
        let totalWeight = 0;
        let itemTotal = 0;
        
        let maxLength = 0;
        let maxWidth = 0;
        let totalHeight = 0;

        for (const item of cart.items) {
            const product = await Product.findOrCreate(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product ${item.productId} not found.` });
            }

            const qty = item.quantity;
            itemTotal += product.price * qty;
            totalWeight += (product.weight || 0.5) * qty;

            maxLength = Math.max(maxLength, product.length || 10);
            maxWidth = Math.max(maxWidth, product.width || 10);
            totalHeight += (product.height || 10) * qty;
        }

        const finalLength = Math.max(maxLength, 10);
        const finalWidth = Math.max(maxWidth, 10);
        const finalHeight = Math.max(totalHeight, 10);

        // Fetch rate calculations from Shiprocket (always check COD flag to match serviceability)
        const ratesResult = await shiprocketService.calculateRates(
            pincode.toString().trim(),
            totalWeight,
            finalLength,
            finalWidth,
            finalHeight,
            paymentMethod === 'COD'
        );

        if (!ratesResult.success) {
            return res.status(400).json({ success: false, message: 'Failed to verify shipping rate calculations.' });
        }

        const { shippingCharge, rtoCharge: rawRtoCharge } = ratesResult;

        // If Online, RTO charges are ignored (0). If COD, RTO charges are included.
        const rtoCharge = paymentMethod === 'COD' ? rawRtoCharge : 0;

        // Calculate how much we charge online now:
        // - Online Prepaid: Item Total + Shipping
        // - COD Prepaid: Shipping + RTO
        const onlinePayableAmount = paymentMethod === 'COD' ? (shippingCharge + rtoCharge) : (itemTotal + shippingCharge);

        if (onlinePayableAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Prepaid order amount must be greater than zero.' });
        }

        const razorpay = getRazorpayClient();
        if (!razorpay) {
            // Simulated Gateway Order Response
            const simulatedOrderId = 'order_sim_' + crypto.randomBytes(8).toString('hex');
            return res.status(200).json({
                success: true,
                simulated: true,
                key_id: 'rzp_test_simulated',
                amount: onlinePayableAmount,
                razorpayOrderId: simulatedOrderId
            });
        }

        console.log(`[PAYMENT CONTROLLER] Creating Razorpay Order for ₹${onlinePayableAmount} (${paymentMethod} flow)...`);
        
        const options = {
            amount: Math.round(onlinePayableAmount * 100), // Razorpay expects amount in paise
            currency: process.env.CURRENCY || 'INR',
            receipt: `rcpt_ord_${Date.now()}`
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            simulated: false,
            key_id: process.env.RAZORPAY_KEY_ID,
            amount: onlinePayableAmount,
            razorpayOrderId: razorpayOrder.id
        });

    } catch (error) {
        console.error('[CREATE RAZORPAY ORDER ERROR] Failed:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to generate payment transaction ID.' });
    }
};

/**
 * Endpoint: POST /api/payment/verify
 * Description: Verifies online payment signature and registers it.
 */
exports.verifyPayment = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentMethod } = req.body;

    try {
        if (!razorpayOrderId || !razorpayPaymentId) {
            return res.status(400).json({ success: false, message: 'Missing transaction parameters.' });
        }

        // If simulated, verify directly
        if (razorpayOrderId.startsWith('order_sim_')) {
            console.log('[PAYMENT CONTROLLER] Verified simulated transaction success.');
            const paymentRecord = new Payment({
                transactionId: razorpayPaymentId,
                amount: req.body.amount || 0,
                method: paymentMethod || 'Online',
                status: 'Success'
            });
            await paymentRecord.save();
            return res.status(200).json({ success: true, message: 'Simulated payment verified successfully.' });
        }

        if (!razorpaySignature) {
            return res.status(400).json({ success: false, message: 'Cryptographic signature parameter is required.' });
        }

        // Verify cryptographic signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpayOrderId + '|' + razorpayPaymentId)
            .digest('hex');

        const isSignatureValid = crypto.timingSafeEqual(
            Buffer.from(generatedSignature, 'utf-8'),
            Buffer.from(razorpaySignature, 'utf-8')
        );

        if (!isSignatureValid) {
            console.error('[PAYMENT CONTROLLER] Invalid signature verification attempt.');
            return res.status(400).json({ success: false, message: 'Payment verification signature mismatch.' });
        }

        const razorpay = getRazorpayClient();
        let amountPaid = 0;
        if (razorpay) {
            const orderDetails = await razorpay.orders.fetch(razorpayOrderId);
            amountPaid = orderDetails.amount / 100; // convert paise back to rupees
        }

        // Save successful payment record
        const paymentRecord = new Payment({
            transactionId: razorpayPaymentId,
            amount: amountPaid,
            method: paymentMethod || 'Online',
            status: 'Success'
        });
        await paymentRecord.save();

        console.log(`[PAYMENT CONTROLLER] Payment ${razorpayPaymentId} successfully verified & registered.`);
        return res.status(200).json({
            success: true,
            message: 'Payment verified and registered successfully.',
            paymentId: paymentRecord._id
        });

    } catch (error) {
        console.error('[VERIFY PAYMENT ERROR] Exception:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to verify payment transaction.' });
    }
};
