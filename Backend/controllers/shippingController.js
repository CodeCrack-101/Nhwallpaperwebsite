/**
 * Shipping Controller File
 * Location: backend/controllers/shippingController.js
 * Description: Handles shipping rate calculations via Shiprocket courier serviceability.
 *              Retrieves explicit shipping and RTO charges, returning the full breakdown.
 */

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const shiprocketService = require('../services/shiprocketService');

/**
 * Endpoint: POST /api/shipping/calculate
 * Description: Calculates shipping fees, RTO charges, and returns explicit order totals.
 */
exports.calculateShipping = async (req, res) => {
    const { pincode, paymentMethod } = req.body;

    try {
        if (!pincode) {
            return res.status(400).json({ success: false, message: 'Delivery pincode is required.' });
        }

        // Validate pincode format (6 digits for India)
        const pincodeRegex = /^[1-9][0-9]{5}$/;
        if (!pincodeRegex.test(pincode.toString().trim())) {
            return res.status(400).json({ success: false, message: 'Invalid Indian pincode format.' });
        }

        // Fetch active cart
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Your shopping cart is empty.' });
        }

        // Resolve product weights and dimensions
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

            // Convert and validate package dimension properties
            const weightVal = Number(product.weight);
            const lengthVal = Number(product.length);
            const widthVal = Number(product.width);
            const heightVal = Number(product.height);

            if (!weightVal || !lengthVal || !widthVal || !heightVal) {
                return res.status(400).json({
                    success: false,
                    message: "Product dimensions are incomplete. Please update the product dimensions before checkout."
                });
            }

            const qty = item.quantity;
            itemTotal += Number(product.price) * qty;
            totalWeight += weightVal * qty;

            maxLength = Math.max(maxLength, lengthVal);
            maxWidth = Math.max(maxWidth, widthVal);
            totalHeight += heightVal * qty;
        }

        const finalLength = Number(maxLength);
        const finalWidth = Number(maxWidth);
        const finalHeight = Number(totalHeight);
        const finalWeight = Number(totalWeight);

        // Add debugging logs before the API call
        console.log('[SHIPPING CONTROLLER] Rates request parameters:', {
            weight: finalWeight,
            length: finalLength,
            breadth: finalWidth,
            height: finalHeight
        });

        // Fetch rate details from Shiprocket (using COD enabled flag to check COD availability and rates)
        const isCodCheck = paymentMethod === 'COD';
        const ratesResult = await shiprocketService.calculateRates(
            pincode.toString().trim(),
            totalWeight,
            finalLength,
            finalWidth,
            finalHeight,
            isCodCheck
        );

        if (!ratesResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Failed to calculate shipping charges for the entered pincode.'
            });
        }

        const { shippingCharge, rtoCharge: rawRtoCharge, codCharge, courierName } = ratesResult;

        // For UPI/online payments, do not take RTO charges
        const rtoCharge = paymentMethod === 'COD' ? rawRtoCharge : 0;

        // Determine if COD is available from the courier response
        let isCodAvailable = false;
        if (courierName && !courierName.includes('Simulation Mode') && !courierName.includes('Simulated Courier')) {
            isCodAvailable = true; 
        } else {
            isCodAvailable = true;
        }

        // Calculate Grand Total including Item Total + Shipping Charges + Estimated RTO Charges (which is 0 for UPI)
        const grandTotal = itemTotal + shippingCharge + rtoCharge;

        // Determine prepaid amount collected online vs balance collected on delivery
        const prepaidAmount = paymentMethod === 'COD' ? (shippingCharge + rtoCharge) : grandTotal;
        const codAmount = paymentMethod === 'COD' ? itemTotal : 0;

        return res.status(200).json({
            success: true,
            itemTotal,
            shippingCharge,
            rtoCharge, // Will return 0 for Online, or raw RTO for COD
            grandTotal,
            prepaidAmount,
            codAmount,
            isCodAvailable,
            pincode
        });

    } catch (error) {
        console.error('[SHIPPING CALCULATE ERROR] Internal error:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to calculate shipping fees.' });
    }
};
