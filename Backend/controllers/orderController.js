/**
 * Order Controller File
 * Location: backend/controllers/orderController.js
 * Description: Manages checkout order placement, inventory updates,
 *              Shiprocket shipment creation, order history retrieval, and cancellations.
 *              Uses the explicit calculation logic: Grand Total = Item Total + Shipping + RTO.
 */

const crypto = require('crypto');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const ShippingAddress = require('../models/ShippingAddress');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const shiprocketService = require('../services/shiprocketService');

/**
 * Format order document for frontend compatibility
 */
const formatOrderForFrontend = (order) => {
    if (!order) return null;
    const orderObj = typeof order.toObject === 'function' ? order.toObject() : order;
    
    orderObj.products = (order.items || []).map(item => {
        const prod = item.product;
        return {
            name: item.name,
            productImage: (prod && typeof prod === 'object' ? prod.img : null) || '',
            price: item.price,
            quantity: item.quantity
        };
    });

    orderObj.totalAmount = order.grandTotal || order.itemTotal;
    return orderObj;
};

/**
 * Endpoint: POST /api/order/place
 * Description: Places the order. Validates payment choice (UPI vs COD), resolves items,
 *              subtracts stock, calculates rates, registers the order in MongoDB,
 *              dispatches to Shiprocket, and flushes cart.
 */
exports.placeOrder = async (req, res) => {
    const { paymentMethod, shippingAddress, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    try {
        if (!paymentMethod || !['Online', 'COD'].includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: 'Valid payment method (Online or COD) is required.' });
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.mobileNumber || 
            !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
            return res.status(400).json({ success: false, message: 'Complete shipping address details are required.' });
        }

        if (!razorpayPaymentId || !razorpayOrderId) {
            return res.status(400).json({ success: false, message: 'Razorpay payment ID and order ID are required.' });
        }

        // Fetch active cart items
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

        const resolvedProducts = [];

        for (const item of cart.items) {
            const product = await Product.findOrCreate(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product ${item.productId} not found.` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Insufficient stock for product: ${product.name}.` 
                });
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

            resolvedProducts.push({
                product,
                quantity: item.quantity
            });

            itemTotal += Number(product.price) * item.quantity;
            totalWeight += weightVal * item.quantity;
            
            maxLength = Math.max(maxLength, lengthVal);
            maxWidth = Math.max(maxWidth, widthVal);
            totalHeight += heightVal * item.quantity;
        }

        const finalLength = Number(maxLength);
        const finalWidth = Number(maxWidth);
        const finalHeight = Number(totalHeight);
        const finalWeight = Number(totalWeight);

        // Add debugging logs before the API call
        console.log('[ORDER CONTROLLER] Order rates request parameters:', {
            weight: finalWeight,
            length: finalLength,
            breadth: finalWidth,
            height: finalHeight
        });

        // Fetch calculations from Shiprocket courier service
        const ratesResult = await shiprocketService.calculateRates(
            shippingAddress.pincode.toString().trim(),
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

        // For UPI/online payments, do not take RTO charges
        const rtoCharge = paymentMethod === 'COD' ? rawRtoCharge : 0;

        // Calculate Grand Total: Item Total + Shipping Charges + Estimated RTO Charges (which is 0 for UPI)
        const grandTotal = itemTotal + shippingCharge + rtoCharge;

        // Determine prepaid amount collected online vs balance collected on delivery
        const prepaidAmount = paymentMethod === 'COD' ? (shippingCharge + rtoCharge) : grandTotal;
        const codBalance = paymentMethod === 'COD' ? itemTotal : 0;

        // ------------------ PAYMENTS VERIFICATION ------------------
        let paymentRecord = null;
        let paymentStatus = 'Pending';

        if (razorpayOrderId.startsWith('order_sim_')) {
            // Simulated Success Verification
            paymentRecord = await Payment.findOne({ transactionId: razorpayPaymentId });
            if (!paymentRecord) {
                paymentRecord = new Payment({
                    transactionId: razorpayPaymentId,
                    amount: prepaidAmount,
                    method: paymentMethod,
                    status: 'Success'
                });
                await paymentRecord.save();
            }
        } else {
            // Cryptographic signature check for production Razorpay payments
            const generatedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(razorpayOrderId + '|' + razorpayPaymentId)
                .digest('hex');

            const isSignatureValid = generatedSignature === razorpaySignature;
            if (!isSignatureValid) {
                return res.status(400).json({ success: false, message: 'Cryptographic signature mismatch.' });
            }

            paymentRecord = await Payment.findOne({ transactionId: razorpayPaymentId });
            if (!paymentRecord) {
                paymentRecord = new Payment({
                    transactionId: razorpayPaymentId,
                    amount: prepaidAmount,
                    method: paymentMethod,
                    status: 'Success'
                });
                await paymentRecord.save();
            }
        }

        // Check if transaction has already been processed/assigned
        const existingOrder = await Order.findOne({ payment: paymentRecord._id });
        if (existingOrder) {
            return res.status(400).json({ success: false, message: 'An order has already been registered with this transaction.' });
        }

        // Online is fully paid (Paid), COD is prepaid for shipping/RTO only (Partial Paid)
        paymentStatus = paymentMethod === 'Online' ? 'Paid' : 'Partial Paid';
        const codAmount = paymentMethod === 'COD' ? itemTotal : 0;

        // Save Shipping Address
        const savedAddress = new ShippingAddress({
            user: req.user._id,
            fullName: shippingAddress.fullName.trim(),
            mobileNumber: shippingAddress.mobileNumber.trim(),
            address: shippingAddress.address.trim(),
            city: shippingAddress.city.trim(),
            state: shippingAddress.state.trim(),
            country: shippingAddress.country || 'India',
            pincode: shippingAddress.pincode.toString().trim()
        });
        await savedAddress.save();

        const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${uniqueSuffix}`;

        // Create Order document in MongoDB
        const order = new Order({
            orderNumber,
            user: req.user._id,
            shippingAddress: savedAddress._id,
            payment: paymentRecord ? paymentRecord._id : null,
            itemTotal,
            shippingCharge,
            rtoCharge, // Explicit RTO saved
            grandTotal,
            prepaidAmount,
            codAmount,
            paymentStatus,
            paymentMethod,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            orderStatus: 'Processing'
        });

        // Save items and reduce catalog inventory stock
        const orderItemIds = [];
        const itemsForShiprocket = [];

        for (const resolved of resolvedProducts) {
            const { product, quantity } = resolved;

            const orderItem = new OrderItem({
                order: order._id,
                product: product._id,
                name: product.name,
                price: product.price,
                quantity
            });

            await orderItem.save();
            orderItemIds.push(orderItem._id);
            itemsForShiprocket.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity
            });

            product.stock = Math.max(0, product.stock - quantity);
            await product.save();
        }

        order.items = orderItemIds;
        await order.save();

        if (paymentRecord) {
            paymentRecord.order = order._id;
            await paymentRecord.save();
        }

        // Dispatch Order Shipment to Shiprocket
        const userEmail = req.user.email || 'customer@example.com';
        const addressWithEmail = {
            ...savedAddress.toObject(),
            userEmail
        };

        const shipmentResult = await shiprocketService.createShipment({
            orderNumber,
            shippingAddress: addressWithEmail,
            items: itemsForShiprocket,
            totalWeight,
            length: finalLength,
            width: finalWidth,
            height: finalHeight,
            paymentMethod,
            codAmount: codAmount, // Collect only the remaining item price balance at the doorstep!
            shippingCharge
        });

        if (shipmentResult.success) {
            order.shiprocketOrderId = shipmentResult.shiprocketOrderId;
            order.shipmentId = shipmentResult.shipmentId;
            order.awbCode = shipmentResult.awbCode;
            order.trackingId = shipmentResult.trackingId;
            order.courierCompany = shipmentResult.courierCompany;
            order.trackingUrl = shipmentResult.trackingUrl;
            await order.save();
            console.log(`[ORDER CONTROLLER] Shiprocket Shipment Saved. ID: ${order.shipmentId}`);
        } else {
            console.warn(`[ORDER CONTROLLER] Shiprocket Shipment sync failed: ${shipmentResult.message}`);
        }

        cart.items = [];
        await cart.save();

        const populatedOrder = await Order.findById(order._id)
            .populate('shippingAddress')
            .populate('payment')
            .populate({
                path: 'items',
                populate: { path: 'product' }
            });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully.',
            order: formatOrderForFrontend(populatedOrder)
        });

    } catch (error) {
        console.error('[PLACE ORDER ERROR] Failed to place order:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to process order placement.' });
    }
};

/**
 * Endpoint: POST /api/order/:id/cancel
 * Description: Cancels order if within 30 minutes of placement, restores stock, and calls Shiprocket.
 */
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate({
            path: 'items',
            populate: { path: 'product' }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        if (order.orderStatus === 'Cancelled') {
            return res.status(400).json({ success: false, message: 'Order is already cancelled.' });
        }

        const timeDiffMs = Date.now() - order.orderDate.getTime();
        const timeDiffMins = timeDiffMs / (1000 * 60);

        if (timeDiffMins > 30) {
            return res.status(400).json({
                success: false,
                message: 'Orders can only be cancelled within 30 minutes of placement.'
            });
        }

        if (order.shiprocketOrderId) {
            await shiprocketService.cancelOrder(order.shiprocketOrderId);
        }

        for (const item of order.items) {
            if (item.product) {
                const product = await Product.findById(item.product._id);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                    console.log(`[CANCEL ORDER] Restored stock for ${product.name}: +${item.quantity}`);
                }
            }
        }

        order.orderStatus = 'Cancelled';
        order.paymentStatus = 'Failed';
        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate('shippingAddress')
            .populate('payment')
            .populate({
                path: 'items',
                populate: { path: 'product' }
            });

        return res.status(200).json({
            success: true,
            message: 'Order cancelled successfully and catalog stock has been restored.',
            order: formatOrderForFrontend(populatedOrder)
        });

    } catch (error) {
        console.error('[CANCEL ORDER ERROR] Failed to process order cancellation:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to process order cancellation.' });
    }
};

/**
 * Endpoint: GET /api/order/:id
 * Description: Retrieves order details by ID for the logged-in user.
 */
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        })
        .populate('shippingAddress')
        .populate('payment')
        .populate({
            path: 'items',
            populate: { path: 'product' }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        return res.status(200).json({
            success: true,
            order: formatOrderForFrontend(order)
        });
    } catch (error) {
        console.error('[GET ORDER BY ID ERROR] Failed to fetch order details:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to retrieve order details.' });
    }
};

/**
 * Endpoint: GET /api/orders/my-orders
 * Description: Returns list of orders for the currently logged-in user.
 */
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('shippingAddress')
            .populate('payment')
            .populate({
                path: 'items',
                populate: { path: 'product' }
            })
            .sort({ orderDate: -1 });

        const formattedOrders = orders.map(order => formatOrderForFrontend(order));

        return res.status(200).json({
            success: true,
            orders: formattedOrders
        });
    } catch (error) {
        console.error('[GET MY ORDERS ERROR] Fail to fetch user orders:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server failed to retrieve order history.'
        });
    }
};
