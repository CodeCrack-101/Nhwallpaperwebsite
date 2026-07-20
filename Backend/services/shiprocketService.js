/**
 * Shiprocket Integration Service
 * Location: backend/services/shiprocketService.js
 * Description: Interacts with the Shiprocket API for authentication, rate calculation,
 *              shipment creation, AWB/tracking generation, and order cancellation.
 *              Includes robust logging and local simulation fallback logic.
 */

const axios = require('axios');

let cachedToken = null;
let tokenExpiry = null;

/**
 * Retrieve a valid Shiprocket JWT Auth Token (cached in memory)
 */
const getShiprocketToken = async () => {
    try {
        if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
            return cachedToken;
        }

        const email = process.env.SHIPROCKET_EMAIL;
        const password = process.env.SHIPROCKET_PASSWORD;

        if (!email || !password) {
            console.warn('[SHIPROCKET SERVICE] Warning: Credentials not set in .env. Operating in SIMULATION mode.');
            return null;
        }

        console.log('[SHIPROCKET SERVICE] Authenticating with Shiprocket...');
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email,
            password
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000
        });

        if (response.data && response.data.token) {
            cachedToken = response.data.token;
            tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;
            return cachedToken;
        }

        throw new Error('Authentication response did not return a token.');
    } catch (error) {
        console.error('[SHIPROCKET AUTH ERROR] Failed to login to Shiprocket API:', error.response?.data || error.message);
        return null;
    }
};

/**
 * Calculate shipping rates, COD fees, and RTO charges
 */
exports.calculateRates = async (deliveryPincode, weight, length, width, height, isCod = false) => {
    const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '110001';
    const token = await getShiprocketToken();

    const pkgWeight = Math.max(weight, 0.1);
    const pkgLength = Math.max(length, 10);
    const pkgWidth = Math.max(width, 10);
    const pkgHeight = Math.max(height, 10);

    if (!token) {
        console.log('[SHIPROCKET SERVICE] Simulation fallback: Calculating mock rates.');
        return getMockRates(isCod);
    }

    try {
        console.log(`[SHIPROCKET SERVICE] Checking courier serviceability from ${pickupPincode} to ${deliveryPincode}...`);
        const response = await axios.get('https://apiv2.shiprocket.in/v1/external/courier/serviceability/', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                pickup_postcode: pickupPincode,
                delivery_postcode: deliveryPincode,
                weight: pkgWeight,
                cod: isCod ? 1 : 0,
                length: pkgLength,
                width: pkgWidth,
                height: pkgHeight
            },
            timeout: 8000
        });

        const data = response.data?.data;
        if (data && data.available_courier_companies && data.available_courier_companies.length > 0) {
            const couriers = data.available_courier_companies;
            let cheapestCourier = couriers[0];

            for (const courier of couriers) {
                if (courier.rate < cheapestCourier.rate) {
                    cheapestCourier = courier;
                }
            }

            const shippingCharge = Math.ceil(cheapestCourier.rate);
            const codCharge = isCod ? Math.ceil(cheapestCourier.cod_charges || 40) : 0;
            const rtoCharge = Math.ceil(cheapestCourier.rto_charges || cheapestCourier.rate || (shippingCharge * 0.8));

            console.log(`[SHIPROCKET SERVICE] Rates resolved via ${cheapestCourier.courier_name}: Shipping: ₹${shippingCharge}, RTO: ₹${rtoCharge}`);
            return {
                success: true,
                shippingCharge,
                rtoCharge,
                codCharge,
                courierName: cheapestCourier.courier_name,
                etd: cheapestCourier.etd || 'Estimated 4-5 business days'
            };
        }

        console.warn('[SHIPROCKET SERVICE] No active courier companies returned serviceability. Applying fallback pricing.');
        return getMockRates(isCod);
    } catch (error) {
        console.error('[SHIPROCKET RATE CALCULATE ERROR] Failed to fetch serviceability:', error.response?.data || error.message);
        return getMockRates(isCod);
    }
};

/**
 * Helper to compute mock rates when Shiprocket API is offline or uncredentialed
 */
const getMockRates = (isCod) => {
    return {
        success: true,
        shippingCharge: 120,
        rtoCharge: 80,
        codCharge: isCod ? 50 : 0,
        courierName: 'Simulated Courier (Shiprocket API Fallback)',
        etd: 'Estimated 3-5 business days'
    };
};

exports.createShipment = async ({ orderNumber, shippingAddress, items, totalWeight, length, width, height, paymentMethod, codAmount, shippingCharge }) => {
    const token = await getShiprocketToken();
    const isCod = paymentMethod === 'COD';

    const pkgWeight = Math.max(totalWeight, 0.1);
    const pkgLength = Math.max(length, 10);
    const pkgWidth = Math.max(width, 10);
    const pkgHeight = Math.max(height, 10);

    if (!token) {
        console.log('[SHIPROCKET SERVICE] Simulation Mode: Generating mock shipment details.');
        return getMockShipmentResponse();
    }

    try {
        console.log(`[SHIPROCKET SERVICE] Dispatching adhoc order to Shiprocket for order ${orderNumber}...`);
        
        const nameParts = shippingAddress.fullName.trim().split(' ');
        const firstName = nameParts[0] || 'Customer';
        const lastName = nameParts.slice(1).join(' ') || ' ';

        const orderItems = items.map((item, idx) => ({
            name: item.name,
            sku: item.productId || `PROD_${idx}`,
            units: item.quantity,
            selling_price: item.price
        }));

        const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const orderBody = {
            order_id: orderNumber,
            order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            pickup_location: 'warehouse',
            billing_customer_name: firstName,
            billing_last_name: lastName,
            billing_address: shippingAddress.address,
            billing_city: shippingAddress.city,
            billing_pincode: shippingAddress.pincode,
            billing_state: shippingAddress.state,
            billing_country: shippingAddress.country || 'India',
            billing_email: shippingAddress.userEmail || 'customer@example.com',
            billing_phone: shippingAddress.mobileNumber,
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: isCod ? 'COD' : 'Prepaid',
            sub_total: subTotal,
            cod_amount: isCod ? codAmount : 0,
            shipping_charges: shippingCharge || 0,
            length: pkgLength,
            breadth: pkgWidth,
            height: pkgHeight,
            weight: pkgWeight
        };

        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', orderBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            timeout: 10000
        });

        const resData = response.data;
        if (resData && resData.shipment_id) {
            const shipmentId = resData.shipment_id.toString();
            const shiprocketOrderId = resData.order_id.toString();
            console.log(`[SHIPROCKET SERVICE] Adhoc order created. Shipment ID: ${shipmentId}, Shiprocket Order ID: ${shiprocketOrderId}. Requesting AWB...`);

            let awbCode = null;
            let trackingId = null;
            let courierCompany = null;
            let trackingUrl = null;

            try {
                const awbResponse = await axios.post('https://apiv2.shiprocket.in/v1/external/courier/assign/awb', {
                    shipment_id: shipmentId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    timeout: 8000
                });

                const awbData = awbResponse.data?.response?.data;
                if (awbData && awbData.awb_code) {
                    awbCode = awbData.awb_code;
                    trackingId = awbData.tracking_id || awbData.awb_code;
                    courierCompany = awbData.courier_name;
                    trackingUrl = awbData.tracking_url;
                    console.log(`[SHIPROCKET SERVICE] AWB Assigned: ${awbCode}, Courier: ${courierCompany}`);
                }
            } catch (awbError) {
                console.error('[SHIPROCKET AWB ERROR] Auto AWB failed:', awbError.response?.data || awbError.message);
            }

            return {
                success: true,
                shiprocketOrderId,
                shipmentId,
                awbCode,
                trackingId,
                courierCompany,
                trackingUrl
            };
        }

        throw new Error('Failed to capture shipment ID from Shiprocket response.');
    } catch (error) {
        const errorData = error.response?.data;
        console.error('[SHIPROCKET SHIPMENT ERROR] Full Shiprocket API Error response:');
        console.error(JSON.stringify(errorData || error.message, null, 2));
        
        return {
            success: false,
            message: errorData?.message || error.message || 'Order creation failed on Shiprocket API.',
            details: errorData
        };
    }
};

const getMockShipmentResponse = () => {
    const mockId = Math.floor(1000000 + Math.random() * 9000000);
    const mockAwb = 'SR' + Math.floor(1000000000 + Math.random() * 9000000000);
    return {
        success: true,
        shiprocketOrderId: mockId.toString(),
        shipmentId: mockId.toString(),
        awbCode: mockAwb,
        trackingId: mockAwb
    };
};

/**
 * Cancel order shipment in Shiprocket
 */
exports.cancelOrder = async (shiprocketOrderId) => {
    const token = await getShiprocketToken();
    if (!token || !shiprocketOrderId) {
        console.log('[SHIPROCKET SERVICE] Simulation Mode: Shiprocket order cancellation mock success.');
        return { success: true };
    }

    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/cancel', {
            ids: [ parseInt(shiprocketOrderId) ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            timeout: 8000
        });

        if (response.data && response.data.status_code === 200) {
            console.log(`[SHIPROCKET SERVICE] Order ${shiprocketOrderId} cancelled successfully.`);
            return { success: true };
        }

        throw new Error(response.data?.message || 'Failed to cancel order in Shiprocket.');
    } catch (error) {
        console.error('[SHIPROCKET CANCEL ERROR] Shiprocket cancel failed:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};
