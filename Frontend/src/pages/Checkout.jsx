/**
 * Checkout Page Component File
 * Location: frontend/src/pages/Checkout.jsx
 * Description: Production-ready checkout page with Razorpay payment gateway integration
 *              and Cash on Delivery (COD) partial-prepayment options.
 *              Integrates with Shiprocket serviceability, dynamic recalculation on input changes,
 *              explicit RTO calculations, and secure backend verification.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axiosInstance from '../api/axiosInstance';
import { orderToasts, showError } from '../utils/toast';
import {
    FiMapPin,
    FiCreditCard,
    FiCheckCircle,
    FiArrowLeft,
    FiShoppingBag
} from 'react-icons/fi';
import ButtonLoader from '../components/common/ButtonLoader';
import SectionLoader from '../components/common/SectionLoader';
import './Checkout.css';

// Helper to load the external Razorpay checkout script dynamically
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Checkout = () => {
    const { user } = useAuth();
    const { cart, clearCart, triggerToast } = useCart();
    const navigate = useNavigate();

    // Steps: 1 (Checkout Form), 2 (Success Screen)
    const [step, setStep] = useState(1);

    // Form Address State
    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        mobileNumber: user?.mobile || user?.phone || '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: ''
    });

    // Chosen payment method: 'Online' or 'COD'
    const [paymentMethod, setPaymentMethod] = useState('Online');

    // Calculations state resolved from backend Shiprocket check
    const [shippingRates, setShippingRates] = useState(null);
    const [calculating, setCalculating] = useState(false);
    const [calculationError, setCalculationError] = useState(null);

    // Simulated Gateway Modal States (Fallback mode when no real API keys are configured)
    const [simulatedModalOpen, setSimulatedModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [razorpayOrderId, setRazorpayOrderId] = useState('');
    const [simulatedPaymentId, setSimulatedPaymentId] = useState('');

    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    // Completed Order State
    const [placedOrder, setPlacedOrder] = useState(null);

    // If cart is empty and we are not in the Success step, redirect back to cart page
    useEffect(() => {
        if (cart.length === 0 && step !== 2) {
            triggerToast('Your cart is empty. Please add products before checking out.', 'error');
            navigate('/cart');
        }
    }, [cart, step, navigate, triggerToast]);

    // Recalculate shipping rates automatically whenever address, pincode or payment method changes
    useEffect(() => {
        const pinStr = shippingAddress.pincode.toString().trim();
        const addrStr = shippingAddress.address.trim();

        // Auto-trigger rate lookup only when PIN Code has exactly 6 digits and address has at least 5 characters
        if (pinStr.length === 6 && addrStr.length >= 5) {
            calculateShippingCost();
        } else {
            setShippingRates(null);
        }
    }, [shippingAddress.pincode, shippingAddress.address, paymentMethod]);

    // Handle Address Input Changes
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Calculate rates via backend
    const calculateShippingCost = async () => {
        const pinStr = shippingAddress.pincode.toString().trim();

        const pincodeRegex = /^[1-9][0-9]{5}$/;
        if (!pincodeRegex.test(pinStr)) {
            return;
        }

        setCalculating(true);
        setCalculationError(null);

        try {
            const response = await axiosInstance.post('/shipping/calculate', {
                pincode: pinStr,
                paymentMethod
            });

            if (response.data && response.data.success) {
                setShippingRates(response.data);

                // If user selected COD but Shiprocket returns that COD is unavailable,
                // automatically reset to Online and inform the user
                if (!response.data.isCodAvailable && paymentMethod === 'COD') {
                    setPaymentMethod('Online');
                    triggerToast('Cash on Delivery is not available for this location. Payment method updated to Online.', 'warning');
                }
            } else {
                setShippingRates(null);
                setCalculationError('Failed to fetch shipping charges.');
            }
        } catch (error) {
            console.error('[SHIPPING CALCULATION ERROR]', error);
            setShippingRates(null);
            setCalculationError(error.response?.data?.message || 'Error communicating with courier rate server.');
        } finally {
            setCalculating(false);
        }
    };

    // Validate complete shipping address before final submission
    const validateAddressForm = () => {
        if (!shippingAddress.fullName.trim()) {
            triggerToast('Please enter full name.', 'error');
            return false;
        }
        if (!shippingAddress.mobileNumber.trim()) {
            triggerToast('Please enter mobile number.', 'error');
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(shippingAddress.mobileNumber.replace(/[\s-]/g, ''))) {
            triggerToast('Please enter a valid 10-digit mobile number.', 'error');
            return false;
        }

        if (!shippingAddress.address.trim()) {
            triggerToast('Please enter street address.', 'error');
            return false;
        }
        if (!shippingAddress.city.trim()) {
            triggerToast('Please enter city name.', 'error');
            return false;
        }
        if (!shippingAddress.state.trim()) {
            triggerToast('Please enter state name.', 'error');
            return false;
        }

        const pincodeRegex = /^[1-9][0-9]{5}$/;
        if (!pincodeRegex.test(shippingAddress.pincode.toString().trim())) {
            triggerToast('Please enter a valid 6-digit Indian PIN code.', 'error');
            return false;
        }

        if (!shippingRates) {
            triggerToast('Please wait for shipping rate calculation to load.', 'error');
            return false;
        }

        return true;
    };

    // Main checkout payment initiator
    const handlePlaceOrderSubmit = async () => {
        if (!validateAddressForm()) return;

        setPaymentError(null);
        setPaymentProcessing(true);
        triggerToast('Initializing payment gateway...', 'info');

        try {
            // Load Razorpay script dynamically
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                triggerToast('Failed to load Razorpay SDK. Please check your internet connection.', 'error');
                setPaymentProcessing(false);
                return;
            }

            // Create Razorpay Order in backend
            const initRes = await axiosInstance.post('/payment/create-order', {
                paymentMethod,
                pincode: shippingAddress.pincode
            });

            if (!initRes.data || !initRes.data.success) {
                setPaymentError('Failed to initialize payment gateway order ID.');
                setPaymentProcessing(false);
                return;
            }

            const { amount, key_id, simulated } = initRes.data;
            const rzpOrderId = initRes.data.razorpayOrderId;

            if (simulated) {
                // If backend keys are not set, fallback to simulated testing dialog UI
                setRazorpayOrderId(rzpOrderId);
                setPaymentAmount(amount);
                setSimulatedPaymentId('pay_sim_' + Math.random().toString(36).substring(2, 10));
                setSimulatedModalOpen(true);
                setPaymentProcessing(false);
            } else {
                // Launch official Razorpay payment widget modal
                const options = {
                    key: key_id,
                    amount: Math.round(amount * 100), // convert rupees back to paise for Razorpay
                    currency: 'INR',
                    name: 'NH WALLPAPER',
                    description: paymentMethod === 'COD' ? 'Prepay Shipping + RTO charges' : 'Prepay Grand Total',
                    order_id: rzpOrderId,
                    handler: async function (response) {
                        await finalizeOrderRegistration({
                            razorpayOrderId: rzpOrderId,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });
                    },
                    prefill: {
                        name: shippingAddress.fullName,
                        contact: shippingAddress.mobileNumber
                    },
                    theme: {
                        color: '#C89B5B'
                    },
                    modal: {
                        ondismiss: function () {
                            orderToasts.orderCancelled();
                            setPaymentProcessing(false);
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            }

        } catch (error) {
            console.error('[GATEWAY INITIALIZATION ERROR]', error);
            setPaymentError(error.response?.data?.message || 'Error communicating with checkout payment servers.');
            orderToasts.paymentFailed();
            setPaymentProcessing(false);
        }
    };

    // Finalize order placement via backend signature verification
    const finalizeOrderRegistration = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
        setPaymentProcessing(true);
        setPaymentError(null);

        try {
            // First call verify endpoint to save payment record
            await axiosInstance.post('/payment/verify', {
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
                paymentMethod,
                amount: shippingRates.prepaidAmount
            });

            orderToasts.paymentSuccess();

            // Call placeOrder to create Order and dispatch Shipment
            const placeRes = await axiosInstance.post('/order/place', {
                paymentMethod,
                shippingAddress,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
            });

            if (placeRes.data && placeRes.data.success) {
                setPlacedOrder(placeRes.data.order);
                setSimulatedModalOpen(false);
                await clearCart(false);
                setStep(2);
                orderToasts.orderPlaced();
            } else {
                setPaymentError('Failed to complete order registration.');
                orderToasts.paymentFailed();
            }
        } catch (error) {
            console.error('[ORDER REGISTRATION ERROR]', error);
            setPaymentError(error.response?.data?.message || 'Database error occurred during order dispatch.');
            orderToasts.paymentFailed();
        } finally {
            setPaymentProcessing(false);
        }
    };

    // Simulated payment buttons success trigger
    const simulatePaymentSuccess = async () => {
        setPaymentProcessing(true);
        await finalizeOrderRegistration({
            razorpayOrderId,
            razorpayPaymentId: simulatedPaymentId,
            razorpaySignature: 'sig_sim_' + Math.random().toString(36).substring(2, 12)
        });
    };

    // Simulated payment failure trigger
    const simulatePaymentFailure = () => {
        setSimulatedModalOpen(false);
        triggerToast('Simulated payment transaction failed. Cart is preserved.', 'error');
        setPaymentError('Prepayment failed. Please verify credentials and try again.');
    };

    return (
        <div className="checkout-page-container">
            <h1 className="checkout-title">Secure <span>Checkout</span></h1>

            {step === 1 ? (
                <div className="checkout-two-columns">
                    {/* Left Column: Form Address and Payment Selection */}
                    <div className="checkout-form-column">
                        <div className="checkout-card">
                            <h2 className="checkout-card-title"><FiMapPin style={{ marginRight: '8px' }} /> Shipping Address</h2>

                            <div className="form-grid-2">
                                <div className="checkout-form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        required
                                        placeholder="Enter your full name"
                                        value={shippingAddress.fullName}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                                <div className="checkout-form-group">
                                    <label htmlFor="mobileNumber">Mobile Number</label>
                                    <input
                                        type="tel"
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        required
                                        placeholder="10-digit mobile number"
                                        value={shippingAddress.mobileNumber}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                            </div>

                            <div className="checkout-form-group">
                                <label htmlFor="address">Street Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    required
                                    placeholder="Flat/House No, Colony, Street details (Min 5 chars to trigger rates)"
                                    value={shippingAddress.address}
                                    onChange={handleAddressChange}
                                />
                            </div>

                            <div className="form-grid-2">
                                <div className="checkout-form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        required
                                        placeholder="City/Town"
                                        value={shippingAddress.city}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                                <div className="checkout-form-group">
                                    <label htmlFor="state">State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        required
                                        placeholder="State"
                                        value={shippingAddress.state}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div className="checkout-form-group">
                                    <label htmlFor="pincode">PIN Code</label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        required
                                        maxLength="6"
                                        placeholder="6-digit Indian PIN code"
                                        value={shippingAddress.pincode}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                                <div className="checkout-form-group">
                                    <label htmlFor="country">Country</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        disabled
                                        value={shippingAddress.country}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Selection */}
                        <div className="checkout-card">
                            <h2 className="checkout-card-title"><FiCreditCard style={{ marginRight: '8px' }} /> Select Payment Method</h2>

                            <div className="payment-methods-grid">
                                {/* ONLINE OPTION */}
                                <div
                                    className={`payment-method-card ${paymentMethod === 'Online' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('Online')}
                                >
                                    <div className="method-radio"></div>
                                    <div className="method-details">
                                        <h4>Online Payment (Razorpay)</h4>
                                        <p>Pay entire total securely online. Excludes Estimated RTO Charges.</p>
                                    </div>
                                </div>

                                {/* COD OPTION */}
                                <div
                                    className={`payment-method-card ${paymentMethod === 'COD' ? 'selected' : ''} ${shippingRates && !shippingRates.isCodAvailable ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (shippingRates && !shippingRates.isCodAvailable) return;
                                        setPaymentMethod('COD');
                                    }}
                                >
                                    <div className="method-radio"></div>
                                    <div className="method-details">
                                        <h4>Cash on Delivery (COD)</h4>
                                        <p>Prepay Shipping + RTO charges online. Pay Item MRP at doorstep.</p>
                                        {shippingRates && !shippingRates.isCodAvailable && (
                                            <p style={{ color: '#eb5757', fontWeight: '600', marginTop: '6px', fontSize: '12px' }}>
                                                Cash on Delivery is not available for this location.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Live Order Summary */}
                    <div className="checkout-summary-column">
                        <div className="checkout-card">
                            <h2 className="checkout-card-title"><FiShoppingBag style={{ marginRight: '8px' }} /> Order Summary</h2>

                            {calculating && (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <div className="gateway-spinner" style={{ margin: '0 auto 10px auto', width: '30px', height: '30px' }}></div>
                                    <p style={{ color: '#777', fontSize: '13px' }}>Calculating shipping charges...</p>
                                </div>
                            )}

                            {calculationError && (
                                <div style={{ padding: '15px', backgroundColor: '#fdf2f2', border: '1px solid #f8b4b4', borderRadius: '10px', color: '#c53030', marginBottom: '20px', fontSize: '12px' }}>
                                    {calculationError}
                                </div>
                            )}

                            {paymentError && (
                                <div style={{ padding: '15px', backgroundColor: '#fdf2f2', border: '1px solid #f8b4b4', borderRadius: '10px', color: '#c53030', marginBottom: '20px', fontSize: '12px' }}>
                                    {paymentError}
                                </div>
                            )}

                            {!shippingRates && !calculating && (
                                <div style={{ padding: '20px 0', textAlign: 'center', color: '#888', fontSize: '13px', border: '1px dashed #ddd', borderRadius: '10px' }}>
                                    Please enter your complete address and 6-digit PIN code to view delivery costs and place order.
                                </div>
                            )}

                            {shippingRates && !calculating && (
                                <div>
                                    <table className="summary-table">
                                        <tbody>
                                            <tr>
                                                <td className="label">Item Total</td>
                                                <td className="val">₹{shippingRates.itemTotal.toLocaleString('en-IN')}</td>
                                            </tr>
                                            <tr>
                                                <td className="label">Shipping Charges</td>
                                                <td className="val">₹{shippingRates.shippingCharge.toLocaleString('en-IN')}</td>
                                            </tr>
                                            <tr>
                                                <td className="label">Estimated RTO Charges</td>
                                                <td className="val">₹{shippingRates.rtoCharge.toLocaleString('en-IN')}</td>
                                            </tr>
                                            <tr className="total-row">
                                                <td className="label">Grand Total</td>
                                                <td className="val">₹{shippingRates.grandTotal.toLocaleString('en-IN')}</td>
                                            </tr>
                                            <tr style={{ borderTop: '2px solid #C89B5B', fontWeight: 'bold' }}>
                                                <td className="label" style={{ color: '#C89B5B', paddingTop: '15px' }}>Amount to Pay Online Now</td>
                                                <td className="val" style={{ color: '#C89B5B', paddingTop: '15px' }}>₹{shippingRates.prepaidAmount.toLocaleString('en-IN')}</td>
                                            </tr>
                                            {paymentMethod === 'COD' && (
                                                <tr style={{ fontWeight: 'bold' }}>
                                                    <td className="label" style={{ color: '#27ae60' }}>Balance Collectible on Delivery</td>
                                                    <td className="val" style={{ color: '#27ae60' }}>₹{shippingRates.codAmount.toLocaleString('en-IN')}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                    <div className="checkout-pay-breakdown" style={{ borderLeftColor: paymentMethod === 'COD' ? '#27ae60' : '#C89B5B', marginTop: '20px' }}>
                                        {paymentMethod === 'COD' ? (
                                            <>
                                                <p>Online Prepaid Amount (Shipping + RTO): <strong>₹{shippingRates.prepaidAmount.toLocaleString('en-IN')}</strong></p>
                                                <p style={{ marginTop: '5px' }}>Doorstep COD Balance to Collect: <strong>₹{shippingRates.codAmount.toLocaleString('en-IN')}</strong></p>
                                                <p style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>Please pay the shipping and RTO charges online to confirm order. Balance is collected on delivery.</p>
                                            </>
                                        ) : (
                                            <>
                                                <p>Online Prepaid Amount (Grand Total): <strong>₹{shippingRates.prepaidAmount.toLocaleString('en-IN')}</strong></p>
                                                <p style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>Pay the grand total online. No doorstep charges will apply.</p>
                                            </>
                                        )}
                                    </div>

                                    <ButtonLoader
                                        type="button"
                                        className="btn-primary"
                                        style={{ width: '100%', padding: '15px', justifyContent: 'center', borderRadius: '12px' }}
                                        onClick={handlePlaceOrderSubmit}
                                        loading={paymentProcessing}
                                        color="#ffffff"
                                        size="small"
                                    >
                                        {paymentMethod === 'Online' ? 'Proceed to Online Payment' : 'Pay Charges & Confirm COD'}
                                    </ButtonLoader>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                placedOrder && (
                    <div className="checkout-card success-card">
                        <div className="success-icon-wrap">
                            <FiCheckCircle />
                        </div>
                        <h2 className="success-title">Order Placed Successfully!</h2>
                        <p className="success-desc">
                            Thank you for shopping with us. Your order has been registered, inventory reserved, and shipping initiated via Shiprocket.
                        </p>

                        <div className="success-order-details">
                            <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>Order Details</h4>

                            <div className="success-detail-row">
                                <span className="success-detail-label">Order Number</span>
                                <span className="success-detail-val" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{placedOrder.orderNumber}</span>
                            </div>
                            <div className="success-detail-row">
                                <span className="success-detail-label">Payment Method</span>
                                <span className="success-detail-val">{placedOrder.paymentMethod}</span>
                            </div>
                            <div className="success-detail-row">
                                <span className="success-detail-label">Payment Status</span>
                                <span className="success-detail-val" style={{ color: placedOrder.paymentStatus === 'Paid' ? '#1f7a45' : '#f2994a', fontWeight: 'bold' }}>{placedOrder.paymentStatus}</span>
                            </div>
                            <div className="success-detail-row">
                                <span className="success-detail-label">Prepaid Online Amount</span>
                                <span className="success-detail-val">₹{placedOrder.prepaidAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="success-detail-row">
                                <span className="success-detail-label">Razorpay Payment ID</span>
                                <span className="success-detail-val" style={{ fontFamily: 'monospace' }}>{placedOrder.razorpayPaymentId}</span>
                            </div>
                            {placedOrder.paymentMethod === 'COD' && (
                                <div className="success-detail-row" style={{ backgroundColor: '#f9fbf9', padding: '10px' }}>
                                    <span className="success-detail-label" style={{ color: '#27ae60', fontWeight: 'bold' }}>Doorstep Cash to Collect</span>
                                    <span className="success-detail-val" style={{ color: '#27ae60', fontWeight: 'bold' }}>₹{placedOrder.codAmount.toLocaleString('en-IN')}</span>
                                </div>
                            )}

                            <div className="success-detail-row">
                                <span className="success-detail-label">Shiprocket Shipment ID</span>
                                <span className="success-detail-val">{placedOrder.shipmentId || 'N/A'}</span>
                            </div>

                            <div className="success-detail-row">
                                <span className="success-detail-label">AWB Tracking Code</span>
                                <span className="success-detail-val">
                                    {placedOrder.awbCode ? (
                                        <span className="tracking-pill">{placedOrder.awbCode}</span>
                                    ) : (
                                        <span style={{ color: '#777', fontSize: '12px' }}>Processing AWB Assignment...</span>
                                    )}
                                </span>
                            </div>

                            <div className="success-detail-row">
                                <span className="success-detail-label">Delivery Pincode</span>
                                <span className="success-detail-val">{placedOrder.shippingAddress?.pincode}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <Link to="/orders" className="btn-secondary" style={{ textDecoration: 'none' }}>
                                View Order History
                            </Link>
                            <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )
            )}

            {/* SIMULATED GATEWAY MODAL OVERLAY */}
            {simulatedModalOpen && (
                <div className="payment-gateway-overlay">
                    <div className="payment-gateway-modal">
                        <div className="gateway-header">
                            <div className="gateway-logo">WALL<span>ART</span> PAY</div>
                            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>Simulated Instant Razorpay Payment</div>
                            <div className="gateway-amount">₹{paymentAmount.toLocaleString('en-IN')}</div>
                        </div>

                        <div className="gateway-body">
                            {paymentProcessing ? (
                                <div className="gateway-spinner-wrap">
                                    <div className="gateway-spinner"></div>
                                    <p className="gateway-text">Verifying payment signature and placing order...</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="gateway-text" style={{ marginBottom: '25px' }}>
                                        Complete the prepaid checkout online payment of <strong>₹{paymentAmount.toLocaleString('en-IN')}</strong>.
                                    </p>

                                    <div className="gateway-options-title">Select simulated payment response:</div>

                                    <div className="gateway-options-buttons">
                                        <button
                                            type="button"
                                            className="btn-gateway-success"
                                            onClick={simulatePaymentSuccess}
                                        >
                                            Simulate Successful Payment
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-gateway-fail"
                                            onClick={simulatePaymentFailure}
                                        >
                                            Simulate Failed Payment
                                        </button>
                                    </div>

                                    <div style={{ fontSize: '11px', color: '#999', marginTop: '20px', textAlign: 'center' }}>
                                        Simulated Order ID: <span style={{ fontFamily: 'monospace' }}>{razorpayOrderId}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
