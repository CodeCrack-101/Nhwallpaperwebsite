/**
 * Reusable Toast Utility File
 * Location: frontend/src/utils/toast.js
 * Description: Exposes helper functions (showSuccess, showError, showInfo, showWarning, showLoading)
 *              with automatic duplicate toast prevention via toastId deduplication.
 *              Provides pre-formatted constants matching project e-commerce specifications.
 */

import { toast } from 'react-toastify';

/**
 * Dispatch success notification if not already active
 * @param {string} message 
 * @param {string} [id] 
 */
export const showSuccess = (message, id) => {
    const toastId = id || message;
    if (toast.isActive(toastId)) return;
    toast.success(message, { toastId });
};

/**
 * Dispatch error notification if not already active
 * @param {string} message 
 * @param {string} [id] 
 */
export const showError = (message, id) => {
    const toastId = id || message;
    if (toast.isActive(toastId)) return;
    toast.error(message, { toastId });
};

/**
 * Dispatch info notification if not already active
 * @param {string} message 
 * @param {string} [id] 
 */
export const showInfo = (message, id) => {
    const toastId = id || message;
    if (toast.isActive(toastId)) return;
    toast.info(message, { toastId });
};

/**
 * Dispatch warning notification if not already active
 * @param {string} message 
 * @param {string} [id] 
 */
export const showWarning = (message, id) => {
    const toastId = id || message;
    if (toast.isActive(toastId)) return;
    toast.warning(message, { toastId });
};

/**
 * Dispatch loading notification
 * @param {string} message 
 * @param {string} [id] 
 */
export const showLoading = (message = 'Loading...', id = 'global-loading-toast') => {
    if (toast.isActive(id)) return id;
    return toast.loading(message, { toastId: id });
};

/**
 * Dismiss active toast by ID
 * @param {string} id 
 */
export const dismissToast = (id) => {
    toast.dismiss(id);
};

// ==========================================
// PRE-FORMATTED E-COMMERCE TOAST HELPERS
// ==========================================

export const authToasts = {
    loginSuccess: (userName) => showSuccess(`Welcome back, ${userName || 'User'}!`, 'login-success'),
    registerSuccess: () => showSuccess('Account created successfully!', 'register-success'),
    logout: () => showInfo('Logged out successfully.', 'logout-toast'),
    invalidLogin: () => showError('Invalid email or password.', 'invalid-login'),
    otpSent: () => showInfo('OTP sent successfully.', 'otp-sent'),
    otpVerified: () => showSuccess('OTP verified.', 'otp-verified'),
    passwordUpdated: () => showSuccess('Password updated successfully.', 'password-updated')
};

export const cartToasts = {
    addToCart: () => showSuccess('Product added to cart.', 'add-to-cart'),
    alreadyInCart: () => showInfo('Product is already in your cart.', 'already-in-cart'),
    removeFromCart: () => showInfo('Product removed from cart.', 'remove-from-cart'),
    cartUpdated: () => showSuccess('Cart updated.', 'cart-updated'),
    cartCleared: () => showInfo('Cart cleared.', 'cart-cleared')
};

export const wishlistToasts = {
    addToWishlist: () => showSuccess('Product added to wishlist.', 'add-to-wishlist'),
    alreadyInWishlist: () => showInfo('Product is already in wishlist.', 'already-in-wishlist'),
    removeFromWishlist: () => showInfo('Product removed from wishlist.', 'remove-from-wishlist'),
    moveToCart: () => showSuccess('Product moved to cart.', 'move-to-cart'),
    moveToWishlist: () => showSuccess('Product moved to wishlist.', 'move-to-wishlist')
};

export const orderToasts = {
    orderPlaced: () => showSuccess('Order placed successfully.', 'order-placed'),
    paymentSuccess: () => showSuccess('Payment successful.', 'payment-success'),
    paymentFailed: () => showError('Payment failed.', 'payment-failed'),
    orderCancelled: () => showWarning('Order cancelled.', 'order-cancelled')
};

export const profileToasts = {
    profileUpdated: () => showSuccess('Profile updated successfully.', 'profile-updated'),
    addressSaved: () => showSuccess('Address saved.', 'address-saved'),
    addressDeleted: () => showInfo('Address deleted.', 'address-deleted')
};

export const productToasts = {
    productAdded: () => showSuccess('Product added.', 'product-added'),
    productUpdated: () => showSuccess('Product updated.', 'product-updated'),
    productDeleted: () => showInfo('Product deleted.', 'product-deleted')
};

export const apiToasts = {
    networkError: () => showError('Network error. Please try again.', 'network-error'),
    serverError: () => showError('Something went wrong.', 'server-error')
};

export const validationToasts = {
    requiredFields: () => showWarning('Please fill all required fields.', 'required-fields'),
    invalidEmail: () => showWarning('Enter a valid email.', 'invalid-email'),
    invalidPhone: () => showWarning('Enter a valid phone number.', 'invalid-phone')
};

export const triggerToast = (message, type = 'info', id) => {
    switch (type) {
        case 'success':
            return showSuccess(message, id);
        case 'error':
            return showError(message, id);
        case 'warning':
            return showWarning(message, id);
        case 'info':
        default:
            return showInfo(message, id);
    }
};

export default {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismissToast,
    triggerToast,
    authToasts,
    cartToasts,
    wishlistToasts,
    orderToasts,
    profileToasts,
    productToasts,
    apiToasts,
    validationToasts
};
